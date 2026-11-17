/* Hot 100 · 数据 03 — 图论(4) / 回溯(8) / 二分(6) / 栈(5) / 堆(3) */
;(function () {
  const P = (window.H100 = window.H100 || []);

  P.push(
  /* ================= 图论 ================= */
  {
    n: 200, t: "岛屿数量", en: "Number of Islands", d: "medium", cat: "图论", freq: 5,
    tags: ["深度优先搜索", "广度优先搜索", "并查集", "数组", "矩阵"],
    gist: "遍历网格，遇到陆地就 <code>count += 1</code> 并用 DFS/BFS 把整块陆地「淹掉」，保证每个岛只数一次。",
    keys: [
      ["越界与终止", "越界、是 <code>'0'</code>、已访问 → 直接 return"],
      ["原地标记", "把 <code>'1'</code> 改成 <code>'0'</code>，省掉 visited 数组"],
      ["计数时机", "只在外层遇到未访问的 <code>'1'</code> 时 +1"]
    ],
    trap: "标记要在递归入口就做，否则会重复进入同一格爆栈；BFS 版入队时就标记。",
    cx: ["O(m·n)", "O(m·n)"],
    tmpl: `class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        m, n = len(grid), len(grid[0])
        def sink(i, j):
            if i < 0 or i >= m or j < 0 or j >= n or grid[i][j] != '1':
                return
            grid[i][j] = '0'                 # 淹掉
            sink(i+1, j); sink(i-1, j); sink(i, j+1); sink(i, j-1)
        cnt = 0
        for i in range(m):
            for j in range(n):
                if grid[i][j] == '1':
                    cnt += 1
                    sink(i, j)
        return cnt`,
    viz: { k: "grid", grid: [["1","1","0","0"],["1","1","0","0"],["0","0","1","0"],["0","0","0","1"]] }
  },
  {
    n: 994, t: "腐烂的橘子", en: "Rotting Oranges", d: "medium", cat: "图论", freq: 4,
    tags: ["广度优先搜索", "数组", "矩阵"],
    gist: "多源 BFS：所有腐烂橘子同时入队，<b>按层推进</b>，层数就是分钟数；最后若还有新鲜橘子则返回 -1。",
    keys: [
      ["多源入队", "把所有 2 的位置一次性放进队列，同时统计新鲜橘子数"],
      ["按层计时", "<code>for _ in range(len(q))</code> 处理一层，层末 <code>minutes += 1</code>"],
      ["结束条件", "队列空后 <code>fresh > 0</code> 返回 -1，否则返回 <code>minutes</code>（注意初始层不加时间）"]
    ],
    trap: "没有新鲜橘子时答案 0；时间从 -1 开始或层末判断，否则会多算一分钟。",
    cx: ["O(m·n)", "O(m·n)"],
    tmpl: `class Solution:
    def orangesRotting(self, grid: List[List[int]]) -> int:
        m, n = len(grid), len(grid[0])
        q, fresh, minutes = deque(), 0, 0
        for i in range(m):
            for j in range(n):
                if grid[i][j] == 2: q.append((i, j))
                elif grid[i][j] == 1: fresh += 1
        while q and fresh:
            for _ in range(len(q)):            # 一层 = 一分钟
                i, j = q.popleft()
                for di, dj in ((1,0),(-1,0),(0,1),(0,-1)):
                    x, y = i + di, j + dj
                    if 0 <= x < m and 0 <= y < n and grid[x][y] == 1:
                        grid[x][y] = 2
                        fresh -= 1
                        q.append((x, y))
            minutes += 1
        return -1 if fresh else minutes`,
    viz: { k: "grid", grid: [[2,1,1],[1,1,0],[0,1,1]] }
  },
  {
    n: 207, t: "课程表", en: "Course Schedule", d: "medium", cat: "图论", freq: 5,
    tags: ["深度优先搜索", "广度优先搜索", "图", "拓扑排序"],
    gist: "判有向图有无环 = <b>拓扑排序能否排完</b>：统计入度，入度 0 的入队，弹出时把邻居入度减 1。",
    keys: [
      ["建图 + 入度", "<code>g[b].append(a)</code>，<code>indeg[a] += 1</code>（先修 b → 后修 a）"],
      ["BFS 拓扑", "入度为 0 的全部入队"],
      ["判定", "出队计数 <code>== numCourses</code> 则无环"]
    ],
    trap: "边的方向反了会得到相反结论；DFS 版需要三色标记（未访问/在栈中/已完成）。",
    cx: ["O(V+E)", "O(V+E)"],
    tmpl: `class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        g = [[] for _ in range(numCourses)]
        indeg = [0] * numCourses
        for a, b in prerequisites:      # 修 b 才能修 a
            g[b].append(a)
            indeg[a] += 1
        q = deque(i for i in range(numCourses) if indeg[i] == 0)
        seen = 0
        while q:
            u = q.popleft(); seen += 1
            for v in g[u]:
                indeg[v] -= 1
                if indeg[v] == 0: q.append(v)
        return seen == numCourses`,
    viz: { k: "grid", grid: [["0","1"],["1","0"]] }
  },
  {
    n: 208, t: "实现 Trie (前缀树)", en: "Implement Trie (Prefix Tree)", d: "medium", cat: "图论", freq: 5,
    tags: ["设计", "字典树", "哈希表", "字符串"],
    gist: "每个节点挂一个 <code>children</code> 字典 + 一个 <code>isEnd</code> 标记；插入和查找都是「沿着字符往下走」。",
    keys: [
      ["节点结构", "<code>{char: Node}</code> + <code>isEnd</code>"],
      ["插入", "<code>setdefault</code> 逐字符下钻，末尾打标"],
      ["查找", "抽一个 <code>_find(prefix)</code>，search 看 <code>isEnd</code>，startsWith 只看能否走完"]
    ],
    trap: "search 必须要求 <code>isEnd</code>，否则「前缀存在」会被误判成「单词存在」。",
    cx: ["O(L)", "O(total L)"],
    tmpl: `class Trie:
    def __init__(self):
        self.child = {}
        self.isEnd = False

    def insert(self, word: str) -> None:
        node = self
        for ch in word:
            node = node.child.setdefault(ch, Trie())
        node.isEnd = True

    def _find(self, prefix: str):
        node = self
        for ch in prefix:
            if ch not in node.child:
                return None
            node = node.child[ch]
        return node

    def search(self, word: str) -> bool:
        node = self._find(word)
        return bool(node and node.isEnd)

    def startsWith(self, prefix: str) -> bool:
        return self._find(prefix) is not None`,
    viz: { k: "array", arr: ["trie", "insert apple", "search app", "startsWith app"] }
  },

  /* ================= 回溯 ================= */
  {
    n: 46, t: "全排列", en: "Permutations", d: "medium", cat: "回溯", freq: 5,
    tags: ["数组", "回溯"],
    gist: "每个位置都尝试所有<b>还没用过</b>的数：选择 → 递归 → 撤销，叶子节点收集答案。",
    keys: [
      ["used 数组", "记录哪些下标已经被选进 path"],
      ["收集时机", "<code>len(path) == n</code> 时 <code>res.append(path[:])</code>，必须拷贝"],
      ["撤销", "<code>path.pop(); used[i] = False</code>"]
    ],
    trap: "直接 append 引用会得到一堆空列表；有重复元素时（47 题）需要先排序再剪枝。",
    cx: ["O(n·n!)", "O(n)"],
    tmpl: `class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
        res, path, used = [], [], [False] * len(nums)
        def bt():
            if len(path) == len(nums):
                res.append(path[:])          # 必须拷贝
                return
            for i, x in enumerate(nums):
                if used[i]: continue
                used[i] = True; path.append(x)
                bt()
                path.pop(); used[i] = False
        bt()
        return res`,
    viz: { k: "array", arr: [1, 2, 3] }
  },
  {
    n: 78, t: "子集", en: "Subsets", d: "medium", cat: "回溯", freq: 5,
    tags: ["位运算", "数组", "回溯"],
    gist: "每个元素「选 / 不选」；用 <code>start</code> 保证只往右走，就避免了重复组合，且<b>每个节点都是答案</b>。",
    keys: [
      ["先收集", "进入递归就 <code>res.append(path[:])</code>（空集也算）"],
      ["枚举后继", "<code>for i in range(start, n)</code>"],
      ["撤销", "<code>path.pop()</code>"]
    ],
    trap: "收集要在递归入口而不是叶子；用 <code>start</code> 而不是 used，顺序天然递增。",
    cx: ["O(n·2ⁿ)", "O(n)"],
    tmpl: `class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        res, path = [], []
        def bt(start):
            res.append(path[:])              # 每个节点都是子集
            for i in range(start, len(nums)):
                path.append(nums[i])
                bt(i + 1)
                path.pop()
        bt(0)
        return res`,
    viz: { k: "array", arr: [1, 2, 3] }
  },
  {
    n: 17, t: "电话号码的字母组合", en: "Letter Combinations of a Phone Number", d: "medium", cat: "回溯", freq: 4,
    tags: ["哈希表", "字符串", "回溯"],
    gist: "按<b>数字下标</b>递归：第 i 位数字的候选字母都试一遍，长度够了就收集。",
    keys: [
      ["映射表", "<code>2->abc, 3->def, ...</code>"],
      ["递归参数", "<code>bt(i, path)</code>，i 是当前处理的数字位置"],
      ["终止", "<code>i == len(digits)</code>"]
    ],
    trap: "空字符串要返回 <code>[]</code> 而不是 <code>['']</code>。",
    cx: ["O(4ⁿ·n)", "O(n)"],
    tmpl: `class Solution:
    def letterCombinations(self, digits: str) -> List[str]:
        if not digits: return []
        mp = {'2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
              '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'}
        res, path = [], []
        def bt(i):
            if i == len(digits):
                res.append(''.join(path)); return
            for ch in mp[digits[i]]:
                path.append(ch)
                bt(i + 1)
                path.pop()
        bt(0)
        return res`,
    viz: { k: "array", arr: ["2", "3"] }
  },
  {
    n: 39, t: "组合总和", en: "Combination Sum", d: "medium", cat: "回溯", freq: 4,
    tags: ["数组", "回溯"],
    gist: "元素可重复用 → 递归时<b>仍传 i</b>（不 +1）；用 <code>remain</code> 控制目标和，负数即剪枝。",
    keys: [
      ["可重复", "<code>bt(i, remain - x)</code> 而不是 <code>i+1</code>"],
      ["剪枝", "<code>remain < 0</code> 直接 return；排序后 <code>x > remain</code> 可 break"],
      ["收集", "<code>remain == 0</code> 时收 path"]
    ],
    trap: "传 <code>i+1</code> 会变成「每个数只能用一次」；不排序就不能提前 break。",
    cx: ["O(n^(T/m))", "O(T/m)"],
    tmpl: `class Solution:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        candidates.sort()
        res, path = [], []
        def bt(start, remain):
            if remain == 0:
                res.append(path[:]); return
            for i in range(start, len(candidates)):
                if candidates[i] > remain: break     # 剪枝
                path.append(candidates[i])
                bt(i, remain - candidates[i])        # i 不 +1，可重复
                path.pop()
        bt(0, target)
        return res`,
    viz: { k: "array", arr: [2, 3, 6, 7], target: 7 }
  },
  {
    n: 22, t: "括号生成", en: "Generate Parentheses", d: "medium", cat: "回溯", freq: 5,
    tags: ["字符串", "动态规划", "回溯"],
    gist: "两个约束就够：<b>左括号随时可加（< n），右括号只能在 open > close 时加</b>——天然合法。",
    keys: [
      ["状态", "<code>bt(open, close, path)</code>"],
      ["加左", "<code>open < n</code>"],
      ["加右", "<code>close < open</code>"],
      ["终止", "<code>len(path) == 2n</code>"]
    ],
    trap: "别写「生成所有 2n 长的括号串再验证」，复杂度爆炸；右括号条件写反会生成非法串。",
    cx: ["O(4ⁿ/√n)", "O(n)"],
    tmpl: `class Solution:
    def generateParenthesis(self, n: int) -> List[str]:
        res, path = [], []
        def bt(open_, close):
            if len(path) == 2 * n:
                res.append(''.join(path)); return
            if open_ < n:
                path.append('(')
                bt(open_ + 1, close)
                path.pop()
            if close < open_:
                path.append(')')
                bt(open_, close + 1)
                path.pop()
        bt(0, 0)
        return res`,
    viz: { k: "array", arr: ["(", "(", ")", ")"] }
  },
  {
    n: 79, t: "单词搜索", en: "Word Search", d: "medium", cat: "回溯", freq: 4,
    tags: ["数组", "字符串", "回溯", "矩阵"],
    gist: "网格 DFS：每个格子都试当起点，走不通就<b>原地标记再恢复</b>，保证同一格不被重复使用。",
    keys: [
      ["先判边界与字符", "越界或字符不匹配直接 False"],
      ["标记", "<code>board[i][j] = '#'</code> 再四向递归"],
      ["恢复", "返回前把字符写回去（回溯的关键）"],
      ["剪枝", "起始遍历时先比首字符可省大量递归"]
    ],
    trap: "忘记恢复会让后续搜索误判；先判断 <code>k == len(word)</code> 再判边界，顺序别反。",
    cx: ["O(m·n·3^L)", "O(L)"],
    tmpl: `class Solution:
    def exist(self, board: List[List[str]], word: str) -> bool:
        m, n = len(board), len(board[0])
        def dfs(i, j, k):
            if k == len(word): return True
            if not (0 <= i < m and 0 <= j < n) or board[i][j] != word[k]:
                return False
            tmp = board[i][j]
            board[i][j] = '#'                     # 标记已用
            ok = (dfs(i+1, j, k+1) or dfs(i-1, j, k+1)
                  or dfs(i, j+1, k+1) or dfs(i, j-1, k+1))
            board[i][j] = tmp                     # 恢复
            return ok
        for i in range(m):
            for j in range(n):
                if dfs(i, j, 0): return True
        return False`,
    viz: { k: "grid", grid: [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], target: "ABCCED" }
  },
  {
    n: 131, t: "分割回文串", en: "Palindrome Partitioning", d: "medium", cat: "回溯", freq: 4,
    tags: ["字符串", "动态规划", "回溯"],
    gist: "在字符串上切刀：枚举下一段的结束位置，是回文才递归——<b>切割问题 = 组合问题套一层合法性判断</b>。",
    keys: [
      ["枚举切点", "<code>for end in range(start, n)</code>"],
      ["回文判断", "双指针 O(len) 或预处理 <code>dp[i][j]</code>"],
      ["收集", "<code>start == n</code> 时把 path 落盘"]
    ],
    trap: "回文判断写错下标（含头不含尾）；用 <code>s[start:end+1]</code> 注意右开区间。",
    cx: ["O(n·2ⁿ)", "O(n²)"],
    tmpl: `class Solution:
    def partition(self, s: str) -> List[List[str]]:
        n = len(s)
        res, path = [], []
        def isPal(l, r):
            while l < r:
                if s[l] != s[r]: return False
                l += 1; r -= 1
            return True
        def bt(start):
            if start == n:
                res.append(path[:]); return
            for end in range(start, n):
                if not isPal(start, end): continue
                path.append(s[start:end+1])
                bt(end + 1)
                path.pop()
        bt(0)
        return res`,
    viz: { k: "array", arr: ["a", "a", "b"] }
  },
  {
    n: 51, t: "N 皇后", en: "N-Queens", d: "hard", cat: "回溯", freq: 4,
    tags: ["数组", "回溯"],
    gist: "逐行放皇后，用三个集合 O(1) 判冲突：<b>列 <code>c</code>、主对角 <code>r-c</code>、副对角 <code>r+c</code></b>。",
    keys: [
      ["三个集合", "<code>cols</code>、<code>d1 = r-c</code>、<code>d2 = r+c</code>"],
      ["逐行递归", "第 r 行枚举所有列，冲突就跳过"],
      ["落盘", "<code>r == n</code> 时把棋盘转成字符串列表"]
    ],
    trap: "对角线用 <code>r-c</code> / <code>r+c</code> 才能唯一标识；回溯时三个集合都要清理。",
    cx: ["O(n!)", "O(n)"],
    tmpl: `class Solution:
    def solveNQueens(self, n: int) -> List[List[str]]:
        res = []
        cols, d1, d2 = set(), set(), set()
        board = [['.'] * n for _ in range(n)]
        def bt(r):
            if r == n:
                res.append([''.join(row) for row in board]); return
            for c in range(n):
                if c in cols or (r - c) in d1 or (r + c) in d2:
                    continue
                cols.add(c); d1.add(r - c); d2.add(r + c)
                board[r][c] = 'Q'
                bt(r + 1)
                board[r][c] = '.'
                cols.discard(c); d1.discard(r - c); d2.discard(r + c)
        bt(0)
        return res`,
    viz: { k: "grid", grid: [["·","·","·","·"],["·","·","·","·"],["·","·","·","·"],["·","·","·","·"]] }
  },

  /* ================= 二分查找 ================= */
  {
    n: 35, t: "搜索插入位置", en: "Search Insert Position", d: "easy", cat: "二分查找", freq: 4,
    tags: ["数组", "二分查找"],
    gist: "本质是 <code>lower_bound</code>：找<b>第一个 >= target</b> 的位置，循环结束时 <code>lo</code> 就是答案（可能在末尾）。",
    keys: [
      ["闭开区间", "<code>lo, hi = 0, n</code>，<code>while lo < hi</code>"],
      ["收缩", "<code>nums[mid] < target</code> 则 <code>lo = mid+1</code>，否则 <code>hi = mid</code>"],
      ["返回", "<code>lo</code>"]
    ],
    trap: "这套模板天然处理「插入到末尾」；用 <code>hi = n-1</code> 的写法要额外判断返回值。",
    cx: ["O(log n)", "O(1)"],
    tmpl: `class Solution:
    def searchInsert(self, nums: List[int], target: int) -> int:
        lo, hi = 0, len(nums)          # 右开
        while lo < hi:
            mid = (lo + hi) // 2
            if nums[mid] < target:
                lo = mid + 1
            else:
                hi = mid
        return lo`,
    viz: { k: "array", arr: [1, 3, 5, 6], target: 5 }
  },
  {
    n: 74, t: "搜索二维矩阵", en: "Search a 2D Matrix", d: "medium", cat: "二分查找", freq: 4,
    tags: ["数组", "二分查找", "矩阵"],
    gist: "整体按行展开就是一个有序数组——把一维下标映射成 <code>(mid // n, mid % n)</code>，直接套二分。",
    keys: [
      ["虚拟一维", "<code>mid = (lo + hi) // 2</code>，取值 <code>matrix[mid//n][mid%n]</code>"],
      ["标准二分", "左闭右开，找到即 True"],
      ["退出", "<code>lo >= hi</code> 返回 False"]
    ],
    trap: "列数用 <code>len(matrix[0])</code>；空矩阵要特判。",
    cx: ["O(log(m·n))", "O(1)"],
    tmpl: `class Solution:
    def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:
        m, n = len(matrix), len(matrix[0])
        lo, hi = 0, m * n
        while lo < hi:
            mid = (lo + hi) // 2
            v = matrix[mid // n][mid % n]
            if v == target: return True
            if v < target: lo = mid + 1
            else: hi = mid
        return False`,
    viz: { k: "grid", grid: [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target: 3 }
  },
  {
    n: 34, t: "在排序数组中查找元素的第一个和最后一个位置", en: "Find First and Last Position of Element in Sorted Array", d: "medium", cat: "二分查找", freq: 5,
    tags: ["数组", "二分查找"],
    gist: "两次 <code>lower_bound</code>：<code>[target, target+1)</code> 的左右边界就是答案，比「找到再向两边扩」更稳。",
    keys: [
      ["左边界", "<code>lower_bound(target)</code>"],
      ["右边界", "<code>lower_bound(target+1) - 1</code>"],
      ["校验", "左边界越界或值不等于 target → <code>[-1,-1]</code>"]
    ],
    trap: "直接找到 target 再往两边线性扩，最坏 O(n) 会退化；边界判断别漏。",
    cx: ["O(log n)", "O(1)"],
    tmpl: `class Solution:
    def searchRange(self, nums: List[int], target: int) -> List[int]:
        def lower_bound(x):
            lo, hi = 0, len(nums)
            while lo < hi:
                mid = (lo + hi) // 2
                if nums[mid] < x: lo = mid + 1
                else: hi = mid
            return lo
        l = lower_bound(target)
        r = lower_bound(target + 1) - 1
        if l >= len(nums) or nums[l] != target:
            return [-1, -1]
        return [l, r]`,
    viz: { k: "array", arr: [5, 7, 7, 8, 8, 10], target: 8 }
  },
  {
    n: 33, t: "搜索旋转排序数组", en: "Search in Rotated Sorted Array", d: "medium", cat: "二分查找", freq: 5,
    tags: ["数组", "二分查找"],
    gist: "旋转数组必有一半是<b>有序</b>的：判断 mid 落在哪半边，再看 target 是否在那个有序区间内，决定收缩方向。",
    keys: [
      ["先判有序半边", "<code>nums[lo] <= nums[mid]</code> ⇒ 左半有序"],
      ["在有序区间内？", "若 <code>nums[lo] <= target < nums[mid]</code> 则 <code>hi = mid-1</code>，否则 <code>lo = mid+1</code>"],
      ["右半同理", "否则右半有序，判 <code>nums[mid] < target <= nums[hi]</code>"]
    ],
    trap: "边界等号不能丢（<code><=</code> 判有序、<code><</code> 判区间）；有重复元素（81 题）时无法保证 O(log n)。",
    cx: ["O(log n)", "O(1)"],
    tmpl: `class Solution:
    def search(self, nums: List[int], target: int) -> int:
        lo, hi = 0, len(nums) - 1
        while lo <= hi:
            mid = (lo + hi) // 2
            if nums[mid] == target: return mid
            if nums[lo] <= nums[mid]:                 # 左半有序
                if nums[lo] <= target < nums[mid]:
                    hi = mid - 1
                else:
                    lo = mid + 1
            else:                                     # 右半有序
                if nums[mid] < target <= nums[hi]:
                    lo = mid + 1
                else:
                    hi = mid - 1
        return -1`,
    viz: { k: "array", arr: [4, 5, 6, 7, 0, 1, 2], target: 0 }
  },
  {
    n: 153, t: "寻找旋转排序数组中的最小值", en: "Find Minimum in Rotated Sorted Array", d: "medium", cat: "二分查找", freq: 4,
    tags: ["数组", "二分查找"],
    gist: "把 <code>nums[mid]</code> 和<b>右端</b>比较：小于右端说明最小值在左半（含 mid），否则在右半。",
    keys: [
      ["闭区间", "<code>lo, hi = 0, n-1</code>，<code>while lo < hi</code>"],
      ["收缩", "<code>nums[mid] < nums[hi]</code> → <code>hi = mid</code>；否则 <code>lo = mid+1</code>"],
      ["答案", "<code>nums[lo]</code>"]
    ],
    trap: "和左端比较需要额外处理「未旋转」的情况；和右端比较更统一，且 <code>hi = mid</code> 不能减 1。",
    cx: ["O(log n)", "O(1)"],
    tmpl: `class Solution:
    def findMin(self, nums: List[int]) -> int:
        lo, hi = 0, len(nums) - 1
        while lo < hi:
            mid = (lo + hi) // 2
            if nums[mid] < nums[hi]:
                hi = mid            # 最小值在 [lo, mid]
            else:
                lo = mid + 1        # 最小值在 (mid, hi]
        return nums[lo]`,
    viz: { k: "array", arr: [3, 4, 5, 1, 2] }
  },
  {
    n: 4, t: "寻找两个正序数组的中位数", en: "Median of Two Sorted Arrays", d: "hard", cat: "二分查找", freq: 5,
    tags: ["数组", "二分查找", "分治"],
    gist: "在<b>较短数组</b>上二分切点 <code>i</code>，另一数组切点由 <code>half - i</code> 决定；满足「左半最大 ≤ 右半最小」即找到。",
    keys: [
      ["保证短数组", "交换使 <code>len(a) <= len(b)</code>，二分范围 <code>[0, m]</code>"],
      ["切分条件", "<code>aL <= bR and bL <= aR</code>"],
      ["调整", "<code>aL > bR</code> 说明 i 太大 → <code>hi = i-1</code>；否则 <code>lo = i+1</code>"],
      ["答案", "奇数取 <code>max(aL,bL)</code>，偶数取两侧平均"]
    ],
    trap: "边界用 ±inf 处理；<code>half = (m+n+1)//2</code> 保证左半多一个，奇数中位数才在左边。",
    cx: ["O(log(min(m,n)))", "O(1)"],
    tmpl: `class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        a, b = nums1, nums2
        if len(a) > len(b): a, b = b, a
        m, n = len(a), len(b)
        half, lo, hi = (m + n + 1) // 2, 0, m
        while lo <= hi:
            i = (lo + hi) // 2
            j = half - i
            aL = a[i-1] if i > 0 else float('-inf')
            aR = a[i]   if i < m else float('inf')
            bL = b[j-1] if j > 0 else float('-inf')
            bR = b[j]   if j < n else float('inf')
            if aL <= bR and bL <= aR:
                if (m + n) % 2: return max(aL, bL)
                return (max(aL, bL) + min(aR, bR)) / 2
            elif aL > bR: hi = i - 1
            else: lo = i + 1`,
    viz: { k: "array", arr: [1, 3], target: 2 }
  },

  /* ================= 栈 ================= */
  {
    n: 20, t: "有效的括号", en: "Valid Parentheses", d: "easy", cat: "栈", freq: 5,
    tags: ["栈", "字符串"],
    gist: "左括号入栈，右括号必须和<b>栈顶</b>配对；最后栈空才合法。",
    keys: [
      ["映射", "<code>{')':'(', ']':'[', '}':'{'}</code>"],
      ["右括号", "栈空或栈顶不匹配 → False，否则 pop"],
      ["左括号", "直接 push"],
      ["收尾", "<code>not stack</code>"]
    ],
    trap: "只数数量会漏掉 <code>([)]</code> 这类交叉；最后忘了判空会漏 <code>((</code>。",
    cx: ["O(n)", "O(n)"],
    tmpl: `class Solution:
    def isValid(self, s: str) -> bool:
        pairs = {')': '(', ']': '[', '}': '{'}
        stack = []
        for ch in s:
            if ch in pairs:
                if not stack or stack[-1] != pairs[ch]:
                    return False
                stack.pop()
            else:
                stack.append(ch)
        return not stack`,
    viz: { k: "array", arr: ["(", "[", "]", ")"] }
  },
  {
    n: 155, t: "最小栈", en: "Min Stack", d: "medium", cat: "栈", freq: 4,
    tags: ["栈", "设计"],
    gist: "辅助栈同步记录「当前为止的最小值」——push 时压 <code>min(x, 当前最小)</code>，pop 时一起弹。",
    keys: [
      ["双栈", "<code>data</code> + <code>mins</code>，两者长度始终相同"],
      ["push", "<code>mins.append(min(x, mins[-1]) if mins else x)</code>"],
      ["pop", "两个栈都 pop，O(1) 取 min"]
    ],
    trap: "只存「更小的值」会导致 pop 后 min 丢失；用差值法可以做到一个栈但要处理溢出。",
    cx: ["O(1)", "O(n)"],
    tmpl: `class Solution:  # 类 MinStack
    def __init__(self):
        self.data = []
        self.mins = []

    def push(self, val: int) -> None:
        self.data.append(val)
        self.mins.append(min(val, self.mins[-1]) if self.mins else val)

    def pop(self) -> None:
        self.data.pop()
        self.mins.pop()

    def top(self) -> int:
        return self.data[-1]

    def getMin(self) -> int:
        return self.mins[-1]`,
    viz: { k: "array", arr: ["push(-2)", "push(0)", "push(-3)", "getMin", "pop"] }
  },
  {
    n: 394, t: "字符串解码", en: "Decode String", d: "medium", cat: "栈", freq: 4,
    tags: ["栈", "递归", "字符串"],
    gist: "遇到 <code>[</code> 就把「之前的字符串 + 当前倍数」压栈并清零，遇到 <code>]</code> 弹栈拼接 <code>prev + cur * k</code>。",
    keys: [
      ["数字", "<code>num = num*10 + int(ch)</code>（可能是多位数）"],
      ["左括号", "<code>stack.append((cur, num))</code>，然后 <code>cur, num = '', 0</code>"],
      ["右括号", "<code>prev, k = stack.pop(); cur = prev + cur * k</code>"],
      ["字母", "直接拼到 <code>cur</code>"]
    ],
    trap: "多位数要累积；嵌套时 <code>cur</code> 必须先清空，否则重复拼接。",
    cx: ["O(n)", "O(n)"],
    tmpl: `class Solution:
    def decodeString(self, s: str) -> str:
        stack, cur, num = [], '', 0
        for ch in s:
            if ch.isdigit():
                num = num * 10 + int(ch)
            elif ch == '[':
                stack.append((cur, num))
                cur, num = '', 0
            elif ch == ']':
                prev, k = stack.pop()
                cur = prev + cur * k
            else:
                cur += ch
        return cur`,
    viz: { k: "array", arr: ["3", "[", "a", "2", "[", "c", "]", "]"] }
  },
  {
    n: 739, t: "每日温度", en: "Daily Temperatures", d: "medium", cat: "栈", freq: 5,
    tags: ["栈", "数组", "单调栈"],
    gist: "单调<b>递减</b>栈存下标：新温度比栈顶高，就说明栈顶那天找到了答案，弹出并写入距离。",
    keys: [
      ["只存下标", "栈内温度单调递减"],
      ["弹栈结算", "<code>while stack and T[stack[-1]] < T[i]: j = stack.pop(); res[j] = i-j</code>"],
      ["入栈", "当前下标入栈，等更暖的一天"]
    ],
    trap: "找不到更暖天保持 0（初始化即 0）；用 <code><</code> 不是 <code><=</code>（相等不算更暖）。",
    cx: ["O(n)", "O(n)"],
    tmpl: `class Solution:
    def dailyTemperatures(self, temperatures: List[int]) -> List[int]:
        res = [0] * len(temperatures)
        stack = []                     # 下标，温度递减
        for i, t in enumerate(temperatures):
            while stack and temperatures[stack[-1]] < t:
                j = stack.pop()
                res[j] = i - j
            stack.append(i)
        return res`,
    viz: { k: "bars", arr: [73, 74, 75, 71, 69, 72, 76, 73] }
  },
  {
    n: 84, t: "柱状图中最大的矩形", en: "Largest Rectangle in Histogram", d: "hard", cat: "栈", freq: 5,
    tags: ["栈", "数组", "单调栈"],
    gist: "对每根柱子，找「左右第一个比它矮的位置」，宽度 × 高度即候选答案；单调递增栈一次扫描全解决。",
    keys: [
      ["单调递增栈", "栈里存下标，高度递增"],
      ["弹栈结算", "遇到更矮 <code>h</code> 时弹出 <code>height</code>，左边界是弹完后的栈顶，右边界是当前 <code>i</code>"],
      ["哨兵", "末尾补一个 0，保证所有柱子都被结算"]
    ],
    trap: "宽度公式是 <code>i - left - 1</code>（left 是栈顶剩余下标）；不加哨兵会漏掉栈里剩下的柱子。",
    cx: ["O(n)", "O(n)"],
    tmpl: `class Solution:
    def largestRectangleArea(self, heights: List[int]) -> int:
        stack, best = [], 0
        for i, h in enumerate(heights + [0]):      # 末尾哨兵
            while stack and heights[stack[-1]] > h:
                height = heights[stack.pop()]
                left = stack[-1] if stack else -1
                best = max(best, height * (i - left - 1))
            stack.append(i)
        return best`,
    viz: { k: "bars", arr: [2, 1, 5, 6, 2, 3] }
  },

  /* ================= 堆 ================= */
  {
    n: 215, t: "数组中的第 K 个最大元素", en: "Kth Largest Element in an Array", d: "medium", cat: "堆", freq: 5,
    tags: ["数组", "分治", "快速选择", "排序", "堆"],
    gist: "维护一个<b>大小为 k 的小顶堆</b>，堆顶就是第 k 大；也可用快速选择做到平均 O(n)。",
    keys: [
      ["小顶堆", "遍历入堆，超过 k 就 pop 最小值"],
      ["答案", "<code>heap[0]</code>"],
      ["快速选择", "随机 pivot 分区，只递归目标所在的一侧，平均 O(n)"]
    ],
    trap: "求第 k 大用小顶堆（不是大顶堆）；面试官常追问 O(n) 解法，要能写出快选。",
    cx: ["O(n log k)", "O(k)"],
    tmpl: `class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        heap = []
        for x in nums:
            heapq.heappush(heap, x)
            if len(heap) > k:
                heapq.heappop(heap)     # 丢掉当前最小的
        return heap[0]

# 快速选择（平均 O(n)）：partition 后看 pivot 落在哪一侧
# if pos == n - k: return nums[pos]
# elif pos < n - k: lo = pos + 1
# else: hi = pos - 1`,
    viz: { k: "array", arr: [3, 2, 1, 5, 6, 4], target: 2 }
  },
  {
    n: 347, t: "前 K 个高频元素", en: "Top K Frequent Elements", d: "medium", cat: "堆", freq: 5,
    tags: ["数组", "哈希表", "分治", "桶排序", "计数", "快速选择", "排序", "堆"],
    gist: "先 <code>Counter</code> 统计频次，再<b>桶排序</b>（桶下标 = 频次，最多 n 个桶）从高到低取前 k，O(n)。",
    keys: [
      ["计数", "<code>Counter(nums)</code>"],
      ["桶", "<code>buckets[freq].append(num)</code>，桶数组长 <code>n+1</code>"],
      ["倒序取", "从 <code>n</code> 往下收集，够 k 个就返回"]
    ],
    trap: "用 <code>heapq.nlargest(k, cnt, key=cnt.get)</code> 更短但 O(n log k)；桶排序要按频次而非值做下标。",
    cx: ["O(n)", "O(n)"],
    tmpl: `class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        cnt = Counter(nums)
        buckets = [[] for _ in range(len(nums) + 1)]
        for num, f in cnt.items():
            buckets[f].append(num)          # 桶下标 = 频次
        res = []
        for f in range(len(buckets) - 1, 0, -1):
            for num in buckets[f]:
                res.append(num)
                if len(res) == k: return res
        return res`,
    viz: { k: "array", arr: [1, 1, 1, 2, 2, 3], target: 2 }
  },
  {
    n: 295, t: "数据流的中位数", en: "Find Median from Data Stream", d: "hard", cat: "堆", freq: 5,
    tags: ["设计", "双指针", "数据流", "排序", "堆"],
    gist: "对顶堆：<b>大顶堆存较小的一半、小顶堆存较大的一半</b>，保持 <code>len(small) - len(large) ∈ {0,1}</code>，中位数只看两个堆顶。",
    keys: [
      ["入堆两步", "先压大顶堆，再把它最大的弹给小顶堆"],
      ["平衡", "若 <code>len(large) > len(small)</code>，把小顶堆最小弹回大顶堆"],
      ["取中位数", "奇数取 <code>-small[0]</code>，偶数取两顶平均"]
    ],
    trap: "Python 只有小顶堆，大顶堆要存负数；平衡条件写反会导致取错。",
    cx: ["O(log n)", "O(n)"],
    tmpl: `class MedianFinder:
    def __init__(self):
        self.small = []      # 大顶堆（存负），较小的一半，size >= large
        self.large = []      # 小顶堆，较大的一半

    def addNum(self, num: int) -> None:
        heapq.heappush(self.small, -num)
        heapq.heappush(self.large, -heapq.heappop(self.small))
        if len(self.large) > len(self.small):
            heapq.heappush(self.small, -heapq.heappop(self.large))

    def findMedian(self) -> float:
        if len(self.small) > len(self.large):
            return -self.small[0]
        return (-self.small[0] + self.large[0]) / 2`,
    viz: { k: "array", arr: ["add 1", "add 2", "median", "add 3", "median"] }
  }
  );
})();
