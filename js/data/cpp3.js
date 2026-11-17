/* Hot 100 · C++ 模板（3/3）：栈 / 堆 / 贪心 / 动态规划 / 多维 DP / 技巧 */
;(function () {
  window.CPP = window.CPP || {};

  Object.assign(window.CPP, {

  394: `class Solution {
public:
    string decodeString(string s) {
        stack<pair<string, int>> st;
        string cur;
        int num = 0;
        for (char c : s) {
            if (isdigit(c)) num = num * 10 + (c - '0');
            else if (c == '[') {
                st.push({cur, num});
                cur.clear();
                num = 0;
            } else if (c == ']') {
                auto [prev, k] = st.top(); st.pop();
                string t;
                for (int i = 0; i < k; ++i) t += cur;
                cur = prev + t;
            } else cur += c;
        }
        return cur;
    }
};`,

  739: `class Solution {
public:
    vector<int> dailyTemperatures(vector<int>& T) {
        int n = T.size();
        vector<int> res(n, 0);
        stack<int> st;                                // 下标，温度递减
        for (int i = 0; i < n; ++i) {
            while (!st.empty() && T[st.top()] < T[i]) {
                int j = st.top(); st.pop();
                res[j] = i - j;
            }
            st.push(i);
        }
        return res;
    }
};`,

  84: `class Solution {
public:
    int largestRectangleArea(vector<int>& h) {
        h.push_back(0);                               // 末尾哨兵
        stack<int> st;
        int best = 0;
        for (int i = 0; i < (int)h.size(); ++i) {
            while (!st.empty() && h[st.top()] > h[i]) {
                int height = h[st.top()]; st.pop();
                int left = st.empty() ? -1 : st.top();
                best = max(best, height * (i - left - 1));
            }
            st.push(i);
        }
        return best;
    }
};`,

  215: `class Solution {
public:
    int findKthLargest(vector<int>& nums, int k) {
        priority_queue<int, vector<int>, greater<int>> heap;   // 小顶堆
        for (int x : nums) {
            heap.push(x);
            if ((int)heap.size() > k) heap.pop();     // 丢掉当前最小
        }
        return heap.top();
    }
};`,

  347: `class Solution {
public:
    vector<int> topKFrequent(vector<int>& nums, int k) {
        unordered_map<int, int> cnt;
        for (int x : nums) ++cnt[x];
        int n = nums.size();
        vector<vector<int>> buckets(n + 1);           // 桶下标 = 频次
        for (auto& [v, f] : cnt) buckets[f].push_back(v);
        vector<int> res;
        for (int f = n; f >= 1 && (int)res.size() < k; --f)
            for (int v : buckets[f]) {
                res.push_back(v);
                if ((int)res.size() == k) break;
            }
        return res;
    }
};`,

  295: `class MedianFinder {
    priority_queue<int> small;                              // 大顶堆，存较小的一半
    priority_queue<int, vector<int>, greater<int>> large;   // 小顶堆，存较大的一半
public:
    MedianFinder() {}
    void addNum(int num) {
        small.push(num);
        large.push(small.top()); small.pop();
        if (large.size() > small.size()) {
            small.push(large.top()); large.pop();
        }
    }
    double findMedian() {
        if (small.size() > large.size()) return small.top();
        return (small.top() + large.top()) / 2.0;
    }
};`,

  121: `class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int low = INT_MAX, profit = 0;
        for (int p : prices) {
            low = min(low, p);
            profit = max(profit, p - low);
        }
        return profit;
    }
};`,

  55: `class Solution {
public:
    bool canJump(vector<int>& nums) {
        int far = 0;
        for (int i = 0; i < (int)nums.size(); ++i) {
            if (i > far) return false;
            far = max(far, i + nums[i]);
        }
        return true;
    }
};`,

  45: `class Solution {
public:
    int jump(vector<int>& nums) {
        int n = nums.size(), end = 0, far = 0, steps = 0;
        for (int i = 0; i < n - 1; ++i) {
            far = max(far, i + nums[i]);
            if (i == end) {                           // 这一层走完
                ++steps;
                end = far;
            }
        }
        return steps;
    }
};`,

  763: `class Solution {
public:
    vector<int> partitionLabels(string s) {
        vector<int> last(26, 0);
        for (int i = 0; i < (int)s.size(); ++i) last[s[i] - 'a'] = i;
        vector<int> res;
        int start = 0, end = 0;
        for (int i = 0; i < (int)s.size(); ++i) {
            end = max(end, last[s[i] - 'a']);
            if (i == end) {
                res.push_back(end - start + 1);
                start = i + 1;
            }
        }
        return res;
    }
};`,

  70: `class Solution {
public:
    int climbStairs(int n) {
        int a = 1, b = 1;
        for (int i = 0; i < n; ++i) {
            int t = a + b;
            a = b;
            b = t;
        }
        return a;
    }
};`,

  118: `class Solution {
public:
    vector<vector<int>> generate(int numRows) {
        vector<vector<int>> res;
        for (int i = 0; i < numRows; ++i) {
            vector<int> row(i + 1, 1);
            for (int j = 1; j < i; ++j)
                row[j] = res[i - 1][j - 1] + res[i - 1][j];
            res.push_back(move(row));
        }
        return res;
    }
};`,

  198: `class Solution {
public:
    int rob(vector<int>& nums) {
        int p2 = 0, p1 = 0;                           // dp[i-2], dp[i-1]
        for (int x : nums) {
            int cur = max(p1, p2 + x);
            p2 = p1;
            p1 = cur;
        }
        return p1;
    }
};`,

  279: `class Solution {
public:
    int numSquares(int n) {
        vector<int> dp(n + 1, INT_MAX);
        dp[0] = 0;
        for (int i = 1; i <= n; ++i)
            for (int j = 1; j * j <= i; ++j)
                dp[i] = min(dp[i], dp[i - j * j] + 1);
        return dp[n];
    }
};`,

  322: `class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        int INF = amount + 1;
        vector<int> dp(amount + 1, INF);
        dp[0] = 0;
        for (int i = 1; i <= amount; ++i)
            for (int c : coins)
                if (c <= i) dp[i] = min(dp[i], dp[i - c] + 1);
        return dp[amount] > amount ? -1 : dp[amount];
    }
};`,

  139: `class Solution {
public:
    bool wordBreak(string s, vector<string>& wordDict) {
        unordered_set<string> dict(wordDict.begin(), wordDict.end());
        int n = s.size(), maxLen = 0;
        for (auto& w : wordDict) maxLen = max(maxLen, (int)w.size());
        vector<bool> dp(n + 1, false);
        dp[0] = true;
        for (int i = 1; i <= n; ++i)
            for (int j = max(0, i - maxLen); j < i; ++j) {
                if (dp[j] && dict.count(s.substr(j, i - j))) { dp[i] = true; break; }
            }
        return dp[n];
    }
};`,

  300: `class Solution {
public:
    int lengthOfLIS(vector<int>& nums) {
        vector<int> tails;                            // tails[i] = 长度 i+1 的最小结尾
        for (int x : nums) {
            auto it = lower_bound(tails.begin(), tails.end(), x);
            if (it == tails.end()) tails.push_back(x);
            else *it = x;
        }
        return tails.size();
    }
};`,

  152: `class Solution {
public:
    int maxProduct(vector<int>& nums) {
        int mx = nums[0], mn = nums[0], best = nums[0];
        for (int i = 1; i < (int)nums.size(); ++i) {
            int a = mx * nums[i], b = mn * nums[i];   // 先算再赋值
            mx = max({nums[i], a, b});
            mn = min({nums[i], a, b});
            best = max(best, mx);
        }
        return best;
    }
};`,

  416: `class Solution {
public:
    bool canPartition(vector<int>& nums) {
        int total = accumulate(nums.begin(), nums.end(), 0);
        if (total & 1) return false;
        int target = total / 2;
        vector<bool> dp(target + 1, false);
        dp[0] = true;
        for (int x : nums)
            for (int j = target; j >= x; --j)          // 倒序，每个数只用一次
                dp[j] = dp[j] || dp[j - x];
        return dp[target];
    }
};`,

  32: `class Solution {
public:
    int longestValidParentheses(string s) {
        stack<int> st;
        st.push(-1);                                  // 哨兵基准
        int best = 0;
        for (int i = 0; i < (int)s.size(); ++i) {
            if (s[i] == '(') st.push(i);
            else {
                st.pop();
                if (st.empty()) st.push(i);           // 新基准
                else best = max(best, i - st.top());
            }
        }
        return best;
    }
};`,

  62: `class Solution {
public:
    int uniquePaths(int m, int n) {
        vector<int> dp(n, 1);                         // 第一行全 1
        for (int i = 1; i < m; ++i)
            for (int j = 1; j < n; ++j)
                dp[j] += dp[j - 1];                   // 上 + 左
        return dp[n - 1];
    }
};`,

  64: `class Solution {
public:
    int minPathSum(vector<vector<int>>& grid) {
        int m = grid.size(), n = grid[0].size();
        for (int j = 1; j < n; ++j) grid[0][j] += grid[0][j - 1];
        for (int i = 1; i < m; ++i) grid[i][0] += grid[i - 1][0];
        for (int i = 1; i < m; ++i)
            for (int j = 1; j < n; ++j)
                grid[i][j] += min(grid[i - 1][j], grid[i][j - 1]);
        return grid[m - 1][n - 1];
    }
};`,

  5: `class Solution {
public:
    string longestPalindrome(string s) {
        int start = 0, maxLen = 1;
        auto expand = [&](int l, int r) {
            while (l >= 0 && r < (int)s.size() && s[l] == s[r]) { --l; ++r; }
            int len = r - l - 1;
            if (len > maxLen) { maxLen = len; start = l + 1; }
        };
        for (int i = 0; i < (int)s.size(); ++i) {
            expand(i, i);                             // 奇数
            expand(i, i + 1);                         // 偶数
        }
        return s.substr(start, maxLen);
    }
};`,

  1143: `class Solution {
public:
    int longestCommonSubsequence(string a, string b) {
        int m = a.size(), n = b.size();
        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
        for (int i = 1; i <= m; ++i)
            for (int j = 1; j <= n; ++j)
                dp[i][j] = (a[i - 1] == b[j - 1])
                    ? dp[i - 1][j - 1] + 1
                    : max(dp[i - 1][j], dp[i][j - 1]);
        return dp[m][n];
    }
};`,

  72: `class Solution {
public:
    int minDistance(string w1, string w2) {
        int m = w1.size(), n = w2.size();
        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
        for (int i = 0; i <= m; ++i) dp[i][0] = i;
        for (int j = 0; j <= n; ++j) dp[0][j] = j;
        for (int i = 1; i <= m; ++i)
            for (int j = 1; j <= n; ++j) {
                if (w1[i - 1] == w2[j - 1]) dp[i][j] = dp[i - 1][j - 1];
                else dp[i][j] = 1 + min({dp[i - 1][j - 1],   // 替换
                                         dp[i - 1][j],       // 删除
                                         dp[i][j - 1]});     // 插入
            }
        return dp[m][n];
    }
};`,

  136: `class Solution {
public:
    int singleNumber(vector<int>& nums) {
        int ans = 0;
        for (int x : nums) ans ^= x;                  // 成对抵消
        return ans;
    }
};`,

  169: `class Solution {
public:
    int majorityElement(vector<int>& nums) {
        int cand = 0, cnt = 0;
        for (int x : nums) {
            if (cnt == 0) cand = x;
            cnt += (x == cand) ? 1 : -1;
        }
        return cand;
    }
};`,

  75: `class Solution {
public:
    void sortColors(vector<int>& nums) {
        int p0 = 0, i = 0, p2 = nums.size() - 1;
        while (i <= p2) {
            if (nums[i] == 0) swap(nums[p0++], nums[i++]);
            else if (nums[i] == 2) swap(nums[i], nums[p2--]);  // i 不动
            else ++i;
        }
    }
};`,

  31: `class Solution {
public:
    void nextPermutation(vector<int>& nums) {
        int n = nums.size(), i = n - 2;
        while (i >= 0 && nums[i] >= nums[i + 1]) --i;          // 找升序对
        if (i >= 0) {
            int j = n - 1;
            while (nums[j] <= nums[i]) --j;                    // 最小的大于
            swap(nums[i], nums[j]);
        }
        reverse(nums.begin() + i + 1, nums.end());             // 后缀反转
    }
};`,

  287: `class Solution {
public:
    int findDuplicate(vector<int>& nums) {
        int slow = 0, fast = 0;
        do {
            slow = nums[slow];
            fast = nums[nums[fast]];
        } while (slow != fast);
        int p = 0;
        while (p != slow) { p = nums[p]; slow = nums[slow]; }
        return p;
    }
};`
  });
})();
