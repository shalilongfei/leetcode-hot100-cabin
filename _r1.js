/* step1 — 逐帧独立实现：1~5 题
   每帧输出 {line, vars}，和 window.TRACE.build(p) 的帧序列逐帧对比全部变量。
   帧点（line 序列）必须完全一致，否则直接判"结构不符"。 */
;(function () {
  const R = window.REPLAY = window.REPLAY || {};
  const NUM = v => (v === undefined || v === null ? null : (typeof v === "number" ? v : (/^-?\d+(\.\d+)?$/.test(String(v)) ? Number(v) : null)));

  /* 1 两数之和 */
  R[1] = p => {
    const a = p.viz.arr.map(Number), target = Number(p.viz.target), S = [];
    const seen = {}; let i = 0;
    const push = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    push(4, { i, target });
    for (i = 0; i < a.length; i++) {
      push(5, { i, target });
      const need = target - a[i];
      push(6, { i, target, need });
      const hit = seen[need] !== undefined;
      push(7, { i, target, need });
      if (hit) { push(8, { i, target, need, 答案: "[" + seen[need] + ", " + i + "]" }); return S; }
      seen[a[i]] = i;
      push(9, { i, target, need });
    }
    return S;
  };

  /* 149 字母异位词分组 */
  R[49] = p => {
    const strs = p.viz.arr, S = [];
    const push = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    const groups = {}; let key = "";
    push(4, {});
    for (const s of strs) {
      push(5, {});
      key = s;
      push(6, { key });
      key = s.split("").sort().join("");
      push(7, { key });
      (groups[key] = groups[key] || []).push(s);
      push(8, { key });
    }
    push(10, { key });
    const res = Object.values(groups).flat();
    push(11, { key });
    push(12, { key, 答案: Object.keys(groups).length + " 组" });
    return S;
  };

  /* 128 最长连续序列 */
  R[128] = p => {
    const nums = p.viz.arr.map(Number), S = [];
    const push = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    const set = new Set(nums); let best = 0;
    push(4, { best, 集合大小: set.size });
    push(5, { best, 集合大小: set.size });
    for (const x of nums) {
      if (!set.has(x)) continue;
      push(6, { best, 集合大小: set.size, x });
      if (set.has(x - 1)) { push(7, { best, 集合大小: set.size, x }); continue; }
      push(7, { best, 集合大小: set.size, x });
      let y = x;
      push(8, { best, 集合大小: set.size, x, y });
      while (set.has(y + 1)) { y++; push(9, { best, 集合大小: set.size, x, y }); }
      push(9, { best, 集合大小: set.size, x, y });
      best = Math.max(best, y - x + 1);
      push(10, { best, 集合大小: set.size, x, y });
    }
    push(12, { best, 集合大小: set.size, 答案: best });
    return S;
  };

  /* 283 移动零 */
  R[283] = p => {
    const a = p.viz.arr.map(Number).slice(), S = [];
    const push = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    let w = 0, r = 0;
    push(4, { w, r });
    for (r = 0; r < a.length; r++) {
      push(5, { w, r });
      push(6, { w, r });
      if (a[r] !== 0) {
        const t = a[w]; a[w] = a[r]; a[r] = t; w++;
        push(6, { w, r });
      }
    }
    push(6, { w, r, 答案: "非零都在前面：" + a.join(",") });
    return S;
  };

  /* 11 盛最多水的容器 */
  R[11] = p => {
    const h = p.viz.arr.map(Number), S = [];
    const push = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    let l = 0, r = h.length - 1, best = 0;
    push(4, { l, r, best });
    while (l < r) {
      push(5, { l, r, best });
      const area = Math.min(h[l], h[r]) * (r - l);
      push(6, { l, r, best });
      best = Math.max(best, area);
      push(6, { l, r, best });
      push(7, { l, r, best });
      if (h[l] < h[r]) { l++; push(7, { l, r, best }); }
      else { r--; push(8, { l, r, best }); }
    }
    push(10, { l, r, best, 答案: best });
    return S;
  };
})();
