/* step26 — 逐帧独立实现：322 / 139 */
;(function () {
  const R = window.REPLAY;

  /* 322 零钱兑换 */
  R[322] = p => {
    const amount = 11, coins = [1, 2, 5], S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    const INF = amount + 1;
    const dp = new Array(amount + 1).fill(INF);
    dp[0] = 0;
    P(4, { i: 1, coins: coins.join(",") });
    P(6, { i: 1, coins: coins.join(",") });
    for (let i = 1; i <= amount; i++) {
      P(7, { i, coins: coins.join(",") });
      for (const c of coins) {
        if (c > i) break;
        dp[i] = Math.min(dp[i], dp[i - c] + 1);
        P(9, { i, coins: coins.join(",") });
      }
    }
    P(10, { i: amount, coins: coins.join(","), 答案: dp[amount] });
    return S;
  };

  /* 139 单词拆分 */
  R[139] = p => {
    const s = p.viz.arr.join(""), n = s.length, S = [];
    const dict = ["leet", "code"], maxLen = 4;
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    const dp = new Array(n + 1).fill(false);
    dp[0] = true;
    P(4, { maxLen: 0, i: 1 });
    P(5, { maxLen, i: 1 });
    P(8, { maxLen: 0, i: 1, 目标: s });
    let lastJ = 0;
    for (let i = 1; i <= n; i++) {
      P(9, lastJ ? { maxLen: 0, i, 目标: s, j: lastJ } : { maxLen: 0, i, 目标: s });
      for (let j = Math.max(0, i - maxLen); j < i; j++) {
        lastJ = j;
        const ok = dp[j] && dict.indexOf(s.slice(j, i)) >= 0;
        P(11, { maxLen: 0, i, 目标: s, j });
        if (ok) { dp[i] = true; P(11, { maxLen: 0, i, 目标: s, j }); break; }
      }
    }
    P(13, { maxLen: 0, i: n, 目标: s, j: lastJ, 答案: String(dp[n]) });
    return S;
  };
})();
