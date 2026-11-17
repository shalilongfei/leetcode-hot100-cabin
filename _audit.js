/* audit — 全站帧体检：行号 / 变量 / 连贯性 / 步数 */
;(function () {
  const { loadCore } = require("./_lib/load.js");
global.window = {};
const __missingFiles = loadCore();
if (__missingFiles.length) {
  console.error("缺少文件，无法继续：\n  " + __missingFiles.join("\n  "));
  process.exit(1);
}

  const isExec = t => {
    const s = (t || "").trim();
    if (!s) return false;
    if (/^[{}]+;?$/.test(s)) return false;
    if (/^(\/\/|\/\*|\*|#)/.test(s)) return false;
    if (/^(public|private|protected)\s*:/.test(s)) return false;
    return true;
  };

  const report = [];
  window.H1.all.forEach(p => {
    const st = window.TRACE.build(p);
    const L = String(p.cpp || "").split("\n");
    const issues = [];

    if (!st.length) { report.push({ n: p.n, t: p.t, issues: ["没有帧"] }); return; }

    /* 1 行号越界 */
    const over = st.filter(f => f.line > L.length || f.line < 1);
    if (over.length) issues.push("行号越界 " + over.length);

    /* 2 落在不可执行行 */
    const bad = st.filter(f => !isExec(L[f.line - 1]));
    if (bad.length) issues.push("落在空行/括号 " + bad.length + "/" + st.length);

    /* 3 相邻帧跳变过大（非循环回绕） */
    let jumps = 0;
    for (let i = 1; i < st.length; i++) {
      const d = st[i].line - st[i - 1].line;
      const prev = st[i - 1].note || "", cur = st[i].note || "";
      const crossFn = /入口|进入|return|弹栈|返回|完成|结束/.test(prev + cur);
      let newBlock = false;
      for (let k = 1; k <= 3; k++) {
        const ln = st[i].line - k;
        if (ln >= 1 && /^\s*\}\s*;?\s*$/.test(L[ln - 1] || "")) { newBlock = true; break; }
      }
      if (d > 9 && !crossFn && !newBlock) jumps++;
    }
    if (jumps) issues.push("无理由跳 " + jumps + " 次");

    /* 4 变量覆盖 */
    const withV = st.filter(f => f.vars && Object.keys(f.vars).length).length;
    const pct = Math.round(withV / st.length * 100);
    const lastN = st[st.length - 1].vars ? Object.keys(st[st.length - 1].vars).length : 0;
    if (lastN === 0) issues.push("末帧无变量");
    if (pct < 30) issues.push("变量覆盖 " + pct + "%");

    /* 5 步数过少 */
    if (st.length < 6) issues.push("只有 " + st.length + " 帧");

    /* 6 空解说 */
    const noNote = st.filter(f => !f.note || !String(f.note).trim()).length;
    if (noNote) issues.push("空解说 " + noNote);

    /* 7 同一行卡住 */
    let stuck = 0, run = 1;
    for (let i = 1; i < st.length; i++) {
      const same = st[i].line === st[i - 1].line && st[i].note === st[i - 1].note;
      if (same) { run++; if (run > 3) stuck++; } else run = 1;
    }
    if (stuck) issues.push("完全重复帧 " + stuck + " 次");

    /* 8 循环回绕次数（信息） */
    let back = 0;
    for (let i = 1; i < st.length; i++) if (st[i].line < st[i - 1].line) back++;

    report.push({ n: p.n, t: p.t, frames: st.length, back, pct, issues });
  });

  const bads = report.filter(r => r.issues && r.issues.length);
  console.log("总题数:", report.length, "| 有问题:", bads.length, "| 通过:", report.length - bads.length);
  console.log("");
  bads.forEach(r => console.log("  " + String(r.n).padStart(4) + " " + (r.t || "").padEnd(16) + (r.frames || 0) + "帧  " + r.issues.join(" / ")));
  const totalFrames = report.reduce((s, r) => s + (r.frames || 0), 0);
  const totalBack = report.reduce((s, r) => s + (r.back || 0), 0);
  console.log("");
  console.log("总帧:", totalFrames, "| 总回绕:", totalBack);
  require("fs").writeFileSync(require("path").join(__dirname, "_audit.json"), JSON.stringify(report, null, 1));
})();
