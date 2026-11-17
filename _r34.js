/* step34 — 逐帧独立实现：79 单词搜索 */
;(function () {
  const R = window.REPLAY;

  R[79] = p => {
    const g = (p.viz.grid || []).map(r => r.slice()), m = g.length, n = m ? g[0].length : 0, S = [];
    const w = "ABCCED", W = w.length;
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    let lastI = 0, lastJ = 0, lastK = 0;
    P(4, {});
    const dfs = (i, j, k) => {
      lastI = i; lastJ = j; lastK = k;
      P(11, { i, j, k });
      if (k === W) { P(12, { i, j, k }); return true; }
      P(13, { i, j, k });
      if (i < 0 || i >= m || j < 0 || j >= n || g[i][j] !== w[k]) { P(14, { i, j, k }); return false; }
      const tmp = g[i][j];
      g[i][j] = "#";
      P(16, { i, j, k });
      P(17, { i, j, k });
      let ok = false;
      for (const [di, dj] of dirs) {
        ok = dfs(i + di, j + dj, k + 1);
        if (ok) break;
      }
      P(17, { i, j, k: lastK });
      g[i][j] = tmp;
      P(19, { i, j, k: lastK });
      P(20, { i, j, k: lastK });
      return ok;
    };
    let found = false;
    for (let i = 0; i < m && !found; i++) {
      for (let j = 0; j < n && !found; j++) {
        P(7, { i, j });
        if (dfs(i, j, 0)) found = true;
      }
    }
    P(7, { i: 0, j: 0, 答案: String(found) });
    return S;
  };
})();
