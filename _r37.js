/* step37 — 逐帧独立实现：51 N 皇后 */
;(function () {
  const R = window.REPLAY;

  R[51] = p => {
    const n = 4, S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    let c = 0, sols = 0;
    const col = new Array(n).fill(false), d1 = new Array(2 * n).fill(false), d2 = new Array(2 * n).fill(false);
    const B = () => (sols ? { c, 解: sols } : { c });
    P(5, { c: 0 });
    P(7, { c: 0 });
    const dfs = (r) => {
      P(11, B());
      if (r === n) { sols++; P(13, B()); P(13, B()); return; }
      for (let cc = 0; cc < n; cc++) {
        c = cc;
        P(14, B());
        const conflict = col[cc] || d1[r - cc + n] || d2[r + cc];
        P(15, B());
        if (conflict) continue;
        col[cc] = d1[r - cc + n] = d2[r + cc] = true;
        P(17, B());
        P(18, B());
        dfs(r + 1);
        P(18, B());
        col[cc] = d1[r - cc + n] = d2[r + cc] = false;
        P(19, B());
      }
      P(20, B());
    };
    dfs(0);
    P(8, { c: 3, 解: sols, 答案: sols + " 个解" });
    return S;
  };
})();
