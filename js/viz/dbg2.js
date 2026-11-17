/* dbg2 — 链表 14 题：按 C++ 行逐条走，指针与节点状态同步 */
;(function () {
  const cp = window.DBG.cp;
  const L = (arr, extra) => Object.assign({ list: arr.slice() }, extra || {});

  /* 160 相交链表 */
  window.DBG[160] = p => {
    const S = [], a = p.viz.arr, F = (l, n, s) => S.push(Object.assign({ line: l, note: n }, s || {}));
    F(4, "a = headA, b = headB", L(a, { listPtr: { 0: "a" }, listHi: [0] }));
    F(5, "while (a != b)", L(a, { listPtr: { 0: "a" }, listHi: [0] }));
    let i = 0, j = 0;
    for (let k = 0; k < a.length - 1; k++) {
      const ni = i + 1 < a.length ? i + 1 : 0;
      const nj = j + 1 < a.length ? j + 1 : 0;
      F(6, `a = a->next → 下标 ${ni}`, L(a, { listPtr: { [ni]: "a" }, listHi: [ni] }));
      F(7, `b = b->next → 下标 ${nj}`, L(a, { listPtr: { [ni]: "a", [nj]: "b" }, listHi: [ni, nj] }));
      i = ni; j = nj;
      if (i === j) break;
    }
    F(9, `return a（交点下标 ${i}）`, L(a, { listHi: [i], vars: { 交点: a[i] } }));
    return S;
  };

  /* 206 反转链表 */
  window.DBG[206] = p => {
  const S = [], a = p.viz.arr, F = (l, n, s) => S.push(Object.assign({ line: l, note: n }, s || {}));
  let prev = "null";
  F(4, "prev = nullptr", L(a, { listPtr: { 0: "head" }, listHi: [0], vars: { head: 0, prev: "null" } }));
  for (let i = 0; i < a.length; i++) {
    F(5, `while (head) → head 指向 ${a[i]}`, L(a, { listPtr: { [i]: "head" }, listHi: [i], listDone: Array.from({ length: i }, (_, k) => k), vars: { head: i, prev } }));
    const nxt = i + 1 < a.length ? i + 1 : "null";
    F(6, `nxt = head->next（下标 ${nxt}）`, L(a, { listPtr: { [i]: "head", [i + 1]: "nxt" }, listHi: [i + 1], vars: { head: i, prev, nxt } }));
    F(7, `head->next = prev → ${a[i]}.next 指向 ${i === 0 ? "null" : a[i - 1]}`, L(a, { listPtr: { [i]: "head" }, listHi: [i], vars: { head: i, prev, nxt } }));
    prev = i;
    F(8, `prev = head → prev 指向 ${a[i]}`, L(a, { listPtr: { [i]: "prev" }, listHi: [i], listDone: Array.from({ length: i + 1 }, (_, k) => k), vars: { head: i, prev } }));
    F(9, `head = nxt → head 指向 ${i + 1 < a.length ? a[i + 1] : "null"}`, L(a, { listPtr: { [i]: "prev", [i + 1]: "head" }, listHi: [i + 1], vars: { head: nxt, prev } }));
  }
  F(11, "return prev（新头）", L(a.slice().reverse(), { listDone: a.map((_, i) => i), vars: { 答案: a.slice().reverse().join("→") } }));
  return S;
};

/* 234 回文链表 */
  window.DBG[234] = p => {
    const S = [], a = p.viz.arr, F = (l, n, s) => S.push(Object.assign({ line: l, note: n }, s || {}));
    F(4, "slow = fast = head", L(a, { listPtr: { 0: "slow/fast" }, listHi: [0] }));
    let s = 0, f = 0;
    while (s + 1 < a.length && f + 2 <= a.length - 1 + 1) {
      F(5, `while (fast && fast->next) → slow=${s}, fast=${f}`, L(a, { listPtr: { [s]: "slow", [f]: "fast" }, listHi: [s, f] }));
      s++;
      F(6, `slow = slow->next → ${s}`, L(a, { listPtr: { [s]: "slow", [f]: "fast" }, listHi: [s] }));
      f += 2;
      F(7, `fast = fast->next->next → ${Math.min(f, a.length - 1)}`, L(a, { listPtr: { [s]: "slow", [Math.min(f, a.length - 1)]: "fast" }, listHi: [s] }));
      if (f > a.length - 1) break;
    }
    F(9, "prev = nullptr（开始反转后半段）", L(a, { listPtr: { [s]: "slow" }, listHi: [s] }));
    const half = a.slice(s);
    for (let k = half.length - 1; k >= 0; k--) {
      F(12, `slow->next = prev → ${half[k]} 指向后一位`, L(a, { listPtr: { [s + k]: "cur" }, listHi: [s + k], vars: { 阶段: "反转后半段" } }));
    }
    F(16, `p1 = head, p2 = ${a[a.length - 1]}`, L(a, { listPtr: { 0: "p1", [a.length - 1]: "p2" }, listHi: [0, a.length - 1] }));
    let ok = true;
    for (let k = 0; k < Math.floor(a.length / 2); k++) {
      const l2 = a.length - 1 - k;
      F(18, `p1->val(${a[k]}) != p2->val(${a[l2]}) ?`, L(a, { listPtr: { [k]: "p1", [l2]: "p2" }, listHi: [k, l2] }));
      if (a[k] !== a[l2]) { ok = false; F(18, "→ 不等，return false", L(a, { listHi: [k, l2], vars: { 答案: "false" } })); break; }
      F(19, `p1 = p1->next → ${k + 1}`, L(a, { listPtr: { [k + 1]: "p1", [l2]: "p2" }, listHi: [k + 1, l2] }));
      F(20, `p2 = p2->next → ${l2 - 1}`, L(a, { listPtr: { [k + 1]: "p1", [l2 - 1]: "p2" }, listHi: [k + 1, l2 - 1] }));
    }
    if (ok) F(22, "return true", L(a, { listDone: a.map((_, i) => i), vars: { 答案: "true" } }));
    return S;
  };

  /* 141 环形链表 */
  window.DBG[141] = p => {
  const S = [], a = p.viz.arr, n = a.length, F = (l, nm, s) => S.push(Object.assign({ line: l, note: nm }, s || {}));
  const L = (extra) => Object.assign({ list: a.slice() }, extra || {});
  let slow = 0, fast = 0;
  F(4, "slow = fast = head", L({ listPtr: { 0: "slow/fast" }, listHi: [0], vars: { slow: 0, fast: 0 } }));
  for (let k = 0; k < 4; k++) {
    F(5, "while (fast && fast->next)", L({ listPtr: { [slow]: "slow", [fast]: "fast" }, listHi: [slow, fast], vars: { slow, fast } }));
    slow = slow + 1 < n ? slow + 1 : 0;
    F(6, `slow = slow->next → ${slow}`, L({ listPtr: { [slow]: "slow", [fast]: "fast" }, listHi: [slow], vars: { slow, fast } }));
    fast = fast + 2 < n ? fast + 2 : (fast + 2) % n;
    F(7, `fast = fast->next->next → ${fast}`, L({ listPtr: { [slow]: "slow", [fast]: "fast" }, listHi: [fast], vars: { slow, fast } }));
    const hit = slow === fast;
    F(8, `slow == fast ? ${hit}`, L({ listPtr: { [slow]: "slow/fast" }, listHi: [slow], vars: { slow, fast, 相遇: hit } }));
    if (hit) { F(8, "→ return true", L({ listHi: [slow], vars: { 答案: "true" } })); return S; }
  }
  F(8, "fast 走到尽头 → return false", L({ vars: { 答案: "false" } }));
  return S;
};

/* 142 环形链表 II */
  window.DBG[142] = p => {
    const S = [], a = p.viz.arr, F = (l, n, s) => S.push(Object.assign({ line: l, note: n }, s || {}));
    F(4, "slow = fast = head", L(a, { listPtr: { 0: "slow/fast" }, listHi: [0] }));
    let s = 0, f = 0, meet = -1;
    for (let k = 0; k < 6; k++) {
      F(5, "while (fast && fast->next)", L(a, { listPtr: { [s]: "slow", [f]: "fast" }, listHi: [s, f] }));
      s = (s + 1) % a.length;
      F(6, `slow → ${s}`, L(a, { listPtr: { [s]: "slow", [f]: "fast" }, listHi: [s] }));
      f = (f + 2) % a.length;
      F(7, `fast → ${f}`, L(a, { listPtr: { [s]: "slow", [f]: "fast" }, listHi: [s, f] }));
      F(8, `slow == fast ? ${s === f}`, L(a, { listHi: s === f ? [s] : [s, f] }));
      if (s === f) { meet = s; break; }
    }
    if (meet < 0) { F(14, "return nullptr", L(a, { vars: { 答案: "null" } })); return S; }
    F(9, `p = head（slow 停在 ${meet}）`, L(a, { listPtr: { 0: "p", [meet]: "slow" }, listHi: [0, meet] }));
    let p1 = 0;
    while (p1 !== meet) {
      F(10, `while (p != slow) → p=${p1}, slow=${meet}`, L(a, { listPtr: { [p1]: "p", [meet]: "slow" }, listHi: [p1, meet] }));
      p1 = (p1 + 1) % a.length;
      meet = (meet + 1) % a.length;
      F(10, `p → ${p1}，slow → ${meet}`, L(a, { listPtr: { [p1]: "p", [meet]: "slow" }, listHi: [p1, meet] }));
    }
    F(11, `return p（入口 ${p1}）`, L(a, { listHi: [p1], listDone: [p1], vars: { 答案: a[p1] } }));
    return S;
  };

  /* 21 合并两个有序链表 */
  window.DBG[21] = p => {
    const S = [], a = p.viz.arr, F = (l, n, s) => S.push(Object.assign({ line: l, note: n }, s || {}));
    const A = a.slice(0, 3), B = a.slice(3);
    F(4, "dummy, tail = &dummy", { list: [], vars: { A: A.join("→"), B: B.join("→") } });
    let i = 0, j = 0, out = [];
    while (i < A.length && j < B.length) {
      F(5, `while (a && b) → a=${A[i]}, b=${B[j]}`, { list: out.slice(), listPtr: { [i]: "a", [B.length + j]: "b" }, vars: { i, j } });
      F(6, `${A[i]} <= ${B[j]} ?`, { list: out.slice(), vars: { i, j } });
      if (A[i] <= B[j]) { out.push(A[i]); i++; F(6, `tail->next = ${out[out.length - 1]}，a = a->next`, { list: out.slice(), listDone: out.map((_, k) => k) }); }
      else { out.push(B[j]); j++; F(7, `tail->next = ${out[out.length - 1]}，b = b->next`, { list: out.slice(), listDone: out.map((_, k) => k) }); }
      F(8, `tail = tail->next → 已接 ${out.length} 个`, { list: out.slice(), listDone: out.map((_, k) => k) });
    }
    while (i < A.length) { out.push(A[i]); i++; F(10, `接上 a 的剩余 ${out[out.length - 1]}`, { list: out.slice() }); }
    while (j < B.length) { out.push(B[j]); j++; F(10, `接上 b 的剩余 ${out[out.length - 1]}`, { list: out.slice() }); }
    F(11, "return dummy.next", { list: out.slice(), listDone: out.map((_, k) => k), vars: { 答案: out.join("→") } });
    return S;
  };

  /* 2 两数相加 */
  window.DBG[2] = p => {
    const S = [], a = p.viz.arr, F = (l, n, s) => S.push(Object.assign({ line: l, note: n }, s || {}));
    const A = [2, 4, 3], B = [5, 6, 4], out = [];
    let i = 0, j = 0, carry = 0;
    F(4, "dummy, tail = &dummy", { list: [], vars: { l1: A.join("→"), l2: B.join("→") } });
    F(5, "carry = 0", { list: [], vars: { carry } });
    while (i < A.length || j < B.length || carry) {
      F(6, `while (l1 || l2 || carry) → carry=${carry}`, { list: out.slice(), vars: { i, j, carry } });
      const v = (A[i] || 0) + (B[j] || 0) + carry;
      F(7, `v = ${A[i] || 0} + ${B[j] || 0} + ${carry} = ${v}`, { list: out.slice(), vars: { v } });
      carry = Math.floor(v / 10);
      F(8, `carry = v / 10 = ${carry}`, { list: out.slice(), vars: { v, carry } });
      out.push(v % 10);
      F(9, `tail->next = new ListNode(${v % 10})`, { list: out.slice(), listDone: out.map((_, k) => k) });
      F(10, "tail = tail->next", { list: out.slice() });
      i++; j++;
      F(11, `l1 = l1->next → ${i}`, { list: out.slice(), vars: { i } });
      F(12, `l2 = l2->next → ${j}`, { list: out.slice(), vars: { i, j } });
    }
    F(14, "return dummy.next", { list: out.slice(), listDone: out.map((_, k) => k), vars: { 答案: out.join("→") } });
    return S;
  };

  /* 19 删除倒数第 N 个 */
  window.DBG[19] = p => {
    const S = [], a = p.viz.arr, F = (l, n, s) => S.push(Object.assign({ line: l, note: n }, s || {}));
    const n = 2;
    F(4, "dummy(0, head)", { list: a, vars: { n } });
    F(5, "fast = slow = &dummy", { list: a, listPtr: { 0: "slow/fast" }, listHi: [0] });
    for (let k = 1; k <= n; k++) F(6, `for：fast = fast->next → ${k}`, { list: a, listPtr: { 0: "slow", [k]: "fast" }, listHi: [k] });
    let fast = n, slow = 0;
    while (fast < a.length - 1) {
      F(7, `while (fast->next) → fast=${fast}, slow=${slow}`, { list: a, listPtr: { [slow]: "slow", [fast]: "fast" }, listHi: [fast] });
      fast++; slow++;
      F(7, `fast → ${fast}，slow → ${slow}`, { list: a, listPtr: { [slow]: "slow", [fast]: "fast" }, listHi: [slow, fast] });
    }
    F(7, `fast->next == null → slow 停在 ${slow}`, { list: a, listPtr: { [slow]: "slow" }, listHi: [slow] });
    F(8, `slow->next = slow->next->next（删掉 ${a[slow + 1]}）`, { list: a, listHi: [slow + 1], listDone: [slow + 1], vars: { 删除: a[slow + 1] } });
    F(9, "return dummy.next", { list: a.filter((_, i) => i !== slow + 1), listDone: [slow], vars: { 答案: a.filter((_, i) => i !== slow + 1).join("→") } });
    return S;
  };

  /* 24 两两交换 */
  window.DBG[24] = p => {
    const S = [], a = p.viz.arr, F = (l, n, s) => S.push(Object.assign({ line: l, note: n }, s || {}));
    F(4, "dummy, prev = &dummy", { list: a, listPtr: { 0: "prev" } });
    for (let i = 0; i + 1 < a.length; i += 2) {
      F(5, `while (prev->next && prev->next->next) → i=${i}`, { list: a, listPtr: { [i]: "prev" }, listHi: [i, i + 1] });
      F(6, `a = prev->next → ${a[i]}`, { list: a, listPtr: { [i]: "a", [i + 2]: "prev" }, listHi: [i] });
      F(7, `b = a->next → ${a[i + 1]}`, { list: a, listPtr: { [i]: "a", [i + 1]: "b" }, listHi: [i, i + 1] });
      F(8, `a->next = b->next`, { list: a, listHi: [i], listPtr: { [i]: "a", [i + 1]: "b" } });
      F(9, `b->next = a（${a[i + 1]} → ${a[i]}）`, { list: a, listHi: [i, i + 1] });
      F(10, `prev->next = b`, { list: a, listHi: [i + 1], listDone: [i] });
      F(11, `prev = a → ${a[i]}`, { list: a, listPtr: { [i]: "prev" }, listDone: [i, i + 1] });
    }
    F(13, "return dummy.next", { list: a, listDone: a.map((_, i) => i), vars: { 结果: "每两个已互换" } });
    return S;
  };

  /* 25 K 个一组翻转 */
  window.DBG[25] = p => {
    const S = [], a = p.viz.arr, k = 2, F = (l, n, s) => S.push(Object.assign({ line: l, note: n }, s || {}));
    F(4, "dummy, groupPrev = &dummy", { list: a, listPtr: { 0: "groupPrev" } });
    for (let i = 0; i + k <= a.length; i += k) {
      F(5, "while (true)", { list: a, listPtr: { [i]: "groupPrev" }, listHi: [i] });
      for (let t = 1; t <= k; t++) F(7, `数第 ${t} 个 → 下标 ${i + t}`, { list: a, listPtr: { [i]: "groupPrev", [i + t]: "kth" }, listHi: [i + t] });
      F(8, "kth 存在，继续", { list: a, listHi: [i + k] });
      F(9, `groupNext = kth->next → ${i + k < a.length ? a[i + k] : "null"}`, { list: a, listHi: [i + k] });
      F(10, "prev = groupNext, cur = groupPrev->next", { list: a, listPtr: { [i + 1]: "cur", [i + k]: "prev" }, listHi: [i + 1] });
      for (let t = 0; t < k; t++) {
        F(12, `nxt = cur->next`, { list: a, listHi: [i + t] });
        F(13, `cur->next = prev`, { list: a, listHi: [i + t] });
        F(14, `prev = cur`, { list: a, listPtr: { [i + t]: "prev" }, listHi: [i + t] });
        F(15, `cur = nxt`, { list: a, listPtr: { [i + t]: "prev", [i + t + 1]: "cur" } });
      }
      F(17, `start = groupPrev->next → ${a[i]}`, { list: a, listHi: [i] });
      F(18, "groupPrev->next = kth", { list: a, listHi: [i + k - 1], listDone: [i, i + k - 1] });
      F(19, `groupPrev = start`, { list: a, listDone: Array.from({ length: i + k }, (_, x) => x) });
    }
    F(20, "不足 k 个，dummy.next 返回", { list: a, vars: { 结果: "每组已翻转" } });
    return S;
  };

  /* 138 随机链表的复制 */
  window.DBG[138] = p => {
    const S = [], a = p.viz.arr, F = (l, n, s) => S.push(Object.assign({ line: l, note: n }, s || {}));
    F(4, "if (!head) return nullptr", { list: a, listPtr: { 0: "head" } });
    F(5, "mp = {}", { list: a, map: {} });
    const mp = {};
    a.forEach((v, i) => {
      mp[v] = "Node(" + v + ")";
      F(6, `mp[${v}] = new Node(${v})`, { list: a, listPtr: { [i]: "p" }, listHi: [i], map: cp(mp) });
    });
    a.forEach((v, i) => {
      F(7, `第二趟：p 走到节点 ${v}`, { list: a, listPtr: { [i]: "p" }, listHi: [i], map: cp(mp) });
      F(8, `mp[${v}]->next = ${i + 1 < a.length ? "mp[" + a[i + 1] + "]" : "null"}`, { list: a, listHi: [i], map: cp(mp), vars: { 阶段: "接 next" } });
      F(9, `mp[${v}]->random = ${i % 2 === 0 ? "mp[" + a[a.length - 1 - i] + "]" : "null"}`, { list: a, listHi: [i], map: cp(mp), vars: { 阶段: "接 random" } });
    });
    F(11, "return mp[head]", { list: a, vars: { 结果: "深拷贝完成" } });
    return S;
  };

  /* 148 排序链表 */
  window.DBG[148] = p => {
    const S = [], a = p.viz.arr, F = (l, n, s) => S.push(Object.assign({ line: l, note: n }, s || {}));
    F(4, `if (!head || !head->next) → 长度 ${a.length}`, { list: a, vars: { n: a.length } });
    F(5, "slow = head, fast = head->next", { list: a, listPtr: { 0: "slow", 1: "fast" }, listHi: [0, 1] });
    let slow = 0, fast = 1;
    while (fast < a.length - 1) {
      F(6, `while (fast && fast->next) → slow=${slow}, fast=${fast}`, { list: a, listPtr: { [slow]: "slow", [fast]: "fast" }, listHi: [slow, fast] });
      slow++; fast += 2;
      F(7, `slow → ${slow}`, { list: a, listPtr: { [slow]: "slow" }, listHi: [slow] });
      F(8, `fast → ${Math.min(fast, a.length - 1)}`, { list: a, listPtr: { [slow]: "slow", [Math.min(fast, a.length - 1)]: "fast" }, listHi: [slow] });
    }
    F(10, `mid = slow->next → 下标 ${slow + 1}`, { list: a, listHi: [slow + 1] });
    F(11, "slow->next = nullptr（断成两半）", { list: a, listHi: [slow], vars: { 左: a.slice(0, slow + 1).join(","), 右: a.slice(slow + 1).join(",") } });
    F(12, "return merge(sortList(head), sortList(mid))", { list: a.slice() });
    const sorted = a.slice().sort((x, y) => x - y);
    F(16, "merge：dummy, tail = &dummy", { list: sorted, vars: { 阶段: "归并" } });
    F(18, "if (a->val <= b->val) 取小的接上", { list: sorted, listDone: sorted.map((_, i) => i), vars: { 答案: sorted.join("→") } });
    F(23, "return dummy.next", { list: sorted, listDone: sorted.map((_, i) => i) });
    return S;
  };

  /* 23 合并 K 个升序链表 */
  window.DBG[23] = p => {
    const S = [], a = p.viz.arr, F = (l, n, s) => S.push(Object.assign({ line: l, note: n }, s || {}));
    F(4, "cmp：小顶堆比较器", { list: a, vars: { lists: "3 条链表" } });
    F(5, "priority_queue 声明", { list: [], map: {} });
    F(6, "把每条链表的头入堆", { list: [], map: { 堆: "各头节点" } });
    const out = [];
    for (let i = 0; i < a.length; i++) {
      F(7, `dummy, tail = &dummy`, { list: out.slice(), map: { 堆大小: a.length - i } });
      F(8, `while (!pq.empty())`, { list: out.slice(), map: { 堆大小: a.length - i } });
      F(9, `node = pq.top(); pq.pop() → ${a[i]}`, { list: out.slice(), map: { 堆大小: a.length - i - 1 } });
      out.push(a[i]);
      F(10, `tail->next = ${a[i]}`, { list: out.slice(), listDone: out.map((_, k) => k) });
      F(11, "tail = node", { list: out.slice() });
      F(12, "该链表的 next 入堆", { list: out.slice(), map: { 堆大小: a.length - i } });
    }
    F(14, "return dummy.next", { list: out.slice(), listDone: out.map((_, k) => k), vars: { 答案: out.join("→") } });
    return S;
  };

  /* 146 LRU */
  window.DBG[146] = p => {
    const S = [], ops = p.viz.arr, F = (l, n, s) => S.push(Object.assign({ line: l, note: n }, s || {}));
    const cache = [];  // 头最新
    F(6, "LRUCache(capacity) → cap = 2", { arr: ops, map: {}, vars: { cap: 2 } });
    ops.forEach((op, i) => {
      if (op.indexOf("put") === 0) {
        const kv = op.slice(4, -1).split(",");
        const k = kv[0], v = kv[1];
        F(16, `put(${k}, ${v}) → find(${k})`, { arr: ops, ptr: { i }, map: { cap: 2 }, vars: { cache: cache.join(" | ") || "空" } });
        const idx = cache.findIndex(x => x.split(":")[0] === k);
        if (idx >= 0) {
          cache.splice(idx, 1);
          F(18, `已存在 → 更新 value`, { arr: ops, ptr: { i }, vars: { cache: cache.join(" | ") } });
          F(19, "splice 到头部", { arr: ops, ptr: { i }, vars: { cache: cache.join(" | ") } });
          cache.unshift(k + ":" + v);
          return;
        }
        F(17, "不存在", { arr: ops, ptr: { i } });
        if (cache.length === 2) {
          const old = cache.pop();
          F(22, `size == cap → 淘汰尾部 ${old}`, { arr: ops, ptr: { i }, vars: { cache: cache.join(" | ") || "空" } });
        }
        F(26, `emplace_front(${k}, ${v})`, { arr: ops, ptr: { i }, vars: { cache: (k + ":" + v + (cache.length ? " | " + cache.join(" | ") : "")) } });
        cache.unshift(k + ":" + v);
        F(27, "mp[key] = lst.begin()", { arr: ops, vars: { cache: cache.join(" | ") } });
      } else {
        const k = op.slice(4, -1);
        F(9, `get(${k}) → find(${k})`, { arr: ops, ptr: { i }, vars: { cache: cache.join(" | ") } });
        const idx = cache.findIndex(x => x.split(":")[0] === k);
        if (idx < 0) {
          F(10, "→ 未命中，return -1", { arr: ops, ptr: { i }, vars: { 返回: -1 } });
        } else {
          const item = cache.splice(idx, 1)[0];
          F(11, `splice 到头部（${item}）`, { arr: ops, ptr: { i }, vars: { cache: (item + (cache.length ? " | " + cache.join(" | ") : "")) } });
          cache.unshift(item);
          F(12, `return ${item.split(":")[1]}`, { arr: ops, ptr: { i }, vars: { 返回: item.split(":")[1] } });
        }
      }
    });
    return S;
  };
})();
