/* _blank_audit.js — 挖空规格校验 */
global.window = {};
const { loadApp } = require("./_lib/load.js");
const missing = loadApp([
  "js/data/p1.js","js/data/p2.js","js/data/p3.js","js/data/p4.js",
  "js/data/cpp1.js","js/data/cpp2.js","js/data/cpp3.js","js/data/index.js",
  "js/data/blank.js","js/highlight.js",
]);
if (missing.length) {
  console.error("缺少文件，无法继续：\n  " + missing.join("\n  "));
  process.exit(1);
}

const HL = window.HL;
const BLANK = window.BLANK;

function analyze(code, pn) {
  const spec = BLANK[pn];
  if (!spec) return { spec: null, hits: [] };
  // 复用 highlight.js 内部逻辑：这里用公开的 blankify 反推答案数
  const r = HL.blankify(code, pn);
  return { spec, answers: r.answers, html: r.html };
}

const rows = [];
const problems = [];
window.H1.all.forEach((p, idx) => {
  problems.push(p.n);
  const cpp = p.cpp || p.tmpl || "";
  const py = p.tmpl || "";
  const a = analyze(cpp, p.n);
  const b = analyze(py, p.n);
  rows.push({ idx: idx + 1, n: p.n, t: p.t, spec: BLANK[p.n] ? BLANK[p.n].length : 0,
              cppCnt: (a.answers || []).length, pyCnt: (b.answers || []).length });
});

console.log("序号 | 题号 | 标题                  | 规格词数 | C++挖空 | Py挖空");
console.log("-----|------|-----------------------|----------|---------|-------");
const bad = [];
rows.forEach(r => {
  const title = r.t.length > 20 ? r.t.slice(0, 20) : r.t + " ".repeat(20 - r.t.length);
  const flag = r.cppCnt < 4 ? " ←少" : (r.cppCnt > 13 ? " ←多" : "");
  if (flag) bad.push(r.n + flag);
  console.log("  " + String(r.idx).padStart(3) + " | " + String(r.n).padStart(4) + " | " + title + " | " +
    String(r.spec).padStart(8) + " | " + String(r.cppCnt).padStart(7) + " | " + String(r.pyCnt).padStart(6) + flag);
});

const zero = rows.filter(r => r.cppCnt === 0);
console.log("\n统计：");
console.log("  题目数:", rows.length);
console.log("  有规格:", rows.filter(r => BLANK[r.n]).length);
console.log("  C++ 平均挖空:", (rows.reduce((s, r) => s + r.cppCnt, 0) / rows.length).toFixed(1));
console.log("  C++ 挖空为 0:", zero.length ? zero.map(r => r.n).join(",") : "无");
console.log("  数量异常:", bad.length ? bad.join(", ") : "无");
