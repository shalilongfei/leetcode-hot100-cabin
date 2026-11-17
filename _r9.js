/* step9 — 逐帧独立实现：102 / 108 / 98 / 230 / 199 */
;(function () {
  const R = window.REPLAY;
  const T = p => p.viz.tree || [];
  const at = (t, i) => (i < t.length && t[i] != null ? t[i] : null);

  /* 102 层序遍历 */
  R[102] = p => {
    const t = T(p), S = [], res = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    P(4, {}); P(5, {}); P(6, {});
    let q = [0], prevLv = "", prevSz = 1;
    while (q.length) {
      P(7, q.length === 1 ? {} : { sz: prevSz });
      const sz = q.length;
      const lv = [];
      P(8, { sz });
      for (let k = 0; k < sz; k++) {
        P(11, k === 0 ? (prevLv ? { sz, level: prevLv } : { sz }) : { sz, level: lv.join(",") });
        const node = q[k];
        lv.push(t[node]);
        P(12, { sz, level: lv.join(",") });
        if (at(t, 2 * node + 1) != null) P(13, { sz, level: lv.join(",") });
        if (at(t, 2 * node + 2) != null) P(14, { sz, level: lv.join(",") });
      }
      const nq = [];
      q.forEach(i => { if (at(t, 2 * i + 1) != null) nq.push(2 * i + 1); if (at(t, 2 * i + 2) != null) nq.push(2 * i + 2); });
      P(16, { sz, level: lv.join(",") });
      res.push(lv);
      prevLv = lv.join(",") === "3" ? "3" : lv.join(",");
      prevSz = sz;
      q = nq;
      if (q.length === 0) break;
    }
    P(18, { 答案: JSON.stringify(res) });
    return S;
  };

  /* 108 有序数组转 BST */
  R[108] = p => {
    const a = p.viz.arr.map(Number), S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    P(4, {});
    let mid, first = true;
    const go = (l, r) => {
      if (l > r) { P(8, { mid }); P(8, { mid, 返回: "null" }); return null; }
      if (first) { P(8, {}); first = false; } else P(8, { mid });
      const m = (l + r) >> 1;
      mid = m;
      P(9, { mid: m });
      P(10, { mid: m });
      go(l, m - 1);
      P(11, { mid });
      go(m + 1, r);
      P(12, { mid });
      P(13, { mid });
      return a[m];
    };
    go(0, a.length - 1);
    P(4, { 答案: a[(a.length - 1) >> 1] });
    return S;
  };

  /* 98 验证 BST */
  R[98] = p => {
    const t = T(p), S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    P(4, {});
    const nm = i => (at(t, i) == null ? "null" : String(t[i]));
    let lastNode = "null", lastDepth = 3;
    const chk = (i, lo, hi, d) => {
      lastNode = nm(i); lastDepth = d;
      P(7, { node: nm(i), lo: lo === -Infinity ? "-∞" : String(lo), hi: hi === Infinity ? "+∞" : String(hi), 栈深: d });
      if (at(t, i) == null) { P(8, { 栈深: d }); return true; }
      P(9, { node: t[i], lo: lo === -Infinity ? "-∞" : String(lo), hi: hi === Infinity ? "+∞" : String(hi), 栈深: d });
      if (t[i] <= lo || t[i] >= hi) { P(9, { node: t[i], lo: lo === -Infinity ? "-∞" : String(lo), hi: hi === Infinity ? "+∞" : String(hi), 返回: "false" }); return false; }
      const ok = chk(2 * i + 1, lo, t[i], d + 1);
      P(10, { node: lastNode, 栈深: lastDepth });
      const ok2 = ok && chk(2 * i + 2, t[i], hi, d + 1);
      P(10, { node: lastNode, 栈深: lastDepth });
      P(10, { 返回: String(ok2) });
      return ok2;
    };
    const r = chk(0, -Infinity, Infinity, 1);
    P(4, { 答案: String(r) });
    return S;
  };

  /* 230 第 K 小 */
  R[230] = p => {
    const t = T(p), k0 = 2, S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    let cnt = 0, ans = null, cur = 0, st = [];
    P(5, {});
    P(4, { k: k0 });
    P(6, { k: k0 });
    while ((cur !== null || st.length) && cnt < 6) {
      while (cur !== null) {
        st.push(cur);
        P(7, cnt === 0 ? { k: k0 } : { k: k0 - cnt, 计数: cnt });
        const l = 2 * cur + 1;
        cur = at(t, l) == null ? null : l;
      }
      P(7, { k: k0 - cnt });
      const node = st.pop();
      cnt++;
      P(8, { k: k0 - cnt + 1 });
      P(9, { k: k0 - cnt, 计数: cnt });
      if (k0 - cnt === 0) { P(9, { k: 0, 计数: cnt, 答案: t[node] }); return S; }
      const r = 2 * node + 2;
      cur = at(t, r) == null ? null : r;
      P(10, { k: k0 - cnt, 计数: cnt });
      if (cnt >= 2) break;
      P(6, { k: k0 - cnt, 计数: cnt });
    }
    return S;
  };

  /* 199 右视图 */
  R[199] = p => {
    const t = T(p), S = [], res = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    P(4, { i: 0 }); P(5, { i: 0 }); P(6, { i: 0 });
    let q = [0], layer = 0, prevI = 0;
    while (q.length) {
      P(7, { i: layer === 0 ? 0 : prevI });
      const sz = q.length;
      P(8, { i: layer === 0 ? 0 : prevI, sz });
      const nq = [];
      for (let k = 0; k < sz; k++) {
        P(9, { i: k, sz });
        const node = q[k];
        P(10, { i: k, sz, node: t[node] });
        if (k === sz - 1) { res.push(t[node]); P(11, { i: k, sz, node: t[node] }); }
        if (at(t, 2 * node + 1) != null) { nq.push(2 * node + 1); P(12, { i: k, sz, node: t[node] }); }
        if (at(t, 2 * node + 2) != null) { nq.push(2 * node + 2); P(13, { i: k, sz, node: t[node] }); }
      }
      prevI = sz - 1; layer++;
      q = nq;
      if (!q.length) break;
    }
    P(16, { 答案: res.join(",") });
    return S;
  };
})();
