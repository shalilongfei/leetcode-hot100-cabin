/* arith — 逐帧算术校验（v2：按 = 分段）
   形如 "need = 9 - 2 = 7"、"max(0,0) = 0"、"min(1,7) × 8 = 8" 都拆成
   表达式 + 声称结果，重算后比对。 */
;(function () {
  const { loadCore } = require("./_lib/load.js");
global.window = {};
const __missingFiles = loadCore();
if (__missingFiles.length) {
  console.error("缺少文件，无法继续：\n  " + __missingFiles.join("\n  "));
  process.exit(1);
}

  function norm(e) {
    return e.replace(/×/g, "*").replace(/÷/g, "/")
      .replace(/（/g, "(").replace(/）/g, ")")
      .replace(/[−–—]/g, "-").replace(/∞/g, "Infinity")
      .replace(/\s+/g, " ").trim();
  }

  function safeEval(expr) {
    const e = norm(expr);
    if (!e || !/^[-+*/%(). \d]+$/.test(e) || !/\d/.test(e)) return null;
    try {
      const v = Function('"use strict";return (' + e + ")")();
      return typeof v === "number" && isFinite(v) ? v : null;
    } catch (_) { return null; }
  }

  function evalExpr(expr) {
    let e = norm(expr);
    let guard = 0;
    while (/max\s*\(|min\s*\(/.test(e) && guard++ < 8) {
      const before = e;
      e = e.replace(/(max|min)\s*\(([^()]*)\)/g, (m0, fn, args) => {
        const parts = args.split(",").map(x => safeEval(x));
        if (parts.some(p => p === null)) return m0;
        return String(fn === "max" ? Math.max(...parts) : Math.min(...parts));
      });
      if (e === before) break;
    }
    if (/max\s*\(|min\s*\(/.test(e)) return null;
    return safeEval(e);
  }

  /* 把 note 拆成 [表达式, 结果] */
  function splitEq(note) {
    const n = String(note || "")
      .replace(/\+=/g, "\u0005").replace(/-=/g, "\u0006").replace(/\*=/g, "\u0007").replace(/\/=/g, "\u0008")
      .replace(/==/g, "\u0001").replace(/>=/g, "\u0002").replace(/<=/g, "\u0003").replace(/!=/g, "\u0004")
      .replace(/→/g, "=").replace(/＝/g, "=");
    const parts = n.split("=").map(s => s.trim()).filter(s => s.length);
    if (parts.length < 2) return null;
    const last = parts[parts.length - 1].replace(/[，,；;].*$/, "").trim();
    if (!/^-?\d+(?:\.\d+)?$/.test(last)) return null;
    const expr = parts[parts.length - 2];
    if (/\+=|-=|\*=|\/=/.test(expr)) return null;      /* 累加/累减要原值，无法只凭算式校验 */
    /* 纯数字（含带符号的负数）不是算式。
       否则 "10→-3→11" 这类「路径节点值序列」会被拆成 10 / -3 / 11，
       把 -3 当成表达式、11 当成结果，误判成算错。 */
    if (/^[-+]?\d+(?:\.\d+)?$/.test(expr.trim())) return null;
    if (!/[-+*/×÷]|max|min/.test(expr)) return null;     /* 必须有运算才算算术 */
    return { expr, claimed: Number(last) };
  }

  const bad = [];
  let checked = 0;
  window.H1.all.forEach(p => {
    const steps = window.TRACE.build(p);
    steps.forEach((f, i) => {
      const se = splitEq(f.note);
      if (!se) return;
      const actual = evalExpr(se.expr);
      if (actual === null) return;
      checked++;
      if (Math.abs(actual - se.claimed) > 1e-6) {
        bad.push({ n: p.n, t: p.t, i, line: f.line, note: String(f.note).slice(0, 60), expr: se.expr, claimed: se.claimed, actual });
      }
    });
  });

  console.log("校验算式:", checked, "| 算错:", bad.length);
  const byProblem = {};
  bad.forEach(b => { (byProblem[b.n] = byProblem[b.n] || []).push(b); });
  Object.keys(byProblem).forEach(n => {
    const arr = byProblem[n];
    console.log("\n─ 题" + n + " " + arr[0].t + "（" + arr.length + " 处）");
    arr.slice(0, 5).forEach(b => console.log("   帧" + b.i + " L" + b.line + "  「" + b.note + "」  → " + b.expr + " 应为 " + b.actual + "，写的是 " + b.claimed));
  });
  require("fs").writeFileSync(require("path").join(__dirname, "_arith.json"), JSON.stringify(bad, null, 1));
})();
