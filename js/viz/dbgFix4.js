/* dbgFix4 — 347 前 K 个高频元素：补全逐帧变量 */
;(function () {
  window.DBG[347] = p => {
    const a = p.viz.arr, k = p.viz.target, S = [];
    const cnt = {};
    const cp = o => JSON.parse(JSON.stringify(o));
    const F = (l, n, extra) => S.push(Object.assign({ line: l, note: n, vars: Object.assign({ k }, (extra && extra.vars) || {}) }, extra || {}));

    F(4, `cnt = {}`, { arr: a, map: {} });

    a.forEach((x, i) => {
      cnt[x] = (cnt[x] || 0) + 1;
      F(5, `++cnt[${x}] = ${cnt[x]}`, { arr: a, ptr: { i }, hi: [i], map: cp(cnt), vars: { x, i, 次数: cnt[x] } });
    });

    const n = a.length;
    F(6, `n = nums.size() = ${n}`, { arr: a, map: cp(cnt), vars: { n } });

    const buckets = Array.from({ length: n + 1 }, () => []);
    F(7, `buckets 开 ${n + 1} 个桶（下标 = 频次）`, { arr: a, map: cp(cnt), vars: { n } });

    Object.keys(cnt).forEach(v => {
      buckets[cnt[v]].push(v);
      F(8, `buckets[${cnt[v]}].push(${v})（${v} 出现 ${cnt[v]} 次）`, {
        arr: a, map: cp(cnt), mapHi: [String(v)],
        vars: { v: Number(v), f: cnt[v], 桶: buckets.map((b, i) => i + ":[" + b + "]").filter(s => !/:\[\]$/.test(s)).join(" ") }
      });
    });

    const res = [];
    F(9, `res = []`, { arr: a, vars: { res: "" } });

    for (let f = n; f >= 1 && res.length < k; f--) {
      F(10, `f = ${f}（从高频往低频扫）`, { arr: a, vars: { f, res: res.join(",") } });
      for (const v of buckets[f]) {
        if (res.length < k) {
          res.push(v);
          F(12, `res.push(${v})`, { arr: a, hi: [], vars: { f, v: Number(v), res: res.join(",") } });
        }
        if (res.length === k) {
          F(13, `res 已有 ${k} 个 → break`, { arr: a, vars: { res: res.join(",") } });
          break;
        }
      }
    }

    F(15, `return {${res.join(",")}}`, {
      arr: a, vars: { res: res.join(","), 答案: "[" + res.join(",") + "]" }
    });
    return S;
  };
})();
