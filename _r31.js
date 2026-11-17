/* step31 — 逐帧独立实现：39 组合总和 */
;(function () {
  const R = window.REPLAY;

  R[39] = p => {
    const a = p.viz.arr.map(Number), target = Number(p.viz.target), n = a.length, S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    const res = [], path = [];
    let remain = target, lastI = 0;
    const base = extra => {
      const o = { target, remain };
      if (lastI !== null && remain !== target) o.i = lastI;
      if (res.length) o["结果数"] = res.length;
      return Object.assign(o, extra || {});
    };
    P(5, { target });
    P(6, { target });
    P(7, { target });
    const dfs = (start, rem) => {
      remain = rem;
      const myRem = rem;
      P(13, res.length ? { target, remain, 结果数: res.length } : { target, remain });
      if (rem === 0) {
        res.push(path.slice());
        P(13, { target, remain, 结果数: res.length });
        P(13, { target, remain, 结果数: res.length });
        return;
      }
      for (let i = start; i < n; i++) {
        lastI = i;
        remain = myRem;
        P(14, Object.assign({ target, remain }, res.length ? { 结果数: res.length } : {}));
        if (a[i] > rem) {
          P(15, Object.assign({ target, remain, i }, res.length ? { 结果数: res.length } : {}));
          break;
        }
        path.push(a[i]);
        P(16, Object.assign({ target, remain, i }, res.length ? { 结果数: res.length } : {}));
        P(17, Object.assign({ target, remain, i }, res.length ? { 结果数: res.length } : {}));
        dfs(i, rem - a[i]);
        P(17, Object.assign({ target, remain, i: lastI }, res.length ? { 结果数: res.length } : {}));
        path.pop();
        P(18, Object.assign({ target, remain, i: lastI }, res.length ? { 结果数: res.length } : {}));
      }
      P(18, Object.assign({ target, remain, i: lastI }, res.length ? { 结果数: res.length } : {}));
    };
    dfs(0, target);
    P(8, { target, remain: 0, i: lastI, 结果数: res.length, 答案: res.map(r => "[" + r.join(",") + "]").join(" ") });
    return S;
  };
})();
