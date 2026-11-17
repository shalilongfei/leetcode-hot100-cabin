/* step35 — 逐帧独立实现：76 最小覆盖子串 */
;(function () {
  const R = window.REPLAY;

  R[76] = p => {
    const s = p.viz.arr, t = "ABC", S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    const need = {}, win = {};
    let kinds = 0;
    for (const c of t) { if (!need[c]) { need[c] = 0; kinds++; } need[c]++; }
    let valid = 0, l = 0, start = 0, len = Infinity, lastR = 0, lastC = "'A'", lastLeft = "'A'";
    const B = extra => {
      const o = { kinds, valid, l, start, r: lastR, len: len === Infinity ? "∞" : len, c: lastC };
      return Object.assign(o, extra || {});
    };
    P(4, { kinds: 0, valid: 0, l: 0, start: 0, r: 0 });
    P(5, { kinds: 0, valid: 0, l: 0, start: 0, r: 0 });
    P(6, { kinds, valid: 0, l: 0, start: 0, r: 0 });
    P(8, { kinds, valid: 0, l: 0, start: 0, r: 0, len: "∞" });
    for (let r = 0; r < s.length; r++) {
      const c = s[r];
      lastR = r; lastC = "'" + c + "'";
      P(9, B());
      P(10, B());
      if (need[c]) {
        win[c] = (win[c] || 0) + 1;
        if (win[c] === need[c]) valid++;
        P(11, B());
      }
      let cw = lastC;
      while (valid === kinds) {
        P(12, B({ c: cw }));
        if (r - l + 1 < len) { len = r - l + 1; start = l; }
        P(13, B({ c: cw }));
        const left = s[l];
        lastLeft = "'" + left + "'"; cw = lastLeft;
        P(14, B({ c: lastLeft }));
        if (need[left]) {
          if (win[left] === need[left]) valid--;
          win[left]--;
          P(15, B({ c: lastLeft }));
        }
        l++;
        P(16, B({ c: lastLeft }));
      }
    }
    P(19, B({ c: lastLeft, 答案: len === Infinity ? '""' : s.slice(start, start + len).join("") }));
    return S;
  };
})();
