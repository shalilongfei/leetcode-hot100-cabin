/* step27 — 逐帧独立实现：416 / 62 / 64 */
;(function () {
  const R = window.REPLAY;

  /* 416 分割等和子集 */
  R[416] = p => {
    const a = [1, 5, 11, 5], S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    const total = a.reduce((x, y) => x + y, 0), target = total / 2;
    const dp = new Array(target + 1).fill(false);
    dp[0] = true;
    P(4, { total, target });
    P(6, { total, target });
    P(8, { total, target });
    for (const x of a) {
      P(9, { total, target });
      for (let j = target; j >= x; j--) {
        dp[j] = dp[j] || dp[j - x];
        P(11, { total, target, x, j });
      }
    }
    P(12, { total, target, 答案: String(dp[target]) });
    return S;
  };

  /* 62 不同路径 */
  R[62] = p => {
    const m = 3, n = 3, S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    const dp = new Array(n).fill(1);
    P(4, { i: 1, j: 1, m, n });
    for (let i = 1; i < m; i++) {
      P(5, { i, j: i === 1 ? 1 : n - 1, m, n });
      for (let j = 1; j < n; j++) {
        P(6, { i, j, m, n });
        dp[j] = dp[j] + dp[j - 1];
        P(7, { i, j, m, n });
      }
    }
    P(8, { i: m - 1, j: n - 1, m, n, 答案: dp[n - 1] });
    return S;
  };

  /* 64 最小路径和 */
  R[64] = p => {
    const g = p.viz.grid.map(r => r.slice()), m = g.length, n = g[0].length, S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    P(4, { j: 1, i: 1 });
    P(5, { j: 1, i: 1 });
    let li = 0, lj = 1;
    for (lj = 1; lj < n; lj++) { g[0][lj] += g[0][lj - 1]; P(5, { j: lj, i: 0 }); }
    P(6, { j: n - 1, i: 0 });
    for (li = 1; li < m; li++) { g[li][0] += g[li - 1][0]; P(6, { j: 0, i: li }); }
    for (li = 1; li < m; li++) {
      for (lj = 1; lj < n; lj++) {
        P(8, { j: lj, i: li });
        g[li][lj] += Math.min(g[li - 1][lj], g[li][lj - 1]);
        P(9, { j: lj, i: li });
      }
    }
    P(10, { j: n - 1, i: m - 1, 答案: g[m - 1][n - 1] });
    return S;
  };
})();
