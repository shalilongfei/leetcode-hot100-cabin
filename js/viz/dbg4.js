/* dbg4 — 图论 4 + 回溯 8：BFS 队列 / DFS 栈 / 递归 path 全部逐行 */
;(function () {
  const cp = window.DBG.cp;

  /* 200 岛屿数量 */
  window.DBG[200] = p => {
    const S = [], g = p.viz.grid.map(r => r.slice()), m = g.length, n = g[0].length;
    const F = (l, note, s) => S.push(Object.assign({ line: l, note }, s || {}));
    const G = () => g.map(r => r.slice());
    let cnt = 0;
    F(4, `m = ${m}, n = ${n}, cnt = 0`, { grid: G() });
    const cs = [];
    const sink = (i, j) => {
      cs.push({ fn: "sink", args: `${i},${j}` });
      const bad = i < 0 || i >= m || j < 0 || j >= n || g[i][j] !== "1";
      F(12, `sink(${i},${j})：越界或不是 '1' ? ${bad}`, { grid: G(), gridHi: bad ? [] : [i + "," + j], callstack: cp(cs) });
      if (bad) { cs.pop(); return; }
      g[i][j] = "0";
      F(13, `g[${i}][${j}] = '0'（淹掉）`, { grid: G(), gridHi: [i + "," + j], callstack: cp(cs) });
      sink(i + 1, j); sink(i - 1, j); sink(i, j + 1); sink(i, j - 1);
      cs.pop();
    };
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        F(5, `i = ${i}, j = ${j}`, { grid: G(), gridHi: [i + "," + j], vars: { cnt } });
        F(7, `grid[${i}][${j}] == '1' ? ${g[i][j] === "1"}`, { grid: G(), gridHi: [i + "," + j], vars: { cnt } });
        if (g[i][j] === "1") {
          cnt++;
          F(7, `++cnt = ${cnt} → 调用 sink`, { grid: G(), gridHi: [i + "," + j], vars: { cnt } });
          sink(i, j);
        }
      }
    }
    F(8, `return ${cnt}`, { grid: G(), vars: { 答案: cnt } });
    return S;
  };

  /* 994 腐烂的橘子 */
  window.DBG[994] = p => {
    const S = [], g = p.viz.grid.map(r => r.slice()), m = g.length, n = g[0].length;
    const F = (l, note, s) => S.push(Object.assign({ line: l, note }, s || {}));
    const G = () => g.map(r => r.slice());
    let q = [], fresh = 0;
    for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) {
      if (g[i][j] === 2) q.push([i, j]);
      if (g[i][j] === 1) fresh++;
    }
    F(4, `初始化队列，新鲜橘子 ${fresh} 个`, { grid: G(), gridHi: q.map(x => x.join(",")) });
    F(5, `fresh = ${fresh}`, { grid: G(), vars: { fresh } });
    F(6, "minutes = 0", { grid: G(), vars: { minutes: 0, fresh } });
    let minutes = 0;
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    while (q.length && fresh) {
      F(12, `dirs = {{1,0},{-1,0},{0,1},{0,-1}}（上下左右）`, { grid: G() });
      F(8, `while (!q.empty() && fresh) → 队列 ${q.length}`, { grid: G(), gridHi: q.map(x => x.join(",")), vars: { minutes, fresh } });
      F(8, `sz = ${q.length}`, { grid: G(), vars: { sz: q.length } });
      const nq = [];
      for (const [i, j] of q) {
        F(9, `弹出 (${i},${j})`, { grid: G(), gridHi: [i + "," + j] });
        for (const d of dirs) {
          const x = i + d[0], y = j + d[1];
          F(17, `邻居 x = ${i}+(${d[0]}) = ${x}, y = ${j}+(${d[1]}) = ${y}`, { grid: G(), vars: { x, y } });
          if (x >= 0 && x < m && y >= 0 && y < n && g[x][y] === 1) {
            g[x][y] = 2;
            F(19, `(${x},${y}) 由 1 变 2`, { grid: G(), gridHi: [x + "," + y], vars: { fresh } });
            fresh--;
            F(20, `--fresh → ${fresh} 个新鲜橘子`, { grid: G(), gridHi: [x + "," + y], vars: { fresh } });
            nq.push([x, y]);
            F(21, `(${x},${y}) 入队，下一轮继续蔓延`, { grid: G(), gridHi: [x + "," + y], vars: { fresh } });
          }
        }
      }
      q = nq; minutes++;
      F(12, `minutes = ${minutes}`, { grid: G(), vars: { minutes, fresh } });
    }
    const ans = fresh ? -1 : minutes;
    F(14, fresh ? "还有新鲜 → return -1" : `return ${minutes}`, { grid: G(), vars: { 答案: ans } });
    return S;
  };

  /* 207 课程表 */
  window.DBG[207] = p => {
    const S = [], F = (l, note, s) => S.push(Object.assign({ line: l, note }, s || {}));
    const n = 2, g = [[1], [0]], indeg = [1, 1];
    F(4, "g = [[1],[0]]（0→1，1→0）", { map: { "0→": "1", "1→": "0" } });
    F(5, `indeg = [${indeg}]`, { map: { "入度[0]": 1, "入度[1]": 1 } });
    F(6, "遍历 prerequisites，建图 + 入度", { map: { "入度[0]": 1, "入度[1]": 1 } });
    F(7, "q 初始放入度为 0 的课", { map: { "入度[0]": 1, "入度[1]": 1 }, vars: { 队列: "空" } });
    const q = [];
    for (let i = 0; i < n; i++) F(8, `indeg[${i}] == 0 ? ${indeg[i] === 0}`, { map: { "入度[0]": indeg[0], "入度[1]": indeg[1] } });
    F(9, "seen = 0", { vars: { seen: 0, 队列: "空" } });
    F(10, `while (!q.empty()) ? false（队列空）`, { vars: { seen: 0 } });
    F(11, `seen == numCourses ? ${0 === n} → false`, { vars: { 答案: "false" } });
    return S;
  };

  /* 208 Trie */
  window.DBG[208] = p => {
    const S = [], ops = p.viz.arr, F = (l, note, s) => S.push(Object.assign({ line: l, note }, s || {}));
    const nodes = { "": {} };
    F(8, "Trie() : root(new Node())", { map: { root: "{}" } });
    ops.forEach((op, i) => {
      if (op === "trie") { F(8, "Trie() 构造", { arr: ops, ptr: { i } }); return; }
      if (op.indexOf("insert ") === 0) {
        const w = op.slice(7), path = [];
        for (const ch of w) {
          path.push(ch);
          F(12, `insert("${w}")：处理 '${ch}'`, { arr: ops, ptr: { i }, map: { 路径: path.join("→") } });
          F(13, `child['${ch}'] 不存在就新建`, { arr: ops, ptr: { i }, map: { 路径: path.join("→") } });
          F(22, `node = node->child['${ch}']（往下走一层）`, { arr: ops, ptr: { i }, map: { 路径: path.join("→") } });
        }
        F(14, `isEnd = true（"${w}" 插入完成）`, { arr: ops, ptr: { i }, map: { 单词: w } });
        return;
      }
      const w = op.split(" ")[1] || "";
      F(18, `${op}：调用 find("${w}")，node = root`, { arr: ops, ptr: { i }, map: { 查询: w } });
      F(27, `node = find("${w}")（先走完整条路径）`, { arr: ops, ptr: { i }, map: { 查询: w } });
      for (let k = 0; k < w.length; k++) {
        F( 9, `node = root（find 从根出发）`, { arr: ops, ptr: { i }, map: { 查询: w } });
        F(10, `for：第 ${k + 1} 个字符 '${w[k]}'`, { arr: ops, ptr: { i }, map: { 查询: w, 位置: k } });
        F(11, `child['${w[k]}'] 存在？→ 是`, { arr: ops, ptr: { i }, map: { 查询: w } });
        F(12, `node = node->child['${w[k]}']`, { arr: ops, ptr: { i }, map: { 查询: w, 位置: k + 1 } });
      }
      F(19, `"${w}" 每个字符都存在？→ 是（只看路径，不看 isEnd）`, { arr: ops, ptr: { i }, vars: { 前缀存在: "true" } });
      if (op.indexOf("search") === 0) {
        F(20, `search：node && node->isEnd → "app" 只是前缀，false`, { arr: ops, ptr: { i }, vars: { 答案: "false" } });
      } else {
        F(22, `startsWith：return find(prefix) != nullptr → true`, { arr: ops, ptr: { i }, vars: { 答案: "true" } });
      }
    });
    return S;
  };

  /* 46 全排列 */
  window.DBG[46] = p => {
    const S = [], a = p.viz.arr, F = (l, note, s) => S.push(Object.assign({ line: l, note }, s || {}));
    const used = new Array(a.length).fill(false), path = [], res = [], cs = [];
    F(4, "res, path, used 初始化", { arr: a, stack: [], callstack: [{ fn: "permute", args: "nums" }] });
    const bt = () => {
      cs.push({ fn: "bt", args: `[${path.join(",")}]` });
      F(6, `bt()：path 长度 ${path.length} == ${a.length} ?`, { arr: a, stack: path.slice(), callstack: cp(cs) });
      if (path.length === a.length) {
        res.push(path.slice());
        F(7, `res.push_back([${path}]) → 共 ${res.length} 个`, { arr: a, stack: path.slice(), callstack: cp(cs), vars: { 结果: res.map(x => "[" + x + "]").join(" ") } });
        cs.pop();
        return;
      }
      for (let i = 0; i < a.length; i++) {
        F(8, `i = ${i}（${a[i]}），used[${i}] = ${used[i]}`, { arr: a, ptr: { i }, callstack: cp(cs) });
        if (used[i]) { F(8, "→ 已用过，continue", { arr: a, ptr: { i }, done: [i], callstack: cp(cs) }); continue; }
        used[i] = true; path.push(a[i]);
        F(9, `选择 ${a[i]} → path = [${path}]`, { arr: a, hi: [i], stack: path.slice(), callstack: cp(cs) });
        F(10, "递归 backtrack()", { arr: a, hi: [i], stack: path.slice(), callstack: cp(cs) });
        bt();
        const undo = path.pop();
        used[i] = false;
        F(11, `撤销 ${undo} → path = [${path}]`, { arr: a, hi: [i], stack: path.slice(), callstack: cp(cs) });
      }
      cs.pop();
    };
    bt();
    F(14, `return res（${res.length} 个排列）`, { arr: a, vars: { 答案: res.length + " 个" } });
    return S;
  };

  /* 78 子集 */
  window.DBG[78] = p => {
    const S = [], a = p.viz.arr, F = (l, note, s) => S.push(Object.assign({ line: l, note }, s || {}));
    const path = [], res = [], cs = [];
    const bt = start => {
      cs.push({ fn: "bt", args: String(start) });
      res.push(path.slice());
      F(6, `收集 [${path}]（第 ${res.length} 个）`, { arr: a, stack: path.slice(), callstack: cp(cs), vars: { 结果: res.map(x => "[" + x + "]").join(" ") } });
      for (let i = start; i < a.length; i++) {
        F(7, `i = ${i}（${a[i]}）`, { arr: a, ptr: { i }, callstack: cp(cs), stack: path.slice() });
        path.push(a[i]);
        F(8, `path.push(${a[i]}) → [${path}]`, { arr: a, hi: [i], stack: path.slice(), callstack: cp(cs) });
        bt(i + 1);
        path.pop();
        F(9, `path.pop() → [${path}]`, { arr: a, hi: [i], stack: path.slice(), callstack: cp(cs) });
      }
      cs.pop();
    };
    bt(0);
    F(10, `return res（${res.length} 个）`, { arr: a, vars: { 答案: res.length + " 个" } });
    return S;
  };

  /* 17 电话号码字母组合 */
  window.DBG[17] = p => {
    const S = [], d = p.viz.arr, F = (l, note, s) => S.push(Object.assign({ line: l, note }, s || {}));
    const mp = { 2: "abc", 3: "def" }, path = [], res = [], cs = [];
    F(5, `digits = "${d.join("")}"`, { arr: d });
    const dfs = i => {
      cs.push({ fn: "dfs", args: String(i) });
      F(9, `dfs(${i})：i == ${d.length} ?`, { arr: d, ptr: { i }, stack: path.slice(), callstack: cp(cs) });
      if (i === d.length) {
        res.push(path.join(""));
        F(10, `res.push_back("${path.join("")}")`, { arr: d, stack: path.slice(), callstack: cp(cs), vars: { 结果: res.join(",") } });
        cs.pop(); return;
      }
      for (const c of mp[d[i]]) {
        F(11, `'${d[i]}' 的候选字母：'${c}'`, { arr: d, ptr: { i }, stack: path.slice(), callstack: cp(cs) });
        path.push(c);
        F(12, `path.push('${c}') → "${path.join("")}"`, { arr: d, hi: [i], stack: path.slice(), callstack: cp(cs) });
        F(13, `dfs(${i + 1})`, { arr: d, stack: path.slice(), callstack: cp(cs) });
        dfs(i + 1);
        path.pop();
        F(14, `path.pop() → "${path.join("")}"`, { arr: d, stack: path.slice(), callstack: cp(cs) });
      }
      cs.pop();
    };
    dfs(0);
    F(16, `return {${res.join(",")}}`, { arr: d, vars: { 答案: res.join(",") } });
    return S;
  };

  /* 39 组合总和 */
  window.DBG[39] = p => {
    const S = [], a = p.viz.arr.slice().sort((x, y) => x - y), tg = p.viz.target;
    const F = (l, note, s) => S.push(Object.assign({ line: l, note }, s || {}));
    const path = [], res = [], cs = [];
    let remain = tg;
    F(4, `sort(candidates) → [${a}]`, { arr: a, vars: { target: tg } });
    const dfs = (start, rem) => {
      cs.push({ fn: "dfs", args: `${start},${rem}` });
      F(6, `dfs(${start}, ${rem})：remain == 0 ?`, { arr: a, ptr: { start }, stack: path.slice(), callstack: cp(cs), vars: { remain: rem } });
      if (rem === 0) {
        res.push(path.slice());
        F(7, `res.push_back([${path}])`, { arr: a, stack: path.slice(), callstack: cp(cs), vars: { 结果: res.map(x => "[" + x + "]").join(" ") } });
        cs.pop(); return;
      }
      for (let i = start; i < a.length; i++) {
        F(8, `i = ${i}（${a[i]}），remain = ${rem}`, { arr: a, ptr: { i }, stack: path.slice(), callstack: cp(cs), vars: { remain: rem } });
        if (a[i] > rem) { F(8, `${a[i]} > ${rem} → break`, { arr: a, ptr: { i }, callstack: cp(cs) }); break; }
        path.push(a[i]);
        F(9, `path.push(${a[i]}) → [${path}]`, { arr: a, hi: [i], stack: path.slice(), callstack: cp(cs) });
        dfs(i, rem - a[i]);
        path.pop();
        F(10, `path.pop() → [${path}]`, { arr: a, hi: [i], stack: path.slice(), callstack: cp(cs) });
      }
      cs.pop();
    };
    dfs(0, tg);
    F(12, `return res（${res.length} 组）`, { arr: a, vars: { 答案: res.map(x => "[" + x + "]").join(" ") } });
    return S;
  };

  /* 22 括号生成 */
  window.DBG[22] = p => {
    const S = [], F = (l, note, s) => S.push(Object.assign({ line: l, note }, s || {}));
    const n = 3, path = [], res = [], cs = [];
    const dfs = (open, close) => {
      cs.push({ fn: "dfs", args: `${open},${close}` });
      F(6, `dfs(${open}, ${close})：长度 ${path.length} == ${2 * n} ?`, { stack: path.slice(), callstack: cp(cs) });
      if (path.length === 2 * n) {
        res.push(path.join(""));
        F(7, `res.push_back("${path.join("")}") → ${res.length} 个`, { stack: path.slice(), callstack: cp(cs), vars: { 结果: res.join(" ") } });
        cs.pop(); return;
      }
      F(8, `open < n ? ${open < n}`, { stack: path.slice(), callstack: cp(cs) });
      if (open < n) {
        path.push("(");
        F(9, `push('(') → ${path.join("")}`, { stack: path.slice(), callstack: cp(cs) });
        dfs(open + 1, close);
        path.pop();
        F(10, `pop（左括号分支）→ ${path.join("")}`, { stack: path.slice(), callstack: cp(cs) });
      }
      F(11, `close < open ? ${close < open}`, { stack: path.slice(), callstack: cp(cs) });
      if (close < open) {
        path.push(")");
        F(12, `push(')') → ${path.join("")}`, { stack: path.slice(), callstack: cp(cs) });
        dfs(open, close + 1);
        path.pop();
        F(13, `pop（右括号分支）→ ${path.join("")}`, { stack: path.slice(), callstack: cp(cs) });
      }
      cs.pop();
    };
    dfs(0, 0);
    F(15, `return res（${res.length} 个）`, { vars: { 答案: res.join(" ") } });
    return S;
  };

  /* 79 单词搜索 */
  window.DBG[79] = p => {
    const S = [], g = p.viz.grid, w = p.viz.target;
    const F = (l, note, s) => S.push(Object.assign({ line: l, note }, s || {}));
    const cs = [];
    let found = false;
    const dfs = (i, j, k) => {
      cs.push({ fn: "dfs", args: `${i},${j},${k}` });
      const done = k === w.length;
      F(10, `dfs(${i},${j},${k})：k == len ? ${done}`, { grid: g, gridHi: [i + "," + j], callstack: cp(cs) });
      if (done) { found = true; cs.pop(); return true; }
      const bad = i < 0 || i >= g.length || j < 0 || j >= g[0].length || g[i][j] !== w[k];
      F(11, `越界或 board[${i}][${j}](${g[i] && g[i][j]}) != '${w[k]}' ? ${bad}`, { grid: g, gridHi: bad ? [] : [i + "," + j], callstack: cp(cs) });
      if (bad) { cs.pop(); return false; }
      const tmp = g[i][j];
      g[i][j] = "#";
      F(13, `标记 (${i},${j}) = '#'`, { grid: g.map(r => r.slice()), gridHi: [i + "," + j], callstack: cp(cs) });
      const ok = dfs(i + 1, j, k + 1) || dfs(i - 1, j, k + 1) || dfs(i, j + 1, k + 1) || dfs(i, j - 1, k + 1);
      g[i][j] = tmp;
      F(16, `恢复 (${i},${j}) = '${tmp}'`, { grid: g.map(r => r.slice()), gridHi: [i + "," + j], callstack: cp(cs) });
      cs.pop();
      return ok;
    };
    for (let i = 0; i < g.length && !found; i++)
      for (let j = 0; j < g[0].length && !found; j++) {
        F(4, `起点 (${i},${j})`, { grid: g, gridHi: [i + "," + j] });
        dfs(i, j, 0);
      }
    F(4, `return ${found}`, { grid: g, vars: { 答案: String(found) } });
    return S;
  };

  /* 131 分割回文串 */
  window.DBG[131] = p => {
    const S = [], s = p.viz.arr.join(""), F = (l, note, st) => S.push(Object.assign({ line: l, note }, st || {}));
    const path = [], res = [], cs = [];
    const isPal = (l, r) => { while (l < r) { if (s[l] !== s[r]) return false; l++; r--; } return true; };
    const dfs = start => {
      cs.push({ fn: "dfs", args: String(start) });
      F(13, `dfs(${start})：start == ${s.length} ?`, { stack: path.slice(), callstack: cp(cs) });
      if (start === s.length) {
        res.push(path.slice());
        F(14, `res.push_back([${path}]) → ${res.length}`, { stack: path.slice(), callstack: cp(cs), vars: { 结果: res.map(x => x.join("|")).join("  ") } });
        cs.pop(); return;
      }
      for (let end = start; end < s.length; end++) {
        const pal = isPal(start, end);
        F(15, `[${start},${end}] = "${s.slice(start, end + 1)}" 是回文 ? ${pal}`, { stack: path.slice(), callstack: cp(cs) });
        if (!pal) continue;
        path.push(s.slice(start, end + 1));
        F(16, `path.push("${s.slice(start, end + 1)}")`, { stack: path.slice(), callstack: cp(cs) });
        dfs(end + 1);
        path.pop();
        F(18, `path.pop()`, { stack: path.slice(), callstack: cp(cs) });
      }
      cs.pop();
    };
    dfs(0);
    F(20, `return res`, { vars: { 答案: res.map(x => x.join("|")).join("  ") } });
    return S;
  };

  /* 51 N 皇后 */
  window.DBG[51] = p => {
    const S = [], n = p.viz.grid.length, F = (l, note, s) => S.push(Object.assign({ line: l, note }, s || {}));
    const board = Array.from({ length: n }, () => new Array(n).fill("·"));
    const cols = new Set(), d1 = new Set(), d2 = new Set(), cs = [];
    let count = 0;
    const G = () => board.map(r => r.slice());
    F(4, `board ${n}×${n}`, { grid: G() });
    F(6, "col / d1 / d2 三个集合", { grid: G() });
    const dfs = r => {
      cs.push({ fn: "dfs", args: "row=" + r });
      F(8, `dfs(${r})：r == ${n} ?`, { grid: G(), callstack: cp(cs) });
      if (r === n) { count++; F(8, `找到第 ${count} 个解`, { grid: G(), callstack: cp(cs), vars: { 解: count } }); cs.pop(); return; }
      for (let c = 0; c < n; c++) {
        const bad = cols.has(c) || d1.has(r - c) || d2.has(r + c);
        F(10, `(${r},${c})：列 ${c} / 对角 ${r - c},${r + c} 冲突 ? ${bad}`, { grid: G(), gridHi: [r + "," + c], callstack: cp(cs) });
        if (bad) continue;
        cols.add(c); d1.add(r - c); d2.add(r + c); board[r][c] = "Q";
        F(12, `放皇后 (${r},${c})，标记三集合`, { grid: G(), gridHi: [r + "," + c], callstack: cp(cs) });
        dfs(r + 1);
        board[r][c] = "·";
        cols.delete(c); d1.delete(r - c); d2.delete(r + c);
        F(15, `撤销 (${r},${c})`, { grid: G(), gridHi: [r + "," + c], callstack: cp(cs) });
      }
      cs.pop();
    };
    dfs(0);
    F(16, `return res（${count} 个解）`, { grid: G(), vars: { 答案: count + " 个解" } });
    return S;
  };
})();
