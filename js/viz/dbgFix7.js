/* dbgFix7 — 142 / 25 / 146：补循环判断行与淘汰三步 */
;(function () {
  const cp = o => JSON.parse(JSON.stringify(o));

  /* ---------- 142 环形链表 II：补 L10 判断 ---------- */
  const d142 = window.DBG[142];
  window.DBG[142] = p => {
    const a = p.viz.arr, S = [];
    const F = (l, n, extra) => S.push(Object.assign({ line: l, note: n }, extra || {}));
    const Lp = (arr, ptr, hi, vars) => ({ list: arr.slice(), listPtr: ptr, listHi: hi, vars });

    F(4, "slow = fast = head", Lp(a, { 0: "slow/fast" }, [0], { slow: 0, fast: 0 }));
    let s = 0, f = 0, meet = -1;
    for (let g = 0; g < 8; g++) {
      F(5, `while (fast && fast->next) → slow=${s}, fast=${f}`, Lp(a, { [s]: "slow", [f]: "fast" }, [s, f], { slow: s, fast: f }));
      s = (s + 1) % a.length;
      F(6, `slow = slow->next → ${s}`, Lp(a, { [s]: "slow", [f]: "fast" }, [s], { slow: s, fast: f }));
      f = (f + 2) % a.length;
      F(7, `fast = fast->next->next → ${f}`, Lp(a, { [s]: "slow", [f]: "fast" }, [s, f], { slow: s, fast: f }));
      const hit = s === f;
      F(8, `if (slow == fast) → ${hit}`, Lp(a, { [s]: "slow", [f]: "fast" }, hit ? [s] : [s, f], { slow: s, fast: f }));
      if (hit) { meet = s; break; }
    }
    if (meet < 0) {
      F(14, "fast 走到 null → 无环，return nullptr", Lp(a, {}, [], { 答案: "null" }));
      return S;
    }
    F(9, `ListNode* p = head（slow 停在 ${meet}）`, Lp(a, { 0: "p", [meet]: "slow" }, [0, meet], { p: 0, slow: meet }));
    let p1 = 0, sl = meet, g2 = 0;
    while (p1 !== sl && g2++ < 10) {
      F(10, `while (p != slow) → p=${p1}, slow=${sl}（还不等，各走一步）`, Lp(a, { [p1]: "p", [sl]: "slow" }, [p1, sl], { p: p1, slow: sl }));
      p1 = (p1 + 1) % a.length;
      sl = (sl + 1) % a.length;
      F(10, `p → ${p1}，slow → ${sl}`, Lp(a, { [p1]: "p", [sl]: "slow" }, [p1, sl], { p: p1, slow: sl }));
    }
    F(10, `while (p != slow) → p == slow == ${p1}，退出`, Lp(a, { [p1]: "p/slow" }, [p1], { p: p1, slow: sl }));
    F(11, `return p → 入环点下标 ${p1}（值 ${a[p1]}）`, Lp(a, { [p1]: "p" }, [p1], { 答案: a[p1] }));
    return S;
  };

  /* ---------- 25 K 个一组翻转：补 L6 与 L11 ---------- */
  const d25 = window.DBG[25];
  window.DBG[25] = p => {
    const a = p.viz.arr, k = 2, S = [];
    const F = (l, n, extra) => S.push(Object.assign({ line: l, note: n, list: a.slice() }, extra || {}));
    /* 口径统一：所有指针变量都记「下标」，不混入节点值 */
    F(4, "dummy, groupPrev = &dummy", { listPtr: { 0: "groupPrev" }, vars: { i: 0, groupPrev: 0 } });
    for (let i = 0; i + k <= a.length; i += k) {
      F(5, "while (true)", { listPtr: { [i]: "groupPrev" }, vars: { i: 0, groupPrev: i } });
      F(6, `kth = groupPrev → ${i}`, { listPtr: { [i]: "groupPrev/kth" }, listHi: [i], vars: { i: 0, kth: i } });
      for (let t = 1; t <= k; t++) F(7, `for：kth = kth->next 第 ${t} 次 → 下标 ${i + t}`, { listPtr: { [i]: "groupPrev", [i + t]: "kth" }, listHi: [i + t], vars: { i: 0, kth: i + t } });
      F(8, "if (!kth) → kth 存在，够 k 个，继续", { listHi: [i + k], vars: { i: 0, kth: i + k } });
      F(9, `groupNext = kth->next → ${i + k < a.length ? i + k : "null"}`, { listHi: [i + k], vars: { i: 0, groupNext: i + k < a.length ? i + k : "null" } });
      F(10, `prev = groupNext，cur = groupPrev->next → ${i + 1}`, { listPtr: { [i + 1]: "cur", [i + k]: "prev" }, listHi: [i + 1], vars: { i: 0, cur: i + 1, prev: i + k } });
      for (let t = 0; t < k; t++) {
        const c = i + 1 + t;
        F(11, `while (cur != groupNext) → cur=${c}`, { listPtr: { [c]: "cur" }, listHi: [c], vars: { i: 0, cur: c } });
        F(12, `nxt = cur->next → ${c + 1}`, { listPtr: { [c]: "cur", [c + 1]: "nxt" }, vars: { i: 0, cur: c, nxt: c + 1 } });
        F(13, `cur->next = prev（${a[c]} 改指 ${c - 1 < i + 1 ? "groupNext" : a[c - 1]}）`, { listHi: [c], vars: { i: 0, cur: c, nxt: c + 1 } });
        F(14, `prev = cur → 下标 ${c}`, { listPtr: { [c]: "prev" }, listDone: [c], vars: { i: 0, prev: c } });
        F(15, `cur = nxt → ${c + 1}`, { listPtr: { [c]: "prev" }, vars: { i: 0, cur: c + 1 } });
      }
      F(11, "while (cur != groupNext) → cur 到位，退出", { vars: { i: 0, cur: "groupNext" } });
      F(17, `start = groupPrev->next → 下标 ${i}`, { listHi: [i], vars: { i: 0, start: i } });
      F(18, "groupPrev->next = kth（把翻转后的头接上）", { listHi: [i + k - 1], listDone: [i, i + k - 1], vars: { i: 0, start: i } });
      F(19, `groupPrev = start → ${a[i]}`, { listPtr: { [i + k]: "groupPrev" }, listDone: Array.from({ length: i + k }, (_, x) => x), vars: { i: 0, start: i } });
    }
    F(8, "if (!kth) → 剩余不足 k 个，return dummy.next", { vars: { i: 0, 结果: "每组已翻转，余下保持原序" } });
    return S;
  };

  /* ---------- 146 LRU：补命中更新与淘汰三步 ---------- */
  const d146 = window.DBG[146];
  window.DBG[146] = p => {
    const ops = p.viz.arr, S = [];
    const F = (l, n, extra) => S.push(Object.assign({ line: l, note: n, arr: ops }, extra || {}));
    const cap = 2;
    const cache = [];   // 头部最新

    F(6, `LRUCache(capacity) → cap = ${cap}`, { vars: { cap, cache: "空" } });

    ops.forEach((op, i) => {
      if (op.indexOf("put") === 0) {
        const kv = op.slice(4, -1).split(",");
        const k = kv[0], v = kv[1];
        F(16, `put(${k}, ${v}) → it = mp.find(${k})`, { ptr: { i }, vars: { k, v, cache: cache.join(" | ") || "空" } });
        const idx = cache.findIndex(x => x.split(":")[0] === k);
        if (idx >= 0) {
          F(17, `已存在（下标 ${idx}）→ 进入更新分支`, { ptr: { i }, vars: { k, cache: cache.join(" | ") } });
          const item = cache.splice(idx, 1)[0];
          cache.unshift(k + ":" + v);
          F(18, `it->second->second = ${v}（改值）`, { ptr: { i }, vars: { cache: cache.join(" | ") } });
          F(19, "lst.splice(begin, lst, it)：提到最前（最新）", { ptr: { i }, vars: { cache: cache.join(" | ") } });
          F(20, "return（put 结束）", { ptr: { i }, vars: { cache: cache.join(" | ") } });
          return;
        }
        F(17, `不存在 → 继续`, { ptr: { i }, vars: { k, cache: cache.join(" | ") || "空" } });
        F(22, `lst.size() == cap ? ${cache.length === cap}`, { ptr: { i }, vars: { size: cache.length, cap } });
        if (cache.length === cap) {
          const old = cache[cache.length - 1];
          F(23, `mp.erase(${old.split(":")[0]})：删掉最旧的键`, { ptr: { i }, vars: { 淘汰: old, cache: cache.join(" | ") } });
          cache.pop();
          F(24, `lst.pop_back()：链表尾部摘掉 → ${cache.join(" | ") || "空"}`, { ptr: { i }, vars: { cache: cache.join(" | ") || "空" } });
        }
        cache.unshift(k + ":" + v);
        F(26, `lst.emplace_front(${k}, ${v}) → ${cache.join(" | ")}`, { ptr: { i }, vars: { cache: cache.join(" | ") } });
        F(27, `mp[${k}] = lst.begin()`, { ptr: { i }, vars: { cache: cache.join(" | ") } });
      } else {
        const k = op.slice(4, -1);
        F(9, `get(${k}) → it = mp.find(${k})`, { ptr: { i }, vars: { k, cache: cache.join(" | ") || "空" } });
        const idx = cache.findIndex(x => x.split(":")[0] === k);
        if (idx < 0) {
          F(10, "未找到 → return -1", { ptr: { i }, vars: { 返回: -1 } });
        } else {
          const item = cache.splice(idx, 1)[0];
          cache.unshift(item);
          F(11, `lst.splice：把 ${item} 提到最前`, { ptr: { i }, vars: { cache: cache.join(" | ") } });
          F(12, `return ${item.split(":")[1]}`, { ptr: { i }, vars: { 返回: item.split(":")[1] } });
        }
      }
    });
    return S;
  };
})();
