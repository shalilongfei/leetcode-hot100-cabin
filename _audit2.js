/* audit2 — 语义校验：解说里的动作必须能在对应代码行上找到证据 */
;(function () {
  const { loadCore } = require("./_lib/load.js");
global.window = {};
const __missingFiles = loadCore();
if (__missingFiles.length) {
  console.error("缺少文件，无法继续：\n  " + __missingFiles.join("\n  "));
  process.exit(1);
}

  /* 解说特征 → 代码行必须含的证据（满足其一即可） */
  const RULES = [
    { note: /swap\(/, code: /swap|reverse/ },
    { note: /push_back|入栈|压入/, code: /push_back|push\(|emplace|insert/ },
    { note: /pop_back|出栈/, code: /pop_back|pop\(/ },
    { note: /^(?:→ )?return |→ return /, code: /return/ },
    { note: /^while\s*\(|^while \S/, code: /while/ },
    { note: /^for[:：]/, code: /for/ },
    { note: /\+=/, code: /\+=/ },
    { note: /sort\(/, code: /sort/ }
  ];

  const report = [];
  window.H1.all.forEach(p => {
    const st = window.TRACE.build(p);
    const L = String(p.cpp || "").split("\n");
    const bad = [];
    st.forEach((f, i) => {
      const code = L[f.line - 1] || "";
      const note = String(f.note || "");
      RULES.forEach(r => {
        if (r.note.test(note) && !r.code.test(code)) {
          bad.push({ i, line: f.line, note: note.slice(0, 34), code: code.trim().slice(0, 40) });
        }
      });
    });
    if (bad.length) report.push({ n: p.n, t: p.t, frames: st.length, bad });
  });

  const total = report.reduce((s, r) => s + r.bad.length, 0);
  console.log("语义不符的帧:", total, "| 涉及题数:", report.length, "/100");
  console.log("");
  report.slice(0, 14).forEach(r => {
    console.log("── " + r.n + " " + r.t + " (" + r.frames + "帧, " + r.bad.length + " 处)");
    r.bad.slice(0, 4).forEach(b => {
      console.log("   帧" + String(b.i).padStart(3) + " L" + String(b.line).padStart(2) + "  「" + b.note + "」");
      console.log("            代码: " + b.code);
    });
  });
  if (report.length > 14) console.log("\n… 还有 " + (report.length - 14) + " 题");
  require("fs").writeFileSync(require("path").join(__dirname, "_audit2.json"), JSON.stringify(report, null, 1));
})();
