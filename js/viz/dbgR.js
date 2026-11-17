/* dbgR — 递归类题目的「完整进出」追踪
   每一层递归都留三帧：进入（压栈）→ 计算 → 返回（弹栈，值回传父级）。
   调用栈面板同步显示每层的累计返回值。 */
;(function () {
  const cp = o => JSON.parse(JSON.stringify(o));

  /* ============ 437 路径总和 III：完整调用树 ============ */
  window.DBG[437] = p => {
    const tree = p.viz.tree, target = p.viz.target != null ? p.viz.target : 8;
    const S = [], cs = [];
    const F = (line, note, extra) => {
      S.push(Object.assign({ line, note, callstack: cp(cs) }, extra || {}));
    };
    const at = i => (i < tree.length && tree[i] != null ? tree[i] : null);
    const name = i => (at(i) === null ? "null" : String(tree[i]));
    const pathOf = arr => arr.map(x => tree[x]).join("→");
    /* 树上要高亮的节点；treePath 让引擎按「整条路径」画边（两端都在路径上才连亮） */
    const H = arr => ({ treeHi: arr, treePath: arr });

    /* ---------- 外层 pathSum：把每个节点都当一次起点 ---------- */
    function pathSum(i) {
      cs.push({ fn: "pathSum", args: name(i), res: null });
      F(4, `pathSum(${name(i)})：空？`, Object.assign({ tree }, H(at(i) === null ? [] : [i])));
      if (at(i) === null) {
        F(4, `空 → pathSum 返回 0`, { tree, vars: { 返回: 0 } });
        cs.pop();
        return 0;
      }
      F(4, `非空 → 让 ${name(i)} 当起点，往下走一轮`, Object.assign({ tree }, H([i])));

      F(5, `以 ${name(i)} 为起点：pathSumFrom(${name(i)}, cur=0)`, Object.assign({ tree }, H([i])));
      const own = pathSumFrom(i, 0, []);

      F(6, `再让左子树每个节点都当起点：pathSum(${name(2 * i + 1)})`,
        Object.assign({ tree }, H(at(2 * i + 1) === null ? [] : [2 * i + 1])));
      const L = pathSum(2 * i + 1);

      F(7, `再让右子树每个节点都当起点：pathSum(${name(2 * i + 2)})`,
        Object.assign({ tree }, H(at(2 * i + 2) === null ? [] : [2 * i + 2])));
      const R = pathSum(2 * i + 2);

      const total = own + L + R;
      cs[cs.length - 1].res = total;
      F(5, `return ${own} + ${L} + ${R} = ${total}`,
        Object.assign({ tree, vars: { 起点节点: name(i), 以它为起点: own, 答案: total } }, H([i])));
      cs.pop();
      return total;
    }

    /* ---------- 内层 pathSumFrom：cur 是「起点→当前」的路径和 ---------- */
    function pathSumFrom(i, cur, pathArr) {
      cs.push({ fn: "pathSumFrom", args: `${name(i)},${cur}`, res: null });
      F(11, `pathSumFrom(${name(i)}, cur=${cur})：空？`,
        Object.assign({ tree, vars: { cur: cur, 本节点命中: 0 } }, H(at(i) === null ? [] : [i])));
      if (at(i) === null) {
        F(11, `空 → 返回 0`, { tree, vars: { cur: cur, 返回: 0 } });
        cs.pop();
        return 0;
      }
      const here = pathArr.concat([i]);
      F(11, `非空 → 把 ${name(i)} 接到路径上：${pathOf(here)}`,
        Object.assign({ tree, vars: { cur: cur, 本节点命中: 0 } }, H(here)));

      const nc = cur + tree[i];
      F(12, `cur += ${tree[i]} → ${nc}　（${pathOf(here)} 的和）`,
        Object.assign({ tree, vars: { cur: nc, 本节点命中: 0 } }, H(here)));

      const self = nc === target ? 1 : 0;
      F(13, `${nc} == ${target} ? 1 : 0 → 本节点命中 ${self}${self ? "（" + pathOf(here) + "）" : ""}`,
        Object.assign({ tree, vars: { cur: nc, 本节点命中: self } }, H(here)));

      const L = pathSumFrom(2 * i + 1, nc, here);
      F(14, `左子树返回 ${L}，累计 ${self + L}`,
        Object.assign({ tree, vars: { cur: nc, 本节点命中: self } }, H(here)));

      const R = pathSumFrom(2 * i + 2, nc, here);
      const total = self + L + R;
      cs[cs.length - 1].res = total;
      F(15, `右子树返回 ${R}，本棵合计 ${total} 条`,
        Object.assign({ tree, vars: { cur: nc, 本节点命中: self, 本棵合计: total } }, H(here)));
      cs.pop();
      return total;
    }

    const ans = pathSum(0);
    F(5, `所有节点都当过起点了 → 答案 = ${ans}`, { tree, vars: { 答案: ans } });
    return S;
  };

  /* ============ 104 最大深度：完整进出 ============ */
  window.DBG[104] = p => {
    const tree = p.viz.tree, S = [], cs = [];
    const F = (line, note, extra) => S.push(Object.assign({ line, note, callstack: cp(cs) }, extra || {}));
    const name = i => (i < tree.length && tree[i] != null ? String(tree[i]) : "null");

    cs.push({ fn: "maxDepth", args: "root", res: null });
    F(4, "入口 maxDepth(root)", { tree, treeHi: [0] });

    function dfs(i) {
      cs.push({ fn: "maxDepth", args: name(i), res: null });
      F(4, `▶ 进入 maxDepth(${name(i)})　栈深 ${cs.length - 1}`, { tree, treeHi: name(i) === "null" ? [] : [i] });
      if (name(i) === "null") {
        cs[cs.length - 1].ret = 0;
        F(4, "空节点 → return 0", { tree, vars: { 返回: 0 } });
        cs.pop();
        return 0;
      }
      const L = dfs(2 * i + 1);
      F(5, `左子树返回 ${L}`, { tree, treeHi: [i] });
      const R = dfs(2 * i + 2);
      F(5, `右子树返回 ${R}`, { tree, treeHi: [i] });
      const v = 1 + Math.max(L, R);
      cs[cs.length - 1].res = v;
      cs[cs.length - 1].ret = v;
      F(5, `return 1 + max(${L}, ${R}) = ${v}　← 弹出，回传 ${v}`, { tree, treeHi: [i], vars: { 返回: v } });
      cs.pop();
      return v;
    }
    const ans = dfs(0);
    F(5, `maxDepth 返回 ${ans}`, { tree, vars: { 答案: ans } });
    return S;
  };

  /* ============ 226 翻转二叉树：完整进出 ============ */
  window.DBG[226] = p => {
    const tree = p.viz.tree.slice(), S = [], cs = [];
    const F = (line, note, extra) => S.push(Object.assign({ line, note, callstack: cp(cs) }, extra || {}));
    const name = i => (i < tree.length && tree[i] != null ? String(tree[i]) : "null");

    cs.push({ fn: "invertTree", args: "root", res: null });
    F(4, "入口 invertTree(root)", { tree: tree.slice(), treeHi: [0] });

    function dfs(i) {
      cs.push({ fn: "invertTree", args: name(i), res: null });
      F(4, `▶ 进入 invertTree(${name(i)})`, { tree: tree.slice(), treeHi: name(i) === "null" ? [] : [i], vars: { node: name(i), depth: cs.length - 1 } });
      if (name(i) === "null") { cs.pop(); return; }
      const l = 2 * i + 1, r = 2 * i + 2;
      const t = tree[l]; tree[l] = tree[r]; tree[r] = t;
      F(5, `swap 左右 → ${tree[i]} 的子节点互换`, { tree: tree.slice(), treeHi: [i], vars: { node: tree[i], left: name(l), right: name(r) } });
      F(6, `递归左子树 invertTree(${name(l)})`, { tree: tree.slice(), treeHi: name(l) === "null" ? [] : [l] });
      dfs(l);
      F(7, `递归右子树 invertTree(${name(r)})`, { tree: tree.slice(), treeHi: name(r) === "null" ? [] : [r] });
      dfs(r);
      cs[cs.length - 1].ret = "ok";
      F(8, `return root　← 弹出 ${tree[i]}`, { tree: tree.slice(), treeHi: [i] });
      cs.pop();
    }
    dfs(0);
    F(8, "invertTree 完成", { tree: tree.slice(), vars: { 结果: "镜像" } });
    return S;
  };

  /* ============ 543 直径：完整进出 + 全局 ans ============ */
  window.DBG[543] = p => {
    const tree = p.viz.tree, S = [], cs = [];
    let ans = 0;
    const F = (line, note, extra) => S.push(Object.assign({ line, note, callstack: cp(cs), vars: Object.assign({ ans }, (extra && extra.vars) || {}) }, extra || {}));
    const name = i => (i < tree.length && tree[i] != null ? String(tree[i]) : "null");

    cs.push({ fn: "diameterOfBinaryTree", args: "root", res: null });
    F(3, "入口 diameterOfBinaryTree(root)，ans = 0", { tree, treeHi: [0] });

    function dfs(i) {
      cs.push({ fn: "depth", args: name(i), res: null });
      F(10, `▶ 进入 depth(${name(i)})`, { tree, treeHi: name(i) === "null" ? [] : [i] });
      if (name(i) === "null") { cs[cs.length - 1].ret = 0; cs.pop(); return 0; }
      const L = dfs(2 * i + 1);
      F(11, `左深度 ${L}`, { tree, treeHi: [i] });
      const R = dfs(2 * i + 2);
      F(11, `右深度 ${R}`, { tree, treeHi: [i] });
      const old = ans;
      ans = Math.max(ans, L + R);
      F(12, `ans = max(${old}, ${L}+${R}) = ${ans}`, { tree, treeHi: [i], vars: { ans } });
      const v = 1 + Math.max(L, R);
      cs[cs.length - 1].res = v;
      cs[cs.length - 1].ret = v;
      F(13, `return 1 + max(${L},${R}) = ${v}　← 回传 ${v}`, { tree, treeHi: [i], vars: { ans, 返回: v } });
      cs.pop();
      return v;
    }
    const h = dfs(0);
    F(6, `depth 返回 ${h}，最终 ans = ${ans}`, { tree, vars: { 答案: ans } });
    return S;
  };

  /* ============ 236 最近公共祖先：完整进出 ============ */
  window.DBG[236] = p => {
    const tree = p.viz.tree, S = [], cs = [];
    const F = (line, note, extra) => S.push(Object.assign({ line, note, callstack: cp(cs) }, extra || {}));
    const name = i => (i < tree.length && tree[i] != null ? String(tree[i]) : "null");
    const P = tree[1], Q = tree[2];

    cs.push({ fn: "lowestCommonAncestor", args: `root,${P},${Q}`, res: null });
    F(4, `入口 LCA(root, p=${P}, q=${Q})`, { tree, treeHi: [0] });

    function dfs(i) {
      cs.push({ fn: "LCA", args: name(i), res: null });
      F(4, `▶ 进入 LCA(${name(i)})`, { tree, treeHi: name(i) === "null" ? [] : [i] });
      if (name(i) === "null") { cs[cs.length - 1].ret = "null"; cs.pop(); return null; }
      if (tree[i] === P || tree[i] === Q) {
        cs[cs.length - 1].res = tree[i];
        cs[cs.length - 1].ret = tree[i];
        F(4, `命中 p/q → return ${tree[i]}　← 弹出`, { tree, treeHi: [i], vars: { 返回: tree[i] } });
        cs.pop();
        return i;
      }
      const L = dfs(2 * i + 1);
      F(5, `左子树返回 ${L === null ? "null" : tree[L]}`, { tree, treeHi: L === null ? [] : [L] });
      const R = dfs(2 * i + 2);
      F(6, `右子树返回 ${R === null ? "null" : tree[R]}`, { tree, treeHi: R === null ? [] : [R] });
      const res = (L !== null && R !== null) ? i : (L !== null ? L : R);
      cs[cs.length - 1].res = res === null ? "null" : tree[res];
      cs[cs.length - 1].ret = res === null ? "null" : tree[res];
      F(7, `两边都非空？${L !== null && R !== null} → return ${res === null ? "null" : tree[res]}`, {
        tree, treeHi: res === null ? [] : [res], vars: { 返回: res === null ? "null" : tree[res] }
      });
      cs.pop();
      return res;
    }
    const r = dfs(0);
    F(7, `LCA = ${r === null ? "null" : tree[r]}`, { tree, treeHi: r === null ? [] : [r], vars: { 答案: r === null ? "null" : tree[r] } });
    return S;
  };

  /* ============ 124 最大路径和：完整进出 + 全局 ans ============ */
  window.DBG[124] = p => {
    const tree = p.viz.tree, S = [], cs = [];
    let ans = -Infinity;
    const F = (line, note, extra) => S.push(Object.assign({ line, note, callstack: cp(cs), vars: Object.assign({ ans: ans === -Infinity ? "-∞" : ans }, (extra && extra.vars) || {}) }, extra || {}));
    const name = i => (i < tree.length && tree[i] != null ? String(tree[i]) : "null");

    cs.push({ fn: "maxPathSum", args: "root", res: null });
    F(3, "入口 maxPathSum(root)，ans = -∞", { tree, treeHi: [0] });

    function dfs(i) {
      cs.push({ fn: "gain", args: name(i), res: null });
      F(9, `▶ 进入 gain(${name(i)})`, { tree, treeHi: name(i) === "null" ? [] : [i] });
      if (name(i) === "null") { cs[cs.length - 1].ret = 0; cs.pop(); return 0; }
      const rawL = dfs(2 * i + 1);
      const L = Math.max(0, rawL);
      F(11, `l = max(0, ${rawL}) = ${L}`, { tree, treeHi: [i], vars: { l: L } });
      const rawR = dfs(2 * i + 2);
      const R = Math.max(0, rawR);
      F(12, `r = max(0, ${rawR}) = ${R}`, { tree, treeHi: [i], vars: { l: L, r: R } });
      const old = ans;
      ans = Math.max(ans, tree[i] + L + R);
      F(13, `ans = max(${old === -Infinity ? "-∞" : old}, ${tree[i]}+${L}+${R}) = ${ans}`, { tree, treeHi: [i], vars: { ans } });
      const v = tree[i] + Math.max(L, R);
      cs[cs.length - 1].res = v;
      cs[cs.length - 1].ret = v;
      F(14, `return ${tree[i]} + max(${L},${R}) = ${v}　← 回传 ${v}`, { tree, treeHi: [i], vars: { 返回: v } });
      cs.pop();
      return v;
    }
    dfs(0);
    F(6, `最终 ans = ${ans}`, { tree, vars: { 答案: ans } });
    return S;
  };

  /* ============ 108 有序数组转 BST：完整进出 ============ */
  window.DBG[108] = p => {
    const a = p.viz.arr, S = [], cs = [];
    const F = (line, note, extra) => S.push(Object.assign({ line, note, callstack: cp(cs) }, extra || {}));
    cs.push({ fn: "sortedArrayToBST", args: "nums", res: null });
    F(4, `入口 sortedArrayToBST(nums)，长度 ${a.length}`, { arr: a });
    function build(lo, hi) {
      cs.push({ fn: "build", args: `[${lo},${hi}]`, res: null });
      F(8, `▶ 进入 build(${lo}, ${hi})　栈深 ${cs.length - 1}`, { arr: a, win: [lo, hi] });
      if (lo > hi) {
        cs[cs.length - 1].ret = "null";
        F(8, `l > r → return null　← 弹出`, { arr: a, vars: { 返回: "null" } });
        cs.pop();
        return null;
      }
      const mid = (lo + hi) >> 1;
      F(9, `mid = ${mid} → 取 nums[${mid}] = ${a[mid]} 作根`, { arr: a, ptr: { lo, hi, mid }, hi: [mid] });
      F(10, `node = new TreeNode(${a[mid]})`, { arr: a, hi: [mid] });
      const L = build(lo, mid - 1);
      F(11, `左子树返回 ${L === null ? "null" : L}`, { arr: a, win: [lo, mid - 1] });
      const R = build(mid + 1, hi);
      F(12, `右子树返回 ${R === null ? "null" : R}`, { arr: a, win: [mid + 1, hi] });
      cs[cs.length - 1].res = a[mid];
      cs[cs.length - 1].ret = a[mid];
      F(13, `return ${a[mid]}　← 弹出，回传节点 ${a[mid]}`, { arr: a, hi: [mid], vars: { 返回: a[mid] } });
      cs.pop();
      return mid;
    }
    build(0, a.length - 1);
    F(4, "BST 构造完成", { arr: a, vars: { 答案: a.length ? a[(a.length - 1) >> 1] : "null" } });
    return S;
  };
})();
