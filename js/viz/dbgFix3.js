/* dbgFix3 — 53 课程表 / 99 下一个排列 / 91 不同路径：补足逐步过程 */
;(function () {

  /* ============ 207 课程表：完整拓扑排序 ============ */
  window.DBG[207] = p => {
    const n = 4, pre = [[1, 0], [2, 1], [3, 2]];   // 0 → 1 → 2 → 3
    const S = [];
    const g = Array.from({ length: n }, () => []);
    const indeg = new Array(n).fill(0);
    const F = (l, note, extra) => S.push(Object.assign({
      line: l, note,
      map: Object.assign({ 入度: indeg.map((v, i) => i + ":" + v).join(" ") }, (extra && extra.map) || {}),
      vars: Object.assign({ numCourses: n }, (extra && extra.vars) || {})
    }, extra || {}));

    F(4, `g 建 ${n} 个空链表`, { map: { 入度: indeg.map((v, i) => i + ":" + v).join(" ") } });
    F(5, `indeg 全 0`, {});

    pre.forEach((e, k) => {
      F(6, `prerequisites[${k}] = {${e[0]}, ${e[1]}}（${e[1]} → ${e[0]}）`, {});
      g[e[1]].push(e[0]);
      F(7, `g[${e[1]}].push_back(${e[0]})`, { map: { 邻接: g.map((v, i) => i + ":[" + v + "]").join(" ") } });
      indeg[e[0]]++;
      F(8, `++indeg[${e[0]}] = ${indeg[e[0]]}`, { vars: { 当前边: `${e[1]}→${e[0]}` } });
    });

    const q = [];
    F(10, `queue q 空`, { map: { 邻接: g.map((v, i) => i + ":" + "[" + v + "]").join(" ") } });
    for (let i = 0; i < n; i++) {
      F(11, `indeg[${i}] == 0 ? ${indeg[i] === 0}`, {});
      if (indeg[i] === 0) { q.push(i); F(11, `→ q.push(${i})，队列 [${q}]`, { stack: q.map(String) }); }
    }

    let seen = 0;
    F(12, `seen = 0，队列 [${q}]`, { stack: q.map(String) });
    let guard = 0;
    while (q.length && guard++ < 20) {
      F(13, `while (!q.empty()) → [${q}]`, { stack: q.map(String), vars: { seen } });
      const u = q.shift();
      F(14, `u = q.front() = ${u}，pop`, { stack: q.map(String), vars: { u, seen } });
      seen++;
      F(15, `++seen = ${seen}`, { vars: { u, seen } });
      for (const v of g[u]) {
        indeg[v]--;
        F(16, `邻边 ${u}→${v}：--indeg[${v}] = ${indeg[v]}` + (indeg[v] === 0 ? ` → 入队` : ""), { vars: { u, v, seen } });
        if (indeg[v] === 0) q.push(v);
      }
    }
    F(18, `seen(${seen}) == numCourses(${n}) ? → ${seen === n}`, { vars: { seen, 答案: String(seen === n) } });
    return S;
  };

  /* ============ 31 下一个排列：展开两个 while ============ */
  window.DBG[31] = p => {
    const a = p.viz.arr.slice(), n = a.length, S = [];
    const F = (l, note, extra) => S.push(Object.assign({ line: l, note, arr: a.slice() }, extra || {}));

    let i = n - 2;
    F(4, `n = ${n}, i = n - 2 = ${i}`, { ptr: { i }, vars: { n, i } });

    let g1 = 0;
    while (i >= 0 && a[i] >= a[i + 1] && g1++ < 20) {
      F(5, `nums[${i}] = ${a[i]} >= nums[${i + 1}] = ${a[i + 1]} → 已经是降序，--i`, { ptr: { i }, hi: [i, i + 1], vars: { n, i } });
      i--;
    }
    F(5, `停下：i = ${i}` + (i < 0 ? "（整个数组降序，直接反转）" : `（nums[${i}] = ${a[i]} < nums[${i + 1}] = ${a[i + 1]}）`), { ptr: { i }, hi: i >= 0 ? [i, i + 1] : [], vars: { n, i } });

    if (i >= 0) {
      F(6, `i >= 0 → 需要在右边找一个刚好比 ${a[i]} 大的`, { ptr: { i }, vars: { n, i } });
      let j = n - 1;
      F(7, `j = n - 1 = ${j}`, { ptr: { i, j }, vars: { n, i, j } });
      let g2 = 0;
      while (a[j] <= a[i] && g2++ < 20) {
        F(8, `nums[${j}] = ${a[j]} <= nums[${i}] = ${a[i]} → --j`, { ptr: { i, j }, vars: { n, i, j } });
        j--;
      }
      F(8, `停下：j = ${j}（nums[${j}] = ${a[j]} 是右侧最小的大于 ${a[i]} 的值）`, { ptr: { i, j }, hi: [j], vars: { n, i, j } });
      const t = a[i]; a[i] = a[j]; a[j] = t;
      F(9, `swap(${i}, ${j}) → ${a.join(",")}`, { hi: [i, j], vars: { n, i, j } });
    }

    const l0 = i + 1, r0 = n - 1;
    F(11, `reverse(nums[${l0}..${r0}])：把降序后缀翻成升序`, { win: [l0, r0], vars: { n, i } });
    let L = l0, R = r0;
    while (L < R) {
      const t = a[L]; a[L] = a[R]; a[R] = t;
      F(11, `swap(${L}, ${R}) → ${a.join(",")}`, { hi: [L, R] });
      L++; R--;
    }
    F(11, `结果：${a.join(",")}`, { done: a.map((_, k) => k), vars: { n, i, 答案: a.join(",") } });
    return S;
  };

  /* ============ 62 不同路径：逐格填表 ============ */
  window.DBG[62] = p => {
    const m = 3, n = 3, S = [];
    const dp = new Array(n).fill(1);
    const F = (l, note, extra) => S.push(Object.assign({ line: l, note, dp: dp.slice(), dpDim: n, vars: { m, n } }, extra || {}));

    F(4, `dp 长度 ${n}，第一行全 1（只能一直往右走）`, {});
    for (let i = 1; i < m; i++) {
      F(5, `i = ${i}（第 ${i + 1} 行）`, { dpHi: [] });
      for (let j = 1; j < n; j++) {
        F(6, `j = ${j}（第 ${j + 1} 列）`, { dpHi: [j] });
        const old = dp[j];
        dp[j] += dp[j - 1];
        F(7, `dp[${j}] = ${old} + dp[${j - 1}](${dp[j - 1]}) = ${dp[j]}`, { dpHi: [j], vars: { m, n, i, j } });
      }
    }
    F(8, `return dp[${n - 1}] = ${dp[n - 1]}`, { dpHi: [n - 1], dpDone: dp.map((_, k) => k), vars: { m, n, 答案: dp[n - 1] } });
    return S;
  };
})();
