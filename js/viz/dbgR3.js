/* dbgR3 — 树/链表递归题：完整进出（含返回值回传） */
;(function () {
  const cp = o => JSON.parse(JSON.stringify(o));

  /* ============ 101 对称二叉树 ============ */
  window.DBG[101] = p => {
    const tree = p.viz.tree, S = [], cs = [];
    const F = (line, note, extra) => S.push(Object.assign({ line, note, callstack: cp(cs) }, extra || {}));
    const name = i => (i < tree.length && tree[i] != null ? String(tree[i]) : "null");

    cs.push({ fn: "isSymmetric", args: "root", res: null });
    F(4, "入口 isSymmetric(root)", { tree, treeHi: [0] });

    function chk(a, b) {
      cs.push({ fn: "check", args: `${name(a)},${name(b)}`, res: null });
      F(7, `▶ 进入 check(${name(a)}, ${name(b)})　栈深 ${cs.length - 1}`, { tree, treeHi: [a, b].filter(x => name(x) !== "null"), vars: { a: name(a), b: name(b), 栈深: cs.length - 1 } });

      if (name(a) === "null" && name(b) === "null") {
        F(8, `两个都空 → return true（弹栈）`, { tree, vars: { 返回: "true" } });
        cs[cs.length - 1].res = "T"; cs[cs.length - 1].ret = "true";
        cs.pop();
        return true;
      }
      if (name(a) === "null" || name(b) === "null") {
        F(9, `一空一非空 → return false（弹栈）`, { tree, vars: { 返回: "false" } });
        cs[cs.length - 1].res = "F"; cs[cs.length - 1].ret = "false";
        cs.pop();
        return false;
      }
      const eq = tree[a] === tree[b];
      F(10, `${tree[a]} == ${tree[b]} ? ${eq}`, { tree, treeHi: [a, b] });
      if (!eq) {
        cs[cs.length - 1].res = "F"; cs[cs.length - 1].ret = "false";
        F(10, `不等 → return false（弹栈）`, { tree, treeHi: [a, b] });
        cs.pop();
        return false;
      }
      const l = chk(2 * a + 1, 2 * b + 2);
      F(10, `外对返回 ${l}`, { tree, treeHi: [a, b] });
      const r = chk(2 * a + 2, 2 * b + 1);
      F(10, `内对返回 ${r}`, { tree, treeHi: [a, b] });
      const v = l && r;
      cs[cs.length - 1].res = v ? "T" : "F";
      cs[cs.length - 1].ret = String(v);
      F(10, `return ${v}　← 弹栈，回传 ${v}`, { tree, treeHi: [a, b], vars: { 返回: String(v) } });
      cs.pop();
      return v;
    }

    const ans = chk(1, 2);
    F(4, `isSymmetric = ${ans}`, { tree, vars: { 答案: String(ans) } });
    return S;
  };

  /* ============ 98 验证 BST ============ */
  window.DBG[98] = p => {
    const tree = p.viz.tree, S = [], cs = [];
    const F = (line, note, extra) => S.push(Object.assign({ line, note, callstack: cp(cs) }, extra || {}));
    const name = i => (i < tree.length && tree[i] != null ? String(tree[i]) : "null");

    cs.push({ fn: "isValidBST", args: "root", res: null });
    F(4, "入口 isValidBST(root)，区间 (-∞, +∞)", { tree, treeHi: [0] });

    function chk(i, lo, hi) {
      const lb = lo === -Infinity ? "-∞" : lo, hb = hi === Infinity ? "+∞" : hi;
      cs.push({ fn: "check", args: `${name(i)}(${lb},${hb})`, res: null });
      F(7, `▶ 进入 check(${name(i)}, ${lb}, ${hb})　栈深 ${cs.length - 1}`, { tree, treeHi: name(i) === "null" ? [] : [i], vars: { node: name(i), lo: lb, hi: hb, 栈深: cs.length - 1 } });
      if (name(i) === "null") {
        cs[cs.length - 1].res = "T"; cs[cs.length - 1].ret = "true";
        F(8, `空节点 → return true（弹栈）`, { tree });
        cs.pop();
        return true;
      }
      const ok = tree[i] > lo && tree[i] < hi;
      F(9, `${lb} < ${tree[i]} < ${hb} ? ${ok}`, { tree, treeHi: [i], vars: { node: tree[i], lo: lb, hi: hb, ok: String(ok) } });
      if (!ok) {
        cs[cs.length - 1].res = "F"; cs[cs.length - 1].ret = "false";
        F(9, `越界 → return false（弹栈）`, { tree, treeHi: [i], vars: { node: tree[i], lo: lb, hi: hb, 返回: "false" } });
        cs.pop();
        return false;
      }
      const l = chk(2 * i + 1, lo, tree[i]);
      F(10, `左子树返回 ${l}（新区间 (${lb}, ${tree[i]})）`, { tree, treeHi: [i] });
      const r = chk(2 * i + 2, tree[i], hi);
      F(10, `右子树返回 ${r}（新区间 (${tree[i]}, ${hb})）`, { tree, treeHi: [i] });
      const v = l && r;
      cs[cs.length - 1].res = v ? "T" : "F";
      cs[cs.length - 1].ret = String(v);
      F(10, `return ${v}　← 弹栈，回传 ${v}`, { tree, treeHi: [i], vars: { 返回: String(v) } });
      cs.pop();
      return v;
    }

    const ans = chk(0, -Infinity, Infinity);
    F(4, `isValidBST = ${ans}`, { tree, vars: { 答案: String(ans) } });
    return S;
  };

  /* ============ 105 前序+中序构造 ============ */
  window.DBG[105] = p => {
    const pre = [3, 9, 20, 15, 7], ino = [9, 3, 15, 20, 7];
    const S = [], cs = [], idx = {};
    ino.forEach((v, i) => idx[v] = i);
    const F = (line, note, extra) => S.push(Object.assign({ line, note, callstack: cp(cs) }, extra || {}));

    cs.push({ fn: "buildTree", args: "pre,in", res: null });
    F(4, `入口，idx 表：${ino.join(",")} → 下标`, { arr: ino, map: cp(idx) });
    F(6, `调用 build(0,${pre.length - 1}, 0,${ino.length - 1})　← 压栈`, { arr: ino });

    function build(pl, pr, il, ir) {
      cs.push({ fn: "build", args: `[${pl},${pr}|${il},${ir}]`, res: null });
      F(9, `▶ 进入 build(pre[${pl}..${pr}], in[${il}..${ir}])　栈深 ${cs.length - 1}`, { arr: ino, win: [il, ir] });
      if (pl > pr) {
        cs[cs.length - 1].res = "null"; cs[cs.length - 1].ret = "null";
        F(11, `区间空 → return nullptr（弹栈）`, { arr: ino });
        cs.pop();
        return null;
      }
      const root = pre[pl], mid = idx[root], len = mid - il;
      F(12, `根 = pre[${pl}] = ${root}`, { arr: ino, hi: [mid] });
      F(13, `mid = idx[${root}] = ${mid}`, { arr: ino, hi: [mid], vars: { mid, 根: root } });
      F(14, `leftLen = ${mid} - ${il} = ${len}`, { arr: ino, win: [il, mid - 1], vars: { leftLen: len, mid, 根: root } });
      F(15, `左子树 build([${pl + 1},${pl + len}], [${il},${mid - 1}])　← 压栈`, { arr: ino, win: [il, mid - 1] });
      build(pl + 1, pl + len, il, mid - 1);
      F(15, `◀ 左子树返回，根 ${root} 的左孩子就位`, { arr: ino, hi: [mid] });
      F(16, `右子树 build([${pl + len + 1},${pr}], [${mid + 1},${ir}])　← 压栈`, { arr: ino, win: [mid + 1, ir] });
      build(pl + len + 1, pr, mid + 1, ir);
      F(16, `◀ 右子树返回，根 ${root} 的右孩子就位`, { arr: ino, hi: [mid] });
      cs[cs.length - 1].res = root; cs[cs.length - 1].ret = root;
      F(17, `return ${root}　← 弹栈，把节点 ${root} 交给上一层`, { arr: ino, hi: [mid], vars: { 返回: root } });
      cs.pop();
      return mid;
    }

    build(0, pre.length - 1, 0, ino.length - 1);
    F(6, "整棵树构造完成", { arr: ino, vars: { 根: pre[0] } });
    return S;
  };

  /* ============ 114 展开为链表 ============ */
  window.DBG[114] = p => {
    const tree = p.viz.tree, S = [], cs = [];
    const F = (line, note, extra) => S.push(Object.assign({ line, note, callstack: cp(cs) }, extra || {}));
    const name = i => (i < tree.length && tree[i] != null ? String(tree[i]) : "null");
    const order = [];
    (function pre(i) { if (name(i) === "null") return; order.push(tree[i]); pre(2 * i + 1); pre(2 * i + 2); })(0);

    cs.push({ fn: "flatten", args: "root", res: null });
    F(4, `入口 flatten(root)，前序应为 ${order.join(" → ")}`, { tree, treeHi: [0] });

    function flat(i) {
      cs.push({ fn: "flatten", args: name(i), res: null });
      F(4, `▶ 进入 flatten(${name(i)})　栈深 ${cs.length - 1}`, { tree, treeHi: name(i) === "null" ? [] : [i], vars: { node: name(i), depth: cs.length - 1 } });
      if (name(i) === "null") { cs.pop(); return; }
      F(5, `先拉直左子树 flatten(${name(2 * i + 1)})　← 压栈`, { tree, treeHi: name(2 * i + 1) === "null" ? [] : [2 * i + 1] });
      flat(2 * i + 1);
      F(5, `◀ 左子树已拉直`, { tree, treeHi: [i] });
      F(6, `再拉直右子树 flatten(${name(2 * i + 2)})　← 压栈`, { tree, treeHi: name(2 * i + 2) === "null" ? [] : [2 * i + 2] });
      flat(2 * i + 2);
      F(6, `◀ 右子树已拉直`, { tree, treeHi: [i] });
      F(9, `${name(i)}->left = nullptr`, { tree, treeHi: [i], vars: { node: name(i), left: "null" } });
      F(10, `${name(i)}->right = 左子树头部`, { tree, treeHi: [i], vars: { node: name(i), right: name(2 * i + 1) } });
      F(12, `沿 right 走到底找尾巴`, { tree, treeHi: [i], vars: { node: name(i) } });
      F(13, `尾巴->right = 原来的右子树`, { tree, treeHi: [i], vars: { node: name(i), right: name(2 * i + 2) } });
      cs[cs.length - 1].ret = "✓"; cs[cs.length - 1].res = name(i);
      F(13, `◀ ${name(i)} 拉直完毕，弹栈`, { tree, treeHi: [i] });
      cs.pop();
    }

    flat(0);
    F(4, `结果：${order.join(" → ")}`, { tree, vars: { 答案: order.join("→") } });
    return S;
  };

  /* ============ 148 排序链表（分治） ============ */
  window.DBG[148] = p => {
    const a = p.viz.arr, S = [], cs = [];
    const F = (line, note, extra) => S.push(Object.assign({ line, note, callstack: cp(cs) }, extra || {}));
    const seg = (l, r) => a.slice(l, r + 1).join("→") || "空";

    cs.push({ fn: "sortList", args: "head", res: null });
    F(4, `入口 sortList(整条链 ${seg(0, a.length - 1)})`, { list: a });

    function sl(l, r) {
      cs.push({ fn: "sortList", args: `[${l},${r}]`, res: null });
      F(4, `▶ 进入 sortList([${l},${r}]) = ${seg(l, r)}　栈深 ${cs.length - 1}`, { list: a.slice(l, r + 1) });
      if (l >= r) {
        cs[cs.length - 1].res = a[l]; cs[cs.length - 1].ret = a[l];
        F(4, `长度 ≤ 1 → 直接 return（弹栈）`, { list: a.slice(l, r + 1), vars: { 返回: a[l] } });
        cs.pop();
        return [l, r];
      }
      const mid = Math.floor((l + r) / 2);
      F(5, `快慢指针找中点`, { list: a.slice(l, r + 1) });
      F(6, `slow/fast 走位`, { list: a.slice(l, r + 1), ptr: { mid } });
      F(10, `mid = ${mid + 1}，右半从 ${a[mid + 1]} 开始`, { list: a.slice(l, r + 1), hi: [mid + 1] });
      F(11, `slow->next = nullptr → 断成 [${seg(l, mid)}] 和 [${seg(mid + 1, r)}]`, { list: a });
      F(12, `先排左半 sortList([${l},${mid}])　← 压栈`, { list: a.slice(l, mid + 1) });
      sl(l, mid);
      F(12, `◀ 左半已排好：${seg(l, mid)}`, { list: a.slice(l, mid + 1) });
      F(12, `再排右半 sortList([${mid + 1},${r}])　← 压栈`, { list: a.slice(mid + 1, r + 1) });
      sl(mid + 1, r);
      F(12, `◀ 右半已排好：${seg(mid + 1, r)}`, { list: a.slice(mid + 1, r + 1) });
      cs[cs.length - 1].res = "merged"; cs[cs.length - 1].ret = "✓";
      F(12, `merge 两半 → return（弹栈）`, { list: a.slice(l, r + 1) });
      cs.pop();
      return [l, r];
    }

    sl(0, a.length - 1);
    const sorted = a.slice().sort((x, y) => x - y);
    F(23, `归并完成：${sorted.join(" → ")}`, { list: sorted, listDone: sorted.map((_, i) => i), vars: { 答案: sorted.join("→") } });
    return S;
  };
})();
