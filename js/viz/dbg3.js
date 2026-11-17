/* dbg3 — 二叉树 15 题：递归进出都留帧，调用栈实时可见 */
;(function () {
  const cp = window.DBG.cp;
  const N = (arr, i) => (i < arr.length && arr[i] != null ? arr[i] : null);

  function walk(tree, i, out) {
    if (i >= tree.length || tree[i] == null) return;
    out.push(i);
    walk(tree, 2 * i + 1, out);
    walk(tree, 2 * i + 2, out);
  }

  /* 94 中序遍历 */
  window.DBG[94] = p => {
    const S = [], tree = p.viz.tree, F = (l, n, s) => S.push(Object.assign({ line: l, note: n }, s || {}));
    const res = [], st = [], cs = [];
    let cur = 0;
    F(4, "res = []", { tree });
    F(5, "stack 空", { tree, callstack: [{ fn: "inorderTraversal", args: "root" }] });
    F(6, `cur = root（${tree[0]}）`, { tree, treeHi: [0], ptr: { cur: 0 } });
    while (cur !== -1 || st.length) {
      F(7, `while (cur || !st.empty())`, { tree, treeHi: cur >= 0 ? [cur] : [], stack: st.map(i => tree[i]) });
      while (cur !== -1) {
        st.push(cur);
        F(8, `push(${tree[cur]})，cur = cur->left（${cur}）`, { tree, treeHi: [cur], stack: st.map(i => tree[i]), ptr: { cur } });
        cur = 2 * cur + 1 < tree.length && tree[2 * cur + 1] != null ? 2 * cur + 1 : -1;
      }
      F(8, "cur 为空，退出内层", { tree, stack: st.map(i => tree[i]) });
      cur = st.pop();
      F(9, `cur = st.top(); pop → 下标 ${cur}（值 ${tree[cur]}）`, { tree, treeHi: [cur], stack: st.map(i => tree[i]), ptr: { cur } });
      res.push(tree[cur]);
      F(10, `res.push_back(${tree[cur]})`, { tree, treeHi: [cur], treeDone: res.map(v => tree.indexOf(v)), stack: st.map(i => tree[i]), vars: { res: res.join(",") } });
      cur = 2 * cur + 2 < tree.length && tree[2 * cur + 2] != null ? 2 * cur + 2 : -1;
      F(11, `cur = cur->right → ${cur >= 0 ? "下标 " + cur + "（" + tree[cur] + "）" : "null"}`, { tree, treeHi: cur >= 0 ? [cur] : [], stack: st.map(i => tree[i]), ptr: cur >= 0 ? { cur } : {} });
    }
    F(13, `return res（${res.join(",")}）`, { tree, vars: { 答案: res.join(",") } });
    return S;
  };

  /* 104 最大深度 */
  window.DBG[104] = p => {
    const S = [], tree = p.viz.tree, F = (l, n, s) => S.push(Object.assign({ line: l, note: n }, s || {}));
    const cs = [];
    const dfs = i => {
      const name = i >= tree.length || tree[i] == null ? "null" : String(tree[i]);
      cs.push({ fn: "maxDepth", args: name });
      F(4, `maxDepth(${name})：if (!root)`, { tree, treeHi: i < tree.length && tree[i] != null ? [i] : [], callstack: cp(cs) });
      if (i >= tree.length || tree[i] == null) {
        F(4, "→ 空，return 0", { tree, callstack: cp(cs), vars: { 返回: 0 } });
        cs.pop();
        return 0;
      }
      const L = dfs(2 * i + 1), R = dfs(2 * i + 2);
      const v = 1 + Math.max(L, R);
      F(5, `return 1 + max(${L}, ${R}) = ${v}`, { tree, treeHi: [i], callstack: cp(cs), vars: { 返回: v } });
      cs.pop();
      return v;
    };
    const ans = dfs(0);
    F(5, `root 返回 ${ans}`, { tree, vars: { 答案: ans } });
    return S;
  };

  /* 226 翻转二叉树 */
  window.DBG[226] = p => {
    const S = [], tree = p.viz.tree.slice(), F = (l, n, s) => S.push(Object.assign({ line: l, note: n }, s || {}));
    const cs = [];
    const dfs = i => {
      if (i >= tree.length || tree[i] == null) return;
      cs.push({ fn: "invertTree", args: String(tree[i]) });
      F(4, `invertTree(${tree[i]})`, { tree: tree.slice(), treeHi: [i], callstack: cp(cs) });
      const l = 2 * i + 1, r = 2 * i + 2;
      const t = tree[l]; tree[l] = tree[r]; tree[r] = t;
      F(4, `swap(left, right) → ${tree[i]} 的左右互换`, { tree: tree.slice(), treeHi: [i], callstack: cp(cs) });
      dfs(l);
      F(5, "invertTree(left) 返回", { tree: tree.slice(), callstack: cp(cs) });
      dfs(r);
      F(6, "invertTree(right) 返回", { tree: tree.slice(), callstack: cp(cs) });
      cs.pop();
    };
    dfs(0);
    F(7, "return root", { tree: tree.slice(), vars: { 结果: "已镜像" } });
    return S;
  };

  /* 101 对称二叉树 */
  window.DBG[101] = p => {
    const S = [], tree = p.viz.tree, F = (l, n, s) => S.push(Object.assign({ line: l, note: n }, s || {}));
    const cs = [];
    const chk = (a, b) => {
      cs.push({ fn: "check", args: N(tree, a) + "," + N(tree, b) });
      F(4, `check(${N(tree, a)}, ${N(tree, b)})：都空？`, { tree, treeHi: [a, b].filter(x => N(tree, x) != null), callstack: cp(cs) });
      if (N(tree, a) == null && N(tree, b) == null) { F(4, "→ true", { tree, callstack: cp(cs) }); cs.pop(); return true; }
      if (N(tree, a) == null || N(tree, b) == null) { F(4, "→ 一个空一个非空，false", { tree, callstack: cp(cs) }); cs.pop(); return false; }
      const eq = tree[a] === tree[b];
      F(4, `a->val(${tree[a]}) == b->val(${tree[b]}) ? ${eq}`, { tree, treeHi: [a, b], callstack: cp(cs) });
      const r = eq && chk(2 * a + 1, 2 * b + 2) && chk(2 * a + 2, 2 * b + 1);
      F(6, `check(left,right) && check(right,left) → ${r}`, { tree, treeHi: [a, b], callstack: cp(cs), vars: { 返回: r } });
      cs.pop();
      return r;
    };
    cs.push({ fn: "isSymmetric", args: "root" });
    F(4, "check(root->left, root->right)", { tree, callstack: cp(cs) });
    cs.pop();
    const ans = chk(1, 2);
    F(4, `return ${ans}`, { tree, vars: { 答案: String(ans) } });
    return S;
  };

  /* 543 二叉树直径 */
  window.DBG[543] = p => {
    const S = [], tree = p.viz.tree, F = (l, n, s) => S.push(Object.assign({ line: l, note: n }, s || {}));
    const cs = []; let ans = 0;
    const depth = i => {
      const nm = N(tree, i) == null ? "null" : String(tree[i]);
      cs.push({ fn: "depth", args: nm });
      F(6, `depth(${nm})：空？`, { tree, treeHi: N(tree, i) != null ? [i] : [], callstack: cp(cs), vars: { ans } });
      if (N(tree, i) == null) { F(6, "→ return 0", { tree, callstack: cp(cs) }); cs.pop(); return 0; }
      const L = depth(2 * i + 1), R = depth(2 * i + 2);
      ans = Math.max(ans, L + R);
      F(7, `ans = max(ans, ${L} + ${R}) = ${ans}`, { tree, treeHi: [i], callstack: cp(cs), vars: { ans } });
      const v = 1 + Math.max(L, R);
      F(8, `return 1 + max(${L}, ${R}) = ${v}`, { tree, treeHi: [i], callstack: cp(cs), vars: { ans, 高度: v } });
      cs.pop();
      return v;
    };
    depth(0);
    F(8, `return ${ans}`, { tree, vars: { 答案: ans } });
    return S;
  };

  /* 102 层序遍历 */
  window.DBG[102] = p => {
    const S = [], tree = p.viz.tree, F = (l, n, s) => S.push(Object.assign({ line: l, note: n }, s || {}));
    F(4, "res = []", { tree });
    F(5, "if (!root) → 非空", { tree, treeHi: [0] });
    let q = [0];
    F(5, "q = {root}", { tree, treeHi: [0], stack: [tree[0]] });
    const res = [];
    while (q.length) {
      F(5, `while (!q.empty()) → 队列里 ${q.length} 个`, { tree, treeHi: q.slice(), stack: q.map(i => tree[i]) });
      const sz = q.length, level = [], nq = [];
      F(5, `sz = ${sz}`, { tree, treeHi: q.slice(), vars: { sz } });
      for (let k = 0; k < sz; k++) {
        const node = q[k];
        F(6, `node = q.front(); pop → ${tree[node]}`, { tree, treeHi: [node], stack: q.map(i => tree[i]) });
        level.push(tree[node]);
        F(7, `level.push_back(${tree[node]})`, { tree, treeHi: [node], vars: { level: level.join(",") } });
        if (N(tree, 2 * node + 1) != null) { nq.push(2 * node + 1); F(8, `push(left ${tree[2 * node + 1]})`, { tree, treeHi: [2 * node + 1], stack: nq.map(i => tree[i]) }); }
        if (N(tree, 2 * node + 2) != null) { nq.push(2 * node + 2); F(9, `push(right ${tree[2 * node + 2]})`, { tree, treeHi: [2 * node + 2], stack: nq.map(i => tree[i]) }); }
      }
      res.push(level);
      F(10, `res.push_back([${level}])`, { tree, treeDone: res.flat().map(v => tree.indexOf(v)), vars: { res: JSON.stringify(res) } });
      q = nq;
    }
    F(11, "return res", { tree, vars: { 答案: JSON.stringify(res) } });
    return S;
  };

  /* 108 有序数组转 BST */
  window.DBG[108] = p => {
    const S = [], a = p.viz.arr, F = (l, n, s) => S.push(Object.assign({ line: l, note: n }, s || {}));
    const cs = [];
    const build = (lo, hi, depth) => {
      cs.push({ fn: "build", args: `[${lo},${hi}]` });
      F(4, `build(${lo}, ${hi})：l > r ? ${lo > hi}`, { arr: a, ptr: { lo, hi }, win: [lo, hi], callstack: cp(cs) });
      if (lo > hi) { F(4, "→ 返回 null", { arr: a, callstack: cp(cs) }); cs.pop(); return null; }
      const mid = (lo + hi) >> 1;
      F(5, `mid = (${lo} + ${hi}) / 2 = ${mid} → 根 = ${a[mid]}`, { arr: a, ptr: { lo, hi, mid }, hi: [mid], callstack: cp(cs) });
      F(6, `node = TreeNode(${a[mid]})`, { arr: a, hi: [mid], callstack: cp(cs) });
      F(6, `build(${lo}, ${mid - 1}) 作左子树`, { arr: a, win: [lo, mid - 1], callstack: cp(cs) });
      build(lo, mid - 1, depth + 1);
      F(7, `build(${mid + 1}, ${hi}) 作右子树`, { arr: a, win: [mid + 1, hi], callstack: cp(cs) });
      build(mid + 1, hi, depth + 1);
      F(7, `返回 ${a[mid]}` , { arr: a, hi: [mid], callstack: cp(cs), vars: { 返回: a[mid] } });
      cs.pop();
      return mid;
    };
    build(0, a.length - 1, 0);
    F(8, "return root", { arr: a, vars: { 结果: "平衡 BST" } });
    return S;
  };

  /* 98 验证 BST */
  window.DBG[98] = p => {
    const S = [], tree = p.viz.tree, F = (l, n, s) => S.push(Object.assign({ line: l, note: n }, s || {}));
    const cs = [];
    const chk = (i, lo, hi) => {
      const nm = N(tree, i) == null ? "null" : String(tree[i]);
      cs.push({ fn: "check", args: `${nm}(${lo},${hi})` });
      F(4, `check(${nm}, ${lo}, ${hi})`, { tree, treeHi: N(tree, i) != null ? [i] : [], callstack: cp(cs) });
      if (N(tree, i) == null) { F(4, "→ 空，true", { tree, callstack: cp(cs) }); cs.pop(); return true; }
      const ok = tree[i] > lo && tree[i] < hi;
      F(5, `${lo} < ${tree[i]} < ${hi} ? ${ok}`, { tree, treeHi: [i], callstack: cp(cs), vars: { ok } });
      if (!ok) { F(5, "→ 越界，false", { tree, treeHi: [i], callstack: cp(cs) }); cs.pop(); return false; }
      const r = chk(2 * i + 1, lo, tree[i]) && chk(2 * i + 2, tree[i], hi);
      F(6, `左右都合法？${r}`, { tree, treeHi: [i], callstack: cp(cs) });
      cs.pop();
      return r;
    };
    const ans = chk(0, "-∞", "+∞");
    F(8, `return ${ans}`, { tree, vars: { 答案: String(ans) } });
    return S;
  };

  /* 230 BST 第 K 小 */
  window.DBG[230] = p => {
    const S = [], tree = p.viz.tree, k = 2, F = (l, n, s) => S.push(Object.assign({ line: l, note: n }, s || {}));
    const st = [];
    let cur = 0, cnt = 0;
    F(4, "stack 空，cur = root", { tree, treeHi: [0] });
    F(4, `k = ${k}`, { tree, vars: { k } });
    while (cur !== -1 || st.length) {
      F(5, "while (cur || !st.empty())", { tree, treeHi: cur >= 0 ? [cur] : [], stack: st.map(i => tree[i]) });
      while (cur !== -1) {
        st.push(cur);
        F(6, `push(${tree[cur]})，走左边`, { tree, treeHi: [cur], stack: st.map(i => tree[i]) });
        cur = N(tree, 2 * cur + 1) != null ? 2 * cur + 1 : -1;
      }
      F(6, "左边走到底", { tree, stack: st.map(i => tree[i]) });
      cur = st.pop();
      F(7, `pop → ${tree[cur]}`, { tree, treeHi: [cur], stack: st.map(i => tree[i]) });
      cnt++;
      F(8, `--k → ${k - cnt}（已数 ${cnt} 个）`, { tree, treeHi: [cur], vars: { 计数: cnt } });
      if (cnt === k) { F(8, `k == 0 → return ${tree[cur]}`, { tree, hi: [cur], vars: { 答案: tree[cur] } }); return S; }
      cur = N(tree, 2 * cur + 2) != null ? 2 * cur + 2 : -1;
      F(9, `cur = cur->right → ${cur >= 0 ? tree[cur] : "null"}`, { tree, stack: st.map(i => tree[i]) });
    }
    return S;
  };

  /* 199 右视图 */
  window.DBG[199] = p => {
    const S = [], tree = p.viz.tree, F = (l, n, s) => S.push(Object.assign({ line: l, note: n }, s || {}));
    let q = [0]; const res = [];
    F(4, "res = []", { tree });
    F(5, "if (!root) → 非空", { tree, treeHi: [0] });
    while (q.length) {
      const sz = q.length, nq = [];
      F(5, `sz = ${sz}`, { tree, treeHi: q.slice(), stack: q.map(i => tree[i]) });
      for (let i = 0; i < sz; i++) {
        const node = q[i];
        F(6, `取出 ${tree[node]}（第 ${i + 1}/${sz} 个）`, { tree, treeHi: [node], stack: q.map(x => tree[x]) });
        if (i === sz - 1) { res.push(tree[node]); F(7, `i == sz-1 → res.push(${tree[node]})`, { tree, treeHi: [node], vars: { res: res.join(",") } }); }
        if (N(tree, 2 * node + 1) != null) nq.push(2 * node + 1);
        if (N(tree, 2 * node + 2) != null) nq.push(2 * node + 2);
        F(8, `下一层入队 ${nq.map(x => tree[x]).join(",") || "空"}`, { tree, stack: nq.map(i => tree[i]) });
      }
      q = nq;
    }
    F(10, `return {${res.join(",")}}`, { tree, vars: { 答案: res.join(",") } });
    return S;
  };

  /* 114 展开为链表 */
  window.DBG[114] = p => {
    const S = [], tree = p.viz.tree, F = (l, n, s) => S.push(Object.assign({ line: l, note: n }, s || {}));
    const cs = [];
    const order = [];
    (function pre(i) { if (N(tree, i) == null) return; order.push(i); pre(2 * i + 1); pre(2 * i + 2); })(0);
    F(3, "flatten(root)", { tree, treeHi: [0] });
    F(3, "先递归左子树", { tree, treeHi: [0] });
    F(3, "再递归右子树", { tree, treeHi: [0] });
    F(4, "root->left = nullptr", { tree, treeHi: [0] });
    F(5, "root->right = left（拉直后的左子树）", { tree, treeHi: [1] });
    F(8, "接上原来的右子树", { tree, treeHi: [2] });
    F(8, `结果：前序 ${order.map(i => tree[i]).join(" → ")}`, { tree, treeDone: order, vars: { 答案: order.map(i => tree[i]).join("→") } });
    return S;
  };

  /* 105 前序中序构造 */
  window.DBG[105] = p => {
    const S = [], pre = [3, 9, 20, 15, 7], ino = [9, 3, 15, 20, 7];
    const F = (l, n, s) => S.push(Object.assign({ line: l, note: n }, s || {}));
    const idx = {}; ino.forEach((v, i) => idx[v] = i);
    const cs = [];
    F(4, "idx：中序值 → 下标", { arr: ino, map: cp(idx) });
    const build = (pl, pr, il, ir) => {
      cs.push({ fn: "build", args: `${pl},${pr} | ${il},${ir}` });
      F(5, `build(pre[${pl}..${pr}], in[${il}..${ir}])`, { arr: ino, callstack: cp(cs) });
      if (pl > pr) { F(5, "→ 空区间，null", { arr: ino, callstack: cp(cs) }); cs.pop(); return; }
      const root = pre[pl], mid = idx[root], len = mid - il;
      F(5, `根 = pre[${pl}] = ${root}，中序下标 ${mid}`, { arr: ino, hi: [mid], callstack: cp(cs) });
      F(6, `leftLen = ${mid} - ${il} = ${len}`, { arr: ino, win: [il, mid - 1], callstack: cp(cs) });
      F(6, `build 左：[${pl + 1}, ${pl + len}]`, { arr: ino, callstack: cp(cs) });
      build(pl + 1, pl + len, il, mid - 1);
      F(7, `build 右：[${pl + len + 1}, ${pr}]`, { arr: ino, callstack: cp(cs) });
      build(pl + len + 1, pr, mid + 1, ir);
      cs.pop();
    };
    build(0, pre.length - 1, 0, ino.length - 1);
    F(8, "return root", { arr: ino, vars: { 前序: pre.join(","), 中序: ino.join(",") } });
    return S;
  };

  /* 437 路径总和 III */
  window.DBG[437] = p => {
    const S = [], tree = p.viz.tree, tg = 8, F = (l, n, s) => S.push(Object.assign({ line: l, note: n }, s || {}));
    const cs = [], cnt = { 0: 1 };
    let ans = 0;
    const dfs = (i, cur) => {
      const nm = N(tree, i) == null ? "null" : String(tree[i]);
      cs.push({ fn: "dfs", args: `${nm}, cur=${cur}` });
      F(4, `dfs(${nm}, ${cur})：空？`, { tree, treeHi: N(tree, i) != null ? [i] : [], callstack: cp(cs), map: cp(cnt), vars: { cur } });
      if (N(tree, i) == null) { F(4, "→ 0", { tree, callstack: cp(cs) }); cs.pop(); return 0; }
      const nc = cur + tree[i];
      F(5, `cur += ${tree[i]} → ${nc}`, { tree, treeHi: [i], callstack: cp(cs), map: cp(cnt), vars: { cur: nc } });
      const add = cnt[nc - tg] || 0;
      ans += add;
      F(6, `cnt[${nc} - ${tg}] = ${add} → ans = ${ans}`, { tree, treeHi: [i], callstack: cp(cs), map: cp(cnt), mapHi: [String(nc - tg)], vars: { ans } });
      cnt[nc] = (cnt[nc] || 0) + 1;
      F(7, `++cnt[${nc}] = ${cnt[nc]}`, { tree, treeHi: [i], callstack: cp(cs), map: cp(cnt) });
      F(8, "递归左右子树", { tree, treeHi: [i], callstack: cp(cs), map: cp(cnt) });
      dfs(2 * i + 1, nc);
      dfs(2 * i + 2, nc);
      cnt[nc] -= 1;
      F(9, `--cnt[${nc}]（回溯）`, { tree, treeHi: [i], callstack: cp(cs), map: cp(cnt) });
      cs.pop();
      return 0;
    };
    dfs(0, 0);
    F(11, `return ${ans}`, { tree, vars: { 答案: ans } });
    return S;
  };

  /* 236 最近公共祖先 */
  window.DBG[236] = p => {
    const S = [], tree = p.viz.tree, F = (l, n, s) => S.push(Object.assign({ line: l, note: n }, s || {}));
    const P = tree[1], Q = tree[2], cs = [];
    const dfs = i => {
      const nm = N(tree, i) == null ? "null" : String(tree[i]);
      cs.push({ fn: "LCA", args: nm });
      F(4, `LCA(${nm})：空 or 等于 p/q ?`, { tree, treeHi: N(tree, i) != null ? [i] : [], callstack: cp(cs) });
      if (N(tree, i) == null) { F(4, "→ null", { tree, callstack: cp(cs) }); cs.pop(); return null; }
      if (tree[i] === P || tree[i] === Q) { F(4, `→ 命中 ${tree[i]}，返回它`, { tree, treeHi: [i], callstack: cp(cs), vars: { 返回: tree[i] } }); cs.pop(); return i; }
      const l = dfs(2 * i + 1);
      F(5, `左子树返回 ${l == null ? "null" : tree[l]}`, { tree, treeHi: l != null ? [l] : [], callstack: cp(cs) });
      const r = dfs(2 * i + 2);
      F(6, `右子树返回 ${r == null ? "null" : tree[r]}`, { tree, treeHi: r != null ? [r] : [], callstack: cp(cs) });
      const res = (l != null && r != null) ? i : (l != null ? l : r);
      F(7, `两边都非空？${l != null && r != null} → 返回 ${res == null ? "null" : tree[res]}`, { tree, treeHi: res != null ? [res] : [], callstack: cp(cs), vars: { 返回: res == null ? "null" : tree[res] } });
      cs.pop();
      return res;
    };
    const res = dfs(0);
    F(7, `LCA = ${res == null ? "null" : tree[res]}`, { tree, treeHi: res != null ? [res] : [], vars: { 答案: res == null ? "null" : tree[res] } });
    return S;
  };

  /* 124 最大路径和 */
  window.DBG[124] = p => {
    const S = [], tree = p.viz.tree, F = (l, n, s) => S.push(Object.assign({ line: l, note: n }, s || {}));
    const cs = []; let ans = -Infinity;
    const gain = i => {
      const nm = N(tree, i) == null ? "null" : String(tree[i]);
      cs.push({ fn: "gain", args: nm });
      F(4, `gain(${nm})`, { tree, treeHi: N(tree, i) != null ? [i] : [], callstack: cp(cs), vars: { ans: ans === -Infinity ? "-∞" : ans } });
      if (N(tree, i) == null) { F(4, "→ 0", { tree, callstack: cp(cs) }); cs.pop(); return 0; }
      const L = Math.max(0, gain(2 * i + 1));
      F(5, `l = max(0, 左) = ${L}`, { tree, treeHi: [i], callstack: cp(cs), vars: { l: L } });
      const R = Math.max(0, gain(2 * i + 2));
      F(6, `r = max(0, 右) = ${R}`, { tree, treeHi: [i], callstack: cp(cs), vars: { l: L, r: R } });
      ans = Math.max(ans, tree[i] + L + R);
      F(7, `ans = max(ans, ${tree[i]} + ${L} + ${R}) = ${ans}`, { tree, treeHi: [i], callstack: cp(cs), vars: { ans } });
      const v = tree[i] + Math.max(L, R);
      F(8, `return ${tree[i]} + max(${L}, ${R}) = ${v}`, { tree, treeHi: [i], callstack: cp(cs), vars: { ans, 返回: v } });
      cs.pop();
      return v;
    };
    gain(0);
    F(8, `return ${ans}`, { tree, vars: { 答案: ans } });
    return S;
  };
})();
