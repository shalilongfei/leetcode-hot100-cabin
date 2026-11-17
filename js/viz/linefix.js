/* linefix — 逐行对齐 v2
   规则：① 解说命中锚点 → 定位该锚点对应的代码行（多个候选取最近的，支持回绕）
        ② 解说出现「变量 = 值」→ 优先定位到声明/循环该变量的行
        ③ 都不命中 → 顺着可执行行往前走一步
   目标：进函数后帧一直在函数体内来回跳，循环会回绕。 */
;(function () {
  const NOTE6 = [
    ["null",  /空|null|nullptr|越界|叶子/i],
    ["swap",  /swap|交换|互换/i],
    ["recur", /递归|调用|进入|下一层|压栈/i],
    ["back",  /回溯|撤销|恢复|回退|弹出|pop|复原/i],
    ["ret",   /\breturn\b|返回值/i],
    ["loop",  /while|for\s*\(|for\s*[:：]|循环判断|下一轮|一轮|遍历/i],
    ["plusEq",/累加|\+=|蓄水|累加和/i],
    ["push",  /push|压入|入栈|入表|插入|放进|加进/i],
    ["sort",  /排序|sort|reverse|整体反转/i],
  ];

  const PAT = {
    null:  /if\s*\(\s*!\s*\w|if\s*\(\s*\w+\s*==\s*(null|nullptr)|if\s*\(\s*i\s*<\s*0|if\s*\(\s*r\s*<\s*0/i,
    recur: /\b(dfs|backtrack|sink|merge|build|gain|depth|check|bt|helper|sortList|checkSymmetric|search)\s*\(/,
    back:  /pop_back|pop_front|--\s*\w|pop\(|erase\(|\[.*\]\s*=\s*['"]?[.·]/,
    ret:   /\breturn\b/,
    loop:  /\b(for|while)\s*\(/,
    swap:  /\bswap\s*\(/,
    plusEq:/\+=/,
    push:  /push_back|emplace|push\(|\.append|\.insert/,
    sort:  /sort\s*\(|reverse\s*\(/,
  };

  const DECL = /(for\s*\(\s*(?:int|long|auto|char)\s+([A-Za-z_]\w*)|(?:int|long|auto|double|bool|string|char)\s+([A-Za-z_]\w*)\s*[=;({])/;

  function isExec(t) {
    const s = (t || "").trim();
    if (!s) return false;
    if (/^[{}]+;?$/.test(s)) return false;
    if (/^(\/\/|\/\*|\*|#)/.test(s)) return false;
    if (/^(public|private|protected)\s*:/.test(s)) return false;
    return true;
  }

  function labelOf(note) {
    const n = String(note || "");
    for (const [k, re] of NOTE6) if (re.test(n)) return k;
    return null;
  }

  /* 从解说里抽「变量名」：形如 "j = 2"、"ans = 5"、"cur += 10" */
  function varOf(note) {
    const m = String(note).match(/([A-Za-z_]\w{0,14})\s*(?:\+?=|→|是)\s*[-–—]?\d/);
    return m ? m[1] : null;
  }

  /* "++l = 1" / "--r = 10" → 自增变量 */
  function incOf(note) {
    const m = String(note).match(/(?:\+\+|--)\s*([A-Za-z_]\w{0,14})|([A-Za-z_]\w{0,14})\s*(?:\+\+|--)/);
    if (!m) return null;
    return { v: m[1] || m[2], up: /\+\+/.test(m[0]) };
  }

  /* "rmax = max(…, 1) = 1" → 极值调用的目标变量 */
  function extOf(note) {
    const m = String(note).match(/([A-Za-z_]\w{0,14})\s*=\s*(max|min)\s*\(/i);
    return m ? { v: m[1], f: m[2].toLowerCase() } : null;
  }

  window.LINEFIX = window.LINEFIX || {};

  window.LINEFIX.apply = function (p, steps) {
    if (!p || !p.cpp || !steps || !steps.length) return steps;
    const lines = String(p.cpp).split("\n");
    const ex = [];
    lines.forEach((t, i) => { if (isExec(t)) ex.push({ ln: i + 1, t }); });
    if (!ex.length) return steps;

    const hits = {};
    ex.forEach((e, i) => {
      Object.keys(PAT).forEach(k => { if (PAT[k].test(e.t)) (hits[k] = hits[k] || []).push(i); });
    });

    /* 变量 → 声明行下标 */
    const declOf = {};
    ex.forEach((e, i) => {
      const m = e.t.match(DECL);
      if (m) { const v = m[2] || m[3]; if (v) (declOf[v] = declOf[v] || []).push(i); }
    });

    function nearest(list, cur, wrapCost) {
      let best = list[0], bestD = Infinity;
      list.forEach(c => {
        const d = c >= cur ? (c - cur) : (c + ex.length - cur) * (wrapCost || 1.7);
        if (d < bestD) { bestD = d; best = c; }
      });
      return best;
    }

    let cur = 0, changed = 0;

    steps.forEach((f, k) => {
      const lab = labelOf(f.note);
      const v = varOf(f.note);
      const inc = incOf(f.note);
      const ext = extOf(f.note);
      let target = -1;

      /* ⓪ 自增 / 自减：直接钉到含 ++x 或 --x 的行 */
      if (inc) {
        const re = new RegExp("(\\+\\+|--)\\s*" + inc.v + "\\b|\\b" + inc.v + "\\s*(\\+\\+|--)");
        const cands = [];
        ex.forEach((e, i) => { if (re.test(e.t)) cands.push(i); });
        if (cands.length) target = nearest(cands, cur, 1.2);
      }
      /* ① x = max(...) / min(...)：钉到同时含 x 与 max/min 的行 */
      if (target < 0 && ext) {
        const re = new RegExp("\\b" + ext.v + "\\s*=(?!=)[^;]*" + ext.f);
        const cands = [];
        ex.forEach((e, i) => { if (re.test(e.t)) cands.push(i); });
        if (cands.length) target = nearest(cands, cur, 1.3);
      }
      /* ② 变量声明（数组下标、循环变量这类最容易被写错） */
      if (target < 0 && v && declOf[v] && declOf[v].length) {
        const cands = declOf[v];
        if (cands.length === 1) target = cands[0];
        else target = nearest(cands, cur, 1.2);
      }
      /* ③ 锚点 */
      if (target < 0 && lab && hits[lab] && hits[lab].length) {
        target = nearest(hits[lab], cur, 1.7);
      }
      /* ④ 顺延 */
      if (target < 0) {
        cur = Math.min(cur + 1, ex.length - 1);
      } else {
        cur = target;
      }

      const ln = ex[Math.min(cur, ex.length - 1)].ln;
      if (f.line !== ln) changed++;
      f.line = ln;
    });

    steps._lineMap = steps.map(f => f.line || 1);
    steps._fixed = changed;
    return steps;
  };
})();
