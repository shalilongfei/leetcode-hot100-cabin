/* 视图：学习页（代码 ⇄ 可视化 联动） */
;(function () {
  window.VIEWS = window.VIEWS || {};

  const STOP = new Set(("the and for max min len step nums num true false null none " +
    "class return vector string self new else while auto if int long bool void const " +
    "size type data node root left right head next val key value").split(/\s+/));

  function diffTag(d) {
    return '<span class="tag diff-' + d + '">' + (H1.diffLabel[d] || d) + "</span>";
  }

  function keysHTML(p) {
    return p.keys.map(k =>
      '<div class="key"><div class="k-idx"></div><div class="k-body"><b>' + k[0] +
      "</b><span>" + k[1] + "</span></div></div>").join("");
  }

  function slugOf(p) {
    return (p.en || p.t).toLowerCase()
      .replace(/['’]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function codeOf(p, lang) {
    if (lang === "cpp2") return p.cpp2 || p.cpp || p.tmpl;
    return lang === "cpp" ? (p.cpp || p.tmpl) : p.tmpl;
  }


  /* ---------- 题目自带结构体（力扣提交时已给出，这里补全便于本地阅读） ---------- */
  const STRUCTS = {
    list: `struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};`,
    node: `class Node {
public:
    int val;
    Node* next;
    Node* random;
    Node(int _val) : val(_val), next(NULL), random(NULL) {}
};`,
    tree: `struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};`,
    lru: `struct Node {
    int key, val;
    Node *prev, *next;
    Node(int k = 0, int v = 0) : key(k), val(v), prev(nullptr), next(nullptr) {}
};`,
    trie: `struct Node {
    Node* child[26] = {nullptr};
    bool isEnd = false;
};`
  };

  function structKeyOf(p) {
    if (p.n === 138) return "node";
    if (p.n === 146) return "lru";
    if (p.n === 208) return "trie";
    const tags = (p.tags || []).join(" ");
    if (p.viz && p.viz.k === "tree") return "tree";
    if (p.viz && p.viz.k === "list") return "list";
    if (/链表/.test(tags) && !/二叉树/.test(tags)) return "list";
    if (/二叉树|二叉搜索树/.test(tags)) return "tree";
    if (/深度优先搜索|广度优先搜索/.test(tags) && /树/.test(tags)) return "tree";
    return null;
  }

  /* ---------- 可视化输入说明 ---------- */
  function inputOf(p) {
    const v = p.viz || {};
    const fmt = a => "[" + a.map(x => (typeof x === "string" && !/^[[(]/.test(x) ? JSON.stringify(x) : String(x))).join(", ") + "]";
    if (v.k === "bars") return "heights = " + fmt(v.arr);
    if (v.k === "grid") {
      const rows = v.grid.map(r => "  [" + r.map(x => typeof x === "string" ? JSON.stringify(x) : String(x)).join(",") + "]");
      return "grid = [\n" + rows.join(",\n") + "\n]" + (v.target != null ? "\ntarget = " + (typeof v.target === "string" ? JSON.stringify(v.target) : v.target) : "");
    }
    if (v.k === "tree") {
      let out = "root = [" + v.tree.map(x => x === null ? "null" : x).join(", ") + "]  （层序，null 表示空）";
      if (v.target != null) out += "\ntarget = " + (typeof v.target === "string" ? JSON.stringify(v.target) : v.target);
      return out;
    }
    if (v.k === "list") return "链表 = " + v.arr.join(" → ");
    if (v.k === "dp") return "输入见题面；下面是 DP 表：" + v.dp.length + " 格";
    if (v.arr) {
      let out = "nums = " + fmt(v.arr);
      if (v.target != null) out += "\ntarget = " + (typeof v.target === "string" ? JSON.stringify(v.target) : v.target);
      if (v.win != null) out += "\nk = " + (typeof v.win === "number" ? v.win : JSON.stringify(v.win));
      if (v.shift != null) out += "\nk = " + v.shift;
      return out;
    }
    return "";
  }

  /* ---------- 帧 → 代码行 映射 ---------- */
  function tokensOf(note) {
    const plain = String(note || "").replace(/<[^>]+>/g, " ");
    const ids = plain.match(/[A-Za-z_][A-Za-z0-9_]{1,}/g) || [];
    const out = [];
    ids.forEach((w, i) => {
      if (STOP.has(w.toLowerCase()) || w.length < 2) return;
      if (out.some(t => t.w === w)) return;
      out.push({ w, weight: Math.max(0.35, 1 - i * 0.07) });
    });
    return out;
  }

  /* 中文动作词 → 代码形态 */
  const PATTERNS = [
    { re: /累加|累计|结算|加起来|加上/, pat: /\+=|ans\s*[+\-=]/ },
    { re: /移动|右移|左移|收缩|前进|退|跳|滑动/, pat: /\+\+|--|\+=|-=|\+\s*1|-\s*1/ },
    { re: /命中|找到|相等|匹配到|得到|收集|记录/, pat: /return|push|append|push_back|\[.*\]\s*=/ },
    { re: /命中|找到/, pat: /return/ },
    { re: /更新|刷新/, pat: /=\s*max|=\s*min|=\s*/ },
    { re: /返回|结束|完成|答案/, pat: /return/ },
    { re: /初始化|初始|开始|起点|哨兵/, pat: /=\s*(0|1|\{\}|\[|\{\d|nullptr|None|null|-1)/ }
  ];

  const DECL = /^\s*(int|auto|const|vector|string|bool|long|char|double|size_t|ListNode|TreeNode|unordered_map|unordered_set|priority_queue|stack|queue|deque|set|map|pair|list)\b/;

  function bestLine(note, codeLines) {
    const toks = tokensOf(note);
    const plain = String(note || "").replace(/<[^>]+>/g, " ");
    let pat = null;
    for (const p of PATTERNS) if (p.re.test(plain)) { pat = p.pat; break; }
    if (!toks.length && !pat) return -1;

    let best = -1, bestScore = 0;
    codeLines.forEach((raw, idx) => {
      const code = raw.replace(/\/\/.*$/, "").replace(/#.*$/, "");
      if (!code.trim()) return;
      const trimmed = code.trim();
      const head = (trimmed.match(/^[A-Za-z_][A-Za-z0-9_]*/) || [""])[0];

      let score = 0;
      let matched = 0;
      toks.forEach(t => {
        if (matched >= 3) return;
        const pos = code.indexOf(t.w);
        if (pos < 0) return;
        matched++;
        let w = t.weight * (t.w.length >= 4 ? 1.7 : 1);
        if (head === t.w) w *= 2.2;
        else if (new RegExp("\\b" + t.w + "\\s*(\\+=|-=|=|\\+\\+|--)").test(code)) w *= 1.6;
        score += w;
      });

      if (pat && pat.test(code)) score += 2.6;
      if (DECL.test(code)) score *= 0.5;         // 声明行降权，避免「一行包含所有变量」抢分

      if (score > bestScore + 1e-6) { bestScore = score; best = idx + 1; }
    });
    return bestScore >= 1.1 ? best : -1;
  }

  function buildLineMap(steps, codeLines) {
    let last = 1;
    return steps.map(f => {
      const ln = f.line != null ? f.line : bestLine(f.note, codeLines);
      if (ln > 0) {
        if (ln >= last) { last = ln; return ln; }
        if (last - ln <= 6) { last = ln; return ln; }   // 允许小幅回退（循环）
        return last;
      }
      return last;
    });
  }

  VIEWS.learn = function (n, host) {
    const p = H1.get(n);
    if (!p) return;
    const it = STORE.get(n);
    const uiState = STORE.getUI();
    let lang = (uiState.lang === "py" || uiState.lang === "cpp2") ? uiState.lang : "cpp";
    if (lang === "cpp2" && !p.cpp2) lang = "cpp";
    let blankMode = false;
    let lineMap = [];
    let viz = null;
    let vizVariant = 0;
    /* 演示样例：同一份代码、换一组输入数据（p.viz2 存在时才有第二档） */
    let demoIdx = 0;
    const variantOf = () =>
      ((p.cpp2 && lang === "cpp2") || (p.viz2 && demoIdx === 1)) ? 2 : 0;

    const pos = H1.idxOf(n) + 1;
    const slug = slugOf(p);
    const lc = "https://leetcode.cn/problems/" + slug + "/";
    const sol = lc + "solutions/";
    const stars = "★".repeat(p.freq) + "☆".repeat(Math.max(0, 5 - p.freq));

    host.innerHTML =
      '<div class="stage-inner">' +

      '<section class="panel hero hero-xl">' +
        '<div class="hero-visual">' +
          '<img class="hero-bg" src="assets/tide-bg.webp" alt="" draggable="false">' +
          '<img class="hero-girl" src="assets/whale-girl.webp" alt="" draggable="false">' +
        "</div>" +
        '<div class="hero-main">' +
          '<div class="hero-kicker">SECTION <b>' + String(pos).padStart(2, "0") +
            '</b> <i>/</i> ' + p.cat + "</div>" +
          "<h1>" + p.t + "</h1>" +
          '<div class="en">' + (p.en || "") + "</div>" +
          '<div class="meta-row">' +
            diffTag(p.d) +
            '<span class="tag cx">' + p.cx[0] + "</span>" +
            '<span class="tag cx">' + p.cx[1] + "</span>" +
            '<span class="tag freq">热度 ' + stars + "</span>" +
            (STORE.isDue(n) ? '<span class="tag diff-hard">今天该复习</span>' : "") +
          "</div>" +
          '<div class="hero-tags">' + p.tags.slice(0, 5).map(t => '<span class="tag">' + t + "</span>").join("") + "</div>" +
        "</div>" +
        '<div class="hero-actions">' +
          '<button class="icon-btn" data-act="prev" title="上一题 ←">' + ICO("left") + "</button>" +
          '<button class="icon-btn" data-act="next" title="下一题 →">' + ICO("right") + "</button>" +
          '<button class="icon-btn ' + (it.fav ? "act" : "") + '" data-act="fav" title="收藏">' + ICO("star") + "</button>" +
        "</div>" +
        '<div class="hero-no">No.' + p.n + "</div>" +
      "</section>" +

      '<section class="panel panel-pad">' +
        '<div class="sec-label"><span>一句话本质</span><span class="line"></span>' +
          '<span class="badge">先记这个</span></div>' +
        '<div class="gist"><div class="g-quote">“</div><p>' + p.gist + "</p>" +
          '<div class="g-hint">' + ICO("lightbulb") + " 复习时只看这一段，能复述出来就算过</div></div>" +
      "</section>" +

      '<section class="panel panel-pad">' +
        '<div class="sec-label"><span>思路解剖</span><span class="line"></span>' +
          '<span class="badge">' + p.keys.length + " 步</span></div>" +
        '<div class="keys">' + keysHTML(p) + "</div>" +
      "</section>" +

      /* ---- 代码 ⇄ 可视化 ---- */
      '<section class="panel spliter">' +
        '<div class="split-head">' +
          '<div class="lang-switch">' +
            '<button data-lang="cpp" class="' + (lang === "cpp" ? "on" : "") + '">C++</button>' +
            (p.cpp2
              ? '<button data-lang="cpp2" class="' + (lang === "cpp2" ? "on" : "") +
                '" title="' + (p.variant2Label || "第二套解法") + '">C++(2)</button>'
              : "") +
            '<button data-lang="py" class="' + (lang === "py" ? "on" : "") + '">Python3</button>' +
          "</div>" +
          (p.viz2
            ? '<div class="lang-switch demo-switch">' +
              '<button data-demo="0" class="' + (demoIdx === 0 ? "on" : "") + '">' +
                (p.demoLabels ? p.demoLabels[0] : "示例 1") + "</button>" +
              '<button data-demo="1" class="' + (demoIdx === 1 ? "on" : "") + '">' +
                (p.demoLabels ? p.demoLabels[1] : "示例 2") + "</button>" +
              "</div>"
            : "") +
          '<span class="split-hint">' + ICO("link") + " 点代码行 → 跳到对应步骤</span>" +
          '<div class="split-tools">' +
            '<button class="mini-btn" data-act="problem" title="查看题目要求">' + ICO("book") + "题目</button>" +
            '<a class="mini-btn" href="' + lc + '" target="_blank" rel="noreferrer" title="去力扣做这道题">' + ICO("link") + "力扣</a>" +
            '<a class="mini-btn" href="' + sol + '" target="_blank" rel="noreferrer" title="看官方 / 高赞题解">' + ICO("book2") + "题解</a>" +
            '<button class="mini-btn" data-act="blank">' + ICO("brain") + "挖空</button>" +
            '<button class="mini-btn" data-act="copy">' + ICO("copy") + "复制</button>" +
          "</div>" +
        "</div>" +
        '<div class="split-body">' +
          '<div class="code-col">' +
            '<div class="struct-host" id="structHost"></div>' +
            '<div class="code-pane" id="codePane"></div>' +
          "</div>" +
          '<div class="viz-pane">' +
            '<div class="viz-input" id="vizInput"></div>' +
            '<div id="vizHost" class="viz-host"></div>' +
            '<div class="viz-note compact" id="vizNote">' +
              '<div class="vn-avatar">' + MASCOT.miniWhale() + "</div>" +
              "<div><p></p><div class=\"vn-step\"></div></div>" +
            "</div>" +
            '<div class="viz-ctrl compact" id="vizCtrl">' +
              '<button class="btn-pill primary" data-v="play">' + ICO("play") + "<span>播放</span></button>" +
              '<button class="btn-pill" data-v="prev">' + ICO("stepB") + "</button>" +
              '<button class="btn-pill" data-v="next">' + ICO("stepF") + "</button>" +
              '<button class="btn-pill" data-v="reset">' + ICO("reset") + "</button>" +
              '<div class="spacer"></div>' +
              '<span class="stepnum">1 / 1</span>' +
              '<input type="range" class="seek" min="0" max="0" value="0" step="1">' +
              '<button class="btn-pill" data-v="speed">1x</button>' +
            "</div>" +
          "</div>" +
        "</div>" +
      "</section>" +

      '<section class="panel panel-pad">' +
        '<div class="trap"><div class="t-ico">' + ICO("warn") + "</div>" +
          '<div class="t-txt"><b>最容易踩的坑</b><p>' + p.trap + "</p></div></div>" +
      "</section>" +

      '<section class="panel panel-pad">' +
        '<div class="sec-label"><span>自评 · 决定下次复习时间</span><span class="line"></span>' +
          '<span class="badge">已复习 ' + it.seen + " 次</span></div>" +
        '<div class="grade">' +
          '<button class="g-btn" data-g="0"><b>完全不会</b><span>10 分钟后</span></button>' +
          '<button class="g-btn" data-g="1"><b>想了很久</b><span>明天</span></button>' +
          '<button class="g-btn" data-g="2"><b>顺利写出</b><span>按间隔推进</span></button>' +
          '<button class="g-btn" data-g="3"><b>秒了</b><span>拉长间隔</span></button>' +
        "</div>" +
        '<textarea id="noteBox" class="note-box" placeholder="记一句自己的话：卡在哪、和哪道题像…">' +
          (it.note || "") + "</textarea>" +
      "</section>" +

      "</div>";

    const codePane = host.querySelector("#codePane");
    const structHost = host.querySelector("#structHost");
    const vizInput = host.querySelector("#vizInput");
    const vizHost = host.querySelector("#vizHost");
    const vizNote = host.querySelector("#vizNote");
    const vizCtrl = host.querySelector("#vizCtrl");
    const noteP = vizNote.querySelector("p");
    const noteStep = vizNote.querySelector(".vn-step");
    const seek = vizCtrl.querySelector(".seek");
    const stepNum = vizCtrl.querySelector(".stepnum");
    const btnPlay = vizCtrl.querySelector('[data-v="play"]');
    const btnSpeed = vizCtrl.querySelector('[data-v="speed"]');

    /* ---- 结构体 ---- */
    (function paintStruct() {
      const key = structKeyOf(p);
      if (!key || lang !== "cpp") { structHost.innerHTML = ""; return; }
      structHost.innerHTML = '<details class="struct-block" open><summary>题目已给出的结构体（提交时无需重复定义）</summary>' +
        "<pre>" + HL.esc(STRUCTS[key]) + "</pre></details>";
    })();

    /* ---- 输入说明 ---- */
    (function paintInput() {
      const txt = inputOf(p);
      vizInput.innerHTML = txt ? "<b>输入</b><span>" + HL.esc(txt) + "</span>" : "";
      vizInput.style.display = txt ? "" : "none";
    })();

    /* ---- 可视化 ---- */
    function paintNote(f) {
      noteP.innerHTML = f.note || "";
      noteStep.textContent = "step " + ((viz ? viz.index : 0) + 1) + " / " + (viz ? viz.steps.length : 1);
    }

    function highlight(line) {
      codePane.querySelectorAll(".cl.cur").forEach(e => e.classList.remove("cur"));
      if (blankMode || !line) return;
      const el = codePane.querySelector('.cl[data-l="' + line + '"]');
      if (!el) return;
      el.classList.add("cur");
      const paneRect = codePane.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      if (r.top < paneRect.top || r.bottom > paneRect.bottom) {
        codePane.scrollTop += (r.top - paneRect.top) - codePane.clientHeight / 2 + r.height / 2;
      }
    }

    function setPlayBtn(playing) {
      btnPlay.innerHTML = playing ? ICO("pause") + "<span>暂停</span>" : ICO("play") + "<span>播放</span>";
      btnPlay.classList.toggle("primary", !playing);
    }

    /* 可视化挂载：第二套解法有自己的 trace，切换语言时要重挂 */
    function mountViz(variant) {
      vizVariant = variant || 0;
      if (viz) { try { viz.stop(); } catch (e) {} }
      vizHost.innerHTML = "";
      viz = VIZ.mount(vizHost, p, {
        compact: true,
        variant: vizVariant,
        onFrame(f, i, total) {
          highlight(lineMap[i]);
          paintNote(f);
          seek.max = String(Math.max(0, total - 1));
          seek.value = i;
          seek.style.setProperty("--p", (i / Math.max(1, total - 1)) * 100 + "%");
          stepNum.textContent = (i + 1) + " / " + total;
        },
        onState(playing) { setPlayBtn(playing); }
      });
      if (viz) {
        vizCtrl.style.display = "";
        vizNote.style.display = "";
        setPlayBtn(false);
      }
    }
    mountViz(variantOf());

    /* ---- 代码字号自适应（跟容器宽度走） ---- */
    let lastLines = [];
    function fitCode(texts) {
      if (texts) lastLines = texts;
      const maxLen = lastLines.reduce((m, t) => Math.max(m, t.length), 0) || 20;
      const avail = Math.max(160, codePane.clientWidth - 74);
      const size = Math.max(9.5, Math.min(15, avail / Math.max(12, maxLen * 0.612)));
      codePane.style.setProperty("--fs", size.toFixed(2) + "px");
    }
    window.__fitCode = () => fitCode(null);

    /* ---- 代码区 ---- */
    function paintCode() {
      if (blankMode) {
        const r = HL.blankify(codeOf(p, lang), p.n);
        codePane.innerHTML = '<pre class="code">' + r.html + "</pre>";
        const normal = s => s.replace(/\s+/g, "").toLowerCase();
        codePane.querySelectorAll(".blank").forEach(inp => {
          inp.addEventListener("keydown", ev => {
            if (ev.key !== "Enter") return;
            const ok = normal(inp.value) === normal(inp.dataset.ans);
            inp.classList.toggle("ok", ok);
            inp.classList.toggle("bad", !ok);
            if (!ok) { inp.value = ""; UI.toast("再想想 · 答案：" + inp.dataset.ans); return; }
            const all = [...codePane.querySelectorAll(".blank")];
            if (all.every(x => x.classList.contains("ok"))) {
              UI.toast("全部填对，手感不错 · " + all.length + " 处");
              UI.cheer();
            }
            else { const nx = all.find(x => !x.classList.contains("ok")); if (nx) nx.focus(); }
          });
        });
        const first = codePane.querySelector(".blank");
        if (first) first.focus();
        return;
      }

      const ls = HL.lines(codeOf(p, lang));
      fitCode(ls.map(l => l.text));
      codePane.innerHTML = ls.map((l, i) =>
        '<div class="cl" data-l="' + (i + 1) + '">' +
          '<span class="ln">' + (i + 1) + "</span>" +
          '<span class="cd">' + l.html + "</span>" +
        "</div>").join("");

      if (viz) {
        lineMap = viz.steps._lineMap && viz.steps._lineMap.length
          ? viz.steps._lineMap.slice()
          : buildLineMap(viz.steps, ls.map(l => l.text));
        viz.steps._lineMap = lineMap;
        // 标记「有动画」的行
        const hasFrame = {};
        lineMap.forEach(ln => { if (ln > 0) hasFrame[ln] = (hasFrame[ln] || 0) + 1; });
        codePane.querySelectorAll(".cl").forEach(el => {
          const c = hasFrame[+el.dataset.l];
          if (c) {
            el.classList.add("has-step");
            el.setAttribute("title", c + " 个可视化步骤落在此行");
          }
        });
        highlight(lineMap[viz.index] || -1);
      }
    }
    paintCode();

    /* 点击代码行 → 跳帧 */
    codePane.addEventListener("click", e => {
      if (blankMode || !viz) return;
      const cl = e.target.closest(".cl");
      if (!cl) return;
      const ln = +cl.dataset.l;
      const ok = viz.goLine(ln, lineMap);
      if (!ok) UI.toast("这一行是声明/收尾，没有对应的可视化步骤");
    });

    /* ---- 语言切换 ---- */
    host.querySelectorAll("[data-lang]").forEach(b => {
      b.addEventListener("click", () => {
        lang = b.dataset.lang;
        STORE.ui({ lang });
        host.querySelectorAll("[data-lang]").forEach(x => x.classList.toggle("on", x === b));
        const key = structKeyOf(p);
        structHost.innerHTML = (key && lang === "cpp")
          ? '<details class="struct-block" open><summary>题目已给出的结构体（提交时无需重复定义）</summary><pre>' +
            HL.esc(STRUCTS[key]) + "</pre></details>"
          : "";
        const wantVariant = variantOf();
        if (wantVariant !== vizVariant) mountViz(wantVariant);
        paintCode();
      });
    });

    /* ---- 演示样例切换（同一份代码、换一组输入） ---- */
    host.querySelectorAll("[data-demo]").forEach(b => {
      b.addEventListener("click", () => {
        demoIdx = +b.dataset.demo;
        host.querySelectorAll("[data-demo]").forEach(x => x.classList.toggle("on", x === b));
        const wantVariant = variantOf();
        if (wantVariant !== vizVariant) mountViz(wantVariant);
        paintCode();
      });
    });

    /* ---- 控制条 ---- */
    vizCtrl.addEventListener("click", e => {
      const b = e.target.closest("[data-v]");
      if (!b || !viz) return;
      const v = b.dataset.v;
      if (v === "play") viz.playing ? viz.stop() : viz.play();
      if (v === "prev") { viz.stop(); viz.go(viz.index - 1); }
      if (v === "next") { viz.stop(); viz.go(viz.index + 1); }
      if (v === "reset") { viz.stop(); viz.go(0); }
      if (v === "speed") { const s = viz.speedUp(); b.textContent = s + "x"; }
    });
    seek.addEventListener("input", () => { if (viz) { viz.stop(); viz.go(+seek.value); } });

    if (!viz) {
      vizHost.innerHTML = '<div class="empty">这题暂时没有可视化。</div>';
      vizCtrl.style.display = "none";
      vizNote.style.display = "none";
    } else {
      setPlayBtn(false);
    }

    /* ---- 其余事件 ---- */
    host.querySelector('[data-act="prev"]').addEventListener("click", () => UI.go(H1.prev(n).n));
    host.querySelector('[data-act="next"]').addEventListener("click", () => UI.go(H1.next(n).n));

    host.querySelector('[data-act="problem"]').addEventListener("click", () => {
      UI.problem(p, inputOf(p));
    });

    host.querySelector('[data-act="fav"]').addEventListener("click", e => {
      const on = STORE.toggleFav(n);
      e.currentTarget.classList.toggle("act", on);
      UI.toast(on ? "已收藏" : "已取消收藏");
      UI.refreshList();
    });

    host.querySelector('[data-act="copy"]').addEventListener("click", async () => {
      const text = codeOf(p, lang);
      try {
        await navigator.clipboard.writeText(text);
        UI.toast("已复制 " + (lang === "cpp2" ? "C++(2)" : lang === "cpp" ? "C++" : "Python3") + " 模板");
      } catch (err) {
        const ta = document.createElement("textarea");
        ta.value = text; document.body.appendChild(ta); ta.select();
        document.execCommand("copy"); ta.remove();
        UI.toast("已复制");
      }
    });

    host.querySelector('[data-act="blank"]').addEventListener("click", e => {
      blankMode = !blankMode;
      e.currentTarget.classList.toggle("on", blankMode);
      paintCode();
      if (viz) viz.stop();
      UI.toast(blankMode ? "在虚线框里填标识符，回车校验" : "已退出挖空");
    });

    host.querySelectorAll(".g-btn").forEach(b => {
      b.addEventListener("click", () => {
        const g = +b.dataset.g;
        STORE.update(n, g);
        UI.toast(g <= 1 ? "已记为薄弱，10 分钟后会再出现" : "进度已记录");
        UI.refreshAll({ main: false });
        if (g >= 2) {
          UI.mood(g === 3 ? "cheer" : "happy");
          setTimeout(() => UI.go(H1.next(n).n), 480);
        } else UI.mood("think");
      });
    });

    const nb = host.querySelector("#noteBox");
    nb.addEventListener("blur", () => { STORE.setNote(n, nb.value); if (nb.value.trim()) UI.toast("笔记已保存"); });

    const hint = document.createElement("div");
    hint.className = "kbd-hint";
    hint.innerHTML = "← → 切题 · 空格 播放 · D 挖空 · L 换语言 · 点代码行联动";
    host.querySelector(".stage-inner").appendChild(hint);

    return { viz };
  };
})();
