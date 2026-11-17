/* dbg6 — 贪心 4 + DP 10 + 多维 DP 5 + 技巧 5 */
;(function () {
  const cp = window.DBG.cp;
  const mk = (S) => (l, n, s) => S.push(Object.assign({ line: l, note: n }, s || {}));

  /* 121 买卖股票 */
  window.DBG[121] = p => {
    const S = [], a = p.viz.arr, F = mk(S);
    let low = Infinity, profit = 0;
    F(4, "low = ∞, profit = 0", { bars: a, vars: { low: "∞", profit } });
    a.forEach((x, i) => {
      F(5, `prices[${i}] = ${x}`, { bars: a, ptr: { i }, hi: [i], vars: { low, profit } });
      low = Math.min(low, x);
      F(6, `low = min(low, ${x}) = ${low}`, { bars: a, ptr: { i }, vars: { low, profit } });
      profit = Math.max(profit, x - low);
      F(7, `profit = max(profit, ${x} - ${low}) = ${profit}`, { bars: a, ptr: { i }, done: [i], vars: { low, profit } });
    });
    F(9, `return ${profit}`, { bars: a, vars: { 答案: profit } });
    return S;
  };

  /* 55 跳跃游戏 */
  window.DBG[55] = p => {
    const S = [], a = p.viz.arr, F = mk(S);
    let far = 0;
    F(4, "far = 0", { arr: a, vars: { far } });
    for (let i = 0; i < a.length; i++) {
      F(5, `i = ${i}`, { arr: a, ptr: { i }, vars: { far } });
      if (i > far) { F(6, `i > far(${far}) → return false`, { arr: a, ptr: { i }, vars: { 答案: "false" } }); return S; }
      F(6, `i <= far(${far}) 可以到`, { arr: a, ptr: { i }, vars: { far } });
      far = Math.max(far, i + a[i]);
      F(7, `far = max(far, ${i} + ${a[i]}) = ${far}`, { arr: a, ptr: { i }, hi: [i], done: [i], vars: { far } });
    }
    F(9, "return true", { arr: a, done: a.map((_, i) => i), vars: { 答案: "true" } });
    return S;
  };

  /* 45 跳跃游戏 II */
  window.DBG[45] = p => {
    const S = [], a = p.viz.arr, F = mk(S);
    let end = 0, far = 0, steps = 0;
    F(4, "end = far = steps = 0", { arr: a, vars: { end, far, steps } });
    for (let i = 0; i < a.length - 1; i++) {
      F(5, `i = ${i}`, { arr: a, ptr: { i }, win: [0, end], vars: { end, far, steps } });
      far = Math.max(far, i + a[i]);
      F(6, `far = max(far, ${i}+${a[i]}) = ${far}`, { arr: a, ptr: { i }, vars: { end, far, steps } });
      if (i === end) {
        steps++;
        F(8, `i == end → ++steps = ${steps}`, { arr: a, win: [0, end], vars: { end, far, steps } });
        end = far;
        F(9, `end = far = ${end}（进入下一跳的范围）`, { arr: a, win: [0, end], vars: { end, far, steps } });
      }
    }
    F(10, `return ${steps}`, { arr: a, vars: { 答案: steps } });
    return S;
  };

  /* 763 划分字母区间 */
  window.DBG[763] = p => {
    const S = [], a = p.viz.arr, F = mk(S);
    const last = {}; a.forEach((c, i) => last[c] = i);
    F(4, `记录每个字母最后位置`, { arr: a, map: cp(last) });
    let start = 0, end = 0; const res = [];
    a.forEach((c, i) => {
      F(5, `i = ${i}（'${c}'）`, { arr: a, ptr: { i }, win: [start, end], map: cp(last) });
      end = Math.max(end, last[c]);
      F(6, `end = max(end, last['${c}']) = ${end}`, { arr: a, ptr: { i }, win: [start, end], map: cp(last) });
      if (i === end) {
        res.push(end - start + 1);
        F(7, `i == end → 切一刀，长度 ${end - start + 1}`, { arr: a, win: [start, end], hi: [end], vars: { res: res.join(",") } });
        start = i + 1;
        F(8, `start = ${start}`, { arr: a, win: [start, start], vars: { res: res.join(",") } });
      }
    });
    F(9, `return [${res}]`, { arr: a, vars: { 答案: res.join(",") } });
    return S;
  };

  /* 70 爬楼梯 */
  window.DBG[70] = p => {
    const S = [], F = mk(S);
    let a = 1, b = 1;
    F(4, "a = 1, b = 1", { dp: [1, 1], vars: { a, b } });
    for (let i = 0; i < 5; i++) {
      F(5, `i = ${i}：a, b = b, a+b`, { dp: [a, b], vars: { a, b } });
      const t = a + b; a = b; b = t;
      F(5, `→ a = ${a}, b = ${b}`, { dp: [a, b], vars: { a, b, f: b } });
    }
    F(6, `return ${a}`, { dp: [a], vars: { 答案: a } });
    return S;
  };

  /* 118 杨辉三角 */
  window.DBG[118] = p => {
    const S = [], F = mk(S);
    const res = [];
    F(4, "res = []", { dp: [] });
    for (let i = 0; i < 4; i++) {
      const row = new Array(i + 1).fill(1);
      F(5, `第 ${i} 行：先全填 1`, { dp: row.slice(), vars: { i } });
      for (let j = 1; j < i; j++) {
        row[j] = res[i - 1][j - 1] + res[i - 1][j];
        F(6, `row[${j}] = 上行 ${j - 1} + ${j} = ${row[j]}`, { dp: row.slice(), dpHi: [j], vars: { i, j } });
      }
      res.push(row.slice());
      F(5, `res.push_back([${row}])`, { dp: row.slice(), vars: { 行数: res.length } });
    }
    F(7, "return res", { dp: res.flat(), vars: { 答案: JSON.stringify(res) } });
    return S;
  };

  /* 198 打家劫舍 */
  window.DBG[198] = p => {
    const S = [], a = p.viz.dp, F = mk(S);
    let p2 = 0, p1 = 0;
    F(4, "p2 = p1 = 0", { arr: a, vars: { p2, p1 } });
    a.forEach((x, i) => {
      F(5, `第 ${i + 1} 家：${x}`, { arr: a, ptr: { i }, vars: { p2, p1 } });
      const cur = Math.max(p1, p2 + x);
      F(5, `max(不偷 ${p1}, 偷 ${p2} + ${x}) = ${cur}`, { arr: a, ptr: { i }, hi: [i], vars: { p2, p1, cur } });
      p2 = p1; p1 = cur;
      F(6, `p2 = ${p2}, p1 = ${p1}`, { arr: a, ptr: { i }, done: [i], vars: { p2, p1 } });
    });
    F(7, `return ${p1}`, { arr: a, vars: { 答案: p1 } });
    return S;
  };

  /* 279 完全平方数 */
  window.DBG[279] = p => {
    const S = [], dp = p.viz.dp, F = mk(S);
    const D = dp.map(() => Infinity); D[0] = 0;
    F(4, "dp 全 ∞，dp[0] = 0", { dp: [0] });
    for (let i = 1; i < dp.length; i++) {
      F(6, `i = ${i}（要凑出 ${i}）`, { dp: D.slice(0, i + 1), dpHi: [i], vars: { i } });
      for (let j = 1; j * j <= i; j++) {
        D[i] = Math.min(D[i], D[i - j * j] + 1);
        F(8, `j = ${j}：dp[${i}] = min(dp[${i}], dp[${i - j * j}] + 1) = ${D[i]}`, { dp: D.slice(0, i + 1), dpHi: [i], vars: { i, j } });
      }
    }
    F(9, `return dp[${dp.length - 1}] = ${D[D.length - 1]}`, { dp: D.slice(), dpDone: D.map((_, k) => k), vars: { 答案: D[D.length - 1] } });
    return S;
  };

  /* 322 零钱兑换 */
  window.DBG[322] = p => {
    const S = [], dp = p.viz.dp, F = mk(S);
    const coins = [1, 2, 5], D = new Array(dp.length).fill(Infinity);
    D[0] = 0;
    F(4, "dp 全 ∞，dp[0] = 0", { dp: [0], vars: { coins: coins.join(",") } });
    for (let i = 1; i < dp.length; i++) {
      F(5, `i = ${i}`, { dp: D.slice(0, i + 1), dpHi: [i] });
      for (const c of coins) {
        if (c <= i) {
          D[i] = Math.min(D[i], D[i - c] + 1);
          F(6, `coin ${c}：dp[${i}] = min(dp[${i}], dp[${i - c}] + 1) = ${D[i]}`, { dp: D.slice(0, i + 1), dpHi: [i], vars: { coin: c } });
        }
      }
    }
    F(8, `return ${D[dp.length - 1] > dp.length ? -1 : D[dp.length - 1]}`, { dp: D.slice(), vars: { 答案: D[dp.length - 1] } });
    return S;
  };

  /* 139 单词拆分 */
  window.DBG[139] = p => {
    const S = [], s = p.viz.arr, w = "leetcode", F = mk(S);
    const dp = new Array(s.length + 1).fill(false); dp[0] = true;
    const dict = ["leet", "code"];
    F(4, `set = {${dict}}`, { arr: s, map: { 词典: dict.join(",") } });
    F(5, "dp[0] = true，其余 false", { arr: s, dp: [1], vars: { 目标: w } });
    for (let i = 1; i <= s.length; i++) {
      F(6, `i = ${i}`, { arr: s, dp: dp.map(v => v ? 1 : 0), dpHi: [i], win: [0, i] });
      for (let j = Math.max(0, i - 4); j < i; j++) {
        const sub = s.slice(j, i).join("");
        const hit = dp[j] && dict.includes(sub);
        F(7, `j = ${j}：dp[${j}] = ${dp[j]}，子串 "${sub}" 在词典？${dict.includes(sub)}`, { arr: s, dp: dp.map(v => v ? 1 : 0), hi: Array.from({ length: i - j }, (_, k) => j + k), vars: { sub } });
        if (hit) { dp[i] = true; F(8, `→ dp[${i}] = true，break`, { arr: s, dp: dp.map(v => v ? 1 : 0), dpHi: [i] }); break; }
      }
    }
    F(10, `return ${dp[s.length]}`, { arr: s, dp: dp.map(v => v ? 1 : 0), vars: { 答案: String(dp[s.length]) } });
    return S;
  };

  /* 300 LIS */
  window.DBG[300] = p => {
    const S = [], a = p.viz.arr, F = mk(S);
    const tails = [];
    F(4, "tails = []", { arr: a, stack: [] });
    a.forEach((x, i) => {
      F(5, `x = ${x}`, { arr: a, ptr: { i }, hi: [i], stack: tails.slice() });
      let lo = 0, hi = tails.length;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        F(6, `二分：lo=${lo}, hi=${hi}, mid=${mid}（tails[mid]=${tails[mid]}）`, { arr: a, ptr: { i }, stack: tails.slice(), vars: { lo, hi, mid } });
        if (tails[mid] < x) lo = mid + 1; else hi = mid;
      }
      if (lo === tails.length) { tails.push(x); F(7, `追加 ${x} → tails=[${tails}]`, { arr: a, stack: tails.slice(), vars: { 长度: tails.length } }); }
      else { const old = tails[lo]; tails[lo] = x; F(7, `替换 tails[${lo}]：${old} → ${x}`, { arr: a, stack: tails.slice(), vars: { 长度: tails.length } }); }
    });
    F(9, `return ${tails.length}`, { arr: a, stack: tails.slice(), vars: { 答案: tails.length } });
    return S;
  };

  /* 152 乘积最大子数组 */
  window.DBG[152] = p => {
    const S = [], a = p.viz.arr, F = mk(S);
    let mx = a[0], mn = a[0], best = a[0];
    F(4, `mx = mn = best = ${a[0]}`, { arr: a, vars: { mx, mn, best } });
    for (let i = 1; i < a.length; i++) {
      F(5, `x = ${a[i]}`, { arr: a, ptr: { i }, hi: [i], vars: { mx, mn, best } });
      const t1 = mx * a[i], t2 = mn * a[i];
      F(6, `候选：${a[i]}, ${t1}, ${t2}`, { arr: a, ptr: { i }, vars: { t1, t2 } });
      mx = Math.max(a[i], t1, t2);
      F(7, `mx = max(${a[i]}, ${t1}, ${t2}) = ${mx}`, { arr: a, ptr: { i }, vars: { mx, best } });
      mn = Math.min(a[i], t1, t2);
      F(8, `mn = min(${a[i]}, ${t1}, ${t2}) = ${mn}`, { arr: a, ptr: { i }, vars: { mx, mn, best } });
      best = Math.max(best, mx);
      F(8, `best = ${best}`, { arr: a, ptr: { i }, done: [i], vars: { mx, mn, best } });
    }
    F(9, `return ${best}`, { arr: a, vars: { 答案: best } });
    return S;
  };

  /* 416 分割等和子集 */
  window.DBG[416] = p => {
    const S = [], F = mk(S);
    const nums = [1, 5, 11, 5], target = 11;
    const dp = new Array(target + 1).fill(false); dp[0] = true;
    F(4, `total = 22，target = ${target}`, { arr: nums, dp: dp.map(v => v ? 1 : 0) });
    F(5, "dp[0] = true", { arr: nums, dp: dp.map(v => v ? 1 : 0) });
    nums.forEach((x, i) => {
      F(6, `处理 ${x}`, { arr: nums, ptr: { i }, hi: [i], dp: dp.map(v => v ? 1 : 0) });
      for (let j = target; j >= x; j--) {
        if (dp[j - x]) dp[j] = true;
        F(7, `j=${j} 倒序：dp[${j}] = dp[${j}] || dp[${j - x}] → ${dp[j]}`, { arr: nums, dp: dp.map(v => v ? 1 : 0), dpHi: [j], vars: { x } });
      }
    });
    F(9, `return ${dp[target]}`, { arr: nums, dp: dp.map(v => v ? 1 : 0), vars: { 答案: String(dp[target]) } });
    return S;
  };

  /* 32 最长有效括号 */
  window.DBG[32] = p => {
    const S = [], s = p.viz.arr, F = mk(S);
    const st = [-1]; let best = 0;
    F(4, "stack = {-1}（哨兵）", { arr: s, stack: ["-1"] });
    F(5, "best = 0", { arr: s, stack: ["-1"], vars: { best } });
    s.forEach((c, i) => {
      F(6, `i = ${i}（'${c}'）`, { arr: s, ptr: { i }, stack: st.map(String) });
      if (c === "(") { st.push(i); F(7, `push(${i})`, { arr: s, ptr: { i }, hi: [i], stack: st.map(String) }); }
      else {
        st.pop();
        F(9, "')' → pop", { arr: s, ptr: { i }, stack: st.map(String) });
        if (!st.length) { st.push(i); F(10, `栈空 → push(${i}) 作新基准`, { arr: s, ptr: { i }, stack: st.map(String) }); }
        else { best = Math.max(best, i - st[st.length - 1]); F(11, `best = max(best, ${i} - ${st[st.length - 1]}) = ${best}`, { arr: s, ptr: { i }, stack: st.map(String), vars: { best } }); }
      }
    });
    F(14, `return ${best}`, { arr: s, vars: { 答案: best } });
    return S;
  };

  /* 62 不同路径 */
  window.DBG[62] = p => {
    const S = [], F = mk(S);
    const m = 3, n = 3, dp = new Array(n).fill(1);
    F(4, "dp 全 1（第一行）", { dp: dp.slice(), dpDim: n });
    for (let i = 1; i < m; i++) {
      F(5, `i = ${i}`, { dp: dp.slice(), dpDim: n });
      for (let j = 1; j < n; j++) {
        dp[j] += dp[j - 1];
        F(6, `dp[${j}] += dp[${j - 1}] → ${dp[j]}`, { dp: dp.slice(), dpDim: n, dpHi: [j] });
      }
    }
    F(7, `return ${dp[n - 1]}`, { dp: dp.slice(), dpDim: n, vars: { 答案: dp[n - 1] } });
    return S;
  };

  /* 64 最小路径和 */
  window.DBG[64] = p => {
    const S = [], g = p.viz.grid.map(r => r.slice()), m = g.length, n = g[0].length, F = mk(S);
    const G = () => g.map(r => r.slice());
    F(4, "第一行前缀和", { grid: G() });
    for (let j = 1; j < n; j++) { g[0][j] += g[0][j - 1]; F(4, `grid[0][${j}] = ${g[0][j]}`, { grid: G(), gridHi: ["0," + j] }); }
    F(5, "第一列前缀和", { grid: G() });
    for (let i = 1; i < m; i++) { g[i][0] += g[i - 1][0]; F(5, `grid[${i}][0] = ${g[i][0]}`, { grid: G(), gridHi: [i + ",0"] }); }
    for (let i = 1; i < m; i++)
      for (let j = 1; j < n; j++) {
        F(6, `(${i},${j})`, { grid: G(), gridHi: [i + "," + j] });
        g[i][j] += Math.min(g[i - 1][j], g[i][j - 1]);
        F(7, `+= min(上 ${g[i - 1][j]}, 左 ${g[i][j - 1]}) → ${g[i][j]}`, { grid: G(), gridHi: [i + "," + j] });
      }
    F(8, `return ${g[m - 1][n - 1]}`, { grid: G(), vars: { 答案: g[m - 1][n - 1] } });
    return S;
  };

  /* 5 最长回文子串 */
  window.DBG[5] = p => {
    const S = [], s = p.viz.arr, F = mk(S);
    let start = 0, maxLen = 1;
    F(4, `start = 0, maxLen = 1`, { arr: s, vars: { maxLen } });
    for (let i = 0; i < s.length; i++) {
      [[i, i], [i, i + 1]].forEach(([l0, r0]) => {
        F(6, `中心 (${l0},${r0})`, { arr: s, ptr: { l: l0, r: r0 }, hi: [l0] });
        let l = l0, r = r0;
        while (l >= 0 && r < s.length && s[l] === s[r]) {
          F(7, `s[${l}]==s[${r}]='${s[l]}' → 扩展`, { arr: s, ptr: { l, r }, win: [l, r] });
          l--; r++;
        }
        const len = r - l - 1;
        F(8, `len = ${len}`, { arr: s, win: [l + 1, r - 1], vars: { len, maxLen } });
        if (len > maxLen) { maxLen = len; start = l + 1; F(9, `更新 start=${start}, maxLen=${maxLen}`, { arr: s, win: [start, start + maxLen - 1], vars: { maxLen } }); }
      });
    }
    F(10, `return "${s.slice(start, start + maxLen).join("")}"`, { arr: s, win: [start, start + maxLen - 1], vars: { 答案: s.slice(start, start + maxLen).join("") } });
    return S;
  };

  /* 1143 LCS */
  window.DBG[1143] = p => {
    const S = [], F = mk(S);
    const A = "abcde", B = "ace", cols = B.length + 1;
    const dp = Array.from({ length: A.length + 1 }, () => new Array(cols).fill(0));
    const flat = () => dp.flat();
    F(4, `dp[${A.length + 1}][${cols}] 全 0`, { dp: flat(), dpDim: cols, vars: { A, B } });
    for (let i = 1; i <= A.length; i++)
      for (let j = 1; j <= B.length; j++) {
        const k = i * cols + j;
        F(5, `i=${i}('${A[i - 1]}'), j=${j}('${B[j - 1]}')`, { dp: flat(), dpDim: cols, dpHi: [k] });
        if (A[i - 1] === B[j - 1]) { dp[i][j] = dp[i - 1][j - 1] + 1; F(7, `相同 → 左上 + 1 = ${dp[i][j]}`, { dp: flat(), dpDim: cols, dpHi: [k] }); }
        else { dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]); F(9, `不同 → max(上, 左) = ${dp[i][j]}`, { dp: flat(), dpDim: cols, dpHi: [k] }); }
      }
    F(10, `return ${dp[A.length][B.length]}`, { dp: flat(), dpDim: cols, vars: { 答案: dp[A.length][B.length] } });
    return S;
  };

  /* 72 编辑距离 */
  window.DBG[72] = p => {
    const S = [], F = mk(S);
    const A = "horse", B = "ros", cols = B.length + 1;
    const dp = Array.from({ length: A.length + 1 }, (_, i) => new Array(cols).fill(0).map((_, j) => i === 0 ? j : 0));
    dp.forEach((row, i) => row[0] = i);
    const flat = () => dp.flat();
    F(4, "dp[i][0] = i", { dp: flat(), dpDim: cols });
    F(5, "dp[0][j] = j", { dp: flat(), dpDim: cols });
    for (let i = 1; i <= A.length; i++)
      for (let j = 1; j <= B.length; j++) {
        const k = i * cols + j;
        F(6, `i=${i}, j=${j}`, { dp: flat(), dpDim: cols, dpHi: [k] });
        if (A[i - 1] === B[j - 1]) { dp[i][j] = dp[i - 1][j - 1]; F(7, `相同 → 继承左上 = ${dp[i][j]}`, { dp: flat(), dpDim: cols, dpHi: [k] }); }
        else {
          dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
          F(9, `不同 → 1 + min(替换, 删除, 插入) = ${dp[i][j]}`, { dp: flat(), dpDim: cols, dpHi: [k] });
        }
      }
    F(10, `return ${dp[A.length][B.length]}`, { dp: flat(), dpDim: cols, vars: { 答案: dp[A.length][B.length] } });
    return S;
  };

  /* 136 只出现一次 */
  window.DBG[136] = p => {
    const S = [], a = p.viz.arr, F = mk(S);
    let ans = 0;
    F(4, "ans = 0", { arr: a, vars: { ans } });
    a.forEach((x, i) => {
      F(5, `ans ^= ${x}`, { arr: a, ptr: { i }, hi: [i], vars: { ans } });
      ans ^= x;
      F(5, `→ ${ans}`, { arr: a, ptr: { i }, hi: [i], vars: { ans } });
    });
    F(6, `return ${ans}`, { arr: a, vars: { 答案: ans } });
    return S;
  };

  /* 169 多数元素 */
  window.DBG[169] = p => {
    const S = [], a = p.viz.arr, F = mk(S);
    let cand = null, cnt = 0;
    F(4, "cand = ?, cnt = 0", { arr: a, vars: { cnt } });
    a.forEach((x, i) => {
      F(5, `x = ${x}`, { arr: a, ptr: { i }, hi: [i], vars: { cand: cand == null ? "-" : cand, cnt } });
      if (cnt === 0) { cand = x; F(6, `cnt == 0 → cand = ${x}`, { arr: a, ptr: { i }, vars: { cand, cnt } }); }
      cnt += (x === cand) ? 1 : -1;
      F(7, `cnt ${x === cand ? "+1" : "-1"} = ${cnt}`, { arr: a, ptr: { i }, vars: { cand, cnt } });
    });
    F(8, `return ${cand}`, { arr: a, vars: { 答案: cand } });
    return S;
  };

  /* 75 颜色分类 */
  window.DBG[75] = p => {
    const S = [], a = p.viz.arr.slice(), F = mk(S);
    let p0 = 0, i = 0, p2 = a.length - 1;
    F(4, "p0 = 0, i = 0, p2 = n-1", { arr: a.slice(), ptr: { p0, i, p2 } });
    while (i <= p2) {
      F(5, `while (${i} <= ${p2})`, { arr: a.slice(), ptr: { p0, i, p2 } });
      if (a[i] === 0) {
        const t = a[p0]; a[p0] = a[i]; a[i] = t;
        F(6, `nums[${i}]==0 → swap(p0,i)，p0++ i++`, { arr: a.slice(), ptr: { p0: p0 + 1, i: i + 1, p2 }, hi: [p0, i] });
        p0++; i++;
      } else if (a[i] === 2) {
        const t = a[p2]; a[p2] = a[i]; a[i] = t;
        F(8, `nums[${i}]==2 → swap(i,p2)，p2--（i 不动）`, { arr: a.slice(), ptr: { p0, i, p2: p2 - 1 }, hi: [i, p2] });
        p2--;
      } else {
        F(10, `nums[${i}]==1 → i++`, { arr: a.slice(), ptr: { p0, i: i + 1, p2 } });
        i++;
      }
    }
    F(11, "return nums", { arr: a.slice(), done: a.map((_, k) => k), vars: { 答案: a.join(",") } });
    return S;
  };

  /* 31 下一个排列 */
  window.DBG[31] = p => {
    const S = [], a = p.viz.arr.slice(), n = a.length, F = mk(S);
    let i = n - 2;
    F(4, `i = n - 2 = ${i}`, { arr: a.slice(), ptr: { i } });
    while (i >= 0 && a[i] >= a[i + 1]) { F(5, `a[${i}]=${a[i]} >= a[${i + 1}]=${a[i + 1]} → i--`, { arr: a.slice(), ptr: { i }, hi: [i, i + 1] }); i--; }
    F(5, `停下：i = ${i}`, { arr: a.slice(), ptr: { i }, hi: i >= 0 ? [i, i + 1] : [] });
    if (i >= 0) {
      let j = n - 1;
      F(6, `找最小的 > a[${i}]`, { arr: a.slice(), ptr: { i, j } });
      while (a[j] <= a[i]) { j--; F(6, `a[${j + 1}] <= a[${i}] → j = ${j}`, { arr: a.slice(), ptr: { i, j } }); }
      const t = a[i]; a[i] = a[j]; a[j] = t;
      F(7, `swap(${i}, ${j})`, { arr: a.slice(), hi: [i, j] });
    }
    F(8, `reverse(${i + 1}, ${n - 1})`, { arr: a.slice(), win: [i + 1, n - 1] });
    let l = i + 1, r = n - 1;
    while (l < r) { const t = a[l]; a[l] = a[r]; a[r] = t; l++; r--; }
    F(8, `结果 ${a}`, { arr: a.slice(), done: a.map((_, k) => k), vars: { 答案: a.join(",") } });
    return S;
  };

  /* 287 寻找重复数 */
  window.DBG[287] = p => {
    const S = [], a = p.viz.arr, F = mk(S);
    let slow = 0, fast = 0;
    F(4, "slow = fast = 0", { arr: a, ptr: { slow, fast } });
    for (let k = 0; k < 4; k++) {
      F(5, `do {（第 ${k + 1} 轮）`, { arr: a, ptr: { slow, fast }, vars: { slow, fast } });
      F(6, `slow = nums[slow] → ${a[slow]}`, { arr: a, ptr: { slow, fast }, hi: [slow] });
      slow = a[slow];
      F(6, `fast = nums[nums[fast]] → ${a[a[fast]]}`, { arr: a, ptr: { slow, fast }, hi: [fast] });
      fast = a[a[fast]];
      F(4, `slow=${slow}, fast=${fast}`, { arr: a, ptr: { slow, fast } });
      if (slow === fast) break;
    }
    F(7, `相遇于 ${slow}，p 回到 0`, { arr: a, ptr: { slow, p: 0 }, hi: [slow] });
    let p1 = 0;
    while (p1 !== slow) { p1 = a[p1]; slow = a[slow]; F(8, `p=${p1}, slow=${slow}`, { arr: a, ptr: { p: p1, slow } }); }
    F(9, `return ${p1}`, { arr: a, hi: [p1], vars: { 答案: p1 } });
    return S;
  };
})();
