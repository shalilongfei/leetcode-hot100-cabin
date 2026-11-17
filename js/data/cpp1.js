/* Hot 100 · C++ 模板（1/3）：哈希 / 双指针 / 滑窗 / 子串 / 数组 / 矩阵 / 链表
   LeetCode C++ 环境已内置 <bits/stdc++.h> 与 using namespace std; */
;(function () {
  window.CPP = window.CPP || {};

  Object.assign(window.CPP, {

  1: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;              // 值 -> 下标
        for (int i = 0; i < (int)nums.size(); ++i) {
            int need = target - nums[i];
            auto it = seen.find(need);
            if (it != seen.end()) return {it->second, i};
            seen[nums[i]] = i;
        }
        return {};
    }
};`,

  49: `class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        unordered_map<string, vector<string>> groups;
        for (auto& s : strs) {
            string key = s;
            sort(key.begin(), key.end());          // 排序后的字符串当指纹
            groups[key].push_back(s);
        }
        vector<vector<string>> res;
        for (auto& kv : groups) res.push_back(kv.second);
        return res;
    }
};`,

  128: `class Solution {
public:
    int longestConsecutive(vector<int>& nums) {
        unordered_set<int> s(nums.begin(), nums.end());
        int best = 0;
        for (int x : s) {
            if (s.count(x - 1)) continue;          // 不是起点
            int y = x;
            while (s.count(y + 1)) ++y;
            best = max(best, y - x + 1);
        }
        return best;
    }
};`,

  283: `class Solution {
public:
    void moveZeroes(vector<int>& nums) {
        int w = 0;                                  // 下一个非零的落点
        for (int r = 0; r < (int)nums.size(); ++r)
            if (nums[r] != 0) swap(nums[w++], nums[r]);
    }
};`,

  11: `class Solution {
public:
    int maxArea(vector<int>& height) {
        int l = 0, r = (int)height.size() - 1, best = 0;
        while (l < r) {
            best = max(best, min(height[l], height[r]) * (r - l));
            if (height[l] < height[r]) ++l;         // 只收缩矮的一侧
            else --r;
        }
        return best;
    }
};`,

  15: `class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        vector<vector<int>> res;
        int n = nums.size();
        for (int i = 0; i < n - 2; ++i) {
            if (nums[i] > 0) break;
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int l = i + 1, r = n - 1;
            while (l < r) {
                int s = nums[i] + nums[l] + nums[r];
                if (s < 0) ++l;
                else if (s > 0) --r;
                else {
                    res.push_back({nums[i], nums[l], nums[r]});
                    while (l < r && nums[l] == nums[l + 1]) ++l;
                    while (l < r && nums[r] == nums[r - 1]) --r;
                    ++l; --r;
                }
            }
        }
        return res;
    }
};`,

  42: `class Solution {
public:
    int trap(vector<int>& height) {
        int l = 0, r = (int)height.size() - 1;
        int lmax = 0, rmax = 0, ans = 0;
        while (l < r) {
            if (height[l] < height[r]) {
                lmax = max(lmax, height[l]);
                ans += lmax - height[l];
                ++l;
            } else {
                rmax = max(rmax, height[r]);
                ans += rmax - height[r];
                --r;
            }
        }
        return ans;
    }
};`,

  3: `class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        vector<int> last(128, -1);
        int l = 0, ans = 0;
        for (int r = 0; r < (int)s.size(); ++r) {
            if (last[s[r]] >= l) l = last[s[r]] + 1;   // 左边界直接跳
            last[s[r]] = r;
            ans = max(ans, r - l + 1);
        }
        return ans;
    }
};`,

  438: `class Solution {
public:
    vector<int> findAnagrams(string s, string p) {
        vector<int> res;
        int n = s.size(), m = p.size();
        if (m > n) return res;
        vector<int> need(26, 0), win(26, 0);
        for (char c : p) ++need[c - 'a'];
        for (int i = 0; i < n; ++i) {
            ++win[s[i] - 'a'];
            if (i >= m) --win[s[i - m] - 'a'];     // 出窗
            if (win == need) res.push_back(i - m + 1);
        }
        return res;
    }
};`,

  560: `class Solution {
public:
    int subarraySum(vector<int>& nums, int k) {
        unordered_map<int, int> cnt{{0, 1}};       // 前缀和 -> 次数
        int pre = 0, ans = 0;
        for (int x : nums) {
            pre += x;
            auto it = cnt.find(pre - k);            // 先查
            if (it != cnt.end()) ans += it->second;
            ++cnt[pre];                             // 后存
        }
        return ans;
    }
};`,

  239: `class Solution {
public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        deque<int> dq;                              // 存下标，值递减
        vector<int> res;
        for (int i = 0; i < (int)nums.size(); ++i) {
            while (!dq.empty() && nums[dq.back()] <= nums[i]) dq.pop_back();
            dq.push_back(i);
            if (dq.front() <= i - k) dq.pop_front(); // 过期
            if (i >= k - 1) res.push_back(nums[dq.front()]);
        }
        return res;
    }
};`,

  76: `class Solution {
public:
    string minWindow(string s, string t) {
        vector<int> need(128, 0), win(128, 0);
        int kinds = 0;
        for (char c : t) if (need[c]++ == 0) ++kinds;

        int valid = 0, l = 0, start = 0, len = INT_MAX;
        for (int r = 0; r < (int)s.size(); ++r) {
            char c = s[r];
            if (need[c] && ++win[c] == need[c]) ++valid;
            while (valid == kinds) {
                if (r - l + 1 < len) { len = r - l + 1; start = l; }
                char left = s[l];
                if (need[left] && win[left]-- == need[left]) --valid;
                ++l;
            }
        }
        return len == INT_MAX ? "" : s.substr(start, len);
    }
};`,

  53: `class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int cur = nums[0], best = nums[0];
        for (int i = 1; i < (int)nums.size(); ++i) {
            cur = max(nums[i], cur + nums[i]);     // 接上 or 重开
            best = max(best, cur);
        }
        return best;
    }
};`,

  56: `class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        sort(intervals.begin(), intervals.end());
        vector<vector<int>> res;
        for (auto& v : intervals) {
            if (!res.empty() && res.back()[1] >= v[0])
                res.back()[1] = max(res.back()[1], v[1]);
            else
                res.push_back(v);
        }
        return res;
    }
};`,

  189: `class Solution {
public:
    void rotate(vector<int>& nums, int k) {
        int n = nums.size();
        k %= n;
        reverse(nums.begin(), nums.end());
        reverse(nums.begin(), nums.begin() + k);
        reverse(nums.begin() + k, nums.end());
    }
};`,

  238: `class Solution {
public:
    vector<int> productExceptSelf(vector<int>& nums) {
        int n = nums.size();
        vector<int> res(n, 1);
        for (int i = 1; i < n; ++i) res[i] = res[i - 1] * nums[i - 1];  // 前缀积
        int right = 1;
        for (int i = n - 1; i >= 0; --i) {
            res[i] *= right;
            right *= nums[i];                       // 滚动后缀积
        }
        return res;
    }
};`,

  41: `class Solution {
public:
    int firstMissingPositive(vector<int>& nums) {
        int n = nums.size();
        for (int i = 0; i < n; ++i)
            while (nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] != nums[i])
                swap(nums[i], nums[nums[i] - 1]);   // 归位
        for (int i = 0; i < n; ++i)
            if (nums[i] != i + 1) return i + 1;
        return n + 1;
    }
};`,

  73: `class Solution {
public:
    void setZeroes(vector<vector<int>>& matrix) {
        int m = matrix.size(), n = matrix[0].size();
        bool row0 = false, col0 = false;
        for (int j = 0; j < n; ++j) if (matrix[0][j] == 0) row0 = true;
        for (int i = 0; i < m; ++i) if (matrix[i][0] == 0) col0 = true;
        for (int i = 1; i < m; ++i)
            for (int j = 1; j < n; ++j)
                if (matrix[i][j] == 0) matrix[i][0] = matrix[0][j] = 0;
        for (int i = 1; i < m; ++i)
            for (int j = 1; j < n; ++j)
                if (matrix[i][0] == 0 || matrix[0][j] == 0) matrix[i][j] = 0;
        if (row0) fill(matrix[0].begin(), matrix[0].end(), 0);
        if (col0) for (int i = 0; i < m; ++i) matrix[i][0] = 0;
    }
};`,

  54: `class Solution {
public:
    vector<int> spiralOrder(vector<vector<int>>& matrix) {
        vector<int> res;
        if (matrix.empty()) return res;
        int top = 0, bottom = matrix.size() - 1;
        int left = 0, right = matrix[0].size() - 1;
        while (top <= bottom && left <= right) {
            for (int j = left; j <= right; ++j) res.push_back(matrix[top][j]);
            ++top;
            for (int i = top; i <= bottom; ++i) res.push_back(matrix[i][right]);
            --right;
            if (top <= bottom) {
                for (int j = right; j >= left; --j) res.push_back(matrix[bottom][j]);
                --bottom;
            }
            if (left <= right) {
                for (int i = bottom; i >= top; --i) res.push_back(matrix[i][left]);
                ++left;
            }
        }
        return res;
    }
};`,

  48: `class Solution {
public:
    void rotate(vector<vector<int>>& matrix) {
        int n = matrix.size();
        for (int i = 0; i < n; ++i)
            for (int j = i + 1; j < n; ++j)
                swap(matrix[i][j], matrix[j][i]);   // 转置
        for (auto& row : matrix) reverse(row.begin(), row.end());  // 每行翻转
    }
};`,

  240: `class Solution {
public:
    bool searchMatrix(vector<vector<int>>& matrix, int target) {
        int m = matrix.size(), n = matrix[0].size();
        int i = 0, j = n - 1;                       // 从右上角出发
        while (i < m && j >= 0) {
            if (matrix[i][j] == target) return true;
            if (matrix[i][j] > target) --j;
            else ++i;
        }
        return false;
    }
};`,

  160: `class Solution {
public:
    ListNode *getIntersectionNode(ListNode *headA, ListNode *headB) {
        ListNode *a = headA, *b = headB;
        while (a != b) {
            a = a ? a->next : headB;
            b = b ? b->next : headA;
        }
        return a;
    }
};`,

  206: `class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        ListNode* prev = nullptr;
        while (head) {
            ListNode* nxt = head->next;
            head->next = prev;
            prev = head;
            head = nxt;
        }
        return prev;
    }
};`,

  234: `class Solution {
public:
    bool isPalindrome(ListNode* head) {
        ListNode *slow = head, *fast = head;
        while (fast && fast->next) {                // 找中点
            slow = slow->next;
            fast = fast->next->next;
        }
        ListNode *prev = nullptr;                   // 反转后半段
        while (slow) {
            ListNode* nxt = slow->next;
            slow->next = prev;
            prev = slow;
            slow = nxt;
        }
        ListNode *p1 = head, *p2 = prev;
        while (p2) {
            if (p1->val != p2->val) return false;
            p1 = p1->next;
            p2 = p2->next;
        }
        return true;
    }
};`,

  141: `class Solution {
public:
    bool hasCycle(ListNode *head) {
        ListNode *slow = head, *fast = head;
        while (fast && fast->next) {
            slow = slow->next;
            fast = fast->next->next;
            if (slow == fast) return true;
        }
        return false;
    }
};`,

  142: `class Solution {
public:
    ListNode *detectCycle(ListNode *head) {
        ListNode *slow = head, *fast = head;
        while (fast && fast->next) {
            slow = slow->next;
            fast = fast->next->next;
            if (slow == fast) {                     // 相遇后找入口
                ListNode* p = head;
                while (p != slow) { p = p->next; slow = slow->next; }
                return p;
            }
        }
        return nullptr;
    }
};`,

  21: `class Solution {
public:
    ListNode* mergeTwoLists(ListNode* a, ListNode* b) {
        ListNode dummy, *tail = &dummy;
        while (a && b) {
            if (a->val <= b->val) { tail->next = a; a = a->next; }
            else { tail->next = b; b = b->next; }
            tail = tail->next;
        }
        tail->next = a ? a : b;
        return dummy.next;
    }
};`,

  2: `class Solution {
public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        ListNode dummy, *tail = &dummy;
        int carry = 0;
        while (l1 || l2 || carry) {
            int v = (l1 ? l1->val : 0) + (l2 ? l2->val : 0) + carry;
            carry = v / 10;
            tail->next = new ListNode(v % 10);
            tail = tail->next;
            if (l1) l1 = l1->next;
            if (l2) l2 = l2->next;
        }
        return dummy.next;
    }
};`,

  19: `class Solution {
public:
    ListNode* removeNthFromEnd(ListNode* head, int n) {
        ListNode dummy(0, head);
        ListNode *fast = &dummy, *slow = &dummy;
        for (int i = 0; i < n; ++i) fast = fast->next;
        while (fast->next) { fast = fast->next; slow = slow->next; }
        slow->next = slow->next->next;
        return dummy.next;
    }
};`,

  24: `class Solution {
public:
    ListNode* swapPairs(ListNode* head) {
        ListNode dummy(0, head), *prev = &dummy;
        while (prev->next && prev->next->next) {
            ListNode* a = prev->next;
            ListNode* b = a->next;
            a->next = b->next;
            b->next = a;
            prev->next = b;
            prev = a;                               // a 已是这一对的尾巴
        }
        return dummy.next;
    }
};`,

  25: `class Solution {
public:
    ListNode* reverseKGroup(ListNode* head, int k) {
        ListNode dummy(0, head), *groupPrev = &dummy;
        while (true) {
            ListNode* kth = groupPrev;
            for (int i = 0; i < k && kth; ++i) kth = kth->next;
            if (!kth) return dummy.next;             // 不足 k 个
            ListNode* groupNext = kth->next;
            ListNode *prev = groupNext, *cur = groupPrev->next;
            while (cur != groupNext) {               // 区间反转
                ListNode* nxt = cur->next;
                cur->next = prev;
                prev = cur;
                cur = nxt;
            }
            ListNode* start = groupPrev->next;
            groupPrev->next = kth;
            groupPrev = start;
        }
    }
};`,

  138: `class Solution {
public:
    Node* copyRandomList(Node* head) {
        if (!head) return nullptr;
        unordered_map<Node*, Node*> mp;
        for (Node* p = head; p; p = p->next) mp[p] = new Node(p->val);
        for (Node* p = head; p; p = p->next) {
            mp[p]->next = p->next ? mp[p->next] : nullptr;
            mp[p]->random = p->random ? mp[p->random] : nullptr;
        }
        return mp[head];
    }
};`,

  148: `class Solution {
public:
    ListNode* sortList(ListNode* head) {
        if (!head || !head->next) return head;
        ListNode *slow = head, *fast = head->next;
        while (fast && fast->next) {                // 找前半段末尾
            slow = slow->next;
            fast = fast->next->next;
        }
        ListNode* mid = slow->next;
        slow->next = nullptr;
        return merge(sortList(head), sortList(mid));
    }
private:
    ListNode* merge(ListNode* a, ListNode* b) {
        ListNode dummy, *tail = &dummy;
        while (a && b) {
            if (a->val <= b->val) { tail->next = a; a = a->next; }
            else { tail->next = b; b = b->next; }
            tail = tail->next;
        }
        tail->next = a ? a : b;
        return dummy.next;
    }
};`,

  23: `class Solution {
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        auto cmp = [](ListNode* a, ListNode* b) { return a->val > b->val; };
        priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> pq(cmp);
        for (ListNode* h : lists) if (h) pq.push(h);
        ListNode dummy, *tail = &dummy;
        while (!pq.empty()) {
            ListNode* node = pq.top(); pq.pop();
            tail->next = node;
            tail = node;
            if (node->next) pq.push(node->next);
        }
        return dummy.next;
    }
};`,

  146: `class LRUCache {
    int cap;
    list<pair<int, int>> lst;                       // 头部最新、尾部最旧
    unordered_map<int, list<pair<int,int>>::iterator> mp;
public:
    LRUCache(int capacity) : cap(capacity) {}

    int get(int key) {
        auto it = mp.find(key);
        if (it == mp.end()) return -1;
        lst.splice(lst.begin(), lst, it->second);    // 提升为最新
        return it->second->second;
    }

    void put(int key, int value) {
        auto it = mp.find(key);
        if (it != mp.end()) {
            it->second->second = value;
            lst.splice(lst.begin(), lst, it->second);
            return;
        }
        if ((int)lst.size() == cap) {
            mp.erase(lst.back().first);              // 淘汰最旧
            lst.pop_back();
        }
        lst.emplace_front(key, value);
        mp[key] = lst.begin();
    }
};`
  });
})();
