/* 各题的可视化分镜（trace）。没有专属 trace 的题走通用演示。 */
;(function () {
  const T = {};
  const R = (a, b) => { const r = []; for (let i = a; i <= b; i++) r.push(i); return r; };
  const A = (note, o) => Object.assign({ note }, o || {});
  const cp = o => JSON.parse(JSON.stringify(o));

  /* ============ 哈希 ============ */
  T[1] = p => {
    const arr = p.viz.arr, target = p.viz.target, steps = [], map = {};
    steps.push(A(`target = <b>${target}</b>。哈希表空，从左往右扫一遍。`, { arr, map: {} }));
    for (let i = 0; i < arr.length; i++) {
      const need = target - arr[i];
      const hit = map[need] !== undefined;
      steps.push(A(
        `i=${i}，x=<b>${arr[i]}</b>，需要 <code>${target} - ${arr[i]} = ${need}</code>。` +
        (hit ? `表里有 ${need}（下标 ${map[need]}）→ 命中` : `表里没有 → 把 ${arr[i]} → ${i} 存进去`),
        { arr, hi: [i], ptr: { i }, map: cp(map), mapHi: hit ? [String(need)] : [] }));
      if (hit) {
        steps.push(A(`返回 <code>[${map[need]}, ${i}]</code> ✓`, {
          arr, hi: [map[need], i], done: [i], map: cp(map),
          vars: { 答案: `[${map[need]}, ${i}]` }
        }));
        break;
      }
      map[String(arr[i])] = i;
    }
    return steps;
  };

  T[49] = p => {
    const arr = p.viz.arr, steps = [], groups = {};
    steps.push(A("对每个字符串算一个「指纹」：排序后的字符序列。指纹相同的归到一组。", { arr, map: {} }));
    arr.forEach((s, i) => {
      const key = s.split("").sort().join("");
      groups[key] = groups[key] || [];
      groups[key].push(s);
      steps.push(A(`"${s}" 排序后是 <b>"${key}"</b>，放进指纹 ${key} 的桶里`, {
        arr, hi: [i], map: cp(groups), mapHi: [key]
      }));
    });
    steps.push(A(`一共 ${Object.keys(groups).length} 组 —— 返回 <code>numpy</code> 式的 values 即可`, {
      arr, map: cp(groups), done: R(0, arr.length - 1)
    }));
    return steps;
  };

  T[128] = p => {
    const arr = p.viz.arr, set = new Set(arr), steps = [];
    steps.push(A(`全部元素进 Set：只对「序列起点」启动计数。`, { arr, map: Object.fromEntries([...set].map(v => [v, "✓"])), vars: { 集合大小: set.size } }));
    let best = 0;
    arr.forEach((x, i) => {
      if (set.has(x - 1)) {
        steps.push(A(`x=<b>${x}</b>，但 ${x - 1} 也在集合里 → 它不是起点，跳过`, { arr, hi: [i], done: [i], map: Object.fromEntries([...set].map(v => [v, "✓"])), vars: { 最长: best } }));
        return;
      }
      let y = x;
      while (set.has(y + 1)) y++;
      best = Math.max(best, y - x + 1);
      steps.push(A(`x=${x} 是起点，向上数到 <b>${y}</b>，这一段长度 <b>${y - x + 1}</b>，历史最长 ${best}`, {
        arr, hi: [i], win: [i, i], map: Object.fromEntries([...set].map(v => [v, "✓"])), vars: { 起点: x, 终点: y, 最长: best }
      }));
    });
    return steps;
  };

  /* ============ 双指针 ============ */
  T[283] = p => {
    const arr = p.viz.arr.slice(), steps = [];
    let w = 0;
    steps.push(A("写指针 w 指向下一个非零元素的落点，r 负责扫描。", { arr, ptr: { w, r: 0 } }));
    for (let r = 0; r < arr.length; r++) {
      if (arr[r] !== 0) {
        const t = arr[w]; arr[w] = arr[r]; arr[r] = t;
        steps.push(A(`nums[${r}]=${arr[w]} ≠ 0 → 和 nums[${w}] 交换，w 前进到 ${w + 1}`, { arr, ptr: { w: w + 1, r }, hi: [w, r], vars: { w: w + 1 } }));
        w++;
      } else {
        steps.push(A(`nums[${r}]=0，跳过（0 会被自然挤到后面）`, { arr, ptr: { w, r }, hi2: [r], vars: { w } }));
      }
    }
    steps.push(A("结束：所有非零都在前面，剩下的位置天然是 0。", { arr, done: R(0, arr.length - 1) }));
    return steps;
  };

  T[11] = p => {
    const h = p.viz.arr, steps = [];
    let l = 0, r = h.length - 1, best = 0;
    steps.push(A("面积 = min(左高, 右高) × 宽度。从两端开始。", { bars: h, ptr: { l, r }, vars: { 最大面积: 0 } }));
    while (l < r) {
      const area = Math.min(h[l], h[r]) * (r - l);
      const better = area > best;
      if (better) best = area;
      steps.push(A(`宽 ${r - l} × 高 ${Math.min(h[l], h[r])} = <b>${area}</b>${better ? " → 刷新最优" : ""}`, {
        bars: h, ptr: { l, r }, hi: [h[l] < h[r] ? l : r], vars: { 当前面积: area, 最大面积: best }
      }));
      if (h[l] < h[r]) { steps.push(A(`左边更矮（${h[l]} < ${h[r]}）→ 移动矮的那侧 l++，高的那侧留着没意义`, { bars: h, ptr: { l: l + 1, r }, vars: { 最大面积: best } })); l++; }
      else { steps.push(A(`右边更矮（${h[r]} ≤ ${h[l]}）→ r--`, { bars: h, ptr: { l, r: r - 1 }, vars: { 最大面积: best } })); r--; }
    }
    steps.push(A(`两指针相遇，最大面积 <b>${best}</b>`, { bars: h, done: R(0, h.length - 1), vars: { 答案: best } }));
    return steps;
  };

  T[15] = p => {
    const nums = p.viz.arr.slice().sort((a, b) => a - b), steps = [], res = [];
    steps.push(A("先排序，然后固定 i，剩下的两数用对撞双指针找。", { arr: nums }));
    for (let i = 0; i < nums.length - 2; i++) {
      if (i > 0 && nums[i] === nums[i - 1]) {
        steps.push(A(`nums[${i}] 和上一个相同 → 跳过，避免重复三元组`, { arr: nums, hi: [i], done: [i] }));
        continue;
      }
      let l = i + 1, r = nums.length - 1;
      steps.push(A(`固定 i=${i}（值 ${nums[i]}），l=${l}, r=${r}`, { arr: nums, ptr: { i, l, r }, hi: [i], vars: { 目标: (-nums[i]) } }));
      while (l < r) {
        const s = nums[i] + nums[l] + nums[r];
        steps.push(A(`${nums[i]} + ${nums[l]} + ${nums[r]} = <b>${s}</b>` + (s === 0 ? " → 命中！" : s < 0 ? " < 0，太小，l 右移" : " > 0，太大，r 左移"), {
          arr: nums, ptr: { i, l, r }, hi: s === 0 ? [i, l, r] : [l, r], vars: { 当前和: s, 已找到: res.length }
        }));
        if (s === 0) {
          res.push([nums[i], nums[l], nums[r]]);
          l++; r--;
        } else if (s < 0) l++;
        else r--;
      }
    }
    steps.push(A(`共找到 <b>${res.length}</b> 组：` + res.map(x => "[" + x.join(",") + "]").join(" "), { arr: nums, done: R(0, nums.length - 1), vars: { 结果数: res.length } }));
    return steps;
  };

  T[42] = p => {
    const h = p.viz.arr, steps = [];
    let l = 0, r = h.length - 1, lm = 0, rm = 0, ans = 0;
    steps.push(A("双指针 + 左右最高。每次结算「更矮那一侧」的积水。", { bars: h, ptr: { l, r }, vars: { lmax: 0, rmax: 0, 雨水: 0 } }));
    while (l < r) {
      if (h[l] < h[r]) {
        lm = Math.max(lm, h[l]); ans += lm - h[l];
        steps.push(A(`左低：lmax=max(${lm},${h[l]})=<b>${lm}</b>，这一格接 <b>${lm - h[l]}</b> 水，累计 ${ans}`, { bars: h, ptr: { l, r }, hi: [l], done: R(0, l - 1), vars: { lmax: lm, rmax: rm, 雨水: ans } }));
        l++;
      } else {
        rm = Math.max(rm, h[r]); ans += rm - h[r];
        steps.push(A(`右低：rmax=max(${rm},${h[r]})=<b>${rm}</b>，这一格接 <b>${rm - h[r]}</b> 水，累计 ${ans}`, { bars: h, ptr: { l, r }, hi: [r], done: R(r + 1, h.length - 1), vars: { lmax: lm, rmax: rm, 雨水: ans } }));
        r--;
      }
    }
    steps.push(A(`指针相遇，总雨水 <b>${ans}</b>`, { bars: h, vars: { 答案: ans } }));
    return steps;
  };

  /* ============ 滑动窗口 / 子串 ============ */
  T[3] = p => {
    const s = p.viz.arr, steps = [], last = {};
    let l = 0, best = 0;
    steps.push(A("窗口内保持无重复；last 记录每个字符最近出现的下标。", { arr: s, ptr: { l: 0, r: 0 }, win: [0, 0] }));
    for (let r = 0; r < s.length; r++) {
      const ch = s[r], old = last[ch];
      let jumped = false;
      if (old !== undefined && old >= l) { l = old + 1; jumped = true; }
      last[ch] = r;
      best = Math.max(best, r - l + 1);
      steps.push(A(
        `右指针到 <b>${ch}</b>（i=${r}）` +
        (jumped ? `，它上次在 ${old} 且还在窗口内 → l 跳到 <code>${l}</code>` : "，没重复"),
        { arr: s, ptr: { l, r }, win: [l, r], hi: [r], map: cp(last), vars: { l, r, 窗口: r - l + 1, 最长: best } }));
    }
    steps.push(A(`最长无重复子串长度 <b>${best}</b>`, { arr: s, win: [l, l + best - 1], vars: { 答案: best } }));
    return steps;
  };

  T[438] = p => {
    const s = p.viz.arr, m = p.viz.target.length, steps = [], res = [];
    steps.push(A(`窗口长度固定为 ${m}，滑动时「进一个、出一个」，计数相同即命中。`, { arr: s, win: [0, m - 1] }));
    for (let i = 0; i + m <= s.length; i++) {
      const seg = s.slice(i, i + m).join("");
      const ok = seg.split("").sort().join("") === p.viz.target.split("").sort().join("");
      if (ok) res.push(i);
      steps.push(A(`窗口 <code>[${i}, ${i + m - 1}]</code> = "${seg}"` + (ok ? " → 是异位词，记录左端点 " + i : " → 不是"), {
        arr: s, win: [i, i + m - 1], hi: R(i, i + m - 1), vars: { 命中: res.length }
      }));
    }
    steps.push(A(`结果：<code>[${res.join(", ")}]</code>`, { arr: s, done: res.length ? R(res[0], res[res.length - 1] + m - 1) : [], vars: { 答案: "[" + res.join(",") + "]" } }));
    return steps;
  };

  T[560] = p => {
    const arr = p.viz.arr, k = p.viz.target, steps = [], cnt = { 0: 1 };
    let pre = 0, ans = 0;
    steps.push(A(`前缀和 + 计数表。初始 <code>{0: 1}</code> 代表空前缀。`, { arr, map: cp(cnt), vars: { k, 前缀和: 0 } }));
    arr.forEach((x, i) => {
      pre += x;
      const need = pre - k, add = cnt[need] || 0;
      ans += add;
      steps.push(A(`加到 <b>${x}</b>，前缀和 = ${pre}；需要 ${need} 出现过 <b>${add}</b> 次 → 答案 += ${add}（累计 ${ans}）`, {
        arr, hi: [i], map: cp(cnt), mapHi: cnt[need] !== undefined ? [String(need)] : [], vars: { 前缀和: pre, 答案: ans }
      }));
      cnt[pre] = (cnt[pre] || 0) + 1;
      steps.push(A(`把前缀和 ${pre} 计入表（先查后存，顺序不能反）`, { arr, hi: [i], map: cp(cnt), vars: { 前缀和: pre, 答案: ans } }));
    });
    return steps;
  };

  T[239] = p => {
    const arr = p.viz.arr, k = p.viz.win || 3, steps = [], dq = [], res = [];
    steps.push(A(`单调队列存下标，队首永远是当前窗口最大值。k = ${k}`, { arr, win: [0, k - 1], ptr: { i: 0 } }));
    arr.forEach((x, i) => {
      while (dq.length && arr[dq[dq.length - 1]] <= x) dq.pop();
      dq.push(i);
      if (dq[0] <= i - k) dq.shift();
      if (i >= k - 1) res.push(arr[dq[0]]);
      steps.push(A(`i=${i}，x=<b>${x}</b>：弹掉队尾比它小的，队列 = [${dq.join(", ")}]` + (i >= k - 1 ? `，窗口最大值 <b>${arr[dq[0]]}</b>` : ""), {
        arr, ptr: { i }, win: [Math.max(0, i - k + 1), i], hi: dq.slice(), map: Object.fromEntries(dq.map((v, n) => [dq[n], arr[v]])), vars: { 队列长度: dq.length, 最大值: res.length ? res[res.length - 1] : "-" }
      }));
    });
    steps.push(A(`结果 <code>[${res.join(", ")}]</code>`, { arr, vars: { 答案: "[" + res.join(",") + "]" } }));
    return steps;
  };

  T[76] = p => {
    const s = p.viz.arr, t = p.viz.target, steps = [];
    const need = {}, win = {};
    for (const c of t) need[c] = (need[c] || 0) + 1;
    const kinds = Object.keys(need).length;
    let valid = 0, l = 0, best = Infinity, start = 0;
    steps.push(A(`need = ${JSON.stringify(need)}，右扩到「覆盖」再左缩到最紧。`, { arr: s, win: [0, 0], map: cp(need), vars: { 需覆盖种类: kinds } }));
    for (let r = 0; r < s.length; r++) {
      const ch = s[r];
      if (need[ch]) {
        win[ch] = (win[ch] || 0) + 1;
        if (win[ch] === need[ch]) valid++;
      }
      steps.push(A(`右扩到 <b>${ch}</b>：window=${JSON.stringify(win)}，已满足 <b>${valid}/${kinds}</b> 种`, {
        arr: s, ptr: { l, r }, win: [l, r], hi: [r], map: cp(win), vars: { valid, 最短: best === Infinity ? "-" : best }
      }));
      while (valid === kinds) {
        if (r - l + 1 < best) { best = r - l + 1; start = l; }
        steps.push(A(`已覆盖！尝试左缩，当前长度 ${r - l + 1}，历史最短 <b>${best}</b>`, {
          arr: s, ptr: { l, r }, win: [l, r], done: [], map: cp(win), vars: { valid, 最短: best }
        }));
        const left = s[l];
        if (need[left]) {
          if (win[left] === need[left]) valid--;
          win[left]--;
        }
        l++;
      }
    }
    steps.push(A(best === Infinity ? "没有覆盖子串，返回空串" : `最短覆盖子串是 <code>${s.slice(start, start + best).join("")}</code>（长度 ${best}）`, {
      arr: s, win: [start, start + best - 1], vars: { 答案: best === Infinity ? '""' : s.slice(start, start + best).join("") }
    }));
    return steps;
  };

  /* ============ 普通数组 ============ */
  T[53] = p => {
    const arr = p.viz.arr, steps = [];
    let cur = arr[0], best = arr[0];
    steps.push(A(`Kadane：cur = 以当前元素<b>结尾</b>的最大和。`, { arr, ptr: { i: 0 }, vars: { cur, best } }));
    for (let i = 1; i < arr.length; i++) {
      const extend = cur + arr[i], restart = arr[i];
      cur = Math.max(extend, restart);
      best = Math.max(best, cur);
      steps.push(A(`x=${arr[i]}：接上前面 ${extend} vs 从自己重开 ${restart} → 选 <b>${cur}</b>；全局最优 ${best}`, {
        arr, hi: [i], done: R(0, i - 1), vars: { cur, best, 选择: extend > restart ? "接上" : "重开" }
      }));
    }
    steps.push(A(`最大子数组和 = <b>${best}</b>`, { arr, vars: { 答案: best } }));
    return steps;
  };

  T[56] = p => {
    const arr = p.viz.arr, steps = [];
    let cur = [1, 3];
    const merged = [];
    steps.push(A("按左端点排序后，相邻区间才可能重叠。维护一个「当前区间」。", { arr }));
    const ivals = [[1, 3], [2, 6], [8, 10], [15, 18]];
    ivals.forEach((v, i) => {
      if (i === 0) { cur = v.slice(); steps.push(A(`当前区间 = [${cur}]`, { arr, hi: [i] })); return; }
      if (cur[1] >= v[0]) {
        cur[1] = Math.max(cur[1], v[1]);
        steps.push(A(`[${v}] 的左端 ${v[0]} ≤ 当前右端 → 合并，右端扩到 <b>${cur[1]}</b>`, { arr, hi: [i], vars: { 当前区间: "[" + cur + "]" } }));
      } else {
        merged.push(cur.slice());
        cur = v.slice();
        steps.push(A(`[${v}] 不重叠 → [${merged[merged.length - 1]}] 落盘，当前区间换成 [${cur}]`, { arr, hi: [i], vars: { 已合并: merged.length } }));
      }
    });
    merged.push(cur);
    steps.push(A(`结果：${merged.map(x => "[" + x + "]").join(" ")}`, { arr, done: R(0, arr.length - 1), vars: { 区间数: merged.length } }));
    return steps;
  };

  T[189] = p => {
    const arr = p.viz.arr.slice(), k = p.viz.shift || 3, steps = [];
    const n = arr.length, kk = k % n;
    const rev = (a, i, j) => { while (i < j) { const t = a[i]; a[i] = a[j]; a[j] = t; i++; j--; } };
    steps.push(A(`右移 ${k} 位 = 整体反转 → 前 ${kk} 个反转 → 后 ${n - kk} 个反转。`, { arr: arr.slice() }));
    rev(arr, 0, n - 1);
    steps.push(A(`① 整体反转`, { arr: arr.slice(), done: R(0, n - 1) }));
    rev(arr, 0, kk - 1);
    steps.push(A(`② 反转前 ${kk} 个`, { arr: arr.slice(), hi: R(0, kk - 1) }));
    rev(arr, kk, n - 1);
    steps.push(A(`③ 反转后 ${n - kk} 个`, { arr: arr.slice(), hi: R(kk, n - 1) }));
    steps.push(A(`得到右移 ${k} 位的结果`, { arr: arr.slice(), done: R(0, n - 1) }));
    return steps;
  };

  T[238] = p => {
    const nums = p.viz.arr, n = nums.length, res = new Array(n).fill(1), steps = [];
    steps.push(A("答案 = 左前缀积 × 右后缀积。先从左到右填前缀积。", { arr: nums, dp: res.slice(), dpHi: [] }));
    for (let i = 1; i < n; i++) {
      res[i] = res[i - 1] * nums[i - 1];
      steps.push(A(`res[${i}] = res[${i - 1}] × nums[${i - 1}] = <b>${res[i]}</b>`, { arr: nums, dp: res.slice(), dpHi: [i], ptr: { i } }));
    }
    let right = 1;
    steps.push(A("再从右往左，用滚动变量 right 乘上后缀积。", { arr: nums, dp: res.slice(), vars: { right } }));
    for (let i = n - 1; i >= 0; i--) {
      res[i] *= right;
      steps.push(A(`res[${i}] ×= right(${right}) → <b>${res[i]}</b>，然后 right ×= nums[${i}]`, { arr: nums, dp: res.slice(), dpHi: [i], vars: { right: right * nums[i] } }));
      right *= nums[i];
    }
    steps.push(A(`结果 <code>[${res.join(", ")}]</code>`, { arr: nums, dp: res.slice(), dpDone: R(0, n - 1) }));
    return steps;
  };

  T[41] = p => {
    const arr = p.viz.arr.slice(), n = arr.length, steps = [];
    steps.push(A("目标：让数字 x 出现在下标 x-1 上（原地哈希）。", { arr: arr.slice() }));
    for (let i = 0; i < n; i++) {
      while (arr[i] >= 1 && arr[i] <= n && arr[arr[i] - 1] !== arr[i]) {
        const j = arr[i] - 1;
        steps.push(A(`nums[${i}]=${arr[i]} 应该待在下标 ${j}，交换`, { arr: arr.slice(), hi: [i, j] }));
        const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
      }
      steps.push(A(`下标 ${i} 处理完：${arr[i] === i + 1 ? "已归位" : "不是 " + (i + 1)}`, { arr: arr.slice(), hi: [i] }));
    }
    let ans = n + 1;
    for (let i = 0; i < n; i++) if (arr[i] !== i + 1) { ans = i + 1; break; }
    steps.push(A(`第一个没归位的位置给出答案 <b>${ans}</b>`, { arr: arr.slice(), hi: [ans - 1], vars: { 答案: ans } }));
    return steps;
  };

  /* ============ 矩阵 ============ */
  T[73] = p => {
    const g = p.viz.grid.map(r => r.slice()), m = g.length, n = g[0].length, steps = [];
    steps.push(A("用第一行 / 第一列当标记位，把空间压到 O(1)。", { grid: g }));
    const zero = [];
    for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) if (g[i][j] === 0) zero.push(i + "," + j);
    steps.push(A(`找到 0 的位置：${zero.join(" | ")}；把它们所在的行首、列首标成 0`, { grid: g, gridHi: zero }));
    zero.forEach(z => {
      const [i, j] = z.split(",").map(Number);
      g[i][0] = 0; g[0][j] = 0;
    });
    steps.push(A("标记完成：第 0 行 / 第 0 列上的 0 就是「整行整列要清零」的信号", { grid: g.map(r => r.slice()), gridHi: zero }));
    const g2 = g.map(r => r.slice());
    for (let i = 1; i < m; i++) for (let j = 1; j < n; j++) if (g[i][0] === 0 || g[0][j] === 0) g2[i][j] = 0;
    steps.push(A("按标记清空内部（注意：最后才处理第一行第一列本身）", { grid: g2, gridDone: zero }));
    return steps;
  };

  T[54] = p => {
    const g = p.viz.grid, order = [], steps = [];
    let top = 0, bottom = g.length - 1, left = 0, right = g[0].length - 1;
    steps.push(A("四条边界向内收缩，每走完一条边就缩一次。", { grid: g }));
    while (top <= bottom && left <= right) {
      const seg = [];
      for (let j = left; j <= right; j++) { order.push(top + "," + j); seg.push(g[top][j]); }
      steps.push(A(`上边：从左到右 → ${seg.join(" ")}`, { grid: g, gridDone: order.slice(), gridHi: R(left, right).map(j => top + "," + j) }));
      top++;
      for (let i = top; i <= bottom; i++) { order.push(i + "," + right); }
      if (top <= bottom) steps.push(A(`右边：从上到下`, { grid: g, gridDone: order.slice() }));
      right--;
      if (top <= bottom) {
        for (let j = right; j >= left; j--) order.push(bottom + "," + j);
        steps.push(A(`下边：从右到左（单行时跳过）`, { grid: g, gridDone: order.slice() }));
        bottom--;
      }
      if (left <= right) {
        for (let i = bottom; i >= top; i--) order.push(i + "," + left);
        steps.push(A(`左边：从下到上（单列时跳过）`, { grid: g, gridDone: order.slice() }));
        left++;
      }
    }
    steps.push(A(`遍历结果：<b>${order.map(k => { const [i, j] = k.split(",").map(Number); return g[i][j]; }).join(" → ")}</b>`, { grid: g, gridDone: order }));
    return steps;
  };

  T[48] = p => {
    const g = p.viz.grid.map(r => r.slice()), n = g.length, steps = [];
    steps.push(A("顺时针 90° = 先转置（沿主对角线翻），再左右翻转每一行。", { grid: g.map(r => r.slice()) }));
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const t = g[i][j]; g[i][j] = g[j][i]; g[j][i] = t; }
    steps.push(A("① 转置完成（对角线下方的元素换到了上方）", { grid: g.map(r => r.slice()), gridHi: R(0, n - 1).map(i => i + "," + i) }));
    g.forEach(row => row.reverse());
    steps.push(A("② 每行左右翻转 → 顺时针 90°", { grid: g.map(r => r.slice()), gridDone: R(0, n - 1).flatMap(i => R(0, n - 1).map(j => i + "," + j)) }));
    return steps;
  };

  T[240] = p => {
    const g = p.viz.grid, target = p.viz.target, steps = [];
    let i = 0, j = g[0].length - 1;
    steps.push(A(`从右上角 (0, ${j}) 出发：本行最大、本列最小，一步排除一行或一列。target=${target}`, { grid: g, gridHi: [i + "," + j] }));
    while (i < g.length && j >= 0) {
      const v = g[i][j];
      const stop = v === target;
      steps.push(A(`看 (${i},${j}) = <b>${v}</b>：` + (stop ? "命中！" : v > target ? `${v} > ${target} → 这一列都太大，j--` : `${v} < ${target} → 这一行都太小，i++`), {
        grid: g, gridHi: [i + "," + j], gridDone: [], vars: { i, j }
      }));
      if (stop) return steps;
      if (v > target) j--; else i++;
    }
    steps.push(A("越界 → 不存在", { grid: g, vars: { 结果: "false" } }));
    return steps;
  };

  /* ============ 链表 ============ */
  const listTrace = (arr, notes) => notes.map(n => Object.assign({ list: arr }, n));

  T[206] = p => {
    const a = p.viz.arr, n = a.length, steps = [];
    steps.push(A("prev / cur 两个指针就地改箭头。", { list: a, listPtr: { 0: "cur" }, listHi: [0] }));
    for (let i = 0; i < n; i++) {
      steps.push(A(`把 cur(${a[i]}).next 指向 prev(${i === 0 ? "null" : a[i - 1]})`, {
        list: a, listHi: [i], listDone: R(0, i - 1), listPtr: { [i]: "cur", [i - 1]: "prev" }
      }));
    }
    steps.push(A(`返回 prev，它现在是新头节点 <b>${a[n - 1]}</b>`, { list: a.slice().reverse(), listDone: R(0, n - 1) }));
    return steps;
  };

  T[142] = p => {
    const a = p.viz.arr, steps = [];
    steps.push(A("① 快慢指针找相遇点（每步快 1 个位置）", { list: a, listPtr: { 0: "slow/fast" }, listHi: [0] }));
    let s = 0, f = 0;
    for (let k = 0; k < 6; k++) {
      s = (s + 1) % a.length;
      f = (f + 2) % a.length;
      steps.push(A(`slow 到 ${s}，fast 到 ${f}` + (s === f ? " → 相遇！" : ""), {
        list: a, listHi: s === f ? [s] : [s, f], listPtr: { [s]: "slow", [f]: "fast" }
      }));
      if (s === f) break;
    }
    steps.push(A("② 一个指针回到 head，两者同步走一步", { list: a, listPtr: { 0: "p", [s]: "slow" }, listHi: [0, s] }));
    let p1 = 0;
    while (p1 !== s) { p1 = (p1 + 1) % a.length; s = (s + 1) % a.length; }
    steps.push(A(`再相遇处 <b>下标 ${p1}（值 ${a[p1]}）</b>就是环入口`, { list: a, listHi: [p1], listDone: [p1], vars: { 入口: a[p1] } }));
    return steps;
  };

  T[19] = p => {
    const a = p.viz.arr, n = a.length, k = 2, steps = [];
    steps.push(A(`快指针先走 n=${k} 步，然后两指针同步，快到头时慢指针停在待删节点的前一个。`, { list: a, listPtr: { [k]: "fast", [-1]: "" }, listHi: [k] }));
    for (let d = 0; d < n; d++) {
      const slow = d, fast = d + k;
      if (fast >= n - 1) {
        steps.push(A(`fast 到尾部（下标 ${Math.min(fast, n - 1)}），slow 在 ${slow} → 删除 nums[${slow + 1}]`, {
          list: a, listHi: [slow + 1], listDone: [slow + 1], listPtr: { [slow]: "slow", [Math.min(fast, n - 1)]: "fast" }
        }));
        break;
      }
      steps.push(A(`同步走：slow=${slow}，fast=${fast}`, { list: a, listPtr: { [slow]: "slow", [fast]: "fast" }, listHi: [slow, fast] }));
    }
    return steps;
  };

  T[25] = p => {
    const a = p.viz.arr, k = 2, steps = [];
    steps.push(A(`每 k=${k} 个一组，先数够再翻转；不足 k 个保持原样。`, { list: a }));
    for (let i = 0; i + k <= a.length; i += k) {
      steps.push(A(`组 [${i}, ${i + k - 1}]：${a.slice(i, i + k).join(" , ")} → 翻转为 ${a.slice(i, i + k).reverse().join(" , ")}`, {
        list: a, listHi: R(i, i + k - 1), listDone: R(0, i - 1)
      }));
    }
    steps.push(A("缝好每组：上一组尾巴 → 本组新头，本组原头 → 下一组头", { list: a, listDone: R(0, a.length - 1) }));
    return steps;
  };

  /* ============ 树 ============ */
  T[94] = p => {
    const tree = p.viz.tree, steps = [], out = [];
    const posOf = {};
    // 用层序下标模拟中序
    const inorder = (i) => {
      if (i >= tree.length || tree[i] == null) return;
      inorder(2 * i + 1); out.push(i); inorder(2 * i + 2);
    };
    inorder(0);
    steps.push(A("中序：左 → 根 → 右。迭代写法就是「一路向左压栈，弹出即访问」。", { tree, treeHi: [0] }));
    out.forEach((idx, k) => {
      steps.push(A(`第 ${k + 1} 个访问 <b>${tree[idx]}</b>`, { tree, treeHi: [idx], treeDone: out.slice(0, k) }));
    });
    steps.push(A(`中序结果：<b>${out.map(i => tree[i]).join(" → ")}</b>`, { tree, treeDone: out }));
    return steps;
  };

  T[102] = p => {
    const tree = p.viz.tree, steps = [], levels = [];
    let level = [0];
    while (level.length) {
      levels.push(level.slice());
      const next = [];
      level.forEach(i => { if (2 * i + 1 < tree.length && tree[2 * i + 1] != null) next.push(2 * i + 1); if (2 * i + 2 < tree.length && tree[2 * i + 2] != null) next.push(2 * i + 2); });
      level = next;
    }
    steps.push(A("队列 + 先记 size 再消费：一次弹完整层。", { tree, treeHi: [0] }));
    const seen = [];
    levels.forEach((lv, d) => {
      seen.push.apply(seen, lv);
      steps.push(A(`第 ${d} 层：<b>${lv.map(i => tree[i]).join(", ")}</b>`, { tree, treeHi: lv, treeDone: seen.slice(0, seen.length - lv.length) }));
    });
    return steps;
  };

  T[543] = p => {
    const tree = p.viz.tree, steps = [];
    steps.push(A("后序返回高度，顺手用「左高 + 右高」更新直径。", { tree, treeHi: [0] }));
    const order = [];
    const post = i => { if (i >= tree.length || tree[i] == null) return 0; const l = post(2 * i + 1), r = post(2 * i + 2); order.push({ i, l, r }); return 1 + Math.max(l, r); };
    post(0);
    let best = 0;
    order.forEach(o => {
      best = Math.max(best, o.l + o.r);
      steps.push(A(`节点 ${tree[o.i]}：左高 ${o.l} + 右高 ${o.r} = <b>${o.l + o.r}</b>，当前最大直径 ${best}`, { tree, treeHi: [o.i], vars: { 直径: best } }));
    });
    steps.push(A(`最大直径 = <b>${best}</b>`, { tree, vars: { 答案: best } }));
    return steps;
  };

  T[226] = p => {
    const tree = p.viz.tree, steps = [];
    steps.push(A("递归到每个节点，交换左右孩子。", { tree, treeHi: [0] }));
    const swapped = tree.slice();
    for (let i = 0; i < tree.length; i++) {
      if (tree[i] == null) continue;
      const l = 2 * i + 1, r = 2 * i + 2;
      const t = swapped[l]; swapped[l] = swapped[r]; swapped[r] = t;
      steps.push(A(`交换节点 ${tree[i]} 的左右子树`, { tree: swapped.slice(), treeHi: [i] }));
    }
    steps.push(A("整棵树镜像完成", { tree: swapped.slice() }));
    return steps;
  };

  /* ============ 图论 ============ */
  T[200] = p => {
    const g = p.viz.grid.map(r => r.slice()), m = g.length, n = g[0].length, steps = [];
    let cnt = 0;
    steps.push(A("遇到陆地就计数 +1，然后用 DFS 把整块陆地淹成 0。", { grid: g.map(r => r.slice()) }));
    const sink = (i, j, acc) => {
      if (i < 0 || i >= m || j < 0 || j >= n || g[i][j] !== "1") return;
      g[i][j] = "0"; acc.push(i + "," + j);
      sink(i + 1, j, acc); sink(i - 1, j, acc); sink(i, j + 1, acc); sink(i, j - 1, acc);
    };
    for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) {
      if (g[i][j] === "1") {
        cnt++;
        const acc = [];
        sink(i, j, acc);
        steps.push(A(`岛屿 #${cnt}：从 (${i},${j}) 出发，淹掉 ${acc.length} 个格子`, {
          grid: g.map(r => r.slice()), gridDone: acc, vars: { 岛屿数: cnt }
        }));
      }
    }
    steps.push(A(`一共 <b>${cnt}</b> 个岛屿`, { grid: g.map(r => r.slice()), vars: { 答案: cnt } }));
    return steps;
  };

  T[994] = p => {
    const g = p.viz.grid.map(r => r.slice()), m = g.length, n = g[0].length, steps = [];
    let fresh = 0, q = [];
    for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) { if (g[i][j] === 2) q.push([i, j]); if (g[i][j] === 1) fresh++; }
    steps.push(A(`多源 BFS：所有腐烂橘子同时入队，一圈 = 一分钟。新鲜橘子 ${fresh} 个。`, { grid: g.map(r => r.slice()), gridHi: q.map(([i, j]) => i + "," + j) }));
    let min = 0;
    while (q.length && fresh) {
      const next = [];
      q.forEach(([i, j]) => {
        [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([di, dj]) => {
          const x = i + di, y = j + dj;
          if (x >= 0 && x < m && y >= 0 && y < n && g[x][y] === 1) { g[x][y] = 2; fresh--; next.push([x, y]); }
        });
      });
      q = next; min++;
      steps.push(A(`第 ${min} 分钟：新腐烂 ${next.length} 个，剩余新鲜 ${fresh}`, { grid: g.map(r => r.slice()), gridHi: next.map(([i, j]) => i + "," + j), vars: { 分钟: min, 剩余: fresh } }));
    }
    steps.push(A(fresh ? "还有新鲜橘子无法腐烂 → 返回 -1" : `全部腐烂，用时 <b>${min}</b> 分钟`, { grid: g.map(r => r.slice()), vars: { 答案: fresh ? -1 : min } }));
    return steps;
  };

  T[207] = p => {
    const g = p.viz.grid, steps = [];
    steps.push(A("课程表：把先修关系看成有向图，判环 = 拓扑排序能否排完。", { grid: g }));
    const indeg = [0, 0];
    steps.push(A(`入度：课程 0 → ${indeg[0]}，课程 1 → ${indeg[1]}。入度为 0 的入队。`, { grid: g, map: { "入度[0]": indeg[0], "入度[1]": indeg[1] } }));
    steps.push(A("弹出队首，把它的后续课程入度减 1；减到 0 就入队。", { grid: g, map: { "入度[0]": 0, "入度[1]": 0 }, stack: [0, 1] }));
    steps.push(A("两个课程都出队 → 无环，可以学完", { grid: g, vars: { 结果: "true" } }));
    return steps;
  };

  /* ============ 回溯 ============ */
  T[46] = p => {
    const a = p.viz.arr, steps = [], path = [];
    steps.push(A("每个位置都试一个「还没用过」的数，到头就收集。", { arr: a, stack: [], map: {} }));
    const bt = (used) => {
      if (path.length === a.length) {
        steps.push(A(`得到一个排列：<b>[${path.join(", ")}]</b>`, { arr: a, stack: path.slice(), done: R(0, a.length - 1) }));
        return;
      }
      for (let i = 0; i < a.length; i++) {
        if (used[i]) continue;
        used[i] = true; path.push(a[i]);
        steps.push(A(`选 <b>${a[i]}</b> → path=[${path.join(", ")}]`, { arr: a, hi: [i], stack: path.slice(), map: { used: used.map((u, k) => u ? a[k] : "·").join(" ") } }));
        bt(used);
        path.pop(); used[i] = false;
        steps.push(A(`撤销 ${a[i]} → path=[${path.join(", ")}]`, { arr: a, hi: [i], stack: path.slice(), map: { used: used.map((u, k) => u ? a[k] : "·").join(" ") } }));
      }
    };
    bt(new Array(a.length).fill(false));
    return steps;
  };

  T[78] = p => {
    const a = p.viz.arr, steps = [], path = [];
    steps.push(A("每个节点都是一个子集（包括空集），用 start 保证只往右走。", { arr: a, stack: [] }));
    const bt = (start) => {
      steps.push(A(`收集 <b>[${path.join(", ")}]</b>`, { arr: a, stack: path.slice(), hi: start > 0 ? [start - 1] : [] }));
      for (let i = start; i < a.length; i++) {
        path.push(a[i]);
        steps.push(A(`选 ${a[i]} → [${path.join(", ")}]`, { arr: a, hi: [i], stack: path.slice() }));
        bt(i + 1);
        path.pop();
      }
    };
    bt(0);
    return steps;
  };

  T[22] = p => {
    const n = 3, steps = [], path = [];
    steps.push(A(`n=${n}：左括号 < n 就能加，右括号只有 close < open 时能加。`, { arr: [], stack: [] }));
    const bt = (open, close) => {
      if (path.length === 2 * n) {
        steps.push(A(`得到 <b>${path.join("")}</b>`, { stack: path.slice() }));
        return;
      }
      if (open < n) { path.push("("); steps.push(A(`加 "(" → ${path.join("")}`, { stack: path.slice(), vars: { open: open + 1, close } })); bt(open + 1, close); path.pop(); }
      if (close < open) { path.push(")"); steps.push(A(`加 ")" → ${path.join("")}`, { stack: path.slice(), vars: { open, close: close + 1 } })); bt(open, close + 1); path.pop(); }
    };
    bt(0, 0);
    return steps;
  };

  T[79] = p => {
    const g = p.viz.grid, w = p.viz.target, steps = [];
    let found = false;
    steps.push(A(`在网格里找 "<b>${w}</b>"：DFS + 原地标记，走不通就恢复。`, { grid: g }));
    const dfs = (i, j, k, acc) => {
      if (found) return true;
      if (k === w.length) { found = true; return true; }
      if (i < 0 || i >= g.length || j < 0 || j >= g[0].length || g[i][j] !== w[k]) return false;
      acc.push(i + "," + j);
      steps.push(A(`匹配到 '<b>${w[k]}</b>' 在 (${i},${j})，已匹配 "${w.slice(0, k + 1)}"`, { grid: g, gridDone: acc.slice() }));
      const tmp = g[i][j]; g[i][j] = "#";
      const ok = dfs(i + 1, j, k + 1, acc) || dfs(i - 1, j, k + 1, acc) || dfs(i, j + 1, k + 1, acc) || dfs(i, j - 1, k + 1, acc);
      g[i][j] = tmp; acc.pop();
      if (!ok) steps.push(A(`( ${i},${j} ) 走不通，撤销标记`, { grid: g }));
      return ok;
    };
    for (let i = 0; i < g.length && !found; i++) for (let j = 0; j < g[0].length && !found; j++) dfs(i, j, 0, []);
    steps.push(A(found ? "找到完整路径 ✓" : "不存在这样的路径", { grid: g, vars: { 结果: found } }));
    return steps;
  };

  T[51] = p => {
    const n = p.viz.grid.length, steps = [], board = Array.from({ length: n }, () => new Array(n).fill("·"));
    steps.push(A(`逐行放皇后，用「列 / 主对角 r-c / 副对角 r+c」三个集合判冲突。`, { grid: board }));
    const cols = new Set(), d1 = new Set(), d2 = new Set();
    const bt = (r) => {
      if (r === n) { steps.push(A("找到一个解 ✓", { grid: board.map(x => x.slice()), gridDone: R(0, n - 1).flatMap(i => R(0, n - 1).map(j => i + "," + j)) })); return; }
      for (let c = 0; c < n; c++) {
        if (cols.has(c) || d1.has(r - c) || d2.has(r + c)) continue;
        cols.add(c); d1.add(r - c); d2.add(r + c); board[r][c] = "Q";
        steps.push(A(`第 ${r} 行放 (${r},${c}) —— 列 ${c}、对角 ${r - c}/${r + c} 都空`, { grid: board.map(x => x.slice()), gridHi: [r + "," + c] }));
        bt(r + 1);
        board[r][c] = "·"; cols.delete(c); d1.delete(r - c); d2.delete(r + c);
      }
    };
    bt(0);
    return steps;
  };

  /* ============ 二分 ============ */
  const bsearch = (arr, target, mode) => {
    const steps = [];
    let l = 0, r = arr.length - 1;
    steps.push(A(`左闭右闭区间 [0, ${r}]，target = <b>${target}</b>。`, { arr, ptr: { l, r }, win: [l, r] }));
    while (l <= r) {
      const m = (l + r) >> 1;
      steps.push(A(`mid = (${l}+${r})/2 = <b>${m}</b>，nums[mid] = ${arr[m]}`, { arr, ptr: { l, m, r }, hi: [m], win: [l, r], vars: { mid: m } }));
      if (arr[m] === target) { steps.push(A(`命中！下标 <b>${m}</b>`, { arr, hi: [m], done: [m], vars: { 答案: m } })); return steps; }
      if (mode === "min") {
        if (arr[m] < arr[r]) { steps.push(A(`${arr[m]} < 右端 ${arr[r]} → 最小值在左半，r = mid`, { arr, ptr: { l, r: m }, done: R(m + 1, r) })); r = m; }
        else { steps.push(A(`${arr[m]} ≥ 右端 → 最小值在右半，l = mid+1`, { arr, ptr: { l: m + 1, r }, done: R(l, m) })); l = m + 1; }
        continue;
      }
      if (arr[m] < target) { steps.push(A(`${arr[m]} < ${target} → 目标在右，l = mid+1`, { arr, ptr: { l: m + 1, r }, done: R(l, m) })); l = m + 1; }
      else { steps.push(A(`${arr[m]} > ${target} → 目标在左，r = mid-1`, { arr, ptr: { l, r: m - 1 }, done: R(m, r) })); r = m - 1; }
    }
    steps.push(A(`区间为空，插入位置是 <b>${l}</b>`, { arr, ptr: { l }, vars: { 答案: l } }));
    return steps;
  };
  T[35] = p => bsearch(p.viz.arr, p.viz.target, "lower");
  T[34] = p => bsearch(p.viz.arr, p.viz.target, "lower");
  T[153] = p => bsearch(p.viz.arr, p.viz.arr[0], "min");
  T[33] = p => {
    const arr = p.viz.arr, target = p.viz.target, steps = [];
    let l = 0, r = arr.length - 1;
    steps.push(A(`旋转数组：每次必有一半是有序的，先判断哪半有序。target=${target}`, { arr, ptr: { l, r }, win: [l, r] }));
    while (l <= r) {
      const m = (l + r) >> 1;
      const leftSorted = arr[l] <= arr[m];
      steps.push(A(`mid=${m}（${arr[m]}）；${leftSorted ? `左半 [${l},${m}] 有序` : `右半 [${m},${r}] 有序`}`, { arr, ptr: { l, m, r }, hi: [m], win: [l, r] }));
      if (arr[m] === target) { steps.push(A(`命中下标 <b>${m}</b>`, { arr, hi: [m], vars: { 答案: m } })); return steps; }
      if (leftSorted) {
        if (arr[l] <= target && target < arr[m]) { steps.push(A(`target 在有序左半内部 → r = mid-1`, { arr, ptr: { l, r: m - 1 }, hi: R(l, m) })); r = m - 1; }
        else { steps.push(A(`target 不在左半 → l = mid+1`, { arr, ptr: { l: m + 1, r }, hi: R(m, r) })); l = m + 1; }
      } else {
        if (arr[m] < target && target <= arr[r]) { steps.push(A(`target 在有序右半内部 → l = mid+1`, { arr, ptr: { l: m + 1, r }, hi: R(m, r) })); l = m + 1; }
        else { steps.push(A(`target 不在右半 → r = mid-1`, { arr, ptr: { l, r: m - 1 }, hi: R(l, m) })); r = m - 1; }
      }
    }
    steps.push(A("未找到 → 返回 -1", { arr, vars: { 结果: -1 } }));
    return steps;
  };

  /* ============ 栈 ============ */
  T[20] = p => {
    const s = p.viz.arr, steps = [], st = [];
    const pair = { ")": "(", "]": "[", "}": "{" };
    steps.push(A("左括号入栈，右括号必须和栈顶配对。", { arr: s, stack: [] }));
    for (let i = 0; i < s.length; i++) {
      const ch = s[i];
      if (pair[ch]) {
        const ok = st.length && st[st.length - 1] === pair[ch];
        steps.push(A(`遇到 <b>${ch}</b>：栈顶是 ${st.length ? st[st.length - 1] : "空"} → ${ok ? "匹配，弹出" : "不匹配 ✗"}`, { arr: s, hi: [i], stack: st.slice() }));
        if (!ok) return steps;
        st.pop();
      } else {
        st.push(ch);
        steps.push(A(`遇到 <b>${ch}</b> → 入栈`, { arr: s, hi: [i], stack: st.slice() }));
      }
    }
    steps.push(A(st.length ? "最后栈不空 → 非法 ✗" : "栈空 → 合法 ✓", { arr: s, stack: st.slice(), vars: { 结果: st.length ? "false" : "true" } }));
    return steps;
  };

  T[155] = p => {
    const ops = p.viz.arr, data = [], mins = [], steps = [];
    steps.push(A("辅助栈同步记录「当前最小值」。", { map: {}, vars: {} }));
    ops.forEach(op => {
      if (op.indexOf("push") === 0) {
        const v = Number(op.slice(5, -1));
        data.push(v); mins.push(mins.length ? Math.min(v, mins[mins.length - 1]) : v);
        steps.push(A(`push(${v})：data=[${data}]，mins=[${mins}]（同步压入当前最小）`, { stack: data.slice(), map: Object.fromEntries(mins.map((m, i) => ["min@" + i, m])) }));
      } else if (op === "pop") {
        data.pop(); mins.pop();
        steps.push(A(`pop()：两个栈一起弹`, { stack: data.slice() }));
      } else if (op === "getMin") {
        steps.push(A(`getMin() → <b>${mins[mins.length - 1]}</b>，O(1)`, { stack: data.slice(), vars: { 最小值: mins[mins.length - 1] } }));
      }
    });
    return steps;
  };

  T[394] = p => {
    const s = p.viz.arr, steps = [], stack = [];
    let cur = "", num = 0;
    steps.push(A("遇到 [ 压入「已拼接的字符串 + 倍数」，遇到 ] 弹出并按倍数展开。", { arr: s, stack: [] }));
    s.forEach((ch, i) => {
      if (/^\d+$/.test(ch)) { num = num * 10 + Number(ch); steps.push(A(`数字位 ${ch} → 倍数累积为 ${num}`, { arr: s, hi: [i], stack: stack.slice(), vars: { num, cur } })); }
      else if (ch === "[") { stack.push(cur + "|" + num); cur = ""; num = 0; steps.push(A(`遇到 [ → 压栈 ${stack[stack.length - 1]}`, { arr: s, hi: [i], stack: stack.slice(), vars: { cur: '""' } })); }
      else if (ch === "]") { const top = stack.pop().split("|"); cur = top[0] + cur.repeat(Number(top[1])); steps.push(A(`遇到 ] → 弹出并展开："${cur}"`, { arr: s, hi: [i], stack: stack.slice(), vars: { cur } })); }
      else { cur += ch; steps.push(A(`字符 ${ch} → 拼到 cur: "${cur}"`, { arr: s, hi: [i], stack: stack.slice(), vars: { cur } })); }
    });
    steps.push(A(`解码结果 <b>"${cur}"</b>`, { arr: s, vars: { 结果: cur } }));
    return steps;
  };

  T[739] = p => {
    const t = p.viz.arr, steps = [], st = [], res = new Array(t.length).fill(0);
    steps.push(A("单调递减栈存下标；比栈顶热就结算。", { bars: t, stack: [] }));
    t.forEach((x, i) => {
      const popped = [];
      while (st.length && t[st[st.length - 1]] < x) { const j = st.pop(); res[j] = i - j; popped.push(j + "→" + (i - j)); }
      st.push(i);
      steps.push(A(i === 0 ? `i=0 入栈` : `i=${i}，T=${x}；结算 ${popped.length ? popped.join("、") : "无"} 天，然后入栈`, {
        bars: t, hi: [i], done: popped, stack: st.slice(), vars: { 已结算: res.filter(v => v > 0).length }
      }));
    });
    steps.push(A(`结果 <code>[${res.join(", ")}]</code>`, { bars: t, vars: { 结果: "[" + res.join(",") + "]" } }));
    return steps;
  };

  T[84] = p => {
    const h = p.viz.arr, steps = [], st = [];
    let best = 0;
    steps.push(A("单调递增栈：遇到更矮的柱子就结算栈顶那根能形成的最大矩形。", { bars: h, stack: [] }));
    h.concat([0]).forEach((x, i) => {
      while (st.length && h[st[st.length - 1]] > x) {
        const height = h[st.pop()];
        const left = st.length ? st[st.length - 1] : -1;
        const area = height * (i - left - 1);
        if (area > best) best = area;
        steps.push(A(`弹出高 ${height}：左边界 ${left}，右边界 ${i} → 面积 ${height}×${i - left - 1} = <b>${area}</b>，最优 ${best}`, {
          bars: h, hi: [left + 1], done: R(0, i - 1), stack: st.slice(), vars: { 当前: area, 最优: best }
        }));
      }
      if (i < h.length) st.push(i);
    });
    steps.push(A(`最大矩形面积 = <b>${best}</b>`, { bars: h, vars: { 答案: best } }));
    return steps;
  };

  /* ============ 堆 ============ */
  T[215] = p => {
    const arr = p.viz.arr, k = p.viz.target, steps = [], heap = [];
    steps.push(A(`维护大小 k=${k} 的小顶堆，堆顶就是第 k 大。`, { arr, stack: [] }));
    arr.forEach((x, i) => {
      heap.push(x); heap.sort((a, b) => a - b);
      let action = `入堆 ${x}`;
      if (heap.length > k) { action += `，超过 k 弹出最小值 ${heap[0]}`; heap.shift(); }
      steps.push(A(action + ` → 堆 = [${heap.join(", ")}]`, { arr, hi: [i], stack: heap.slice(), vars: { 堆顶: heap[0] } }));
    });
    steps.push(A(`堆顶 <b>${heap[0]}</b> 就是第 ${k} 大`, { arr, stack: heap.slice(), vars: { 答案: heap[0] } }));
    return steps;
  };

  T[347] = p => {
    const arr = p.viz.arr, k = p.viz.target, steps = [], cnt = {};
    arr.forEach(x => cnt[x] = (cnt[x] || 0) + 1);
    steps.push(A(`先统计频次：${JSON.stringify(cnt)}`, { arr, map: cp(cnt) }));
    const buckets = [];
    Object.keys(cnt).forEach(v => {
      const f = cnt[v];
      buckets[f] = buckets[f] || [];
      buckets[f].push(v);
    });
    const bucketMap = {};
    buckets.forEach((b, i) => { if (b) bucketMap["频次" + i] = b.join(","); });
    steps.push(A("再按「频次」建桶，从高频桶往下取，够 k 个就停。", { arr, map: bucketMap }));
    const res = [];
    for (let f = buckets.length - 1; f >= 0 && res.length < k; f--) if (buckets[f]) res.push.apply(res, buckets[f]);
    steps.push(A(`取到前 ${k} 个：<b>${res.join(", ")}</b>`, { arr, vars: { 答案: "[" + res.join(",") + "]" } }));
    return steps;
  };

  T[295] = p => {
    const ops = p.viz.arr, steps = [], small = [], large = [];
    steps.push(A("对顶堆：small（大顶，存小数）与 large（小顶，存大数）。", { stack: [], map: {} }));
    ops.forEach(op => {
      if (op.indexOf("add") === 0) {
        const v = Number(op.slice(4));
        small.push(v); small.sort((a, b) => b - a);
        large.push(small.shift()); large.sort((a, b) => a - b);
        if (large.length > small.length) { small.push(large.shift()); small.sort((a, b) => b - a); }
        steps.push(A(`add(${v})：小的一半 [${small}]，大的一半 [${large}]`, { stack: small.slice(), map: { large: "[" + large + "]" } }));
      } else {
        const med = small.length > large.length ? small[0] : (small[0] + large[0]) / 2;
        steps.push(A(`中位数 = <b>${med}</b>`, { stack: small.slice(), map: { large: "[" + large + "]" }, vars: { 中位数: med } }));
      }
    });
    return steps;
  };

  /* ============ 贪心 ============ */
  T[121] = p => {
    const arr = p.viz.arr, steps = [];
    let low = Infinity, best = 0;
    steps.push(A("维护历史最低价，每天算「今天卖」的利润。", { bars: arr, ptr: { i: 0 } }));
    arr.forEach((x, i) => {
      low = Math.min(low, x);
      best = Math.max(best, x - low);
      steps.push(A(`价格 ${x}：最低价 ${low}，今天卖能赚 <b>${x - low}</b>，最大利润 ${best}`, { bars: arr, hi: [i], ptr: { i }, vars: { 最低价: low, 最大利润: best } }));
    });
    steps.push(A(`最大利润 <b>${best}</b>`, { bars: arr, vars: { 答案: best } }));
    return steps;
  };

  T[55] = p => {
    const arr = p.viz.arr, steps = [];
    let far = 0;
    steps.push(A("维护能到达的最远下标 far；走到超过 far 的位置就失败。", { arr, ptr: { i: 0 }, vars: { far: 0 } }));
    for (let i = 0; i < arr.length; i++) {
      if (i > far) { steps.push(A(`i=${i} 已经超过可达范围 ${far} → 走不到 ✗`, { arr, hi: [i], vars: { far, 结果: false } })); return steps; }
      far = Math.max(far, i + arr[i]);
      steps.push(A(`i=${i}，能跳 ${arr[i]} 步 → 最远可达 <b>${far}</b>`, { arr, hi: [i], ptr: { i }, done: R(0, i - 1), vars: { far } }));
    }
    steps.push(A(`能到达终点 ✓（最远 ${far}）`, { arr, done: R(0, arr.length - 1), vars: { 结果: true } }));
    return steps;
  };

  T[45] = p => {
    const arr = p.viz.arr, steps = [];
    let end = 0, far = 0, steps_ = 0;
    steps.push(A("BFS 式贪心：当前步数能覆盖的区间走完就 +1 步，边界推到最远。", { arr, vars: { 步数: 0 } }));
    for (let i = 0; i < arr.length - 1; i++) {
      far = Math.max(far, i + arr[i]);
      if (i === end) { steps_++; end = far; steps.push(A(`走完一层 → 步数 ${steps_}，新边界 <b>${end}</b>`, { arr, hi: [i], win: [0, end], vars: { 步数: steps_, end, far } })); }
      else steps.push(A(`i=${i}，更新最远 ${far}（还没到层边界 ${end}）`, { arr, ptr: { i, end }, win: [0, end], vars: { 步数: steps_, end, far } }));
    }
    steps.push(A(`最少跳 <b>${steps_}</b> 次`, { arr, vars: { 答案: steps_ } }));
    return steps;
  };

  /* ============ DP ============ */
  T[70] = p => {
    const dp = p.viz.dp, steps = [];
    steps.push(A("f(n) = f(n-1) + f(n-2)：两个变量滚动即可。", { dp: dp.slice(), vars: { a: dp[0], b: dp[1] } }));
    for (let i = 2; i < dp.length; i++) {
      steps.push(A(`f(${i}) = f(${i - 1}) + f(${i - 2}) = ${dp[i - 1]} + ${dp[i - 2]} = <b>${dp[i]}</b>`, {
        dp: dp.slice(0, i + 1), dpHi: [i], vars: { a: dp[i - 1], b: dp[i] }
      }));
    }
    steps.push(A(`爬 ${dp.length - 1} 阶共 <b>${dp[dp.length - 1]}</b> 种方法`, { dp: dp.slice(), dpDone: dp.map((_, i) => i), vars: { 答案: dp[dp.length - 1] } }));
    return steps;
  };

  T[198] = p => {
    const nums = p.viz.dp, steps = [];
    const dp = [0, nums[0] || 0];
    for (let i = 1; i < nums.length; i++) dp[i + 1] = Math.max(dp[i], dp[i - 1] + nums[i]);
    steps.push(A("dp[i] = max(不偷第 i 家, 偷第 i 家 + dp[i-2])", { arr: nums, dp: dp.slice(0, 2) }));
    for (let i = 1; i < nums.length; i++) {
      steps.push(A(`第 ${i + 1} 家（${nums[i]}）：不偷=${dp[i]}，偷=${dp[i - 1] + nums[i]} → <b>${dp[i + 1]}</b>`, {
        arr: nums, dp: dp.slice(0, i + 2), dpHi: [i + 1], hi: [i], vars: { 前一家: dp[i], 前两家: dp[i - 1] }
      }));
    }
    steps.push(A(`最多能偷 <b>${dp[nums.length]}</b>`, { arr: nums, dp: dp.slice(), vars: { 答案: dp[nums.length] } }));
    return steps;
  };

  T[322] = p => {
    const dp = p.viz.dp, steps = [], coins = [1, 2, 5];
    steps.push(A(`完全背包求最小个数，硬币 ${coins.join("/")}。dp[i] = min(dp[i-c]+1)。`, { dp: dp.slice(0, 1), vars: { 硬币: coins.join(",") } }));
    for (let i = 1; i < dp.length; i++) {
      const cands = coins.filter(c => c <= i).map(c => (dp[i - c] === Infinity ? "∞" : dp[i - c]) + "+1");
      steps.push(A(`凑 ${i}：候选 ${cands.join(" / ")} → 最小 <b>${dp[i]}</b>`, { dp: dp.slice(0, i + 1), dpHi: [i], vars: { i, 候选: cands.join(" ") } }));
    }
    steps.push(A(`凑 ${dp.length - 1} 最少需要 <b>${dp[dp.length - 1]}</b> 枚`, { dp: dp.slice(), dpDone: dp.map((_, i) => i), vars: { 答案: dp[dp.length - 1] } }));
    return steps;
  };

  T[300] = p => {
    const arr = p.viz.arr, steps = [], tails = [];
    steps.push(A("tails[i] = 长度 i+1 的递增子序列的最小结尾；它不是答案序列，长度才是。", { arr, stack: [] }));
    arr.forEach((x, i) => {
      let lo = 0, hi = tails.length;
      while (lo < hi) { const m = (lo + hi) >> 1; if (tails[m] < x) lo = m + 1; else hi = m; }
      const replaced = lo < tails.length;
      if (replaced) tails[lo] = x; else tails.push(x);
      steps.push(A(`x=${x} → ${replaced ? `替换 tails[${lo}]` : "扩展"}；tails = [${tails.join(", ")}]，LIS 长度 <b>${tails.length}</b>`, {
        arr, hi: [i], stack: tails.slice(), vars: { LIS: tails.length }
      }));
    });
    steps.push(A(`最长递增子序列长度 = <b>${tails.length}</b>`, { arr, stack: tails.slice(), vars: { 答案: tails.length } }));
    return steps;
  };

  T[152] = p => {
    const arr = p.viz.arr, steps = [];
    let mx = arr[0], mn = arr[0], best = arr[0];
    steps.push(A("乘法会负负得正，所以要同时维护最大值和最小值。", { arr, ptr: { i: 0 }, vars: { max: mx, min: mn, 最优: best } }));
    for (let i = 1; i < arr.length; i++) {
      const a = mx * arr[i], b = mn * arr[i];
      const nmx = Math.max(arr[i], a, b), nmn = Math.min(arr[i], a, b);
      mx = nmx; mn = nmn; best = Math.max(best, mx);
      steps.push(A(`x=${arr[i]}：候选 ${a}, ${b}, ${arr[i]} → max=${mx}，min=${mn}，全局最优 ${best}`, {
        arr, hi: [i], done: R(0, i - 1), vars: { max: mx, min: mn, 最优: best }
      }));
    }
    steps.push(A(`乘积最大子数组 = <b>${best}</b>`, { arr, vars: { 答案: best } }));
    return steps;
  };

  T[416] = p => {
    const nums = [1, 5, 11, 5], target = 11, steps = [];
    const dp = new Array(target + 1).fill(false); dp[0] = true;
    steps.push(A(`总和 ${nums.reduce((a, b) => a + b, 0)}，target = ${target}；01 背包，一维数组<b>倒序</b>遍历。`, { arr: nums, dp: dp.map(v => v ? 1 : 0) }));
    nums.forEach((x, i) => {
      for (let j = target; j >= x; j--) dp[j] = dp[j] || dp[j - x];
      steps.push(A(`处理数字 ${x}：倒序更新 dp（保证每个数只用一次）→ 能凑出 ${dp[target] ? target : "尚未"} `, {
        arr: nums, hi: [i], dp: dp.map(v => v ? 1 : 0), vars: { x }
      }));
    });
    steps.push(A(dp[target] ? "可以分割成两个等和子集 ✓" : "无法分割", { arr: nums, dp: dp.map(v => v ? 1 : 0), vars: { 结果: dp[target] } }));
    return steps;
  };

  T[62] = p => {
    const g = [[1, 1, 1], [1, 2, 3], [1, 3, 6]], steps = [];
    steps.push(A("dp[i][j] = dp[i-1][j] + dp[i][j-1]：只能从上方或左方来。", { grid: g.map(r => r.slice()) }));
    for (let i = 1; i < 3; i++) for (let j = 1; j < 3; j++) {
      steps.push(A(`(${i},${j}) = 上 ${g[i - 1][j]} + 左 ${g[i][j - 1]} = <b>${g[i][j]}</b>`, {
        grid: g.map(r => r.slice()), gridHi: [i + "," + j], gridDone: [i - 1 + "," + j, i + "," + (j - 1)]
      }));
    }
    steps.push(A(`到达终点的路径数 = <b>${g[2][2]}</b>`, { grid: g.map(r => r.slice()), vars: { 答案: g[2][2] } }));
    return steps;
  };

  T[64] = p => {
    const g = p.viz.grid.map(r => r.slice()), m = g.length, n = g[0].length, steps = [];
    steps.push(A("原地 DP：每个格子累加「上方 / 左方」的较小值。", { grid: g.map(r => r.slice()) }));
    for (let j = 1; j < n; j++) g[0][j] += g[0][j - 1];
    for (let i = 1; i < m; i++) g[i][0] += g[i - 1][0];
    steps.push(A("先处理第一行和第一列（它们只有一个来源）", { grid: g.map(r => r.slice()) }));
    for (let i = 1; i < m; i++) for (let j = 1; j < n; j++) {
      g[i][j] += Math.min(g[i - 1][j], g[i][j - 1]);
      steps.push(A(`(${i},${j})：min(上 ${g[i - 1][j]}, 左 ${g[i][j - 1]}) + 自身 = <b>${g[i][j]}</b>`, {
        grid: g.map(r => r.slice()), gridHi: [i + "," + j]
      }));
    }
    steps.push(A(`最小路径和 = <b>${g[m - 1][n - 1]}</b>`, { grid: g.map(r => r.slice()), vars: { 答案: g[m - 1][n - 1] } }));
    return steps;
  };

  T[5] = p => {
    const s = p.viz.arr, steps = [];
    let start = 0, maxLen = 1;
    steps.push(A("枚举每个中心（含奇数/偶数两种），向两边扩。", { arr: s, ptr: { l: 0, r: 0 } }));
    for (let i = 0; i < s.length; i++) {
      [[i, i], [i, i + 1]].forEach(([l0, r0]) => {
        let l = l0, r = r0;
        while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++; }
        const len = r - l - 1;
        if (len > maxLen) { maxLen = len; start = i - Math.floor((len - 1) / 2); }
        steps.push(A(`中心 ${l0}${r0 !== l0 ? "/" + r0 : ""} 扩展出长度 <b>${len}</b>；当前最长 ${maxLen}`, {
          arr: s, win: [l + 1, r - 1], hi: R(l + 1, r - 1), ptr: { l: l + 1, r: r - 1 }, vars: { 最长: maxLen }
        }));
      });
    }
    steps.push(A(`最长回文子串 = <b>"${s.slice(start, start + maxLen).join("")}"</b>`, { arr: s, win: [start, start + maxLen - 1], vars: { 答案: s.slice(start, start + maxLen).join("") } }));
    return steps;
  };

  T[1143] = p => {
    const cols = 4, dp = p.viz.dp, steps = [];
    const blank = (filled) => dp.map((v, i) => i < filled ? v : null);
    steps.push(A("二维 DP：字符相同 ← 左上 +1；不同 ← max(上, 左)。", { dp: blank(4), dpDim: 4 }));
    for (let k = 5; k < dp.length; k++) {
      steps.push(A(`dp[${Math.floor(k / cols)}][${k % cols}] = <b>${dp[k]}</b>`, { dp: blank(k + 1), dpDim: 4, dpHi: [k] }));
    }
    steps.push(A(`LCS 长度 = <b>${dp[dp.length - 1]}</b>`, { dp: dp.slice(), dpDim: 4, dpDone: dp.map((_, i) => i) }));
    return steps;
  };

  T[72] = p => {
    const cols = 4, dp = p.viz.dp, steps = [];
    const blank = (filled) => dp.map((v, i) => i < filled ? v : null);
    steps.push(A("三种操作 = 三个方向：替换(左上)、删除(上)、插入(左)，取最小 +1。", { dp: blank(4), dpDim: 4 }));
    for (let k = 5; k < dp.length; k++) {
      steps.push(A(`dp[${Math.floor(k / cols)}][${k % cols}] = <b>${dp[k]}</b>（相同则继承左上，否则 1+min(三向)）`, {
        dp: blank(k + 1), dpDim: 4, dpHi: [k]
      }));
    }
    steps.push(A(`编辑距离 = <b>${dp[dp.length - 1]}</b>`, { dp: dp.slice(), dpDim: 4, dpDone: dp.map((_, i) => i) }));
    return steps;
  };

  T[279] = p => {
    const dp = p.viz.dp, steps = [];
    steps.push(A("完全背包：dp[i] = min(dp[i-j²]+1)。", { dp: dp.slice(0, 1) }));
    for (let i = 1; i < dp.length; i++) {
      const cands = [];
      for (let j = 1; j * j <= i; j++) cands.push(`${i - j * j}+1`);
      steps.push(A(`凑 ${i}：${cands.join(" / ")} → <b>${dp[i]}</b>`, { dp: dp.slice(0, i + 1), dpHi: [i] }));
    }
    steps.push(A(`最少需要 <b>${dp[dp.length - 1]}</b> 个完全平方数`, { dp: dp.slice(), dpDone: dp.map((_, i) => i), vars: { 答案: dp[dp.length - 1] } }));
    return steps;
  };

  T[118] = p => {
    const rows = [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1]], steps = [], flat = [];
    steps.push(A("每行首尾是 1，中间 = 上一行相邻两数之和。", { dp: [1] }));
    rows.forEach((r, i) => {
      if (i === 0) { steps.push(A("第 0 行：[1]", { dp: [1] })); }
      else steps.push(A(`第 ${i} 行：[${r.join(", ")}]`, { dp: flat.concat(r), dpDim: r.length, dpHi: r.map((_, k) => flat.length + k) }));
      flat.push.apply(flat, r);
    });
    steps.push(A(`共 ${rows.length} 行`, { dp: flat, dpDim: 4 }));
    return steps;
  };

  /* ============ 技巧 ============ */
  T[136] = p => {
    const arr = p.viz.arr, steps = [];
    let ans = 0;
    steps.push(A("全部异或：成对的自动抵消（a^a=0），剩下唯一的那个。", { arr, vars: { ans: 0 } }));
    arr.forEach((x, i) => {
      ans ^= x;
      steps.push(A(`${ans ^ x} ^ ${x} = <b>${ans}</b>`, { arr, hi: [i], vars: { ans } }));
    });
    steps.push(A(`唯一出现的数是 <b>${ans}</b>`, { arr, vars: { 答案: ans } }));
    return steps;
  };

  T[169] = p => {
    const arr = p.viz.arr, steps = [];
    let cand = null, cnt = 0;
    steps.push(A("摩尔投票：不同就抵消，相同就加票。", { arr, vars: { 候选: "-", 票数: 0 } }));
    arr.forEach((x, i) => {
      if (cnt === 0) cand = x;
      cnt += x === cand ? 1 : -1;
      steps.push(A(`x=${x}：${x === cand ? "支持候选 +1" : "抵消 -1"} → 候选 <b>${cand}</b>，票数 ${cnt}`, {
        arr, hi: [i], vars: { 候选: cand, 票数: cnt }
      }));
    });
    steps.push(A(`多数元素是 <b>${cand}</b>（票数 ${cnt} > 0）`, { arr, vars: { 答案: cand } }));
    return steps;
  };

  T[75] = p => {
    const arr = p.viz.arr.slice(), steps = [];
    let p0 = 0, i = 0, p2 = arr.length - 1;
    steps.push(A("三指针：[0,p0) 是 0，(p2,n-1] 是 2，中间是 1。", { arr: arr.slice(), ptr: { p0, i, p2 } }));
    while (i <= p2) {
      if (arr[i] === 0) { const t = arr[p0]; arr[p0] = arr[i]; arr[i] = t; p0++; i++; }
      else if (arr[i] === 2) { const t = arr[p2]; arr[p2] = arr[i]; arr[i] = t; p2--; }
      else i++;
      steps.push(A(`处理后：${arr.join(" ")}（p0=${p0}, i=${i}, p2=${p2}）`, { arr: arr.slice(), ptr: { p0, i, p2 }, vars: { p0, i, p2 } }));
    }
    steps.push(A(`结果 ${arr.join(" ")}`, { arr: arr.slice(), done: R(0, arr.length - 1) }));
    return steps;
  };

  T[31] = p => {
    const arr = p.viz.arr.slice(), n = arr.length, steps = [];
    steps.push(A("① 从右往左找第一个升序对 a[i] < a[i+1]", { arr: arr.slice() }));
    let i = n - 2;
    while (i >= 0 && arr[i] >= arr[i + 1]) i--;
    steps.push(A(i < 0 ? "整体降序 → 直接反转成最小排列" : `找到 i=${i}（${arr[i]} < ${arr[i + 1]}）`, { arr: arr.slice(), hi: [i, i + 1] }));
    if (i >= 0) {
      let j = n - 1;
      while (arr[j] <= arr[i]) j--;
      steps.push(A(`② 从右往左找第一个 > ${arr[i]} 的数：j=${j}（${arr[j]}），交换`, { arr: arr.slice(), hi: [i, j] }));
      const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
      steps.push(A(`交换后：${arr.join(" ")}`, { arr: arr.slice(), hi: [i, j] }));
    }
    const l0 = i + 1;
    arr.splice(l0, n - l0, ...arr.slice(l0).reverse());
    steps.push(A(`③ 反转后缀 [${l0}, ${n - 1}]（它一定是降序）→ <b>${arr.join(" ")}</b>`, { arr: arr.slice(), hi: R(l0, n - 1) }));
    return steps;
  };

  T[287] = p => {
    const arr = p.viz.arr, steps = [];
    let slow = 0, fast = 0;
    steps.push(A("把 i → nums[i] 看成链表，重复数就是环入口。", { arr, ptr: { i: 0 } }));
    do {
      slow = arr[slow]; fast = arr[arr[fast]];
      steps.push(A(`slow → ${slow}，fast → ${fast}`, { arr, ptr: { slow, fast }, hi: [slow] }));
    } while (slow !== fast);
    steps.push(A(`相遇于下标 ${slow}；让一个指针回到 0，同步走`, { arr, hi: [slow] }));
    let p1 = 0;
    while (p1 !== slow) { p1 = arr[p1]; slow = arr[slow]; }
    steps.push(A(`再相遇处 <b>${p1}</b> 就是重复数`, { arr, hi: [p1], vars: { 答案: p1 } }));
    return steps;
  };

  /* ============ 通用回退 ============ */
  function generic(p) {
    const v = p.viz || {}, steps = [];
    const k = v.k;
    if (k === "array" && v.arr) {
      const arr = v.arr;
      steps.push(A(`数据结构形态：${arr.length} 个元素。开始从左往右扫描，注意每一步的「不变量」。`, { arr }));
      arr.forEach((x, i) => {
        steps.push(A(`i=${i}，值 = <b>${x}</b>` + (v.target != null ? `（目标 ${v.target}）` : ""), {
          arr, hi: [i], done: R(0, i - 1), ptr: { i }, vars: v.target != null ? { target: v.target } : {}
        }));
      });
      steps.push(A("扫描结束。回到「一句话本质」，自己复述一遍判断条件。", { arr, done: R(0, arr.length - 1) }));
      return steps;
    }
    if (k === "bars" && v.arr) {
      const arr = v.arr;
      steps.push(A("柱状图形态：高度即数值。", { bars: arr }));
      arr.forEach((x, i) => steps.push(A(`第 ${i} 根柱子高度 <b>${x}</b>`, { bars: arr, hi: [i], done: R(0, i - 1) })));
      return steps;
    }
    if (k === "grid" && v.grid) {
      const g = v.grid;
      steps.push(A(`矩阵 ${g.length} × ${g[0].length}，逐格扫描。`, { grid: g }));
      const done = [];
      for (let i = 0; i < g.length; i++) for (let j = 0; j < g[0].length; j++) {
        steps.push(A(`(${i},${j}) = <b>${g[i][j]}</b>`, { grid: g, gridHi: [i + "," + j], gridDone: done.slice() }));
        done.push(i + "," + j);
      }
      steps.push(A("扫描完成", { grid: g, gridDone: done.slice() }));
      return steps;
    }
    if (k === "list" && v.arr) {
      const a = v.arr;
      steps.push(A("链表形态：注意 next 指针的走向。", { list: a }));
      a.forEach((x, i) => steps.push(A(`节点 ${i}：值 <b>${x}</b>`, { list: a, listHi: [i], listDone: R(0, i - 1), listPtr: { [i]: "cur" } })));
      steps.push(A("走完链表", { list: a, listDone: R(0, a.length - 1) }));
      return steps;
    }
    if (k === "tree" && v.tree) {
      const t = v.tree, order = [];
      const dfs = i => { if (i >= t.length || t[i] == null) return; order.push(i); dfs(2 * i + 1); dfs(2 * i + 2); };
      dfs(0);
      steps.push(A("先序遍历（根 → 左 → 右），感受递归的走法。", { tree: t, treeHi: [0] }));
      order.forEach((idx, n) => steps.push(A(`访问 <b>${t[idx]}</b>`, { tree: t, treeHi: [idx], treeDone: order.slice(0, n) })));
      steps.push(A(`先序序列：${order.map(i => t[i]).join(" → ")}`, { tree: t, treeDone: order }));
      return steps;
    }
    if (k === "dp" && v.dp) {
      const dp = v.dp;
      steps.push(A("DP 表：一格一格填，注意依赖方向。", { dp: dp.slice(0, 1) }));
      for (let i = 1; i < dp.length; i++) steps.push(A(`dp[${i}] = <b>${dp[i]}</b>`, { dp: dp.slice(0, i + 1), dpHi: [i] }));
      steps.push(A("填表完成", { dp: dp.slice(), dpDone: dp.map((_, i) => i) }));
      return steps;
    }
    return steps;
  }


  /* ---------- 精确行号映射（对应 C++ 模板，帧序 → 行号） ----------
     手工对齐高频题；没有列出的题目走自动语义匹配。 */
  const LINES = {
    1:   [4, 7, 8, 8],
    3:   [4, 6, 7, 8, 9],
    11:  [4, 6, 7, 8, 10],
    15:  [4, 10, 12, 14, 16],
    21:  [3, 5, 6, 7, 8],
    42:  [5, 8, 12, 8, 12, 8, 12, 8, 12, 8, 12, 8, 17],
    46:  [4, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    53:  [4, 6, 7, 9],
    70:  [4, 5, 7],
    94:  [6, 8, 9, 10, 11],
    102: [5, 8, 9, 10],
    121: [4, 5, 6, 7],
    200: [7, 13, 13, 14, 8],
    206: [4, 7, 8, 9, 7, 8, 11],
    300: [4, 6, 7, 8],
    322: [4, 7, 8]
  };


  /* ---------- 逐行序列：让每一帧落在不同代码行上，循环会回绕 ---------- */
  function isExecLine(line) {
    const t = (line || "").trim();
    if (!t) return false;
    if (/^[{}]+;?$/.test(t)) return false;
    if (/^(\/\/|\/\*|\*|#)/.test(t)) return false;
    if (/^(public|private|protected)\s*:/.test(t)) return false;
    if (/^(else|else if)/.test(t)) return true;
    return true;
  }

  function cppProfile(p) {
    const code = p && p.cpp ? p.cpp : "";
    const lines = code.split("\n");
    let head = -1, end = -1;
    for (let i = 0; i < lines.length; i++) {
      const t = lines[i];
      if (/^\s*(for|while)\s*\(/.test(t)) {
        const ind = t.match(/^\s*/)[0].length;
        head = i + 1;
        end = head;
        for (let j = i + 1; j < lines.length; j++) {
          const s2 = lines[j];
          if (!s2.trim()) continue;
          const ind2 = s2.match(/^\s*/)[0].length;
          if (ind2 <= ind) break;
          end = j + 1;
        }
        break;
      }
    }
    const pre = [], body = [], post = [];
    lines.forEach((l, i) => {
      const ln = i + 1;
      if (!isExecLine(l)) return;
      if (head < 0 || ln < head) pre.push(ln);
      else if (ln <= end) body.push(ln);
      else post.push(ln);
    });
    return { lines, head, end, pre, body, post };
  }

  /* 生成长度 = 帧数 的行号序列：初始化 → 循环体轮转 → 收尾 */
  function autoSequence(p, frameCount) {
    const prof = cppProfile(p);
    const total = Math.max(1, frameCount);
    if (prof.head < 0 || !prof.body.length) {
      const seq = (prof.pre.concat(prof.body, prof.post)).filter(Boolean);
      if (!seq.length) return [];
      const out = [];
      for (let k = 0; k < total; k++) out.push(seq[Math.min(k, seq.length - 1)]);
      return out;
    }
    const pre = prof.pre.slice(0, Math.max(1, Math.ceil(total * 0.28)));
    const postLen = total > 6 ? 1 : 0;
    const midLen = Math.max(1, total - pre.length - postLen);
    const out = pre.slice();
    for (let k = 0; k < midLen; k++) out.push(prof.body[k % prof.body.length]);
    if (postLen) out.push(prof.post.length ? prof.post[prof.post.length - 1] : prof.body[prof.body.length - 1]);
    while (out.length < total) out.push(out[out.length - 1]);
    return out.slice(0, total);
  }

  function withLines(n, steps, p) {
    const manual = LINES[n];
    let seq;
    if (manual && manual.length) {
      seq = manual.slice(0, steps.length);
      if (seq.length < steps.length) {
        const prof = cppProfile(p);
        const body = prof.body.length ? prof.body : [seq[seq.length - 1] || 1];
        let k = 0;
        while (seq.length < steps.length) { seq.push(body[k % body.length]); k++; }
      }
      steps._manualLines = true;
    } else {
      seq = autoSequence(p, steps.length);
    }
    if (seq && seq.length) steps._lineMap = seq;
    return steps;
  }

  window.TRACE = {
    build(p, variant) {
      /* ---- 第二套解法（C++(2)）：自带 trace，行号已按 cpp2 写好，
         所以跳过 EXACT/LINEFIX/HEADFIX，只用 ENV 生成变量快照。
         ENV 要按 cpp2 的文本来校正行号，所以这里换一份 p。 ---- */
      if (variant === 2 && window.DBG2 && window.DBG2[p.n]) {
        try {
          let steps = window.DBG2[p.n](p);
          if (steps && steps.length) {
            const pp = Object.assign({}, p, { cpp: p.cpp2 || p.cpp });
            if (window.ENV) steps = window.ENV.apply(pp, steps);
            steps._lineMap = steps.map(f => f.line || 1);
            steps._debug = true;
            return steps;
          }
        } catch (e) { console.warn("dbg2 fail", p.n, e); }
      }
      const dbg = window.DBG && window.DBG[p.n];
      if (dbg) {
        try {
          let steps = dbg(p);
          if (steps && steps.length) {
            const done = window.EXACT && window.EXACT.apply(p.n, steps);
            if (!done && window.LINEFIX) steps = window.LINEFIX.apply(p, steps);
            if (window.ENV) steps = window.ENV.apply(p, steps);
            /* fillgap 已停用：自动插入会破坏控制流；只保留函数开头初始化的安全补帧 */
            if (window.HEADFIX) steps = window.HEADFIX.apply(p, steps);
            steps._lineMap = steps.map(f => f.line || 1);
            steps._debug = true;
            return steps;
          }
        } catch (e) { console.warn("dbg fail", p.n, e); }
      }
      try {
        let st = withLines(p.n, T[p.n] ? T[p.n](p) : generic(p), p);
        if (window.ENV) st = window.ENV.apply(p, st);
        return st;
      } catch (e) {
        console.warn("trace fail", p.n, e);
        return withLines(p.n, generic(p), p);
      }
    },
    has(n) { return !!T[n]; }
  };
})();
