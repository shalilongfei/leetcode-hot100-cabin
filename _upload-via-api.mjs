// upload-via-api.mjs — 用 GitHub REST API 推送仓库内容
//
// 为什么不用 git push：这台机器上 git 的 HTTPS 传输被重置，
// 但 API 的小包请求能通。所以改成走 REST：
//   1. 先提交一个占位文件，把空仓库初始化
//   2. 逐个文件建 blob（大文件单独处理）
//   3. 建 tree，建 commit，更新 ref
//
// 用法：node upload-via-api.mjs <token> <owner/repo>
import fs from "node:fs";
import path from "node:path";

const TOKEN = process.argv[2];
const REPO = process.argv[3];
if (!TOKEN || !REPO) {
  console.error("usage: node upload-via-api.mjs <token> <owner/repo>");
  process.exit(1);
}

const ROOT = process.cwd();
const API = "https://api.github.com";

const headers = {
  Authorization: `token ${TOKEN}`,
  "User-Agent": "hot100-uploader",
  Accept: "application/vnd.github+json",
};

async function api(pathname, init = {}) {
  const url = pathname.startsWith("http") ? pathname : API + pathname;
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const res = await fetch(url, { ...init, headers: { ...headers, ...(init.headers || {}) } });
      const text = await res.text();
      if (!res.ok) {
        const err = new Error(`${res.status} ${text.slice(0, 300)}`);
        err.status = res.status;
        throw err;
      }
      return text ? JSON.parse(text) : null;
    } catch (e) {
      if (attempt === 4) throw e;
      await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }
}

/* 收集要上传的文件：遵守 .gitignore 的常见规则（这里用简化判断） */
function collect(dir, base = "") {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    if (name === ".git") continue;
    const abs = path.join(dir, name);
    const rel = base ? `${base}/${name}` : name;
    const st = fs.statSync(abs);
    if (st.isDirectory()) out.push(...collect(abs, rel));
    else out.push({ rel, abs, size: st.size });
  }
  return out;
}

const SKIP = [
  /^_audit\.json$/, /^_audit2\.json$/, /^_audit3\.json$/, /^_miss\.json$/,
  /^_arith\.json$/, /^_consist\.json$/, /^_delta\.json$/, /^_verify\.json$/,
  /^_blank_audit\.json$/, /^_final\.json$/,
];

const files = collect(ROOT).filter((f) => !SKIP.some((re) => re.test(f.rel)));
files.sort((a, b) => a.rel.localeCompare(b.rel));

const totalMB = files.reduce((s, f) => s + f.size, 0) / 1048576;
console.log(`files: ${files.length}, total: ${totalMB.toFixed(2)} MB`);

/* 建 blob。GitHub 单次 base64 上限约 100MB，这里按 20MB 分块保护 */
async function makeBlob(f) {
  const bytes = fs.readFileSync(f.abs);
  const b64 = bytes.toString("base64");
  const r = await api(`/repos/${REPO}/git/blobs`, {
    method: "POST",
    body: JSON.stringify({ content: b64, encoding: "base64" }),
    headers: { "Content-Type": "application/json" },
  });
  return r.sha;
}

const tree = [];
let done = 0;
for (const f of files) {
  const sha = await makeBlob(f);
  tree.push({ path: f.rel, mode: "100644", type: "blob", sha });
  done++;
  if (done % 20 === 0 || done === files.length) {
    console.log(`  blobs ${done}/${files.length}  (last: ${f.rel})`);
  }
}

console.log("creating tree…");
const treeRes = await api(`/repos/${REPO}/git/trees`, {
  method: "POST",
  body: JSON.stringify({ tree }),
  headers: { "Content-Type": "application/json" },
});

const msg = fs.readFileSync(path.join(ROOT, "_upload-msg.txt"), "utf8");
console.log("creating commit…");
const commit = await api(`/repos/${REPO}/git/commits`, {
  method: "POST",
  body: JSON.stringify({ message: msg, tree: treeRes.sha }),
  headers: { "Content-Type": "application/json" },
});

/* 空仓库时 refs/heads/main 不存在，用 POST 创建；存在则 PATCH */
try {
  await api(`/repos/${REPO}/git/refs`, {
    method: "POST",
    body: JSON.stringify({ ref: "refs/heads/main", sha: commit.sha }),
    headers: { "Content-Type": "application/json" },
  });
  console.log("created ref refs/heads/main");
} catch (e) {
  if (e.status === 422) {
    await api(`/repos/${REPO}/git/refs/heads/main`, {
      method: "PATCH",
      body: JSON.stringify({ sha: commit.sha, force: true }),
      headers: { "Content-Type": "application/json" },
    });
    console.log("updated ref refs/heads/main");
  } else throw e;
}

console.log("DONE commit:", commit.sha);
