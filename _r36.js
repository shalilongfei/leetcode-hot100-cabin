/* step36 — 逐帧独立实现：148 排序链表 */
;(function () {
  const R = window.REPLAY;

  R[148] = p => {
    const arr = (p.viz.arr || []).map(Number), n = arr.length, S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    let len = n, slow, fast, nxt, mid;
    const B = extra => {
      const o = { 长度: len };
      if (slow !== undefined) { o.slow = slow; o.fast = fast; }
      if (nxt !== undefined) o.next = nxt;
      if (mid !== undefined) o.mid = mid;
      return Object.assign(o, extra || {});
    };
    P(4, {});
    const go = (lo, hi) => {
      len = hi - lo + 1;
      P(4, B());
      if (len <= 1) { P(4, B()); return; }
      slow = lo; fast = lo + 1;
      P(5, B());
      while (fast <= hi && fast + 1 <= hi) {
        P(6, B());
        slow++; nxt = slow;
        P(7, B());
        fast += 2; nxt = fast;
        P(8, B());
      }
      mid = slow + 1;
      const sp = slow, mp = mid;
      P(10, B());
      P(11, B());
      P(12, B());
      go(lo, sp);
      P(12, B());
      P(12, B());
      go(sp + 1, hi);
      P(12, B());
      P(15, B());
      P(16, B());
      P(17, B());
      P(18, B());
      P(20, B());
      P(22, B());
      P(23, B());
    };
    go(0, n - 1);
    P(23, B({ 答案: arr.slice().sort((a, b) => a - b).join("→") }));
    return S;
  };
})();
