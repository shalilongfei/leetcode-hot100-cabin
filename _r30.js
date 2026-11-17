/* step30 — 逐帧独立实现：1143 / 32 / 279 */
;(function () {
  const R = window.REPLAY;

  /* 1143 最长公共子序列 */
  R[1143] = p => {
    const A = "abcde", B = "ace", m = A.length, n = B.length, S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    P(4, { i: 1, j: 1 });
    P(5, { i: 1, j: 1 });
    let li = 1, lj = 1;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        li = i; lj = j;
        P(8, { i, j });
        if (A[i - 1] === B[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
          P(9, { i, j });
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
          P(10, { i, j });
        }
      }
    }
    P(11, { i: m, j: n, 答案: dp[m][n] });
    return S;
  };

  /* 32 最长有效括号 */
  R[32] = p => {
    const s = p.viz.arr, n = s.length, S = [], st = [-1];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    let best = 0;
    P(5, { best, i: 0 });
    P(6, { best, i: 0 });
    for (let i = 0; i < n; i++) {
      P(7, { best, i });
      if (s[i] === "(") {
        st.push(i);
        P(8, { best, i });
      } else {
        st.pop();
        P(10, { best, i });
        if (st.length) {
          best = Math.max(best, i - st[st.length - 1]);
          P(12, { best, i });
        } else {
          st.push(i);
          P(11, { best, i });
        }
      }
    }
    P(15, { best, i: n - 1, 答案: best });
    return S;
  };

  /* 279 完全平方数 */
  R[279] = p => {
    const n = 12, S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    const dp = new Array(n + 1).fill(Infinity);
    dp[0] = 0;
    P(5, { i: 1, j: 1 });
    let li = 1, lj = 1;
    for (let i = 1; i <= n; i++) {
      li = i;
      P(6, { i, j: lj });
      for (let j = 1; j * j <= i; j++) {
        lj = j;
        dp[i] = Math.min(dp[i], dp[i - j * j] + 1);
        P(8, { i, j });
      }
    }
    P(9, { i: n, j: 3, 答案: dp[n] });
    return S;
  };
})();
