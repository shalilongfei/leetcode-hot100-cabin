/* dbgR2 — 回溯 8 题：完整进出（进入 → 选择 → 递归 → 子返回 → 撤销 → 弹栈） */
;(function () {
  const cp = o => JSON.parse(JSON.stringify(o));

  /* ============ 46 全排列 ============ */
  window.DBG[46] = p => {
    const a = p.viz.arr, S = [], cs = [];
    const path = [], used = new Array(a.length).fill(false), res = [];
    const F = (line, note, extra) => S.push(Object.assign({ line, note, callstack: cp(cs), stack: path.slice() }, extra || {}));

    cs.push({ fn: "permute", args: "nums", res: null });
    F(4, "入口 permute(nums)", { arr: a });

    let depth = 0;
    function bt() {
      depth++;
      cs.push({ fn: "bt", args: `"${path.join("")}"`, res: null, depth });
      F(13, `▶ 进入 bt()　path=[${path}]　栈深 ${cs.length - 1}`, { arr: a });

      if (path.length === a.length) {
        res.push(path.slice());
        F(13, `path 满了 → 收集第 ${res.length} 个排列 [${path}]`, { arr: a, vars: { 结果数: res.length } });
        cs[cs.length - 1].ret = "✓";
        F(13, `return（这一层结束，弹栈回到上一层）`, { arr: a, vars: { 结果数: res.length } });
        cs.pop();
        depth--;
        return;
      }

      for (let i = 0; i < a.length; i++) {
        F(14, `for：i = ${i}（候选 ${a[i]}）`, { arr: a, ptr: { i } });
        F(15, `used[${i}] = ${used[i]} ?`, { arr: a, ptr: { i } });
        if (used[i]) { F(15, `已用过 → continue`, { arr: a, ptr: { i }, done: [i] }); continue; }

        used[i] = true;
        F(16, `used[${i}] = true（占住 ${a[i]}）`, { arr: a, ptr: { i }, hi: [i] });
        path.push(a[i]);
        F(17, `path.push(${a[i]}) → [${path}]`, { arr: a, hi: [i] });

        F(18, `递归 backtrack()　← 压栈，path=[${path}]`, { arr: a, hi: [i] });
        bt();
        F(18, `◀ 子调用返回，回到 path=[${path}]`, { arr: a, hi: [i] });

        const undone = path.pop();
        F(19, `path.pop() → 撤销 ${undone}，path=[${path}]`, { arr: a, hi: [i] });
        used[i] = false;
        F(20, `used[${i}] = false（释放 ${a[i]}）`, { arr: a, ptr: { i } });
      }

      cs[cs.length - 1].ret = "✓";
      F(21, `本轮 for 结束 → 弹栈，回到 path=[${path}] 的上一层`, { arr: a });
      cs.pop();
      depth--;
    }

    bt();
    F(8, `permute 返回 ${res.length} 个排列`, { arr: a, vars: { 答案: res.length + " 个" } });
    return S;
  };

  /* ============ 78 子集 ============ */
  window.DBG[78] = p => {
    const a = p.viz.arr, S = [], cs = [];
    const path = [], res = [];
    const F = (line, note, extra) => S.push(Object.assign({ line, note, callstack: cp(cs), stack: path.slice() }, extra || {}));

    cs.push({ fn: "subsets", args: "nums", res: null });
    F(4, "入口 subsets(nums)", { arr: a });

    function bt(start) {
      cs.push({ fn: "bt", args: `${start}`, res: null });
      F(12, `▶ 进入 bt(${start})　path=[${path}]　栈深 ${cs.length - 1}`, { arr: a });

      res.push(path.slice());
      F(12, `收集 [${path}] → 第 ${res.length} 个子集`, { arr: a, vars: { 结果数: res.length } });

      let i;
      for (i = start; i < a.length; i++) {
        F(13, `for：i = ${i}（${a[i]}）`, { arr: a, ptr: { i } });
        path.push(a[i]);
        F(14, `path.push(${a[i]}) → [${path}]`, { arr: a, hi: [i] });
        F(15, `递归 bt(${i + 1})　← 压栈`, { arr: a, hi: [i] });
        bt(i + 1);
        F(15, `◀ 子调用返回，path=[${path}]`, { arr: a, hi: [i], vars: { i } });
        path.pop();
        F(16, `path.pop() → 撤销 ${a[i]}，path=[${path}]`, { arr: a, hi: [i], vars: { i } });
      }

      cs[cs.length - 1].ret = "✓";
      F(17, `本轮结束 → 弹栈，回到 [${path}] 的上一层`, { arr: a, vars: i !== undefined ? { i } : {} });
      cs.pop();
    }

    bt(0);
    F(7, `subsets 返回 ${res.length} 个子集`, { arr: a, vars: { 答案: res.length + " 个" } });
    return S;
  };

  /* ============ 17 电话号码字母组合 ============ */
  window.DBG[17] = p => {
    const d = p.viz.arr, S = [], cs = [];
    const mp = { 2: "abc", 3: "def", 4: "ghi", 5: "jkl", 6: "mno", 7: "pqrs", 8: "tuv", 9: "wxyz" };
    const path = [], res = [];
    const F = (line, note, extra) => S.push(Object.assign({ line, note, callstack: cp(cs), stack: path.slice() }, extra || {}));

    cs.push({ fn: "letterCombinations", args: `"${d.join("")}"`, res: null });
    F(5, `入口 letterCombinations("${d.join("")}")`, { arr: d });
    F(9, `调用 dfs(0)　← 压栈`, { arr: d });

    function dfs(i) {
      cs.push({ fn: "dfs", args: String(i), res: null });
      F(13, `▶ 进入 dfs(${i})　path="${path.join("")}"　栈深 ${cs.length - 1}`, { arr: d, ptr: { i } });

      if (i === d.length) {
        res.push(path.join(""));
        F(14, `i 到底 → 收集 "${path.join("")}"（第 ${res.length} 个）`, { arr: d, vars: { 结果数: res.length } });
        cs[cs.length - 1].ret = "✓";
        F(14, `return（弹栈回到上一层）`, { arr: d });
        cs.pop();
        return;
      }

      F(15, `遍历 '${d[i]}' 的候选字母 "${mp[d[i]]}"`, { arr: d, ptr: { i } });
      for (const c of mp[d[i]]) {
        F(15, `候选 '${c}'`, { arr: d, ptr: { i } });
        path.push(c);
        F(16, `path.push('${c}') → "${path.join("")}"`, { arr: d, hi: [i] });
        F(17, `递归 dfs(${i + 1})　← 压栈`, { arr: d, hi: [i] });
        dfs(i + 1);
        F(17, `◀ 子调用返回，path="${path.join("")}"`, { arr: d, hi: [i] });
        path.pop();
        F(18, `path.pop() → 撤销 '${c}'，"${path.join("")}"`, { arr: d, hi: [i] });
      }

      cs[cs.length - 1].ret = "✓";
      F(19, `候选遍历完 → 弹栈，回到上一层`, { arr: d });
      cs.pop();
    }

    dfs(0);
    F(10, `返回 {${res.join(",")}}`, { arr: d, vars: { 答案: res.join(",") } });
    return S;
  };

  /* ============ 39 组合总和 ============ */
  window.DBG[39] = p => {
    const a = p.viz.arr.slice().sort((x, y) => x - y), tg = p.viz.target;
    const S = [], cs = [], path = [], res = [];
    const F = (line, note, extra) => S.push(Object.assign({ line, note, callstack: cp(cs), stack: path.slice() }, extra || {}));

    cs.push({ fn: "combinationSum", args: `target=${tg}`, res: null });
    F(4, `入口，sort → [${a}]`, { arr: a });

    function dfs(start, remain) {
      cs.push({ fn: "dfs", args: `${start},${remain}`, res: null });
      F(13, `▶ 进入 dfs(${start}, remain=${remain})　path=[${path}]　栈深 ${cs.length - 1}`, { arr: a, vars: { remain } });

      if (remain === 0) {
        res.push(path.slice());
        F(13, `remain = 0 → 收集 [${path}]（第 ${res.length} 组）`, { arr: a, vars: { 结果数: res.length } });
        cs[cs.length - 1].ret = "✓";
        F(13, `return（弹栈）`, { arr: a, vars: { 结果数: res.length } });
        cs.pop();
        return;
      }

      for (let i = start; i < a.length; i++) {
        F(14, `for：i = ${i}（${a[i]}），remain = ${remain}`, { arr: a, ptr: { i }, vars: { remain } });
        if (a[i] > remain) { F(15, `${a[i]} > ${remain} → break（剪枝）`, { arr: a, ptr: { i } }); break; }
        path.push(a[i]);
        F(16, `path.push(${a[i]}) → [${path}]`, { arr: a, hi: [i] });
        F(17, `递归 dfs(${i}, ${remain - a[i]})　← 压栈（i 不 +1，可重复用）`, { arr: a, hi: [i] });
        dfs(i, remain - a[i]);
        F(17, `◀ 子调用返回，path=[${path}]`, { arr: a, hi: [i] });
        path.pop();
        F(18, `path.pop() → 撤销 ${a[i]}，[${path}]`, { arr: a, hi: [i] });
      }

      cs[cs.length - 1].ret = "✓";
      F(19, `候选走完 → 弹栈，回到上一层`, { arr: a });
      cs.pop();
    }

    dfs(0, tg);
    F(8, `返回 ${res.length} 组`, { arr: a, vars: { 答案: res.map(x => "[" + x + "]").join(" ") } });
    return S;
  };

  /* ============ 22 括号生成 ============ */
  window.DBG[22] = p => {
    const n = 3, S = [], cs = [], path = [], res = [];
    const F = (line, note, extra) => S.push(Object.assign({ line, note, callstack: cp(cs), stack: path.slice() }, extra || {}));

    cs.push({ fn: "generateParenthesis", args: "n=3", res: null });
    F(4, "入口 generateParenthesis(3)", { vars: { n: 3 } });

    function dfs(open, close) {
      cs.push({ fn: "dfs", args: `${open},${close}`, res: null });
      F(10, `▶ 进入 dfs(open=${open}, close=${close})　"${path.join("")}"　栈深 ${cs.length - 1}`, {});

      if (path.length === 2 * n) {
        res.push(path.join(""));
        F(11, `长度够了 → 收集 "${path.join("")}"（第 ${res.length} 个）`, { vars: { 结果数: res.length } });
        cs[cs.length - 1].ret = "✓";
        F(11, `return（弹栈）`, { vars: { 结果数: res.length } });
        cs.pop();
        return;
      }

      F(12, `open < n ? ${open < n}`, {});
      if (open < n) {
        path.push("(");
        F(13, `push('(') → "${path.join("")}"`, {});
        F(14, `递归 dfs(${open + 1}, ${close})　← 压栈`, {});
        dfs(open + 1, close);
        F(14, `◀ 子调用返回，"${path.join("")}"`, {});
        path.pop();
        F(15, `pop → "${path.join("")}"`, {});
      }

      F(17, `close < open ? ${close < open}`, {});
      if (close < open) {
        path.push(")");
        F(18, `push(')') → "${path.join("")}"`, {});
        F(19, `递归 dfs(${open}, ${close + 1})　← 压栈`, {});
        dfs(open, close + 1);
        F(19, `◀ 子调用返回，"${path.join("")}"`, {});
        path.pop();
        F(20, `pop → "${path.join("")}"`, {});
      }

      cs[cs.length - 1].ret = "✓";
      F(21, `这一层收尾 → 弹栈`, {});
      cs.pop();
    }

    dfs(0, 0);
    F(7, `返回 ${res.length} 个组合`, { vars: { 答案: res.join(" ") } });
    return S;
  };

  /* ============ 79 单词搜索 ============ */
  window.DBG[79] = p => {
    const g = p.viz.grid, w = p.viz.target, S = [], cs = [];
    const F = (line, note, extra) => S.push(Object.assign({ line, note, callstack: cp(cs) }, extra || {}));
    let found = false;

    cs.push({ fn: "exist", args: `"${w}"`, res: null });
    F(4, `入口 exist("${w}")`, { grid: g });

    function dfs(i, j, k) {
      cs.push({ fn: "dfs", args: `${i},${j},${k}`, res: null });
      F(11, `▶ 进入 dfs(${i},${j},k=${k})　栈深 ${cs.length - 1}`, { grid: g, gridHi: [i + "," + j] });

      if (k === w.length) {
        found = true;
        F(12, `k == ${w.length} → 整串匹配，return true`, { grid: g, gridHi: [i + "," + j], vars: { 返回: "true" } });
        cs[cs.length - 1].res = "true";
        cs[cs.length - 1].ret = "true";
        cs.pop();
        return true;
      }

      const bad = i < 0 || i >= g.length || j < 0 || j >= g[0].length || g[i][j] !== w[k];
      F(13, `越界或 board[${i}][${j}] != '${w[k]}' ? ${bad}`, { grid: g, gridHi: bad ? [] : [i + "," + j] });
      if (bad) {
        cs[cs.length - 1].res = "false";
        cs[cs.length - 1].ret = "false";
        F(14, `→ return false（弹栈）`, { grid: g });
        cs.pop();
        return false;
      }

      const tmp = g[i][j];
      g[i][j] = "#";
      F(16, `标记 (${i},${j}) = '#'（已用）`, { grid: g.map(r => r.slice()), gridHi: [i + "," + j] });
      F(17, `四个方向递归　← 压栈`, { grid: g.map(r => r.slice()), gridHi: [i + "," + j] });
      const ok = dfs(i + 1, j, k + 1) || dfs(i - 1, j, k + 1) || dfs(i, j + 1, k + 1) || dfs(i, j - 1, k + 1);
      F(17, `◀ 子调用返回 ${ok}，回到 (${i},${j})`, { grid: g.map(r => r.slice()), gridHi: [i + "," + j] });
      g[i][j] = tmp;
      F(19, `恢复 (${i},${j}) = '${tmp}'`, { grid: g.map(r => r.slice()), gridHi: [i + "," + j] });
      cs[cs.length - 1].res = String(ok);
      cs[cs.length - 1].ret = String(ok);
      F(20, `return ${ok}　← 弹栈，回传 ${ok}`, { grid: g.map(r => r.slice()), vars: { 返回: String(ok) } });
      cs.pop();
      return ok;
    }

    outer:
    for (let i = 0; i < g.length; i++)
      for (let j = 0; j < g[0].length; j++) {
        F(7, `起点 (${i},${j})`, { grid: g, gridHi: [i + "," + j] });
        if (dfs(i, j, 0)) break outer;
      }

    if (found) F(7, `dfs 返回 true → return true`, { grid: g, vars: { 答案: "true" } });
    else F(8, `所有起点都试完 → return false`, { grid: g, vars: { 答案: "false" } });
    return S;
  };

  /* ============ 131 分割回文串 ============ */
  window.DBG[131] = p => {
    const s = p.viz.arr.join(""), S = [], cs = [], path = [], res = [];
    const F = (line, note, extra) => S.push(Object.assign({ line, note, callstack: cp(cs), stack: path.slice() }, extra || {}));
    const isPal = (l, r) => { while (l < r) { if (s[l] !== s[r]) return false; l++; r--; } return true; };

    cs.push({ fn: "partition", args: `"${s}"`, res: null });
    F(4, `入口 partition("${s}")`, {});

    function dfs(start) {
      cs.push({ fn: "dfs", args: String(start), res: null });
      F(14, `▶ 进入 dfs(${start})　path=[${path}]　栈深 ${cs.length - 1}`, {});

      if (start === s.length) {
        res.push(path.slice());
        F(16, `切到末尾 → 收集 [${path}]（第 ${res.length} 种）`, { vars: { 结果数: res.length } });
        cs[cs.length - 1].ret = "✓";
        F(16, `return（弹栈）`, { vars: { 结果数: res.length } });
        cs.pop();
        return;
      }

      for (let end = start; end < s.length; end++) {
        const sub = s.slice(start, end + 1);
        F(17, `for：end = ${end}，子串 "${sub}"`, {});
        const pal = isPal(start, end);
        F(18, `"${sub}" 是回文 ? ${pal}`, { win: [start, end] });
        if (!pal) continue;
        path.push(sub);
        F(19, `path.push("${sub}") → [${path.join("|")}]`, { win: [start, end] });
        F(20, `递归 dfs(${end + 1})　← 压栈`, { win: [start, end] });
        dfs(end + 1);
        F(20, `◀ 子调用返回，path=[${path.join("|")}]`, {});
        path.pop();
        F(21, `path.pop() → 撤销 "${sub}"`, {});
      }

      cs[cs.length - 1].ret = "✓";
      F(22, `切分点走完 → 弹栈`, {});
      cs.pop();
    }

    dfs(0);
    F(7, `返回 ${res.length} 种切法`, { vars: { 答案: res.map(x => x.join("|")).join("  ") } });
    return S;
  };

  /* ============ 51 N 皇后 ============ */
  window.DBG[51] = p => {
    const n = p.viz.grid.length, S = [], cs = [];
    const board = Array.from({ length: n }, () => new Array(n).fill("·"));
    const cols = new Set(), d1 = new Set(), d2 = new Set();
    const F = (line, note, extra) => S.push(Object.assign({ line, note, callstack: cp(cs), grid: board.map(r => r.slice()) }, extra || {}));
    let count = 0;

    cs.push({ fn: "solveNQueens", args: "n", res: null });
    F(5, `入口，board ${n}×${n}`, {});
    F(7, `调用 dfs(0)　← 压栈`, {});

    function dfs(r) {
      cs.push({ fn: "dfs", args: "r=" + r, res: null });
      F(11, `▶ 进入 dfs(row=${r})　栈深 ${cs.length - 1}`, {});

      if (r === n) {
        count++;
        F(13, `第 ${count} 个解成立`, { vars: { 解: count } });
        cs[cs.length - 1].ret = "✓";
        F(13, `return（弹栈）`, { vars: { 解: count } });
        cs.pop();
        return;
      }

      for (let c = 0; c < n; c++) {
        F(14, `for：列 c = ${c}`, { gridHi: [r + "," + c] });
        const bad = cols.has(c) || d1.has(r - c) || d2.has(r + c);
        F(15, `列/对角冲突 ? ${bad}`, { gridHi: [r + "," + c] });
        if (bad) continue;
        cols.add(c); d1.add(r - c); d2.add(r + c);
        board[r][c] = "Q";
        F(17, `放皇后 (${r},${c})`, { gridHi: [r + "," + c] });
        F(18, `递归 dfs(${r + 1})　← 压栈`, { gridHi: [r + "," + c] });
        dfs(r + 1);
        F(18, `◀ 子调用返回，回到第 ${r} 行`, { gridHi: [r + "," + c] });
        board[r][c] = "·";
        cols.delete(c); d1.delete(r - c); d2.delete(r + c);
        F(20, `撤销 (${r},${c})`, { gridHi: [r + "," + c] });
      }

      cs[cs.length - 1].ret = "✓";
      F(21, `第 ${r} 行试完 → 弹栈`, {});
      cs.pop();
    }

    dfs(0);
    F(8, `共 ${count} 个解`, { vars: { 答案: count + " 个解" } });
    return S;
  };

  /* ============ 200 岛屿：sink 递归 ============ */
  window.DBG[200] = p => {
    const g = p.viz.grid.map(r => r.slice()), m = g.length, nn = g[0].length;
    const S = [], cs = [];
    const F = (line, note, extra) => S.push(Object.assign({ line, note, callstack: cp(cs), grid: g.map(r => r.slice()) }, extra || {}));
    let cnt = 0;

    cs.push({ fn: "numIslands", args: "grid", res: null });
    F(4, `入口，${m}×${nn}`, {});

    function sink(i, j) {
      cs.push({ fn: "sink", args: `${i},${j}`, res: null });
      F(11, `▶ 进入 sink(${i},${j})　栈深 ${cs.length - 1}`, { gridHi: [i + "," + j] });
      const bad = i < 0 || i >= m || j < 0 || j >= nn || g[i][j] !== "1";
      F(12, `越界或不是 '1' ? ${bad}`, { gridHi: bad ? [] : [i + "," + j] });
      if (bad) {
        cs[cs.length - 1].ret = "×";
        cs.pop();
        return;
      }
      g[i][j] = "0";
      F(14, `g[${i}][${j}] = '0'（淹掉）`, { gridHi: [i + "," + j] });
      F(15, `四个方向 sink　← 压栈`, { gridHi: [i + "," + j] });
      sink(i + 1, j); sink(i - 1, j); sink(i, j + 1); sink(i, j - 1);
      F(15, `◀ 四邻都淹完，( ${i},${j} ) 返回`, { gridHi: [i + "," + j] });
      cs[cs.length - 1].ret = "✓";
      cs.pop();
    }

    for (let i = 0; i < m; i++)
      for (let j = 0; j < nn; j++) {
        F(5, `扫到 (${i},${j})`, { gridHi: [i + "," + j] });
        if (g[i][j] === "1") {
          cnt++;
          F(7, `是新岛 → ++cnt = ${cnt}，sink　← 压栈`, { gridHi: [i + "," + j], vars: { cnt } });
          sink(i, j);
        }
      }

    F(8, `return ${cnt}`, { vars: { 答案: cnt } });
    return S;
  };
})();
