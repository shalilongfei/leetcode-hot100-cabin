/* dbgFix5 — 补齐「入口 → 进入递归」那几帧 + 主函数初始化 */
;(function () {
  const cp = o => JSON.parse(JSON.stringify(o));

  /* ---------- 543 直径：主函数两行 ---------- */
  const d543 = window.DBG[543];
  window.DBG[543] = p => {
    const tree = p.viz.tree, S = [], cs = [];
    let ans = 0;
    const F = (line, note, extra) => S.push(Object.assign({ line, note, callstack: cp(cs), vars: Object.assign({ ans }, (extra && extra.vars) || {}) }, extra || {}));
    cs.push({ fn: "diameterOfBinaryTree", args: "root", res: null });
    F(4, "ans = 0（全局最大直径）", { tree, treeHi: [0], vars: { ans: 0 } });
    F(5, "depth(root, ans) ← 进入递归，边算深度边更新 ans", { tree, treeHi: [0] });
    const rest = d543(p);
    rest.shift();                                   // 去掉原来重复的 L3 入口帧
    return S.concat(rest);
  };

  /* ---------- 124 最大路径和：主函数两行 ---------- */
  const d124 = window.DBG[124];
  window.DBG[124] = p => {
    const tree = p.viz.tree, S = [];
    const F = (line, note, extra) => S.push(Object.assign({ line, note, vars: Object.assign({ ans: "-∞" }, (extra && extra.vars) || {}) }, extra || {}));
    F(4, "ans = INT_MIN（还没算）", { tree, treeHi: [0] });
    F(5, "gain(root, ans) ← 进入递归", { tree, treeHi: [0] });
    const rest = d124(p);
    rest.shift();
    return S.concat(rest);
  };

  /* ---------- 46 全排列：res / path / used 三行 + 调用 ---------- */
  const d46 = window.DBG[46];
  window.DBG[46] = p => {
    const a = p.viz.arr, S = [];
    const F = (line, note, extra) => S.push(Object.assign({ line, note, vars: {}, stack: [] }, extra || {}));
    F(4, "res = []", { arr: a });
    F(5, "path = []", { arr: a });
    F(6, `used 全 false（${a.length} 个坑位）`, { arr: a });
    F(7, "backtrack(nums, used, path, res) ← 进入递归", { arr: a });
    const rest = d46(p);
    rest.shift();
    return S.concat(rest);
  };

  /* ---------- 78 子集 ---------- */
  const d78 = window.DBG[78];
  window.DBG[78] = p => {
    const a = p.viz.arr, S = [];
    const F = (line, note, extra) => S.push(Object.assign({ line, note, vars: {}, stack: [] }, extra || {}));
    F(4, "res = []", { arr: a });
    F(5, "path = []", { arr: a });
    F(6, "backtrack(nums, 0, path, res) ← 进入递归", { arr: a });
    const rest = d78(p);
    rest.shift();
    return S.concat(rest);
  };

  /* ---------- 39 组合总和 ---------- */
  const d39 = window.DBG[39];
  window.DBG[39] = p => {
    const a = p.viz.arr.slice().sort((x, y) => x - y), tg = p.viz.target, S = [];
    const F = (line, note, extra) => S.push(Object.assign({ line, note, vars: { target: tg }, stack: [] }, extra || {}));
    F(5, "res = []", { arr: a });
    F(6, "path = []", { arr: a });
    F(7, `dfs(candidates, 0, ${tg}, path, res) ← 进入递归`, { arr: a });
    const rest = d39(p);
    rest.shift();
    return S.concat(rest);
  };

  /* ---------- 131 分割回文串 ---------- */
  const d131 = window.DBG[131];
  window.DBG[131] = p => {
    const s = p.viz.arr.join(""), S = [];
    const F = (line, note, extra) => S.push(Object.assign({ line, note, vars: {}, stack: [] }, extra || {}));
    F(4, "res = []", {});
    F(5, "path = []", {});
    F(6, `dfs("${s}", 0, path, res) ← 进入递归`, {});
    const rest = d131(p);
    rest.shift();
    return S.concat(rest);
  };

  /* ---------- 22 括号生成 ---------- */
  const d22 = window.DBG[22];
  window.DBG[22] = p => {
    const S = [];
    const F = (line, note, extra) => S.push(Object.assign({ line, note, vars: { n: 3 }, stack: [] }, extra || {}));
    F(4, "res = []", {});
    F(5, "path = \"\"", {});
    F(6, "dfs(3, 0, 0, path, res) ← 进入递归", {});
    const rest = d22(p);
    rest.shift();
    return S.concat(rest);
  };

  /* ---------- 437 路径总和：已改成「每个节点都当起点」的写法，
       不再需要在前面补两帧（旧的补帧逻辑对应的是前缀和版本）。 ---------- */
})();
