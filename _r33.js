/* step33 — 逐帧独立实现：5 / 131 */
;(function () {
  const R = window.REPLAY;

  /* 5 最长回文子串 */
  R[5] = p => {
    const s = "babad", n = s.length, S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    let start = 0, maxLen = 1, len;
    const base = extra => {
      const o = { start, maxLen, i: 0 };
      if (len !== undefined) o.len = len;
      return Object.assign(o, extra || {});
    };
    P(4, { start, maxLen, i: 0 });
    P(5, { start, maxLen, i: 0 });
    const expand = (l0, r0) => {
      P(10, base());
      let l = l0, r = r0;
      while (l >= 0 && r < n && s[l] === s[r]) { P(6, base()); l--; r++; }
      len = r - l - 1;
      P(7, base());
      if (len > maxLen) { maxLen = len; start = l + 1; P(8, base()); }
    };
    for (let i = 0; i < n; i++) { expand(i, i); expand(i, i + 1); }
    P(14, base({ 答案: s.substr(start, maxLen) }));
    return S;
  };

  /* 131 分割回文串 */
  R[131] = p => {
    const s = "aab", n = s.length, S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    const res = [], path = [];
    let deepStart = 0, deepEnd = 0;
    const B = () => (res.length ? { 结果数: res.length } : {});
    P(4, {});
    P(5, {});
    P(6, {});
    const isPal = (l, r) => { while (l < r) { if (s[l] !== s[r]) return false; l++; r--; } return true; };
    const dfs = (start) => {
      deepStart = start;
      P(14, B());
      if (start === n) { res.push(path.slice()); P(16, B()); P(16, B()); return; }
      let lastCont = false;
      for (let end = start; end < n; end++) {
        deepEnd = end; lastCont = false;
        P(17, B());
        const ok = isPal(start, end);
        P(18, B());
        if (!ok) { P(21, B()); lastCont = true; continue; }
        path.push(s.slice(start, end + 1));
        P(19, B());
        P(20, B());
        dfs(end + 1);
        P(20, B());
        path.pop();
        P(21, B());
      }
      if (!lastCont) P(21, B());
    };
    dfs(0);
    P(7, Object.assign(B(), { 答案: res.map(r => r.join("|")).join("  ") }));
    return S;
  };
})();
