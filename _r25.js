/* step25 — 逐帧独立实现：198 / 300 */
;(function () {
  const R = window.REPLAY;

  /* 198 打家劫舍 */
  R[198] = p => {
    const a = p.viz.dp.map(Number), S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    let p2 = 0, p1 = 0, cur = undefined;
    P(4, { p2, p1 });
    for (const x of a) {
      P(5, cur === undefined ? { p2, p1 } : { p2, p1, cur });
      cur = Math.max(p1, p2 + x);
      P(6, { p2, p1, cur });
      const t = Math.max(p1, p2 + x);
      p2 = p1; p1 = t;
      P(8, { p2, p1, cur });
    }
    P(10, { p2, p1, cur, 答案: p1 });
    return S;
  };

  /* 300 最长递增子序列（tails + 二分） */
  R[300] = p => {
    const a = p.viz.arr.map(Number), S = [], tails = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    P(4, {});
    for (const x of a) {
      P(5, tails.length ? { x, 长度: tails.length } : { x });
      let lo = 0, hi = tails.length;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        P(6, { x, 长度: tails.length });
        if (tails[mid] < x) lo = mid + 1; else hi = mid;
      }
      if (lo === tails.length) {
        tails.push(x);
        P(7, { x, 长度: tails.length });
      } else {
        tails[lo] = x;
        P(8, { x, 长度: tails.length });
      }
    }
    P(10, { x: a[a.length - 1], 长度: tails.length, 答案: tails.length });
    return S;
  };
})();
