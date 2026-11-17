/* 轻量代码高亮 + 挖空练习 */
;(function () {
  const KEY = new Set(("def class return if elif else for while in not and or is None True False " +
    "lambda import from as with try except finally raise break continue pass yield global nonlocal " +
    "assert del async await self " +
    "public private protected void int float bool String function var let const " +
    "static final null true false switch case default do throw package this super " +
    "extends implements interface struct go func chan defer select range map type " +
    "auto nullptr new delete using namespace template typename inline operator friend explicit " +
    "unsigned signed long short char double sizeof").split(/\s+/));

  const BUILTIN = new Set(("len range list dict set str int tuple sum max min enumerate zip sorted " +
    "print abs any all reversed Counter defaultdict deque heapq bisect_left bisect_right float divmod " +
    "ListNode TreeNode Optional List Dict " +
    "vector unordered_map unordered_set map set stack queue deque priority_queue pair string " +
    "size_t uint64_t int64_t accumulate lower_bound upper_bound sort reverse swap fill " +
    "greater less push_back emplace_front pop_back substr INT_MAX INT_MIN LONG_MIN LONG_MAX " +
    "isalpha isdigit to_string").split(/\s+/));

  const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const span = (c, s) => '<span class="' + c + '">' + esc(s) + "</span>";

  function hl(code) {
    let out = "", i = 0;
    const n = code.length;
    while (i < n) {
      const ch = code[i];
      // 注释
      if (ch === "#" || (ch === "/" && code[i + 1] === "/")) {
        let j = code.indexOf("\n", i);
        if (j < 0) j = n;
        out += span("c", code.slice(i, j));
        i = j;
        continue;
      }
      // 字符串
      if (ch === '"' || ch === "'") {
        const q = ch;
        const triple = code.slice(i, i + 3) === q + q + q;
        let j = i + (triple ? 3 : 1);
        while (j < n) {
          if (code[j] === "\\") { j += 2; continue; }
          if (triple && code.slice(j, j + 3) === q + q + q) { j += 3; break; }
          if (!triple && code[j] === q) { j++; break; }
          if (!triple && code[j] === "\n") break;
          j++;
        }
        out += span("s", code.slice(i, j));
        i = j;
        continue;
      }
      // 数字
      if (ch >= "0" && ch <= "9") {
        let j = i;
        while (j < n && /[0-9a-fA-FxX._]/.test(code[j])) j++;
        out += span("n", code.slice(i, j));
        i = j;
        continue;
      }
      // 标识符
      if (/[A-Za-z_$\u4e00-\u9fa5]/.test(ch)) {
        let j = i;
        while (j < n && /[A-Za-z0-9_$\u4e00-\u9fa5]/.test(code[j])) j++;
        const w = code.slice(i, j);
        if (KEY.has(w)) out += span("k", w);
        else if (BUILTIN.has(w)) out += span("b", w);
        else if (code[j] === "(") out += span("f", w);
        else out += esc(w);
        i = j;
        continue;
      }
      out += esc(ch);
      i++;
    }
    return out;
  }

  /* ---------- 挖空 ----------
   * spec：该题的关键考点列表
   *   - 纯标识符  → 按词边界匹配，四处出现全部挖掉（防止答案在别处泄漏）
   *   - 其它字符串 → 当整段表达式，按字面量匹配
   * 返回 [{start, end, ans}]，区间互不重叠
   */
  const isWord = s => /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(s);
  const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  function maskOf(code, spec, used0, hits0) {
    const used = used0 || new Array(code.length).fill(false);
    const hits = hits0 || [];
    const take = (start, end, ans) => {
      if (start < 0 || end > code.length || start >= end) return;
      for (let k = start; k < end; k++) if (used[k]) return;
      for (let k = start; k < end; k++) used[k] = true;
      hits.push({ start, end, ans });
    };

    // 先处理表达式（长优先），再处理标识符，避免短语被单词切碎
    spec.filter(s => !isWord(s))
      .sort((a, b) => b.length - a.length)
      .forEach(ph => {
        let idx = code.indexOf(ph);
        while (idx >= 0) { take(idx, idx + ph.length, ph); idx = code.indexOf(ph, idx + 1); }
      });

    spec.filter(isWord).forEach(w => {
      const re = new RegExp("\\b" + escRe(w) + "\\b", "g");
      let m;
      while ((m = re.exec(code))) take(m.index, m.index + w.length, w);
    });

    return { used, hits };
  }

  /* 补足：规格在当前语言里命中太少时（多半是切到了 Python），另挑几个标识符
   * 只挑出现 ≤4 次的（区分度高、不会重复到烦），也不挑框架名 */
  const NOISE = new Set(["self", "Solution", "init", "nums", "size", "string", "vector",
    "return", "nullptr", "true", "false", "this", "List", "range", "len"]);

  function topUpSpec(code, used, hits, target) {
    const re = /[A-Za-z_][A-Za-z0-9_]{2,}/g;
    const freq = {};
    let m;
    while ((m = re.exec(code))) {
      const w = m[0];
      if (used[m.index]) continue;
      if (KEY.has(w) || BUILTIN.has(w) || NOISE.has(w)) continue;
      if (hits.some(h => h.ans === w)) continue;
      freq[w] = (freq[w] || 0) + 1;
    }
    const list = Object.keys(freq)
      .filter(w => freq[w] >= 1 && freq[w] <= 4)
      .sort((a, b) => {
        if (b.length !== a.length) return b.length - a.length;
        return freq[a] - freq[b];
      });

    const picked = [];
    let total = hits.length;
    for (const w of list) {
      if (total >= target) break;
      if (total + freq[w] > 12) continue;
      picked.push(w);
      total += freq[w];
    }
    return picked;
  }

  /* 把关键考点挖成 input，答案 = 原文片段 */
  // 占位符必须用高亮器不会分词的字符（不能是数字/字母），否则索引会被包进 span
  const MK_OPEN = "\uE000";
  const MK_UNIT = "\uE001";
  const mk = i => MK_OPEN + MK_UNIT.repeat(i + 1) + MK_OPEN;
  const MAX_PER_ANSWER = 6;   // 同一个答案最多挖几次，再多就整组放弃（宁可全露也不机械化）
  const MAX_TOTAL = 12;

  function blankify(code, pn) {
    const spec = (window.BLANK && window.BLANK[pn]) || [];
    let { used, hits } = maskOf(code, spec);

    // 单个答案重复过多的，整组去掉 —— 全部露出也不泄漏（因为一处都不挖）
    const tally = {};
    hits.forEach(h => { tally[h.ans] = (tally[h.ans] || 0) + 1; });
    const heavy = new Set(Object.keys(tally).filter(a => tally[a] > MAX_PER_ANSWER));
    if (heavy.size) {
      hits = hits.filter(h => !heavy.has(h.ans));
      used = new Array(code.length).fill(false);
      hits.forEach(h => { for (let k = h.start; k < h.end; k++) used[k] = true; });
    }

    // 规格没命中或太少 → 自动补足到 8 个左右
    if (hits.length < 5) {
      const extra = topUpSpec(code, used, hits, 8);
      if (extra.length) ({ used, hits } = maskOf(code, extra, used, hits));
    }

    if (hits.length > MAX_TOTAL) {
      hits = hits.slice(0, MAX_TOTAL);
      // 截断后若某个答案只剩一部分出现，会泄漏 → 整组去掉
      const t2 = {};
      hits.forEach(h => { t2[h.ans] = (t2[h.ans] || 0) + 1; });
      const total2 = {};
      code.replace(/[A-Za-z_$][A-Za-z0-9_$]*/g, w => { total2[w] = (total2[w] || 0) + 1; return w; });
      const partial = new Set(Object.keys(t2).filter(a => t2[a] < (total2[a] || 0)));
      if (partial.size) hits = hits.filter(h => !partial.has(h.ans));
    }

    hits.sort((a, b) => a.start - b.start);
    if (!hits.length) return { html: hl(code), answers: [] };

    // 先把挖空处替换成不可见的占位符，整体高亮后再换成 input，
    // 这样字符串/注释里的挖空不会破坏语法着色
    let masked = "", cursor = 0;
    hits.forEach((h, i) => {
      masked += code.slice(cursor, h.start) + mk(i);
      cursor = h.end;
    });
    masked += code.slice(cursor);

    const inputs = hits.map(h =>
      '<input class="blank" data-ans="' + esc(h.ans) + '" size="' + Math.max(4, h.ans.length) +
      '" spellcheck="false" autocomplete="off" aria-label="填空">'
    );
    const html = hl(masked).replace(/\uE000(\uE001+)\uE000/g, (_, g) => inputs[g.length - 1]);
    return { html, answers: hits.map(h => h.ans), hits };
  }

  window.HL = {
    hl, blankify, esc,
    /* 逐行高亮，供「代码行 ↔ 可视化」联动使用 */
    lines(code) {
      return code.split("\n").map(l => ({
        html: l.trim() ? hl(l) : "&nbsp;",
        text: l,
        indent: l.length - l.replace(/^\s+/, "").length
      }));
    }
  };
})();
