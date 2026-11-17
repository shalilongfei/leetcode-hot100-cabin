/* step13 — 逐帧独立实现：236 / 124 */
;(function () {
  const R = window.REPLAY;
  const T = p => p.viz.tree || [];
  const at = (t, i) => (i < t.length && t[i] != null ? t[i] : null);

  /* 236 最近公共祖先：p=5, q=1 */
  R[236] = p => {
    const t = T(p), S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    const P5 = 5, Q = 1;
    let ret = undefined;
    P(4, { p: P5, q: Q });
    const lca = (i, d) => {
      const v = at(t, i);
      if (d === 0) { P(4, { p: P5, q: Q }); }
      else P(4, { p: P5, q: Q, ...(ret !== undefined ? { 返回: ret } : {}) });
      if (v == null || v === P5 || v === Q) {
        if (v != null && (v === P5 || v === Q)) { ret = v; P(4, { p: P5, q: Q, 返回: v }); }
        return v;
      }
      const l = lca(2 * i + 1, d + 1);
      if (l != null) { ret = l; P(5, { p: P5, q: Q, 返回: l }); }
      const r = lca(2 * i + 2, d + 1);
      if (r != null) { ret = r; P(6, { p: P5, q: Q, 返回: r }); }
      if (l != null && r != null) { ret = v; P(7, { p: P5, q: Q, 返回: v }); return v; }
      const res = l != null ? l : r;
      if (res != null) ret = res;
      return res;
    };
    const ans = lca(0, 0);
    P(4, { p: P5, q: Q, 返回: ans, 答案: ans });
    return S;
  };

  /* 124 最大路径和 */
  R[124] = p => {
    const t = T(p), S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    let ans = "-∞";
    const numAns = () => (ans === "-∞" ? -Infinity : ans);
    const base = extra => Object.assign({ ans }, extra || {});
    P(4, { ans });
    P(5, { ans });
    let lastRet = undefined;
    const gain = (i, d) => {
      const v = at(t, i);
      P(9, lastRet === undefined ? { ans } : base({ 返回: lastRet }));
      if (v == null) return 0;
      let l = 0, r = 0;
      const gl = gain(2 * i + 1, d + 1);
      l = Math.max(0, gl);
      P(11, l > 0 ? base({ l }) : base());
      const gr = gain(2 * i + 2, d + 1);
      r = Math.max(0, gr);
      P(12, base({ l, r }));
      const nv = v + l + r;
      if (nv > numAns()) ans = nv;
      P(13, Object.assign({ l, r }, lastRet !== undefined ? { 返回: lastRet } : {}));
      lastRet = v + Math.max(l, r);
      P(14, base({ l, r, 返回: lastRet }));
      return lastRet;
    };
    gain(0, 0);
    P(6, { ans, 返回: lastRet, 答案: ans });
    return S;
  };
})();
