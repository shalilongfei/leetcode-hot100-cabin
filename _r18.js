/* step18 — 逐帧独立实现：46 全排列 */
;(function () {
  const R = window.REPLAY;

  R[46] = p => {
    const nums = p.viz.arr.map(Number), n = nums.length, S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    const res = [], path = [], used = new Array(n).fill(false);
    let lastI = 0;
    const base = extra => {
      const o = { i: lastI };
      if (res.length) o["结果数"] = res.length;
      return Object.assign(o, extra || {});
    };
    P(4, { i: 0 }); P(5, { i: 0 }); P(6, { i: 0 }); P(7, { i: 0 });
    const bt = () => {
      P(13, base());
      if (path.length === n) {
        res.push(path.slice());
        P(13, base());
        P(13, base());
        return;
      }
      for (let i = 0; i < n; i++) {
        lastI = i;
        P(14, base());
        P(15, base());
        if (used[i]) { P(15, base()); continue; }
        used[i] = true;
        P(16, base());
        path.push(nums[i]);
        P(17, base());
        P(18, base());
        bt();
        P(18, base());
        path.pop();
        P(19, base());
        used[i] = false;
        P(20, Object.assign({}, base(), { i }));
      }
      P(20, base());
    };
    bt();
    P(8, base({ 答案: res.length + " 个" }));
    return S;
  };
})();
