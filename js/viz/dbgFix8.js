/* dbgFix8 — 160 相交链表：正确模拟「走完切到另一条链」 */
;(function () {
  window.DBG[160] = p => {
    const S = [];
    const A = ["4", "1", "8", "4", "5"];           // 链表 A
    const B = ["5", "6", "1", "8", "4", "5"];      // 链表 B，B[3] 与 A[2] 是同一个节点 8
    const NODE = { "A2": 8, "B3": 8 };             // 交点（同一个节点）
    const F = (l, n, extra) => S.push(Object.assign({ line: l, note: n }, extra || {}));

    /* 位置用 (哪条链, 下标) 表示；走完就切到另一条链的头 */
    function step(pos) {
      const [list, i] = pos;
      const arr = list === "A" ? A : B;
      if (i + 1 < arr.length) return [list, i + 1];
      return [list === "A" ? "B" : "A", 0];
    }
    function val(pos) {
      const [list, i] = pos;
      return (list === "A" ? A : B)[i];
    }
    function idOf(pos) {
      const [list, i] = pos;
      return (list === "A" && i === 2) || (list === "B" && i === 3) ? "交点8" : list + i;
    }
    function view(pos) {
      const [list, i] = pos;
      const arr = list === "A" ? A : B;
      return {
        list: arr.slice(),
        listPtr: { [i]: "a/b" },
        listHi: [i],
        vars: {
          a: val(pos) + "（" + list + "[" + i + "]）",
          链表A: A.join("→"),
          链表B: B.join("→"),
          步数: global_step
        }
      };
    }

    let global_step = 0;
    let a = ["A", 0], b = ["B", 0];

    F(4, "a = headA, b = headB", Object.assign(view(a), { vars: { a: "4（A[0]）", b: "5（B[0]）", 链表A: A.join("→"), 链表B: B.join("→"), 步数: 0 } }));

    for (let k = 0; k < 10; k++) {
      F(5, `while (a != b) → a=${val(a)}（${a[0]}[${a[1]}]），b=${val(b)}（${b[0]}[${b[1]}])`, Object.assign(view(a), {
        vars: { a: val(a) + "（" + a[0] + "[" + a[1] + "]）", b: val(b) + "（" + b[0] + "[" + b[1] + "]）", 链表A: A.join("→"), 链表B: B.join("→"), 步数: global_step }
      }));
      if (idOf(a) === idOf(b)) {
        F(9, `a == b → 交点 ${val(a)}，return a`, Object.assign(view(a), {
          vars: { 交点: val(a), 步数: global_step, 答案: val(a) }
        }));
        return S;
      }
      a = step(a);
      F(6, `a = a->next → ${val(a)}（${a[0]}[${a[1]}]）` + (a[0] === "B" && a[1] === 0 ? "　← A 走完了，切到 B 头" : ""), Object.assign(view(a), {
        vars: { a: val(a) + "（" + a[0] + "[" + a[1] + "]）", b: val(b) + "（" + b[0] + "[" + b[1] + "]）", 步数: global_step }
      }));
      b = step(b);
      F(7, `b = b->next → ${val(b)}（${b[0]}[${b[1]}]）` + (b[0] === "A" && b[1] === 0 ? "　← B 走完了，切到 A 头" : ""), Object.assign(view(a), {
        vars: { a: val(a) + "（" + a[0] + "[" + a[1] + "]）", b: val(b) + "（" + b[0] + "[" + b[1] + "]）", 步数: global_step }
      }));
      global_step++;
    }
    F(9, "两条链都走完 → 不相交，return null", { list: A.slice(), vars: { 答案: "null" } });
    return S;
  };
})();

/* ------------------------------------------------ 备用解法（第二套答案）：
   437 路径总和 III 的前缀和版本 O(n)，选 C++(2) 时切到这套 trace。 */
;(function () {
  window.DBG2 = window.DBG2 || {};
  const cp = o => JSON.parse(JSON.stringify(o));

  window.DBG2[437] = p => {
    const tree = p.viz.tree, target = p.viz.target != null ? p.viz.target : 8;
    const S = [], cs = [];
    const prefix = { 0: 1 };
    const F = (line, note, extra) =>
      S.push(Object.assign({ line, note, callstack: cp(cs), map: cp(prefix) }, extra || {}));
    const at = i => (i < tree.length && tree[i] != null ? tree[i] : null);
    const name = i => (at(i) === null ? "null" : String(tree[i]));
    const H = arr => ({ treeHi: arr, treePath: arr });
    const pathOf = arr => arr.map(x => tree[x]).join("→");
    const uniq = arr => { const o = []; arr.forEach(m => m.forEach(x => { if (o.indexOf(x) < 0) o.push(x); })); return o; };

    const chain = [];   // 根→当前 路径上的 { i, ps }

    cs.push({ fn: "pathSum", args: "root," + target, res: null });
    F(25, "prefix[0] = 1　（空前缀和记 1 次，代表「一个都不选」）", Object.assign({ tree }, H([0])));
    F(26, `return dfs(root, 0, ${target}) ← 进入递归`, Object.assign({ tree }, H([0])));

    function dfs(i, curr) {
      cs.push({ fn: "dfs", args: `${name(i)},${curr}`, res: null });
      F(6, `dfs(${name(i)}, curr=${curr})：空？`, Object.assign({ tree }, H(at(i) === null ? [] : [i])));
      if (at(i) === null) {
        F(7, "空 → return 0", { tree, vars: { 返回: 0 } });
        cs.pop();
        return 0;
      }
      F(10, "int ret = 0", Object.assign({ tree, vars: { ret: 0 } }, H([i])));

      const nc = curr + tree[i];
      const here = chain.map(e => e.i).concat([i]);
      F(11, `curr += ${tree[i]} → ${nc}　（${pathOf(here)} 的前缀和）`,
        Object.assign({ tree, vars: { curr: nc, ret: 0 } }, H(here)));

      const want = nc - target;
      const hit = prefix[want] || 0;

      /* 命中段还原：祖先前缀和等于 want 的那个节点，它下面一段到当前就是答案 */
      const matched = [];
      if (want === 0) matched.push(here.slice());
      chain.forEach((e, k) => {
        if (e.ps === want) matched.push(chain.slice(k + 1).map(x => x.i).concat([i]));
      });

      F(12, `prefix.count(${nc} - ${target}) = prefix.count(${want}) → ${hit} 个祖先前缀和等于 ${want}`,
        Object.assign({ tree, vars: { curr: nc, 要找: want, ret: 0 } },
          { mapHi: [String(want)] }, H(hit ? uniq(matched) : [i])));

      let ret = 0;
      if (hit) {
        ret = hit;
        F(13, `ret = prefix[${want}] = ${hit}　命中 ${matched.map(pathOf).join("；")}`,
          Object.assign({ tree, vars: { curr: nc, 要找: want, ret: hit } },
            { mapHi: [String(want)] }, H(uniq(matched))));
      }

      prefix[nc] = (prefix[nc] || 0) + 1;
      F(16, `prefix[${nc}]++ → ${prefix[nc]}　（本层前缀和记进表）`,
        Object.assign({ tree, vars: { curr: nc, ret: ret } }, H(here)));

      chain.push({ i, ps: nc });

      const L = dfs(2 * i + 1, nc);
      ret += L;
      F(17, `ret += dfs(左) ${L} → ${ret}`,
        Object.assign({ tree, vars: { curr: nc, ret: ret } }, H(here)));

      const R = dfs(2 * i + 2, nc);
      ret += R;
      F(18, `ret += dfs(右) ${R} → ${ret}`,
        Object.assign({ tree, vars: { curr: nc, ret: ret } }, H(here)));

      chain.pop();

      prefix[nc] -= 1;
      F(19, `prefix[${nc}]-- → ${prefix[nc]}　（回溯，撤销本层）`,
        Object.assign({ tree, vars: { curr: nc, ret: ret } }, H(here)));

      cs[cs.length - 1].res = ret;
      F(21, `return ${ret}`, Object.assign({ tree, vars: { 返回: ret } }, H(here)));
      cs.pop();
      return ret;
    }

    const ans = dfs(0, 0);
    F(26, `pathSum 拿到 dfs 返回 ${ans} → return ${ans}`, { tree, vars: { 答案: ans } });
    return S;
  };
})();

/* ------------------------------------------------ 备用演示：
   236 最近公共祖先的第二个样例 p=7, q=8（同一棵树，换一对查询点）。 */
;(function () {
  window.DBG2 = window.DBG2 || {};
  const cp = o => JSON.parse(JSON.stringify(o));

  window.DBG2[236] = p => {
    const tree = p.viz.tree;
    const PV = (p.viz2 && p.viz2.p != null) ? p.viz2.p : 7;
    const QV = (p.viz2 && p.viz2.q != null) ? p.viz2.q : 8;
    const S = [], cs = [];
    const F = (line, note, extra) =>
      S.push(Object.assign({ line, note, callstack: cp(cs) }, extra || {}));
    const at = i => (i < tree.length && tree[i] != null ? tree[i] : null);
    const nm = i => (at(i) === null ? "null" : String(tree[i]));
    const H = arr => ({ treeHi: arr, treePath: arr });

    F(4, `入口 lowestCommonAncestor(root, p=${PV}, q=${QV})`, Object.assign({ tree }, H([0])));

    function go(i) {
      cs.push({ fn: "LCA", args: nm(i) });
      F(4, `▶ 进入 LCA(${nm(i)})：空？或者就是 p / q？`,
        Object.assign({ tree }, H(at(i) === null ? [] : [i])));
      if (at(i) === null) {
        F(4, "空 → return null", { tree, vars: { 返回: "null" } });
        cs.pop();
        return null;
      }
      if (tree[i] === PV || tree[i] === QV) {
        F(4, `${tree[i]} 就是 ${tree[i] === PV ? "p" : "q"} → 直接 return ${tree[i]}`,
          Object.assign({ tree, vars: { 返回: tree[i] } }, H([i])));
        cs.pop();
        return i;
      }
      const l = go(2 * i + 1);
      F(5, `左子树返回 ${l == null ? "null" : tree[l]}`,
        Object.assign({ tree }, H(l == null ? [] : [l])));
      const r = go(2 * i + 2);
      F(6, `右子树返回 ${r == null ? "null" : tree[r]}`,
        Object.assign({ tree }, H(r == null ? [] : [r])));
      if (l != null && r != null) {
        F(7, `左边找到 ${tree[l]}、右边找到 ${tree[r]} → 当前节点 ${tree[i]} 就是分叉点，return ${tree[i]}`,
          Object.assign({ tree, vars: { 返回: tree[i] } }, H([i])));
        cs.pop();
        return i;
      }
      const res = l != null ? l : r;
      F(8, `只有一边找到 → 把这个结果往上抛：return ${res == null ? "null" : tree[res]}`,
        Object.assign({ tree, vars: { 返回: res == null ? "null" : tree[res] } },
          H(res == null ? [] : [res])));
      cs.pop();
      return res;
    }

    const res = go(0);
    F(7, `LCA(${PV}, ${QV}) = ${res == null ? "null" : tree[res]}`,
      Object.assign({ tree, vars: { 答案: res == null ? "null" : tree[res] } },
        H(res == null ? [] : [res])));
    return S;
  };
})();
