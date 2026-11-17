/* step8 — 逐帧独立实现：25 / 148 / 23 / 146 */
;(function () {
  const R = window.REPLAY;

  /* 25 K 个一组翻转 */
  R[25] = p => {
    const a = p.viz.arr.map(Number), k = 2, n = a.length, S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    P(4, { i: 0 });
    for (let i = 0; i + k <= n; i += k) {
      P(5, { i: 0 });
      P(6, { i: 0, kth: i });
      for (let t = 1; t <= k; t++) P(7, { i: 0, kth: i + t });
      P(8, { i: 0, kth: i + k });
      P(9, { i: 0, groupNext: i + k < n ? i + k : "null" });
      P(10, { i: 0, cur: i + 1, prev: i + k });
      for (let t = 0; t < k; t++) {
        const c = i + 1 + t;
        P(11, { i: 0, cur: c });
        P(12, { i: 0, cur: c, nxt: c + 1 });
        P(13, { i: 0, cur: c, nxt: c + 1 });
        P(14, { i: 0, prev: c });
        P(15, { i: 0, cur: c + 1 });
      }
      P(11, { i: 0, cur: "groupNext" });
      P(17, { i: 0, start: i });
      P(18, { i: 0, start: i });
      P(19, { i: 0, start: i });
    }
    P(8, { i: 0, 结果: "每组已翻转，余下保持原序" });
    return S;
  };

  /* 23 合并 K 个升序链表 */
  R[23] = p => {
    const S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    const base = () => ({ lists: "3 条链表" });
    const seq = [1, 1, 2, 3, 4, 4, 5, 6];
    P(4, base()); P(5, base()); P(6, base()); P(7, base());
    let nx = undefined;
    for (let r = 0; r < 8; r++) {
      P(8, nx === undefined ? base() : Object.assign({ next: nx }, base()));
      P(9, nx === undefined ? base() : Object.assign({ next: nx }, base()));
      nx = seq[Math.min(r, seq.length - 1)];
      P(10, Object.assign({ next: nx }, base()));
      P(11, Object.assign({ next: nx }, base()));
      P(12, Object.assign({ next: nx }, base()));
      if (r < 7) P(7, Object.assign({ next: nx }, base()));
    }
    P(14, Object.assign({ next: seq[7], 答案: seq.join("→") }, base()));
    return S;
  };

  /* 146 LRU */
  R[146] = p => {
    const ops = p.viz.arr, cap = 2, S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    const cache = [];
    P(6, { cap });
    ops.forEach(op => {
      if (op.indexOf("put") === 0) {
        const [k, v] = op.slice(4, -1).split(",");
        P(16, { cap, it: Number(k) });
        const i = cache.findIndex(x => x.split(":")[0] === k);
        P(17, { cap, it: Number(k) });
        if (i >= 0) {
          cache.splice(i, 1);
          cache.unshift(k + ":" + v);
          P(18, { cap, it: Number(k) });
          P(19, { cap, it: Number(k) });
          P(20, { cap, it: Number(k) });
          return;
        }
        P(22, { cap, it: Number(k) });
        if (cache.length === cap) {
          const old = cache.pop();
          P(23, { cap, it: Number(k), 淘汰: old });
          P(24, { cap, it: Number(k), 淘汰: old });
        }
        cache.unshift(k + ":" + v);
        P(26, { cap, it: Number(k) });
        P(27, { cap, it: Number(k) });
      } else {
        const k = op.slice(4, -1);
        P(9, { cap, it: Number(k) });
        const i = cache.findIndex(x => x.split(":")[0] === k);
        if (i < 0) { P(10, { cap, it: Number(k), 返回: -1 }); return; }
        const it = cache.splice(i, 1)[0];
        cache.unshift(it);
        P(11, { cap, it: Number(k) });
        P(12, { cap, it: Number(k), 返回: Number(it.split(":")[1]) });
      }
    });
    return S;
  };
})();
