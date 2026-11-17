/* step11 — 逐帧独立实现：200 岛屿数量 */
;(function () {
  const R = window.REPLAY;

  R[200] = p => {
    const g = p.viz.grid.map(r => r.slice()), m = g.length, n = g[0].length, S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    let cnt = 0;
    P(4, { cnt, i: 0, j: 0 });

    const sink = (i, j, d) => {
      P(11, { cnt, i, j });
      const bad = i < 0 || i >= m || j < 0 || j >= n || g[i][j] !== "1";
      P(12, { cnt, i, j });
      if (bad) return;
      g[i][j] = "0";
      P(14, { cnt, i, j });
      P(15, { cnt, i, j });
      sink(i + 1, j, d + 1);
      sink(i - 1, j, d + 1);
      sink(i, j + 1, d + 1);
      sink(i, j - 1, d + 1);
      P(15, { cnt, i, j });
    };

    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        P(5, { cnt, i, j });
        if (g[i][j] === "1") {
          cnt++;
          P(7, { cnt, i, j });
          sink(i, j, 1);
        }
      }
    }
    P(8, { cnt, 答案: cnt });
    return S;
  };
})();
