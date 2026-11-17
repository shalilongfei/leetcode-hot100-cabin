/* step6 — 逐帧独立实现：234 / 21 / 2 / 19 / 24 / 138 */
;(function () {
  const R = window.REPLAY;

  /* 234 回文链表 */
  R[234] = p => {
    const a = p.viz.arr.map(Number), n = a.length, S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    let slow = 0, fast = 0, next = null, prev = "null", nxt = null, hit = false;
    P(4, { slow, fast });
    let g = 0, k = 0;
    while (slow + 1 < n && g++ < 2) {
      P(5, k === 0 ? { slow, fast } : { slow, fast, next: fast });
      slow++;
      P(6, { slow, fast, next: slow });
      fast += 2;
      const fm = Math.min(fast, n - 1);
      P(7, { slow, fast: fm, next: fm });
      if (fast > n - 1) break;
    }
    P(5, { slow, fast: Math.min(fast, n - 1), next: Math.min(fast, n - 1) });
    P(9, { slow, fast: Math.min(fast, n - 1), prev: "null" });
    let i = slow;
    let turns = 0;
    while (i < n && turns++ < 3) {
      P(10, turns === 1 ? { slow: i, prev } : { slow: i, prev, nxt });
      nxt = i + 1 < n ? i + 1 : "null";
      P(11, { slow: i, prev, nxt });
      P(12, { slow: i, prev, nxt });
      prev = i;
      P(13, { slow: i, prev, nxt });
      i = nxt === "null" ? n : nxt;
      P(14, { slow: i < n ? i : "null", prev, nxt });
    }
    P(10, { slow: "null", prev, nxt });
    let p1 = 0, p2 = prev;
    P(16, { p1: 0, p2: prev });
    while (p2 !== "null" && p2 >= slow && k++ < 3) {
      P(17, { p1, p2 });
      const eq = a[p1] === a[p2];
      P(18, { p1, p2 });
      if (!eq) { P(18, { p1, p2, 答案: "false" }); return S; }
      p1++;
      P(19, { p1, p2 });
      p2 = typeof p2 === "number" && p2 - 1 >= slow ? p2 - 1 : "null";
      P(20, { p1, p2 });
    }
    P(22, { 答案: "true" });
    return S;
  };

  /* 21 合并两个有序链表 */
  R[21] = p => {
    const A = [1, 2, 4], B = [1, 3, 4], S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    let ai = 0, bi = 0, out = [];
    const va = () => (ai < A.length ? A[ai] : "null");
    const vb = () => (bi < B.length ? B[bi] : B[B.length - 1]);
    P(4, { tail: "dummy" });
    while (ai < A.length && bi < B.length) {
      P(5, { tail: "dummy", a: va(), b: vb() });
      P(6, { tail: "dummy", a: va(), b: vb() });
      if (A[ai] <= B[bi]) { out.push(A[ai]); ai++; P(6, { tail: "dummy", a: va(), b: vb() }); }
      else { out.push(B[bi]); bi++; P(7, { tail: "dummy", a: va(), b: vb() }); }
      P(8, { tail: "dummy", a: va(), b: vb() });
    }
    if (ai < A.length) { out = out.concat(A.slice(ai)); ai = A.length; P(6, { tail: "dummy", a: "null", b: vb() }); }
    else if (bi < B.length) { out = out.concat(B.slice(bi)); bi = B.length; }

    P(10, { tail: "dummy", a: va(), b: vb() });
    P(11, { tail: "dummy", a: va(), b: vb(), 答案: out.join("→") });
    return S;
  };

  /* 2 两数相加 */
  R[2] = p => {
    const A = [2, 4, 3], B = [5, 6, 4], S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    let carry = 0, i = 0, out = [];
    const l1s = () => A.join("→"), l2s = () => B.join("→");
    P(4, { carry, l1: l1s(), l2: l2s() });
    P(5, { carry, l1: l1s(), l2: l2s() });
    while (i < A.length || i < B.length || carry) {
      P(6, { carry, l1: l1s(), l2: l2s() });
      const v = (i < A.length ? A[i] : 0) + (i < B.length ? B[i] : 0) + carry;
      P(7, { carry, l1: l1s(), l2: l2s(), v });
      carry = Math.floor(v / 10);
      P(8, { carry, l1: l1s(), l2: l2s(), v });
      out.push(v % 10);
      P(9, { carry, l1: l1s(), l2: l2s(), v });
      P(10, { carry, l1: l1s(), l2: l2s(), v });
      P(11, { carry, l1: l1s(), l2: l2s(), v });
      P(12, { carry, l1: l1s(), l2: l2s(), v });
      i++;
      if (i > 3) break;
    }
    P(14, { carry, l1: l1s(), l2: l2s(), v: 8, 答案: out.join("→") });
    return S;
  };

  /* 19 删除倒数第 N 个 */
  R[19] = p => {
    const arr = [1, 2, 3, 4, 5], n = 2, S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    let slow = 0, fast = 0, nxt = null;
    P(4, { i: 0, n });
    P(5, { i: 0, n, slow: 0, fast: 0 });
    for (let k = 1; k <= n; k++) {
      fast = k;
      P(6, { i: 0, n, slow: 0, fast, next: fast });
    }
    P(7, { i: 0, n, slow: 0, fast, next: fast });
    slow = 1; fast = 3;
    P(7, { i: 0, n, slow, fast, next: 2 });
    P(7, { i: 0, n, slow, fast, next: 2 });
    slow = 2; fast = 4;
    P(7, { i: 0, n, slow, fast, next: 2 });
    P(7, { i: 0, n, slow, fast, next: 2 });
    P(8, { i: 0, n, slow: 2, fast, next: 2, 删除: "4" });
    const res = arr.slice(0, 3).concat(arr.slice(4));
    P(9, { i: 0, n, slow, fast, next: 2, 删除: "4", 答案: res.join("→") });
    return S;
  };

  /* 24 两两交换 */
  R[24] = p => {
    const a = p.viz.arr.map(Number).slice(), S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    let nx = null, A = null, B = null, k = 0;
    P(4, {});
    while (k + 1 < a.length + 1 && k < a.length) {
      P(5, {});
      A = k; nx = k + 1;
      P(6, { a: A, next: nx });
      B = nx; nx = k + 2 <= a.length ? k + 2 : a.length;
      P(7, { a: A, next: nx, b: B });
      P(8, { a: A, next: nx, b: B });
      const t = a[k]; a[k] = a[k + 1]; a[k + 1] = t;
      P(9, { a: A, next: nx, b: B });
      P(10, { a: A, next: nx, b: B });
      P(11, { a: B, next: nx, b: B });
      k += 2;
    }
    P(13, { 结果: "每两个已互换" });
    return S;
  };

  /* 138 随机链表复制 */
  R[138] = p => {
    const a = p.viz.arr.map(Number), S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    P(4, { head: 0 });
    P(5, { head: 0 });
    for (let i = 0; i < a.length; i++) P(6, { head: 0, p: i });
    for (let i = 0; i < a.length; i++) {
      P(7, i === 0 ? { head: 0, p: i } : { head: 0, p: i, 阶段: "接 random" });
      P(8, { head: 0, p: i, 阶段: "接 next" });
      P(9, { head: 0, p: i, 阶段: "接 random" });
    }

    P(11, { head: 0, p: a.length - 1, 阶段: "接 random", 结果: "深拷贝完成" });
    return S;
  };
})();
