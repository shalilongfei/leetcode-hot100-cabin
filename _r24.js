/* step24 — 逐帧独立实现：70 / 118 / 394 */
;(function () {
  const R = window.REPLAY;

  /* 70 爬楼梯 */
  R[70] = p => {
    const S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    let a = 1, b = 1;
    P(4, { a, b, i: 0 });
    for (let i = 0; i < 5; i++) {
      P(5, { a, b, i });
      const t = a + b; a = b; b = t;
      P(8, { a, b, i });
    }
    P(10, { a, b, i: 4, 答案: a });
    return S;
  };

  /* 118 杨辉三角 */
  R[118] = p => {
    const rows = 4, S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    const res = [];
    P(4, { i: 0, j: 1 });
    for (let i = 0; i < rows; i++) {
      P(6, res.length ? { i, j: 1, 行数: res.length } : { i, j: 1 });
      const row = new Array(i + 1).fill(1);
      for (let j = 1; j < i; j++) {
        row[j] = res[i - 1][j - 1] + res[i - 1][j];
        P(8, { i, j, 行数: res.length });
      }
      res.push(row);
      P(9, { i, j: Math.max(1, i - 1), 行数: res.length });
    }
    P(11, { i: rows - 1, j: 2, 行数: res.length, 答案: JSON.stringify(res).replace(/ /g, "") });
    return S;
  };

  /* 394 字符串解码 */
  R[394] = p => {
    const s = p.viz.arr, S = [], stack = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    let cur = "", num = 0, i = 0;
    const base = () => ({ num, i, cur: JSON.stringify(cur) });
    P(4, { num: 0, i: 0, cur: '""' });
    P(5, { num: 0, i: 0, cur: '""' });
    P(6, { num: 0, i: 0, cur: '""' });
    for (i = 0; i < s.length; i++) {
      const c = s[i];
      P(7, Object.assign(base(), { c: "'" + c + "'" }));
      P(8, Object.assign(base(), { c: "'" + c + "'" }));
      if (c >= "0" && c <= "9") {
        num = num * 10 + Number(c);
        P(8, Object.assign(base(), { c: "'" + c + "'" }));
      } else {
        P(9, Object.assign(base(), { c: "'['" }));
        if (c === "[") {
          stack.push({ n: num, str: cur });
          P(10, Object.assign(base(), { c: "'" + c + "'" }));
          cur = "";
          P(11, Object.assign(base(), { c: "'" + c + "'" }));
          num = 0;
          P(12, Object.assign(base(), { c: "'" + c + "'" }));
        } else {
          P(13, Object.assign(base(), { c: "']'" }));
          if (c === "]") {
            const top = stack.pop();
            P(14, Object.assign(base(), { c: "'" + c + "'" }));
            cur = top.str + cur.repeat(top.n);
            P(17, Object.assign(base(), { c: "'" + c + "'" }));
          } else {
            cur += c;
            P(18, Object.assign(base(), { c: "'" + c + "'" }));
          }
        }
      }
    }
    P(20, { num, i: s.length - 1, cur: JSON.stringify(cur), 答案: cur });
    return S;
  };
})();
