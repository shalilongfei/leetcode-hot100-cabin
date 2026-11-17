/* audit3 — 行覆盖：循环体里哪些可执行行从未被帧访问 */
;(function () {
  const { loadCore } = require("./_lib/load.js");
global.window = {};
const __missingFiles = loadCore();
if (__missingFiles.length) {
  console.error("缺少文件，无法继续：\n  " + __missingFiles.join("\n  "));
  process.exit(1);
}

  const isExec = t => {
    const s = (t || "").trim();
    if (!s) return false;
    if (/^[{}]+;?$/.test(s)) return false;
    if (/^(\/\/|\/\*|\*|#)/.test(s)) return false;
    if (/^(public|private|protected)\s*:/.test(s)) return false;
    return true;
  };

  const report = [];
  window.H1.all.forEach((p, idx) => {
    const st = window.TRACE.build(p);
    const L = String(p.cpp || "").split("\n");
    const visited = new Set(st.map(f => f.line));
    const miss = [];
    L.forEach((t, i) => {
      const ln = i + 1;
      if (!isExec(t)) return;
      if (visited.has(ln)) return;
      /* 跳过：函数签名、类声明、纯声明无初始化 */
      const s = t.trim();
      /* 与补帧器同一套标准：这些行本就不需要独立帧 */
      if (/^(\+\+|--)/.test(s) === false) {
        if (/,$/.test(s)) return;
        if (!/[=(]/.test(s) && !/^(if|for|while|return|switch|else|do)\b/.test(s)) return;
        if (/^[})\]]/.test(s)) return;
        if (!/=/.test(s) && !/\(.*\)\s*[;{]?\s*$/.test(s) && /^[A-Za-z_][\w:<>,*&\s()]*?\s+[A-Za-z_]\w*\s*[;{]\s*$/.test(s)) return;
        if (!/=/.test(s) && /^[A-Za-z_][\w:<>\s]*<[^;]*>\s+[A-Za-z_]\w*\s*;\s*$/.test(s)) return;
      }
      if (/\)\s*\{$/.test(s) && !/^(if|for|while|switch)/.test(s) && !/=/.test(s)) return;
      if (/^".*"\s*\};?$/.test(s)) return;
      /* 函数签名 / 类声明 / 成员声明：本就不该有独立帧 */
      if (/^[A-Za-z_][\w:<>,*&\s]*\s+[A-Za-z_]\w*\s*\([^)]*\)\s*\{?\s*$/.test(s)) return;
      if (/\(/.test(s) && !/^(if|for|while|return|switch|else)\b/.test(s) && !/=/.test(s)) return;
      /* 跨行签名的续行：以 , 结尾或以 ) { 结尾且没有语句关键字 */
      if (/,$/.test(s)) return;
      if (/\)\s*\{?\s*$/.test(s) && /^(const\s+)?[A-Za-z_][\w:<>,*&\s]*\s+[A-Za-z_]\w*\s*,/.test(s)) return;
      /* 纯成员/局部声明：类型 + 名字 + 可选 ; 或 {，没有赋值/调用/return */
      if (!/[=(]/.test(s) && !/^(if|for|while|return|switch|else|do)\b/.test(s) &&
          /^[A-Za-z_][\w:<>,*&]*\s+[A-Za-z_]\w*\s*(\[\d*\])?\s*[;{]?\s*$/.test(s)) return;
      if (/^(class|struct)\s/.test(s)) return;
      if (/^[A-Za-z_][\w:<>,*&\s]*\s+[A-Za-z_]\w*\s*;\s*$/.test(s) && !/=/.test(s)) return;
      if (/^return\b/.test(s) && visited.size && [...visited].some(v => /return/.test(L[v - 1] || ""))) return;
      /* 分支入口 / 条件不满足时的路径：数据不触发不算漏 */
      if (/^\}\s*else\b/.test(s) || /^else\b/.test(s)) return;
      /* 缩进比上方最近的「父行」深，且父行已有帧 → 这是没走到的一支，不算漏 */
      {
        const ind = t.match(/^\s*/)[0].length;
        for (let k = i - 1; k >= 0; k--) {
          const pt = L[k];
          if (!pt.trim()) continue;
          const pind = pt.match(/^\s*/)[0].length;
          if (pind < ind) {
            if (visited.has(k + 1) && /\{\s*$/.test(pt.trim())) return;   /* 父块已进入，本行是未走的分支 */
            break;
          }
        }
      }
      /* 条件分支行：同块其它行已覆盖 → 属于「数据没走到的分支」，不算漏 */
      if (/^(if|while|for)\s*\(/.test(s)) {
        const indent = t.match(/^\s*/)[0].length;
        let blockTouched = false;
        for (let k = 0; k < L.length; k++) {
          const ln2 = k + 1;
          if (visited.has(ln2)) {
            const ind2 = L[k].match(/^\s*/)[0].length;
            if (ind2 >= indent) { blockTouched = true; break; }
          }
        }
        if (blockTouched) return;
      }
      miss.push({ ln, code: s.slice(0, 46) });
    });
    if (miss.length) report.push({ n: p.n, t: p.t, frames: st.length, miss });
  });

  console.log("有未覆盖行的题:", report.length, "/100\n");
  report.forEach(r => {
    console.log("── " + r.n + " " + r.t + "（" + r.frames + " 帧，缺 " + r.miss.length + " 行）");
    r.miss.forEach(m => console.log("    L" + String(m.ln).padStart(2) + " " + m.code));
  });
  require("fs").writeFileSync(require("path").join(__dirname, "_miss.json"), JSON.stringify(report, null, 1));
})();
