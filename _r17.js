/* step17 — 逐帧独立实现：437 路径总和 III
   解法：把每个节点都当一次起点，从它往下走，cur 是「起点→当前」的路径和。 */
;(function () {
  const R = window.REPLAY;
  const T = p => p.viz.tree || [];
  const at = (t, i) => (i < t.length && t[i] != null ? t[i] : null);

  R[437] = p => {
    const t = T(p);
    const target = p.viz && p.viz.target != null ? p.viz.target : 8;
    const S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    const nm = i => (at(t, i) === null ? "null" : String(t[i]));

    /* 内层：从 i 往下走，cur 是「起点→当前」的路径和 */
    const from = (i, cur, pathArr) => {
      P(11, { cur: cur, 本节点命中: 0 });
      if (at(t, i) === null) {
        P(11, { cur: cur, 返回: 0 });
        return 0;
      }
      const here = pathArr.concat([i]);
      P(11, { cur: cur, 本节点命中: 0 });

      const nc = cur + t[i];
      P(12, { cur: nc, 本节点命中: 0 });

      const self = nc === target ? 1 : 0;
      P(13, { cur: nc, 本节点命中: self });

      const L = from(2 * i + 1, nc, here);
      P(14, { cur: nc, 本节点命中: self });

      const Rt = from(2 * i + 2, nc, here);
      const total = self + L + Rt;
      P(15, { cur: nc, 本节点命中: self, 本棵合计: total });
      return total;
    };

    /* 外层：每个节点都当一次起点 */
    const go = i => {
      P(4, {});
      if (at(t, i) === null) {
        P(4, { 返回: 0 });
        return 0;
      }
      P(4, {});
      P(5, {});

      const own = from(i, 0, []);

      P(6, {});
      const L = go(2 * i + 1);

      P(7, {});
      const Rt = go(2 * i + 2);

      const total = own + L + Rt;
      P(5, { 起点节点: nm(i), 以它为起点: own, 答案: total });
      return total;
    };

    const ans = go(0);
    P(5, { 答案: ans });
    return S;
  };
})();
