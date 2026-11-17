/* step21 — 逐帧独立实现：20 / 155 / 739 */
;(function () {
  const R = window.REPLAY;

  /* 20 有效括号 */
  R[20] = p => {
    const s = p.viz.arr, S = [], st = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    const base = extra => Object.assign({}, extra || {});
    for (const c of s) {
      P(5, { c: "'" + c + "'" });
      if (c === "(" || c === "[" || c === "{") {
        st.push(c);
        P(6, { c: "'" + c + "'" });
        continue;
      }
      P(7, { c: "'" + c + "'" });
      if (!st.length) { P(8, { c: "'" + c + "'", 答案: "false" }); return S; }
      const t = st.pop();
      const ok = (c === ")" && t === "(") || (c === "]" && t === "[") || (c === "}" && t === "{");
      P(10, { c: "'" + t + "'" });
      if (!ok) { P(10, { c: "'" + c + "'", 答案: "false" }); return S; }
      P(12, { c: "'" + t + "'" });
    }
    P(15, { c: "'('", 答案: String(st.length === 0) });
    return S;
  };

  /* 155 最小栈 */
  R[155] = p => {
    const ops = p.viz.arr, S = [], data = [], mins = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    const st = () => (data.length ? data.join(",") : "空");
    const mn = () => (mins.length ? mins[mins.length - 1] : "?");
    ops.forEach(op => {
      if (op.indexOf("push") === 0) {
        const v = Number(op.slice(5, -1));
        P(5, { 栈: st(), 最小值: mn() });
        data.push(v);
        P(6, { 栈: st(), 最小值: mn() });
        mins.push(mins.length ? Math.min(v, mins[mins.length - 1]) : v);
        P(7, { 栈: st(), 最小值: mn() });
      } else if (op === "pop") {
        P(9, { 栈: st(), 最小值: mn() });
        data.pop(); mins.pop();
        P(9, { 栈: st(), 最小值: mn() });
      } else if (op === "getMin") {
        P(11, { 栈: st(), 最小值: mn(), 返回: mn() });
      } else {
        P(12, { 栈: st(), 最小值: mn(), 返回: data[data.length - 1] });
      }
    });
    return S;
  };

  /* 739 每日温度 */
  R[739] = p => {
    const t = p.viz.arr.map(Number), n = t.length, S = [], res = new Array(n).fill(0), st = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    P(4, { i: 0 });
    P(5, { i: 0 });
    P(6, { i: 0 });
    for (let i = 0; i < n; i++) {
      P(7, { i, T: t[i] });
      while (st.length && t[st[st.length - 1]] < t[i]) {
        P(9, { i, T: t[i] });
        const j = st.pop();
        res[j] = i - j;
      }
      P(8, { i, T: t[i] });
      st.push(i);
      P(12, { i, T: t[i] });
    }
    P(14, { i: n - 1, T: t[n - 1], 答案: res.join(",") });
    return S;
  };
})();
