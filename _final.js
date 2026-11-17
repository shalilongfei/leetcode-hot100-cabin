/* _final.js — 逐帧归零总检（修正 Infinity 比较） */
global.window = {};
const { loadCore, loadReplay, replayFiles } = require("./_lib/load.js");

const __missingFiles = loadCore();
if (__missingFiles.length) {
  console.error("缺少文件，无法继续：\n  " + __missingFiles.join("\n  "));
  process.exit(1);
}
loadReplay();

const R = window.REPLAY;
const NUM = v => (v === undefined || v === null ? null : (typeof v === "number" ? v : (/^-?\d+(\.\d+)?$/.test(String(v)) ? Number(v) : null)));
const same = (x, y) => {
  const a = NUM(x), b = NUM(y);
  if (a !== null && b !== null) {
    if (a === b) return true;                       // 含 ±Infinity 相等
    if (!isFinite(a) || !isFinite(b)) return false;
    return Math.abs(a - b) < 1e-6;
  }
  return String(x) === String(y);
};

let ok = 0, frames = 0, vars = 0, bad = [];
window.H1.all.forEach(p => {
  if (!R[p.n]) return;
  let E; try { E = R[p.n](p); } catch (e) { bad.push(p.n + "抛错"); return; }
  const A = window.TRACE.build(p);
  if (A.map(f => f.line).join(",") !== E.map(f => f.line).join(",")) { bad.push(p.n + "结构(" + E.length + "vs" + A.length + ")"); return; }
  let diff = 0;
  A.forEach((f, i) => {
    const va = f.vars || {}, ve = E[i].vars || {};
    Object.keys(ve).forEach(k => { vars++; if (!(k in va) || !same(va[k], ve[k])) diff++; });
  });
  frames += A.length;
  if (diff === 0) ok++; else bad.push(p.n + "变量" + diff);
});
console.log("实现题数:", Object.keys(R).length);
console.log("逐帧归零:", ok, "题 / " + frames + " 帧 / " + vars + " 变量");
console.log("待修:", bad.join(", ") || "无");
