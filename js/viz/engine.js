/* 算法可视化引擎
   帧结构（全部可选）：
   { note, arr, ptr:{name:idx}, hi:[i], hi2:[i], done:[i], win:[l,r],
     bars, grid, gridHi:[[r,c]], gridHi2, gridDone,
     list, listHi, listHi2, listDone, listPtr,
     tree, treeHi, treeDone,
     map:{k:v}, mapHi:[k], stack:[], stackHi,
     dp, dpDim:[cols], dpHi, dpDone,
     vars:{k:v} } */
;(function () {
  const CANVAS_SLOTS = ["arr", "bars", "dp", "grid", "list", "tree", "map", "stack", "calls"];

  function mk(tag, cls) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    return e;
  }
  function setText(node, txt) {
    if (node.textContent !== txt) node.textContent = txt;
  }
  function sync(container, count, create) {
    while (container.children.length < count) container.appendChild(create(container.children.length));
    while (container.children.length > count) container.removeChild(container.lastChild);
    return Array.prototype.slice.call(container.children);
  }
  const has = (a, v) => Array.isArray(a) && a.indexOf(v) >= 0;

  /* ---------------- 数组格子 ---------------- */
  function ensureBox(box, cls) {
    let inner = box.firstElementChild;
    if (!inner || !inner.classList.contains(cls)) {
      box.innerHTML = "";
      inner = mk("div", cls);
      box.appendChild(inner);
    }
    return inner;
  }

  function renderArr(box, f) {
    const arr = f.arr;
    const holder = ensureBox(box, "cells");
    const wraps = sync(holder, arr.length, () => {
      const w = mk("div", "cell-wrap");
      w.appendChild(mk("div", "cell-ptr"));
      w.appendChild(mk("div", "cell we"));
      w.appendChild(mk("div", "cell-idx"));
      return w;
    });
    // 指针归并
    const ptrAt = {};
    Object.keys(f.ptr || {}).forEach(k => {
      const idx = f.ptr[k];
      if (idx == null || idx < 0) return;
      (ptrAt[idx] = ptrAt[idx] || []).push(k);
    });
    arr.forEach((v, i) => {
      const w = wraps[i];
      const [ptrEl, cell, idxEl] = w.children;
      const txt = String(v);
      setText(cell, txt);
      cell.className = "cell";
      if (txt.length > 4) cell.classList.add("wide");
      if (f.win && i >= f.win[0] && i <= f.win[1]) cell.classList.add("win");
      if (has(f.done, i)) cell.classList.add("done");
      if (has(f.hi2, i)) cell.classList.add("hi2");
      if (has(f.hi, i)) cell.classList.add("hi");
      if (has(f.sel, i)) cell.classList.add("sel");
      setText(idxEl, String(i));
      setText(ptrEl, (ptrAt[i] || []).join(" "));
      ptrEl.style.visibility = ptrAt[i] ? "visible" : "hidden";
    });
  }

  /* ---------------- 柱状图 ---------------- */
  function renderBars(box, f) {
    const arr = f.bars;
    const max = Math.max.apply(null, arr.concat([1]));
    const holder = ensureBox(box, "bars");
    const cols = sync(holder, arr.length, () => {
      const c = mk("div", "bar-col");
      const track = mk("div", "bar-track");
      const bar = mk("div", "bar");
      bar.appendChild(mk("div", "bar-v"));
      track.appendChild(bar);
      c.appendChild(track);
      c.appendChild(mk("div", "cell-idx"));
      return c;
    });
    arr.forEach((v, i) => {
      const [track, idxEl] = cols[i].children;
      const bar = track.firstElementChild;
      const valEl = bar.firstElementChild;
      bar.style.height = Math.max(6, (v / max) * 100) + "%";
      bar.className = "bar";
      if (has(f.hi2, i)) bar.classList.add("hi2");
      else if (has(f.hi, i)) bar.classList.add("hi");
      if (has(f.done, i)) bar.classList.add("full");
      setText(valEl, String(v));
      setText(idxEl, String(i));
    });
  }

  /* ---------------- 网格 ---------------- */
  function renderGrid(box, f) {
    const g = f.grid;
    const rows = g.length, cols = g[0].length;
    let tbl = box.querySelector("table");
    if (!tbl || box.dataset.shape !== rows + "x" + cols) {
      box.innerHTML = "";
      tbl = mk("table", "grid-tbl");
      for (let i = 0; i < rows; i++) {
        const tr = mk("tr");
        for (let j = 0; j < cols; j++) tr.appendChild(mk("td"));
        tbl.appendChild(tr);
      }
      box.appendChild(tbl);
      box.dataset.shape = rows + "x" + cols;
    }
    const cellAt = (i, j) => tbl.rows[i].cells[j];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const td = cellAt(i, j);
        const v = g[i][j];
        setText(td, String(v));
        td.className = "";
        if (v === null) td.classList.add("wall");
        if (has(f.gridHi2, i + "," + j)) td.classList.add("hi2");
        if (has(f.gridDone, i + "," + j)) td.classList.add("done");
        if (has(f.gridHi, i + "," + j)) td.classList.add("hi");
      }
    }
  }

  /* ---------------- 链表（HTML 实现） ---------------- */
  function renderList(box, f) {
    const items = f.list;
    const nodes = sync(box, items.length, () => {
      const g = mk("div", "litem");
      g.appendChild(mk("div", "cell-ptr"));
      g.appendChild(mk("div", "lnode"));
      return g;
    });
    items.forEach((v, i) => {
      const [ptr, node] = nodes[i].children;
      setText(node, String(v));
      node.className = "lnode";
      if (has(f.listHi2, i)) node.classList.add("hi2");
      if (has(f.listDone, i)) node.classList.add("done");
      if (has(f.listHi, i)) node.classList.add("hi");
      const p = f.listPtr && f.listPtr[i];
      setText(ptr, p || "");
      ptr.style.visibility = p ? "visible" : "hidden";
    });
  }

  /* ---------------- 树（SVG） ---------------- */
  /* 中序槽位布局：每个节点一个唯一列，父子自然居中、不重叠 */
  function layoutTree(tree) {
    if (!tree || !tree.length) return {};
    const pos = {};
    let order = 0;
    const walk = (i, d) => {
      if (i >= tree.length || tree[i] == null) return;
      walk(2 * i + 1, d + 1);
      pos[i] = { k: order++, d };
      walk(2 * i + 2, d + 1);
    };
    walk(0, 0);
    const n = order;
    const W = 720;
    const out = {};
    Object.keys(pos).forEach(i => {
      const p = pos[i];
      out[i] = {
        x: n <= 1 ? W / 2 : 54 + (p.k / (n - 1)) * (W - 108),
        y: 42 + p.d * 74,
        d: p.d
      };
    });
    return out;
  }

  function renderTree(box, f) {
    const tree = f.tree;
    const pos = layoutTree(tree);
    const keys = Object.keys(pos);
    const maxY = keys.reduce((m, k) => Math.max(m, pos[k].y), 0);
    const H = maxY + 54;
    // 复用 svg 外壳
    if (!box._svg) {
      box.innerHTML = "";
      box._svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      box._svg.setAttribute("class", "diagram");
      box.appendChild(box._svg);
    }
    const svg = box._svg;
    svg.setAttribute("viewBox", "0 0 720 " + H);
    svg.setAttribute("height", H);
    svg.innerHTML = "";

    const add = (tag, attrs, cls) => {
      const e = document.createElementNS("http://www.w3.org/2000/svg", tag);
      Object.keys(attrs).forEach(k => e.setAttribute(k, attrs[k]));
      if (cls) e.setAttribute("class", cls);
      svg.appendChild(e);
      return e;
    };

    // 连线
    // treePath 存在时按「整条路径」精确高亮：两端都在路径上才算这段边。
    // 没有 treePath 的老用法仍然只看任一端点（保持其他题目的观感不变）。
    const hiSet = f.treePath || f.treeHi;
    keys.forEach(k => {
      const i = +k, p = pos[i];
      [2 * i + 1, 2 * i + 2].forEach(c => {
        if (!pos[c]) return;
        const q = pos[c];
        const on = f.treePath
          ? (has(hiSet, i) && has(hiSet, c))
          : (has(f.treeHi, +c) || has(f.treeHi, i));
        add("line", { x1: p.x, y1: p.y, x2: q.x, y2: q.y }, "edge" + (on ? " hi" : ""));
      });
    });
    // 节点
    keys.forEach(k => {
      const i = +k, p = pos[i];
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      let cls = "nd";
      if (has(f.treeDone, i)) cls += " done";
      if (has(f.treeHi2, i)) cls += " hi2";
      if (has(hiSet, i)) cls += " hi";
      g.setAttribute("class", cls);
      const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      c.setAttribute("cx", p.x); c.setAttribute("cy", p.y); c.setAttribute("r", 19);
      g.appendChild(c);
      const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
      t.setAttribute("x", p.x); t.setAttribute("y", p.y + 4.5);
      t.setAttribute("text-anchor", "middle");
      t.textContent = String(tree[i]);
      g.appendChild(t);
      svg.appendChild(g);
    });
  }

  /* ---------------- 哈希表 / 栈 ---------------- */
  function renderMap(box, f) {
    const entries = Object.keys(f.map || {});
    const cards = sync(box, entries.length, () => {
      const c = mk("div", "kv");
      c.appendChild(mk("span", "kvk"));
      c.appendChild(mk("b", "kvv"));
      return c;
    });
    entries.forEach((k, i) => {
      const [kk, vv] = cards[i].children;
      setText(kk, k);
      setText(vv, "→ " + String(f.map[k]));
      cards[i].className = "kv";
      if (has(f.mapHi, k)) cards[i].classList.add("hi");
    });
  }

  function renderStack(box, f) {
    const items = f.stack || [];
    const cards = sync(box, items.length, () => mk("div", "kv"));
    items.forEach((v, i) => {
      setText(cards[i], String(v));
      cards[i].className = "kv";
      if (i === items.length - 1 && f.stackHi !== false) cards[i].classList.add("hi");
      if (has(f.stackDone, i)) cards[i].classList.add("done");
    });
  }

  /* ---------------- DP 表 ---------------- */
  function renderDP(box, f) {
    const dp = f.dp;
    if (f.dpDim) {
      const cols = f.dpDim;
      const rows = Math.ceil(dp.length / cols);
      let tbl = box.querySelector("table");
      if (!tbl || box.dataset.shape !== rows + "x" + cols) {
        box.innerHTML = "";
        tbl = mk("table", "grid-tbl dp-tbl");
        for (let i = 0; i < rows; i++) {
          const tr = mk("tr");
          for (let j = 0; j < cols; j++) tr.appendChild(mk("td"));
          tbl.appendChild(tr);
        }
        box.appendChild(tbl);
        box.dataset.shape = rows + "x" + cols;
      }
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const k = i * cols + j;
          const td = tbl.rows[i].cells[j];
          setText(td, dp[k] == null ? "" : String(dp[k]));
          td.className = "";
          if (has(f.dpHi, k)) td.classList.add("hi");
          if (has(f.dpDone, k)) td.classList.add("done");
        }
      }
    } else {
      renderArr(box, { arr: dp, hi: f.dpHi, hi2: [], done: f.dpDone || [], ptr: {}, win: null });
    }
  }

  /* ---------------- 调用栈 ---------------- */
  function renderCalls(box, f) {
    const items = f.callstack || [];
    const cards = sync(box, items.length, () => mk("div", "cframe"));
    items.forEach((c, i) => {
      let label = c.fn + "(" + c.args + ")";
      if (c.res !== undefined && c.res !== null && c.res !== "") label += " ‹" + c.res + "›";
      setText(cards[i], label);
      const top = i === items.length - 1;
      cards[i].className = "cframe" + (top ? " cur" : "") + (c.ret !== undefined ? " done" : "");
      cards[i].style.setProperty("--d", i);
    });
  }

  /* ---------------- 主渲染 ---------------- */
  function renderFrame(canvas, f) {
    CANVAS_SLOTS.forEach(slot => { canvas[slot].style.display = "none"; });
    // 恢复 CSS 里的 display（内联 block 会破坏 flex 布局）
    const show = k => { canvas[k].style.display = ""; };
    if (f.arr) { show("arr"); renderArr(canvas.arr, f); }
    if (f.bars) { show("bars"); renderBars(canvas.bars, f); }
    if (f.dp) { show("dp"); renderDP(canvas.dp, f); }
    if (f.grid) { show("grid"); renderGrid(canvas.grid, f); }
    if (f.list) { show("list"); renderList(canvas.list, f); }
    if (f.tree) { show("tree"); renderTree(canvas.tree, f); }
    if (f.map) { show("map"); renderMap(canvas.map, f); }
    if (f.stack) { show("stack"); renderStack(canvas.stack, f); }
    if (f.callstack && f.callstack.length) { show("calls"); renderCalls(canvas.calls, f); }

    // 变量条
    const vars = f.vars ? Object.keys(f.vars) : [];
    const vEls = sync(canvas.vars, vars.length, () => {
      const d = mk("div", "var");
      d.appendChild(document.createTextNode(""));
      d.appendChild(mk("b"));
      return d;
    });
    vars.forEach((k, i) => {
      vEls[i].firstChild.nodeValue = k;
      setText(vEls[i].lastChild, String(f.vars[k]));
    });
    canvas.vars.style.display = vars.length ? "flex" : "none";
  }

  /* ---------------- 播放器 ---------------- */
  function mount(root, problem, opts) {
    opts = opts || {};
    const steps = (window.TRACE && window.TRACE.build(problem, opts.variant)) || [];
    if (!steps.length) return null;

    const wrap = mk("div", "viz-wrap" + (opts.compact ? " compact" : ""));
    const stage = mk("div", "viz-stage");
    const scroller = mk("div", "viz-scroller");
    const canvas = mk("div", "viz-canvas");
    CANVAS_SLOTS.forEach(s => {
      const d = mk("div", "vz vz-" + s);
      d.style.display = "none";
      canvas[s] = d;
      scroller.appendChild(d);
    });
    const vars = mk("div", "vars");
    canvas.vars = vars;
    scroller.appendChild(vars);
    stage.appendChild(scroller);
    wrap.appendChild(stage);

    let noteP = null, noteStep = null, seek = null, speedBtn = null, btnPlay = null;

    if (!opts.compact) {
      const note = mk("div", "viz-note");
      note.innerHTML = '<div class="vn-avatar">' + window.MASCOT.miniWhale() + "</div>" +
        '<div><p></p><div class="vn-step"></div></div>';
      noteP = note.querySelector("p");
      noteStep = note.querySelector(".vn-step");

      const ctrl = mk("div", "viz-ctrl");
      ctrl.innerHTML =
        '<button class="btn-pill primary" data-act="play">' + window.ICO("play") + "<span>播放</span></button>" +
        '<button class="btn-pill" data-act="prev">' + window.ICO("stepB") + "</button>" +
        '<button class="btn-pill" data-act="next">' + window.ICO("stepF") + "</button>" +
        '<button class="btn-pill" data-act="reset">' + window.ICO("reset") + "</button>" +
        '<div class="spacer"></div>' +
        '<input type="range" class="seek" min="0" max="' + (steps.length - 1) + '" value="0" step="1">' +
        '<span class="spd"><button class="speed">1x</button></span>';
      btnPlay = ctrl.querySelector('[data-act="play"]');
      seek = ctrl.querySelector(".seek");
      speedBtn = ctrl.querySelector(".speed");

      wrap.appendChild(note);
      wrap.appendChild(ctrl);
    }
    root.appendChild(wrap);

    let i = 0, timer = null, speed = 1;

    function paint() {
      const f = steps[i] || {};
      renderFrame(canvas, f);
      if (noteP) {
        noteP.innerHTML = f.note || "";
        noteStep.textContent = "step " + (i + 1) + " / " + steps.length + (f.tag ? " · " + f.tag : "");
      }
      if (seek) {
        seek.value = i;
        seek.style.setProperty("--p", (i / Math.max(1, steps.length - 1)) * 100 + "%");
      }
      if (btnPlay) {
        btnPlay.innerHTML = timer ? window.ICO("pause") + "<span>暂停</span>"
                                  : window.ICO("play") + "<span>播放</span>";
        btnPlay.classList.toggle("primary", !timer);
      }
      if (opts.onFrame) opts.onFrame(f, i, steps.length, !!timer);
    }

    function go(k) {
      i = Math.max(0, Math.min(steps.length - 1, k));
      paint();
    }
    function notifyState() { if (opts.onState) opts.onState(!!timer); }

    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
      paint();
      notifyState();
    }
    function play() {
      if (timer) return stop();
      if (i >= steps.length - 1) i = 0;
      timer = setInterval(() => {
        if (i >= steps.length - 1) { stop(); return; }
        i += 1; paint();
      }, 760 / speed);
      paint();
      notifyState();
    }

    if (!opts.compact) {
      const ctrl = wrap.querySelector(".viz-ctrl");
      ctrl.addEventListener("click", e => {
        const b = e.target.closest("[data-act],[class~='speed']");
        if (!b) return;
        if (b.classList.contains("speed")) {
          speed = speed === 1 ? 1.5 : speed === 1.5 ? 2 : speed === 2 ? 0.6 : 1;
          b.textContent = speed + "x";
          if (timer) { stop(); play(); }
          return;
        }
        const act = b.dataset.act;
        if (act === "play") play();
        if (act === "prev") { stop(); go(i - 1); }
        if (act === "next") { stop(); go(i + 1); }
        if (act === "reset") { stop(); go(0); }
      });
      seek.addEventListener("input", () => { stop(); go(+seek.value); });
    }

    paint();

    return {
      steps,
      go,
      play,
      stop,
      speedUp() {
        speed = speed === 1 ? 1.5 : speed === 1.5 ? 2 : speed === 2 ? 0.6 : 1;
        return speed;
      },
      get index() { return i; },
      get playing() { return !!timer; },
      /* 跳到某段代码对应的帧（无精确命中时取最近的一帧） */
      goLine(line, lines) {
        if (line == null) return false;
        const map = lines || (steps._lineMap || []);
        if (!map.length) return false;
        let hit = map.indexOf(line);
        if (hit < 0) {
          for (let k = 0; k < map.length; k++) if (map[k] > line) { hit = k; break; }
        }
        if (hit < 0) {
          for (let k = map.length - 1; k >= 0; k--) if (map[k] <= line) { hit = k; break; }
        }
        if (hit < 0) hit = 0;
        stop();
        go(hit);
        return true;
      },
      destroy() { stop(); wrap.remove(); }
    };
  }

  window.VIZ = { mount, renderFrame, layoutTree };
})();
