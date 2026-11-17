/* dbg5 — 二分 6 + 栈 5 + 堆 3 */
;(function () {
  const cp = window.DBG.cp;

  /* 通用二分：逐行 */
  function binary(p, cfg) {
    const S = [], a = p.viz.arr, tg = p.viz.target;
    const F = (l, note, s) => S.push(Object.assign({ line: l, note }, s || {}));
    let lo = 0, hi = cfg.hiOpen ? a.length : a.length - 1;
    F(cfg.lineInit || 4, `${cfg.hiOpen ? "hi = n（右开）" : "hi = n-1"}，lo = 0`, { arr: a, ptr: { lo, hi }, win: [lo, hi], vars: { target: tg } });
    let steps = 0;
    const cond = () => (cfg.mode === "min" || cfg.hiOpen) ? lo < hi : lo <= hi;
    while (cond()) {
      if (steps++ > 24) break;
      F(cfg.lineWhile || 5, `while (${lo} ${(cfg.mode === "min" || cfg.hiOpen) ? "<" : "<="} ${hi})`, { arr: a, ptr: { lo, hi }, win: [lo, hi] });
      const mid = (lo + hi) >> 1;
      F(cfg.lineMid || 6, `mid = (${lo} + ${hi}) / 2 = ${mid} → ${a[mid]}`, { arr: a, ptr: { lo, mid, hi }, hi: [mid], win: [lo, hi], vars: { mid } });
      if (cfg.mode === "lower") {
        F(7, `nums[${mid}] = ${a[mid]} < ${tg} ?`, { arr: a, ptr: { lo, mid, hi }, hi: [mid] });
        if (a[mid] < tg) { lo = mid + 1; F(7, `→ 太小，lo = ${lo}`, { arr: a, ptr: { lo, hi }, done: Array.from({ length: mid - (mid - 0) }, (_, k) => k).slice(0, mid), win: [lo, hi] }); }
        else { hi = mid; F(8, `→ 够大，hi = ${hi}`, { arr: a, ptr: { lo, hi }, win: [lo, hi] }); }
      } else if (cfg.mode === "find") {
        if (a[mid] === tg) { F(7, `nums[${mid}] == ${tg} → return ${mid}`, { arr: a, hi: [mid], vars: { 答案: mid } }); return S; }
        F(7, `nums[${mid}] = ${a[mid]} vs ${tg}`, { arr: a, ptr: { lo, mid, hi }, hi: [mid] });
        if (a[mid] < tg) { lo = mid + 1; F(8, `→ lo = ${lo}`, { arr: a, ptr: { lo, hi }, win: [lo, hi] }); }
        else { hi = mid - 1; F(9, `→ hi = ${hi}`, { arr: a, ptr: { lo, hi }, win: [lo, hi] }); }
      } else if (cfg.mode === "min") {
        F(6, `nums[${mid}] = ${a[mid]} < nums[${hi}] = ${a[hi]} ?`, { arr: a, ptr: { lo, mid, hi }, hi: [mid] });
        if (a[mid] < a[hi]) { hi = mid; F(6, `→ hi = ${hi}`, { arr: a, ptr: { lo, hi }, win: [lo, hi] }); }
        else { lo = mid + 1; F(7, `→ lo = ${lo}`, { arr: a, ptr: { lo, hi }, win: [lo, hi] }); }
      }
    }
    const ans = cfg.mode === "min" ? a[lo] : lo;
    F(cfg.lineRet || 9, `return ${ans}`, { arr: a, ptr: { lo }, vars: { 答案: ans } });
    return S;
  }

  window.DBG[35] = p => binary(p, { mode: "lower", hiOpen: true, lineInit: 4, lineWhile: 5, lineMid: 6, lineRet: 9 });
  window.DBG[34] = p => binary(p, { mode: "lower", hiOpen: true, lineInit: 4, lineWhile: 5, lineMid: 6, lineRet: 9 });
  window.DBG[153] = p => binary(p, { mode: "min", lineInit: 4, lineWhile: 5, lineRet: 8 });

  /* 74 搜索二维矩阵 */
  window.DBG[74] = p => {
    const S = [], g = p.viz.grid, tg = p.viz.target, m = g.length, n = g[0].length;
    const F = (l, note, s) => S.push(Object.assign({ line: l, note }, s || {}));
    let lo = 0, hi = m * n;
    F(4, `lo = 0, hi = ${hi}（虚拟一维）`, { grid: g, vars: { lo, hi, target: tg } });
    while (lo < hi) {
      F(5, `while (${lo} < ${hi})`, { grid: g, vars: { lo, hi } });
      const mid = (lo + hi) >> 1, r = Math.floor(mid / n), c = mid % n;
      F(6, `mid = ${mid} → (${r},${c}) = ${g[r][c]}`, { grid: g, gridHi: [r + "," + c], vars: { mid } });
      if (g[r][c] === tg) { F(7, `== ${tg} → return true`, { grid: g, gridHi: [r + "," + c], vars: { 答案: "true" } }); return S; }
      if (g[r][c] < tg) { lo = mid + 1; F(8, `${g[r][c]} < ${tg} → lo = ${lo}`, { grid: g, gridHi: [r + "," + c], vars: { lo, hi } }); }
      else { hi = mid; F(9, `${g[r][c]} > ${tg} → hi = ${hi}`, { grid: g, gridHi: [r + "," + c], vars: { lo, hi } }); }
    }
    F(10, "return false", { grid: g, vars: { 答案: "false" } });
    return S;
  };

  /* 33 搜索旋转排序数组 */
  window.DBG[33] = p => {
    const S = [], a = p.viz.arr, tg = p.viz.target;
    const F = (l, note, s) => S.push(Object.assign({ line: l, note }, s || {}));
    let lo = 0, hi = a.length - 1;
    F(4, `lo = 0, hi = ${hi}`, { arr: a, ptr: { lo, hi }, win: [lo, hi], vars: { target: tg } });
    while (lo <= hi) {
      F(5, `while (${lo} <= ${hi})`, { arr: a, ptr: { lo, hi }, win: [lo, hi] });
      const mid = (lo + hi) >> 1;
      F(6, `mid = ${mid}（${a[mid]}）`, { arr: a, ptr: { lo, mid, hi }, hi: [mid], win: [lo, hi] });
      if (a[mid] === tg) { F(7, `== ${tg} → return ${mid}`, { arr: a, hi: [mid], vars: { 答案: mid } }); return S; }
      const leftSorted = a[lo] <= a[mid];
      F(8, `nums[lo] <= nums[mid] ? ${leftSorted} → ${leftSorted ? "左半有序" : "右半有序"}`, { arr: a, ptr: { lo, mid, hi }, win: leftSorted ? [lo, mid] : [mid, hi] });
      if (leftSorted) {
        const inside = a[lo] <= tg && tg < a[mid];
        F(9, `target 在左半区间？${inside}`, { arr: a, win: [lo, mid], hi: [mid] });
        if (inside) { hi = mid - 1; F(10, `→ hi = ${hi}`, { arr: a, ptr: { lo, hi }, win: [lo, hi] }); }
        else { lo = mid + 1; F(11, `→ lo = ${lo}`, { arr: a, ptr: { lo, hi }, win: [lo, hi] }); }
      } else {
        const inside = a[mid] < tg && tg <= a[hi];
        F(12, `target 在右半区间？${inside}`, { arr: a, win: [mid, hi], hi: [mid] });
        if (inside) { lo = mid + 1; F(13, `→ lo = ${lo}`, { arr: a, ptr: { lo, hi }, win: [lo, hi] }); }
        else { hi = mid - 1; F(14, `→ hi = ${hi}`, { arr: a, ptr: { lo, hi }, win: [lo, hi] }); }
      }
    }
    F(17, "return -1", { arr: a, vars: { 答案: -1 } });
    return S;
  };

  /* 4 两个正序数组中位数 */
  window.DBG[4] = p => {
    const S = [], A = [1, 3], B = [2], F = (l, note, s) => S.push(Object.assign({ line: l, note }, s || {}));
    F(4, "保证 A 是短的那个", { arr: A, vars: { A: A.join(","), B: B.join(",") } });
    const m = A.length, n = B.length, half = (m + n + 1) >> 1;
    F(5, `m = ${m}, n = ${n}, half = ${half}`, { arr: A, vars: { half } });
    let lo = 0, hi = m;
    F(6, `lo = 0, hi = ${hi}`, { arr: A, vars: { lo, hi } });
    while (lo <= hi) {
      F(7, `while (${lo} <= ${hi})`, { arr: A, vars: { lo, hi } });
      const i = (lo + hi) >> 1, j = half - i;
      F(8, `i = ${i}, j = ${j}`, { arr: A, vars: { i, j } });
      const aL = i === 0 ? -Infinity : A[i - 1], aR = i === m ? Infinity : A[i];
      const bL = j === 0 ? -Infinity : B[j - 1], bR = j === n ? Infinity : B[j];
      F(9, `aL=${aL === -Infinity ? "-∞" : aL}, aR=${aR === Infinity ? "+∞" : aR}`, { arr: A, vars: { aL: String(aL), aR: String(aR) } });
      F(11, `bL = B[${j - 1}] = ${bL === -Infinity ? "-∞" : bL}`, { arr: A, vars: { bL: String(bL) } });
      F(12, `bR = B[${j}] = ${bR === Infinity ? "+∞" : bR}`, { arr: A, vars: { bL: String(bL), bR: String(bR) } });
      const ok = aL <= bR && bL <= aR;
      F(11, `aL <= bR && bL <= aR ? ${ok}`, { arr: A, vars: { ok } });
      if (ok) {
        const med = (m + n) % 2 ? Math.max(aL, bL) : (Math.max(aL, bL) + Math.min(aR, bR)) / 2;
        F(12, `中位数 = ${med}`, { arr: A, vars: { 答案: med } });
        return S;
      }
      if (aL > bR) { hi = i - 1; F(15, `aL > bR → hi = ${hi}`, { arr: A, vars: { lo, hi } }); }
      else { lo = i + 1; F(16, `→ lo = ${lo}`, { arr: A, vars: { lo, hi } }); }
    }
    return S;
  };

  /* 20 有效括号 */
  window.DBG[20] = p => {
    const S = [], s = p.viz.arr, F = (l, note, st) => S.push(Object.assign({ line: l, note }, st || {}));
    const st = [];
    s.forEach((c, i) => {
      F(4, `for：'${c}'`, { arr: s, ptr: { i }, stack: st.slice() });
      if (c === "(" || c === "[" || c === "{") {
        st.push(c);
        F(5, `push('${c}')`, { arr: s, ptr: { i }, hi: [i], stack: st.slice() });
      } else {
        F(6, `右括号 '${c}'：栈空？${st.length === 0}`, { arr: s, ptr: { i }, stack: st.slice() });
        if (!st.length) { F(7, "→ 栈空，return false", { arr: s, ptr: { i }, vars: { 答案: "false" } }); return; }
        const t = st[st.length - 1];
        const m = (c === ")" && t !== "(") || (c === "]" && t !== "[") || (c === "}" && t !== "{");
        F(7, `栈顶 '${t}' 与 '${c}' 匹配？${!m}`, { arr: s, ptr: { i }, stack: st.slice() });
        if (m) { F(7, "→ 不匹配，return false", { arr: s, ptr: { i }, vars: { 答案: "false" } }); return; }
        st.pop();
        F(8, `pop → 栈 [${st.join("")}]`, { arr: s, ptr: { i }, stack: st.slice() });
      }
    });
    const ans = st.length === 0;
    F(10, `return 栈空 ? ${ans}`, { arr: s, stack: st.slice(), vars: { 答案: String(ans) } });
    return S;
  };

  /* 155 最小栈 */
  window.DBG[155] = p => {
    const S = [], ops = p.viz.arr, F = (l, note, st) => S.push(Object.assign({ line: l, note }, st || {}));
    const data = [], mins = [];
    ops.forEach((op, i) => {
      if (op.indexOf("push") === 0) {
        const v = Number(op.slice(5, -1));
        F(5, `push(${v})`, { arr: ops, ptr: { i }, stack: data.slice(), vars: { 栈: data.join(",") || "空", 最小值: mins.length ? mins[mins.length - 1] : "?" } });
        data.push(v);
        F(6, `data.push(${v})`, { arr: ops, ptr: { i }, stack: data.slice(), vars: { 栈: data.join(",") } });
        const mn = mins.length ? Math.min(v, mins[mins.length - 1]) : v;
        mins.push(mn);
        F(7, `mins.push(min(${v}, …)) = ${mn}`, { arr: ops, ptr: { i }, map: { mins: mins.join(",") }, vars: { 栈: data.join(","), 最小值: mn } });
      } else if (op === "pop") {
        F(9, "pop()", { arr: ops, ptr: { i }, stack: data.slice(), vars: { 栈: data.join(",") } });
        data.pop(); mins.pop();
        F(9, "两个栈一起弹", { arr: ops, ptr: { i }, stack: data.slice(), map: { mins: mins.join(",") }, vars: { 栈: data.join(",") || "空", 最小值: mins.length ? mins[mins.length - 1] : "?" } });
      } else if (op === "getMin") {
        F(12, `getMin() → ${mins[mins.length - 1]}`, { arr: ops, ptr: { i }, map: { mins: mins.join(",") }, vars: { 返回: mins[mins.length - 1] } });
      }
    });
    return S;
  };

  /* 394 字符串解码 */
  window.DBG[394] = p => {
    const S = [], s = p.viz.arr, F = (l, note, st) => S.push(Object.assign({ line: l, note }, st || {}));
    const st = [];
    let cur = "", num = 0;
    s.forEach((c, i) => {
      F(4, `for：'${c}'`, { arr: s, ptr: { i }, stack: st.slice(), vars: { cur: `"${cur}"`, num } });
      const isNum = /^\d$/.test(c);
      F(4, `isdigit('${c}') ? ${isNum}`, { arr: s, ptr: { i }, stack: st.slice(), vars: { cur: `"${cur}"`, num } });
      if (isNum) {
        num = num * 10 + Number(c);
        F(5, `num = num*10 + ${c} = ${num}`, { arr: s, ptr: { i }, vars: { num } });
      } else {
        F(6, `c == '[' ? ${c === "["}`, { arr: s, ptr: { i }, stack: st.slice(), vars: { cur: `"${cur}"`, num } });
        if (c !== "[") F(9, `c == ']' ? ${c === "]"}`, { arr: s, ptr: { i }, stack: st.slice() });
      }
      if (!isNum && c === "[") {
        st.push(cur + "|" + num);
        F(7, `push({"${cur}", ${num}})` , { arr: s, ptr: { i }, stack: st.slice() });
        cur = ""; num = 0;
        F(8, "cur = \"\"，num = 0", { arr: s, ptr: { i }, stack: st.slice() });
      } else if (c === "]") {
        F(9, "遇到 ']' → 弹出栈顶", { arr: s, ptr: { i }, stack: st.slice() });
        const top = st.pop().split("|");
        cur = top[0] + cur.repeat(Number(top[1]));
        F(10, `cur = "${top[0]}" + "${cur}" 展开 → "${cur}"`, { arr: s, ptr: { i }, stack: st.slice(), vars: { cur: `"${cur}"` } });
      } else {
        cur += c;
        F(12, `cur += '${c}' → "${cur}"`, { arr: s, ptr: { i }, vars: { cur: `"${cur}"` } });
      }
    });
    F(14, `return "${cur}"`, { arr: s, vars: { 答案: cur } });
    return S;
  };

  /* 739 每日温度 */
  window.DBG[739] = p => {
    const S = [], t = p.viz.arr, F = (l, note, st) => S.push(Object.assign({ line: l, note }, st || {}));
    const res = new Array(t.length).fill(0), st = [];
    F(4, `res 全 0`, { bars: t, dp: res.slice() });
    F(4, "stack 空", { bars: t, stack: [] });
    t.forEach((x, i) => {
      F(5, `i = ${i}，T = ${x}`, { bars: t, ptr: { i }, hi: [i], stack: st.map(k => t[k]) });
      while (st.length && t[st[st.length - 1]] < x) {
        const j = st.pop();
        res[j] = i - j;
        F(6, `T[${j}]=${t[j]} < ${x} → 弹出，res[${j}] = ${i - j}`, { bars: t, hi: [i], done: [j], dp: res.slice(), stack: st.map(k => t[k]) });
      }
      F(6, "栈顶都更高，停止", { bars: t, ptr: { i }, stack: st.map(k => t[k]) });
      st.push(i);
      F(8, `push(${i})`, { bars: t, ptr: { i }, stack: st.map(k => t[k]), dp: res.slice() });
    });
    F(11, `return [${res}]`, { bars: t, dp: res.slice(), dpDone: res.map((_, i) => i), vars: { 答案: res.join(",") } });
    return S;
  };

  /* 84 柱状图最大矩形 */
  window.DBG[84] = p => {
    const S = [], h = p.viz.arr, F = (l, note, st) => S.push(Object.assign({ line: l, note }, st || {}));
    const hh = h.concat([0]), st = [];
    let best = 0;
    F(4, "末尾补 0 哨兵", { bars: h, vars: { best } });
    F(5, "stack 空", { bars: h, stack: [] });
    hh.forEach((x, i) => {
      F(6, `i = ${i}，h = ${x}`, { bars: h, ptr: { i }, stack: st.map(k => hh[k]), vars: { best } });
      while (st.length && hh[st[st.length - 1]] > x) {
        F(8, `while：栈顶高 ${hh[st[st.length - 1]]} > 当前 ${x} → 该结算了`, { bars: h, ptr: { i }, stack: st.map(k => hh[k]), vars: { best } });
        const height = hh[st.pop()];
        F(9, `height = ${height}（弹出栈顶）`, { bars: h, ptr: { i }, stack: st.map(k => hh[k]), vars: { height } });
        const left = st.length ? st[st.length - 1] : -1;
        F(10, `left = ${left === -1 ? "-1（栈空，左边界到 0）" : left}`, { bars: h, stack: st.map(k => hh[k]), vars: { height, left } });
        const area = height * (i - left - 1);
        best = Math.max(best, area);
        F(11, `面积 = ${height} × ${i - left - 1} = ${area}，best = ${best}`, { bars: h, hi: [left + 1], stack: st.map(k => hh[k]), vars: { best, area } });
      }
      st.push(i);
      F(10, `push(${i})`, { bars: h, ptr: { i }, stack: st.map(k => hh[k]), vars: { best } });
    });
    F(12, `return ${best}`, { bars: h, vars: { 答案: best } });
    return S;
  };

  /* 215 第 K 大 */
  window.DBG[215] = p => {
    const S = [], a = p.viz.arr, k = p.viz.target, F = (l, note, st) => S.push(Object.assign({ line: l, note }, st || {}));
    const heap = [];
    F(4, "小顶堆，size <= k", { arr: a, map: {}, vars: { k } });
    a.forEach((x, i) => {
      F(5, `push ${x}`, { arr: a, ptr: { i }, hi: [i], map: { 堆: heap.join(",") || "空" } });
      heap.push(x); heap.sort((u, v) => u - v);
      F(6, `入堆后 size = ${heap.length}`, { arr: a, ptr: { i }, map: { 堆: heap.join(",") } });
      if (heap.length > k) {
        const pop = heap.shift();
        F(7, `size > ${k} → 弹出最小 ${pop}`, { arr: a, ptr: { i }, map: { 堆: heap.join(",") } });
      }
    });
    F(9, `return ${heap[0]}`, { arr: a, map: { 堆: heap.join(",") }, vars: { 答案: heap[0] } });
    return S;
  };

  /* 347 前 K 个高频 */
  window.DBG[347] = p => {
    const S = [], a = p.viz.arr, k = p.viz.target, F = (l, note, st) => S.push(Object.assign({ line: l, note }, st || {}));
    const cnt = {};
    F(4, "cnt = {}", { arr: a, map: {} });
    a.forEach((x, i) => {
      cnt[x] = (cnt[x] || 0) + 1;
      F(5, `++cnt[${x}] = ${cnt[x]}`, { arr: a, ptr: { i }, hi: [i], map: cp(cnt) });
    });
    const n = a.length, buckets = Array.from({ length: n + 1 }, () => []);
    F(6, `buckets[${n + 1}]`, { arr: a, map: cp(cnt) });
    Object.keys(cnt).forEach(v => {
      buckets[cnt[v]].push(v);
      F(7, `buckets[${cnt[v]}].push(${v})`, { arr: a, map: cp(cnt), mapHi: [String(v)] });
    });
    const res = [];
    F(8, "res = []", { arr: a, map: cp(cnt) });
    for (let f = n; f >= 1 && res.length < k; f--) {
      buckets[f].forEach(v => {
        if (res.length < k) {
          res.push(v);
          F(9, `f = ${f} → res.push(${v})`, { arr: a, map: cp(cnt), vars: { v: Number(v), f, res: res.join(",") } });
        }
      });
    }
    F(11, `return {${res.join(",")}}`, { arr: a, vars: { 答案: res.join(",") } });
    return S;
  };

  /* 295 数据流中位数 */
  window.DBG[295] = p => {
    const S = [], ops = p.viz.arr, F = (l, note, st) => S.push(Object.assign({ line: l, note }, st || {}));
    const small = [], large = [];
    const sortS = () => small.sort((x, y) => y - x), sortL = () => large.sort((x, y) => x - y);
    ops.forEach((op, i) => {
      if (op.indexOf("add") === 0) {
        const v = Number(op.slice(4));
        F(6, `addNum(${v}) → small.push`, { arr: ops, ptr: { i }, map: { small: small.join(",") || "空", large: large.join(",") || "空" }, vars: { num: v, small: "[" + small.join(",") + "]", large: "[" + large.join(",") + "]" } });
        small.push(v); sortS();
        F(7, `把 small 顶弹给 large`, { arr: ops, ptr: { i }, map: { small: small.join(","), large: large.join(",") }, vars: { small: "[" + small.join(",") + "]", large: "[" + large.join(",") + "]" } });
        large.push(small.shift()); sortL();
        if (large.length > small.length) { small.push(large.shift()); sortS(); }
        F(8, `平衡：small=${small.join(",")}，large=${large.join(",")}`, { arr: ops, ptr: { i }, map: { small: small.join(","), large: large.join(",") }, vars: { small: "[" + small.join(",") + "]", large: "[" + large.join(",") + "]", 中位数: small.length > large.length ? small[0] : ((small[0] + large[0]) / 2) } });
      } else {
        const med = small.length > large.length ? small[0] : (small[0] + large[0]) / 2;
        F(11, `findMedian() → ${med}`, { arr: ops, ptr: { i }, map: { small: small.join(","), large: large.join(",") }, vars: { small: "[" + small.join(",") + "]", large: "[" + large.join(",") + "]", 中位数: med, 答案: med } });
      }
    });
    return S;
  };
})();
