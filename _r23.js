/* step23 — 逐帧独立实现：121 / 55 / 45 / 763 */
;(function () {
  const R = window.REPLAY;

  /* 121 买卖股票 */
  R[121] = p => {
    const a = p.viz.arr.map(Number), S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    let low = Infinity, profit = 0;
    P(4, { profit, low: "∞" });
    for (const x of a) {
      P(5, { profit, low });
      low = Math.min(low, x);
      P(6, { profit, low });
      profit = Math.max(profit, x - low);
      P(7, { profit, low });
    }
    P(9, { profit, low, 答案: profit });
    return S;
  };

  /* 55 跳跃游戏 */
  R[55] = p => {
    const a = p.viz.arr.map(Number), S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    let far = 0, i = 0;
    P(4, { far, i: 0 });
    for (i = 0; i < a.length; i++) {
      P(5, { far, i });
      P(6, { far, i });
      far = Math.max(far, i + a[i]);
      P(7, { far, i });
    }
    P(9, { far, i: i - 1, 答案: "true" });
    return S;
  };

  /* 45 跳跃游戏 II */
  R[45] = p => {
    const a = p.viz.arr.map(Number), n = a.length, S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    let end = 0, far = 0, steps = 0;
    P(4, { far, steps, i: 0, end });
    for (let i = 0; i < n - 1; i++) {
      P(5, { far, steps, i, end });
      far = Math.max(far, i + a[i]);
      P(6, { far, steps, i, end });
      if (i === end) {
        steps++;
        P(8, { far, steps, i, end });
        end = far;
        P(9, { far, steps, i, end });
      }
    }
    P(12, { far, steps, i: n - 2, end, 答案: steps });
    return S;
  };

  /* 763 划分字母区间 */
  R[763] = p => {
    const s = p.viz.arr, n = s.length, S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    const last = {};
    P(5, { i: 0, start: 0 });
    s.forEach((c, i) => { last[c] = i; });
    let start = 0, end = 0;
    P(7, { i: 0, start: 0 });
    const res = [];
    for (let i = 0; i < n; i++) {
      P(8, { i, start });
      end = Math.max(end, last[s[i]]);
      P(9, { i, start });
      if (i === end) {
        P(11, { i, start });
        res.push(end - start + 1);
        start = i + 1;
        P(12, { i, start });
      }
    }
    P(15, { i: n - 1, start, 答案: res.join(",") });
    return S;
  };
})();
