/* 视图：今日复习（卡片翻转 + 自评） */
;(function () {
  window.VIEWS = window.VIEWS || {};

  VIEWS.review = function (host) {
    const { due, fresh } = STORE.dueList();
    const queue = due.map(x => x.p);
    const pr = STORE.progress();
    let idx = 0, flipped = false, graded = 0;

    function render() {
      if (!queue.length && !fresh.length) {
        host.innerHTML =
          '<div class="view-pad">' +
          '<div class="view-title"><h2>今日复习</h2><span>队列是空的</span></div>' +
          '<section class="panel panel-pad">' +
            '<div class="empty" style="padding:50px 20px;line-height:2.2">' +
              "今天没有到期的题目。<br>要么去学几道新的，要么用「抽考」随机巩固。" +
            "</div>" +
            '<div style="display:flex;gap:10px;justify-content:center;margin-top:8px">' +
              '<button class="btn-pill primary" data-act="goLearn">' + ICO("book") + "去学新题</button>" +
              '<button class="btn-pill" data-act="goDrill">' + ICO("dice") + "随机抽考</button>" +
            "</div>" +
          "</section></div>";
        host.querySelector('[data-act="goLearn"]').onclick = () => {
          const nextNew = H1.all.find(p => STORE.get(p.n).seen === 0) || H1.all[0];
          UI.go(nextNew.n);
        };
        host.querySelector('[data-act="goDrill"]').onclick = () => UI.view("drill");
        return;
      }

      if (idx >= queue.length) {
        host.innerHTML =
          '<div class="view-pad">' +
          '<div class="view-title"><h2>本轮完成</h2><span>复习了 ' + graded + " 道</span></div>" +
          '<section class="panel panel-pad">' +
            '<div class="empty" style="padding:44px 20px;font-size:14px;line-height:2.1">' +
              "这一轮的到期题都过完了。<br>明天它们会按新的间隔重新出现。" +
            "</div>" +
            '<div style="display:flex;gap:10px;justify-content:center">' +
              '<button class="btn-pill primary" data-act="again">' + ICO("repeat") + "再刷一遍</button>" +
              '<button class="btn-pill" data-act="goLearn">' + ICO("book") + "去学新题</button>" +
            "</div>" +
          "</section></div>";
        host.querySelector('[data-act="again"]').onclick = () => { idx = 0; graded = 0; flipped = false; render(); };
        host.querySelector('[data-act="goLearn"]').onclick = () => {
          const nextNew = H1.all.find(p => STORE.get(p.n).seen === 0) || H1.all[0];
          UI.go(nextNew.n);
        };
        return;
      }

      const p = queue[idx];
      host.innerHTML =
        '<div class="view-pad">' +
          '<div class="view-title"><h2>今日复习</h2>' +
            '<span>' + due.length + " 道到期 · 已过 " + idx + " 道</span>" +
            '<span class="spacer"></span>' +
            '<span class="tag cx">连续 ' + STORE.streak() + " 天</span>" +
          "</div>" +
          '<div class="flash-wrap">' +
            '<div class="flash" data-act="flip">' +
              '<div class="flash-inner">' +
                '<div class="flash-face">' +
                  '<div class="fk-cat">' + p.cat + " · " + (H1.diffLabel[p.d] || "") + "</div>" +
                  "<h3>" + p.t + "</h3>" +
                  '<div class="fk-en">' + (p.en || "") + "</div>" +
                  '<div class="fk-hint">先在脑子里过一遍：<br>本质是什么？关键不变量是什么？边界在哪？</div>' +
                  '<div class="fk-flip">点一下 / 空格 翻面</div>' +
                "</div>" +
                '<div class="flash-face back">' +
                  '<div class="fk-cat">参考答案</div>' +
                  '<div class="fk-gist">' + p.gist + "</div>" +
                  '<ul class="fk-keys">' + p.keys.map((k, i) =>
                    "<li><i>0" + (i + 1) + "</i><span><b>" + k[0] + "</b> — " + k[1] + "</span></li>").join("") +
                  "</ul>" +
                  '<div class="fk-meta"><span class="tag cx">' + p.cx[0] + "</span>" +
                    '<span class="tag cx">' + p.cx[1] + "</span>" +
                    (window.TRACE.has(p.n) ? '<span class="tag">可视化已就绪</span>' : "") +
                  "</div>" +
                "</div>" +
              "</div>" +
            "</div>" +
            '<div class="grade-row" style="' + (flipped ? "" : "opacity:.4;pointer-events:none") + '">' +
              '<button class="g-btn" data-g="0"><b>忘了</b><span>重来</span></button>' +
              '<button class="g-btn" data-g="1"><b>勉强</b><span>短间隔</span></button>' +
              '<button class="g-btn" data-g="2"><b>记得</b><span>正常</span></button>' +
              '<button class="g-btn" data-g="3"><b>很熟</b><span>拉长</span></button>' +
            "</div>" +
            '<div style="font-size:11.5px;color:#4b5875;margin-top:2px">' +
              "间隔：" + (STORE.get(p.n).interval ? (STORE.get(p.n).interval < 1 ? "10 分钟" : Math.round(STORE.get(p.n).interval) + " 天") : "首次") +
            "</div>" +
          "</div>" +
        "</div>";

      const flash = host.querySelector(".flash");
      const doFlip = () => {
        flipped = !flipped;
        flash.classList.toggle("flipped", flipped);
        const row = host.querySelector(".grade-row");
        row.style.opacity = flipped ? 1 : ".4";
        row.style.pointerEvents = flipped ? "auto" : "none";
      };
      flash.addEventListener("click", doFlip);

      host.querySelectorAll(".g-btn").forEach(b => {
        b.addEventListener("click", () => {
          STORE.update(p.n, +b.dataset.g);
          graded++;
          idx++;
          flipped = false;
          UI.mood(+b.dataset.g >= 2 ? "happy" : "think");
          UI.refreshAll();
          render();
        });
      });

      host._flip = doFlip;
    }

    render();
    return { onKey: e => { if (e.code === "Space") { e.preventDefault(); host._flip && host._flip(); } } };
  };
})();
