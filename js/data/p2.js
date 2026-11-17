/* Hot 100 · 数据 02 — 链表(余10) / 二叉树(15) */
;(function () {
  const P = (window.H100 = window.H100 || []);

  P.push(
  {
    n: 142, t: "环形链表 II", en: "Linked List Cycle II", d: "medium", cat: "链表", freq: 4,
    tags: ["哈希表", "链表", "双指针"],
    gist: "快慢指针相遇后，让一个指针回到 head，两指针同步走一步，<b>再次相遇处就是环入口</b>。",
    keys: [
      ["先找相遇点", "快慢指针在环内相遇"],
      ["再找入口", "ptr 回到 head，与 slow 同步前进"],
      ["原理", "设头到入口 a、入口到相遇点 b、环长 L，则 <code>a = (n-1)L + (L-b)</code>，走 a 步必到入口"]
    ],
    trap: "必须先判断有环（快指针跑出 None 就返回 None），否则 slow 可能是 None。",
    cx: ["O(n)", "O(1)"],
    tmpl: `class Solution:
    def detectCycle(self, head: Optional[ListNode]) -> Optional[ListNode]:
        slow = fast = head
        while fast and fast.next:
            slow, fast = slow.next, fast.next.next
            if slow is fast:                 # 找到相遇点
                p = head
                while p is not slow:
                    p, slow = p.next, slow.next
                return p
        return None`,
    viz: { k: "list", arr: ["3", "2", "0", "-4"] }
  },
  {
    n: 21, t: "合并两个有序链表", en: "Merge Two Sorted Lists", d: "easy", cat: "链表", freq: 5,
    tags: ["递归", "链表"],
    gist: "哨兵节点 + 尾部指针：每次摘下较小的那个节点接到尾部，最后把剩下的整条挂上去。",
    keys: [
      ["哨兵", "<code>dummy = ListNode()</code>，<code>tail = dummy</code>"],
      ["摘小者", "<code>if a.val <= b.val: tail.next = a; a = a.next</code>"],
      ["收尾", "循环后 <code>tail.next = a or b</code>，返回 <code>dummy.next</code>"]
    ],
    trap: "用 <code><=</code> 保证稳定；不要在循环里 new 节点，题目要复用原节点。",
    cx: ["O(m+n)", "O(1)"],
    tmpl: `class Solution:
    def mergeTwoLists(self, list1, list2):
        dummy = tail = ListNode()
        a, b = list1, list2
        while a and b:
            if a.val <= b.val:
                tail.next, a = a, a.next
            else:
                tail.next, b = b, b.next
            tail = tail.next
        tail.next = a or b
        return dummy.next`,
    viz: { k: "list", arr: ["1", "2", "4"] }
  },
  {
    n: 2, t: "两数相加", en: "Add Two Numbers", d: "medium", cat: "链表", freq: 4,
    tags: ["递归", "链表", "数学"],
    gist: "逐位相加并维护 <code>carry</code>；循环条件是 <code>l1 or l2 or carry</code>，最后可能还要补一个进位节点。",
    keys: [
      ["取位", "<code>v = (a or 0) + (b or 0) + carry</code>"],
      ["写位", "<code>carry, digit = divmod(v, 10)</code>"],
      ["别忘进位", "循环结束后 <code>carry</code> 仍可能为 1"]
    ],
    trap: "两条链长度不同要按 0 处理；返回 <code>dummy.next</code>。",
    cx: ["O(max(m,n))", "O(1)"],
    tmpl: `class Solution:
    def addTwoNumbers(self, l1, l2):
        dummy = tail = ListNode()
        carry = 0
        while l1 or l2 or carry:
            v = (l1.val if l1 else 0) + (l2.val if l2 else 0) + carry
            carry, d = divmod(v, 10)
            tail.next = ListNode(d)
            tail = tail.next
            l1 = l1.next if l1 else None
            l2 = l2.next if l2 else None
        return dummy.next`,
    viz: { k: "list", arr: ["2", "4", "3"] }
  },
  {
    n: 19, t: "删除链表的倒数第 N 个结点", en: "Remove Nth Node From End of List", d: "medium", cat: "链表", freq: 5,
    tags: ["链表", "双指针"],
    gist: "快指针先走 n 步，然后两指针同步走；快指针到尾部时，慢指针正好停在<b>待删节点的前一个</b>。",
    keys: [
      ["哨兵", "加 dummy 统一处理「删头节点」"],
      ["先走 n 步", "<code>for _ in range(n): fast = fast.next</code>"],
      ["再同步", "<code>while fast.next: fast = fast.next; slow = slow.next</code>"],
      ["删除", "<code>slow.next = slow.next.next</code>"]
    ],
    trap: "没有 dummy 时删头节点会出错；快指针要先走 n 步不是 n-1 步（配合 <code>fast.next</code> 判断）。",
    cx: ["O(L)", "O(1)"],
    tmpl: `class Solution:
    def removeNthFromEnd(self, head, n: int):
        dummy = ListNode(0, head)
        fast = slow = dummy
        for _ in range(n):
            fast = fast.next
        while fast.next:                     # 走到尾节点
            fast, slow = fast.next, slow.next
        slow.next = slow.next.next
        return dummy.next`,
    viz: { k: "list", arr: ["1", "2", "3", "4", "5"] }
  },
  {
    n: 24, t: "两两交换链表中的节点", en: "Swap Nodes in Pairs", d: "medium", cat: "链表", freq: 3,
    tags: ["递归", "链表"],
    gist: "以「一对」为单位操作：让 <code>second</code> 指回 <code>first</code>，<code>first</code> 指向下一对的头。",
    keys: [
      ["哨兵 + 前驱", "<code>prev</code> 指向每对的前一个节点"],
      ["三步交换", "<code>a.next = b.next; b.next = a; prev.next = b</code>"],
      ["推进", "<code>prev = a</code>（此时 a 已是这一对的尾巴）"]
    ],
    trap: "交换顺序错会断链；循环条件要 <code>prev.next and prev.next.next</code>。",
    cx: ["O(n)", "O(1)"],
    tmpl: `class Solution:
    def swapPairs(self, head: Optional[ListNode]) -> Optional[ListNode]:
        dummy = prev = ListNode(0, head)
        while prev.next and prev.next.next:
            a, b = prev.next, prev.next.next
            a.next = b.next
            b.next = a
            prev.next = b
            prev = a                          # a 现在是这一对的尾巴
        return dummy.next`,
    viz: { k: "list", arr: ["1", "2", "3", "4"] }
  },
  {
    n: 25, t: "K 个一组翻转链表", en: "Reverse Nodes in k-Group", d: "hard", cat: "链表", freq: 4,
    tags: ["递归", "链表"],
    gist: "先数够 k 个再翻，翻完把「上一组尾巴」接到「本组新头」，本组原头接到「下一组头」。",
    keys: [
      ["探测", "从 <code>groupPrev</code> 往后数 k 个，不足则结束（剩下的保持原样）"],
      ["区间反转", "标准三指针反转 <code>[start, end]</code>，注意先记住 <code>nextGroup</code>"],
      ["缝合", "<code>groupPrev.next = kth; start.next = nextGroup; groupPrev = start</code>"]
    ],
    trap: "反转区间前必须先把 <code>nextGroup</code> 存下来，否则链断；不足 k 个不要翻转。",
    cx: ["O(n)", "O(1)"],
    tmpl: `class Solution:
    def reverseKGroup(self, head, k: int):
        dummy = groupPrev = ListNode(0, head)
        while True:
            kth = groupPrev
            for _ in range(k):                # 数 k 个
                kth = kth.next
                if not kth: return dummy.next
            groupNext = kth.next
            prev, cur = groupNext, groupPrev.next
            while cur is not groupNext:       # 反转本组
                nxt = cur.next
                cur.next = prev
                prev, cur = cur, nxt
            start = groupPrev.next
            groupPrev.next = kth
            groupPrev = start`,
    viz: { k: "list", arr: ["1", "2", "3", "4", "5"] }
  },
  {
    n: 138, t: "随机链表的复制", en: "Copy List with Random Pointer", d: "medium", cat: "链表", freq: 4,
    tags: ["哈希表", "链表"],
    gist: "经典解法：哈希表存「原节点 → 新节点」两趟；进阶 O(1) 空间用<b>拼接-拆分</b>法。",
    keys: [
      ["哈希两趟", "第一趟建节点并记映射，第二趟接 <code>next / random</code>"],
      ["O(1) 拼接法", "把新节点插到原节点后面：<code>a -> a' -> b -> b'</code>"],
      ["拆链", "先修 <code>random</code>，再把两条链拆开"]
    ],
    trap: "random 可能指向 None；拆链时原链也要恢复。",
    cx: ["O(n)", "O(n) / O(1)"],
    tmpl: `class Solution:
    def copyRandomList(self, head):
        if not head: return None
        mp = {}
        cur = head
        while cur:                        # 1) 建节点
            mp[cur] = Node(cur.val)
            cur = cur.next
        cur = head
        while cur:                        # 2) 接指针
            mp[cur].next = mp.get(cur.next)
            mp[cur].random = mp.get(cur.random)
            cur = cur.next
        return mp[head]`,
    viz: { k: "list", arr: ["7", "13", "11", "10", "1"] }
  },
  {
    n: 148, t: "排序链表", en: "Sort List", d: "medium", cat: "链表", freq: 4,
    tags: ["链表", "双指针", "分治", "排序", "归并排序"],
    gist: "链表最适合<b>归并排序</b>：快慢指针断成两半 → 递归排 → 合并两条有序链。",
    keys: [
      ["断链", "快慢指针找中点，<code>slow.next = None</code> 断开"],
      ["递归", "<code>merge(sort(head), sort(mid))</code>"],
      ["合并", "复用「合并两个有序链表」的哨兵写法"],
      ["进阶", "自底向上归并可做到 O(1) 额外空间"]
    ],
    trap: "不断链会无限递归；找中点时快指针初始要在 <code>head.next</code>（否则偶数长度切不匀）。",
    cx: ["O(n log n)", "O(log n)"],
    tmpl: `class Solution:
    def sortList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        if not head or not head.next: return head
        slow, fast = head, head.next
        while fast and fast.next:          # 找中点（前半段末尾）
            slow, fast = slow.next, fast.next.next
        mid = slow.next
        slow.next = None                   # 断链
        return self.merge(self.sortList(head), self.sortList(mid))

    def merge(self, a, b):
        dummy = tail = ListNode()
        while a and b:
            if a.val <= b.val: tail.next, a = a, a.next
            else: tail.next, b = b, b.next
            tail = tail.next
        tail.next = a or b
        return dummy.next`,
    viz: { k: "list", arr: ["4", "2", "1", "3"] }
  },
  {
    n: 23, t: "合并 K 个升序链表", en: "Merge k Sorted Lists", d: "hard", cat: "链表", freq: 5,
    tags: ["链表", "分治", "堆", "归并排序"],
    gist: "两个正解：<b>小顶堆</b>每次取最小（O(n log k)），或<b>两两归并</b>（分治，同样 O(n log k)）。",
    keys: [
      ["堆", "把 k 个头节点入堆，每次 pop 最小值接到结果，再把它的 next 入堆"],
      ["分治", "<code>merge(lists[0:k/2]) + merge(lists[k/2:k])</code>，逐层归并"],
      ["推荐", "面试写堆更直观；分治不依赖额外数据结构"]
    ],
    trap: "堆里要存 <code>(val, idx, node)</code>，节点不可比较会报错；空链表列表要返回 None。",
    cx: ["O(n log k)", "O(k)"],
    tmpl: `class Solution:
    def mergeKLists(self, lists: List[Optional[ListNode]]):
        heap = [(h.val, i, h) for i, h in enumerate(lists) if h]
        heapq.heapify(heap)
        dummy = tail = ListNode()
        while heap:
            val, i, node = heapq.heappop(heap)
            tail.next = node
            tail = node
            if node.next:
                heapq.heappush(heap, (node.next.val, i, node.next))
        return dummy.next`,
    viz: { k: "list", arr: ["1", "1", "2", "3", "4", "4", "5", "6"] }
  },
  {
    n: 146, t: "LRU 缓存", en: "LRU Cache", d: "medium", cat: "链表", freq: 5,
    tags: ["设计", "哈希表", "链表", "双向链表"],
    gist: "哈希表给 O(1) 定位，<b>双向链表</b>给 O(1) 调整顺序：头部最新、尾部最旧。",
    keys: [
      ["结构", "<code>key -> node</code> 的 dict + 带 dummy 头尾的双向链表"],
      ["get", "命中就 <code>moveToHead</code> 并返回值"],
      ["put", "存在则改值 + 提前；不存在则新建插头，超容量就 <code>removeTail</code> 并删 key"],
      ["技巧", "用两个哨兵 <code>head/tail</code> 免去大量空判断"]
    ],
    trap: "淘汰时要同时删链表节点和哈希表 key；get 命中也要更新顺序。",
    cx: ["O(1)", "O(capacity)"],
    tmpl: `class Node:
    __slots__ = ('k', 'v', 'prev', 'next')
    def __init__(self, k=0, v=0):
        self.k, self.v = k, v
        self.prev = self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.map = {}
        self.head, self.tail = Node(), Node()      # 哨兵
        self.head.next, self.tail.prev = self.tail, self.head

    def _add(self, node):                          # 插到头部（最新）
        node.prev, node.next = self.head, self.head.next
        self.head.next.prev = node
        self.head.next = node

    def _remove(self, node):
        node.prev.next, node.next.prev = node.next, node.prev

    def get(self, key: int) -> int:
        if key not in self.map: return -1
        node = self.map[key]
        self._remove(node); self._add(node)        # 提升为最新
        return node.v

    def put(self, key: int, value: int) -> None:
        if key in self.map:
            node = self.map[key]
            node.v = value
            self._remove(node); self._add(node)
            return
        if len(self.map) == self.cap:
            old = self.tail.prev                   # 最旧
            self._remove(old)
            del self.map[old.k]
        node = Node(key, value)
        self.map[key] = node
        self._add(node)`,
    viz: { k: "array", arr: ["put(1,1)", "put(2,2)", "get(1)", "put(3,3)", "get(2)"] }
  },

  /* ================= 二叉树 ================= */
  {
    n: 94, t: "二叉树的中序遍历", en: "Binary Tree Inorder Traversal", d: "easy", cat: "二叉树", freq: 5,
    tags: ["栈", "树", "深度优先搜索", "二叉树"],
    gist: "迭代版是这个模板：一路向左压栈，弹出即访问，然后转向右子树——<b>左-根-右</b>。",
    keys: [
      ["压栈到底", "<code>while cur: stack.append(cur); cur = cur.left</code>"],
      ["弹出访问", "<code>node = stack.pop(); res.append(node.val)</code>"],
      ["转右", "<code>cur = node.right</code>，继续下一轮"]
    ],
    trap: "递归版简单但面试常问迭代；Morris 遍历可 O(1) 空间。",
    cx: ["O(n)", "O(h)"],
    tmpl: `class Solution:
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        res, stack, cur = [], [], root
        while cur or stack:
            while cur:                 # 一路向左
                stack.append(cur)
                cur = cur.left
            cur = stack.pop()
            res.append(cur.val)        # 访问
            cur = cur.right
        return res`,
    viz: { k: "tree", tree: [1, null, 2, 3] }
  },
  {
    n: 104, t: "二叉树的最大深度", en: "Maximum Depth of Binary Tree", d: "easy", cat: "二叉树", freq: 5,
    tags: ["树", "深度优先搜索", "广度优先搜索", "二叉树"],
    gist: "后序一句话：<code>1 + max(左深度, 右深度)</code>；空树返回 0。",
    keys: [
      ["递归", "<code>if not root: return 0</code>"],
      ["合并", "<code>return 1 + max(dfs(left), dfs(right))</code>"],
      ["BFS 版", "层序遍历数层数，天然求最小深度也好用"]
    ],
    trap: "空树是 0 不是 1；这是所有「树形 DP 返回值含义」的起点。",
    cx: ["O(n)", "O(h)"],
    tmpl: `class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        if not root:
            return 0
        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))`,
    viz: { k: "tree", tree: [3, 9, 20, null, null, 15, 7] }
  },
  {
    n: 226, t: "翻转二叉树", en: "Invert Binary Tree", d: "easy", cat: "二叉树", freq: 4,
    tags: ["树", "深度优先搜索", "广度优先搜索", "二叉树"],
    gist: "递归到每个节点，交换左右孩子——前序、后序都能写，<b>中序会翻两次</b>要小心。",
    keys: [
      ["递归交换", "<code>root.left, root.right = root.right, root.left</code>"],
      ["顺序", "先交换再递归，或先递归再交换，都对"],
      ["返回值", "返回 <code>root</code> 供上层拼接"]
    ],
    trap: "中序写法（左→交换→右）会把同一棵子树翻两次；空节点直接返回。",
    cx: ["O(n)", "O(h)"],
    tmpl: `class Solution:
    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        if not root:
            return None
        root.left, root.right = root.right, root.left
        self.invertTree(root.left)
        self.invertTree(root.right)
        return root`,
    viz: { k: "tree", tree: [4, 2, 7, 1, 3, 6, 9] }
  },
  {
    n: 101, t: "对称二叉树", en: "Symmetric Tree", d: "easy", cat: "二叉树", freq: 4,
    tags: ["树", "深度优先搜索", "广度优先搜索", "二叉树"],
    gist: "不是比较「自己和自己的子树」，而是比较<b>左子树的左 vs 右子树的右</b>、左的右 vs 右的左。",
    keys: [
      ["双指针递归", "<code>check(a, b)</code>：都空 → True；一个空 → False"],
      ["交叉比较", "<code>a.val == b.val and check(a.left,b.right) and check(a.right,b.left)</code>"],
      ["入口", "<code>check(root.left, root.right)</code>"]
    ],
    trap: "写成 <code>check(root.left, root.left)</code> 就变成判断「两棵相同树」。",
    cx: ["O(n)", "O(h)"],
    tmpl: `class Solution:
    def isSymmetric(self, root: Optional[TreeNode]) -> bool:
        def check(a, b):
            if not a and not b: return True
            if not a or not b: return False
            return (a.val == b.val
                    and check(a.left, b.right)
                    and check(a.right, b.left))
        return check(root.left, root.right) if root else True`,
    viz: { k: "tree", tree: [1, 2, 2, 3, 4, 4, 3] }
  },
  {
    n: 543, t: "二叉树的直径", en: "Diameter of Binary Tree", d: "easy", cat: "二叉树", freq: 5,
    tags: ["树", "深度优先搜索", "二叉树"],
    gist: "直径 = 某个节点「左深度 + 右深度」的最大值；后序遍历顺手把高度往回传。",
    keys: [
      ["返回值 = 高度", "<code>depth(node) = 1 + max(左, 右)</code>"],
      ["顺手更新答案", "<code>ans = max(ans, 左高 + 右高)</code>"],
      ["用 nonlocal", "Python 里用列表或 <code>nonlocal</code> 维护全局最大值"]
    ],
    trap: "答案不是根节点的左右高之和，而是<b>任意节点</b>的；空树返回 0。",
    cx: ["O(n)", "O(h)"],
    tmpl: `class Solution:
    def diameterOfBinaryTree(self, root: Optional[TreeNode]) -> int:
        ans = 0
        def depth(node):
            nonlocal ans
            if not node: return 0
            l, r = depth(node.left), depth(node.right)
            ans = max(ans, l + r)          # 以当前节点为拐点
            return 1 + max(l, r)
        depth(root)
        return ans`,
    viz: { k: "tree", tree: [1, 2, 3, 4, 5] }
  },
  {
    n: 102, t: "二叉树的层序遍历", en: "Binary Tree Level Order Traversal", d: "medium", cat: "二叉树", freq: 5,
    tags: ["树", "广度优先搜索", "二叉树"],
    gist: "队列 + <b>先记 size 再消费</b>：一次性把当前层全部弹完，就是一个二维答案的一行。",
    keys: [
      ["入队根", "<code>q = deque([root])</code>，空树直接返回 []"],
      ["分层", "<code>for _ in range(len(q)):</code> 弹当前层"],
      ["收集", "弹的同时把子节点入队"]
    ],
    trap: "不要边弹边取 <code>len(q)</code>，必须先把本层长度存下来。",
    cx: ["O(n)", "O(n)"],
    tmpl: `class Solution:
    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        if not root: return []
        res, q = [], deque([root])
        while q:
            level = []
            for _ in range(len(q)):        # 先固定本层长度
                node = q.popleft()
                level.append(node.val)
                if node.left: q.append(node.left)
                if node.right: q.append(node.right)
            res.append(level)
        return res`,
    viz: { k: "tree", tree: [3, 9, 20, null, null, 15, 7] }
  },
  {
    n: 108, t: "将有序数组转换为二叉搜索树", en: "Convert Sorted Array to Binary Search Tree", d: "easy", cat: "二叉树", freq: 4,
    tags: ["树", "二叉搜索树", "数组", "分治", "二叉树"],
    gist: "有序数组天生就是中序序列，取<b>中点做根</b>递归即可，天然平衡。",
    keys: [
      ["取中点", "<code>mid = (l + r) // 2</code>"],
      ["递归建", "<code>root.left = build(l, mid-1)</code>，右同理"],
      ["边界", "<code>l > r</code> 返回 None"]
    ],
    trap: "取左中点还是右中点都能过，但要一致；不要切片（O(n) 额外空间），传下标。",
    cx: ["O(n)", "O(log n)"],
    tmpl: `class Solution:
    def sortedArrayToBST(self, nums: List[int]) -> Optional[TreeNode]:
        def build(l, r):
            if l > r: return None
            mid = (l + r) // 2
            node = TreeNode(nums[mid])
            node.left = build(l, mid - 1)
            node.right = build(mid + 1, r)
            return node
        return build(0, len(nums) - 1)`,
    viz: { k: "array", arr: [-10, -3, 0, 5, 9] }
  },
  {
    n: 98, t: "验证二叉搜索树", en: "Validate Binary Search Tree", d: "medium", cat: "二叉树", freq: 5,
    tags: ["树", "深度优先搜索", "二叉搜索树", "二叉树"],
    gist: "BST 的定义是全树范围约束，不是「父 > 左子」——必须带<b>上下界</b>递归，或用中序严格递增。",
    keys: [
      ["上下界递归", "<code>check(node, lo, hi)</code>：值必须落在开区间内"],
      ["传递边界", "左子树上界变 <code>node.val</code>，右子树下界变 <code>node.val</code>"],
      ["中序版", "记录 prev，中序必须严格递增（不能相等）"]
    ],
    trap: "只比较父子会在 <code>[5,4,6,null,null,3,7]</code> 这种结构上出错；BST 不允许重复值。",
    cx: ["O(n)", "O(h)"],
    tmpl: `class Solution:
    def isValidBST(self, root: Optional[TreeNode]) -> bool:
        def check(node, lo, hi):
            if not node: return True
            if not (lo < node.val < hi): return False
            return (check(node.left, lo, node.val) and
                    check(node.right, node.val, hi))
        return check(root, float('-inf'), float('inf'))`,
    viz: { k: "tree", tree: [5, 1, 4, null, null, 3, 6] }
  },
  {
    n: 230, t: "二叉搜索树中第 K 小的元素", en: "Kth Smallest Element in a BST", d: "medium", cat: "二叉树", freq: 4,
    tags: ["树", "深度优先搜索", "二叉搜索树", "二叉树"],
    gist: "BST 的中序遍历就是升序序列，数到第 k 个就是答案——不必完整遍历，<b>数到就返回</b>。",
    keys: [
      ["迭代中序", "复用中序模板，用计数器 <code>cnt</code>"],
      ["提前返回", "<code>cnt == k</code> 时直接返回 <code>node.val</code>"],
      ["进阶", "若频繁查询，可存子树 size 做 O(h) 查找"]
    ],
    trap: "k 从 1 开始；递归版记得剪枝，别把整棵树跑完。",
    cx: ["O(h+k)", "O(h)"],
    tmpl: `class Solution:
    def kthSmallest(self, root: Optional[TreeNode], k: int) -> int:
        stack, cur, cnt = [], root, 0
        while cur or stack:
            while cur:
                stack.append(cur); cur = cur.left
            cur = stack.pop()
            cnt += 1
            if cnt == k: return cur.val
            cur = cur.right`,
    viz: { k: "tree", tree: [3, 1, 4, null, 2] }
  },
  {
    n: 199, t: "二叉树的右视图", en: "Binary Tree Right Side View", d: "medium", cat: "二叉树", freq: 4,
    tags: ["树", "深度优先搜索", "广度优先搜索", "二叉树"],
    gist: "层序遍历时每层取<b>最后一个</b>；或 DFS 先走右子树，按深度首次到达时记录。",
    keys: [
      ["BFS", "<code>level[-1]</code> 收进答案"],
      ["DFS", "先右后左，<code>len(res) == depth</code> 时追加"],
      ["本质", "两者的共同点是「每层最右节点」"]
    ],
    trap: "DFS 版深度从 0 开始，判断 <code>depth == len(res)</code>。",
    cx: ["O(n)", "O(n)"],
    tmpl: `class Solution:
    def rightSideView(self, root: Optional[TreeNode]) -> List[int]:
        if not root: return []
        res, q = [], deque([root])
        while q:
            size = len(q)
            for i in range(size):
                node = q.popleft()
                if i == size - 1:              # 本层最后一个
                    res.append(node.val)
                if node.left: q.append(node.left)
                if node.right: q.append(node.right)
        return res`,
    viz: { k: "tree", tree: [1, 2, 3, null, 5, null, 4] }
  },
  {
    n: 114, t: "二叉树展开为链表", en: "Flatten Binary Tree to Linked List", d: "medium", cat: "二叉树", freq: 4,
    tags: ["栈", "树", "深度优先搜索", "链表", "二叉树"],
    gist: "后序处理：先把左右子树各自拉直，再让「右指针 = 拉直后的左子树」、原右子树挂到左子树最右端。",
    keys: [
      ["后序", "先 <code>flatten(left)</code>、<code>flatten(right)</code>"],
      ["找左子树最右", "沿着 <code>right</code> 走到尽头"],
      ["重接", "<code>tail.right = root.right; root.right = root.left; root.left = None</code>"]
    ],
    trap: "不把 <code>left</code> 置空会留下错误的左指针；要先存 <code>root.right</code>。",
    cx: ["O(n)", "O(h)"],
    tmpl: `class Solution:
    def flatten(self, root: Optional[TreeNode]) -> None:
        if not root: return
        self.flatten(root.left)
        self.flatten(root.right)
        left, right = root.left, root.right
        root.left = None
        root.right = left
        tail = root
        while tail.right:              # 找到左子树拉直后的尾
            tail = tail.right
        tail.right = right`,
    viz: { k: "tree", tree: [1, 2, 5, 3, 4, null, 6] }
  },
  {
    n: 105, t: "从前序与中序遍历序列构造二叉树", en: "Construct Binary Tree from Preorder and Inorder Traversal", d: "medium", cat: "二叉树", freq: 5,
    tags: ["树", "数组", "哈希表", "分治", "二叉树"],
    gist: "前序第一个是根，在中序里定位根就把左右子树划分开了——递归<b>区间下标</b>而不是切片。",
    keys: [
      ["哈希定位", "<code>idx[val] -> 中序下标</code>，O(1) 找根"],
      ["左子树长度", "<code>leftLen = mid - inL</code>"],
      ["区间", "前序 <code>[preL+1, preL+leftLen]</code> 对中序 <code>[inL, mid-1]</code>；右半同理"]
    ],
    trap: "每次切片会 O(n²)；下标算错是这道题唯一的坑（写完对着小例子验一遍）。",
    cx: ["O(n)", "O(n)"],
    tmpl: `class Solution:
    def buildTree(self, preorder, inorder):
        idx = {v: i for i, v in enumerate(inorder)}
        def build(preL, preR, inL, inR):
            if preL > preR: return None
            root = TreeNode(preorder[preL])
            mid = idx[preorder[preL]]
            leftLen = mid - inL
            root.left = build(preL + 1, preL + leftLen, inL, mid - 1)
            root.right = build(preL + leftLen + 1, preR, mid + 1, inR)
            return root
        return build(0, len(preorder) - 1, 0, len(inorder) - 1)`,
    viz: { k: "array", arr: [3, 9, 20, 15, 7] }
  },
  {
    n: 437, t: "路径总和 III", en: "Path Sum III", d: "medium", cat: "二叉树", freq: 4,
    tags: ["树", "深度优先搜索", "二叉树"],
    gist: "路径<b>不必从根节点开始</b>：把每个节点都当一次起点，从它往下走，累计和正好等于 target 就记一条。",
    keys: [
      ["每个点都当起点", "外层的 <code>pathSum</code> 递归到每个节点，每个节点都开一轮「往下走」"],
      ["往下走累计", "<code>cur += node-&gt;val</code>，走到哪算到哪，不回头"],
      ["命中判定", "<code>cur == target ? 1 : 0</code>，再加上左右子树的命中数"]
    ],
    trap: "路径只能向下，不能拐回去；起点和终点都可以是任意节点。这题 O(n²) 就够（n ≤ 1000），O(n) 的前缀和写法是进阶版本。",
    cx: ["O(n²)", "O(n)"],
    tmpl: `class Solution:
    def pathSum(self, root: Optional[TreeNode], targetSum: int) -> int:
        # 以 root 为起点 + 左子树每点 + 右子树每点
        if not root: return 0
        return (self.pathSumFrom(root, targetSum, 0)
                + self.pathSum(root.left, targetSum)
                + self.pathSum(root.right, targetSum))

    # ---- 从 node 往下走，cur 是「起点→当前」的路径和 ----
    def pathSumFrom(self, node, target, cur):
        if not node: return 0
        cur += node.val
        return ((1 if cur == target else 0)
                + self.pathSumFrom(node.left, target, cur)
                + self.pathSumFrom(node.right, target, cur))`,
    viz: { k: "tree", tree: [10, 5, -3, 3, 2, null, 11, 3, -2, null, 1], target: 8 },
    variant2Label: "前缀和 O(n)",
    cpp2: `class Solution {
public:
    unordered_map<long long, int> prefix;

    int dfs(TreeNode *root, long long curr, int targetSum) {
        if (!root) {
            return 0;
        }

        int ret = 0;
        curr += root->val;
        if (prefix.count(curr - targetSum)) {
            ret = prefix[curr - targetSum];
        }

        prefix[curr]++;
        ret += dfs(root->left, curr, targetSum);
        ret += dfs(root->right, curr, targetSum);
        prefix[curr]--;

        return ret;
    }

    int pathSum(TreeNode* root, int targetSum) {
        prefix[0] = 1;
        return dfs(root, 0, targetSum);
    }
};`
  },
  {
    n: 236, t: "二叉树的最近公共祖先", en: "Lowest Common Ancestor of a Binary Tree", d: "medium", cat: "二叉树", freq: 5,
    tags: ["树", "深度优先搜索", "二叉树"],
    gist: "后序返回「找到的节点」：左右都非空 ⇒ 当前节点就是 LCA；只有一边非空就<b>把这个结果往上抛</b>。",
    keys: [
      ["终止", "空节点、或等于 p/q 就返回自己"],
      ["后序", "<code>l = dfs(left); r = dfs(right)</code>"],
      ["合并", "都非空返回 node；否则返回非空的那个"]
    ],
    trap: "这题假定 p、q 一定存在；若可能不存在需要额外标记。返回值语义要记牢：既可能是 LCA，也可能是「只找到其中一个」。",
    cx: ["O(n)", "O(h)"],
    tmpl: `class Solution:
    def lowestCommonAncestor(self, root, p, q):
        if not root or root is p or root is q:
            return root
        l = self.lowestCommonAncestor(root.left, p, q)
        r = self.lowestCommonAncestor(root.right, p, q)
        if l and r: return root      # 一边一个 → 当前就是分叉点
        return l or r`,
    viz: { k: "tree", tree: [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], p: 5, q: 1 },
    viz2: { p: 7, q: 8 },
    demoLabels: ["p=5, q=1", "p=7, q=8"]
  },
  {
    n: 124, t: "二叉树中的最大路径和", en: "Binary Tree Maximum Path Sum", d: "hard", cat: "二叉树", freq: 5,
    tags: ["树", "深度优先搜索", "动态规划", "二叉树"],
    gist: "后序返回「以当前节点为端点、向下走的最大单边贡献」，答案在每个节点处用<b>左贡献 + 自身 + 右贡献</b>更新。",
    keys: [
      ["返回值语义", "<code>max(0, 左) + node.val</code> 或 <code>max(0, 右) + node.val</code> 的单边最大值"],
      ["更新答案", "<code>ans = max(ans, max(0,l) + node.val + max(0,r))</code>"],
      ["负数剪枝", "贡献为负就取 0（不走那条子树）"]
    ],
    trap: "返回值不能是「左+右+自身」，那样上层无法再接；全负数时答案是最大单节点。",
    cx: ["O(n)", "O(h)"],
    tmpl: `class Solution:
    def maxPathSum(self, root: Optional[TreeNode]) -> int:
        ans = float('-inf')
        def gain(node):
            nonlocal ans
            if not node: return 0
            l = max(0, gain(node.left))
            r = max(0, gain(node.right))
            ans = max(ans, node.val + l + r)   # 以当前节点为最高点
            return node.val + max(l, r)        # 只能返回一条边
        gain(root)
        return ans`,
    viz: { k: "tree", tree: [-10, 9, 20, null, null, 15, 7] }
  }
  );
})();
