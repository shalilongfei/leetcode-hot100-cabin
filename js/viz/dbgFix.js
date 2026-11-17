/* dbgFix — 三题的完整过程重写：394 / 160 / 21 */
;(function () {

  /* ============ 394 字符串解码：每个字符走完整判断链 ============ */
  window.DBG[394] = p => {
    const s = p.viz.arr, S = [], st = [];
    let cur = "", num = 0;
    const F = (l, n, extra) => S.push(Object.assign({ line: l, note: n, stack: st.map(x => x), vars: { cur: '"' + cur + '"', num } }, extra || {}));

    F(4, "stack 空", { arr: s });
    F(5, 'cur = ""', { arr: s });
    F(6, "num = 0", { arr: s });

    s.forEach((c, i) => {
      F(7, `for：'${c}'`, { arr: s, ptr: { i } });
      const isNum = /^\d$/.test(c);
      F(8, `isdigit('${c}') ? ${isNum}`, { arr: s, ptr: { i } });

      if (isNum) {
        num = num * 10 + Number(c);
        F(8, `→ num = num*10 + ${c} = ${num}`, { arr: s, ptr: { i } });
        return;
      }

      F(9, `else if c == '[' ? ${c === "["}`, { arr: s, ptr: { i } });
      if (c === "[") {
        st.push(cur + "|" + num);
        F(10, `→ push({"${cur}", ${num}})，栈深 ${st.length}`, { arr: s, ptr: { i } });
        cur = "";
        F(11, `cur 清空 → ""`, { arr: s, ptr: { i }, vars: { cur: '""', num } });
        num = 0;
        F(12, `num 归零（重复次数已存进栈）`, { arr: s, ptr: { i }, vars: { cur: '""', num: 0 } });
        return;
      }

      F(13, `else if c == ']' ? ${c === "]" }`, { arr: s, ptr: { i } });
      if (c === "]") {
        const top = st.pop().split("|");
        F(14, `→ 弹出 {"${top[0]}", ${top[1]}}，栈深 ${st.length}`, { arr: s, ptr: { i } });
        cur = top[0] + cur.repeat(Number(top[1]));
        F(17, `cur = "${top[0]}" + "${cur}" 展开 → "${cur}"`, { arr: s, ptr: { i } });
        return;
      }

      cur += c;
      F(18, `else cur += '${c}' → "${cur}"`, { arr: s, ptr: { i } });
    });

    F(20, `return "${cur}"`, { arr: s, vars: { 答案: cur } });
    return S;
  };

  /* ============ 160 相交链表：两个指针走完全程 ============ */
  window.DBG[160] = p => {
    const S = [];
    const A = ["4", "1", "8", "4", "5"];          // 链表 A
    const B = ["5", "6", "1", "8", "4", "5"];     // 链表 B
    const F = (l, n, extra) => S.push(Object.assign({ line: l, note: n }, extra || {}));

    let ai = 0, bi = 0;                            // a、b 在各自链上的下标
    const view = () => A.slice();                  // 可视化用 A 的节点序列
    const ptr = () => {
      const o = {};
      if (ai < A.length) o[ai] = "a";
      return o;
    };

    F(4, `a = headA（A[0] = ${A[0]}），b = headB（B[0] = ${B[0]}）`, {
      list: view(), listPtr: { 0: "a" }, listHi: [0],
      vars: { a: A[0], b: B[0], 链表A: A.join("→"), 链表B: B.join("→") }
    });

    for (let step = 0; step < 8; step++) {
      const av = ai < A.length ? A[ai] : "B头"; const bv = bi < B.length ? B[bi] : "A头";
      F(5, `while (a != b) → a=${av}, b=${bv}`, {
        list: view(), listPtr: ptr(),
        vars: { a: av, b: bv, a下标: ai, b下标: bi }
      });
      if (av === bv && av !== "B头" && av !== "A头") {
        F(9, `a == b → return a（交点 ${av}）`, { list: view(), listHi: [ai], vars: { 答案: av } });
        return S;
      }
      ai++; bi++;
      F(6, `a = a->next → ${ai < A.length ? A[ai] : "null，改走 B 的头"}`, {
        list: view(), listPtr: ai < A.length ? { [ai]: "a" } : {},
        vars: { a: ai < A.length ? A[ai] : "null", a下标: ai }
      });
      F(7, `b = b->next → ${bi < B.length ? B[bi] : "null，改走 A 的头"}`, {
        list: view(), listPtr: ai < A.length ? { [ai]: "a" } : {},
        vars: { a: ai < A.length ? A[ai] : "null", b: bi < B.length ? B[bi] : "null", b下标: bi }
      });
    }
    F(9, "两指针都走到 null → return null", { list: view(), vars: { 答案: "null" } });
    return S;
  };

  /* ============ 21 合并两个有序链表：逐个比较 ============ */
  window.DBG[21] = p => {
    const S = [];
    const A = ["1", "2", "4"], B = ["1", "3", "4"];
    const out = [];
    const F = (l, n, extra) => S.push(Object.assign({ line: l, note: n }, extra || {}));
    let i = 0, j = 0;

    F(4, `dummy, tail = &dummy　A = ${A.join("→")}，B = ${B.join("→")}`, {
      list: [], vars: { A: A.join("→"), B: B.join("→"), tail: "dummy" }
    });

    while (i < A.length && j < B.length) {
      F(5, `while (a && b) → a=${A[i]}, b=${B[j]}`, {
        list: out.slice(), vars: { a: A[i], b: B[j], i, j }
      });
      const takeA = A[i] <= B[j];
      F(6, `${A[i]} <= ${B[j]} ? ${takeA}`, { list: out.slice(), vars: { a: A[i], b: B[j] } });
      if (takeA) {
        out.push(A[i]); i++;
        F(6, `→ tail->next = ${A[i - 1]}，a 前移`, { list: out.slice(), listDone: out.map((_, k) => k), vars: { a: i < A.length ? A[i] : "null" } });
      } else {
        out.push(B[j]); j++;
        F(7, `→ tail->next = ${B[j - 1]}，b 前移`, { list: out.slice(), listDone: out.map((_, k) => k), vars: { b: j < B.length ? B[j] : "null" } });
      }
      F(8, `tail = tail->next（已接 ${out.length} 个）`, { list: out.slice(), listDone: out.map((_, k) => k) });
    }

    while (i < A.length) { out.push(A[i]); i++; F(10, `接上 A 剩下的 ${A[i - 1]}`, { list: out.slice() }); }
    while (j < B.length) { out.push(B[j]); j++; F(10, `接上 B 剩下的 ${B[j - 1]}`, { list: out.slice() }); }

    F(11, `return dummy.next → ${out.join("→")}`, {
      list: out.slice(), listDone: out.map((_, k) => k), vars: { 答案: out.join("→") }
    });
    return S;
  };
})();
