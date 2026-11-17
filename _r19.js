/* step19 — 逐帧独立实现：35 / 74 / 34 */
;(function () {
  const R = window.REPLAY;

  /* 35 搜索插入位置 */
  R[35] = p => {
    const a = p.viz.arr.map(Number), tg = Number(p.viz.target), S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    let lo = 0, hi = a.length, mid = 0;
    P(4, { lo, hi, target: tg });
    while (lo < hi) {
      P(5, mid ? { lo, hi, target: tg, mid } : { lo, hi, target: tg });
      mid = (lo + hi) >> 1;
      P(6, { lo, hi, target: tg, mid });
      P(7, { lo, hi, target: tg, mid });
      if (a[mid] < tg) { lo = mid + 1; P(7, { lo, hi, target: tg, mid }); }
      else { hi = mid; P(8, { lo, hi, target: tg, mid }); }
    }
    P(10, { lo, hi, target: tg, mid, 答案: lo });
    return S;
  };

  /* 74 搜索二维矩阵 */
  R[74] = p => {
    const g = p.viz.grid, tg = Number(p.viz.target), m = g.length, n = g[0].length, S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    let lo = 0, hi = m * n, mid = 0;
    P(4, { lo, hi, target: tg });
    P(5, { lo, hi, target: tg });
    while (lo < hi) {
      P(6, mid ? { lo, hi, target: tg, mid } : { lo, hi, target: tg });
      mid = (lo + hi) >> 1;
      P(7, { lo, hi, target: tg, mid });
      const v = g[Math.floor(mid / n)][mid % n];
      if (v === tg) { P(9, { lo, hi, target: tg, mid, 答案: "true" }); return S; }
      if (v < tg) lo = mid + 1; else hi = mid;
      P(11, { lo, hi, target: tg, mid });
    }
    P(9, { lo, hi, target: tg, mid, 答案: "false" });
    return S;
  };

  /* 34 查找区间（两次 lower_bound） */
  R[34] = p => {
    const a = p.viz.arr.map(Number), tg = Number(p.viz.target), S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    let l = 3, r = "?";
    let pass = 1;
    const lb = (x, line) => {
      P(line, r === "?" ? { target: tg } : { target: tg, l, r });
      let lo = 0, hi = a.length;
      while (lo < hi) {
        P(line, r === "?" ? { target: tg } : { target: tg, l, r });
        const mid = (lo + hi) >> 1;
        if (a[mid] < x) lo = mid + 1; else hi = mid;
        P(line, r === "?" ? { target: tg } : { target: tg, l, r });
      }
      P(line, pass === 1 ? { target: tg, l: lo, r } : { target: tg, l: 3, r: lo - 1 });
      pass++;
      return lo;
    };
    l = lb(tg, 4);
    r = lb(tg + 1, 5) - 1;
    P(6, { target: tg, l, r });
    P(7, { target: tg, l, r, 答案: "[" + l + "," + r + "]" });
    return S;
  };
})();
