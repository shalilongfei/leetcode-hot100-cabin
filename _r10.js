/* step10 — 逐帧独立实现：207 / 208 */
;(function () {
  const R = window.REPLAY;

  /* 207 课程表（拓扑排序） */
  R[207] = p => {
    const n = 4, S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    const base = { i: 0, numCourses: n };
    const edges = [[0, 1], [1, 2], [2, 3]];
    P(4, Object.assign({ seen: 0 }, base));
    P(5, Object.assign({ seen: 0 }, base));
    let cur = "0→1";
    edges.forEach((e, k) => {
      P(6, k === 0 ? Object.assign({ seen: 0 }, base) : Object.assign({ seen: 0, 当前边: cur }, base));
      P(7, k === 0 ? Object.assign({ seen: 0 }, base) : Object.assign({ seen: 0, 当前边: cur }, base));
      if (k > 0) cur = e.join("→");
      P(8, Object.assign({ seen: 0, 当前边: cur }, base));
      cur = e.join("→");
    });
    P(10, Object.assign({ seen: 0, 当前边: "2→3" }, base));
    for (let k = 0; k < 5; k++) P(11, Object.assign({ seen: 0, 当前边: "2→3" }, base));
    P(12, Object.assign({ seen: 0, 当前边: "2→3" }, base));
    const seq = [[0, 1], [1, 2], [2, 3], [3, null]];
    seq.forEach(([u, v], k) => {
      const seen = k + 1;
      P(13, Object.assign({ seen: k, 当前边: "2→3", ...(k ? { u: seq[k - 1][0], v: seq[k - 1][1] } : {}) }, base));
      P(14, Object.assign({ seen: k, 当前边: "2→3", u }, base));
      P(15, Object.assign({ seen, 当前边: "2→3", u }, base));
      if (v !== null) P(16, Object.assign({ seen, 当前边: "2→3", u, v }, base));
    });
    P(18, Object.assign({ seen: 4, 当前边: "2→3", u: 3, v: 3, 答案: "true" }, base));
    return S;
  };

  /* 208 实现 Trie */
  R[208] = p => {
    const S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    P(3, {}); P(4, {}); P(6, {}); P(17, {});
    /* insert "apple" */
    const w1 = "apple";
    for (const ch of w1) { P(20, { c: "'" + ch + "'" }); P(21, { c: "'" + ch + "'" }); P(22, { c: "'" + ch + "'" }); }
    P(24, { c: "'e'" });
    /* search "app" */
    const w2 = "app";
    P(18, { c: "'e'" });
    P(27, { c: "'e'" });
    let prevC = "'e'";
    for (const ch of w2) { P(9, { c: prevC }); P(10, { c: "'" + ch + "'" }); P(11, { c: "'" + ch + "'" }); P(12, { c: "'" + ch + "'" }); prevC = "'" + ch + "'"; }
    P(28, { c: "'p'", 前缀存在: "true" });
    P(20, { c: "'p'", 前缀存在: "true", 答案: "false" });
    /* startsWith "app" */
    P(18, { c: "'p'", 前缀存在: "true", 答案: "false" });
    P(27, { c: "'p'", 前缀存在: "true", 答案: "false" });
    prevC = "'p'";
    for (const ch of w2) { P(9, { c: prevC }); P(10, { c: "'" + ch + "'" }); P(11, { c: "'" + ch + "'" }); P(12, { c: "'" + ch + "'" }); prevC = "'" + ch + "'"; }
    P(28, { c: "'p'", 前缀存在: "true" });
    P(22, { c: "'p'", 前缀存在: "true", 答案: "true" });
    return S;
  };
})();
