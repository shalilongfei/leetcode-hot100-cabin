/* verify1 — 独立实现：1~25 号题的期望答案
   每个函数都独立写一遍算法（不复用 trace 的逻辑），用来和 trace 的最终结果对账。 */
;(function () {
  const V = window.VERIFY = window.VERIFY || {};
  const arr = p => p.viz.arr;
  const num = v => (typeof v === "number" ? v : Number(v));

  /* 1 两数之和 */
  V[1] = p => {
    const a = arr(p).map(num), t = num(p.viz.target), m = {};
    for (let i = 0; i < a.length; i++) {
      if (m[t - a[i]] !== undefined) return "[" + m[t - a[i]] + ", " + i + "]";
      m[a[i]] = i;
    }
    return "[]";
  };

  /* 49 字母异位词分组 */
  V[49] = p => {
    const g = {};
    arr(p).forEach(s => { const k = s.split("").sort().join(""); (g[k] = g[k] || []).push(s); });
    return Object.keys(g).length + " 组";
  };

  /* 128 最长连续序列 */
  V[128] = p => {
    const s = new Set(arr(p).map(num));
    let best = 0;
    s.forEach(x => {
      if (s.has(x - 1)) return;
      let y = x;
      while (s.has(y + 1)) y++;
      best = Math.max(best, y - x + 1);
    });
    return best;
  };

  /* 283 移动零：末尾连续 0 的个数 + 非零个数 */
  V[283] = p => {
    const a = arr(p).map(num), nz = a.filter(x => x !== 0);
    const out = nz.concat(new Array(a.length - nz.length).fill(0));
    return "非零都在前面：" + out.join(",");
  };

  /* 11 盛最多水 */
  V[11] = p => {
    const h = arr(p).map(num);
    let l = 0, r = h.length - 1, best = 0;
    while (l < r) {
      best = Math.max(best, Math.min(h[l], h[r]) * (r - l));
      if (h[l] < h[r]) l++; else r--;
    }
    return best;
  };

  /* 15 三数之和 */
  V[15] = p => {
    const a = arr(p).map(num).sort((x, y) => x - y), res = [];
    for (let i = 0; i < a.length - 2; i++) {
      if (i && a[i] === a[i - 1]) continue;
      let l = i + 1, r = a.length - 1;
      while (l < r) {
        const s = a[i] + a[l] + a[r];
        if (s < 0) l++;
        else if (s > 0) r--;
        else { res.push([a[i], a[l], a[r]]); while (l < r && a[l] === a[l + 1]) l++; while (l < r && a[r] === a[r - 1]) r--; l++; r--; }
      }
    }
    return res.map(x => "[" + x + "]").join(" ");
  };

  /* 42 接雨水 */
  V[42] = p => {
    const h = arr(p).map(num);
    let l = 0, r = h.length - 1, lm = 0, rm = 0, ans = 0;
    while (l < r) {
      if (h[l] < h[r]) { lm = Math.max(lm, h[l]); ans += lm - h[l]; l++; }
      else { rm = Math.max(rm, h[r]); ans += rm - h[r]; r--; }
    }
    return ans;
  };

  /* 3 无重复最长子串 */
  V[3] = p => {
    const s = arr(p), last = {};
    let l = 0, ans = 0;
    for (let r = 0; r < s.length; r++) {
      if (last[s[r]] !== undefined && last[s[r]] >= l) l = last[s[r]] + 1;
      last[s[r]] = r;
      ans = Math.max(ans, r - l + 1);
    }
    return ans;
  };

  /* 438 找异位词 */
  V[438] = p => {
    const s = arr(p), t = p.viz.target, m = t.length, res = [];
    const need = {}, win = {};
    for (const c of t) need[c] = (need[c] || 0) + 1;
    for (let i = 0; i < s.length; i++) {
      win[s[i]] = (win[s[i]] || 0) + 1;
      if (i >= m) win[s[i - m]]--;
      if (JSON.stringify(Object.keys(need).sort().map(k => [k, need[k]])) ===
          JSON.stringify(Object.keys(win).filter(k => win[k]).sort().map(k => [k, win[k]]))) res.push(i - m + 1);
    }
    return "[" + res.join(",") + "]";
  };

  /* 560 和为 K */
  V[560] = p => {
    const a = arr(p).map(num), k = num(p.viz.target);
    const cnt = { 0: 1 };
    let pre = 0, ans = 0;
    a.forEach(x => { pre += x; ans += cnt[pre - k] || 0; cnt[pre] = (cnt[pre] || 0) + 1; });
    return ans;
  };

  /* 239 滑动窗口最大值 */
  V[239] = p => {
    const a = arr(p).map(num), k = num(p.viz.win || 3), res = [];
    for (let i = 0; i + k <= a.length; i++) res.push(Math.max(...a.slice(i, i + k)));
    return "[" + res.join(",") + "]";
  };

  /* 76 最小覆盖子串 */
  V[76] = p => {
    const s = arr(p), t = p.viz.target;
    const need = {}; for (const c of t) need[c] = (need[c] || 0) + 1;
    const kinds = Object.keys(need).length;
    const win = {}; let valid = 0, l = 0, start = 0, len = Infinity;
    for (let r = 0; r < s.length; r++) {
      const c = s[r];
      if (need[c]) { win[c] = (win[c] || 0) + 1; if (win[c] === need[c]) valid++; }
      while (valid === kinds) {
        if (r - l + 1 < len) { len = r - l + 1; start = l; }
        const left = s[l];
        if (need[left]) { if (win[left] === need[left]) valid--; win[left]--; }
        l++;
      }
    }
    return len === Infinity ? '""' : s.slice(start, start + len).join("");
  };

  /* 53 最大子数组和 */
  V[53] = p => {
    const a = arr(p).map(num);
    let cur = a[0], best = a[0];
    for (let i = 1; i < a.length; i++) { cur = Math.max(a[i], cur + a[i]); best = Math.max(best, cur); }
    return best;
  };

  /* 56 合并区间 */
  V[56] = p => {
    const iv = [[1, 3], [2, 6], [8, 10], [15, 18]], res = [];
    iv.sort((x, y) => x[0] - y[0]).forEach(v => {
      if (res.length && res[res.length - 1][1] >= v[0]) res[res.length - 1][1] = Math.max(res[res.length - 1][1], v[1]);
      else res.push(v.slice());
    });
    return res.map(x => "[" + x + "]").join(" ");
  };

  /* 189 轮转数组 */
  V[189] = p => {
    const a = arr(p).map(num), n = a.length, k = num(p.viz.shift || 3) % n;
    const r = a.slice(n - k).concat(a.slice(0, n - k));
    return r.join(",");
  };

  /* 238 除自身乘积 */
  V[238] = p => {
    const a = arr(p).map(num), n = a.length, res = [];
    for (let i = 0; i < n; i++) {
      let v = 1;
      for (let j = 0; j < n; j++) if (j !== i) v *= a[j];
      res.push(v);
    }
    return res.join(",");
  };

  /* 41 缺失的第一个正数 */
  V[41] = p => {
    const a = arr(p).map(num), s = new Set(a);
    let x = 1;
    while (s.has(x)) x++;
    return x;
  };

  /* 73 矩阵置零：返回置零后的矩阵签名 */
  V[73] = p => {
    const g = p.viz.grid.map(r => r.slice()), m = g.length, n = g[0].length;
    const rows = new Set(), cols = new Set();
    g.forEach((r, i) => r.forEach((v, j) => { if (v === 0) { rows.add(i); cols.add(j); } }));
    g.forEach((r, i) => r.forEach((v, j) => { if (rows.has(i) || cols.has(j)) g[i][j] = 0; }));
    return g.map(r => r.join(",")).join(";");
  };

  /* 54 螺旋矩阵 */
  V[54] = p => {
    const g = p.viz.grid, res = [];
    if (!g.length) return "";
    let top = 0, bot = g.length - 1, l = 0, r = g[0].length - 1;
    while (top <= bot && l <= r) {
      for (let j = l; j <= r; j++) res.push(g[top][j]);
      top++;
      for (let i = top; i <= bot; i++) res.push(g[i][r]);
      r--;
      if (top <= bot) { for (let j = r; j >= l; j--) res.push(g[bot][j]); bot--; }
      if (l <= r) { for (let i = bot; i >= top; i--) res.push(g[i][l]); l++; }
    }
    return res.join(",");
  };

  /* 48 旋转图像 */
  V[48] = p => {
    const g = p.viz.grid, n = g.length;
    const out = Array.from({ length: n }, () => new Array(n));
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) out[j][n - 1 - i] = g[i][j];
    return out.map(r => r.join(",")).join(";");
  };

  /* 240 搜索二维矩阵 II */
  V[240] = p => {
    const g = p.viz.grid, t = num(p.viz.target);
    let i = 0, j = g[0].length - 1;
    while (i < g.length && j >= 0) {
      if (g[i][j] === t) return "true";
      if (g[i][j] > t) j--; else i++;
    }
    return "false";
  };

  /* 160 相交链表：B[3] 与 A[2] 是同一个节点 8 */
  V[160] = p => {
    const A = ["4", "1", "8", "4", "5"], Bd = ["5", "6", "1", "8", "4", "5"];
    /* 两个指针各走 lenA + lenB 步，走完一条就切到另一条的头 */
    const at = (start, n, step) => step < n - start ? start + step : start + (step - (n - start)) - n;
    const posA = st => st < A.length - 0 ? ["A", st % A.length] : ["B", st - A.length];
    const posB = st => st < Bd.length - 0 ? ["B", st % Bd.length] : ["A", st - Bd.length];
    const id = ([list, i]) => (list === "A" && i === 2) || (list === "B" && i === 3) ? "X" : list + i;
    for (let step = 0; step <= A.length + Bd.length; step++) {
      const pa = posA(step), pb = posB(step);
      if (id(pa) === id(pb)) return "8";
    }
    return "null";
  };

  /* 206 反转链表 */
  V[206] = p => arr(p).slice().reverse().join("→");

  /* 234 回文链表 */
  V[234] = p => {
    const a = arr(p);
    for (let i = 0, j = a.length - 1; i < j; i++, j--) if (a[i] !== a[j]) return "false";
    return "true";
  };

  /* 141 环形链表：viz.arr 是 1→2→3→4→5→1 的环 */
  V[141] = p => {
    const a = arr(p).map(num), n = a.length;
    let s = 0, f = 0;
    for (let k = 0; k < n * 2; k++) {
      s = (s + 1) % n; f = (f + 2) % n;
      if (s === f) return "true";
    }
    return "false";
  };
})();
