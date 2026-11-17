/* 应用主控 */
;(function () {
  const $ = s => document.querySelector(s);
  const el = (tag, cls, html) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  };

  let state = { view: "learn", n: 1, filter: "all", q: "", mood: "idle" };
  let currentViz = null;
  let currentKeyHandler = null;

  /* ---------------- 基础 UI ---------------- */
  const UI = {
    toast(msg) {
      const t = el("div", "toast", ICO("check") + "<span>" + msg + "</span>");
      $("#toastWrap").appendChild(t);
      setTimeout(() => {
        t.style.transition = "opacity .3s, transform .3s";
        t.style.opacity = "0";
        t.style.transform = "translateY(10px)";
        setTimeout(() => t.remove(), 320);
      }, 1800);
    },

    go(n) {
      state.view = "learn";
      state.n = n;
      location.hash = "#/learn/" + n;
      STORE.ui({ view: "learn", n });
    },

    view(v) {
      if (v === "learn") return this.go(state.n || 1);
      location.hash = "#/" + v;
    },

    mood(m) {
      state.mood = m;
      renderMascot(m);
      if (m === "cheer") setTimeout(() => { state.mood = "happy"; renderMascot("happy"); }, 3200);
      else if (m === "happy") setTimeout(() => { state.mood = "idle"; renderMascot("idle"); }, 3800);
    },

    cheer() { this.mood("cheer"); },

    refreshList() { renderSidebar(); },

    refreshAll(opts) {
      const o = opts || {};
      renderSidebar();
      renderRail();
      renderTop();
      if (o.main !== false) route(true);
    }
  };
  window.UI = UI;

  /* ---------------- 顶栏 / HUD ---------------- */
  let hudLast = -1;
  function updateHUD() {
    const box = document.getElementById("hud");
    if (!box) return;
    const pos = state.view === "learn" ? H1.idxOf(state.n) + 1 : 0;
    const now = document.getElementById("hudNow");
    const bar = document.getElementById("hudBar");
    if (pos > 0) {
      now.textContent = String(pos).padStart(3, "0");
      bar.style.width = pos + "%";
      box.style.opacity = "1";
    } else {
      now.textContent = "---";
      bar.style.width = "0%";
      box.style.opacity = ".4";
    }
    if (pos !== hudLast) {
      box.classList.remove("tick");
      void box.offsetWidth;
      box.classList.add("tick");
      hudLast = pos;
    }
  }

  function renderTop() {
    $("#streakNum").textContent = STORE.streak();
    document.querySelectorAll(".tabs button").forEach(b => {
      b.classList.toggle("on", b.dataset.view === state.view);
    });
    updateHUD();
  }

  /* ---------------- 侧栏 ---------------- */
  function statusIcon(it) {
    if (it.seen === 0) return '<span style="color:#39465f">' + ICO("circleDot") + "</span>";
    if (it.status === "mastered") return '<span style="color:#3ee6a8">' + ICO("check") + "</span>";
    if (it.status === "known") return '<span style="color:#4fd1e8">' + ICO("half") + "</span>";
    return '<span style="color:#ffc45c">' + ICO("half") + "</span>";
  }

  function match(p) {
    if (state.filter === "due") { if (!STORE.isDue(p.n)) return false; }
    else if (state.filter === "wrong") { if (STORE.get(p.n).wrong === 0) return false; }
    else if (state.filter !== "all") { if (p.d !== state.filter) return false; }
    const q = state.q.trim().toLowerCase();
    if (!q) return true;
    return (p.n + " " + p.t + " " + (p.en || "") + " " + p.cat + " " + p.tags.join(" ")).toLowerCase().indexOf(q) >= 0;
  }

  function renderSidebar() {
    const pr = STORE.progress();
    const list = $("#list");
    const closed = sidebarClosed;

    let html = "";
    let shown = 0;
    H1.grouped.forEach(g => {
      const items = g.items.filter(match);
      if (!items.length) return;
      shown += items.length;
      const doneN = g.items.filter(p => STORE.get(p.n).seen > 0).length;
      html += '<div class="grp ' + (closed[g.name] ? "closed" : "") + '" data-grp="' + g.name + '">' +
        '<div class="grp-head"><span class="g-dot"></span><span class="g-name">' + g.name + "</span>" +
        '<span class="g-count">' + doneN + "/" + g.items.length + "</span>" +
        '<span class="g-caret">' + ICO("chevron") + "</span></div>" +
        '<div class="grp-body">' + items.map(p => {
          const it = STORE.get(p.n);
          return '<div class="row ' + (state.view === "learn" && p.n === state.n ? "on" : "") + '" data-n="' + p.n + '">' +
            '<span class="r-n">' + p.n + "</span>" +
            '<span class="r-t">' + p.t + "</span>" +
            (it.fav ? '<span class="r-fav">★</span>' : "") +
            '<span class="r-d ' + p.d + '"></span>' +
            '<span class="r-st">' + statusIcon(it) + "</span>" +
            "</div>";
        }).join("") + "</div></div>";
    });
    if (!shown) html = '<div class="empty">没有匹配的题目<br>换个关键词或筛选项</div>';
    list.innerHTML = html;

    list.querySelectorAll(".row").forEach(r => {
      r.addEventListener("click", () => UI.go(+r.dataset.n));
    });
    list.querySelectorAll(".grp-head").forEach(h => {
      h.addEventListener("click", () => {
        const g = h.parentElement;
        g.classList.toggle("closed");
        sidebarClosed[g.dataset.grp] = g.classList.contains("closed");
      });
    });

    // 进度环
    const pct = Math.round((pr.done / pr.total) * 100);
    const r = 18, c = 2 * Math.PI * r;
    $("#spRing").innerHTML =
      '<svg viewBox="0 0 46 46"><circle cx="23" cy="23" r="' + r + '" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="4"/>' +
      '<circle cx="23" cy="23" r="' + r + '" fill="none" stroke="url(#gRing)" stroke-width="4" stroke-linecap="round" ' +
      'stroke-dasharray="' + c + '" stroke-dashoffset="' + (c * (1 - pct / 100)) + '"/></svg>' +
      '<div class="val">' + pct + "%</div>";
    $("#spDone").textContent = pr.done;
    $("#spMeta").textContent = pr.mastered + " 已掌握 · " + pr.due + " 待复习";

    document.querySelectorAll("#diffChips .chip").forEach(ch => {
      ch.classList.toggle("on", ch.dataset.diff === state.filter);
    });
  }

  let sidebarClosed = {};
  let lastActiveN = 0;

  /* 切题时只改选中态，不重建 100 行 DOM */
  function markActive(scroll) {
    const list = $("#list");
    let target = null;
    list.querySelectorAll(".row").forEach(r => {
      const on = state.view === "learn" && +r.dataset.n === state.n;
      r.classList.toggle("on", on);
      if (on) target = r;
    });
    if (target && scroll && state.n !== lastActiveN) {
      const lr = list.getBoundingClientRect();
      const tr = target.getBoundingClientRect();
      if (tr.top < lr.top || tr.bottom > lr.bottom) {
        list.scrollTop += (tr.top - lr.top) - lr.height / 2 + tr.height / 2;
      }
    }
    lastActiveN = state.n;
  }

  /* ---------------- 吉祥物 ---------------- */
  let mascotMood = "";
  function renderMascot(mood) {
    const m = mood || state.mood || "idle";
    if (m === mascotMood) return;
    mascotMood = m;
    const card = $("#mascotCard");
    if (!card) return;
    card.innerHTML =
      '<div class="mm-row">' +
        '<div class="mm-face"><img src="assets/whale-girl-face.png" alt=""></div>' +
        '<div class="mm-txt"><b>小码酱 · DSH 鲸</b>' +
          "<span>" + MASCOT.line(m, {}) + "</span></div>" +
      "</div>";

    card.addEventListener("click", () => {
      const t = card.querySelector(".mm-txt span");
      if (t) t.innerHTML = MASCOT.line(m, {});
    });
  }

  /* ---------------- 右栏 ---------------- */
  let railSig = "";
  function renderRail(force) {
    const pr = STORE.progress();
    const today = STORE.todayCount();
    const heat = STORE.heat(14);
    const sig = [pr.due, pr.done, pr.mastered, pr.wrong, today, STORE.streak(),
                 heat.map(h => h.count).join(".")].join("|");
    if (!force && sig === railSig) return;
    railSig = sig;
    const maxH = Math.max.apply(null, heat.map(h => h.count).concat([1]));

    $("#railToday").innerHTML =
      "<h4>" + ICO("target") + "今日</h4>" +
      '<div class="today-stats">' +
        '<div class="ts c1"><b>' + today + "</b><span>复习次数</span></div>" +
        '<div class="ts c2"><b>' + pr.due + "</b><span>待复习</span></div>" +
        '<div class="ts c3"><b>' + pr.mastered + "</b><span>已掌握</span></div>" +
      "</div>" +
      '<button class="rail-btn" data-act="review">' + ICO("repeat") + "开始今日复习 · " + Math.max(pr.due, 0) + "</button>" +
      '<div class="next-up" data-reco></div>';

    const reco = recommend();
    $("#railToday").querySelector("[data-reco]").innerHTML = reco.map(x =>
      '<div class="nu" data-n="' + x.p.n + '"><span class="nu-n">' + x.p.n + "</span>" +
      '<span class="nu-t">' + x.p.t + '</span><span class="nu-c">' + x.why + "</span></div>").join("");

    $("#railToday").querySelectorAll(".nu").forEach(nu => nu.onclick = () => UI.go(+nu.dataset.n));
    $("#railToday").querySelector('[data-act="review"]').onclick = () => UI.view("review");

    $("#railHeat").innerHTML =
      "<h4>" + ICO("flame") + "复习热力 · 14 天</h4>" +
      '<div class="heat">' + heat.map(h => {
        const lv = h.count === 0 ? 0 : Math.min(4, Math.ceil((h.count / maxH) * 4));
        return '<i data-l="' + lv + '" title="' + h.date + " · " + h.count + ' 次"></i>';
      }).join("") + "</div>" +
      '<div class="heat-legend"><span>14 天前</span><span>今天</span></div>' +
      '<div style="margin-top:13px;font-size:11.5px;color:#5d6b8a;line-height:1.8">' +
        "连续 " + STORE.streak() + " 天 · 累计复习 " + (STORE.raw().meta.reviews || 0) + " 次" +
      "</div>";
  }

  function recommend() {
    const out = [];
    const used = {};
    const push = (p, why) => {
      if (!p || used[p.n] || out.length >= 3) return;
      used[p.n] = 1;
      out.push({ p, why });
    };
    const due = H1.all.filter(p => STORE.isDue(p.n));
    const wrong = H1.all.filter(p => STORE.get(p.n).wrong > 0 && STORE.get(p.n).status !== "mastered");
    const weak = H1.all.filter(p => { const it = STORE.get(p.n); return it.seen > 0 && it.status === "learning"; });
    const fresh = H1.all.filter(p => STORE.get(p.n).seen === 0);
    push(due[0], "到期");
    push(wrong.find(p => p.n !== (due[0] || {}).n), "错题");
    push(weak.find(p => p.n !== (wrong[0] || {}).n), "薄弱");
    push(fresh[0], "新题");
    push(fresh[1], "新题");
    return out;
  }

  /* ---------------- 路由 ---------------- */
  function route(force) {
    const raw = location.hash.replace(/^#\/?/, "");
    const parts = raw.split("/").filter(Boolean);
    const main = $("#stage");

    if (!parts.length) {
      state.view = "learn";
      state.n = STORE.getUI().n || 1;
    } else if (parts[0] === "learn") {
      state.view = "learn";
      state.n = +parts[1] || state.n || 1;
    } else {
      state.view = parts[0];
    }
    if (!H1.get(state.n)) state.n = 1;

    document.querySelectorAll(".tabs button").forEach(b => b.classList.toggle("on", b.dataset.view === state.view));
    currentViz = null;
    currentKeyHandler = null;
    main.scrollTop = 0;

    if (state.view === "learn") {
      const p = H1.get(state.n);
      document.title = p.t + " · Hot 100 通关舱";
      const ret = window.VIEWS.learn(state.n, main) || {};
      currentViz = ret.viz || null;
      STORE.ui({ view: "learn", n: state.n });
    } else if (state.view === "review") {
      document.title = "今日复习 · Hot 100";
      const ret = window.VIEWS.review(main) || {};
      currentKeyHandler = ret.onKey;
    } else if (state.view === "drill") {
      document.title = "随机抽考 · Hot 100";
      window.VIEWS.drill(main);
    } else if (state.view === "stats") {
      document.title = "学习看板 · Hot 100";
      window.VIEWS.stats(main);
    }
    markActive(true);
    renderTop();
    renderRail();
    renderMascot(state.mood);
  }


  /* ---------------- 题目弹窗 ---------------- */
  function openProblem(p, input) {
    const mask = $("#pmask");
    $("#pmNo").textContent = "No." + p.n;
    $("#pmTitle").textContent = p.t;
    $("#pmDiff").textContent = H1.diffLabel[p.d] || p.d;
    $("#pmDiff").className = "tag diff-" + p.d;
    $("#pmLink").href = "https://leetcode.cn/problems/" +
      (p.en || p.t).toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") + "/";

    const esc = HL.esc;
    let html = "";
    if (input) html += "<h4>输入示例</h4><pre>" + esc(input) + "</pre>";
    html += "<h4>一句话本质</h4><p>" + p.gist + "</p>";
    html += "<h4>需要做到</h4><ol>" + p.keys.map(k => "<li><b>" + k[0] + "</b> — " + k[1] + "</li>").join("") + "</ol>";
    html += "<h4>边界 / 坑</h4><p>" + p.trap + "</p>";
    html += "<h4>复杂度</h4><p>时间 <code>" + p.cx[0] + "</code> · 空间 <code>" + p.cx[1] + "</code> · 分类 " + p.cat + "</p>";
    $("#pmBody").innerHTML = html;
    mask.hidden = false;
  }
  function closeProblem() { $("#pmask").hidden = true; }

  UI.problem = openProblem;

  /* ---------------- 命令面板 ---------------- */
  let palIdx = 0, palItems = [];

  function paletteItems(q) {
    const items = [];
    const qq = q.trim().toLowerCase();
    const cmds = [
      { k: "▶ 今日复习", t: "review", d: "按间隔重复队列过一遍", act: () => UI.view("review") },
      { k: "▶ 随机抽考", t: "drill", d: "闭卷回忆几道题", act: () => UI.view("drill") },
      { k: "▶ 学习看板", t: "stats", d: "进度 / 错题 / 热力", act: () => UI.view("stats") },
      { k: "▶ 下一道待学", t: "next", d: "跳到第一道没学过的题", act: () => {
          const p = H1.all.find(x => STORE.get(x.n).seen === 0) || H1.all[0];
          UI.go(p.n);
        } }
    ];
    cmds.filter(c => !qq || (c.k + c.t).toLowerCase().indexOf(qq) >= 0).forEach(c => {
      items.push({ label: c.k, sub: c.d, run: c.act });
    });
    H1.all.filter(p => !qq || (p.n + " " + p.t + " " + (p.en || "") + " " + p.cat).toLowerCase().indexOf(qq) >= 0)
      .slice(0, 40).forEach(p => {
        items.push({ label: p.n + " · " + p.t, sub: p.cat + " / " + (H1.diffLabel[p.d] || ""), run: () => UI.go(p.n) });
      });
    return items;
  }

  function openPalette() {
    const box = $("#palette");
    box.hidden = false;
    const inp = $("#paletteInput");
    inp.value = "";
    palIdx = 0;
    renderPaletteList("");
    setTimeout(() => inp.focus(), 30);
  }
  function closePalette() { $("#palette").hidden = true; }

  function renderPaletteList(q) {
    palItems = paletteItems(q);
    const box = $("#paletteList");
    box.innerHTML = palItems.map((it, i) =>
      '<div class="p-row ' + (i === palIdx ? "on" : "") + '" data-i="' + i + '">' +
        '<span class="p-t">' + it.label + "</span>" +
        '<span class="p-k">' + it.sub + "</span></div>").join("") ||
      '<div class="empty">没有结果</div>';
    box.querySelectorAll(".p-row").forEach(r => {
      r.addEventListener("click", () => { palItems[+r.dataset.i].run(); closePalette(); });
    });
  }

  /* ---------------- 事件绑定 ---------------- */
  function bind() {
    $("#tabs").addEventListener("click", e => {
      const b = e.target.closest("button[data-view]");
      if (b) UI.view(b.dataset.view);
    });

    $("#search").addEventListener("input", e => {
      state.q = e.target.value;
      renderSidebar();
    });

    $("#diffChips").addEventListener("click", e => {
      const c = e.target.closest(".chip");
      if (!c) return;
      state.filter = c.dataset.diff;
      renderSidebar();
    });

    $("#btnReset").addEventListener("click", () => {
      if (confirm("清空全部学习进度？")) {
        STORE.reset();
        UI.refreshAll();
        UI.toast("已重置");
      }
    });

    // 折叠题库
    function applyFold(hidden) {
      document.querySelector(".layout").classList.toggle("side-hidden", hidden);
      const b = $("#btnFold");
      if (b) b.textContent = hidden ? "☰" : "☰";
      if (window.__fitCode) setTimeout(window.__fitCode, 60);
    }
    function applyFoldR(hidden) {
      document.querySelector(".layout").classList.toggle("rail-hidden", hidden);
      if (window.__fitCode) setTimeout(window.__fitCode, 60);
    }
    const ui0 = STORE.getUI();
    applyFold(!!ui0.sideHidden);
    applyFoldR(!!ui0.railHidden);
    $("#btnFoldR").addEventListener("click", () => {
      const hidden = document.querySelector(".layout").classList.toggle("rail-hidden");
      STORE.ui({ railHidden: hidden });
      setTimeout(() => { if (window.__fitCode) window.__fitCode(); }, 80);
      UI.toast(hidden ? "右栏已隐藏" : "右栏已显示");
    });
    $("#btnFold").addEventListener("click", () => {
      const hidden = document.querySelector(".layout").classList.toggle("side-hidden");
      STORE.ui({ sideHidden: hidden });
      setTimeout(() => { if (window.__fitCode) window.__fitCode(); }, 80);
      UI.toast(hidden ? "题库已隐藏，代码区放大" : "题库已显示");
    });

    $("#pmask").addEventListener("click", e => { if (e.target.id === "pmask") closeProblem(); });
    $("#pmClose").addEventListener("click", closeProblem);

    $("#btnPalette").addEventListener("click", openPalette);
    $("#palette").addEventListener("click", e => { if (e.target.id === "palette") closePalette(); });
    $("#paletteInput").addEventListener("input", e => { palIdx = 0; renderPaletteList(e.target.value); });
    $("#paletteInput").addEventListener("keydown", e => {
      if (e.key === "ArrowDown") { e.preventDefault(); palIdx = Math.min(palItems.length - 1, palIdx + 1); renderPaletteList(e.target.value); }
      else if (e.key === "ArrowUp") { e.preventDefault(); palIdx = Math.max(0, palIdx - 1); renderPaletteList(e.target.value); }
      else if (e.key === "Enter") {
        const it = palItems[palIdx];
        if (it) { it.run(); closePalette(); }
      } else if (e.key === "Escape") closePalette();
    });

    document.addEventListener("keydown", e => {
      const typing = /input|textarea/i.test((document.activeElement || {}).tagName || "");

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        $("#palette").hidden ? openPalette() : closePalette();
        return;
      }
      if (e.key === "Escape") {
        if (!$("#pmask").hidden) { closeProblem(); return; }
        if (!$("#palette").hidden) closePalette();
        else if (typing) document.activeElement.blur();
        return;
      }
      if (typing) return;

      if (e.key === "/") { e.preventDefault(); $("#search").focus(); return; }
      if (e.key === "[") { e.preventDefault(); $("#btnFold").click(); return; }
      if (e.key === "]") { e.preventDefault(); $("#btnFoldR").click(); return; }

      if (state.view === "learn") {
        if (e.key === "ArrowRight") { e.preventDefault(); UI.go(H1.next(state.n).n); }
        if (e.key === "ArrowLeft") { e.preventDefault(); UI.go(H1.prev(state.n).n); }
        if (e.code === "Space") {
          e.preventDefault();
          if (currentViz) currentViz.play();
        }
        if (e.key.toLowerCase() === "d") {
          const b = document.querySelector('[data-act="blank"]');
          if (b) b.click();
        }
        if (e.key.toLowerCase() === "l") {
          const cur = document.querySelector("[data-lang].on");
          const target = cur && cur.dataset.lang === "cpp"
            ? document.querySelector('[data-lang="py"]')
            : document.querySelector('[data-lang="cpp"]');
          if (target) target.click();
        }
      } else if (state.view === "review") {
        if (e.code === "Space") { e.preventDefault(); currentKeyHandler && currentKeyHandler(e); }
      }
    });

    window.addEventListener("hashchange", () => route());
  }

  /* ---------------- 启动 ---------------- */
  function boot() {
    paintIcons(document);
    window.addEventListener("error", ev => {
      console.warn("runtime error:", ev.message);
    });

    const ui = STORE.getUI();
    state.n = ui.n || 1;

    const bm = $("#brandMascot");
    if (bm) bm.innerHTML = MASCOT.miniWhale();

    const bgw = $("#bgWhale");
    if (bgw) bgw.style.backgroundImage = "url(assets/tide-ambient.webp)";

    renderSidebar();
    renderRail();
    renderTop();
    renderMascot("idle");
    bind();

    if (!location.hash) location.hash = "#/learn/" + state.n;
    else route();

    // 首次进入的引导
    const pr = STORE.progress();
    if (pr.done === 0) {
      setTimeout(() => UI.toast("从「一句话本质」开始，别急着看代码"), 700);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
