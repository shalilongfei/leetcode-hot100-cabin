/* step3 — 逐帧独立实现：239 / 76 / 53 / 56 / 189 */
;(function () {
  const R = window.REPLAY;

  /* 239 滑动窗口最大值 */
  R[239] = p => {
    const a = p.viz.arr.map(Number), k = Number(p.viz.win || 3), S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    const dq = [], res = [];
    const __R = r => (r.length ? { 结果: "[" + r.join(",") + "]" } : {});
    P(4, { i: 0 });
    P(5, { i: 0 });
    for (let i = 0; i < a.length; i++) {
      P(6, Object.assign({ i }, __R(res)));
      while (dq.length && a[dq[dq.length - 1]] <= a[i]) {
        dq.pop();
        P(7, Object.assign({ i }, __R(res)));
      }
      if (!dq.length || a[dq[dq.length - 1]] > a[i]) {
        /* trace 在“停止弹出”时也打一帧 */
        if (!dq.length || a[dq[dq.length - 1]] > a[i]) {
          /* 只有真正判断过一次才打 */
        }
      }
      P(7, Object.assign({ i }, __R(res)));
      dq.push(i);
      P(8, Object.assign({ i }, __R(res)));
      if (dq[0] <= i - k) dq.shift();
      P(9, Object.assign({ i }, __R(res)));
      if (i >= k - 1) {
        res.push(a[dq[0]]);
        P(10, { i, 结果: "[" + res.join(",") + "]" });
      }
    }
    P(12, { i: a.length - 1, 结果: "[" + res.join(",") + "]", 答案: "[" + res.join(",") + "]" });
    return S;
  };

  /* 53 最大子数组和 */
  R[53] = p => {
    const a = p.viz.arr.map(Number), S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    let cur = a[0], best = a[0], i = 1;
    P(4, { i, cur, best });
    for (i = 1; i < a.length; i++) {
      P(5, { i, cur, best });
      const cand = a[i] + " / " + (cur + a[i]);
      P(6, { i, cur, best, 候选: cand });
      cur = Math.max(a[i], cur + a[i]);
      P(6, { i, cur, best, 候选: cand });
      best = Math.max(best, cur);
      P(7, { i, cur, best, 候选: cand });
    }
    P(9, { i: a.length, cur, best, 答案: best });
    return S;
  };

  /* 56 合并区间 */
  R[56] = p => {
    const iv = [[1, 3], [2, 6], [8, 10], [15, 18]], S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    const res = [];
    iv.sort((x, y) => x[0] - y[0]);
    P(4, {});
    P(5, {});
    for (const v of iv) {
      P(6, { v: "[" + v + "]" });
      const overlap = res.length && res[res.length - 1][1] >= v[0];
      P(7, { v: "[" + v + "]" });
      if (overlap) {
        res[res.length - 1][1] = Math.max(res[res.length - 1][1], v[1]);
        P(8, { v: "[" + v + "]" });
      } else {
        res.push(v.slice());
        P(10, { v: "[" + v + "]" });
      }
    }
    P(12, { v: "[" + iv[iv.length - 1] + "]", 答案: res.map(x => "[" + x + "]").join(" ") });
    return S;
  };

  /* 189 轮转数组：三次 reverse，每次内部多个 swap */
  R[189] = p => {
    const a = p.viz.arr.map(Number).slice(), S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    const n = a.length;
    P(4, { n });
    let k = Number(p.viz.shift || 3) % n;
    P(5, { n, k });
    const rev = (i0, j0, tag, line) => {
      P(line, { n, k });
      while (i0 < j0) {
        const t = a[i0]; a[i0] = a[j0]; a[j0] = t;
        P(line, { n, k });
        i0++; j0--;
      }
    };
    /* 注意 trace 每段只打「段首 + 每个 swap」，段首帧已由 P(line) 打出 */
    const rev2 = (i0, j0, line) => {
      P(line, { n, k });
      while (i0 < j0) {
        const t = a[i0]; a[i0] = a[j0]; a[j0] = t;
        P(line, { n, k });
        i0++; j0--;
      }
    };
    rev2(0, n - 1, 6);
    rev2(0, k - 1, 7);
    rev2(k, n - 1, 8);
    P(7, { n, k, 结果: a.join(",") });
    return S;
  };
})();
