/* step20 — 逐帧独立实现：33 / 153 / 4 */
;(function () {
  const R = window.REPLAY;

  /* 33 搜索旋转排序数组 */
  R[33] = p => {
    const a = p.viz.arr.map(Number), tg = Number(p.viz.target), S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    let lo = 0, hi = a.length - 1, mid = 0;
    P(4, { lo, hi, target: tg });
    while (lo <= hi) {
      P(5, mid ? { lo, hi, target: tg, mid } : { lo, hi, target: tg });
      mid = (lo + hi) >> 1;
      P(6, { lo, hi, target: tg, mid });
      if (a[mid] === tg) { P(7, { lo, hi, target: tg, mid, 答案: mid }); return S; }
      const leftSorted = a[lo] <= a[mid];
      P(8, { lo, hi, target: tg, mid });
      if (leftSorted) {
        const inLeft = a[lo] <= tg && tg < a[mid];
        P(9, { lo, hi, target: tg, mid });
        if (inLeft) { hi = mid - 1; P(9, { lo, hi, target: tg, mid }); }
        else { lo = mid + 1; P(10, { lo, hi, target: tg, mid }); }
      } else {
        const inRight = a[mid] < tg && tg <= a[hi];
        P(12, { lo, hi, target: tg, mid });
        if (inRight) { lo = mid + 1; P(12, { lo, hi, target: tg, mid }); }
        else { hi = mid - 1; P(13, { lo, hi, target: tg, mid }); }
      }
    }
    P(7, { lo, hi, target: tg, mid, 答案: -1 });
    return S;
  };

  /* 153 旋转数组最小值 */
  R[153] = p => {
    const a = p.viz.arr.map(Number), S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    let lo = 0, hi = a.length - 1, mid = 0;
    P(4, { lo, hi });
    while (lo < hi) {
      P(5, mid ? { lo, hi, mid } : { lo, hi });
      mid = (lo + hi) >> 1;
      P(6, { lo, hi, mid });
      P(7, { lo, hi, mid });
      if (a[mid] < a[hi]) { hi = mid; P(7, { lo, hi, mid }); }
      else { lo = mid + 1; P(8, { lo, hi, mid }); }
    }
    P(10, { lo, hi, mid, 答案: a[lo] });
    return S;
  };

  /* 4 两个正序数组的中位数 */
  R[4] = p => {
    const A = [1, 3], B = [2], S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    const m = A.length, n = B.length, half = (m + n + 1) >> 1;
    let lo = 0, hi = m, i = 0, j = 0;
    const base = extra => Object.assign({ lo, A: A.join(","), B: B.join(","), half, m, n }, extra || {});
    P(4, { lo, A: A.join(","), B: B.join(",") });
    P(5, { lo, A: A.join(","), B: B.join(",") });
    P(6, base());
    P(6, base({ hi }));
    while (lo <= hi) {
      P(7, i ? base({ hi, i, j }) : base({ hi }));
      i = (lo + hi) >> 1; j = half - i;
      P(8, base({ hi, i, j }));
      const aL = i === 0 ? -Infinity : A[i - 1];
      const aR = i === m ? Infinity : A[i];
      P(9, base({ hi, i, j }));
      const bL = j === 0 ? -Infinity : B[j - 1];
      P(11, base({ hi, i, j }));
      const bR = j === n ? Infinity : B[j];
      P(12, base({ hi, i, j }));
      if (aL <= bR && bL <= aR) {
        P(13, base({ hi, i, j }));
        const med = (m + n) % 2 ? Math.max(aL, bL) : (Math.max(aL, bL) + Math.min(aR, bR)) / 2;
        P(14, base({ hi, i, j, 答案: med }));
        return S;
      }
      if (aL > bR) { hi = i - 1; P(17, base({ hi, i, j })); }
      else { lo = i + 1; P(17, base({ hi, i, j })); }
    }
    P(14, base({ hi, i, j, 答案: 0 }));
    return S;
  };
})();
