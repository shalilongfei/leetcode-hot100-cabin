/* verify4 — 独立实现：76~100 号题（贪心 / DP / 技巧） */
;(function () {
  const V = window.VERIFY;
  const arr = p => p.viz.arr;
  const num = v => (typeof v === "number" ? v : Number(v));
  const GR = p => p.viz.grid;

  /* 121 买卖股票 */
  V[121] = p => {
    const a = arr(p).map(num);
    let low = Infinity, prof = 0;
    a.forEach(x => { low = Math.min(low, x); prof = Math.max(prof, x - low); });
    return prof;
  };

  /* 55 跳跃游戏 */
  V[55] = p => {
    const a = arr(p).map(num);
    let far = 0;
    for (let i = 0; i < a.length; i++) {
      if (i > far) return "false";
      far = Math.max(far, i + a[i]);
    }
    return "true";
  };

  /* 45 跳跃游戏 II */
  V[45] = p => {
    const a = arr(p).map(num), n = a.length;
    let end = 0, far = 0, steps = 0;
    for (let i = 0; i < n - 1; i++) {
      far = Math.max(far, i + a[i]);
      if (i === end) { steps++; end = far; }
    }
    return steps;
  };

  /* 763 划分字母区间 */
  V[763] = p => {
    const s = arr(p), last = {};
    s.forEach((c, i) => last[c] = i);
    const res = [];
    let st = 0, e = 0;
    s.forEach((c, i) => {
      e = Math.max(e, last[c]);
      if (i === e) { res.push(e - st + 1); st = i + 1; }
    });
    return res.join(",");
  };

  /* 70 爬楼梯 */
  V[70] = p => {
    const n = 5;
    let a = 1, b = 1;
    for (let i = 0; i < n; i++) { const t = a + b; a = b; b = t; }
    return a;
  };

  /* 118 杨辉三角 */
  V[118] = p => {
    const n = 4, res = [];
    for (let i = 0; i < n; i++) {
      const row = new Array(i + 1).fill(1);
      for (let j = 1; j < i; j++) row[j] = res[i - 1][j - 1] + res[i - 1][j];
      res.push(row);
    }
    return JSON.stringify(res).replace(/ /g, "");
  };

  /* 198 打家劫舍 */
  V[198] = p => {
    const a = p.viz.dp.map(num);
    let p2 = 0, p1 = 0;
    a.forEach(x => { const cur = Math.max(p1, p2 + x); p2 = p1; p1 = cur; });
    return p1;
  };

  /* 279 完全平方数 */
  V[279] = p => {
    const n = p.viz.dp.length - 1;
    const dp = new Array(n + 1).fill(Infinity);
    dp[0] = 0;
    for (let i = 1; i <= n; i++) for (let j = 1; j * j <= i; j++) dp[i] = Math.min(dp[i], dp[i - j * j] + 1);
    return dp[n];
  };

  /* 322 零钱兑换 */
  V[322] = p => {
    const coins = [1, 2, 5], amount = p.viz.dp.length - 1;
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    for (let i = 1; i <= amount; i++) coins.forEach(c => { if (c <= i) dp[i] = Math.min(dp[i], dp[i - c] + 1); });
    return dp[amount] > amount ? -1 : dp[amount];
  };

  /* 139 单词拆分 */
  V[139] = p => {
    const s = arr(p).join(""), dict = new Set(["leet", "code"]), n = s.length;
    const dp = new Array(n + 1).fill(false);
    dp[0] = true;
    for (let i = 1; i <= n; i++) for (let j = 0; j < i; j++) if (dp[j] && dict.has(s.slice(j, i))) dp[i] = true;
    return String(dp[n]);
  };

  /* 300 最长递增子序列 */
  V[300] = p => {
    const a = arr(p).map(num), tails = [];
    a.forEach(x => {
      let lo = 0, hi = tails.length;
      while (lo < hi) { const m = (lo + hi) >> 1; if (tails[m] < x) lo = m + 1; else hi = m; }
      tails[lo] = x;
    });
    return tails.length;
  };

  /* 152 乘积最大子数组 */
  V[152] = p => {
    const a = arr(p).map(num);
    let mx = a[0], mn = a[0], best = a[0];
    for (let i = 1; i < a.length; i++) {
      const t1 = mx * a[i], t2 = mn * a[i];
      mx = Math.max(a[i], t1, t2); mn = Math.min(a[i], t1, t2);
      best = Math.max(best, mx);
    }
    return best;
  };

  /* 416 分割等和子集 */
  V[416] = p => {
    const a = [1, 5, 11, 5], total = a.reduce((x, y) => x + y, 0);
    if (total & 1) return "false";
    const tg = total / 2, dp = new Array(tg + 1).fill(false);
    dp[0] = true;
    a.forEach(x => { for (let j = tg; j >= x; j--) dp[j] = dp[j] || dp[j - x]; });
    return String(dp[tg]);
  };

  /* 32 最长有效括号 */
  V[32] = p => {
    const s = arr(p), st = [-1];
    let best = 0;
    s.forEach((c, i) => {
      if (c === "(") st.push(i);
      else { st.pop(); if (!st.length) st.push(i); else best = Math.max(best, i - st[st.length - 1]); }
    });
    return best;
  };

  /* 62 不同路径 m×n */
  V[62] = p => {
    const m = 3, n = 3;
    const dp = new Array(n).fill(1);
    for (let i = 1; i < m; i++) for (let j = 1; j < n; j++) dp[j] += dp[j - 1];
    return dp[n - 1];
  };

  /* 64 最小路径和 */
  V[64] = p => {
    const g = GR(p).map(r => r.slice()), m = g.length, n = g[0].length;
    for (let j = 1; j < n; j++) g[0][j] += g[0][j - 1];
    for (let i = 1; i < m; i++) g[i][0] += g[i - 1][0];
    for (let i = 1; i < m; i++) for (let j = 1; j < n; j++) g[i][j] += Math.min(g[i - 1][j], g[i][j - 1]);
    return g[m - 1][n - 1];
  };

  /* 5 最长回文子串 */
  V[5] = p => {
    const s = arr(p);
    let st = 0, len = 1;
    const grow = (l, r) => { while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++; } return r - l - 1; };
    for (let i = 0; i < s.length; i++) {
      const l1 = grow(i, i), l2 = grow(i, i + 1);
      const L = Math.max(l1, l2);
      if (L > len) { len = L; st = i - Math.floor((L - 1) / 2); }
    }
    return s.slice(st, st + len).join("");
  };

  /* 1143 LCS */
  V[1143] = p => {
    const a = "abcde", b = "ace";
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    return dp[m][n];
  };

  /* 72 编辑距离 */
  V[72] = p => {
    const w1 = "horse", w2 = "ros";
    const m = w1.length, n = w2.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++)
      dp[i][j] = w1[i - 1] === w2[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    return dp[m][n];
  };

  /* 136 只出现一次 */
  V[136] = p => arr(p).map(num).reduce((x, y) => x ^ y, 0);

  /* 169 多数元素 */
  V[169] = p => {
    const a = arr(p).map(num);
    let cand = null, cnt = 0;
    a.forEach(x => { if (cnt === 0) { cand = x; cnt = 1; } else cnt += x === cand ? 1 : -1; });
    return cand;
  };

  /* 75 颜色分类 */
  V[75] = p => {
    const a = arr(p).map(num).slice().sort((x, y) => x - y);
    return a.join(",");
  };

  /* 31 下一个排列 */
  V[31] = p => {
    const a = arr(p).map(num).slice(), n = a.length;
    let i = n - 2;
    while (i >= 0 && a[i] >= a[i + 1]) i--;
    if (i >= 0) { let j = n - 1; while (a[j] <= a[i]) j--; [a[i], a[j]] = [a[j], a[i]]; }
    for (let l = i + 1, r = n - 1; l < r; l++, r--) { const t = a[l]; a[l] = a[r]; a[r] = t; }
    return a.join(",");
  };

  /* 287 寻找重复数 */
  V[287] = p => {
    const a = arr(p).map(num);
    let s = a[0], f = a[a[0]];
    while (s !== f) { s = a[s]; f = a[a[f]]; }
    let q = 0;
    while (q !== s) { q = a[q]; s = a[s]; }
    return q;
  };
})();
