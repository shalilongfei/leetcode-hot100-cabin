/* headfix — 只补「函数开头初始化」这类绝对不会插错的行
   循环体 / 分支体内的行一律不补：那种地方插错就是造假，
   要么由该题 trace 每轮自己给帧，要么承认「这份测试数据走不到这一支」。 */
;(function () {
  const HEAD = {
    /* 只保留位置确定安全的：函数体最前面几行的初始化 */
    994: [[4, "m = 4, n = 4（网格尺寸）"]],
    74:  [[4, "m = 4, n = 4（行数、列数）"]],
    4:   [[5, "m = 2（A 长度）, n = 1（B 长度）"]],
    739: [[4, "n = 8（温度个数）"]],
    84:  [[6, "best = 0（当前最大面积）"]],
    763: [[7, "start = 0, end = 0"]],
    139: [[5, "n = 8（s 长度）, maxLen = 4（词典最长词长）", { maxLen: 4 }]],
    322: [[4, "INF = amount + 1 = 12（当作无穷大）"]],
    416: [[4, "total = 1+5+11+5 = 22"]],
    64:  [[4, "m = 3, n = 3（网格尺寸）"]],
    1143:[[4, "m = 5（a 长度）, n = 3（b 长度）"]],
    72:  [[4, "m = 5（w1）, n = 3（w2）"]],
    5:   [[5, "expand：以某点为中心向两边扩"]],
    208: [[3, "Node 结构：child[26] 指针数组"],
          [4, "isEnd = false（初始不算单词结尾）"]],
    295: [[2, "small：大顶堆，存较小的一半"],
          [3, "large：小顶堆，存较大的一半"]]
  };

  window.HEADFIX = {
    apply(p, steps) {
      const list = HEAD[p.n];
      if (!list || !steps || !steps.length) return steps;
      list.slice().sort((a, b) => a[0] - b[0]).forEach(([ln, note, extraVars]) => {
        if (steps.some(f => f.line === ln)) return;
        let idx = steps.findIndex(f => f.line > ln);
        if (idx < 0) idx = steps.length;
        if (idx > 6) return;                       /* 插不进开头就放弃，绝不硬塞 */
        const prev = steps[idx - 1] || steps[idx] || steps[0];
        steps.splice(idx, 0, { line: ln, note, vars: Object.assign({}, prev.vars || {}, extraVars || {}), _gap: true });
      });
      steps._lineMap = steps.map(f => f.line || 1);
      return steps;
    }
  };
})();
