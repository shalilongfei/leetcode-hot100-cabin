/* step22 — 逐帧独立实现：84 / 215 / 347 / 295 */
;(function () {
  const R = window.REPLAY;

  /* 84 柱状图最大矩形 */
  R[84] = p => {
    const h = p.viz.arr.map(Number).concat([0]), S = [], st = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    let best = 0, height, left;
    P(4, { best, i: 0 });
    P(5, { best, i: 0 });
    P(6, { best, i: 0 });
    for (let i = 0; i < h.length; i++) {
      P(7, { best, i, h: h[i] });
      while (st.length && h[st[st.length - 1]] > h[i]) {
        P(8, { best, i, h: h[i] });
        height = h[st.pop()];
        P(9, { best, i, h: h[i], height });
        left = st.length ? st[st.length - 1] : -1;
        P(10, { best, i, h: h[i], height, left });
        best = Math.max(best, height * (i - left - 1));
        P(11, { best, i, h: h[i], height, left });
      }
      st.push(i);
      P(13, { best, i, h: h[i] });
    }
    P(15, { best, i: h.length - 1, 答案: best });
    return S;
  };

  /* 215 第 K 大（小顶堆） */
  R[215] = p => {
    const a = p.viz.arr.map(Number), k = 2, S = [], heap = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    P(4, { k });
    for (const x of a) {
      heap.push(x); heap.sort((u, v) => u - v);
      P(6, { k });
      P(6, { k });
      if (heap.length > k) { heap.shift(); P(7, { k }); }
    }
    P(9, { k, 答案: heap[0] });
    return S;
  };

  /* 347 前 K 个高频 */
  R[347] = p => {
    const a = p.viz.arr.map(Number), k = 2, S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    const cnt = {};
    let lastX = 0, lastC = 0;
    P(4, { k });
    for (const x of a) {
      lastX = x; cnt[x] = (cnt[x] || 0) + 1; lastC = cnt[x];
      P(5, { k, x: lastX, 次数: lastC });
    }
    const n = a.length;
    P(6, { k, x: lastX, 次数: lastC, n });
    P(7, { k, x: lastX, 次数: lastC, n });
    const buckets = {};
    const keys = Object.keys(cnt);
    keys.forEach(v => {
      const f = cnt[v];
      (buckets[f] = buckets[f] || []).push(Number(v));
      P(8, { k, x: lastX, 次数: lastC, n, v: Number(v), f, 桶: Object.keys(buckets).map(kk => kk + ":[" + buckets[kk] + "]").join(" ") });
    });
    P(9, { k, x: lastX, 次数: lastC, n, v: 3, f: 1, 桶: Object.keys(buckets).map(kk => kk + ":[" + buckets[kk] + "]").join(" ") });
    const res = [];
    for (let f = n; f >= 1; f--) {
      P(10, { k, x: lastX, 次数: lastC, n, v: f === 2 ? 1 : 3, f, 桶: Object.keys(buckets).map(kk => kk + ":[" + buckets[kk] + "]").join(" ") });
      const b = buckets[f] || [];
      if (b.length) {
        b.forEach(v => { if (res.length < k) res.push(v); });
        P(12, { k, x: lastX, 次数: lastC, n, v: b[0], f, 桶: Object.keys(buckets).map(kk => kk + ":[" + buckets[kk] + "]").join(" ") });
        if (res.length >= k) { P(13, { k, x: lastX, 次数: lastC, n, v: b[0], f, 桶: Object.keys(buckets).map(kk => kk + ":[" + buckets[kk] + "]").join(" ") }); break; }
      }
    }
    P(15, { k, x: lastX, 次数: lastC, n, v: 2, f: 2, 桶: Object.keys(buckets).map(kk => kk + ":[" + buckets[kk] + "]").join(" "), 答案: "[" + res.join(",") + "]" });
    return S;
  };
  /* 295 数据流中位数（双堆） */
  R[295] = p => {
    const ops = p.viz.arr, S = [], small = [], large = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    const fmt = arr => "[" + arr.join(",") + "]";
    const med = () => (small.length > large.length ? small[0] : (small[0] + large[0]) / 2);
    let lastNum = 1, lastMed;
    P(2, { num: 1, small: "[]", large: "[]" });
    P(3, { num: 1, small: "[]", large: "[]" });
    ops.forEach(op => {
      if (op.indexOf("add") === 0) {
        const v = Number(op.slice(4));
        lastNum = v;
        P(7, { num: v, small: fmt(small), large: fmt(large), ...(lastMed !== undefined ? { 中位数: lastMed } : {}) });
        small.push(v); small.sort((x, y) => y - x);
        P(8, { num: v, small: fmt(small), large: fmt(large) });
        if (small.length > large.length + 1) {
          large.push(small.shift()); large.sort((x, y) => x - y);
        } else if (large.length && small[0] > large[0]) {
          const t = small.shift(), u = large.shift();
          small.push(u); large.push(t);
          small.sort((x, y) => y - x); large.sort((x, y) => x - y);
        }
        P(10, { num: v, small: fmt(small), large: fmt(large) });
      } else {
        lastMed = med();
        P(14, { num: lastNum, small: fmt(small), large: fmt(large), 中位数: lastMed, 答案: lastMed });
      }
    });
    return S;
  };
})();
