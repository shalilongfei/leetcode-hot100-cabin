/* consist — 逐帧「解说 ↔ 变量面板」一致性
   解说里出现 "x = 3"，变量面板里的 x 就必须是 3（允许 ±0 误差）。
   这条能覆盖大量纯赋值的帧，比只校验算式密得多。 */
;(function () {
  const { loadCore } = require("./_lib/load.js");
global.window = {};
const __missingFiles = loadCore();
if (__missingFiles.length) {
  console.error("缺少文件，无法继续：\n  " + __missingFiles.join("\n  "));
  process.exit(1);
}

  let checked = 0;
  const bad = [];
  window.H1.all.forEach(p => {
    const steps = window.TRACE.build(p);
    steps.forEach((f, i) => {
      const vars = f.vars || {};
      const note = String(f.note || "");
      /* 抓 "名字 = 数字"，名字只允许 ASCII / 中文，避免把算式片段当变量名 */
      /* 只认「纯赋值」：x = 5，且后面不接运算符、前面不是 ++/-- */
      const re = /(?<![-+\w\u4e00-\u9fa5])([A-Za-z_][A-Za-z0-9_]{0,11}|[\u4e00-\u9fa5]{1,6})\s*=\s*(-?\d+(?:\.\d+)?)(?!\s*[-+*/=<>])/g;
      let m;
      while ((m = re.exec(note))) {
        const k = m[1], v = Number(m[2]);
        if (!(k in vars)) continue;                     /* 面板里没这个变量就不比 */
        const got = vars[k];
        if (typeof got !== "number") continue;          /* 只比数值型 */
        checked++;
        if (Math.abs(got - v) > 1e-6) {
          bad.push({ n: p.n, t: p.t, i, line: f.line, note: note.slice(0, 52), k, noteVal: v, panelVal: got });
        }
      }
    });
  });

  console.log("解说↔面板 数值对账:", checked, "处 | 不一致:", bad.length);
  const byP = {};
  bad.forEach(b => (byP[b.n] = byP[b.n] || []).push(b));
  Object.keys(byP).slice(0, 20).forEach(n => {
    const arr = byP[n];
    console.log("\n─ 题" + n + " " + arr[0].t + "（" + arr.length + " 处）");
    arr.slice(0, 4).forEach(b => console.log("   帧" + b.i + " L" + b.line + "  「" + b.note + "」  " + b.k + "：解说 " + b.noteVal + " / 面板 " + b.panelVal));
  });
  require("fs").writeFileSync(require("path").join(__dirname, "_consist.json"), JSON.stringify(bad, null, 1));
})();
