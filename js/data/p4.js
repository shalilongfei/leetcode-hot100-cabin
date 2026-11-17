/* Hot 100 · 数据 04 — 贪心(4) / 动态规划(10) / 多维动态规划(5) / 技巧(5) */
;(function () {
  const P = (window.H100 = window.H100 || []);

  P.push(
  /* ================= 贪心 ================= */
  {
    n: 121, t: "买卖股票的最佳时机", en: "Best Time to Buy and Sell Stock", d: "easy", cat: "贪心", freq: 5,
    tags: ["数组", "动态规划"],
    gist: "一次遍历：维护「<b>历史最低价</b>」，每天用当天价格减去它更新最大利润——相当于只在最低点买。",
    keys: [
      ["滚动最低", "<code>low = min(low, price)</code>"],
      ["更新答案", "<code>profit = max(profit, price - low)</code>"],
      ["顺序", "先算利润再更新 low 也等价（当天买卖利润为 0）"]
    ],
    trap: "只买卖一次，不能用「把所有上涨段加起来」的贪心。",
    cx: ["O(n)", "O(1)"],
    tmpl: `class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        low, profit = float('inf'), 0
        for p in prices:
            low = min(low, p)
            profit = max(profit, p - low)
        return profit`,
    viz: { k: "bars", arr: [7, 1, 5, 3, 6, 4] }
  },
  {
    n: 55, t: "跳跃游戏", en: "Jump Game", d: "medium", cat: "贪心", freq: 5,
    tags: ["贪心", "数组", "动态规划"],
    gist: "维护「<b>能到达的最远下标</b>」，若遍历到某个位置时它已经超出可达范围，说明到不了终点。",
    keys: [
      ["最远可达", "<code>far = max(far, i + nums[i])</code>"],
      ["判失败", "<code>i > far</code> 直接 False"],
      ["判成功", "遍历完或 <code>far >= n-1</code>"]
    ],
    trap: "不需要记录跳到哪一步，只要可达性；先判 <code>i > far</code> 再更新。",
    cx: ["O(n)", "O(1)"],
    tmpl: `class Solution:
    def canJump(self, nums: List[int]) -> bool:
        far = 0
        for i, x in enumerate(nums):
            if i > far: return False
            far = max(far, i + x)
        return True`,
    viz: { k: "array", arr: [2, 3, 1, 1, 4] }
  },
  {
    n: 45, t: "跳跃游戏 II", en: "Jump Game II", d: "medium", cat: "贪心", freq: 5,
    tags: ["贪心", "数组", "动态规划"],
    gist: "BFS 式贪心：把「当前跳跃步数能覆盖的区间」当作一层，走完这层就 <code>steps += 1</code> 并把边界推到最远。",
    keys: [
      ["当前边界", "<code>end</code> = 本层能到的最右位置"],
      ["最远", "<code>far = max(far, i + nums[i])</code>"],
      ["换层", "<code>i == end</code> 时 <code>steps += 1; end = far</code>"],
      ["提前停", "<code>end >= n-1</code> 就不用再走"]
    ],
    trap: "循环只到 <code>n-2</code>（最后一个格子不用再跳）；把 <code>steps</code> 初值写成 1 会多算。",
    cx: ["O(n)", "O(1)"],
    tmpl: `class Solution:
    def jump(self, nums: List[int]) -> int:
        n = len(nums)
        end = far = steps = 0
        for i in range(n - 1):
            far = max(far, i + nums[i])
            if i == end:              # 这一层走完了
                steps += 1
                end = far
        return steps`,
    viz: { k: "array", arr: [2, 3, 1, 1, 4] }
  },
  {
    n: 763, t: "划分字母区间", en: "Partition Labels", d: "medium", cat: "贪心", freq: 4,
    tags: ["贪心", "哈希表", "双指针", "字符串"],
    gist: "先记每个字母<b>最后出现的位置</b>，再扫描：区间右端不断被拉长，走到 <code>i == end</code> 就切一刀。",
    keys: [
      ["最后位置", "<code>last[ch] = i</code>"],
      ["扩张右端", "<code>end = max(end, last[ch])</code>"],
      ["切分", "<code>i == end</code> 时记录长度 <code>end-start+1</code> 并 <code>start = i+1</code>"]
    ],
    trap: "切点在「当前字符最后一次出现的位置」，不是第一个字符的最后位置。",
    cx: ["O(n)", "O(1)"],
    tmpl: `class Solution:
    def partitionLabels(self, s: str) -> List[int]:
        last = {ch: i for i, ch in enumerate(s)}
        res, start, end = [], 0, 0
        for i, ch in enumerate(s):
            end = max(end, last[ch])       # 右端扩张
            if i == end:                   # 可以切了
                res.append(end - start + 1)
                start = i + 1
        return res`,
    viz: { k: "array", arr: ["a","b","a","b","c","b","a","c","d","e"] }
  },

  /* ================= 动态规划 ================= */
  {
    n: 70, t: "爬楼梯", en: "Climbing Stairs", d: "easy", cat: "动态规划", freq: 5,
    tags: ["记忆化搜索", "数学", "动态规划"],
    gist: "到第 n 阶只能从 n-1 或 n-2 来 → <code>f(n) = f(n-1) + f(n-2)</code>，就是斐波那契，两个变量滚动即可。",
    keys: [
      ["状态", "<code>f[i]</code> = 到第 i 阶的方法数"],
      ["转移", "<code>f[i] = f[i-1] + f[i-2]</code>"],
      ["滚动", "<code>a, b = b, a+b</code>，O(1) 空间"]
    ],
    trap: "<code>n=1</code> 返回 1、<code>n=2</code> 返回 2，初值要写对；递归不记忆会指数爆炸。",
    cx: ["O(n)", "O(1)"],
    tmpl: `class Solution:
    def climbStairs(self, n: int) -> int:
        a, b = 1, 1          # f(0)=1, f(1)=1
        for _ in range(n):
            a, b = b, a + b
        return a`,
    viz: { k: "dp", dp: [1, 1, 2, 3, 5, 8, 13], win: 1 }
  },
  {
    n: 118, t: "杨辉三角", en: "Pascal's Triangle", d: "easy", cat: "动态规划", freq: 3,
    tags: ["数组", "动态规划"],
    gist: "每行首尾是 1，中间元素 = <b>上一行相邻两数之和</b>；逐行构造即可。",
    keys: [
      ["行内构造", "<code>[1] + [prev[j-1]+prev[j] for j in 1..len-1] + [1]</code>"],
      ["边界", "第 0 行是 <code>[1]</code>"],
      ["复杂度", "O(n²) 个元素，无法更优"]
    ],
    trap: "内层下标范围是 <code>1..len(prev)-1</code>，写错会越界。",
    cx: ["O(n²)", "O(n²)"],
    tmpl: `class Solution:
    def generate(self, numRows: int) -> List[List[int]]:
        res = []
        for i in range(numRows):
            if i == 0:
                res.append([1]); continue
            prev = res[-1]
            res.append([1] + [prev[j-1] + prev[j] for j in range(1, len(prev))] + [1])
        return res`,
    viz: { k: "dp", dp: [1, 1, 1, 1, 2, 1, 1, 3, 3, 1], win: 2 }
  },
  {
    n: 198, t: "打家劫舍", en: "House Robber", d: "medium", cat: "动态规划", freq: 5,
    tags: ["数组", "动态规划"],
    gist: "每家的选择是「偷（加上前前家）或不偷（沿用前一家）」，两个变量滚动：<code>cur = max(prev, prevprev + x)</code>。",
    keys: [
      ["状态", "<code>dp[i]</code> = 前 i 家的最大收益"],
      ["转移", "<code>dp[i] = max(dp[i-1], dp[i-2] + nums[i])</code>"],
      ["滚动", "<code>p2, p1 = p1, max(p1, p2 + x)</code>"]
    ],
    trap: "环形成环版本（213 题）要拆成「抢第一家」和「不抢第一家」两段。",
    cx: ["O(n)", "O(1)"],
    tmpl: `class Solution:
    def rob(self, nums: List[int]) -> int:
        p2 = p1 = 0            # dp[i-2], dp[i-1]
        for x in nums:
            p2, p1 = p1, max(p1, p2 + x)
        return p1`,
    viz: { k: "dp", dp: [2, 7, 9, 3, 1], win: 1 }
  },
  {
    n: 279, t: "完全平方数", en: "Perfect Squares", d: "medium", cat: "动态规划", freq: 4,
    tags: ["广度优先搜索", "数学", "动态规划"],
    gist: "完全背包：<code>dp[i] = min(dp[i - j²] + 1)</code>；数学结论是答案只有 1/2/3/4（四平方定理）。",
    keys: [
      ["状态", "<code>dp[i]</code> = 凑出 i 的最少个数"],
      ["转移", "枚举 <code>j*j <= i</code>，<code>dp[i] = min(dp[i], dp[i-j*j]+1)</code>"],
      ["优化", "BFS 按层搜索等价解法；数学版 O(√n) 但不易想到"]
    ],
    trap: "<code>dp</code> 初值要给大数（如 <code>i</code> 本身）；<code>j</code> 从 1 开始。",
    cx: ["O(n√n)", "O(n)"],
    tmpl: `class Solution:
    def numSquares(self, n: int) -> int:
        dp = [0] + [float('inf')] * n
        for i in range(1, n + 1):
            j = 1
            while j * j <= i:
                dp[i] = min(dp[i], dp[i - j * j] + 1)
                j += 1
        return dp[n]`,
    viz: { k: "dp", dp: [0, 1, 2, 3, 1, 2, 3, 4, 2, 1, 2, 3, 3], win: 1 }
  },
  {
    n: 322, t: "零钱兑换", en: "Coin Change", d: "medium", cat: "动态规划", freq: 5,
    tags: ["广度优先搜索", "数组", "动态规划"],
    gist: "完全背包求最少个数：<code>dp[amount]</code> 由 <code>dp[amount - coin] + 1</code> 推来，遍历顺序无所谓（求最小不是求方案数）。",
    keys: [
      ["状态", "<code>dp[i]</code> = 凑出 i 的最少硬币数，初值 <code>amount+1</code> 表示不可达"],
      ["转移", "对每个硬币 <code>c</code>：<code>dp[i] = min(dp[i], dp[i-c]+1)</code>"],
      ["答案", "<code>dp[amount] > amount</code> 则 -1"]
    ],
    trap: "求「方案数」（518 题）时循环顺序有讲究；这里求最小，先遍历金额或先遍历硬币都对。",
    cx: ["O(amount·k)", "O(amount)"],
    tmpl: `class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        INF = amount + 1                  # 天然大于任何合法答案
        dp = [0] + [INF] * amount
        for i in range(1, amount + 1):
            for c in coins:
                if c <= i:
                    dp[i] = min(dp[i], dp[i - c] + 1)
        return -1 if dp[amount] > amount else dp[amount]`,
    viz: { k: "dp", dp: [0, 1, 1, 2, 2, 1, 2, 2, 3, 3, 2, 3], win: 1 }
  },
  {
    n: 139, t: "单词拆分", en: "Word Break", d: "medium", cat: "动态规划", freq: 5,
    tags: ["字典树", "记忆化搜索", "数组", "哈希表", "字符串", "动态规划"],
    gist: "<code>dp[i]</code> 表示前缀 <code>s[:i]</code> 能否被拼出；枚举切点 <code>j</code>，只要 <code>dp[j]</code> 且 <code>s[j:i]</code> 在词典中就为真。",
    keys: [
      ["状态", "<code>dp[0] = True</code>，其余 False"],
      ["转移", "<code>for j in range(i): if dp[j] and s[j:i] in words: dp[i] = True</code>"],
      ["剪枝", "记录词典最大长度，<code>j</code> 只枚举 <code>i - maxLen</code> 之后"]
    ],
    trap: "把物品放外层（完全背包写法）在这题不成立——因为子串必须连续；必须按位置切分。",
    cx: ["O(n²·L)", "O(n)"],
    tmpl: `class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> bool:
        words = set(wordDict)
        maxLen = max(map(len, words))
        n = len(s)
        dp = [False] * (n + 1)
        dp[0] = True
        for i in range(1, n + 1):
            for j in range(max(0, i - maxLen), i):
                if dp[j] and s[j:i] in words:
                    dp[i] = True
                    break
        return dp[n]`,
    viz: { k: "array", arr: ["l","e","e","t","c","o","d","e"] }
  },
  {
    n: 300, t: "最长递增子序列", en: "Longest Increasing Subsequence", d: "medium", cat: "动态规划", freq: 5,
    tags: ["数组", "二分查找", "动态规划"],
    gist: "O(n log n) 的 <code>tails</code> 数组：<code>tails[i]</code> 存「长度 i+1 的递增子序列的最小结尾」，用二分替换。<b>tails 不是答案序列，长度才是答案</b>。",
    keys: [
      ["tails 含义", "长度为 i+1 的 LIS 的最小可能尾元素"],
      ["二分", "<code>bisect_left(tails, x)</code> 找第一个 >= x 的位置替换"],
      ["答案", "<code>len(tails)</code>"]
    ],
    trap: "别把 <code>tails</code> 当真实 LIS 打印；严格递增用 <code>bisect_left</code>，非严格用 <code>bisect_right</code>。",
    cx: ["O(n log n)", "O(n)"],
    tmpl: `class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        tails = []
        for x in nums:
            i = bisect_left(tails, x)      # 第一个 >= x
            if i == len(tails):
                tails.append(x)            # 扩展长度
            else:
                tails[i] = x               # 替换，让结尾更小
        return len(tails)`,
    viz: { k: "array", arr: [10, 9, 2, 5, 3, 7, 101, 18] }
  },
  {
    n: 152, t: "乘积最大子数组", en: "Maximum Product Subarray", d: "medium", cat: "动态规划", freq: 4,
    tags: ["数组", "动态规划"],
    gist: "乘法会「负负得正」，所以必须<b>同时维护最大和最小</b>两个以 i 结尾的乘积。",
    keys: [
      ["双状态", "<code>mx</code> / <code>mn</code> 以当前元素结尾的最大/最小乘积"],
      ["转移", "新 <code>mx = max(x, mx*x, mn*x)</code>，<code>mn</code> 同理取 min"],
      ["必须同时更新", "先算完新的 mx、mn 再赋值，或临时变量缓存"]
    ],
    trap: "只维护最大值会漏掉「负数乘负数变最大」；元素为 0 时两个状态都归零重开。",
    cx: ["O(n)", "O(1)"],
    tmpl: `class Solution:
    def maxProduct(self, nums: List[int]) -> int:
        mx = mn = best = nums[0]
        for x in nums[1:]:
            a, b = mx * x, mn * x
            mx = max(x, a, b)
            mn = min(x, a, b)
            best = max(best, mx)
        return best`,
    viz: { k: "array", arr: [2, 3, -2, 4] }
  },
  {
    n: 416, t: "分割等和子集", en: "Partition Equal Subset Sum", d: "medium", cat: "动态规划", freq: 5,
    tags: ["数组", "动态规划", "01 背包"],
    gist: "总和为奇数直接 False；否则问题变成「能否用这些数凑出 <code>sum/2</code>」——01 背包，<b>一维数组要倒序遍历</b>。",
    keys: [
      ["先筛", "总和奇数 → False；最大值 > target → False"],
      ["状态", "<code>dp[j]</code> = 能否凑出 j，<code>dp[0]=True</code>"],
      ["倒序", "<code>for j in range(target, x-1, -1)</code>，保证每个数只用一次"]
    ],
    trap: "正序遍历会变成完全背包（数字可重复用），这题必须倒序。",
    cx: ["O(n·target)", "O(target)"],
    tmpl: `class Solution:
    def canPartition(self, nums: List[int]) -> bool:
        total = sum(nums)
        if total % 2: return False
        target = total // 2
        if max(nums) > target: return False
        dp = [False] * (target + 1)
        dp[0] = True
        for x in nums:
            for j in range(target, x - 1, -1):   # 倒序！
                dp[j] = dp[j] or dp[j - x]
        return dp[target]`,
    viz: { k: "dp", dp: [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1], win: 1 }
  },
  {
    n: 32, t: "最长有效括号", en: "Longest Valid Parentheses", d: "hard", cat: "动态规划", freq: 4,
    tags: ["栈", "字符串", "动态规划"],
    gist: "栈里存<b>下标</b>并放一个 <code>-1</code> 哨兵；遇到 <code>')'</code> 弹出后若栈空就压当前下标当新基准，否则 <code>i - stack[-1]</code> 就是一段合法长度。",
    keys: [
      ["哨兵", "<code>stack = [-1]</code>"],
      ["左括号", "压下标"],
      ["右括号", "pop；若空则压 <code>i</code> 作新基准；否则更新 <code>max(i - stack[-1])</code>"]
    ],
    trap: "栈空时不要直接算长度；DP 版本要注意 <code>dp[i-2]</code> 与嵌套情形的拼接。",
    cx: ["O(n)", "O(n)"],
    tmpl: `class Solution:
    def longestValidParentheses(self, s: str) -> int:
        stack, best = [-1], 0
        for i, ch in enumerate(s):
            if ch == '(':
                stack.append(i)
            else:
                stack.pop()
                if not stack:
                    stack.append(i)          # 新基准
                else:
                    best = max(best, i - stack[-1])
        return best`,
    viz: { k: "array", arr: ["(", ")", "(", "(", ")", ")", ")"] }
  },

  /* ================= 多维动态规划 ================= */
  {
    n: 62, t: "不同路径", en: "Unique Paths", d: "medium", cat: "多维动态规划", freq: 4,
    tags: ["数学", "动态规划", "组合数学"],
    gist: "只能向右或向下 → <code>dp[i][j] = dp[i-1][j] + dp[i][j-1]</code>；一维滚动只要 <code>dp[j] += dp[j-1]</code>。",
    keys: [
      ["初始化", "第一行第一列全为 1"],
      ["转移", "从上和从左累加"],
      ["滚动数组", "<code>dp[j] = dp[j] + dp[j-1]</code>（等号左边是上一行）"]
    ],
    trap: "一维滚动时 <code>dp[0]</code> 每行都要重置为 1；组合数公式 C(m+n-2, m-1) 也行。",
    cx: ["O(m·n)", "O(n)"],
    tmpl: `class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        dp = [1] * n                 # 第一行
        for _ in range(1, m):
            for j in range(1, n):
                dp[j] += dp[j - 1]   # 上 + 左
        return dp[-1]`,
    viz: { k: "dp", dp: [1, 1, 1, 1, 2, 3, 1, 3, 6], win: 3 }
  },
  {
    n: 64, t: "最小路径和", en: "Minimum Path Sum", d: "medium", cat: "多维动态规划", freq: 4,
    tags: ["数组", "动态规划", "矩阵"],
    gist: "原地 DP：<code>grid[i][j] += min(上, 左)</code>，第一行只能从左来、第一列只能从上来，先单独处理。",
    keys: [
      ["初始化", "<code>grid[0][j] += grid[0][j-1]</code>，<code>grid[i][0] += grid[i-1][0]</code>"],
      ["转移", "<code>grid[i][j] += min(grid[i-1][j], grid[i][j-1])</code>"],
      ["答案", "<code>grid[-1][-1]</code>"]
    ],
    trap: "不先处理第一行第一列，<code>min</code> 会取到未初始化的邻居；题目允许原地修改。",
    cx: ["O(m·n)", "O(1)"],
    tmpl: `class Solution:
    def minPathSum(self, grid: List[List[int]]) -> int:
        m, n = len(grid), len(grid[0])
        for j in range(1, n): grid[0][j] += grid[0][j-1]
        for i in range(1, m): grid[i][0] += grid[i-1][0]
        for i in range(1, m):
            for j in range(1, n):
                grid[i][j] += min(grid[i-1][j], grid[i][j-1])
        return grid[-1][-1]`,
    viz: { k: "grid", grid: [[1,3,1],[1,5,1],[4,2,1]] }
  },
  {
    n: 5, t: "最长回文子串", en: "Longest Palindromic Substring", d: "medium", cat: "多维动态规划", freq: 5,
    tags: ["双指针", "字符串", "动态规划"],
    gist: "中心扩展最好写：枚举 <code>2n-1</code> 个中心（含奇数/偶数），向两边扩到不相等为止。",
    keys: [
      ["中心扩展", "<code>expand(l, r)</code>，返回长度"],
      ["两类中心", "单个字符（奇数）与相邻两字符（偶数）"],
      ["记录最优", "比较长度，更新 <code>start</code> 与 <code>maxLen</code>"]
    ],
    trap: "偶数长度的中心是 <code>(i, i+1)</code>；Manacher 可 O(n) 但面试一般中心扩展够。",
    cx: ["O(n²)", "O(1)"],
    tmpl: `class Solution:
    def longestPalindrome(self, s: str) -> str:
        start, maxLen = 0, 1
        def expand(l, r):
            while l >= 0 and r < len(s) and s[l] == s[r]:
                l -= 1; r += 1
            return r - l - 1        # 实际回文长度
        for i in range(len(s)):
            for l, r in ((i, i), (i, i + 1)):
                cur = expand(l, r)
                if cur > maxLen:
                    maxLen = cur
                    start = i - (cur - 1) // 2
        return s[start:start + maxLen]`,
    viz: { k: "array", arr: ["b","a","b","a","d"] }
  },
  {
    n: 1143, t: "最长公共子序列", en: "Longest Common Subsequence", d: "medium", cat: "多维动态规划", freq: 5,
    tags: ["字符串", "动态规划"],
    gist: "二维 DP 的母题：字符相同就 <code>dp[i][j] = dp[i-1][j-1] + 1</code>，不同就 <code>max(上, 左)</code>。",
    keys: [
      ["状态", "<code>dp[i][j]</code> = <code>a[:i]</code> 与 <code>b[:j]</code> 的 LCS 长度"],
      ["转移", "相等取左上 +1；不等取 max(上, 左)"],
      ["答案", "<code>dp[m][n]</code>"]
    ],
    trap: "下标从 1 开始避免边界判断；子串（连续）是另一道题，不能直接套。",
    cx: ["O(m·n)", "O(m·n)"],
    tmpl: `class Solution:
    def longestCommonSubsequence(self, text1: str, text2: str) -> int:
        m, n = len(text1), len(text2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if text1[i-1] == text2[j-1]:
                    dp[i][j] = dp[i-1][j-1] + 1
                else:
                    dp[i][j] = max(dp[i-1][j], dp[i][j-1])
        return dp[m][n]`,
    viz: { k: "dp", dp: [0,0,0,0, 0,1,1,1, 0,1,1,1, 0,1,2,2, 0,1,2,3], win: 4 }
  },
  {
    n: 72, t: "编辑距离", en: "Edit Distance", d: "medium", cat: "多维动态规划", freq: 5,
    tags: ["字符串", "动态规划"],
    gist: "三种操作对应三个方向：<b>替换=左上、删除=上、插入=左</b>，取三者最小 +1；字符相同则直接继承左上。",
    keys: [
      ["初始化", "<code>dp[i][0]=i</code>，<code>dp[0][j]=j</code>"],
      ["相同", "<code>dp[i][j] = dp[i-1][j-1]</code>"],
      ["不同", "<code>1 + min(左上, 上, 左)</code>"]
    ],
    trap: "三个方向的含义别混（删除对应 <code>dp[i-1][j]</code>）；边界行必须初始化。",
    cx: ["O(m·n)", "O(m·n)"],
    tmpl: `class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        m, n = len(word1), len(word2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        for i in range(m + 1): dp[i][0] = i
        for j in range(n + 1): dp[0][j] = j
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if word1[i-1] == word2[j-1]:
                    dp[i][j] = dp[i-1][j-1]
                else:
                    dp[i][j] = 1 + min(dp[i-1][j-1],   # 替换
                                       dp[i-1][j],     # 删除
                                       dp[i][j-1])     # 插入
        return dp[m][n]`,
    viz: { k: "dp", dp: [0,1,2,3, 1,0,1,2, 2,1,1,2, 3,2,2,2], win: 4 }
  },

  /* ================= 技巧 ================= */
  {
    n: 136, t: "只出现一次的数字", en: "Single Number", d: "easy", cat: "技巧", freq: 5,
    tags: ["位运算", "数组"],
    gist: "异或的三条性质：<code>a^a=0</code>、<code>a^0=a</code>、满足交换律——全部异或起来，成对的自动抵消。",
    keys: [
      ["一次遍历", "<code>ans ^= x</code>"],
      ["结果", "剩下的就是唯一出现的数"],
      ["扩展", "出现三次的版本（137 题）要用位计数或状态机"]
    ],
    trap: "这题要求 O(1) 空间，用哈希表虽然能过但不符合进阶要求。",
    cx: ["O(n)", "O(1)"],
    tmpl: `class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        ans = 0
        for x in nums:
            ans ^= x
        return ans`,
    viz: { k: "array", arr: [4, 1, 2, 1, 2] }
  },
  {
    n: 169, t: "多数元素", en: "Majority Element", d: "easy", cat: "技巧", freq: 5,
    tags: ["数组", "哈希表", "分治", "计数", "排序"],
    gist: "摩尔投票：不同就抵消，相同就加票——超过半数的元素<b>抵消不完</b>，最后剩下的就是它。",
    keys: [
      ["候选 + 票数", "<code>cand, cnt</code>"],
      ["抵消", "<code>cnt == 0</code> 时换候选；相同 <code>cnt += 1</code>，不同 <code>cnt -= 1</code>"],
      ["正确性", "多数元素出现次数 > 其余总和"]
    ],
    trap: "候选初值要给 <code>nums[0]</code> 或把 <code>cnt=0</code> 的判断放前面；这题保证一定存在多数元素。",
    cx: ["O(n)", "O(1)"],
    tmpl: `class Solution:
    def majorityElement(self, nums: List[int]) -> int:
        cand, cnt = None, 0
        for x in nums:
            if cnt == 0:
                cand = x
            cnt += 1 if x == cand else -1
        return cand`,
    viz: { k: "array", arr: [2, 2, 1, 1, 1, 2, 2] }
  },
  {
    n: 75, t: "颜色分类", en: "Sort Colors", d: "medium", cat: "技巧", freq: 5,
    tags: ["数组", "双指针", "排序"],
    gist: "荷兰国旗三指针：<code>[0,p0)</code> 全是 0、<code>[p0,i)</code> 全是 1、<code>(p2,n-1]</code> 全是 2；<b>遇到 2 交换后不能 i++</b>。",
    keys: [
      ["三指针", "<code>p0=0</code>、<code>i=0</code>、<code>p2=n-1</code>"],
      ["为 0", "换到前面，<code>p0++, i++</code>"],
      ["为 2", "换到后面，<code>p2--</code>，<b>i 不动</b>（换过来的是未检查值）"],
      ["为 1", "<code>i++</code>"]
    ],
    trap: "为 2 时 <code>i++</code> 会漏掉换过来的元素；循环条件 <code>i <= p2</code>。",
    cx: ["O(n)", "O(1)"],
    tmpl: `class Solution:
    def sortColors(self, nums: List[int]) -> None:
        p0, i, p2 = 0, 0, len(nums) - 1
        while i <= p2:
            if nums[i] == 0:
                nums[p0], nums[i] = nums[i], nums[p0]
                p0 += 1; i += 1
            elif nums[i] == 2:
                nums[i], nums[p2] = nums[p2], nums[i]
                p2 -= 1              # i 不动，换过来的还没检查
            else:
                i += 1`,
    viz: { k: "array", arr: [2, 0, 2, 1, 1, 0] }
  },
  {
    n: 31, t: "下一个排列", en: "Next Permutation", d: "medium", cat: "技巧", freq: 4,
    tags: ["数组", "双指针"],
    gist: "从右往左找第一个「升序对」<code>a[i] < a[i+1]</code>，再在右边找<b>比 a[i] 大的最小元素</b>交换，最后反转后缀。",
    keys: [
      ["找 i", "从右往左第一个 <code>nums[i] < nums[i+1]</code>"],
      ["找 j", "从右往左第一个 <code>nums[j] > nums[i]</code>，交换"],
      ["反转后缀", "<code>nums[i+1:]</code> 反转成升序（原本是降序）"],
      ["最大排列", "找不到 i 说明整体降序，直接反转成最小排列"]
    ],
    trap: "交换后后缀一定是降序，反转即可，不要再排序；<code>j</code> 从右往左找才保证是「最小的大于」。",
    cx: ["O(n)", "O(1)"],
    tmpl: `class Solution:
    def nextPermutation(self, nums: List[int]) -> None:
        n = len(nums)
        i = n - 2
        while i >= 0 and nums[i] >= nums[i + 1]:
            i -= 1
        if i >= 0:
            j = n - 1
            while nums[j] <= nums[i]:
                j -= 1
            nums[i], nums[j] = nums[j], nums[i]
        l, r = i + 1, n - 1
        while l < r:
            nums[l], nums[r] = nums[r], nums[l]
            l += 1; r -= 1`,
    viz: { k: "array", arr: [1, 2, 3] }
  },
  {
    n: 287, t: "寻找重复数", en: "Find the Duplicate Number", d: "medium", cat: "技巧", freq: 5,
    tags: ["位运算", "数组", "双指针", "二分查找"],
    gist: "把 <code>i -> nums[i]</code> 看成链表，重复数就是<b>环的入口</b>——用「环形链表 II」的快慢指针解，O(1) 空间。",
    keys: [
      ["建映射", "<code>next(i) = nums[i]</code>"],
      ["找相遇", "快慢指针相遇"],
      ["找入口", "一个指针回起点，同步走，相遇点即重复数"]
    ],
    trap: "数组值范围 <code>[1,n]</code> 才不会越界；二分计数法 O(n log n) 也可但不如这个优雅。",
    cx: ["O(n)", "O(1)"],
    tmpl: `class Solution:
    def findDuplicate(self, nums: List[int]) -> int:
        slow = fast = 0
        while True:
            slow = nums[slow]
            fast = nums[nums[fast]]
            if slow == fast:
                break
        p = 0
        while p != slow:
            p = nums[p]
            slow = nums[slow]
        return p`,
    viz: { k: "array", arr: [1, 3, 4, 2, 2] }
  }
  );
})();
