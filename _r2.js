/* step2 — 逐帧独立实现：15 / 42 / 3 / 438 / 560 */
;(function () {
  const R = window.REPLAY;

  /* 15 三数之和 */
  R[15] = p => {
    const a = p.viz.arr.map(Number).sort((x, y) => x - y), S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    let res = [], i = 0, n = 0, l = 0, r = 0, s = 0;
    P(4, { i: 0 }); n = a.length;
    P(5, { i: 0 }); P(6, { i: 0, n });
    for (i = 0; i < n - 2; i++) {
      P(7, { i, n, 结果数: res.length });
      P(8, { i, n, 结果数: res.length });
      if (a[i] > 0) break;
      P(9, { i, n, 结果数: res.length });
      if (i > 0 && a[i] === a[i - 1]) { P(9, { i, n, 结果数: res.length }); continue; }
      l = i + 1; r = n - 1;
      P(10, { i, n, 结果数: res.length, l, r });
      while (l < r) {
        P(11, { i, n, 结果数: res.length, l, r });
        const s = a[i] + a[l] + a[r];
        P(12, { i, n, 结果数: res.length, l, r, s });
        if (s < 0) { l++; P(13, { i, n, 结果数: res.length, l, r, s }); }
        else if (s > 0) { r--; P(14, { i, n, 结果数: res.length, l, r, s }); }
        else {
          P(15, { i, n, 结果数: res.length, l, r, s });
          res.push([a[i], a[l], a[r]]);
          P(16, { i, n, 结果数: res.length, l, r, s, 结果: res.map(x => "[" + x + "]").join(" ") });
          while (l < r && a[l] === a[l + 1]) { l++; P(17, { i, n, 结果数: res.length, l, r, s }); }
          while (l < r && a[r] === a[r - 1]) { r--; P(18, { i, n, 结果数: res.length, l, r, s }); }
          l++; r--;
          P(19, { i, n, 结果数: res.length, l, r, s, 结果: res.map(x => "[" + x + "]").join(" ") });
        }
      }
    }
    P(23, { n, 结果数: res.length, 结果: res.map(x => "[" + x + "]").join(" "), 答案: res.map(x => "[" + x + "]").join(" ") });
    return S;
  };

  /* 42 接雨水 */
  R[42] = p => {
    const h = p.viz.arr.map(Number), S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    let l = 0, r = h.length - 1, lmax = 0, rmax = 0, ans = 0;
    P(4, { l, r, lmax, rmax, ans });
    P(5, { l, r, lmax, rmax, ans });
    while (l < r) {
      P(6, { l, r, lmax, rmax, ans });
      P(7, { l, r, lmax, rmax, ans });
      if (h[l] < h[r]) {
        lmax = Math.max(lmax, h[l]);
        P(8, { l, r, lmax, rmax, ans });
        ans += lmax - h[l];
        P(9, { l, r, lmax, rmax, ans });
        l++;
        P(10, { l, r, lmax, rmax, ans });
      } else {
        rmax = Math.max(rmax, h[r]);
        P(12, { l, r, lmax, rmax, ans });
        ans += rmax - h[r];
        P(13, { l, r, lmax, rmax, ans });
        r--;
        P(14, { l, r, lmax, rmax, ans });
      }
    }
    P(17, { l, r, lmax, rmax, ans, 答案: ans });
    return S;
  };

  /* 3 无重复最长子串 */
  R[3] = p => {
    const s = p.viz.arr, S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    const last = {}; let l = 0, ans = 0, r = 0;
    P(4, { l, ans, r });
    P(5, { l, ans, r });
    for (r = 0; r < s.length; r++) {
      P(6, { l, ans, r });
      const inWin = last[s[r]] !== undefined && last[s[r]] >= l;
      P(7, { l, ans, r });
      if (inWin) { l = last[s[r]] + 1; P(7, { l, ans, r }); }
      last[s[r]] = r;
      P(8, { l, ans, r });
      ans = Math.max(ans, r - l + 1);
      P(9, { l, ans, r });
    }
    P(11, { l, ans, r, 答案: ans });
    return S;
  };

  /* 438 找异位词 */
  R[438] = p => {
    const s = p.viz.arr, t = String(p.viz.target), S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    const res = []; let n = s.length, m = t.length;
    P(4, { i: 0 });
    P(5, { i: 0, n, m });
    P(6, { i: 0, n, m });
    if (m > n) return S;
    const need = {}, win = {};
    P(7, { i: 0, n, m });
    for (const c of t) need[c] = (need[c] || 0) + 1;
    P(8, { i: 0, n, m });
    for (let i = 0; i < n; i++) {
      P(9, i === 0 ? { i, n, m, c: "'" + s[i] + "'" } : { i, n, m, c: "'" + s[i] + "'", 命中: res.length });
      win[s[i]] = (win[s[i]] || 0) + 1;
      P(10, i === 0 ? { i, n, m, c: "'" + s[i] + "'" } : { i, n, m, c: "'" + s[i] + "'", 命中: res.length });
      if (i >= m) {
        win[s[i - m]]--;
        P(11, { i, n, m, c: "'" + s[i - m] + "'", 命中: res.length });
      }
      const sig = o => Object.keys(o).filter(k2 => o[k2] > 0).sort().map(k2 => k2 + ":" + o[k2]).join(",");
      const eq = sig(win) === sig(need);
      if (eq) res.push(i - m + 1);
      P(12, { i, n, m, c: "'" + s[i] + "'", 命中: res.length });
    }
    P(14, { i: s.length - 1, n, m, c: "'" + s[s.length - 1] + "'", 命中: res.length, 答案: "[" + res.join(",") + "]" });
    return S;
  };

  /* 560 和为 K */
  R[560] = p => {
    const a = p.viz.arr.map(Number), k = Number(p.viz.target), S = [];
    const P = (line, vars) => S.push({ line, vars: Object.assign({}, vars) });
    let pre = 0, ans = 0;
    const cnt = { 0: 1 };
    P(4, { pre, ans });
    P(5, { pre, ans, k });
    for (const x of a) {
      P(6, { pre, ans, k });
      pre += x;
      P(7, { pre, ans, k });
      const hit = cnt[pre - k] || 0;
      P(8, { pre, ans, k });
      ans += hit;
      P(9, { pre, ans, k });
      cnt[pre] = (cnt[pre] || 0) + 1;
      P(10, { pre, ans, k });
    }
    P(12, { pre, ans, k, 答案: ans });
    return S;
  };
})();
