/* step7 — 逐帧独立实现：94 / 104 / 226 / 101 / 543 */
;(function () {
  const R = window.REPLAY;
  const T = p => p.viz.tree || [];
  const at = (t, i) => (i < t.length && t[i] != null ? t[i] : null);
  const nm = (t, i) => (at(t, i) == null ? "null" : String(t[i]));

  /* 94 中序遍历（迭代） */
  R[94] = p => {
    const t = T(p), S = [], res = [], st = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    let cur = 0;
    P(4, {});
    P(5, {});
    P(6, { cur: 0 });
    let guard = 0;
    while ((cur !== null || st.length) && guard++ < 20) {
      P(7, { cur: cur === null ? 0 : cur });
      while (cur !== null) {
        st.push(cur);
        const here = cur;
        const l = 2 * cur + 1;
        cur = at(t, l) == null ? null : l;
        P(8, { cur: here });
      }
      P(8, { cur: st[st.length - 1] });
      const node = st.pop();
      P(9, { cur: node });
      res.push(t[node]);
      P(10, { cur: node });
      const r = 2 * node + 2;
      const rn = at(t, r) == null ? null : r;
      cur = rn;
      P(11, { cur: rn === null ? node : rn });
    }
    P(13, { 答案: res.join(",") });
    return S;
  };

  /* 104 最大深度 */
  R[104] = p => {
    const t = T(p), S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    P(4, {});
    const go = (i, depth) => {
      P(4, {});
      if (at(t, i) == null) { P(4, { 返回: 0 }); return 0; }
      const l = go(2 * i + 1, depth + 1);
      P(5, { 返回: l });
      const r = go(2 * i + 2, depth + 1);
      P(5, { 返回: r });
      const v = 1 + Math.max(l, r);
      P(5, { 返回: v });
      return v;
    };
    const ans = go(0, 0);
    P(5, { 返回: ans, 答案: ans });
    return S;
  };

  /* 226 翻转二叉树 */
  R[226] = p => {
    const t = T(p), S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    P(4, {});
    let lastL = "null", lastR = "null";
    const go = i => {
      P(4, {});
      const L = nm(t, 2 * i + 1), Rr = nm(t, 2 * i + 2);
      if (at(t, i) == null) return;
      P(5, { left: Rr, right: L });
      lastL = Rr; lastR = L;
      P(6, { left: lastL, right: lastR });
      go(2 * i + 1);
      P(7, { left: lastL, right: lastR });
      go(2 * i + 2);
      P(8, { left: lastL, right: lastR });
    };
    go(0);
    P(8, { 结果: "镜像" });
    return S;
  };

  /* 101 对称二叉树 */
  R[101] = p => {
    const t = T(p), S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    P(4, {});
    const chk = (a, b, d) => {
      P(7, { a: nm(t, a), b: nm(t, b), 栈深: d });
      if (at(t, a) == null && at(t, b) == null) { P(8, { a: "null", b: "null", 栈深: d, 返回: "true" }); return true; }
      if (at(t, a) == null || at(t, b) == null) { P(9, { a: nm(t, a), b: nm(t, b), 栈深: d, 返回: "false" }); return false; }
      P(10, { a: nm(t, a), b: nm(t, b), 栈深: d });
      if (t[a] !== t[b]) { P(10, { a: nm(t, a), b: nm(t, b), 栈深: d, 返回: "false" }); return false; }
      const ok = chk(2 * a + 1, 2 * b + 2, d + 1);
      P(10, { 返回: String(ok) });
      const ok2 = ok && chk(2 * a + 2, 2 * b + 1, d + 1);
      P(10, { 返回: String(ok2) });
      P(10, { 返回: String(ok2) });
      return ok2;
    };
    const r = chk(1, 2, 1);
    P(4, { 答案: String(r) });
    return S;
  };

  /* 543 直径 */
  R[543] = p => {
    const t = T(p), S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    let ans = 0;
    P(4, { ans });
    P(5, { ans });
    const go = i => {
      P(10, { ans });
      if (at(t, i) == null) { return 0; }
      const l = go(2 * i + 1);
      P(11, { ans });
      const r = go(2 * i + 2);
      P(11, { ans });
      ans = Math.max(ans, l + r);
      P(12, { ans });
      P(13, { ans, 返回: 1 + Math.max(l, r) });
      return 1 + Math.max(l, r);
    };
    const d = go(0);
    P(6, { ans, 返回: d, 答案: ans });
    return S;
  };
})();
