/* Hot 100 · C++ 模板（2/3）：二叉树 / 图论 / 回溯 / 二分 / 栈 */
;(function () {
  window.CPP = window.CPP || {};

  Object.assign(window.CPP, {

  94: `class Solution {
public:
    vector<int> inorderTraversal(TreeNode* root) {
        vector<int> res;
        stack<TreeNode*> st;
        TreeNode* cur = root;
        while (cur || !st.empty()) {
            while (cur) { st.push(cur); cur = cur->left; }   // 一路向左
            cur = st.top(); st.pop();
            res.push_back(cur->val);
            cur = cur->right;
        }
        return res;
    }
};`,

  104: `class Solution {
public:
    int maxDepth(TreeNode* root) {
        if (!root) return 0;
        return 1 + max(maxDepth(root->left), maxDepth(root->right));
    }
};`,

  226: `class Solution {
public:
    TreeNode* invertTree(TreeNode* root) {
        if (!root) return nullptr;
        swap(root->left, root->right);
        invertTree(root->left);
        invertTree(root->right);
        return root;
    }
};`,

  101: `class Solution {
public:
    bool isSymmetric(TreeNode* root) {
        return !root || check(root->left, root->right);
    }
private:
    bool check(TreeNode* a, TreeNode* b) {
        if (!a && !b) return true;
        if (!a || !b) return false;
        return a->val == b->val && check(a->left, b->right) && check(a->right, b->left);
    }
};`,

  543: `class Solution {
public:
    int diameterOfBinaryTree(TreeNode* root) {
        int ans = 0;
        depth(root, ans);
        return ans;
    }
private:
    int depth(TreeNode* node, int& ans) {
        if (!node) return 0;
        int l = depth(node->left, ans), r = depth(node->right, ans);
        ans = max(ans, l + r);                       // 以当前节点为拐点
        return 1 + max(l, r);
    }
};`,

  102: `class Solution {
public:
    vector<vector<int>> levelOrder(TreeNode* root) {
        vector<vector<int>> res;
        if (!root) return res;
        queue<TreeNode*> q{{root}};
        while (!q.empty()) {
            int sz = q.size();
            vector<int> level;
            while (sz--) {
                TreeNode* node = q.front(); q.pop();
                level.push_back(node->val);
                if (node->left) q.push(node->left);
                if (node->right) q.push(node->right);
            }
            res.push_back(move(level));
        }
        return res;
    }
};`,

  108: `class Solution {
public:
    TreeNode* sortedArrayToBST(vector<int>& nums) {
        return build(nums, 0, nums.size() - 1);
    }
private:
    TreeNode* build(vector<int>& a, int l, int r) {
        if (l > r) return nullptr;
        int mid = l + (r - l) / 2;
        TreeNode* node = new TreeNode(a[mid]);
        node->left = build(a, l, mid - 1);
        node->right = build(a, mid + 1, r);
        return node;
    }
};`,

  98: `class Solution {
public:
    bool isValidBST(TreeNode* root) {
        return check(root, LONG_MIN, LONG_MAX);
    }
private:
    bool check(TreeNode* node, long lo, long hi) {
        if (!node) return true;
        if (node->val <= lo || node->val >= hi) return false;
        return check(node->left, lo, node->val) && check(node->right, node->val, hi);
    }
};`,

  230: `class Solution {
public:
    int kthSmallest(TreeNode* root, int k) {
        stack<TreeNode*> st;
        TreeNode* cur = root;
        while (cur || !st.empty()) {
            while (cur) { st.push(cur); cur = cur->left; }
            cur = st.top(); st.pop();
            if (--k == 0) return cur->val;
            cur = cur->right;
        }
        return -1;
    }
};`,

  199: `class Solution {
public:
    vector<int> rightSideView(TreeNode* root) {
        vector<int> res;
        if (!root) return res;
        queue<TreeNode*> q{{root}};
        while (!q.empty()) {
            int sz = q.size();
            for (int i = 0; i < sz; ++i) {
                TreeNode* node = q.front(); q.pop();
                if (i == sz - 1) res.push_back(node->val);   // 本层最后一个
                if (node->left) q.push(node->left);
                if (node->right) q.push(node->right);
            }
        }
        return res;
    }
};`,

  114: `class Solution {
public:
    void flatten(TreeNode* root) {
        if (!root) return;
        flatten(root->left);
        flatten(root->right);
        TreeNode* left = root->left;
        TreeNode* right = root->right;
        root->left = nullptr;
        root->right = left;
        TreeNode* tail = root;
        while (tail->right) tail = tail->right;      // 找到拉直后的尾
        tail->right = right;
    }
};`,

  105: `class Solution {
public:
    TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
        unordered_map<int, int> idx;
        for (int i = 0; i < (int)inorder.size(); ++i) idx[inorder[i]] = i;
        return build(preorder, idx, 0, preorder.size() - 1, 0, inorder.size() - 1);
    }
private:
    TreeNode* build(vector<int>& pre, unordered_map<int,int>& idx,
                    int pl, int pr, int il, int ir) {
        if (pl > pr) return nullptr;
        TreeNode* root = new TreeNode(pre[pl]);
        int mid = idx[pre[pl]];
        int leftLen = mid - il;
        root->left  = build(pre, idx, pl + 1, pl + leftLen, il, mid - 1);
        root->right = build(pre, idx, pl + leftLen + 1, pr, mid + 1, ir);
        return root;
    }
};`,

  437: `class Solution {
public:
    int pathSum(TreeNode* root, int targetSum) {
        if (!root) return 0;
        return pathSumFrom(root, targetSum, 0)
             + pathSum(root->left, targetSum)
             + pathSum(root->right, targetSum);
    }
private:
    int pathSumFrom(TreeNode* node, int target, long long cur) {
        if (!node) return 0;
        cur += node->val;
        return (cur == target ? 1 : 0)
             + pathSumFrom(node->left, target, cur)
             + pathSumFrom(node->right, target, cur);
    }
};`,

  236: `class Solution {
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        if (!root || root == p || root == q) return root;
        TreeNode* l = lowestCommonAncestor(root->left, p, q);
        TreeNode* r = lowestCommonAncestor(root->right, p, q);
        if (l && r) return root;                      // 一边一个
        return l ? l : r;
    }
};`,

  124: `class Solution {
public:
    int maxPathSum(TreeNode* root) {
        int ans = INT_MIN;
        gain(root, ans);
        return ans;
    }
private:
    int gain(TreeNode* node, int& ans) {
        if (!node) return 0;
        int l = max(0, gain(node->left, ans));
        int r = max(0, gain(node->right, ans));
        ans = max(ans, node->val + l + r);            // 以当前节点为最高点
        return node->val + max(l, r);                 // 只能返回一条边
    }
};`,

  200: `class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        int m = grid.size(), n = grid[0].size(), cnt = 0;
        for (int i = 0; i < m; ++i)
            for (int j = 0; j < n; ++j)
                if (grid[i][j] == '1') { ++cnt; sink(grid, i, j); }
        return cnt;
    }
private:
    void sink(vector<vector<char>>& g, int i, int j) {
        if (i < 0 || i >= (int)g.size() || j < 0 || j >= (int)g[0].size() || g[i][j] != '1')
            return;
        g[i][j] = '0';
        sink(g, i + 1, j); sink(g, i - 1, j); sink(g, i, j + 1); sink(g, i, j - 1);
    }
};`,

  994: `class Solution {
public:
    int orangesRotting(vector<vector<int>>& grid) {
        int m = grid.size(), n = grid[0].size();
        queue<pair<int,int>> q;
        int fresh = 0, minutes = 0;
        for (int i = 0; i < m; ++i)
            for (int j = 0; j < n; ++j) {
                if (grid[i][j] == 2) q.push({i, j});
                else if (grid[i][j] == 1) ++fresh;
            }
        int dirs[4][2] = {{1,0},{-1,0},{0,1},{0,-1}};
        while (!q.empty() && fresh) {
            for (int sz = q.size(); sz > 0; --sz) {
                auto [i, j] = q.front(); q.pop();
                for (auto& d : dirs) {
                    int x = i + d[0], y = j + d[1];
                    if (x >= 0 && x < m && y >= 0 && y < n && grid[x][y] == 1) {
                        grid[x][y] = 2;
                        --fresh;
                        q.push({x, y});
                    }
                }
            }
            ++minutes;
        }
        return fresh ? -1 : minutes;
    }
};`,

  207: `class Solution {
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        vector<vector<int>> g(numCourses);
        vector<int> indeg(numCourses, 0);
        for (auto& e : prerequisites) {             // e = {后修, 先修}
            g[e[1]].push_back(e[0]);
            ++indeg[e[0]];
        }
        queue<int> q;
        for (int i = 0; i < numCourses; ++i) if (!indeg[i]) q.push(i);
        int seen = 0;
        while (!q.empty()) {
            int u = q.front(); q.pop();
            ++seen;
            for (int v : g[u]) if (--indeg[v] == 0) q.push(v);
        }
        return seen == numCourses;
    }
};`,

  208: `class Trie {
    struct Node {
        Node* child[26] = {nullptr};
        bool isEnd = false;
    };
    Node* root = new Node();

    Node* find(const string& s) {
        Node* node = root;
        for (char c : s) {
            if (!node->child[c - 'a']) return nullptr;
            node = node->child[c - 'a'];
        }
        return node;
    }
public:
    Trie() {}
    void insert(string word) {
        Node* node = root;
        for (char c : word) {
            if (!node->child[c - 'a']) node->child[c - 'a'] = new Node();
            node = node->child[c - 'a'];
        }
        node->isEnd = true;
    }
    bool search(string word) {
        Node* node = find(word);
        return node && node->isEnd;
    }
    bool startsWith(string prefix) {
        return find(prefix) != nullptr;
    }
};`,

  46: `class Solution {
public:
    vector<vector<int>> permute(vector<int>& nums) {
        vector<vector<int>> res;
        vector<int> path;
        vector<bool> used(nums.size(), false);
        backtrack(nums, used, path, res);
        return res;
    }
private:
    void backtrack(vector<int>& nums, vector<bool>& used,
                   vector<int>& path, vector<vector<int>>& res) {
        if (path.size() == nums.size()) { res.push_back(path); return; }
        for (int i = 0; i < (int)nums.size(); ++i) {
            if (used[i]) continue;
            used[i] = true;
            path.push_back(nums[i]);
            backtrack(nums, used, path, res);
            path.pop_back();
            used[i] = false;
        }
    }
};`,

  78: `class Solution {
public:
    vector<vector<int>> subsets(vector<int>& nums) {
        vector<vector<int>> res;
        vector<int> path;
        backtrack(nums, 0, path, res);
        return res;
    }
private:
    void backtrack(vector<int>& nums, int start,
                   vector<int>& path, vector<vector<int>>& res) {
        res.push_back(path);                          // 每个节点都是子集
        for (int i = start; i < (int)nums.size(); ++i) {
            path.push_back(nums[i]);
            backtrack(nums, i + 1, path, res);
            path.pop_back();
        }
    }
};`,

  17: `class Solution {
    vector<string> mp{"", "", "abc", "def", "ghi", "jkl",
                      "mno", "pqrs", "tuv", "wxyz"};
public:
    vector<string> letterCombinations(string digits) {
        vector<string> res;
        if (digits.empty()) return res;
        string path;
        dfs(digits, 0, path, res);
        return res;
    }
private:
    void dfs(const string& digits, int i, string& path, vector<string>& res) {
        if (i == (int)digits.size()) { res.push_back(path); return; }
        for (char c : mp[digits[i] - '0']) {
            path.push_back(c);
            dfs(digits, i + 1, path, res);
            path.pop_back();
        }
    }
};`,

  39: `class Solution {
public:
    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
        sort(candidates.begin(), candidates.end());
        vector<vector<int>> res;
        vector<int> path;
        dfs(candidates, 0, target, path, res);
        return res;
    }
private:
    void dfs(vector<int>& a, int start, int remain,
             vector<int>& path, vector<vector<int>>& res) {
        if (remain == 0) { res.push_back(path); return; }
        for (int i = start; i < (int)a.size(); ++i) {
            if (a[i] > remain) break;                 // 剪枝
            path.push_back(a[i]);
            dfs(a, i, remain - a[i], path, res);      // i 不 +1，可重复
            path.pop_back();
        }
    }
};`,

  22: `class Solution {
public:
    vector<string> generateParenthesis(int n) {
        vector<string> res;
        string path;
        dfs(n, 0, 0, path, res);
        return res;
    }
private:
    void dfs(int n, int open, int close, string& path, vector<string>& res) {
        if ((int)path.size() == 2 * n) { res.push_back(path); return; }
        if (open < n) {
            path.push_back('(');
            dfs(n, open + 1, close, path, res);
            path.pop_back();
        }
        if (close < open) {
            path.push_back(')');
            dfs(n, open, close + 1, path, res);
            path.pop_back();
        }
    }
};`,

  79: `class Solution {
public:
    bool exist(vector<vector<char>>& board, string word) {
        int m = board.size(), n = board[0].size();
        for (int i = 0; i < m; ++i)
            for (int j = 0; j < n; ++j)
                if (dfs(board, word, i, j, 0)) return true;
        return false;
    }
private:
    bool dfs(vector<vector<char>>& b, string& w, int i, int j, int k) {
        if (k == (int)w.size()) return true;
        if (i < 0 || i >= (int)b.size() || j < 0 || j >= (int)b[0].size() || b[i][j] != w[k])
            return false;
        char tmp = b[i][j];
        b[i][j] = '#';                                // 标记已用
        bool ok = dfs(b, w, i + 1, j, k + 1) || dfs(b, w, i - 1, j, k + 1) ||
                  dfs(b, w, i, j + 1, k + 1) || dfs(b, w, i, j - 1, k + 1);
        b[i][j] = tmp;                                // 恢复
        return ok;
    }
};`,

  131: `class Solution {
public:
    vector<vector<string>> partition(string s) {
        vector<vector<string>> res;
        vector<string> path;
        dfs(s, 0, path, res);
        return res;
    }
private:
    bool isPal(const string& s, int l, int r) {
        while (l < r) if (s[l++] != s[r--]) return false;
        return true;
    }
    void dfs(const string& s, int start, vector<string>& path,
             vector<vector<string>>& res) {
        if (start == (int)s.size()) { res.push_back(path); return; }
        for (int end = start; end < (int)s.size(); ++end) {
            if (!isPal(s, start, end)) continue;
            path.push_back(s.substr(start, end - start + 1));
            dfs(s, end + 1, path, res);
            path.pop_back();
        }
    }
};`,

  51: `class Solution {
public:
    vector<vector<string>> solveNQueens(int n) {
        vector<vector<string>> res;
        vector<string> board(n, string(n, '.'));
        vector<bool> col(n, false), d1(2 * n, false), d2(2 * n, false);
        dfs(0, n, board, col, d1, d2, res);
        return res;
    }
private:
    void dfs(int r, int n, vector<string>& board, vector<bool>& col,
             vector<bool>& d1, vector<bool>& d2, vector<vector<string>>& res) {
        if (r == n) { res.push_back(board); return; }
        for (int c = 0; c < n; ++c) {
            if (col[c] || d1[r - c + n] || d2[r + c]) continue;   // r-c 可能为负，+n 偏移
            col[c] = d1[r - c + n] = d2[r + c] = true;
            board[r][c] = 'Q';
            dfs(r + 1, n, board, col, d1, d2, res);
            board[r][c] = '.';
            col[c] = d1[r - c + n] = d2[r + c] = false;
        }
    }
};`,

  35: `class Solution {
public:
    int searchInsert(vector<int>& nums, int target) {
        int lo = 0, hi = nums.size();                 // 右开区间
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] < target) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    }
};`,

  74: `class Solution {
public:
    bool searchMatrix(vector<vector<int>>& matrix, int target) {
        int m = matrix.size(), n = matrix[0].size();
        int lo = 0, hi = m * n;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            int v = matrix[mid / n][mid % n];
            if (v == target) return true;
            if (v < target) lo = mid + 1;
            else hi = mid;
        }
        return false;
    }
};`,

  34: `class Solution {
public:
    vector<int> searchRange(vector<int>& nums, int target) {
        int l = lower_bound(nums.begin(), nums.end(), target) - nums.begin();
        int r = lower_bound(nums.begin(), nums.end(), target + 1) - nums.begin() - 1;
        if (l >= (int)nums.size() || nums[l] != target) return {-1, -1};
        return {l, r};
    }
};`,

  33: `class Solution {
public:
    int search(vector<int>& nums, int target) {
        int lo = 0, hi = (int)nums.size() - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] == target) return mid;
            if (nums[lo] <= nums[mid]) {              // 左半有序
                if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
                else lo = mid + 1;
            } else {                                  // 右半有序
                if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
                else hi = mid - 1;
            }
        }
        return -1;
    }
};`,

  153: `class Solution {
public:
    int findMin(vector<int>& nums) {
        int lo = 0, hi = (int)nums.size() - 1;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] < nums[hi]) hi = mid;
            else lo = mid + 1;
        }
        return nums[lo];
    }
};`,

  4: `class Solution {
public:
    double findMedianSortedArrays(vector<int>& A, vector<int>& B) {
        if (A.size() > B.size()) swap(A, B);          // 在短数组上二分
        int m = A.size(), n = B.size();
        int half = (m + n + 1) / 2, lo = 0, hi = m;
        while (lo <= hi) {
            int i = lo + (hi - lo) / 2, j = half - i;
            int aL = (i == 0) ? INT_MIN : A[i - 1];
            int aR = (i == m) ? INT_MAX : A[i];
            int bL = (j == 0) ? INT_MIN : B[j - 1];
            int bR = (j == n) ? INT_MAX : B[j];
            if (aL <= bR && bL <= aR) {
                if ((m + n) & 1) return max(aL, bL);
                return (max(aL, bL) + min(aR, bR)) / 2.0;
            }
            if (aL > bR) hi = i - 1;
            else lo = i + 1;
        }
        return 0.0;
    }
};`,

  20: `class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        for (char c : s) {
            if (c == '(' || c == '[' || c == '{') st.push(c);
            else {
                if (st.empty()) return false;
                char t = st.top();
                if ((c == ')' && t != '(') || (c == ']' && t != '[') || (c == '}' && t != '{'))
                    return false;
                st.pop();
            }
        }
        return st.empty();
    }
};`,

  155: `class MinStack {
    stack<int> data, mins;
public:
    MinStack() {}
    void push(int val) {
        data.push(val);
        mins.push(mins.empty() ? val : min(val, mins.top()));
    }
    void pop() { data.pop(); mins.pop(); }
    int top() { return data.top(); }
    int getMin() { return mins.top(); }
};`
  });
})();
