/* 视图：数据看板 */
;(function () {
  window.VIEWS = window.VIEWS || {};

  function ring(pct, size, stroke, color) {
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const off = c * (1 - pct / 100);
    return '<svg viewBox="0 0 ' + size + " " + size + '">' +
      '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" ' +
        'stroke="rgba(255,255,255,.08)" stroke-width="' + stroke + '"/>' +
      '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" ' +
        'stroke="' + (color || "url(#gradRing)") + '" stroke-width="' + stroke + '" ' +
        'stroke-linecap="round" stroke-dasharray="' + c + '" stroke-dashoffset="' + off + '"/>' +
      "</svg>";
  }

  VIEWS.stats = function (host) {
    const pr = STORE.progress();
    const pct = Math.round((pr.done / pr.total) * 100);
    const masterPct = Math.round((pr.mastered / pr.total) * 100);
    const heat = STORE.heat(14);
    const maxHeat = Math.max.apply(null, heat.map(h => h.count).concat([1]));

    const catRows = H1.grouped.map(g => {
      const done = g.items.filter(p => STORE.get(p.n).seen > 0).length;
      const pctc = Math.round((done / g.items.length) * 100);
      return '<div class="cb"><div class="cb-n">' + g.name + "</div>" +
        '<div class="cb-t"><div class="cb-fill" style="width:' + pctc + '%"></div></div>' +
        '<div class="cb-v">' + done + "/" + g.items.length + "</div></div>";
    }).join("");

    const wrongList = H1.all
      .map(p => ({ p, it: STORE.get(p.n) }))
      .filter(x => x.it.wrong > 0)
      .sort((a, b) => b.it.wrong - a.it.wrong || b.it.seen - a.it.seen)
      .slice(0, 8);

    host.innerHTML =
      '<div class="view-pad">' +
        '<div class="view-title"><h2>学习看板</h2><span>数据只存在你自己的浏览器里</span></div>' +

        '<section class="panel panel-pad">' +
          '<div class="stat-big">' +
            '<div class="ring">' + ring(pct, 112, 9) +
              '<div class="rv"><b>' + pct + '%</b><span>已通关</span></div></div>' +
            '<div class="si">' +
              '<div><span class="sw" style="background:#4fd1e8"></span>已学 <b>' + pr.done + "</b> / " + pr.total + "</div>" +
              '<div><span class="sw" style="background:#3ee6a8"></span>已掌握 <b>' + pr.mastered + "</b>（" + masterPct + "%）</div>" +
              '<div><span class="sw" style="background:#ffc45c"></span>待复习 <b>' + pr.due + "</b></div>" +
              '<div><span class="sw" style="background:#ff6b6b"></span>错题 <b>' + pr.wrong + "</b> · 收藏 <b>" + pr.favs + "</b></div>" +
            "</div>" +
          "</div>" +
        "</section>" +

        '<div class="stats-grid">' +
          '<section class="panel panel-pad">' +
            '<div class="sec-label"><span>最近 14 天</span><span class="line"></span>' +
              '<span class="badge">今天 ' + (heat[heat.length - 1] || {}).count + " 次</span></div>" +
            '<div class="heat">' + heat.map(h => {
              const lv = h.count === 0 ? 0 : Math.min(4, Math.ceil((h.count / maxHeat) * 4));
              return '<i data-l="' + lv + '" title="' + h.date + " · " + h.count + ' 次"></i>';
            }).join("") + "</div>" +
            '<div class="heat-legend"><span>' + (heat[0] || {}).date + "</span><span>今天</span></div>" +
          "</section>" +

          '<section class="panel panel-pad">' +
            '<div class="sec-label"><span>难度分布</span><span class="line"></span></div>' +
            ["easy", "medium", "hard"].map(d => {
              const total = H1.all.filter(p => p.d === d).length;
              const done = H1.all.filter(p => p.d === d && STORE.get(p.n).seen > 0).length;
              const w = total ? Math.round((done / total) * 100) : 0;
              const col = d === "easy" ? "#3ee6a8" : d === "medium" ? "#ffc45c" : "#ff6f9c";
              return '<div class="cb"><div class="cb-n">' + H1.diffLabel[d] + "</div>" +
                '<div class="cb-t"><div class="cb-fill" style="width:' + w + "%;background:" + col + '"></div></div>' +
                '<div class="cb-v">' + done + "/" + total + "</div></div>";
            }).join("") +
          "</section>" +
        "</div>" +

        '<section class="panel panel-pad">' +
          '<div class="sec-label"><span>分类进度</span><span class="line"></span>' +
            '<span class="badge">按分类扫，比按题号扫快</span></div>' +
          '<div class="cat-bars">' + catRows + "</div>" +
        "</section>" +

        '<section class="panel panel-pad">' +
          '<div class="sec-label"><span>错题榜</span><span class="line"></span>' +
            '<span class="badge">' + (wrongList.length ? "点进去补一遍" : "还没有错题记录") + "</span></div>" +
          (wrongList.length
            ? '<div class="drill-grid">' + wrongList.map(x =>
                '<div class="dcard" data-n="' + x.p.n + '">' +
                  '<div class="dc-n">No.' + x.p.n + " · " + x.p.cat + "</div>" +
                  '<div class="dc-t">' + x.p.t + "</div>" +
                  '<div class="dc-s">错 ' + x.it.wrong + " 次 · 复习 " + x.it.seen + " 次</div>" +
                "</div>").join("") + "</div>"
            : '<div class="empty">去抽考里标记几道「忘了」，这里就会有内容。</div>') +
        "</section>" +

        '<section class="panel panel-pad">' +
          '<div class="sec-label"><span>数据</span><span class="line"></span></div>' +
          '<div style="display:flex;gap:9px;flex-wrap:wrap">' +
            '<button class="btn-pill" data-act="export">' + ICO("copy") + "导出进度</button>" +
            '<button class="btn-pill" data-act="import">' + ICO("layers") + "导入进度</button>" +
            '<button class="btn-pill" data-act="reset">' + ICO("reset") + "清空重来</button>" +
          "</div>" +
          '<div style="font-size:11.5px;color:#4b5875;margin-top:12px;line-height:1.8">' +
            "间隔重复参数：答对按 ease（1.3–3.0）拉长间隔，答错回到 10 分钟；上限 180 天。" +
          "</div>" +
        "</section>" +
      "</div>";

    host.querySelectorAll(".dcard").forEach(c => c.onclick = () => UI.go(+c.dataset.n));

    host.querySelector('[data-act="export"]').onclick = () => {
      const blob = new Blob([STORE.exportJSON()], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "hot100-progress-" + new Date().toISOString().slice(0, 10) + ".json";
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      UI.toast("已导出 JSON");
    };
    host.querySelector('[data-act="import"]').onclick = () => {
      const inp = document.createElement("input");
      inp.type = "file"; inp.accept = ".json";
      inp.onchange = () => {
        const f = inp.files[0];
        if (!f) return;
        const rd = new FileReader();
        rd.onload = () => {
          if (STORE.importJSON(rd.result)) { UI.toast("导入成功"); UI.refreshAll(); UI.view("stats"); }
          else UI.toast("文件格式不对");
        };
        rd.readAsText(f);
      };
      inp.click();
    };
    host.querySelector('[data-act="reset"]').onclick = () => {
      if (confirm("清空所有学习进度？这个操作不可撤销。")) {
        STORE.reset();
        UI.refreshAll();
        UI.view("stats");
        UI.toast("已清空");
      }
    };
  };
})();
