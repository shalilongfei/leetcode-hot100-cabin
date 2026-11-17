/* Hot 100 · 数据索引 */
;(function () {
  const all = window.H100 || [];
  const CPP = window.CPP || {};

  const CATS = ["哈希", "双指针", "滑动窗口", "子串", "普通数组", "矩阵", "链表",
                "二叉树", "图论", "回溯", "二分查找", "栈", "堆", "贪心",
                "动态规划", "多维动态规划", "技巧"];

  // 统一补全字段 + 稳定排序
  all.forEach((p, i) => {
    p.order = i + 1;
    p.cat = p.cat || "技巧";
    p.tags = p.tags || [];
    p.freq = p.freq || 3;
    p.cx = p.cx || ["—", "—"];
    p.keys = p.keys || [];
    p.viz = p.viz || { k: "array", arr: [] };
    p.cpp = CPP[p.n] || "";
  });

  const byN = {};
  all.forEach(p => { byN[p.n] = p; });

  const grouped = CATS.map(c => ({
    name: c,
    items: all.filter(p => p.cat === c)
  })).filter(g => g.items.length);

  window.H1 = {
    all,
    CATS,
    grouped,
    byN,
    get(n) { return byN[n]; },
    idxOf(n) { return all.findIndex(p => p.n === n); },
    next(n) {
      const i = this.idxOf(n);
      return all[(i + 1) % all.length];
    },
    prev(n) {
      const i = this.idxOf(n);
      return all[(i - 1 + all.length) % all.length];
    },
    counts: {
      total: all.length,
      easy: all.filter(p => p.d === "easy").length,
      medium: all.filter(p => p.d === "medium").length,
      hard: all.filter(p => p.d === "hard").length
    },
    diffLabel: { easy: "简单", medium: "中等", hard: "困难" }
  };
})();
