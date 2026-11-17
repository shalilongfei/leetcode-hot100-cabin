/* step4 — 逐帧独立实现：238 / 41 / 73 / 54 / 48 */
;(function () {
  const R = window.REPLAY;

  /* 238 除自身乘积 */
  R[238] = p => {
    const a = p.viz.arr.map(Number), n = a.length, S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    const res = new Array(n).fill(1);
    P(4, { i: 1, n });
    P(5, { i: 1, n });
    for (let i = 1; i < n; i++) {
      P(6, { i, n });
      res[i] = res[i - 1] * a[i - 1];
      P(6, { i, n, 阶段: "前缀积" });
    }
    let right = 1;
    P(7, { i: n - 1, n, 阶段: "前缀积", right });
    for (let i = n - 1; i >= 0; i--) {
      P(8, { i, n, 阶段: "后缀积", right });
      res[i] *= right;
      P(9, { i, n, 阶段: "后缀积", right });
      right *= a[i];
      P(10, { i, n, 阶段: "后缀积", right });
    }
    P(12, { i: 0, n, 阶段: "后缀积", right, 答案: res.join(",") });
    return S;
  };

  /* 41 缺失的第一个正数 */
  R[41] = p => {
    const a = p.viz.arr.map(Number).slice(), n = a.length, S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    P(4, { i: 0, n });
    for (let i = 0; i < n; i++) {
      P(5, { i, n });
      while (a[i] >= 1 && a[i] <= n && a[a[i] - 1] !== a[i]) {
        P(6, { i, n });
        const j = a[i] - 1, t = a[i]; a[i] = a[j]; a[j] = t;
        P(7, { i, n });
      }
      P(6, { i, n });
    }
    for (let i = 0; i < n; i++) {
      P(8, { i, n });
      if (a[i] !== i + 1) { P(9, { i, n, 答案: i + 1 }); return S; }
    }
    P(8, { i: n, n });
    P(9, { i: n, n, 答案: n + 1 });
    return S;
  };

  /* 73 矩阵置零 */
  R[73] = p => {
    const g = p.viz.grid.map(r => r.slice()), m = g.length, n = g[0].length, S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    let row0 = false, col0 = false;
    P(4, { j: 1, i: 0, m, n });
    P(5, { j: 1, i: 0, m, n });
    for (let j = 0; j < n; j++) {
      P(6, { j, i: 0, m, n });
      if (g[0][j] === 0) row0 = true;
    }
    P(6, { j: n - 1, i: 0, m, n, row0 });
    for (let i = 0; i < m; i++) {
      P(7, { j: 0, i, m, n, row0 });
      if (g[i][0] === 0) col0 = true;
    }
    P(7, { j: 0, i: m - 1, m, n, row0, col0 });
    for (let i = 1; i < m; i++) for (let j = 1; j < n; j++) {
      P(8, { j, i, m, n, row0, col0 });
      if (g[i][j] === 0) { g[i][0] = 0; g[0][j] = 0; P(10, { j, i, m, n, row0, col0 }); }
    }
    for (let i = 1; i < m; i++) for (let j = 1; j < n; j++) {
      if (g[i][0] === 0 || g[0][j] === 0) { g[i][j] = 0; P(13, { j, i, m, n, row0, col0 }); }
    }
    P(15, { j: 1, i: m - 1, m, n, row0, col0, 答案: g.map(r => r.join(",")).join(";") });
    return S;
  };

  /* 54 螺旋矩阵 */
  R[54] = p => {
    const g = p.viz.grid, S = [], res = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    P(4, {});
    P(5, {});
    if (!g.length) return S;
    let top = 0, bottom = g.length - 1, left = 0, right = g[0].length - 1;
    P(6, { bottom });
    P(7, { bottom, right });
    while (top <= bottom && left <= right) {
      P(8, { bottom, right });
      for (let j = left; j <= right; j++) { res.push(g[top][j]); P(9, { bottom, right, i: top, j }); }
      top++;
      P(10, { bottom, right, i: top - 1, j: right });
      for (let i = top; i <= bottom; i++) { res.push(g[i][right]); P(11, { bottom, right, i, j: right }); }
      right--;
      P(12, { bottom, right, i: bottom, j: right + 1 });
      if (top <= bottom) {
        P(13, { bottom, right });
        for (let j = right; j >= left; j--) { res.push(g[bottom][j]); P(14, { bottom, right, i: bottom, j }); }
        bottom--;
        P(15, { bottom, right, i: bottom + 1, j: left });
      }
      if (left <= right) {
        P(17, { bottom, right });
        for (let i = bottom; i >= top; i--) { res.push(g[i][left]); P(18, { bottom, right, i, j: left }); }
        left++;
        P(19, { bottom, right, i: top, j: left - 1 });
      }
    }
    P(22, { bottom, right, i: top - 1, j: left, 答案: res.join(",") });
    return S;
  };

  /* 48 旋转图像 */
  R[48] = p => {
    const g = p.viz.grid.map(r => r.slice()), n = g.length, S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    P(4, { i: 0, n });
    for (let i = 0; i < n; i++) {
      P(5, { i, n, j: 0 });
      for (let j = i + 1; j < n; j++) {
        P(6, { i, n, j });
        const t = g[i][j]; g[i][j] = g[j][i]; g[j][i] = t;
        P(7, { i, n, j });
      }
    }
    P(5, { i: n - 1, n, j: 0 });
    for (let r = 0; r < n; r++) {
      P(8, { i: r, n, j: 0 });
      g[r].reverse();
      P(8, { i: r, n, j: 0 });
    }
    P(8, { i: n - 1, n, j: 0, 答案: g.map(x => x.join(",")).join(";") });
    return S;
  };
})();
