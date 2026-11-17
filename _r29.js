/* step29 — 逐帧独立实现：136 / 169 / 75 / 31 / 287 */
;(function () {
  const R = window.REPLAY;

  /* 136 只出现一次的数字 */
  R[136] = p => {
    const a = [4, 1, 2, 1, 2], S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    let ans = 0;
    P(4, { ans });
    for (const x of a) {
      P(5, { ans });
      ans ^= x;
      P(5, { ans });
    }
    P(6, { ans, 答案: ans });
    return S;
  };

  /* 169 多数元素 */
  R[169] = p => {
    const a = p.viz.arr.map(Number), S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    let cand = 0, cnt = 0;
    P(4, { cand: 0, cnt: 0 });
    for (const x of a) {
      P(5, cnt === 0 && cand === 0 ? { cand: "-", cnt, x } : { cand, cnt, x });
      if (cnt === 0) { cand = x; P(6, { cand, cnt, x }); }
      cnt += cand === x ? 1 : -1;
      P(7, { cand, cnt, x });
    }
    P(9, { cand, cnt, 答案: cand });
    return S;
  };

  /* 75 颜色分类 */
  R[75] = p => {
    const a = p.viz.arr.map(Number), S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    let p0 = 0, i = 0, p2 = a.length - 1;
    P(4, { p0, i, p2 });
    while (i <= p2) {
      P(5, { p0, i, p2 });
      if (a[i] === 2) { [a[i], a[p2]] = [a[p2], a[i]]; p2--; P(7, { p0, i, p2 }); }
      else if (a[i] === 0) { [a[i], a[p0]] = [a[p0], a[i]]; p0++; i++; P(6, { p0, i, p2 }); }
      else { i++; P(8, { p0, i, p2 }); }
    }
    P(5, { p0, i, p2 });
    return S;
  };

  /* 31 下一个排列 */
  R[31] = p => {
    const a = p.viz.arr.map(Number), n = a.length, S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    let i = n - 2;
    P(4, { i, n });
    while (i >= 0 && a[i] >= a[i + 1]) i--;
    P(5, { i, n });
    let j;
    if (i >= 0) {
      P(6, { i, n });
      j = n - 1;
      P(7, { i, n, j });
      while (a[j] <= a[i]) j--;
      P(8, { i, n, j });
      [a[i], a[j]] = [a[j], a[i]];
      P(9, { i, n, j });
    }
    for (let l = i + 1, r = n - 1; l < r; l++, r--) [a[l], a[r]] = [a[r], a[l]];
    P(11, { i, n, j });
    P(11, { i, n, j, 答案: a.join(",") });
    return S;
  };

  /* 287 寻找重复数 */
  R[287] = p => {
    const a = p.viz.arr.map(Number), S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    let slow = 0, fast = 0;
    P(4, { slow, fast, p: 0 });
    do {
      P(5, { slow, fast, p: 0 });
      const ns = a[slow];
      P(6, { slow, fast, p: 0 });
      const nf = a[a[fast]];
      slow = ns;
      P(7, { slow, fast, p: 0 });
      fast = nf;
      P(8, { slow, fast, p: 0 });
    } while (slow !== fast);
    P(9, { slow, fast, p: 0 });
    let pp = 0;
    while (pp !== slow) {
      pp = a[pp]; slow = a[slow];
      P(10, { slow, fast, p: pp });
    }
    P(11, { slow, fast, p: pp, 答案: pp });
    return S;
  };
})();
