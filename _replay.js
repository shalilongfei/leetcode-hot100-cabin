/* replay — 逐帧全变量对比：trace vs 独立逐帧实现 */
;(function () {
  const { loadCore } = require("./_lib/load.js");
global.window = {};
const __missingFiles = loadCore();
if (__missingFiles.length) {
  console.error("缺少文件，无法继续：\n  " + __missingFiles.join("\n  "));
  process.exit(1);
}
  require("./_lib/load.js").loadReplay();

  const R = window.REPLAY || {};
  const NUM = v => (v === undefined || v === null ? null : (typeof v === "number" ? v : (/^-?\d+(\.\d+)?$/.test(String(v)) ? Number(v) : null)));
  const same = (x, y) => {
    const a = NUM(x), b = NUM(y);
    if (a !== null && b !== null) return Math.abs(a - b) < 1e-6;
    return String(x) === String(y);
  };

  let cmpVars = 0, cmpFrames = 0;
  const struct = [], diff = [];
  const covered = [];

  window.H1.all.forEach(p => {
    if (!R[p.n]) return;
    covered.push(p.n);
    let exp;
    try { exp = R[p.n](p); } catch (e) { struct.push({ n: p.n, t: p.t, why: "实现抛错: " + e.message }); return; }
    const act = window.TRACE.build(p);

    /* 先比帧结构（line 序列） */
    const la = act.map(f => f.line).join(","), le = exp.map(f => f.line).join(",");
    if (la !== le) {
      struct.push({ n: p.n, t: p.t, why: "帧数/行号不一致", act: act.length, exp: exp.length,
                    firstDiff: (() => { for (let i = 0; i < Math.max(act.length, exp.length); i++) if (!act[i] || !exp[i] || act[i].line !== exp[i].line) return i; return -1; })() });
      return;
    }
    cmpFrames += act.length;
    act.forEach((f, i) => {
      const va = f.vars || {}, ve = exp[i].vars || {};
      Object.keys(ve).forEach(k => {
        if (!(k in va)) { diff.push({ n: p.n, t: p.t, i, k, note: String(f.note).slice(0, 40), act: "（缺）", exp: ve[k] }); return; }
        cmpVars++;
        if (!same(va[k], ve[k])) diff.push({ n: p.n, t: p.t, i, line: f.line, k, note: String(f.note).slice(0, 40), act: va[k], exp: ve[k] });
      });
    });
  });

  console.log("有逐帧实现的题:", covered.length, "/100");
  console.log("逐帧对比:", cmpFrames, "帧 | 变量:", cmpVars, "次");
  console.log("结构不符:", struct.length, "题");
  console.log("变量不符:", diff.length, "处");
  const byP = {};
  struct.forEach(s => (byP[s.n] = byP[s.n] || { t: s.t, s: [], d: [] }).s.push(s));
  diff.forEach(d => (byP[d.n] = byP[d.n] || { t: d.t, s: [], d: [] }).d.push(d));
  Object.keys(byP).forEach(n => {
    const o = byP[n];
    console.log("\n─ 题" + n + " " + o.t + "  结构 " + o.s.length + " / 变量 " + o.d.length);
    o.s.slice(0, 2).forEach(s => console.log("   [结构] " + s.why + " act=" + s.act + " exp=" + s.exp + " 首个差异帧=" + s.firstDiff));
    o.d.slice(0, 4).forEach(d => console.log("   [变量] 帧" + d.i + " L" + d.line + " " + d.k + "  trace=" + JSON.stringify(d.act) + "  独立=" + JSON.stringify(d.exp) + "  「" + d.note + "」"));
  });
})();
