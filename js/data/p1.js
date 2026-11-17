/* Hot 100 · 数据 01 — 哈希 / 双指针 / 滑动窗口 / 子串 / 普通数组 / 矩阵 / 链表(前4) */
;(function () {
  const P = (window.H100 = window.H100 || []);

  P.push(
  /* ================= 哈希 ================= */
  {
    n: 1, t: "两数之和", en: "Two Sum", d: "easy", cat: "哈希", freq: 5,
    tags: ["数组", "哈希表"],
    gist: "把「找另一个数」变成「查表」——遍历到 x 时，只问一句：<b>target - x 有没有在我左边出现过</b>。",
    keys: [
      ["边查边存", "先查 <code>target - x</code> 是否在哈希表，命中直接返回 <code>[idx, i]</code>"],
      ["顺序不能反", "查完再写入 <code>nums[i] -> i</code>，反了会把当前元素自己算成配对"],
      ["一趟搞定", "只遍历一次，天然满足「同一元素不能用两次」"]
    ],
    trap: "先 put 再 get 会拿到自己；返回的是<b>下标</b>不是值。",
    cx: ["O(n)", "O(n)"],
    tmpl: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        seen = {}                      # 值 -> 下标
        for i, x in enumerate(nums):
            need = target - x
            if need in seen:           # 先查
                return [seen[need], i]
            seen[x] = i                # 后存
        return []`,
    viz: { k: "array", arr: [2, 7, 11, 15, 1, 8], target: 9 }
  },
  {
    n: 49, t: "字母异位词分组", en: "Group Anagrams", d: "medium", cat: "哈希", freq: 4,
    tags: ["数组", "哈希表", "字符串", "排序"],
    gist: "异位词共享同一个「指纹」——把 key 换成<b>排序后的字符串</b>（或 26 位计数元组），分组退化成哈希聚合。",
    keys: [
      ["指纹方案 A", "<code>\"\".join(sorted(s))</code> 好写，代价 O(L log L)"],
      ["指纹方案 B", "26 长度计数元组，O(L)，面试可加分"],
      ["聚合", "<code>defaultdict(list)</code>：指纹 → 单词列表，最后取 values"]
    ],
    trap: "计数指纹必须是 <b>tuple</b>，list 不可哈希；空串要能正常分组。",
    cx: ["O(n·L log L)", "O(n·L)"],
    tmpl: `class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        groups = defaultdict(list)
        for s in strs:
            cnt = [0] * 26
            for ch in s:
                cnt[ord(ch) - 97] += 1
            groups[tuple(cnt)].append(s)   # tuple 才能当 key
        return list(groups.values())`,
    viz: { k: "array", arr: ["eat", "tea", "tan", "ate", "nat", "bat"] }
  },
  {
    n: 128, t: "最长连续序列", en: "Longest Consecutive Sequence", d: "medium", cat: "哈希", freq: 4,
    tags: ["并查集", "数组", "哈希表"],
    gist: "只在<b>序列起点</b>开始数：<code>x-1</code> 不存在才启动，于是每个数最多被访问两次，总代价 O(n)。",
    keys: [
      ["建集合", "全部塞进 <code>set</code>：去重 + O(1) 查前驱"],
      ["只从起点出发", "<code>if x-1 not in s</code> 才向上数 <code>x+1, x+2...</code>"],
      ["复杂度证明", "内层 while 的总步数 = 序列总长度 ≤ n"]
    ],
    trap: "对每个数都双向扩展会退化 O(n²)；排序能过但不是题意要的 O(n)。",
    cx: ["O(n)", "O(n)"],
    tmpl: `class Solution:
    def longestConsecutive(self, nums: List[int]) -> int:
        s = set(nums)
        best = 0
        for x in s:
            if x - 1 in s:          # 不是起点，跳过
                continue
            y = x
            while y + 1 in s:
                y += 1
            best = max(best, y - x + 1)
        return best`,
    viz: { k: "array", arr: [100, 4, 200, 1, 3, 2] }
  },

  /* ================= 双指针 ================= */
  {
    n: 283, t: "移动零", en: "Move Zeroes", d: "easy", cat: "双指针", freq: 4,
    tags: ["数组", "双指针"],
    gist: "写指针 <code>w</code> 是「下一个非零元素的落点」，把非零往前挤，剩下的位置自然全是 0。",
    keys: [
      ["双指针", "<code>w</code> 指向待填位，<code>r</code> 一直往前扫"],
      ["交换而非覆盖", "<code>nums[r] != 0</code> 就 <code>swap(nums[w], nums[r]); w += 1</code>"],
      ["自带补零", "交换写法不需要再手动填 0，时间复杂度仍 O(n)"]
    ],
    trap: "额外开数组不算原地；<code>w</code> 不会超过 <code>r</code>，别写成两个独立的指针遍历。",
    cx: ["O(n)", "O(1)"],
    tmpl: `class Solution:
    def moveZeroes(self, nums: List[int]) -> None:
        w = 0                       # 下一个非零的落点
        for r in range(len(nums)):
            if nums[r] != 0:
                nums[w], nums[r] = nums[r], nums[w]
                w += 1`,
    viz: { k: "array", arr: [0, 1, 0, 3, 12] }
  },
  {
    n: 11, t: "盛最多水的容器", en: "Container With Most Water", d: "medium", cat: "双指针", freq: 5,
    tags: ["数组", "双指针", "贪心"],
    gist: "面积由<b>矮的那根</b>决定，所以把高的往里挪毫无意义——每一步只收缩较短的一侧。",
    keys: [
      ["面积公式", "<code>area = min(h[l], h[r]) * (r - l)</code>"],
      ["移动策略", "<code>h[l] < h[r]</code> 则 <code>l++</code>，否则 <code>r--</code>"],
      ["正确性", "被丢弃的柱子作为边界时，高度不会超过当前矮柱，宽度还更小，故不可能更优"]
    ],
    trap: "别排序（下标信息丢失）；相等时随便动一边，但一次只动一边。",
    cx: ["O(n)", "O(1)"],
    tmpl: `class Solution:
    def maxArea(self, height: List[int]) -> int:
        l, r, best = 0, len(height) - 1, 0
        while l < r:
            best = max(best, min(height[l], height[r]) * (r - l))
            if height[l] < height[r]:
                l += 1
            else:
                r -= 1
        return best`,
    viz: { k: "bars", arr: [1, 8, 6, 2, 5, 4, 8, 3, 7] }
  },
  {
    n: 15, t: "三数之和", en: "3Sum", d: "medium", cat: "双指针", freq: 5,
    tags: ["数组", "双指针", "排序"],
    gist: "排序后固定第一个数，剩余两数用<b>对撞双指针</b>找——把 O(n³) 压到 O(n²)。",
    keys: [
      ["固定 + 对撞", "枚举 <code>i</code>，<code>l=i+1, r=n-1</code>，和偏小 <code>l++</code>，偏大 <code>r--</code>"],
      ["三处去重", "<code>nums[i]==nums[i-1]</code> 跳过；命中后 <code>l/r</code> 各自跳过重复"],
      ["剪枝", "<code>nums[i] > 0</code> 直接 break（后面不可能凑成 0）"]
    ],
    trap: "只去重 i 会输出重复三元组；<code>[-1,0,1]</code> 与 <code>[0,-1,1]</code> 是同一个答案。",
    cx: ["O(n²)", "O(1)"],
    tmpl: `class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        nums.sort()
        res, n = [], len(nums)
        for i in range(n - 2):
            if nums[i] > 0: break
            if i > 0 and nums[i] == nums[i - 1]: continue
            l, r = i + 1, n - 1
            while l < r:
                s = nums[i] + nums[l] + nums[r]
                if s < 0: l += 1
                elif s > 0: r -= 1
                else:
                    res.append([nums[i], nums[l], nums[r]])
                    l += 1; r -= 1
                    while l < r and nums[l] == nums[l - 1]: l += 1
                    while l < r and nums[r] == nums[r + 1]: r -= 1
        return res`,
    viz: { k: "array", arr: [-1, 0, 1, 2, -1, -4] }
  },
  {
    n: 42, t: "接雨水", en: "Trapping Rain Water", d: "hard", cat: "双指针", freq: 5,
    tags: ["栈", "数组", "双指针", "动态规划"],
    gist: "每个格子能接的水 = <code>min(左最高, 右最高) - 自身高度</code>；双指针让「两侧最高」边移动边维护。",
    keys: [
      ["双指针结算", "<code>lmax/rmax</code> 记录当前左右最高，移动较矮的一侧"],
      ["为什么能结算", "矮的那侧已被对面更高的柱子兜住，水位可以确定"],
      ["累加", "先更新 <code>lmax</code>，再 <code>ans += lmax - h[l]</code>"]
    ],
    trap: "只在自己移动的那侧结算；用栈写法也 O(n) 但下标更容易写错。",
    cx: ["O(n)", "O(1)"],
    tmpl: `class Solution:
    def trap(self, height: List[int]) -> int:
        l, r = 0, len(height) - 1
        lmax = rmax = ans = 0
        while l < r:
            if height[l] < height[r]:
                lmax = max(lmax, height[l])
                ans += lmax - height[l]
                l += 1
            else:
                rmax = max(rmax, height[r])
                ans += rmax - height[r]
                r -= 1
        return ans`,
    viz: { k: "bars", arr: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1] }
  },

  /* ================= 滑动窗口 ================= */
  {
    n: 3, t: "无重复字符的最长子串", en: "Longest Substring Without Repeating Characters", d: "medium", cat: "滑动窗口", freq: 5,
    tags: ["哈希表", "字符串", "滑动窗口"],
    gist: "窗口内永远是「无重复」的：右指针扩、左边界<b>直接跳</b>到重复字符的下一位。",
    keys: [
      ["记录最近位置", "<code>last[ch] = i</code>"],
      ["左边界跳", "若 <code>last[ch] >= l</code> 则 <code>l = last[ch] + 1</code>，不是一格一格缩"],
      ["随时更新答案", "<code>ans = max(ans, r - l + 1)</code>"]
    ],
    trap: "<code>l</code> 只能右移不能回退，要写 <code>l = max(l, last[ch] + 1)</code>。",
    cx: ["O(n)", "O(1)"],
    tmpl: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        last, l, ans = {}, 0, 0
        for r, ch in enumerate(s):
            if ch in last and last[ch] >= l:
                l = last[ch] + 1        # 左边界跳到重复字符之后
            last[ch] = r
            ans = max(ans, r - l + 1)
        return ans`,
    viz: { k: "array", arr: ["a", "b", "c", "a", "b", "c", "b", "b"] }
  },
  {
    n: 438, t: "找到字符串中所有字母异位词", en: "Find All Anagrams in a String", d: "medium", cat: "滑动窗口", freq: 4,
    tags: ["哈希表", "字符串", "滑动窗口"],
    gist: "定长窗口 + 26 位计数差：滑动时「进一个字符、出一个字符」，差为 0 即命中。",
    keys: [
      ["窗口大小固定", "窗口长度永远等于 <code>len(p)</code>"],
      ["差量维护", "维护 <code>diff</code> 变量或直接比较两个计数数组"],
      ["命中收集", "窗口达标时把左端点放进结果"]
    ],
    trap: "<code>len(p) > len(s)</code> 要直接返回空；出窗字符别漏减。",
    cx: ["O(n)", "O(1)"],
    tmpl: `class Solution:
    def findAnagrams(self, s: str, p: str) -> List[int]:
        n, m = len(s), len(p)
        if m > n: return []
        need, win, res = [0] * 26, [0] * 26, []
        for ch in p: need[ord(ch) - 97] += 1
        for i in range(n):
            win[ord(s[i]) - 97] += 1
            if i >= m:
                win[ord(s[i - m]) - 97] -= 1     # 出窗
            if win == need:
                res.append(i - m + 1)
        return res`,
    viz: { k: "array", arr: ["c", "b", "a", "e", "b", "a", "b", "a", "c"], target: "abc" }
  },

  /* ================= 子串 ================= */
  {
    n: 560, t: "和为 K 的子数组", en: "Subarray Sum Equals K", d: "medium", cat: "子串", freq: 5,
    tags: ["数组", "哈希表", "前缀和"],
    gist: "<code>sum[j] - sum[i] = k</code> 移项后：每个 <code>j</code> 只需要问「<b>有多少个前缀和等于 sum[j]-k</b>」。",
    keys: [
      ["前缀和 + 计数", "哈希表存 <code>前缀和 -> 出现次数</code>，初始化 <code>{0: 1}</code>"],
      ["先查后存", "先 <code>ans += cnt[pre - k]</code>，再 <code>cnt[pre] += 1</code>"],
      ["为什么要 {0:1}", "代表空前缀，让「从下标 0 开始的子数组」也能被统计"]
    ],
    trap: "有负数 → 窗口不单调，不能用滑动窗口；顺序写反会把空子数组算进去。",
    cx: ["O(n)", "O(n)"],
    tmpl: `class Solution:
    def subarraySum(self, nums: List[int], k: int) -> int:
        cnt = {0: 1}            # 前缀和 -> 次数
        pre = ans = 0
        for x in nums:
            pre += x
            ans += cnt.get(pre - k, 0)   # 先查
            cnt[pre] = cnt.get(pre, 0) + 1  # 后存
        return ans`,
    viz: { k: "array", arr: [1, 2, 3, -3, 1, 1, 1], target: 3 }
  },
  {
    n: 239, t: "滑动窗口最大值", en: "Sliding Window Maximum", d: "hard", cat: "子串", freq: 5,
    tags: ["队列", "数组", "滑动窗口", "单调队列"],
    gist: "维护一个<b>下标单调递减</b>的双端队列，队首永远是当前窗口的最大值。",
    keys: [
      ["入队前清理", "弹出队尾所有 <code>nums[dq[-1]] <= nums[i]</code>，它们永远没机会当最大值"],
      ["过期清理", "队首下标 <code><= i-k</code> 就 popleft"],
      ["收集答案", "<code>i >= k-1</code> 时 <code>res.append(nums[dq[0]])</code>"]
    ],
    trap: "队列存<b>下标</b>而非值（要判过期）；弹出条件用 <code><=</code> 才能保证严格单调。",
    cx: ["O(n)", "O(k)"],
    tmpl: `class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        dq, res = deque(), []          # 存下标，值单调递减
        for i, x in enumerate(nums):
            while dq and nums[dq[-1]] <= x:
                dq.pop()
            dq.append(i)
            if dq[0] <= i - k:         # 过期
                dq.popleft()
            if i >= k - 1:
                res.append(nums[dq[0]])
        return res`,
    viz: { k: "array", arr: [1, 3, -1, -3, 5, 3, 6, 7], win: 3 }
  },
  {
    n: 76, t: "最小覆盖子串", en: "Minimum Window Substring", d: "hard", cat: "子串", freq: 5,
    tags: ["哈希表", "字符串", "滑动窗口"],
    gist: "用 <code>need / valid</code> 刻画「可行窗口」：右扩到达标，左缩到刚好破标，全程记录最短。",
    keys: [
      ["双计数", "<code>need</code> 统计 t，<code>window</code> 统计当前窗口"],
      ["按种类计数", "<code>valid</code> 统计已满足的 <b>字符种类数</b>，<code>window[c]==need[c]</code> 时 +1"],
      ["收缩循环", "<code>valid == len(need)</code> 时更新答案并右移 <code>l</code>，破了标就退出"]
    ],
    trap: "<code>valid</code> 按种类不能按个数；收缩时窗口计数必须同步减。",
    cx: ["O(n)", "O(1)"],
    tmpl: `class Solution:
    def minWindow(self, s: str, t: str) -> str:
        need = Counter(t)
        window = defaultdict(int)
        valid, need_kinds = 0, len(need)
        l = 0
        start, length = 0, float('inf')

        for r, ch in enumerate(s):
            if ch in need:
                window[ch] += 1
                if window[ch] == need[ch]:
                    valid += 1
            while valid == need_kinds:          # 达标就收缩
                if r - l + 1 < length:
                    start, length = l, r - l + 1
                left = s[l]
                if left in need:
                    if window[left] == need[left]:
                        valid -= 1
                    window[left] -= 1
                l += 1
        return "" if length == float('inf') else s[start:start + length]`,
    viz: { k: "array", arr: ["A", "D", "O", "B", "E", "C", "O", "D", "B", "A", "N", "C"], target: "ABC" }
  },

  /* ================= 普通数组 ================= */
  {
    n: 53, t: "最大子数组和", en: "Maximum Subarray", d: "medium", cat: "普通数组", freq: 5,
    tags: ["数组", "分治", "动态规划"],
    gist: "Kadane：以 <code>i</code> 结尾的最大和，要么接上前面、要么从自己重开——<code>cur = max(x, cur + x)</code>。",
    keys: [
      ["状态定义", "<code>cur</code> = 以当前元素结尾的最大和"],
      ["转移", "<code>cur = max(nums[i], cur + nums[i])</code>"],
      ["全局最优", "<code>best = max(best, cur)</code>"]
    ],
    trap: "全负数时答案是最大那个负数，<code>best</code> 初始化成 0 会错。",
    cx: ["O(n)", "O(1)"],
    tmpl: `class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        cur = best = nums[0]
        for x in nums[1:]:
            cur = max(x, cur + x)   # 接上 or 重开
            best = max(best, cur)
        return best`,
    viz: { k: "array", arr: [-2, 1, -3, 4, -1, 2, 1, -5, 4] }
  },
  {
    n: 56, t: "合并区间", en: "Merge Intervals", d: "medium", cat: "普通数组", freq: 5,
    tags: ["数组", "排序"],
    gist: "按左端点排序后，能合并的区间一定相邻——一次扫描只需维护「当前区间的右端」。",
    keys: [
      ["先排序", "<code>intervals.sort(key=lambda x: x[0])</code>"],
      ["能合则并", "<code>cur[1] >= nxt[0]</code> 时 <code>cur[1] = max(cur[1], nxt[1])</code>"],
      ["不能合则落盘", "把 <code>cur</code> 放进结果，<code>cur = nxt</code>"]
    ],
    trap: "右端要用 <code>max</code> 更新（后一个区间可能被完全包含）；循环结束别忘了补最后一个。",
    cx: ["O(n log n)", "O(n)"],
    tmpl: `class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        intervals.sort(key=lambda x: x[0])
        res = []
        for s, e in intervals:
            if res and res[-1][1] >= s:
                res[-1][1] = max(res[-1][1], e)
            else:
                res.append([s, e])
        return res`,
    viz: { k: "array", arr: ["[1,3]", "[2,6]", "[8,10]", "[15,18]"] }
  },
  {
    n: 189, t: "轮转数组", en: "Rotate Array", d: "medium", cat: "普通数组", freq: 4,
    tags: ["数组", "数学", "双指针"],
    gist: "右移 k 位 = <b>整体反转 → 前 k 反转 → 后 n-k 反转</b>，三次原地反转。",
    keys: [
      ["取模", "<code>k %= n</code>，k 可能大于 n"],
      ["三段反转", "<code>rev(0,n-1); rev(0,k-1); rev(k,n-1)</code>"],
      ["反转实现", "双指针首尾交换，到中间停"]
    ],
    trap: "不取模会越界；反转顺序错了会得到左旋。",
    cx: ["O(n)", "O(1)"],
    tmpl: `class Solution:
    def rotate(self, nums: List[int], k: int) -> None:
        n = len(nums); k %= n
        def rev(i, j):
            while i < j:
                nums[i], nums[j] = nums[j], nums[i]
                i += 1; j -= 1
        rev(0, n - 1)
        rev(0, k - 1)
        rev(k, n - 1)`,
    viz: { k: "array", arr: [1, 2, 3, 4, 5, 6, 7], shift: 3 }
  },
  {
    n: 238, t: "除自身以外数组的乘积", en: "Product of Array Except Self", d: "medium", cat: "普通数组", freq: 4,
    tags: ["数组", "前缀和"],
    gist: "答案 = 左前缀积 × 右后缀积；输出数组存前缀、一个变量滚动后缀，O(1) 额外空间。",
    keys: [
      ["前缀趟", "<code>res[i] = res[i-1] * nums[i-1]</code>"],
      ["后缀趟", "从右往左 <code>res[i] *= right; right *= nums[i]</code>"],
      ["无除法", "天然处理 0，不需要特判"]
    ],
    trap: "用除法时要数 0 的个数并特判；<code>res[0]</code> 必须初始化为 1。",
    cx: ["O(n)", "O(1)"],
    tmpl: `class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        n = len(nums)
        res = [1] * n
        for i in range(1, n):                 # 左边所有数的积
            res[i] = res[i - 1] * nums[i - 1]
        right = 1
        for i in range(n - 1, -1, -1):        # 乘上右边所有数的积
            res[i] *= right
            right *= nums[i]
        return res`,
    viz: { k: "array", arr: [1, 2, 3, 4] }
  },
  {
    n: 41, t: "缺失的第一个正数", en: "First Missing Positive", d: "hard", cat: "普通数组", freq: 4,
    tags: ["数组", "哈希表"],
    gist: "答案一定落在 <code>[1, n+1]</code>；把每个数<b>归位</b>到下标 <code>x-1</code>，再扫一遍看谁没到位。",
    keys: [
      ["原地哈希", "<code>while 1 <= nums[i] <= n and nums[nums[i]-1] != nums[i]: swap</code>"],
      ["必须用 while", "换过来的新数可能还要继续归位"],
      ["找断点", "第一个 <code>nums[i] != i+1</code> 给出 <code>i+1</code>；全部归位则答案是 <code>n+1</code>"]
    ],
    trap: "判重条件写成 <code>nums[nums[i]-1] != nums[i]</code>，否则重复元素会死循环。",
    cx: ["O(n)", "O(1)"],
    tmpl: `class Solution:
    def firstMissingPositive(self, nums: List[int]) -> int:
        n = len(nums)
        for i in range(n):
            while 1 <= nums[i] <= n and nums[nums[i] - 1] != nums[i]:
                j = nums[i] - 1
                nums[i], nums[j] = nums[j], nums[i]
        for i in range(n):
            if nums[i] != i + 1:
                return i + 1
        return n + 1`,
    viz: { k: "array", arr: [3, 4, -1, 1] }
  },

  /* ================= 矩阵 ================= */
  {
    n: 73, t: "矩阵置零", en: "Set Matrix Zeroes", d: "medium", cat: "矩阵", freq: 4,
    tags: ["数组", "哈希表", "矩阵"],
    gist: "拿<b>第一行 / 第一列</b>当标记位，把 O(m+n) 空间压到 O(1)，另用两个布尔记住边缘本身要不要清。",
    keys: [
      ["先打标", "遇到 0 就 <code>matrix[i][0] = matrix[0][j] = 0</code>"],
      ["边缘单独记", "<code>row0 / col0</code> 记录第一行、第一列原本是否含 0"],
      ["清理顺序", "从 <code>(1,1)</code> 开始清内部，最后再清第一行第一列"]
    ],
    trap: "先清第一行会污染标记；顺序必须是「先标 → 清内部 → 清边缘」。",
    cx: ["O(m·n)", "O(1)"],
    tmpl: `class Solution:
    def setZeroes(self, matrix: List[List[int]]) -> None:
        m, n = len(matrix), len(matrix[0])
        row0 = any(matrix[0][j] == 0 for j in range(n))
        col0 = any(matrix[i][0] == 0 for i in range(m))
        for i in range(1, m):
            for j in range(1, n):
                if matrix[i][j] == 0:
                    matrix[i][0] = matrix[0][j] = 0
        for i in range(1, m):
            for j in range(1, n):
                if matrix[i][0] == 0 or matrix[0][j] == 0:
                    matrix[i][j] = 0
        if row0:
            for j in range(n): matrix[0][j] = 0
        if col0:
            for i in range(m): matrix[i][0] = 0`,
    viz: { k: "grid", grid: [[1, 1, 1], [1, 0, 1], [1, 1, 1]] }
  },
  {
    n: 54, t: "螺旋矩阵", en: "Spiral Matrix", d: "medium", cat: "矩阵", freq: 4,
    tags: ["数组", "矩阵", "模拟"],
    gist: "四条边界 <code>top/bottom/left/right</code> 向内收缩，每走完一条边就更新边界并检查是否越界。",
    keys: [
      ["四步走", "上→右、右→下、下→左、左→上"],
      ["走完就缩", "每条边走完立即 <code>top++ / right-- / bottom-- / left++</code>"],
      ["内层判断", "第三、四条边要额外判 <code>top<=bottom</code> / <code>left<=right</code>"]
    ],
    trap: "单行或单列时会重复遍历，必须加边界判断。",
    cx: ["O(m·n)", "O(1)"],
    tmpl: `class Solution:
    def spiralOrder(self, matrix: List[List[int]]) -> List[int]:
        if not matrix: return []
        top, bottom = 0, len(matrix) - 1
        left, right = 0, len(matrix[0]) - 1
        res = []
        while top <= bottom and left <= right:
            for j in range(left, right + 1): res.append(matrix[top][j])
            top += 1
            for i in range(top, bottom + 1): res.append(matrix[i][right])
            right -= 1
            if top <= bottom:
                for j in range(right, left - 1, -1): res.append(matrix[bottom][j])
                bottom -= 1
            if left <= right:
                for i in range(bottom, top - 1, -1): res.append(matrix[i][left])
                left += 1
        return res`,
    viz: { k: "grid", grid: [[1, 2, 3], [4, 5, 6], [7, 8, 9]] }
  },
  {
    n: 48, t: "旋转图像", en: "Rotate Image", d: "medium", cat: "矩阵", freq: 4,
    tags: ["数组", "数学", "矩阵"],
    gist: "顺时针 90° = <b>沿主对角线转置 + 每行左右翻转</b>；逆时针则是「转置 + 上下翻转」。",
    keys: [
      ["转置", "<code>for i: for j in range(i+1, n): swap(a[i][j], a[j][i])</code>"],
      ["翻转", "对每行做双指针首尾交换"],
      ["口诀", "顺时针：转置→水平翻；逆时针：转置→垂直翻"]
    ],
    trap: "转置内层从 <code>i+1</code> 开始，否则元素被换回去等于没转。",
    cx: ["O(n²)", "O(1)"],
    tmpl: `class Solution:
    def rotate(self, matrix: List[List[int]]) -> None:
        n = len(matrix)
        for i in range(n):                 # 转置
            for j in range(i + 1, n):
                matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
        for row in matrix:                 # 每行翻转
            row.reverse()`,
    viz: { k: "grid", grid: [[1, 2, 3], [4, 5, 6], [7, 8, 9]] }
  },
  {
    n: 240, t: "搜索二维矩阵 II", en: "Search a 2D Matrix II", d: "medium", cat: "矩阵", freq: 4,
    tags: ["数组", "二分查找", "分治", "矩阵"],
    gist: "从<b>右上角</b>出发——它是「本行最大、本列最小」，一次比较就能排除一整行或一整列。",
    keys: [
      ["起点", "<code>i = 0, j = n - 1</code>（右上角）"],
      ["排除", "太大 → <code>j--</code>（这列都比它大）；太小 → <code>i++</code>"],
      ["终点", "越界即不存在，最多走 <code>m+n</code> 步"]
    ],
    trap: "从左上角出发没有单调性可用；只有右上、左下能一次排除一行/列。",
    cx: ["O(m+n)", "O(1)"],
    tmpl: `class Solution:
    def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:
        i, j = 0, len(matrix[0]) - 1
        while i < len(matrix) and j >= 0:
            v = matrix[i][j]
            if v == target: return True
            if v > target: j -= 1        # 这一列都太大
            else: i += 1                 # 这一行都太小
        return False`,
    viz: { k: "grid", grid: [[1, 4, 7, 11], [2, 5, 8, 12], [3, 6, 9, 16], [10, 13, 14, 17]], target: 5 }
  },

  /* ================= 链表 ================= */
  {
    n: 160, t: "相交链表", en: "Intersection of Two Linked Lists", d: "easy", cat: "链表", freq: 4,
    tags: ["哈希表", "链表", "双指针"],
    gist: "两个指针各走「自己的 + 对方的」，总路程相同，于是要么在交点相遇，要么同时走到 null。",
    keys: [
      ["双指针", "<code>pa, pb</code> 分别从两条链表头出发"],
      ["换轨", "到尾就跳到另一条链表头，相当于补齐长度差"],
      ["总步数", "各走 <code>lenA + lenB</code> 步，必同步"]
    ],
    trap: "无交点时在 <code>None</code> 相遇；判断条件写 <code>while a is not b</code>，不要比 <code>val</code>。",
    cx: ["O(m+n)", "O(1)"],
    tmpl: `class Solution:
    def getIntersectionNode(self, headA, headB):
        a, b = headA, headB
        while a is not b:
            a = a.next if a else headB
            b = b.next if b else headA
        return a`,
    viz: { k: "list", arr: ["4", "1", "8", "4", "5"] }
  },
  {
    n: 206, t: "反转链表", en: "Reverse Linked List", d: "easy", cat: "链表", freq: 5,
    tags: ["递归", "链表"],
    gist: "三指针 <code>prev / cur / next</code> 就地改箭头，循环结束时 <code>prev</code> 就是新头。",
    keys: [
      ["先存后改", "<code>nxt = cur.next</code> 再 <code>cur.next = prev</code>"],
      ["同步推进", "<code>prev = cur; cur = nxt</code>"],
      ["返回", "返回 <code>prev</code>（此时 <code>cur</code> 是 None）"]
    ],
    trap: "不存 <code>nxt</code> 会断链；返回 <code>cur</code> 是经典错误。",
    cx: ["O(n)", "O(1)"],
    tmpl: `class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        prev, cur = None, head
        while cur:
            nxt = cur.next
            cur.next = prev
            prev, cur = cur, nxt
        return prev`,
    viz: { k: "list", arr: ["1", "2", "3", "4", "5"] }
  },
  {
    n: 234, t: "回文链表", en: "Palindrome Linked List", d: "easy", cat: "链表", freq: 4,
    tags: ["栈", "递归", "链表", "双指针"],
    gist: "快慢指针找中点 → 反转后半段 → 两头向中间比，额外空间 O(1)。",
    keys: [
      ["找中点", "快慢指针，<code>slow</code> 走到中间（偶数个时是后半段起点）"],
      ["反转后半", "复用 <code>reverseList(slow)</code>"],
      ["比较", "<code>while p2</code> 逐个比，奇数长度前半多一个节点不影响"],
      ["加分项", "比较完把后半段复原，保持原链表结构"]
    ],
    trap: "比较循环要用后半段长度结束；先反转再倒着比会破坏原结构。",
    cx: ["O(n)", "O(1)"],
    tmpl: `class Solution:
    def isPalindrome(self, head: Optional[ListNode]) -> bool:
        slow = fast = head
        while fast and fast.next:
            slow, fast = slow.next, fast.next.next
        prev, cur = None, slow            # 反转后半段
        while cur:
            nxt = cur.next
            cur.next = prev
            prev, cur = cur, nxt
        p1, p2 = head, prev
        ok = True
        while p2:
            if p1.val != p2.val:
                ok = False; break
            p1, p2 = p1.next, p2.next
        return ok`,
    viz: { k: "list", arr: ["1", "2", "3", "2", "1"] }
  },
  {
    n: 141, t: "环形链表", en: "Linked List Cycle", d: "easy", cat: "链表", freq: 4,
    tags: ["哈希表", "链表", "双指针"],
    gist: "快慢指针进环后，快指针每步追近 1，一定在环内追上——不需要借助集合。",
    keys: [
      ["速度差 1", "<code>slow = slow.next</code>，<code>fast = fast.next.next</code>"],
      ["循环条件", "<code>while fast and fast.next</code>"],
      ["判定", "<code>slow is fast</code> 即有环"]
    ],
    trap: "只判 <code>fast</code> 不判 <code>fast.next</code> 会空指针；比较用 <code>is</code> 比地址。",
    cx: ["O(n)", "O(1)"],
    tmpl: `class Solution:
    def hasCycle(self, head: Optional[ListNode]) -> bool:
        slow = fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
            if slow is fast:
                return True
        return False`,
    viz: { k: "list", arr: ["3", "2", "0", "-4"] }
  }
  );
})();
