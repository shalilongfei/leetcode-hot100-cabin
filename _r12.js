/* step12 — 逐帧独立实现：994 腐烂的橘子 */
;(function () {
  const R = window.REPLAY;

  R[994] = p => {
    const g = p.viz.grid.map(r => r.slice()), m = g.length, n = g[0].length, S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    let fresh = 0, minutes = 0, q = [];
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) {
      if (g[i][j] === 2) q.push([i, j]);
      else if (g[i][j] === 1) fresh++;
    }
    let ci = 0, cj = 0, cx = 0, cy = 0;
    const base = (extra) => Object.assign({ fresh, minutes, i: ci, j: cj }, extra || {});
    P(4, { fresh: 0, minutes: 0, i: 0, j: 0 });
    P(9, { fresh: 0, minutes: 0, i: 0, j: 0 });
    P(6, base());
    P(6, base());
    let guard = 0;
    while (q.length && fresh && guard++ < 8) {
      P(12, base());
      ci = q[0][0]; cj = q[0][1];
      P(13, base());
      const sz = q.length;
      P(14, base({ sz }));
      const nq = [];
      for (let k = 0; k < sz; k++) {
        const [i, j] = q[k];
        ci = i; cj = j;
        P(15, base({ sz }));
        for (const [dx, dy] of dirs) {
          const x = i + dx, y = j + dy;
          cx = x; cy = y;
          P(17, base({ sz, x, y }));
          if (x >= 0 && x < m && y >= 0 && y < n && g[x][y] === 1) {
            g[x][y] = 2;
            ci = x; cj = y;
            P(19, base({ sz, x, y }));
            fresh--;
            P(20, base({ sz, x, y }));
            nq.push([x, y]);
            P(21, base({ sz, x, y }));
          }
        }
      }
      q = nq;
      minutes++;
      P(25, base({ sz, x: cx, y: cy }));
    }
    P(27, { fresh, minutes, i: ci, j: cj, sz: q.length || 1, x: cx, y: cy, 答案: fresh ? -1 : minutes });
    return S;
  };
})();
