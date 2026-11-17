/* step32 — 逐帧独立实现：17 / 22 */
;(function () {
  const R = window.REPLAY;

  /* 17 电话号码的字母组合 */
  R[17] = p => {
    const digits = p.viz.arr, n = digits.length, S = [];
    const mp = { 2: "abc", 3: "def", 4: "ghi", 5: "jkl", 6: "mno", 7: "pqrs", 8: "tuv", 9: "wxyz" };
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    const res = [];
    let path = "", deepI = 0, deepC = "'a'";
    P(5, {});
    P(9, {});
    const dfs = (i) => {
      deepI = i;
      P(13, i ? { i, c: deepC } : { i });
      if (i === n) { res.push(path); P(14, { i, c: deepC }); P(14, { i, c: deepC }); return; }
      const cands = mp[digits[i]];
      P(15, { i, c: "'" + digits[i] + "'" });
      let myC = "'" + cands[0] + "'";
      for (const c of cands) {
        deepI = i; deepC = "'" + c + "'"; myC = deepC;
        P(15, { i, c: deepC });
        path += c;
        P(16, { i, c: deepC });
        P(17, { i, c: deepC });
        dfs(i + 1);
        P(17, { i: deepI, c: deepC });
        path = path.slice(0, -1);
        P(18, { i: deepI, c: myC });
      }
      P(18, { i: deepI, c: myC });
    };
    dfs(0);
    P(10, { i: deepI, c: "'c'", 答案: res.join(",") });
    return S;
  };

  /* 22 括号生成 */
  R[22] = p => {
    const n = 3, S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    const res = [];
    let path = "", deepO = 0, deepC = 0;
    const B = () => (res.length ? { n, open: deepO, close: deepC, 结果数: res.length } : { n, open: deepO, close: deepC });
    P(4, { n });
    P(5, { n });
    P(6, { n });
    const dfs = (open, close) => {
      deepO = open; deepC = close;
      P(10, B());
      if (path.length === 2 * n) { res.push(path); P(11, B()); P(11, B()); return; }
      P(12, B());
      if (open < n) {
        path += "(";
        P(13, B());
        P(14, B());
        dfs(open + 1, close);
        P(14, B());
        path = path.slice(0, -1);
        P(15, B());
      }
      P(17, B());
      if (close < open) {
        path += ")";
        P(18, B());
        P(19, B());
        dfs(open, close + 1);
        P(19, B());
        path = path.slice(0, -1);
        P(20, B());
      }
      P(20, B());
    };
    dfs(0, 0);
    P(7, Object.assign({ n }, B(), { 答案: res.join(" ") }));
    return S;
  };
})();
