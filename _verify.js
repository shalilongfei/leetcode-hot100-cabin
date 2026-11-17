/* verify-run — 用独立实现核对每题 trace 的最终答案 */
;(function () {
  const { loadCore } = require("./_lib/load.js");
global.window = {};
const __missingFiles = loadCore();
if (__missingFiles.length) {
  console.error("缺少文件，无法继续：\n  " + __missingFiles.join("\n  "));
  process.exit(1);
}

  /* 独立的期望实现（自动发现 _v*.js 并加载） */
  require("./_lib/load.js").loadVerify();

  const V = window.VERIFY || {};
  const rows = [];
  window.H1.all.forEach(p => {
    const steps = window.TRACE.build(p);
    const last = steps[steps.length - 1];
    let claimed = null;
    if (last && last.vars) {
      for (const k of ["答案", "结果", "返回", "交点"]) {
        if (last.vars[k] !== undefined && last.vars[k] !== "?") { claimed = last.vars[k]; break; }
      }
    }
    let expect = null, err = null;
    if (V[p.n]) {
      try { expect = V[p.n](p); } catch (e) { err = e.message; }
    }
    rows.push({ n: p.n, t: p.t, claimed: claimed === null ? "（无答案变量）" : claimed, expect, err, hasImpl: !!V[p.n] });
  });

  const missing = rows.filter(r => !r.hasImpl);
  const crash = rows.filter(r => r.err);
  const bad = rows.filter(r => r.hasImpl && !r.err && String(r.claimed).trim() !== String(r.expect).trim());

  console.log("有独立实现:", rows.length - missing.length, "/100");
  console.log("实现报错:", crash.length);
  console.log("答案不符:", bad.length);
  if (__missingFiles.length) console.log("缺实现:", missing.map(r => r.n).join(","));
  if (crash.length) crash.forEach(r => console.log("  ✗ " + r.n + " " + r.err));
  bad.forEach(r => console.log("  ✗ 题" + r.n + " " + r.t + "　trace=" + r.claimed + "　独立=" + r.expect));
  require("fs").writeFileSync(require("path").join(__dirname, "_verify.json"), JSON.stringify(rows, null, 1));
})();
