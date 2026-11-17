/* exact2 — 链表 14 题精确帧表 */
;(function () {
  const E = window.EXACT;

  E[160] = [
    [/^a = headA, b = headB/, 4],
    [/^while \(a != b\)/, 5],
    [/^a = a->next/, 6],
    [/^b = b->next/, 7],
    [/^return a（交点/, 9]
  ];

  E[206] = [
    [/^prev = nullptr/, 4],
    [/^while \(head\) →/, 5],
    [/^nxt = head->next/, 6],
    [/^head->next = prev →/, 7],
    [/^prev = head →/, 8],
    [/^head = nxt →/, 9],
    [/^return prev（新头）/, 11]
  ];

  E[234] = [
    [/^slow = fast = head/, 4],
    [/^while \(fast && fast->next\) →/, 5],
    [/^slow = slow->next →/, 6],
    [/^fast = fast->next->next →/, 7],
    [/^prev = nullptr（开始反转/, 9],
    [/^slow->next = prev →/, 12],
    [/^p1 = head, p2 =/, 16],
    [/^p1->val\(.*\) != p2->val/, 18],
    [/→ 不等，return false/, 18],
    [/^p1 = p1->next →/, 19],
    [/^p2 = p2->next →/, 20],
    [/^return true/, 22]
  ];

  E[141] = [
    [/^slow = fast = head/, 4],
    [/^while \(fast && fast->next\)/, 5],
    [/^slow = slow->next →/, 6],
    [/^fast = fast->next->next →/, 7],
    [/^slow == fast \?/, 8],
    [/→ return true/, 8],
    [/^return false/, 10]
  ];

  E[142] = [
    [/^slow = fast = head/, 4],
    [/^while \(fast && fast->next\)/, 5],
    [/^slow → /, 6],
    [/^fast → /, 7],
    [/^slow == fast \?/, 8],
    [/^p = head（slow 停在/, 9],
    [/^while \(p != slow\) →/, 10],
    [/^p → .*slow → /, 10],
    [/^return p（入口/, 11],
    [/^return nullptr/, 14]
  ];

  E[21] = [
    [/^dummy, tail = &dummy/, 4],
    [/^while \(a && b\) →/, 5],
    [/<= \?/, 6],
    [/^tail->next = .*，a = a->next/, 6],
    [/^tail->next = .*，b = b->next/, 7],
    [/^tail = tail->next → 已接/, 8],
    [/^接上 a 的剩余/, 10],
    [/^接上 b 的剩余/, 10],
    [/^return dummy.next/, 11]
  ];

  E[2] = [
    [/^dummy, tail = &dummy/, 4],
    [/^carry = 0/, 5],
    [/^while \(l1 \|\| l2 \|\| carry\)/, 6],
    [/^v = /, 7],
    [/^carry = v \/ 10/, 8],
    [/^tail->next = new ListNode/, 9],
    [/^tail = tail->next/, 10],
    [/^l1 = l1->next/, 11],
    [/^l2 = l2->next/, 12],
    [/^return dummy.next/, 14]
  ];

  E[19] = [
    [/^dummy\(0, head\)/, 4],
    [/^fast = slow = &dummy/, 5],
    [/^for：fast = fast->next/, 6],
    [/^while \(fast->next\) →/, 7],
    [/^fast → .*slow →/, 7],
    [/^fast->next == null/, 7],
    [/^slow->next = slow->next->next/, 8],
    [/^return dummy.next/, 9]
  ];

  E[24] = [
    [/^dummy, prev = &dummy/, 4],
    [/^while \(prev->next && prev->next->next\)/, 5],
    [/^a = prev->next →/, 6],
    [/^b = a->next →/, 7],
    [/^a->next = b->next/, 8],
    [/^b->next = a（/, 9],
    [/^prev->next = b/, 10],
    [/^prev = a →/, 11],
    [/^return dummy.next/, 13]
  ];

  E[25] = [
    [/^dummy, groupPrev = &dummy/, 4],
    [/^while \(true\)/, 5],
    [/^数第 \d+ 个/, 7],
    [/^kth 存在/, 8],
    [/^groupNext = kth->next/, 9],
    [/^prev = groupNext, cur =/, 10],
    [/^nxt = cur->next/, 12],
    [/^cur->next = prev/, 13],
    [/^prev = cur/, 14],
    [/^cur = nxt/, 15],
    [/^start = groupPrev->next/, 17],
    [/^groupPrev->next = kth/, 18],
    [/^groupPrev = start/, 19],
    [/^不足 k 个/, 8]
  ];

  E[138] = [
    [/^if \(!head\) return nullptr/, 4],
    [/^mp = \{\}/, 5],
    [/^mp\[.*\] = new Node/, 6],
    [/^第二趟：p = /, 7],
    [/->next = mp\[/, 8],
    [/->random = mp\[/, 9],
    [/^return mp\[head\]/, 11]
  ];

  E[148] = [
    [/^if \(!head \|\| !head->next/, 4],
    [/^slow = head, fast = head->next/, 5],
    [/^while \(fast && fast->next\) →/, 6],
    [/^slow → /, 7],
    [/^fast → /, 8],
    [/^mid = slow->next/, 10],
    [/^slow->next = nullptr/, 11],
    [/^return merge\(sortList/, 12],
    [/^merge：dummy/, 16],
    [/^if \(a->val <= b->val\)/, 18],
    [/^return dummy.next/, 23]
  ];

  E[23] = [
    [/^cmp：小顶堆/, 4],
    [/^priority_queue 声明/, 5],
    [/^把每条链表的头入堆/, 6],
    [/^dummy, tail = &dummy/, 7],
    [/^while \(!pq.empty\(\)\)/, 8],
    [/^node = pq.top/, 9],
    [/^tail->next = /, 10],
    [/^tail = node/, 11],
    [/^该链表的 next 入堆/, 12],
    [/^return dummy.next/, 14]
  ];

  E[146] = [
    [/^LRUCache\(capacity\)/, 6],
    [/^get\(/, 9],
    [/→ 未命中，return -1/, 10],
    [/^splice 到头部/, 11],
    [/^return \d+$/, 12],
    [/^put\(/, 16],
    [/^已存在 → 更新 value/, 18],
    [/^不存在/, 17],
    [/^size == cap → 淘汰尾部/, 22],
    [/^emplace_front/, 26],
    [/^mp\[key\] = lst.begin\(\)/, 27]
  ];
})();
