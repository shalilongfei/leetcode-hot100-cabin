/* _blank_leak.js — 检查挖空是否泄漏答案 + 分布统计 */
global.window = {};
const { loadApp } = require("./_lib/load.js");
const missing = loadApp([
  "js/data/p1.js","js/data/p2.js","js/data/p3.js","js/data/p4.js",
  "js/data/cpp1.js","js/data/cpp2.js","js/data/cpp3.js","js/data/index.js",
  "js/data/blank.js","js/highlight.js",
]);
if (missing.length) {
  console.error("缺少文件，无法继续：\n  " + missing.join("\n  "));
  process.exit(1);
}

const isWord = s => /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(s);

function countWord(code, w) {
  const re = new RegExp("\\b" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "g");
  const m = code.match(re);
  return m ? m.length : 0;
}

let leaks = [];
let stats = { cpp: [], py: [] };
let dupHeavy = [];

window.H1.all.forEach(p => {
  ["cpp", "py"].forEach(lang => {
    const code = lang === "cpp" ? (p.cpp || p.tmpl) : p.tmpl;
    if (!code) return;
    const r = window.HL.blankify(code, p.n);
    const ans = r.answers;
    stats[lang].push(ans.length);

    // 泄漏检查：把已挖掉的区间挖空后，看答案词是否还能在可见文本里读到
    const chars = code.split("");
    (r.hits || []).forEach(h => { for (let k = h.start; k < h.end; k++) chars[k] = "\u0001"; });
    const visible = chars.join("");
    const tally = {};
    ans.forEach(a => { tally[a] = (tally[a] || 0) + 1; });
    Object.keys(tally).forEach(a => {
      if (!isWord(a)) return;
      const still = countWord(visible, a);
      if (still > 0) leaks.push({ n: p.n, lang, word: a, visible: still });
    });

    // 同一答案重复太多次会显得机械
    Object.keys(tally).forEach(a => {
      if (tally[a] > 4) dupHeavy.push(p.n + "(" + lang + ") " + a + "×" + tally[a]);
    });
  });
});

const avg = a => a.length ? (a.reduce((x, y) => x + y, 0) / a.length) : 0;
const bucket = a => {
  const b = { "0": 0, "1-4": 0, "5-8": 0, "9-12": 0, "13+": 0 };
  a.forEach(v => { if (v === 0) b["0"]++; else if (v < 5) b["1-4"]++; else if (v < 9) b["5-8"]++; else if (v < 13) b["9-12"]++; else b["13+"]++; });
  return b;
};

console.log("=== 分布 ===");
["cpp", "py"].forEach(lang => {
  const b = bucket(stats[lang]);
  console.log("  " + lang.toUpperCase() + "  平均 " + avg(stats[lang]).toFixed(1) +
    " | 0个:" + b["0"] + "  1-4:" + b["1-4"] + "  5-8:" + b["5-8"] + "  9-12:" + b["9-12"] + "  13+:" + b["13+"]);
});

console.log("\n=== 答案泄漏（挖空数 < 实际出现数）===");
if (!leaks.length) console.log("  无");
else {
  const byN = {};
  leaks.forEach(l => { byN[l.n] = byN[l.n] || []; byN[l.n].push(l.lang + ":" + l.word + "(" + l.blanked + "/" + l.total + ")"); });
  Object.keys(byN).forEach(n => console.log("  题" + n + "  " + byN[n].join("  ")));
}

console.log("\n=== 同一答案重复 >4 次 ===");
console.log(dupHeavy.length ? "  " + dupHeavy.join(", ") : "  无");
