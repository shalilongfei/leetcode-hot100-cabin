/* 视图：随机抽考 */
;(function () {
  window.VIEWS = window.VIEWS || {};

  const SETUP = { scope: "all", count: 8 };

  function pool(scope) {
    const all = H1.all;
    if (scope === "all") return all.slice();
    if (scope === "weak") return all.filter(p => {
      const it = STORE.get(p.n);
      return it.seen > 0 && it.status !== "mastered";
    });
    if (scope === "wrong") return all.filter(p => STORE.get(p.n).wrong > 0);
    if (scope === "mastered") return all.filter(p => STORE.get(p.n).status === "mastered");
    return all.filter(p => p.cat === scope);
  }

  function shuffle(a) {
    const b = a.slice();
    for (let i = b.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = b[i]; b[i] = b[j]; b[j] = t;
    }
    return b;
  }

  VIEWS.drill = function (host, props) {
    let state = props || { phase: "setup" };

    /* ---------- 设置 ---------- */
    if (state.phase === "setup") {
      const cats = H1.CATS.map(c => {
        const cnt = H1.all.filter(p => p.cat === c).length;
        return '<button class="chip ' + (SETUP.scope === c ? "on" : "") + '" data-scope="' + c + '">' + c + " " + cnt + "</button>";
      }).join("");
      host.innerHTML =
        '<div class="view-pad">' +
          '<div class="view-title"><h2>随机抽考</h2><span>闭卷回忆，再对答案</span></div>' +
          '<section class="panel panel-pad">' +
            '<div class="sec-label"><span>范围</span><span class="line"></span></div>' +
            '<div class="chips" style="margin-bottom:16px">' +
              '<button class="chip ' + (SETUP.scope === "all" ? "on" : "") + '" data-scope="all">全部 100</button>' +
              '<button class="chip ' + (SETUP.scope === "weak" ? "on" : "") + '" data-scope="weak">未掌握</button>' +
              '<button class="chip ' + (SETUP.scope === "wrong" ? "on" : "") + '" data-scope="wrong">错题</button>' +
              '<button class="chip ' + (SETUP.scope === "mastered" ? "on" : "") + '" data-scope="mastered">已掌握</button>' +
            "</div>" +
            '<div class="chips">' + cats + "</div>" +
            '<div class="sec-label" style="margin-top:22px"><span>题量</span><span class="line"></span></div>' +
            '<div class="chips">' + [5, 8, 12, 20].map(k =>
              '<button class="chip ' + (SETUP.count === k ? "on" : "") + '" data-count="' + k + '">' + k + " 道</button>").join("") +
            "</div>" +
            '<div style="margin-top:24px;display:flex;gap:10px">' +
              '<button class="btn-pill primary" data-act="start">' + ICO("shuffle") + "开始抽考</button>" +
              '<button class="btn-pill" data-act="learnRandom">' + ICO("dice") + "随便学一道</button>" +
            "</div>" +
          "</section>" +
          '<section class="panel panel-pad">' +
            '<div class="sec-label"><span>怎么用这个模式</span><span class="line"></span></div>' +
            '<div class="keys">' +
              '<div class="key"><div class="k-idx"></div><div class="k-body"><b>先看题名，逼自己说出本质</b>' +
                '<span>卡住就说明那道题的「一句话」没记住，比写不出代码更值得返工。</span></div></div>' +
              '<div class="key"><div class="k-idx"></div><div class="k-body"><b>再展开对照三个点</b>' +
                '<span>本质 → 关键步骤 → 边界/坑。这三点能复述，代码只是打字问题。</span></div></div>' +
              '<div class="key"><div class="k-idx"></div><div class="k-body"><b>用自评推动间隔</b>' +
                '<span>「忘了」会 10 分钟后再出现，逼你当天补一遍，别让它掉队。</span></div></div>' +
            "</div>" +
          "</section>" +
        "</div>";

      host.querySelectorAll("[data-scope]").forEach(b => b.onclick = () => { SETUP.scope = b.dataset.scope; VIEWS.drill(host); });
      host.querySelectorAll("[data-count]").forEach(b => b.onclick = () => { SETUP.count = +b.dataset.count; VIEWS.drill(host); });
      host.querySelector('[data-act="start"]').onclick = () => {
        const p = shuffle(pool(SETUP.scope)).slice(0, SETUP.count);
        if (!p.length) { UI.toast("这个范围里没有题，换个范围试试"); return; }
        state = { phase: "run", list: p, i: 0, open: false, t0: Date.now(), marks: [] };
        VIEWS.drill(host, state);
      };
      host.querySelector('[data-act="learnRandom"]').onclick = () => {
        const p = H1.all[Math.floor(Math.random() * H1.all.length)];
        UI.go(p.n);
      };
      return;
    }

    /* ---------- 进行 ---------- */
    if (state.phase === "run") {
      const p = state.list[state.i];
      if (!p) { state.phase = "done"; return VIEWS.drill(host, state); }
      const it = STORE.get(p.n);
      const secs = Math.round((Date.now() - state.t0) / 1000);
      host.innerHTML =
        '<div class="view-pad">' +
          '<div class="view-title"><h2>第 ' + (state.i + 1) + " / " + state.list.length + " 道</h2>" +
            '<span>' + p.cat + " · " + (H1.diffLabel[p.d] || "") + "</span>" +
            '<span class="spacer"></span>' +
            '<span class="tag cx">用时 ' + secs + "s</span>" +
            '<span class="tag">' + (it.seen ? "复习过 " + it.seen + " 次" : "新题") + "</span>" +
          "</div>" +
          '<section class="panel hero">' +
            '<div class="hero-top"><div class="hero-idx">No.' + p.n + "</div>" +
              '<div class="hero-titles"><h1>' + p.t + "</h1><div class=\"en\">" + (p.en || "") + "</div></div>" +
              '<div class="hero-actions">' +
                '<button class="icon-btn" data-act="open" title="打开题目">' + ICO("link") + "</button>" +
              "</div>" +
            "</div>" +
          "</section>" +
          '<section class="panel panel-pad" data-answer style="' + (state.open ? "" : "display:none") + '">' +
            '<div class="sec-label"><span>参考答案</span><span class="line"></span></div>' +
            '<div class="gist"><div class="g-quote">“</div><p>' + p.gist + "</p></div>" +
            '<div class="keys" style="margin-top:14px">' + p.keys.map(k =>
              '<div class="key"><div class="k-idx"></div><div class="k-body"><b>' + k[0] + "</b><span>" + k[1] + "</span></div></div>").join("") +
            "</div>" +
            '<div class="trap" style="margin-top:14px"><div class="t-ico">' + ICO("warn") + "</div>" +
              '<div class="t-txt"><b>坑</b><p>' + p.trap + "</p></div></div>" +
            '<div style="display:flex;gap:8px;margin-top:16px">' +
              '<button class="mini-btn" data-act="tocode">' + ICO("book2") + "看完整模板</button>" +
              '<span class="tag cx">' + p.cx[0] + "</span><span class=\"tag cx\">" + p.cx[1] + "</span>" +
            "</div>" +
          "</section>" +
          '<section class="panel panel-pad">' +
            '<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">' +
              '<button class="btn-pill primary" data-act="reveal">' + ICO("eye") + (state.open ? "收起答案" : "看答案") + "</button>" +
              '<button class="btn-pill" data-act="skip">' + ICO("right") + "跳过</button>" +
              '<div class="spacer" style="flex:1"></div>' +
              '<button class="mini-btn" data-g="0">忘了</button>' +
              '<button class="mini-btn" data-g="1">勉强</button>' +
              '<button class="mini-btn" data-g="2">记得</button>' +
              '<button class="mini-btn" data-g="3">很熟</button>' +
            "</div>" +
          "</section>" +
        "</div>";

      host.querySelector('[data-act="open"]').onclick = () => UI.go(p.n);
      host.querySelector('[data-act="tocode"]').onclick = () => UI.go(p.n);
      host.querySelector('[data-act="reveal"]').onclick = () => { state.open = !state.open; VIEWS.drill(host, state); };
      host.querySelector('[data-act="skip"]').onclick = () => { state.i++; state.open = false; VIEWS.drill(host, state); };
      host.querySelectorAll("[data-g]").forEach(b => b.onclick = () => {
        const g = +b.dataset.g;
        STORE.update(p.n, g);
        state.marks.push(g);
        state.i++; state.open = false;
        UI.refreshAll();
        VIEWS.drill(host, state);
      });
      return;
    }

    /* ---------- 完成 ---------- */
    const total = Math.round((Date.now() - state.t0) / 1000);
    const good = state.marks.filter(g => g >= 2).length;
    host.innerHTML =
      '<div class="view-pad">' +
        '<div class="view-title"><h2>抽考结束</h2><span>把不会的题立刻带回学习页</span></div>' +
        '<section class="panel panel-pad">' +
          '<div class="today-stats" style="margin-bottom:18px">' +
            '<div class="ts c1"><b>' + state.list.length + '</b><span>题量</span></div>' +
            '<div class="ts c2"><b>' + total + 's</b><span>总用时</span></div>' +
            '<div class="ts c3"><b>' + good + '</b><span>记得</span></div>' +
          "</div>" +
          '<div class="drill-grid">' + state.list.map(p => {
            const g = state.marks[state.list.indexOf(p)];
            const c = g == null ? "#5d6b8a" : g >= 2 ? "#3ee6a8" : "#ff6b6b";
            return '<div class="dcard" data-n="' + p.n + '">' +
              '<div class="dc-n">No.' + p.n + "</div>" +
              '<div class="dc-t">' + p.t + "</div>" +
              '<div class="dc-s" style="color:' + c + '">' + (g == null ? "跳过" : g === 0 ? "忘了" : g === 1 ? "勉强" : g === 2 ? "记得" : "很熟") + "</div>" +
              '<div class="dc-bar" style="width:' + ((g == null ? 0 : (g + 1) / 4) * 100) + "%;background:" + c + '"></div>' +
            "</div>";
          }).join("") + "</div>" +
          '<div style="display:flex;gap:10px;margin-top:20px">' +
            '<button class="btn-pill primary" data-act="again">' + ICO("shuffle") + "再来一轮</button>" +
            '<button class="btn-pill" data-act="setup">' + ICO("reset") + "改设置</button>" +
          "</div>" +
        "</section>" +
      "</div>";
    host.querySelectorAll(".dcard").forEach(c => c.onclick = () => UI.go(+c.dataset.n));
    host.querySelector('[data-act="again"]').onclick = () => VIEWS.drill(host);
    host.querySelector('[data-act="setup"]').onclick = () => VIEWS.drill(host);
  };
})();
