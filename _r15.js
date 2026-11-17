/* step15 — 逐帧独立实现：78 子集 */
;(function () {
  const R = window.REPLAY;

  R[78] = p => {
    const nums = p.viz.arr.map(Number), n = nums.length, S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    const res = [];
    P(4, {}); P(5, {}); P(6, {});
    const bt = (start, path, callerI) => {
      const hd = callerI === undefined ? {} : { i: callerI };
      P(12, Object.assign({}, hd, res.length ? { 结果数: res.length } : {}));
      res.push(path.slice());
      P(12, Object.assign({ 结果数: res.length }, hd));
      for (let i = start; i < n; i++) {
        P(13, { 结果数: res.length, i });
        path.push(nums[i]);
        P(14, { 结果数: res.length, i });
        P(15, { 结果数: res.length, i });
        bt(i + 1, path, i);
        P(15, { 结果数: res.length, i });
        P(16, { 结果数: res.length, i });
        path.pop();
      }
      P(16, { 结果数: res.length, i: n });
    };
    bt(0, [], undefined);
    P(7, { 结果数: res.length, i: n, 答案: res.length + " 个" });
    return S;
  };
})();
