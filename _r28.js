/* step28 — 逐帧独立实现：152 / 72 */
;(function () {
  const R = window.REPLAY;

  /* 152 乘积最大子数组 */
  R[152] = p => {
    const a = [2, 3, -2, 4], S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    let mx = a[0], mn = a[0], best = a[0], i = 1;
    P(4, { i, mx, mn, best });
    for (i = 1; i < a.length; i++) {
      const x = a[i];
      P(5, { i, mx, mn, best });
      const c1 = x, c2 = mx * x, c3 = mn * x;
      P(6, { i, mx, mn, best });
      const nmx = Math.max(c1, c2, c3);
      P(7, { i, mx: nmx, mn, best });
      const nmn = Math.min(c1, c2, c3);
      mx = nmx; mn = nmn;
      P(8, { i, mx, mn, best });
      best = Math.max(best, mx);
      P(9, { i, mx, mn, best });
    }
    P(11, { i: a.length - 1, mx, mn, best, 答案: best });
    return S;
  };

  /* 72 编辑距离 */
  R[72] = p => {
    const w1 = "horse", w2 = "ros", m = w1.length, n = w2.length, S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    P(4, { i: 1, j: 1 });
    P(6, { i: 1, j: 1 });
    P(7, { i: 1, j: 1 });
    let li = 1, lj = 1;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        li = i; lj = j;
        P(9, { i, j });
        if (w1[i - 1] === w2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
          P(10, { i, j });
        } else {
          dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
          P(11, { i, j });
        }
      }
    }
    P(15, { i: m, j: n, 答案: dp[m][n] });
    return S;
  };
})();
