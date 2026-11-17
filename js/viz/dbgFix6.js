/* dbgFix6 — 234 / 199 / 114 / 148：补齐循环体内部的行 */
;(function () {
  const cp = o => JSON.parse(JSON.stringify(o));

  /* ============ 234 回文链表：三段循环都展开 ============ */
  window.DBG[234] = p => {
    const a = p.viz.arr, S = [];
    const L = (extra) => Object.assign({ list: a.slice() }, extra || {});
    const F = (line, note, extra) => S.push(Object.assign({ line, note }, extra || {}));

    F(4, "slow = fast = head", L({ listPtr: { 0: "slow/fast" }, listHi: [0], vars: { slow: 0, fast: 0 } }));

    /* 第一段：找中点 */
    let s = 0, f = 0;
    let guard = 0;
    while (f + 1 < a.length && guard++ < 12) {
      F(5, `while (fast && fast->next) → slow=${s}, fast=${f}`, L({ listPtr: { [s]: "slow", [f]: "fast" }, listHi: [s, f], vars: { slow: s, fast: f } }));
      s++;
      F(6, `slow = slow->next → ${s}`, L({ listPtr: { [s]: "slow", [f]: "fast" }, listHi: [s], vars: { slow: s, fast: f } }));
      f += 2;
      const fm = Math.min(f, a.length - 1);
      F(7, `fast = fast->next->next → ${fm}`, L({ listPtr: { [s]: "slow", [fm]: "fast" }, listHi: [fm], vars: { slow: s, fast: fm } }));
    }
    F(5, `fast 到底 → 中点 slow = ${s}（值 ${a[s]}）`, L({ listPtr: { [s]: "slow" }, listHi: [s], vars: { slow: s } }));

    /* 第二段：反转后半段 */
    let prev = null;
    F(9, "prev = nullptr", L({ listPtr: { [s]: "slow" }, listHi: [s], vars: { slow: s, prev: "null" } }));
    let i = s;
    let g2 = 0;
    while (i < a.length && g2++ < 12) {
      F(10, `while (slow) → slow 在 ${i}（${a[i]}）`, L({ listPtr: { [i]: "slow" }, listHi: [i], vars: { slow: i, prev: prev === null ? "null" : prev } }));
      const nxt = i + 1 < a.length ? i + 1 : null;
      F(11, `nxt = slow->next → ${nxt === null ? "null" : nxt}`, L({ listPtr: { [i]: "slow", [nxt]: "nxt" }, listHi: [i], vars: { slow: i, nxt: nxt === null ? "null" : nxt } }));
      F(12, `slow->next = prev（${a[i]} 指向 ${prev === null ? "null" : a[prev]}）`, L({ listPtr: { [i]: "slow" }, listHi: [i], vars: { slow: i, prev: prev === null ? "null" : prev } }));
      prev = i;
      F(13, `prev = slow → ${i}（${a[i]}）`, L({ listPtr: { [i]: "prev" }, listHi: [i], listDone: [i], vars: { slow: i, prev: i } }));
      i = nxt === null ? a.length : nxt;
      F(14, `slow = nxt → ${i < a.length ? i : "null"}`, L({ listPtr: i < a.length ? { [i]: "slow" } : {}, vars: { slow: i < a.length ? i : "null", prev } }));
    }
    F(10, "slow 到 null → 后半段反转完成", L({ vars: { prev } }));

    /* 第三段：双指针比对 */
    let p1 = 0, p2 = prev;
    F(16, `p1 = head（0），p2 = ${prev}（${a[prev]}）`, L({ listPtr: { 0: "p1", [prev]: "p2" }, listHi: [0, prev], vars: { p1: 0, p2: prev } }));
    let g3 = 0;
    while (p2 !== null && g3++ < 12) {
      F(17, `while (p2) → p1=${p1}, p2=${p2}`, L({ listPtr: { [p1]: "p1", [p2]: "p2" }, listHi: [p1, p2], vars: { p1, p2 } }));
      F(18, `p1->val(${a[p1]}) != p2->val(${a[p2]}) ?`, L({ listHi: [p1, p2], vars: { p1, p2 } }));
      if (a[p1] !== a[p2]) {
        F(18, "→ 不等，return false", L({ listHi: [p1, p2], vars: { 答案: "false" } }));
        return S;
      }
      p1++;
      F(19, `p1 = p1->next → ${p1}`, L({ listPtr: { [p1]: "p1", [p2]: "p2" }, listHi: [p1, p2], vars: { p1, p2 } }));
      p2 = p2 - 1 >= 0 && p2 - 1 < s ? null : p2 - 1;
      F(20, `p2 = p2->next → ${p2 === null ? "null" : p2}`, L({ listPtr: p2 === null ? { [p1]: "p1" } : { [p1]: "p1", [p2]: "p2" }, vars: { p1, p2: p2 === null ? "null" : p2 } }));
    }
    F(22, "全部相等 → return true", L({ listDone: a.map((_, k) => k), vars: { 答案: "true" } }));
    return S;
  };

  /* ============ 199 右视图：队列 + 每层循环 ============ */
  window.DBG[199] = p => {
    const tree = p.viz.tree, S = [];
    const F = (line, note, extra) => S.push(Object.assign({ line, note }, extra || {}));
    const name = i => (i < tree.length && tree[i] != null ? tree[i] : null);

    const res = [];
    F(4, "res = []", { tree, vars: { res: "" } });
    F(5, "`if (!root)` → root 非空", { tree, treeHi: [0] });
    F(6, "`queue q{{root}}` → q = [root]", { tree, treeHi: [0], stack: [tree[0]] });

    let q = [0];
    let layer = 0;
    while (q.length) {
      F(7, `while (!q.empty()) → 第 ${layer} 层，队列 ${q.map(i => tree[i]).join(",")}`, { tree, treeHi: q.slice(), stack: q.map(i => tree[i]) });
      const sz = q.length;
      const nq = [];
      F(8, `sz = ${sz}`, { tree, treeHi: q.slice(), vars: { sz } });
      for (let i = 0; i < sz; i++) {
        F(9, `for：i = ${i}（本层第 ${i + 1}/${sz} 个）`, { tree, treeHi: [q[i]], vars: { i, sz } });
        const node = q[i];
        F(10, `node = q.front() = ${tree[node]}，pop`, { tree, treeHi: [node], vars: { node: tree[node] } });
        if (i === sz - 1) {
          res.push(tree[node]);
          F(11, `i == sz-1（本层最右）→ res.push(${tree[node]})`, { tree, treeHi: [node], vars: { res: res.join(",") } });
        }
        if (name(2 * node + 1) != null) { nq.push(2 * node + 1); F(12, `左孩子 ${tree[2 * node + 1]} 入队`, { tree, treeHi: [2 * node + 1], stack: nq.map(x => tree[x]) }); }
        if (name(2 * node + 2) != null) { nq.push(2 * node + 2); F(13, `右孩子 ${tree[2 * node + 2]} 入队`, { tree, treeHi: [2 * node + 2], stack: nq.map(x => tree[x]) }); }
      }
      q = nq;
      layer++;
    }
    F(16, `return {${res.join(",")}}`, { tree, vars: { 答案: res.join(",") } });
    return S;
  };

  /* ============ 114 展开为链表：left/right/tail 三个中间量 ============ */
  window.DBG[114] = p => {
    const tree = p.viz.tree, S = [], cs = [];
    const F = (line, note, extra) => S.push(Object.assign({ line, note, callstack: cp(cs) }, extra || {}));
    const name = i => (i < tree.length && tree[i] != null ? String(tree[i]) : "null");
    const order = [];
    (function pre(i) { if (name(i) === "null") return; order.push(tree[i]); pre(2 * i + 1); pre(2 * i + 2); })(0);

    cs.push({ fn: "flatten", args: "root", res: null });
    F(4, `入口 flatten(root)，前序应为 ${order.join(" → ")}`, { tree, treeHi: [0], vars: { 前序: order.join("→") } });

    function flat(i) {
      cs.push({ fn: "flatten", args: name(i), res: null });
      F(4, `▶ 进入 flatten(${name(i)})　栈深 ${cs.length - 1}`, { tree, treeHi: name(i) === "null" ? [] : [i], vars: { node: name(i), 栈深: cs.length - 1 } });
      if (name(i) === "null") { cs.pop(); return; }
      F(5, `flatten(${name(2 * i + 1)})：先拉直左子树　← 压栈`, { tree, treeHi: [i], vars: { node: tree[i] } });
      flat(2 * i + 1);
      F(5, "◀ 左子树已拉直", { tree, treeHi: [i], vars: { node: tree[i] } });
      F(6, `flatten(${name(2 * i + 2)})：再拉直右子树　← 压栈`, { tree, treeHi: [i], vars: { node: tree[i] } });
      flat(2 * i + 2);
      F(6, "◀ 右子树已拉直", { tree, treeHi: [i], vars: { node: tree[i] } });
      F(7, `left = root->left → ${name(2 * i + 1)}`, { tree, treeHi: [i], vars: { left: name(2 * i + 1) } });
      F(8, `right = root->right → ${name(2 * i + 2)}`, { tree, treeHi: [i], vars: { left: name(2 * i + 1), right: name(2 * i + 2) } });
      F(9, `${name(i)}->left = nullptr`, { tree, treeHi: [i], vars: { left: "null", right: name(2 * i + 2) } });
      F(10, `${name(i)}->right = left（${name(2 * i + 1)}）`, { tree, treeHi: [i], vars: { right: name(2 * i + 1) } });
      F(11, `tail = root → ${name(i)}`, { tree, treeHi: [i], vars: { tail: name(i) } });
      F(12, "while (tail->right) tail = tail->right（走到尾巴）", { tree, treeHi: [i], vars: { tail: name(2 * i + 1) } });
      F(13, `tail->right = right（${name(2 * i + 2)}）`, { tree, treeHi: [i], vars: { tail: name(2 * i + 1), right: name(2 * i + 2) } });
      cs[cs.length - 1].ret = "✓";
      F(13, `◀ ${name(i)} 拉直完毕，弹栈`, { tree, treeHi: [i], vars: { node: name(i) } });
      cs.pop();
    }
    flat(0);
    F(4, `结果：${order.join(" → ")}`, { tree, vars: { 答案: order.join("→") } });
    return S;
  };

  /* ============ 148 排序链表：分治两段循环 ============ */
  window.DBG[148] = p => {
    const a = p.viz.arr, S = [], cs = [];
    const F = (line, note, extra) => S.push(Object.assign({ line, note, callstack: cp(cs) }, extra || {}));
    const seg = (l, r) => a.slice(l, r + 1).join("→") || "空";

    cs.push({ fn: "sortList", args: "head", res: null });
    F(4, `入口 sortList(整条链 ${seg(0, a.length - 1)})，长度 ${a.length}`, { list: a, vars: { n: a.length } });

    function sl(l, r) {
      cs.push({ fn: "sortList", args: `[${l},${r}]`, res: null });
      F(4, `▶ 进入 sortList([${l},${r}]) = ${seg(l, r)}`, { list: a.slice(l, r + 1), vars: { l, r, 长度: r - l + 1 } });
      if (l >= r) {
        cs[cs.length - 1].res = a[l]; cs[cs.length - 1].ret = a[l];
        F(4, `长度 ≤ 1 → 直接 return（弹栈）`, { list: a.slice(l, r + 1), vars: { 返回: a[l] } });
        cs.pop();
        return;
      }
      let slow = l, fast = l + 1;
      F(5, `slow = ${slow}, fast = ${fast}`, { list: a.slice(l, r + 1), vars: { slow, fast } });
      let g = 0;
      while (fast + 1 <= r && g++ < 12) {
        F(6, `while (fast && fast->next) → slow=${slow}, fast=${fast}`, { list: a.slice(l, r + 1), ptr: { slow, fast }, vars: { slow, fast } });
        slow++;
        F(7, `slow = slow->next → ${slow}`, { list: a.slice(l, r + 1), ptr: { slow, fast }, vars: { slow, fast } });
        fast += 2;
        const fm = Math.min(fast, r);
        F(8, `fast = fast->next->next → ${fm}`, { list: a.slice(l, r + 1), ptr: { slow, fast: fm }, vars: { slow, fast: fm } });
      }
      const mid = slow + 1;
      F(10, `mid = slow->next → 下标 ${mid}（${a[mid]}）`, { list: a.slice(l, r + 1), hi: [mid - l], vars: { mid } });
      F(11, `slow->next = nullptr → 断成 [${seg(l, slow)}] 和 [${seg(mid, r)}]`, { list: a.slice(l, r + 1), vars: { 左: seg(l, slow), 右: seg(mid, r) } });
      F(12, `先排左半 sortList([${l},${slow}])　← 压栈`, { list: a.slice(l, slow + 1) });
      sl(l, slow);
      F(12, `◀ 左半已排好：${seg(l, slow)}`, { list: a.slice(l, slow + 1) });
      F(12, `再排右半 sortList([${mid},${r}])　← 压栈`, { list: a.slice(mid, r + 1) });
      sl(mid, r);
      F(12, `◀ 右半已排好：${seg(mid, r)}`, { list: a.slice(mid, r + 1) });
      F(15, `进入 merge(${seg(l, slow)}, ${seg(mid, r)})`, { list: a.slice(l, r + 1) });
      F(16, "dummy, tail = &dummy", { list: [], vars: { tail: "dummy" } });
      F(17, "while (a && b)：两队都非空就取小的", { list: [] });
      F(18, "if (a->val <= b->val) 取 a，否则（L19）取 b", { list: [] });
      F(20, "tail = tail->next", { list: [] });
      F(22, "tail->next = 剩下的那半", { list: [] });
      cs[cs.length - 1].res = "merged"; cs[cs.length - 1].ret = "✓";
      F(23, `return dummy.next（弹栈）`, { list: a.slice(l, r + 1) });
      cs.pop();
    }

    sl(0, a.length - 1);
    const sorted = a.slice().sort((x, y) => x - y);
    F(23, `归并完成：${sorted.join(" → ")}`, { list: sorted, listDone: sorted.map((_, i) => i), vars: { 答案: sorted.join("→") } });
    return S;
  };
})();
