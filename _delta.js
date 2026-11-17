/* delta — 逐帧、逐变量核对
   对每一帧的每一个变量，回答两个问题：
     A. 它变了没有？note 有没有解释这次变化？
     B. note 声称它变了，它真的变了吗？
   抓的是「变量滞后」（说了变却没变）、「凭空变化」（没说就变了）、「变量残留」（越界还在）。 */
;(function () {
  const { loadCore } = require("./_lib/load.js");
global.window = {};
const __missingFiles = loadCore();
if (__missingFiles.length) {
  console.error("缺少文件，无法继续：\n  " + __missingFiles.join("\n  "));
  process.exit(1);
}

  const NUM = v => (typeof v === "number" ? v : (typeof v === "string" && /^-?\d+(\.\d+)?$/.test(v) ? Number(v) : null));
  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  /* note 里有没有提到这个变量（赋值/自增/比较都算） */
  function mentionsVar(note, k) {
    const re = new RegExp("(^|[^A-Za-z0-9_])" + esc(k) + "($|[^A-Za-z0-9_])");
    return re.test(note);
  }
  /* note 有没有明确断言「k = 数字」 */
  function assertsValue(note, k) {
    const re = new RegExp("(?:^|[^\\w])" + esc(k) + "\\s*=\\s*(-?\\d+(?:\\.\\d+)?)(?!\\s*[-+*/=<>])");
    const m = note.match(re);
    return m ? Number(m[1]) : null;
  }

  const lag = [];      /* 说了变却没变 / 变了但数值不对 */
  const ghost = [];    /* 没说就变（可能是派生变量，需人看） */
  const stale = [];    /* 变量已经不该存在（下标越界等） */
  let varChecks = 0;

  window.H1.all.forEach(p => {
    const steps = window.TRACE.build(p);
    const n = String(p.cpp || "").split("\n").length;
    steps.forEach((f, i) => {
      const vars = f.vars || {};
      const prev = i > 0 ? (steps[i - 1].vars || {}) : {};
      const note = String(f.note || "");

      Object.keys(vars).forEach(k => {
        const cur = NUM(vars[k]);
        if (cur === null) return;                     /* 只核对数值型 */
        varChecks++;
        const before = NUM(prev[k]);
        const said = assertsValue(note, k);

        /* A. note 断言了具体值 → 必须等于面板值 */
        if (said !== null && Math.abs(said - cur) > 1e-6) {
          lag.push({ n: p.n, t: p.t, i, line: f.line, k, note: note.slice(0, 48), said, cur });
          return;
        }
        /* B. 值变了，但 note 完全没提这个变量 → 可能是派生，也可能是脏数据 */
        if (before !== null && Math.abs(before - cur) > 1e-6 && !mentionsVar(note, k)) {
          ghost.push({ n: p.n, t: p.t, i, line: f.line, k, note: note.slice(0, 44), before, cur });
        }
      });

      /* C. 变量名是下标类，值不该超出 [0, n] */
      ["i","j","lo","hi","mid","slow","fast","p1","p2","p3","k","w"].forEach(k => {
        const v = NUM(vars[k]);
        if (v !== null && (v < -2 || v > n + 4)) {
          stale.push({ n: p.n, t: p.t, i, line: f.line, k, v, len: n });
        }
      });
    });
  });

  console.log("数值变量核对:", varChecks, "次");
  console.log("说了变却没变 / 值不对:", lag.length);
  console.log("没解释就变了:", ghost.length);
  console.log("下标越界:", stale.length);

  const dump = (arr, title, limit) => {
    if (!arr.length) return;
    const byP = {};
    arr.forEach(b => (byP[b.n] = byP[b.n] || []).push(b));
    console.log("\n【" + title + "】" + Object.keys(byP).length + " 题");
    Object.keys(byP).slice(0, limit).forEach(n => {
      const a = byP[n];
      console.log("─ 题" + n + " " + a[0].t + "（" + a.length + " 处）");
      a.slice(0, 3).forEach(b => console.log("   帧" + b.i + " L" + b.line + " 「" + b.note + "」 " + b.k + " " + JSON.stringify(b).slice(0, 90)));
    });
  };
  dump(lag, "note 断言与面板不符", 12);
  dump(ghost, "值变了但 note 没提", 15);
  dump(stale, "下标越界", 8);
  require("fs").writeFileSync(require("path").join(__dirname, "_delta.json"), JSON.stringify({ lag, ghost, stale }, null, 1));
})();
