/* dbgFix2 — 34 / 75 收尾修正 */
;(function () {
  /* 34 用 lower_bound，没有显式 while：按两次二分的过程展开 */
  window.DBG[34] = p => {
    const a = p.viz.arr, tg = p.viz.target, S = [];
    const F = (l, n, extra) => S.push(Object.assign({ line: l, note: n }, extra || {}));

    F(4, `lower_bound(nums, ${tg})：第一个 >= ${tg} 的下标`, { arr: a, vars: { target: tg } });
    let lo = 0, hi = a.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      F(4, `二分：lo=${lo}, hi=${hi}, mid=${mid}（${a[mid]}）`, { arr: a, ptr: { lo, mid, hi }, win: [lo, hi] });
      if (a[mid] < tg) { lo = mid + 1; F(4, `${a[mid]} < ${tg} → lo = ${lo}`, { arr: a, ptr: { lo, hi } }); }
      else { hi = mid; F(4, `${a[mid]} >= ${tg} → hi = ${hi}`, { arr: a, ptr: { lo, hi } }); }
    }
    F(4, `→ l = ${lo}`, { arr: a, ptr: { lo }, vars: { l: lo, r: "?" } });

    F(5, `lower_bound(nums, ${tg + 1})：第一个 > ${tg} 的下标，再减 1`, { arr: a, vars: { l: lo } });
    let lo2 = 0, hi2 = a.length;
    while (lo2 < hi2) {
      const mid = (lo2 + hi2) >> 1;
      F(5, `二分：lo=${lo2}, hi=${hi2}, mid=${mid}（${a[mid]}）`, { arr: a, ptr: { lo: lo2, mid, hi: hi2 }, win: [lo2, hi2] });
      if (a[mid] < tg + 1) { lo2 = mid + 1; F(5, `${a[mid]} < ${tg + 1} → lo = ${lo2}`, { arr: a, ptr: { lo: lo2 } }); }
      else { hi2 = mid; F(5, `${a[mid]} >= ${tg + 1} → hi = ${hi2}`, { arr: a, ptr: { hi: hi2 } }); }
    }
    const r = lo2 - 1;
    F(5, `→ r = ${lo2} - 1 = ${r}`, { arr: a, ptr: { [r]: "r" }, vars: { l: lo, r } });

    F(6, `l=${lo} 越界或 nums[${lo}] != ${tg} ?`, { arr: a, ptr: { lo } , vars: { l: lo, r } });
    F(7, `→ return {${lo}, ${r}}`, { arr: a, win: [lo, r], vars: { 答案: `[${lo},${r}]` } });
    return S;
  };

  /* 75 是 void 函数，结束时没有 return：最后一帧说“循环结束” */
  window.DBG[75] = p => {
    const a = p.viz.arr.slice(), S = [];
    const F = (l, n, extra) => S.push(Object.assign({ line: l, note: n }, extra || {}));
    let p0 = 0, i = 0, p2 = a.length - 1;

    F(4, `p0 = 0, i = 0, p2 = ${p2}（三指针）`, { arr: a.slice(), ptr: { p0, i, p2 }, vars: { p0, i, p2 } });
    let guard = 0;
    while (i <= p2 && guard++ < 30) {
      F(5, `while (${i} <= ${p2})`, { arr: a.slice(), ptr: { p0, i, p2 }, vars: { p0, i, p2 } });
      if (a[i] === 0) {
        const t = a[p0]; a[p0] = a[i]; a[i] = t;
        F(6, `nums[${i}] == 0 → swap(nums[${p0}], nums[${i}])，p0++、i++`, { arr: a.slice(), ptr: { p0: p0 + 1, i: i + 1, p2 }, hi: [p0, i], vars: { p0: p0 + 1, i: i + 1, p2 } });
        p0++; i++;
      } else if (a[i] === 2) {
        const t = a[p2]; a[p2] = a[i]; a[i] = t;
        F(7, `nums[${i}] == 2 → swap(nums[${i}], nums[${p2}])，p2--（i 不动）`, { arr: a.slice(), ptr: { p0, i, p2: p2 - 1 }, hi: [i, p2], vars: { p0, i, p2: p2 - 1 } });
        p2--;
      } else {
        F(8, `nums[${i}] == 1 → ++i`, { arr: a.slice(), ptr: { p0, i: i + 1, p2 }, vars: { p0, i: i + 1, p2 } });
        i++;
      }
    }
    F(5, `i > p2 → 循环结束，数组已按 0/1/2 排好`, { arr: a.slice(), done: a.map((_, k) => k), vars: { p0, i, p2, 结果: a.join(",") } });
    return S;
  };
})();
