/* dbg1 — 哈希(3) / 双指针(4) / 滑动窗口(2) / 子串(3) / 普通数组(5) / 矩阵(4)
   逐行调试：行号严格对应 js/data/cpp1.js 的 C++ 模板 */
;(function () {
  const cp = window.DBG.cp;

  /* ---------------- 1 两数之和 ---------------- */
  window.DBG[1] = p => {
    const S = [], a = p.viz.arr, tg = p.viz.target, seen = {};
    const F = (l, n, s) => S.push(Object.assign({ line: l, note: n }, s || {}));
    F(4, "seen = {}，空的哈希表", { arr: a, map: {}, vars: { target: tg } });
    for (let i = 0; i < a.length; i++) {
      F(5, `i = ${i}，nums[${i}] = ${a[i]}`, { arr: a, ptr: { i }, map: cp(seen) });
      const need = tg - a[i];
      F(6, `need = ${tg} - ${a[i]} = ${need}`, { arr: a, ptr: { i }, hi: [i], map: cp(seen), vars: { need } });
      if (seen[need] !== undefined) {
        F(7, `seen.find(${need}) 命中，下标 ${seen[need]}`, { arr: a, ptr: { i }, hi: [i], map: cp(seen), mapHi: [String(need)] });
        F(8, `return {${seen[need]}, ${i}}`, { arr: a, hi: [seen[need], i], map: cp(seen), vars: { 答案: `[${seen[need]}, ${i}]` } });
        return S;
      }
      F(7, `seen.find(${need}) 未命中`, { arr: a, ptr: { i }, hi: [i], map: cp(seen) });
      seen[a[i]] = i;
      F(9, `seen[${a[i]}] = ${i}`, { arr: a, ptr: { i }, hi: [i], done: [i], map: cp(seen) });
    }
    F(11, "循环结束，没找到 → return {}", { arr: a, vars: { 答案: "[]" } });
    return S;
  };

  /* ---------------- 49 字母异位词分组 ---------------- */
  window.DBG[49] = p => {
    const S = [], a = p.viz.arr, groups = {};
    const F = (l, n, s) => S.push(Object.assign({ line: l, note: n }, s || {}));
    F(4, "groups = {}，指纹 → 单词列表", { arr: a, map: {} });
    a.forEach((s, idx) => {
      F(5, `取出 strs[${idx}] = "${s}"`, { arr: a, ptr: { idx }, hi: [idx], map: cp(groups) });
      F(6, `key = "${s}"`, { arr: a, ptr: { idx }, hi: [idx], map: cp(groups), vars: { key: s } });
      const key = s.split("").sort().join("");
      F(7, `sort(key) → "${key}"`, { arr: a, ptr: { idx }, hi: [idx], map: cp(groups), vars: { key } });
      (groups[key] = groups[key] || []).push(s);
      F(8, `groups["${key}"].push_back("${s}")`, { arr: a, ptr: { idx }, hi: [idx], map: cp(groups), mapHi: [key] });
    });
    F(10, "res 准备装 groups 的所有 value", { arr: a, map: cp(groups), done: a.map((_, i) => i) });
    F(11, `遍历 groups，压入 ${Object.keys(groups).length} 个分组`, { arr: a, map: cp(groups) });
    F(12, `return res（${Object.keys(groups).length} 组）`, { arr: a, map: cp(groups), vars: { 答案: Object.keys(groups).length + " 组" } });
    return S;
  };

  /* ---------------- 128 最长连续序列 ---------------- */
  window.DBG[128] = p => {
    const S = [], a = p.viz.arr, st = new Set(a);
    const F = (l, n, s) => S.push(Object.assign({ line: l, note: n }, s || {}));
    const mapOf = () => Object.fromEntries([...st].map(v => [v, "∈"]));
    F(4, `unordered_set 装入 ${a.length} 个元素`, { arr: a, map: mapOf(), vars: { 集合大小: st.size } });
    F(5, "best = 0", { arr: a, map: mapOf(), vars: { best: 0 } });
    let best = 0;
    a.forEach((x, i) => {
      F(6, `x = nums[${i}] = ${x}`, { arr: a, ptr: { i }, hi: [i], map: mapOf(), vars: { best, x } });
      F(7, `s.count(${x - 1}) = ${st.has(x - 1) ? 1 : 0}` +
        (st.has(x - 1) ? " → 不是起点，continue" : " → 是起点"), { arr: a, ptr: { i }, hi: [i], map: mapOf(), vars: { best, x } });
      if (st.has(x - 1)) return;
      let y = x;
      F(8, `y = ${y}`, { arr: a, ptr: { i }, hi: [i], map: mapOf(), vars: { best, y } });
      while (st.has(y + 1)) {
        y++;
        F(9, `s.count(${y}) = 1 → ++y = ${y}`, { arr: a, ptr: { i }, hi: [i], map: mapOf(), vars: { best, y } });
      }
      F(9, `s.count(${y + 1}) = 0，序列止于 ${y}`, { arr: a, ptr: { i }, hi: [i], map: mapOf(), vars: { best, y } });
      best = Math.max(best, y - x + 1);
      F(10, `best = max(${best}, ${y} - ${x} + 1) = ${Math.max(best, y - x + 1)}`, { arr: a, ptr: { i }, hi: [i], map: mapOf(), vars: { best, x } });
    });
    F(12, `return ${best}`, { arr: a, map: mapOf(), vars: { 答案: best } });
    return S;
  };

  /* ---------------- 283 移动零 ---------------- */
  window.DBG[283] = p => {
    const S = [], a = p.viz.arr.slice();
    const F = (l, n, s) => S.push(Object.assign({ line: l, note: n }, s || {}));
    F(4, "w = 0（下一个非零的落点）", { arr: a.slice(), ptr: { w: 0 }, vars: { w: 0 } });
    let w = 0;
    for (let r = 0; r < a.length; r++) {
      F(5, `r = ${r}`, { arr: a.slice(), ptr: { w, r }, vars: { w, r } });
      F(6, `nums[${r}] = ${a[r]}` + (a[r] !== 0 ? " ≠ 0 → swap" : " = 0 → 跳过"), { arr: a.slice(), ptr: { w, r }, hi: [r], vars: { w, r } });
      if (a[r] !== 0) {
        const t = a[w]; a[w] = a[r]; a[r] = t;
        F(6, `swap(nums[${w}], nums[${r}]) → w = ${w + 1}`, { arr: a.slice(), ptr: { w: w + 1, r }, hi: [w, r], vars: { w: w + 1, r } });
        w++;
      }
    }
    F(7, "循环结束：非零都在前面", { arr: a.slice(), done: a.map((_, i) => i), vars: { w, r: a.length, 答案: "非零都在前面：" + a.join(",") } });
    return S;
  };

  /* ---------------- 11 盛最多水的容器 ---------------- */
  window.DBG[11] = p => {
    const S = [], h = p.viz.arr;
    const F = (l, n, s) => S.push(Object.assign({ line: l, note: n }, s || {}));
    let l = 0, r = h.length - 1, best = 0;
    F(4, `l = 0, r = ${r}, best = 0`, { bars: h, ptr: { l, r }, vars: { best } });
    while (l < r) {
      F(5, `while (${l} < ${r})`, { bars: h, ptr: { l, r }, vars: { best } });
      const area = Math.min(h[l], h[r]) * (r - l);
      F(6, `area = min(${h[l]}, ${h[r]}) × ${r - l} = ${area}`, { bars: h, ptr: { l, r }, hi: [h[l] < h[r] ? l : r], vars: { area, best } });
      if (area > best) best = area;
      F(6, `best = max(best, ${area}) = ${best}`, { bars: h, ptr: { l, r }, vars: { area, best } });
      F(7, `height[${l}] = ${h[l]} vs height[${r}] = ${h[r]}`, { bars: h, ptr: { l, r } });
      if (h[l] < h[r]) { l++; F(7, `→ 左边更矮，++l = ${l}`, { bars: h, ptr: { l, r }, done: [l - 1], vars: { best } }); }
      else { r--; F(8, `→ 右边更矮，--r = ${r}`, { bars: h, ptr: { l, r }, done: [r + 1], vars: { best } }); }
    }
    F(10, `return ${best}`, { bars: h, vars: { 答案: best } });
    return S;
  };

  /* ---------------- 15 三数之和 ---------------- */
  window.DBG[15] = p => {
    const S = [], nums = p.viz.arr.slice().sort((x, y) => x - y), res = [];
    const F = (l, n, s) => S.push(Object.assign({ line: l, note: n }, s || {}));
  F(4, "sort(nums)", { arr: nums, vars: { 结果数: 0 } });
    F(5, "res = []", { arr: nums });
    const n = nums.length;
    F(6, `n = ${n}`, { arr: nums, vars: { n } });
    for (let i = 0; i < n - 2; i++) {
      F(7, `i = ${i}`, { arr: nums, ptr: { i }, vars: { n } });
      F(8, `nums[${i}] = ${nums[i]} > 0 ?`, { arr: nums, ptr: { i }, hi: [i], vars: { 结果数: res.length } });
      if (nums[i] > 0) { F(8, "→ break", { arr: nums, ptr: { i } }); break; }
      F(9, `i > 0 && nums[${i}] == nums[${i - 1}] ?`, { arr: nums, ptr: { i }, hi: [i] });
      if (i > 0 && nums[i] === nums[i - 1]) { F(9, "→ 重复，continue", { arr: nums, ptr: { i }, hi: [i], done: [i] }); continue; }
      let l = i + 1, r = n - 1;
      F(10, `l = ${l}, r = ${r}`, { arr: nums, ptr: { i, l, r } });
      while (l < r) {
        F(11, `while (${l} < ${r})`, { arr: nums, ptr: { i, l, r } });
        const s = nums[i] + nums[l] + nums[r];
        F(12, `s = ${nums[i]} + ${nums[l]} + ${nums[r]} = ${s}`, { arr: nums, ptr: { i, l, r }, hi: [i, l, r], vars: { s } });
        if (s < 0) { l++; F(13, `s < 0 → ++l = ${l}`, { arr: nums, ptr: { i, l, r } }); }
        else if (s > 0) { r--; F(14, `s > 0 → --r = ${r}`, { arr: nums, ptr: { i, l, r } }); }
        else {
          F(15, "else：命中", { arr: nums, ptr: { i, l, r }, hi: [i, l, r] });
          res.push([nums[i], nums[l], nums[r]]);
          F(16, `res.push({${nums[i]}, ${nums[l]}, ${nums[r]}}) → ${res.length} 组`, { arr: nums, ptr: { i, l, r }, hi: [i, l, r], vars: { i, n, 结果数: res.length, l, r, 结果: res.map(x => "[" + x + "]").join(" ") } });
          while (l < r && nums[l] === nums[l + 1]) { l++; F(17, `跳过重复的 l → ${l}`, { arr: nums, ptr: { i, l, r } }); }
          while (l < r && nums[r] === nums[r - 1]) { r--; F(18, `跳过重复的 r → ${r}`, { arr: nums, ptr: { i, l, r } }); }
          l++; r--;
          F(19, `++l, --r → l=${l}, r=${r}`, { arr: nums, ptr: { i, l, r } });
        }
      }
    }
  F(23, `return res（${res.length} 组）`, { arr: nums, vars: { n, 结果数: res.length, 结果: res.map(x => "[" + x + "]").join(" "), 答案: res.map(x => "[" + x + "]").join(" ") } });
    return S;
  };

  /* ---------------- 42 接雨水 ---------------- */
  window.DBG[42] = p => {
    const S = [], h = p.viz.arr;
    const F = (l, n, s) => S.push(Object.assign({ line: l, note: n }, s || {}));
    let l = 0, r = h.length - 1, lmax = 0, rmax = 0, ans = 0;
    F(4, `l = 0, r = ${r}`, { bars: h, ptr: { l, r }, vars: { lmax, rmax, ans } });
    F(5, "lmax = rmax = ans = 0", { bars: h, ptr: { l, r }, vars: { lmax, rmax, ans } });
    while (l < r) {
      F(6, `while (${l} < ${r})`, { bars: h, ptr: { l, r }, vars: { lmax, rmax, ans } });
      F(7, `height[${l}]=${h[l]} < height[${r}]=${h[r]} ?`, { bars: h, ptr: { l, r } });
      if (h[l] < h[r]) {
        lmax = Math.max(lmax, h[l]);
        F(8, `lmax = max(${lmax === h[l] ? h[l] : lmax}, ${h[l]}) = ${lmax}`, { bars: h, ptr: { l, r }, hi: [l], vars: { lmax, rmax, ans } });
        ans += lmax - h[l];
        F(9, `ans += ${lmax - h[l]} → ${ans} ← 左`, { bars: h, ptr: { l, r }, hi: [l], vars: { lmax, rmax, ans } });
        l++;
        F(10, `++l = ${l}`, { bars: h, ptr: { l, r }, done: [l - 1], vars: { lmax, rmax, ans } });
      } else {
        rmax = Math.max(rmax, h[r]);
        F(12, `rmax = max(…, ${h[r]}) = ${rmax}`, { bars: h, ptr: { l, r }, hi: [r], vars: { lmax, rmax, ans } });
        ans += rmax - h[r];
        F(13, `ans += ${rmax - h[r]} → ${ans} ← 右`, { bars: h, ptr: { l, r }, hi: [r], vars: { lmax, rmax, ans } });
        r--;
        F(14, `--r = ${r}`, { bars: h, ptr: { l, r }, done: [r + 1], vars: { lmax, rmax, ans } });
      }
    }
    F(17, `return ${ans}`, { bars: h, vars: { 答案: ans } });
    return S;
  };

  /* ---------------- 3 无重复字符的最长子串 ---------------- */
  window.DBG[3] = p => {
    const S = [], s = p.viz.arr, last = {};
    const F = (l, n, st) => S.push(Object.assign({ line: l, note: n }, st || {}));
    const los = () => Object.fromEntries(Object.entries(last).map(([k, v]) => [k, v]));
    F(4, "last[128] = -1", { arr: s, map: {} });
    let l = 0, ans = 0;
    F(5, "l = 0, ans = 0", { arr: s, ptr: { l: 0 }, win: [0, 0], vars: { l, ans } });
    for (let r = 0; r < s.length; r++) {
      F(6, `r = ${r}（字符 '${s[r]}'）`, { arr: s, ptr: { l, r }, win: [l, r], map: los(), vars: { r, l, ans } });
      const ch = s[r], old = last[ch];
      F(7, `last['${ch}'] = ${old === undefined ? -1 : old} vs l = ${l}`, { arr: s, ptr: { l, r }, hi: [r], win: [l, r], map: los() });
      if (old !== undefined && old >= l) {
        l = old + 1;
        F(7, `→ 在窗口内，l = ${old} + 1 = ${l}`, { arr: s, ptr: { l, r }, win: [l, r], map: los(), vars: { l } });
      }
      last[ch] = r;
      F(8, `last['${ch}'] = ${r}`, { arr: s, ptr: { l, r }, win: [l, r], map: los(), vars: { l } });
      ans = Math.max(ans, r - l + 1);
      F(9, `ans = max(${ans}, ${r} - ${l} + 1) = ${ans}`, { arr: s, ptr: { l, r }, win: [l, r], map: los(), vars: { l, ans } });
    }
    F(11, `return ${ans}`, { arr: s, win: [l, l + ans - 1], vars: { l, ans, r: s.length, 答案: ans } });
    return S;
  };

  /* ---------------- 438 找到字符串中所有字母异位词 ---------------- */
  window.DBG[438] = p => {
    const S = [], s = p.viz.arr, ps = p.viz.target, m = ps.length, res = [];
    const F = (l, n, st) => S.push(Object.assign({ line: l, note: n }, st || {}));
    const cnt = {}; for (const c of ps) cnt[c] = (cnt[c] || 0) + 1;
    F(4, "res = []", { arr: s, win: [0, m - 1] });
    F(5, `n = ${s.length}, m = ${m}`, { arr: s, vars: { n: s.length, m } });
    F(6, `m > n ? ${m > s.length}` , { arr: s });
    F(7, "need[26], win[26] 清零", { arr: s, map: cp(cnt) });
    F(8, `统计 p = "${ps}" 的字符频次`, { arr: s, map: cp(cnt) });
    const win = {};
    for (let i = 0; i < s.length; i++) {
      F(9, `i = ${i}（'${s[i]}'）`, { arr: s, ptr: { i }, win: [Math.max(0, i - m + 1), i], map: cp(win) });
      win[s[i]] = (win[s[i]] || 0) + 1;
      F(10, `++win['${s[i]}'] = ${win[s[i]]}`, { arr: s, ptr: { i }, win: [Math.max(0, i - m + 1), i], map: cp(win) });
      if (i >= m) {
        win[s[i - m]]--;
        F(11, `i >= m → --win['${s[i - m]}'] = ${win[s[i - m]]}`, { arr: s, ptr: { i }, win: [i - m + 1, i], map: cp(win) });
      }
      const sig = o => Object.keys(o).filter(k => o[k] > 0).sort().map(k => k + ":" + o[k]).join(",");
      const eq = sig(win) === sig(cnt);
      if (eq) res.push(i - m + 1);
      F(12, `win == need ? ${eq}` + (eq ? ` → push(${i - m + 1})` : ""), {
        arr: s, ptr: { i }, win: [Math.max(0, i - m + 1), i], map: cp(win), vars: { c: `'${s[i]}'`, 命中: res.length }
      });
    }
    F(14, `return {${res.join(",")}}`, { arr: s, vars: { 答案: "[" + res.join(",") + "]" } });
    return S;
  };

  /* ---------------- 560 和为 K 的子数组 ---------------- */
  window.DBG[560] = p => {
    const S = [], a = p.viz.arr, k = p.viz.target, cnt = { 0: 1 };
    const F = (l, n, st) => S.push(Object.assign({ line: l, note: n }, st || {}));
    F(4, "cnt = {0: 1}（空前缀）", { arr: a, map: cp(cnt) });
    let pre = 0, ans = 0;
    F(5, "pre = 0, ans = 0", { arr: a, map: cp(cnt), vars: { pre, ans, k } });
    a.forEach((x, i) => {
      F(6, `x = nums[${i}] = ${x}`, { arr: a, ptr: { i }, hi: [i], map: cp(cnt), vars: { pre, ans } });
      pre += x;
      F(7, `pre += ${x} → ${pre}`, { arr: a, ptr: { i }, hi: [i], map: cp(cnt), vars: { pre, ans } });
      const need = pre - k;
      F(8, `find(${pre} - ${k}) = find(${need})`, { arr: a, ptr: { i }, map: cp(cnt), vars: { pre, ans, need } });
      const add = cnt[need] || 0;
      if (add) ans += add;
      F(9, `ans += ${add} → ${ans}`, { arr: a, ptr: { i }, map: cp(cnt), mapHi: [String(need)], vars: { pre, ans } });
      cnt[pre] = (cnt[pre] || 0) + 1;
      F(10, `++cnt[${pre}] = ${cnt[pre]}`, { arr: a, ptr: { i }, map: cp(cnt), vars: { pre, ans } });
    });
    F(12, `return ${ans}`, { arr: a, vars: { 答案: ans } });
    return S;
  };

  /* ---------------- 239 滑动窗口最大值 ---------------- */
  window.DBG[239] = p => {
    const S = [], a = p.viz.arr, k = p.viz.win || 3, dq = [], res = [];
    const F = (l, n, st) => S.push(Object.assign({ line: l, note: n }, st || {}));
    F(4, "deque 空，存下标", { arr: a, map: {} });
    F(5, "res = []", { arr: a });
    for (let i = 0; i < a.length; i++) {
      F(6, `i = ${i}（${a[i]}）`, { arr: a, ptr: { i }, win: [Math.max(0, i - k + 1), i], map: Object.fromEntries(dq.map(d => [d, a[d]])) });
      while (dq.length && a[dq[dq.length - 1]] <= a[i]) {
        const pop = dq.pop();
        F(7, `队尾 ${pop}（${a[pop]}）<= ${a[i]} → pop_back`, { arr: a, ptr: { i }, hi: [pop], map: Object.fromEntries(dq.map(d => [d, a[d]])) });
      }
      F(7, "队尾都比当前大，停止弹出", { arr: a, ptr: { i }, map: Object.fromEntries(dq.map(d => [d, a[d]])) });
      dq.push(i);
      F(8, `push_back(${i}) → [${dq.join(",")}]`, { arr: a, ptr: { i }, hi: dq.slice(), map: Object.fromEntries(dq.map(d => [d, a[d]])) });
      if (dq[0] <= i - k) {
        const out = dq.shift();
        F(9, `队首 ${out} 过期 → pop_front`, { arr: a, ptr: { i }, hi: dq.slice(), map: Object.fromEntries(dq.map(d => [d, a[d]])) });
      }
      F(9, `front = ${dq[0]} > ${i - k}，还在窗口内`, { arr: a, ptr: { i }, hi: dq.slice(), map: Object.fromEntries(dq.map(d => [d, a[d]])) });
      if (i >= k - 1) {
        res.push(a[dq[0]]);
        F(10, `i >= k-1 → res.push(${a[dq[0]]})`, { arr: a, ptr: { i }, hi: [dq[0]], win: [i - k + 1, i], vars: { 结果: "[" + res.join(",") + "]" } });
      }
    }
    F(12, `return {${res.join(",")}}`, { arr: a, vars: { 答案: "[" + res.join(",") + "]" } });
    return S;
  };

  /* ---------------- 76 最小覆盖子串 ---------------- */
  window.DBG[76] = p => {
    const S = [], s = p.viz.arr, t = p.viz.target;
    const F = (l, n, st) => S.push(Object.assign({ line: l, note: n }, st || {}));
    const need = {}; for (const c of t) need[c] = (need[c] || 0) + 1;
    const kinds = Object.keys(need).length;
    F(4, "need[128], win[128] 清零", { arr: s, map: cp(need) });
    F(5, "kinds = 0", { arr: s, map: cp(need) });
    F(6, `统计 t = "${t}" → ${kinds} 种字符`, { arr: s, map: cp(need), vars: { kinds } });
    const win = {};
    let valid = 0, l = 0, start = 0, len = Infinity;
    F(7, "valid = 0, l = 0, len = INT_MAX", { arr: s, map: cp(win), vars: { valid, l, len: "∞" } });
    for (let r = 0; r < s.length; r++) {
      F(8, `r = ${r}（'${s[r]}'）`, { arr: s, ptr: { l, r }, win: [l, r], map: cp(win), vars: { valid, l } });
      const c = s[r];
      F(9, `c = '${c}'`, { arr: s, ptr: { l, r }, win: [l, r], map: cp(win) });
      if (need[c]) {
        win[c] = (win[c] || 0) + 1;
        if (win[c] === need[c]) valid++;
        F(10, `++win['${c}'] = ${win[c]}` + (win[c] === need[c] ? "，达标 → ++valid" : ""), { arr: s, ptr: { l, r }, win: [l, r], map: cp(win), vars: { valid } });
      }
      while (valid === kinds) {
        F(11, `while (valid == ${kinds})`, { arr: s, ptr: { l, r }, win: [l, r], map: cp(win), vars: { valid } });
        if (r - l + 1 < len) { len = r - l + 1; start = l; }
        F(12, `len = min(len, ${r - l + 1}) = ${len}，start = ${start}`, { arr: s, ptr: { l, r }, win: [l, r], map: cp(win), vars: { len, start } });
        const left = s[l];
        F(13, `left = '${left}'`, { arr: s, ptr: { l, r }, win: [l, r], map: cp(win) });
        if (need[left]) {
          if (win[left] === need[left]) valid--;
          win[left]--;
          F(14, `--win['${left}'] = ${win[left]}` + (win[left] < need[left] ? "，破标 → --valid" : ""), { arr: s, ptr: { l, r }, win: [l, r], map: cp(win), vars: { valid } });
        }
        l++;
        F(15, `++l = ${l}`, { arr: s, ptr: { l, r }, win: [l, r], map: cp(win), vars: { valid } });
      }
    }
    F(18, len === Infinity ? "return \"\"" : `return "${s.slice(start, start + len).join("")}"`, {
      arr: s, win: len === Infinity ? [0, 0] : [start, start + len - 1], vars: { 答案: len === Infinity ? '""' : s.slice(start, start + len).join("") }
    });
    return S;
  };

  /* ---------------- 53 最大子数组和 ---------------- */
  window.DBG[53] = p => {
    const S = [], a = p.viz.arr;
    const F = (l, n, st) => S.push(Object.assign({ line: l, note: n }, st || {}));
    let cur = a[0], best = a[0];
    F(4, `cur = best = nums[0] = ${a[0]}`, { arr: a, hi: [0], vars: { cur, best } });
    for (let i = 1; i < a.length; i++) {
      F(5, `i = ${i}`, { arr: a, ptr: { i }, vars: { cur, best } });
      const ext = cur + a[i], re = a[i];
      F(6, `max(${a[i]}, ${cur} + ${a[i]}) = max(${re}, ${ext})`, { arr: a, ptr: { i }, hi: [i], vars: { cur, best, 候选: `${re} / ${ext}` } });
      cur = Math.max(re, ext);
      F(6, `→ cur = ${cur}`, { arr: a, ptr: { i }, hi: [i], vars: { cur, best } });
      best = Math.max(best, cur);
      F(7, `best = max(best, cur) = ${best}`, { arr: a, ptr: { i }, done: [i], vars: { cur, best } });
    }
  F(9, `return ${best}`, { arr: a, vars: { i: a.length, cur, best, 答案: best } });
    return S;
  };

  /* ---------------- 56 合并区间 ---------------- */
  window.DBG[56] = p => {
    const S = [], arr = p.viz.arr, iv = [[1, 3], [2, 6], [8, 10], [15, 18]], res = [];
    const F = (l, n, st) => S.push(Object.assign({ line: l, note: n }, st || {}));
    F(4, "sort(intervals) 按左端点排序", { arr: iv.map(v => "[" + v + "]") });
    F(5, "res = []", { arr: iv.map(v => "[" + v + "]") });
    iv.forEach((v, i) => {
      F(6, `取出 [${v}]`, { arr: iv.map(x => "[" + x + "]"), ptr: { i }, hi: [i], vars: { v: "[" + v + "]" } });
      const merged = res.length && res[res.length - 1][1] >= v[0];
      F(7, `res 非空 && res.back()[1] >= ${v[0]} ? ${merged}`, { arr: iv.map(x => "[" + x + "]"), ptr: { i } });
      if (merged) {
        const old = res[res.length - 1][1];
        res[res.length - 1][1] = Math.max(old, v[1]);
        F(8, `res.back()[1] = max(${old}, ${v[1]}) = ${res[res.length - 1][1]}`, { arr: iv.map(x => "[" + x + "]"), ptr: { i }, vars: { v: "[" + v + "]", res: res.map(x => "[" + x + "]").join(" ") } });
      } else {
        res.push(v.slice());
        F(10, `res.push_back([${v}])`, { arr: iv.map(x => "[" + x + "]"), ptr: { i }, vars: { v: "[" + v + "]", res: res.map(x => "[" + x + "]").join(" ") } });
      }
    });
    F(12, `return res`, { arr: iv.map(x => "[" + x + "]"), vars: { 答案: res.map(x => "[" + x + "]").join(" ") } });
    return S;
  };

  /* ---------------- 189 轮转数组 ---------------- */
  window.DBG[189] = p => {
    const S = [], a = p.viz.arr.slice();
    const F = (l, n, st) => S.push(Object.assign({ line: l, note: n }, st || {}));
    const n = a.length, kk = (p.viz.shift || 3) % n;
    F(4, `n = ${n}`, { arr: a.slice(), vars: { n } });
    F(5, `k %= n，k 取 ${kk}`, { arr: a.slice(), vars: { k: kk } });
    const rev = (i, j, tag, line) => {
      while (i < j) {
        const t = a[i]; a[i] = a[j]; a[j] = t;
        F(line, `${tag}：swap(${i}, ${j})`, { arr: a.slice(), hi: [i, j] });
        i++; j--;
      }
    };
    F(6, "reverse(整个数组)", { arr: a.slice() });
    rev(0, n - 1, "整体反转", 6);
    F(7, `reverse(nums.begin(), begin()+${kk})`, { arr: a.slice(), hi: Array.from({ length: kk }, (_, i) => i) });
    rev(0, kk - 1, "反转前 k 个", 7);
    F(8, `reverse(begin()+${kk}, end())`, { arr: a.slice() });
    rev(kk, n - 1, "反转后 n-k 个", 8);
    F(7, `最终结果`, { arr: a.slice(), done: a.map((_, i) => i), vars: { 结果: a.join(",") } });
    return S;
  };

  /* ---------------- 238 除自身以外数组的乘积 ---------------- */
  window.DBG[238] = p => {
    const S = [], a = p.viz.arr, n = a.length, res = new Array(n).fill(1);
    const F = (l, note, st) => S.push(Object.assign({ line: l, note }, st || {}));
    F(4, `n = ${n}`, { arr: a, dp: res.slice() });
    F(5, `res[${n}] 全 1`, { arr: a, dp: res.slice() });
    for (let i = 1; i < n; i++) {
      F(6, `i = ${i}（前缀积）`, { arr: a, dp: res.slice(), ptr: { i } });
      res[i] = res[i - 1] * a[i - 1];
      F(6, `res[${i}] = res[${i - 1}] × nums[${i - 1}] = ${res[i]}`, { arr: a, dp: res.slice(), dpHi: [i], vars: { 阶段: "前缀积" } });
    }
    let right = 1;
    F(7, "right = 1", { arr: a, dp: res.slice(), vars: { right } });
    for (let i = n - 1; i >= 0; i--) {
      F(8, `i = ${i}（后缀积）`, { arr: a, dp: res.slice(), ptr: { i }, vars: { right, 阶段: "后缀积" } });
      res[i] *= right;
      F(9, `res[${i}] ×= right(${right}) → ${res[i]}`, { arr: a, dp: res.slice(), dpHi: [i], vars: { right, 阶段: "后缀积" } });
      right *= a[i];
      F(10, `right ×= nums[${i}] → ${right}`, { arr: a, dp: res.slice(), vars: { right } });
    }
    F(12, `return res`, { arr: a, dp: res.slice(), dpDone: res.map((_, i) => i), vars: { 答案: res.join(",") } });
    return S;
  };

  /* ---------------- 41 缺失的第一个正数 ---------------- */
  window.DBG[41] = p => {
    const S = [], a = p.viz.arr.slice(), n = a.length;
    const F = (l, note, st) => S.push(Object.assign({ line: l, note }, st || {}));
    F(4, `n = ${n}`, { arr: a.slice() });
    for (let i = 0; i < n; i++) {
      F(5, `i = ${i}`, { arr: a.slice(), ptr: { i } });
      while (a[i] >= 1 && a[i] <= n && a[a[i] - 1] !== a[i]) {
        F(6, `nums[${i}]=${a[i]} 该在下标 ${a[i] - 1}，且那里不是它`, { arr: a.slice(), hi: [i, a[i] - 1] });
        const j = a[i] - 1;
        const t = a[i]; a[i] = a[j]; a[j] = t;
        F(7, `swap(${i}, ${j})`, { arr: a.slice(), hi: [i, j] });
      }
      F(6, `下标 ${i} 就位：${a[i] === i + 1 ? "是 " + (i + 1) : "不是 " + (i + 1)}`, { arr: a.slice(), hi: [i] });
    }
    for (let i = 0; i < n; i++) {
      F(8, `检查 nums[${i}] == ${i + 1} ?`, { arr: a.slice(), ptr: { i } });
      if (a[i] !== i + 1) {
        F(9, `→ 不是，return ${i + 1}`, { arr: a.slice(), hi: [i], vars: { 答案: i + 1 } });
        return S;
      }
    }
    F(10, `全部就位 → return ${n + 1}`, { arr: a.slice(), vars: { 答案: n + 1 } });
    return S;
  };

  /* ---------------- 73 矩阵置零 ---------------- */
  window.DBG[73] = p => {
    const S = [], g = p.viz.grid.map(r => r.slice()), m = g.length, n = g[0].length;
    const F = (l, note, st) => S.push(Object.assign({ line: l, note }, st || {}));
    const G = () => g.map(r => r.slice());
    F(4, `m = ${m}, n = ${n}`, { grid: G() });
    F(5, "row0 = col0 = false", { grid: G() });
    let row0 = false, col0 = false;
    for (let j = 0; j < n; j++) {
      F(6, `matrix[0][${j}] = ${g[0][j]}`, { grid: G(), gridHi: ["0," + j] });
      if (g[0][j] === 0) row0 = true;
    }
    F(6, `row0 = ${row0}`, { grid: G(), vars: { row0 } });
    for (let i = 0; i < m; i++) {
      F(7, `matrix[${i}][0] = ${g[i][0]}（第一列）`, { grid: G(), gridHi: [i + ",0"] });
      if (g[i][0] === 0) col0 = true;
    }
    F(7, `col0 = ${col0}`, { grid: G(), vars: { row0, col0 } });
    for (let i = 1; i < m; i++) {
      for (let j = 1; j < n; j++) {
        F(8, `i = ${i}, j = ${j}`, { grid: G(), gridHi: [i + "," + j] });
        if (g[i][j] === 0) {
          g[i][0] = 0; g[0][j] = 0;
          F(10, `发现 0 → matrix[${i}][0] = matrix[0][${j}] = 0`, { grid: G(), gridHi: [i + "," + j], gridDone: [i + ",0", "0," + j] });
        }
      }
    }
    for (let i = 1; i < m; i++) {
      for (let j = 1; j < n; j++) {
        if (g[i][0] === 0 || g[0][j] === 0) {
          g[i][j] = 0;
          F(13, `(${i},${j}) 的标记被置零 → matrix[${i}][${j}] = 0`, { grid: G(), gridHi: [i + "," + j] });
        }
      }
    }
    if (row0) { for (let j = 0; j < n; j++) g[0][j] = 0; F(14, "row0 → 第一行清零", { grid: G() }); }
    if (col0) { for (let i = 0; i < m; i++) g[i][0] = 0; F(15, "col0 → 第一列清零", { grid: G() }); }
    F(16, "完成：所有该置零的格子都置零了", { grid: G(), vars: { 答案: g.map(r => r.join(",")).join(";") } });
    return S;
  };

  /* ---------------- 54 螺旋矩阵 ---------------- */
  window.DBG[54] = p => {
    const S = [], g = p.viz.grid, res = [];
    const F = (l, note, st) => S.push(Object.assign({ line: l, note }, st || {}));
    F(4, "res = []", { grid: g });
    F(5, `matrix.empty() ? false`, { grid: g });
    let top = 0, bottom = g.length - 1, left = 0, right = g[0].length - 1;
    F(6, `top = 0, bottom = ${bottom}`, { grid: g, vars: { top, bottom } });
    F(7, `left = 0, right = ${right}`, { grid: g, vars: { top, bottom, left, right } });
    while (top <= bottom && left <= right) {
      F(8, `while (${top}<=${bottom} && ${left}<=${right})`, { grid: g, vars: { top, bottom, left, right } });
      for (let j = left; j <= right; j++) {
        res.push(g[top][j]);
        F(9, `push(matrix[${top}][${j}]) = ${g[top][j]}（上边）`, { grid: g, gridHi: [top + "," + j], vars: { res: res.join(",") } });
      }
      top++;
      F(10, `++top = ${top}`, { grid: g, vars: { top, bottom, left, right } });
      for (let i = top; i <= bottom; i++) {
        res.push(g[i][right]);
        F(11, `push(matrix[${i}][${right}]) = ${g[i][right]}（右边）`, { grid: g, gridHi: [i + "," + right], vars: { res: res.join(",") } });
      }
      right--;
      F(12, `--right = ${right}`, { grid: g, vars: { top, bottom, left, right } });
      if (top <= bottom) {
        F(13, `${top} <= ${bottom} → 走下边`, { grid: g });
        for (let j = right; j >= left; j--) {
          res.push(g[bottom][j]);
          F(14, `push(matrix[${bottom}][${j}]) = ${g[bottom][j]}（下边）`, { grid: g, gridHi: [bottom + "," + j], vars: { res: res.join(",") } });
        }
        bottom--;
        F(15, `--bottom = ${bottom}`, { grid: g, vars: { top, bottom, left, right } });
      }
      if (left <= right) {
        F(17, `${left} <= ${right} → 走左边`, { grid: g });
        for (let i = bottom; i >= top; i--) {
          res.push(g[i][left]);
          F(18, `push(matrix[${i}][${left}]) = ${g[i][left]}（左边）`, { grid: g, gridHi: [i + "," + left], vars: { res: res.join(",") } });
        }
        left++;
        F(19, `++left = ${left}`, { grid: g, vars: { top, bottom, left, right } });
      }
    }
    F(22, `return res`, { grid: g, vars: { 答案: res.join(",") } });
    return S;
  };

  /* ---------------- 48 旋转图像 ---------------- */
  window.DBG[48] = p => {
    const S = [], g = p.viz.grid.map(r => r.slice()), n = g.length;
    const F = (l, note, st) => S.push(Object.assign({ line: l, note }, st || {}));
    const G = () => g.map(r => r.slice());
    F(4, `n = ${n}`, { grid: G() });
    for (let i = 0; i < n; i++) {
      F(5, `i = ${i}`, { grid: G(), gridHi: Array.from({ length: n }, (_, j) => i + "," + j) });
      for (let j = i + 1; j < n; j++) {
        F(6, `j = ${j}（只扫主对角线右上）`, { grid: G(), gridHi: [i + "," + j], gridDone: [j + "," + i] });
        const t = g[i][j]; g[i][j] = g[j][i]; g[j][i] = t;
        F(7, `swap(${i},${j}) ↔ (${j},${i}) → ${g[i][j]} / ${g[j][i]}`, { grid: G(), gridHi: [i + "," + j, j + "," + i] });
      }
    }
    F(5, "转置完成", { grid: G(), gridDone: Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => i + "," + j)).flat() });
    for (let i = 0; i < n; i++) {
      F(8, `第 ${i} 行 reverse`, { grid: G(), gridHi: Array.from({ length: n }, (_, j) => i + "," + j) });
      g[i].reverse();
      F(8, `第 ${i} 行翻转 → ${g[i].join(",")}`, { grid: G(), gridHi: Array.from({ length: n }, (_, j) => i + "," + j) });
    }
    F(8, "完成：顺时针 90°", { grid: G(), vars: { 答案: g.map(r => r.join(",")).join(";") } });
    return S;
  };

  /* ---------------- 240 搜索二维矩阵 II ---------------- */
  window.DBG[240] = p => {
    const S = [], g = p.viz.grid, tg = p.viz.target, m = g.length, n = g[0].length;
    const F = (l, note, st) => S.push(Object.assign({ line: l, note }, st || {}));
    let i = 0, j = n - 1;
    F(4, `m = ${m}, n = ${n}`, { grid: g, vars: { target: tg } });
    F(5, `i = 0, j = ${j}（右上角）`, { grid: g, gridHi: [i + "," + j], vars: { i, j } });
    let guard = 0;
    while (i < m && j >= 0 && guard++ < 30) {
      F(6, `while (${i} < ${m} && ${j} >= 0)`, { grid: g, gridHi: [i + "," + j], vars: { i, j } });
      const v = g[i][j];
      F(7, `matrix[${i}][${j}] = ${v} == ${tg} ?`, { grid: g, gridHi: [i + "," + j], vars: { i, j } });
      if (v === tg) {
        F(7, "→ 命中，return true", { grid: g, gridHi: [i + "," + j], vars: { 答案: "true" } });
        return S;
      }
      if (v > tg) {
        j--;
        F(8, `${v} > ${tg} → 这一列都太大，--j = ${j}`, { grid: g, gridHi: [i + "," + j], vars: { i, j } });
      } else {
        i++;
        F(9, `${v} < ${tg} → 这一行都太小，++i = ${i}`, { grid: g, gridHi: [i + "," + j], vars: { i, j } });
      }
    }
    F(11, "越界 → return false", { grid: g, vars: { 答案: "false" } });
    return S;
  };
})();
