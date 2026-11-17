/* step14 — 逐帧独立实现：105 从前序中序构造二叉树 */
;(function () {
  const R = window.REPLAY;

  R[105] = p => {
    const pre = [3, 9, 20, 15, 7], ino = [9, 3, 15, 20, 7], S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    const idx = {};
    ino.forEach((v, i) => idx[v] = i);
    P(4, { i: 0 });
    P(6, { i: 0 });
    let ret, root = undefined, mid = undefined, leftLen = undefined;
    const base = extra => {
      const o = { i: 0 };
      if (root !== undefined) o["根"] = root;
      if (mid !== undefined) o.mid = mid;
      if (leftLen !== undefined) o.leftLen = leftLen;
      if (ret !== undefined) o["返回"] = ret;
      return Object.assign(o, extra || {});
    };
    const build = (pl, pr, il, ir) => {
      P(9, base());
      if (pl > pr) { P(11, base()); return null; }
      P(12, base());
      const rv = pre[pl];
      root = rv;
      const m = idx[rv];
      mid = m;
      P(13, base());
      const ll = m - il;
      leftLen = ll;
      P(14, base());
      P(15, base());
      build(pl + 1, pl + ll, il, m - 1);
      P(15, base());
      P(16, base());
      build(pl + ll + 1, pr, m + 1, ir);
      P(16, base());
      ret = rv;
      P(17, base());
      return rv;
    };
    build(0, pre.length - 1, 0, ino.length - 1);
    P(6, Object.assign({}, base(), { 根: 3, mid: 4, leftLen: 0, 返回: 3 }));
    return S;
  };
})();
