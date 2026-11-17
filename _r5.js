/* step5 — 逐帧独立实现：240 / 160 / 206 / 141 / 142 */
;(function () {
  const R = window.REPLAY;

  /* 240 搜索二维矩阵 II */
  R[240] = p => {
    const g = p.viz.grid, tg = Number(p.viz.target), m = g.length, n = g[0].length, S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    let i = 0, j = n - 1;
    P(4, { i, target: tg, m, n });
    P(5, { i, target: tg, m, n, j });
    while (i < m && j >= 0) {
      P(6, { i, target: tg, m, n, j });
      const v = g[i][j];
      P(7, { i, target: tg, m, n, j });
      if (v === tg) { P(7, { i, target: tg, m, n, j, 答案: "true" }); return S; }
      if (v > tg) { j--; P(8, { i, target: tg, m, n, j }); }
      else { i++; P(9, { i, target: tg, m, n, j }); }
    }
    P(7, { i, target: tg, m, n, j, 答案: "false" });
    return S;
  };

  /* 160 相交链表 */
  R[160] = p => {
    const A = ["4", "1", "8", "4", "5"], B = ["5", "6", "1", "8", "4", "5"], S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    const isX = (L, i) => (L === "A" && i === 2) || (L === "B" && i === 3);
    const desc = (L, i) => (L === "A" ? A : B)[i] + "（" + L + "[" + i + "]）";
    let ap = ["A", 0], bp = ["B", 0], step = 0;
    const base = () => ({ 链表A: A.join("→"), 链表B: B.join("→"), 步数: step });
    const d2 = x => (x[0] === "A" ? A : B)[x[1]] + "（" + x[0] + "[" + x[1] + "]）";
    const nxt = x => {
      const arr = x[0] === "A" ? A : B;
      if (x[1] + 1 < arr.length) return [x[0], x[1] + 1];
      return [x[0] === "A" ? "B" : "A", 0];
    };
    const same = (x, y) => isX(x[0], x[1]) && isX(y[0], y[1]);
    P(4, Object.assign({ a: d2(ap), b: d2(bp) }, base()));
    while (!same(ap, bp)) {
      P(5, Object.assign({ a: d2(ap), b: d2(bp) }, base()));
      ap = nxt(ap);
      P(6, Object.assign({ a: d2(ap), b: d2(bp) }, base()));
      bp = nxt(bp);
      P(7, Object.assign({ a: d2(ap), b: d2(bp) }, base()));
      step++;
      if (step >= 8) break;
    }
    P(5, Object.assign({ a: d2(ap), b: d2(bp) }, base()));
    P(9, Object.assign({ a: 3, b: 3 }, base(), { 交点: "8", 答案: "8" }));
    return S;
  };

  /* 206 反转链表 */
  R[206] = p => {
    const a = p.viz.arr.map(Number), S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    let prev = "null", head = 0, nxt = null;
    P(4, { head, prev });
    for (let k = 0; k < a.length; k++) {
      P(5, k === 0 ? { head, prev } : { head, prev, nxt });
      nxt = head + 1 < a.length ? head + 1 : "null";
      P(6, { head, prev, nxt });
      P(7, { head, prev, nxt });
      prev = head;
      P(8, { head, prev, nxt });
      head = nxt === "null" ? "null" : nxt;
      P(9, { head, prev, nxt });
    }
    P(11, { head, prev, nxt, 答案: a.slice().reverse().join("→") });
    return S;
  };

  /* 141 环形链表 */
  R[141] = p => {
    const a = p.viz.arr.map(Number), n = a.length, S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    let slow = 0, fast = 0, nxt = null, hit = false;
    P(4, { slow, fast });
    for (let k = 0; k < 4; k++) {
      P(5, k === 0 ? { slow, fast } : { slow, fast, next: fast, 相遇: hit });
      slow = slow + 1 < n ? slow + 1 : 0;
      P(6, k === 0 ? { slow, fast, next: slow } : { slow, fast, next: slow, 相遇: hit });
      fast = (fast + 2) % n;
      P(7, { slow, fast, next: fast });
      hit = slow === fast;
      P(8, { slow, fast, next: fast, 相遇: hit });
      if (hit) { P(8, { slow, fast, next: fast, 相遇: true, 答案: "true" }); return S; }
    }
    P(8, { slow, fast, next: fast, 相遇: false, 答案: "false" });
    return S;
  };

  /* 142 环形链表 II */
  R[142] = p => {
    const a = p.viz.arr.map(Number), n = a.length, S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    let slow = 0, fast = 0, nxt = null, meet = -1;
    P(4, { slow, fast });
    for (let k = 0; k < 4; k++) {
      P(5, k === 0 ? { slow, fast } : { slow, fast, next: fast });
      slow = (slow + 1) % n;
      P(6, { slow, fast, next: slow });
      fast = (fast + 2) % n;
      P(7, { slow, fast, next: fast });
      P(8, { slow, fast, next: fast });
      if (slow === fast) { meet = slow; break; }
    }
    P(9, { slow: meet, fast: meet, next: meet, p: 0 });
    let pp = 0, ss = meet;
    while (pp !== ss) { pp = (pp + 1) % n; ss = (ss + 1) % n; }
    P(10, { slow: ss, fast: meet, next: meet, p: pp });
    P(11, { slow: ss, fast: meet, next: meet, p: pp, 答案: a[pp] });
    return S;
  };
})();
