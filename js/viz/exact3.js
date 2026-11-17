/* exact3 — 二叉树 15 题精确帧表（行号已对 cpp 模板逐条核过） */
;(function () {
  const E = window.EXACT;

  E[94] = [
    [/^res = \[\]/, 4],
    [/^stack 空/, 5],
    [/^cur = root/, 6],
    [/^while \(cur \|\| !st\.empty\(\)\)/, 7],
    [/^push\(.*\)，cur = cur->left/, 8],
    [/^cur 为空，退出内层/, 8],
    [/^cur = st\.top\(\)/, 9],
    [/^res\.push_back/, 10],
    [/^cur = cur->right/, 11],
    [/^return res/, 13]
  ];

  E[104] = [
    [/：if \(!root\)/, 4],
    [/→ 空，return 0/, 4],
    [/^return 1 \+ max/, 5],
    [/^root 返回/, 5]
  ];

  E[226] = [
    [/^invertTree\(\d+\)$/, 4],
    [/^swap\(left, right\)/, 5],
    [/^invertTree\(left\) 返回/, 6],
    [/^invertTree\(right\) 返回/, 7],
    [/^return root/, 8]
  ];

  E[101] = [
    [/^check\(.*\)：都空？/, 8],
    [/→ true$/, 8],
    [/→ 一个空一个非空，false/, 9],
    [/^a->val\(.*\) == b->val/, 10],
    [/^check\(left,right\) && check\(right,left\)/, 10],
    [/^check\(root->left, root->right\)/, 4],
    [/^return (true|false)$/, 4]
  ];

  E[543] = [
    [/^depth\(.*\)：空？/, 10],
    [/→ return 0/, 10],
    [/^ans = max\(ans,/, 12],
    [/^return 1 \+ max/, 13],
    [/^return \d+$/, 6]
  ];

  E[102] = [
    [/^res = \[\]/, 4],
    [/^if \(!root\)/, 5],
    [/^q = \{root\}/, 6],
    [/^while \(!q\.empty\(\)\) → 队列里/, 7],
    [/^sz = \d+$/, 8],
    [/^node = q\.front\(\)/, 11],
    [/^level\.push_back/, 12],
    [/^push\(left/, 13],
    [/^push\(right/, 14],
    [/^res\.push_back\(\[/, 16],
    [/^return res/, 18]
  ];

  E[108] = [
    [/^build\(\d+, -?\d+\)：l > r/, 8],
    [/→ 返回 null/, 8],
    [/^mid = \(/, 9],
    [/^node = TreeNode/, 10],
    [/^build\(.*\) 作左子树/, 11],
    [/^build\(.*\) 作右子树/, 12],
    [/^返回 \d+$/, 13],
    [/^return root/, 4]
  ];

  E[98] = [
    [/^check\(.*, .*\)$/, 7],
    [/→ 空，true/, 8],
    [/< .* < .* \?/, 9],
    [/→ 越界，false/, 9],
    [/^左右都合法？/, 10],
    [/^return (true|false)$/, 4]
  ];

  E[230] = [
    [/^stack 空，cur = root/, 5],
    [/^k = \d+$/, 4],
    [/^while \(cur \|\| !st\.empty\(\)\)/, 6],
    [/^push\(.*\)，走左边/, 7],
    [/^左边走到底/, 7],
    [/^pop → /, 8],
    [/^--k → /, 9],
    [/^k == 0 → return/, 9],
    [/^cur = cur->right/, 10]
  ];

  E[199] = [
    [/^res = \[\]/, 4],
    [/^if \(!root\)/, 5],
    [/^sz = \d+$/, 8],
    [/^取出 .*（第/, 10],
    [/^i == sz-1 → res\.push/, 11],
    [/^下一层入队/, 12],
    [/^return \{/, 16]
  ];

  E[114] = [
    [/^flatten\(root\)/, 4],
    [/^先递归左子树/, 5],
    [/^再递归右子树/, 6],
    [/^root->left = nullptr/, 9],
    [/^root->right = left/, 10],
    [/^接上原来的右子树/, 13],
    [/^结果：前序/, 13]
  ];

  E[105] = [
    [/^idx：中序值/, 5],
    [/^build\(pre\[/, 11],
    [/→ 空区间，null/, 11],
    [/^根 = pre\[/, 12],
    [/^leftLen = /, 14],
    [/^build 左：/, 15],
    [/^build 右：/, 16],
    [/^return root/, 17]
  ];

  E[437] = [
    [/^pathSum\(.*\)：空？/, 4],
    [/^空 → pathSum 返回 0/, 4],
    [/^以 .* 为起点：pathSumFrom/, 5],
    [/^return .* = \d+$/, 5],
    [/^再让左子树每个节点都当起点/, 6],
    [/^再让右子树每个节点都当起点/, 7],
    [/^pathSumFrom\(.*\)：空？/, 11],
    [/^空 → 返回 0/, 11],
    [/^cur \+= /, 12],
    [/→ 本节点命中 /, 13],
    [/^左子树返回 .*，累计/, 14],
    [/^右子树返回 .*，共/, 15]
  ];

  E[236] = [
    [/^LCA\(.*\)：空 or 等于/, 4],
    [/→ null$/, 4],
    [/→ 命中 .*，返回它/, 4],
    [/^LCA = /, 4],
    [/^左子树返回/, 5],
    [/^右子树返回/, 6],
    [/^两边都非空？/, 7]
  ];

  E[124] = [
    [/^gain\(.*\)$/, 10],
    [/→ 0$/, 10],
    [/^l = max\(0, 左\)/, 11],
    [/^r = max\(0, 右\)/, 12],
    [/^ans = max\(ans,/, 13],
    [/^return .* \+ max\(/, 14],
    [/^return -?\d+$/, 6]
  ];
})();
