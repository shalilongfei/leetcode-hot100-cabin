/* step16 — 逐帧独立实现：114 二叉树展开为链表 */
;(function () {
  const R = window.REPLAY;
  const T = p => p.viz.tree || [];
  const at = (t, i) => (i < t.length && t[i] != null ? t[i] : null);

  R[114] = p => {
    const t = T(p), S = [];
    const pre = [];
    (function walk(i) { if (at(t, i) == null) return; pre.push(t[i]); walk(2 * i + 1); walk(2 * i + 2); })(0);
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    let left, right, tail, depth;
    const nm = i => (at(t, i) == null ? "null" : String(t[i]));
    const base = () => {
      const o = { 前序: pre.join("→") };
      if (depth !== undefined) o["栈深"] = depth;
      if (left !== undefined) o.left = left;
      if (right !== undefined) o.right = right;
      if (tail !== undefined) o.tail = tail;
      return o;
    };
    P(4, base());
    const go = (i, d) => {
      depth = d;
      P(4, base());
      if (at(t, i) == null) return;
      P(5, base());
      go(2 * i + 1, d + 1);
      P(5, base());
      P(6, base());
      go(2 * i + 2, d + 1);
      P(6, base());
      left = nm(2 * i + 1);
      P(7, base());
      right = nm(2 * i + 2);
      P(8, base());
      left = "null";
      P(9, base());
      right = nm(2 * i + 1);
      P(10, base());
      tail = nm(i);
      P(11, base());
      const firstRight = nm(2 * i + 1) !== "null" ? nm(2 * i + 1) : null;
      tail = firstRight === null ? "null" : firstRight;
      P(12, base());
      right = nm(2 * i + 2);
      P(13, base());
      P(13, base());
    };
    go(0, 1);
    P(4, Object.assign({}, base(), { 答案: pre.join("→") }));
    return S;
  };
})();
