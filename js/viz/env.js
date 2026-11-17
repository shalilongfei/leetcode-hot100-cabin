/* env — 每帧的「变量快照」+ 行号兜底
   1) 从代码提取初始化值作为环境起点（int l = 0, best = 0 → l=0, best=0）
   2) 逐帧累积：vars > ptr > listPtr > gridHi > 解说解析
   3) 帧行号落在空行/括号上时，向上回溯到最近的可执行行
   4) 末尾前向补齐：任何帧缺的变量，用后面第一次出现的值填上 */
;(function () {
  const TYPE = "(?:const\\s+)?(?:int|long\\s+long|long|short|double|float|char|bool|size_t|auto|unsigned|ListNode|TreeNode|Node|string)";
  const NAME = "([A-Za-z_]\\w*)";
  const SKIP = /^(void|nullptr|INT_MAX|INT_MIN|LONG_MAX|LONG_MIN|next|val|first|second|begin|end|size|empty|top|front|back|push|pop|res|dp)$/;

  function isExec(t) {
    const s = (t || "").trim();
    if (!s) return false;
    if (/^[{}]+;?$/.test(s)) return false;
    if (/^(\/\/|\/\*|\*|#)/.test(s)) return false;
    if (/^(public|private|protected)\s*:/.test(s)) return false;
    return true;
  }

  function extract(cpp) {
    const names = new Set(), chars = new Set(), init = {};
    String(cpp || "").split("\n").forEach(line => {
      const t = line.trim();
      if (!t || /^\/\//.test(t)) return;

      const decl = t.match(new RegExp("^" + TYPE + "\\s*[\\*&\\s]*\\s*(.+?)(?:;|\\{|$)"));
      if (decl && !/^\s*(?:return|\w+\s*\()/.test(decl[1])) {
        decl[1].replace(/\([^)]*\)/g, "").split(",").forEach(part => {
          const nm = part.match(new RegExp("^[\\*&\\s]*" + NAME));
          if (nm && !/^\d/.test(nm[1]) && !SKIP.test(nm[1])) {
            names.add(nm[1]);
            if (/^\s*(?:const\s+)?char\s/.test(t)) chars.add(nm[1]);
            /* 初始化值：x = 0 / x = -1 / x = 1 */
            const iv = part.match(new RegExp(NAME + "\\s*=\\s*(-?\\d+)\\s*$"));
            if (iv) init[nm[1]] = Number(iv[2]);
          }
        });
      }

      const fr = t.match(new RegExp("for\\s*\\(\\s*" + TYPE + "\\s*[\\*&\\s]*\\s*" + NAME));
      if (fr) {
        names.add(fr[1]);
        if (/for\s*\(\s*(?:const\s+)?char\s/.test(t)) chars.add(fr[1]);
        const iv2 = t.match(new RegExp("for\\s*\\(\\s*" + TYPE + "\\s+" + NAME + "\\s*=\\s*(-?\\d+)"));
        if (iv2) init[iv2[1]] = Number(iv2[2]);
      }

      /* 容器成员：priority_queue<...> small; queue<int> q; unordered_map<...> cnt; */
      const mem = t.match(/^(?:const\s+)?(?:priority_queue|queue|stack|deque|set|map|vector|unordered_map|unordered_set|list|pair)\s*<(?:[^<>]|<[^<>]*>)+>\s+([A-Za-z_]\w*)\s*[;{]/);
      if (mem && !SKIP.test(mem[1])) names.add(mem[1]);

      const sb = t.match(/for\s*\(\s*(?:const\s+)?auto\s*&?\s*\[([^\]]+)\]/);
      if (sb) sb[1].split(",").forEach(x => { const nm = x.trim().match(/^([A-Za-z_]\w*)/); if (nm && !SKIP.test(nm[1])) names.add(nm[1]); });

      const fn = t.match(/[A-Za-z_]\w*\s*\(([^)]*)\)\s*\{?/);
      if (fn) {
        fn[1].split(",").forEach(part => {
          const nm = part.match(/([A-Za-z_]\w*)\s*$/);
          if (nm && !/^(int|long|char|bool|double|string|void|auto|vector|const|nullptr)$/.test(nm[1])) {
            names.add(nm[1]);
            if (/^\s*(?:const\s+)?char\s/.test(part)) chars.add(nm[1]);
          }
        });
      }
    });
    return { names, chars, init };
  }

  function fromPtr(f, out) {
    if (!f.ptr) return;
    Object.keys(f.ptr).forEach(k => { if (typeof f.ptr[k] === "number") out[k] = f.ptr[k]; });
  }
  function fromListPtr(f, out) {
    if (!f.listPtr) return;
    Object.keys(f.listPtr).forEach(idx => {
      String(f.listPtr[idx]).split("/").forEach(nm => {
        const n = nm.trim();
        if (n) out[n] = Number(idx);
      });
    });
  }
  function fromGrid(f, out) {
    if (!f.gridHi || !f.gridHi.length) return;
    const m = String(f.gridHi[0]).split(",");
    if (m.length === 2 && m.every(x => /^-?\d+$/.test(x))) { out.i = Number(m[0]); out.j = Number(m[1]); }
  }
  function fromNote(note, known, out) {
    const re = /(^|[^\w[\].])([A-Za-z_]\w{0,14})\s*(?:\+?=|→)\s*(-?\d+(?:\.\d+)?)(?![\d\w.])/g;
    let m;
    while ((m = re.exec(note))) if (known.has(m[2]) && !(m[2] in out)) out[m[2]] = Number(m[3]);
    const pre = /([A-Za-z_]\w{0,14})\s*=\s*\w[\w>.-]*\s*[（(](-?\d+)[)）]/g;
    let pm;
    while ((pm = pre.exec(note))) if (known.has(pm[1]) && !(pm[1] in out)) out[pm[1]] = Number(pm[2]);
    const bre = /([A-Za-z_]\w{0,14})\s*\([^)]*\)\s*(?:==|\?)\s*(true|false)/i;
    const bm = note.match(bre);
    if (bm && known.has(bm[1])) out[bm[1]] = bm[2].toLowerCase();
  }

  window.ENV = {
    names: cpp => extract(cpp).names,
    apply(p, steps) {
      if (!steps || !steps.length) return steps;
      const { names: known, chars, init } = extract(p && p.cpp);
      const lines = String(p && p.cpp || "").split("\n");

      /* ---- ① 行号兜底：落在空行/括号上就向上回溯 ---- */
      steps.forEach(f => {
        let ln = f.line;
        if (!(ln >= 1 && ln <= lines.length)) ln = lines.length;
        let guard = 0;
        while (ln > 1 && !isExec(lines[ln - 1]) && guard++ < lines.length) ln--;
        if (isExec(lines[ln - 1])) f.line = ln;
      });

      /* ---- ② 变量累积（起点用代码里的初始化值） ---- */
      const env = Object.assign({}, init);
      steps.forEach(f => {
        const local = {};
        fromPtr(f, local);
        fromListPtr(f, local);
        fromGrid(f, local);
        if (f.vars) Object.assign(local, f.vars);
        fromNote(String(f.note || ""), known, local);
        const cm = String(f.note || "").match(/'([^']{1,3})'/);
        if (cm && chars.size) { const c0 = [...chars][0]; local[c0] = "'" + cm[1] + "'"; }
        Object.keys(local).forEach(k => {
          if (known.has(k) || /[\u4e00-\u9fa5]/.test(k)) env[k] = local[k];
        });
        f.vars = Object.assign({}, env);
      });

      /* ---- ③ 不再补齐：变量只有在被执行到之后才出现（真实调试器行为） ---- */

      steps._lineMap = steps.map(f => f.line || 1);
      return steps;
    }
  };
})();
