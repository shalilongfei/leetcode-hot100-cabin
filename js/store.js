/* 进度存储 + 间隔重复（简化 SM-2） */
;(function () {
  const KEY = "hot100.v1";
  const DAY = 86400000;

  const today = () => new Date().toISOString().slice(0, 10);
  const now = () => Date.now();

  const blank = () => ({
    v: 1,
    items: {},
    days: {},
    streak: { last: "", count: 0 },
    meta: { reviews: 0, startedAt: now() },
    ui: { view: "learn", n: 1, blank: false, lang: "cpp" }
  });

  let S = null;

  function load() {
    if (S) return S;
    try {
      const raw = localStorage.getItem(KEY);
      S = raw ? Object.assign(blank(), JSON.parse(raw)) : blank();
    } catch (e) {
      S = blank();
    }
    return S;
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
  }

  function def(n) {
    return {
      seen: 0, right: 0, wrong: 0,
      ease: 2.5, interval: 0, due: 0, last: 0,
      status: "new", fav: false, note: ""
    };
  }

  const STORE = {
    raw() { return load(); },

    get(n) {
      const s = load();
      return Object.assign(def(n), s.items[n] || {});
    },

    all() {
      const s = load();
      const out = {};
      window.H1.all.forEach(p => { out[p.n] = Object.assign(def(p.n), s.items[p.n] || {}); });
      return out;
    },

    /* grade: 0=Again 1=Hard 2=Good 3=Easy */
    update(n, grade) {
      const s = load();
      const it = Object.assign(def(n), s.items[n] || {});
      const g = Math.max(0, Math.min(3, grade | 0));

      it.seen += 1;
      it.last = now();
      if (g <= 1) it.wrong += 1; else it.right += 1;

      if (g === 0) {
        it.ease = Math.max(1.3, it.ease - 0.2);
        it.interval = 0.007;                 // 约 10 分钟后
      } else if (g === 1) {
        it.ease = Math.max(1.3, it.ease - 0.15);
        it.interval = Math.max(1, it.interval * 1.2);
      } else if (g === 2) {
        it.interval = it.interval < 1 ? 1 : it.interval * it.ease;
      } else {
        it.ease = Math.min(3.0, it.ease + 0.15);
        it.interval = it.interval < 2 ? 2 : it.interval * it.ease * 1.3;
      }
      it.interval = Math.min(180, it.interval);
      it.due = it.last + it.interval * DAY;

      it.status = (g >= 2 && it.interval >= 5 && it.right >= 2) ? "mastered"
        : (g >= 2 && it.interval >= 1) ? "known" : "learning";

      s.items[n] = it;
      s.meta.reviews += 1;

      // 每日活跃
      const d = today();
      s.days[d] = (s.days[d] || 0) + 1;
      if (s.streak.last !== d) {
        const y = new Date(Date.now() - DAY).toISOString().slice(0, 10);
        s.streak.count = s.streak.last === y ? s.streak.count + 1 : 1;
        s.streak.last = d;
      }
      save();
      return it;
    },

    toggleFav(n) {
      const s = load();
      const it = Object.assign(def(n), s.items[n] || {});
      it.fav = !it.fav;
      s.items[n] = it;
      save();
      return it.fav;
    },

    setNote(n, txt) {
      const s = load();
      const it = Object.assign(def(n), s.items[n] || {});
      it.note = txt;
      s.items[n] = it;
      save();
    },

    markWrong(n) {
      const s = load();
      const it = Object.assign(def(n), s.items[n] || {});
      it.wrong += 1;
      it.status = it.status === "new" ? "learning" : it.status;
      s.items[n] = it;
      save();
    },

    isDue(n) {
      const it = this.get(n);
      return it.seen > 0 && it.due <= now();
    },

    dueList() {
      const t = now();
      const list = window.H1.all
        .map(p => ({ p, it: this.get(p.n) }))
        .filter(x => x.it.seen > 0 && x.it.due <= t)
        .sort((a, b) => a.it.due - b.it.due);
      // 从没学过的也算「今日新题」，排后面
      const fresh = window.H1.all
        .filter(p => this.get(p.n).seen === 0)
        .slice(0, 5)
        .map(p => ({ p, it: this.get(p.n) }));
      return { due: list, fresh };
    },

    progress() {
      const all = window.H1.all;
      let done = 0, mastered = 0, known = 0, learning = 0, wrong = 0, due = 0, favs = 0;
      const t = now();
      all.forEach(p => {
        const it = this.get(p.n);
        if (it.seen > 0) {
          done++;
          if (it.status === "mastered") mastered++;
          else if (it.status === "known") known++;
          else learning++;
          if (it.due <= t) due++;
        }
        if (it.wrong > 0) wrong++;
        if (it.fav) favs++;
      });
      return { done, mastered, known, learning, wrong, due, favs, total: all.length };
    },

    heat(days) {
      const s = load();
      const out = [];
      const n = days || 14;
      for (let i = n - 1; i >= 0; i--) {
        const d = new Date(Date.now() - i * DAY).toISOString().slice(0, 10);
        out.push({ date: d, count: s.days[d] || 0 });
      }
      return out;
    },

    todayCount() {
      const s = load();
      return s.days[today()] || 0;
    },

    streak() {
      const s = load();
      if (s.streak.last === today()) return s.streak.count;
      const y = new Date(Date.now() - DAY).toISOString().slice(0, 10);
      return s.streak.last === y ? s.streak.count : 0;
    },

    ui(patch) {
      const s = load();
      s.ui = Object.assign({}, s.ui, patch || {});
      save();
      return s.ui;
    },

    getUI() { return load().ui; },

    reset() {
      const ui = load().ui;
      S = blank();
      S.ui = ui;
      save();
    },

    exportJSON() { return JSON.stringify(load(), null, 2); },

    importJSON(txt) {
      try {
        const obj = JSON.parse(txt);
        if (!obj || typeof obj !== "object" || !obj.items) throw new Error("bad");
        S = Object.assign(blank(), obj);
        save();
        return true;
      } catch (e) { return false; }
    }
  };

  window.STORE = STORE;
})();
