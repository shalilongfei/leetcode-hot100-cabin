/* _lib/load.js — 审计脚本共用的加载器
 *
 * 原来每个审计脚本都写死了 absolute 路径：
 *     const base = "C:/Users/xxx/Desktop/learn/hot100/js/";
 * 别人 clone 到别的目录就全部跑不了。这里改成相对当前文件定位，
 * 并且正确处理 Windows 反斜杠（fs 在 win32 上两种都吃，但 URL 编码要小心）。
 *
 * 用法：
 *     const { loadCore, loadReplay, loadVerify, H1, TRACE } = require("./_lib/load.js");
 *     loadCore();                       // 载入 100 题数据 + 全部帧表
 *     loadReplay();                     // 再载入 _r*.js 独立逐帧实现
 *     loadVerify();                     // 再载入 _v*.js 独立答案实现
 */
const fs = require("fs");
const path = require("path");

// 本文件在 <repo>/_lib/load.js，仓库根是上一级
const ROOT = path.resolve(__dirname, "..");
const JS = path.join(ROOT, "js");

function toPosix(p) {
  return p.split(path.sep).join("/");
}

/** 在 mock 的 window 上 eval 一个仓库内的文件 */
function loadFile(rel) {
  const abs = path.resolve(ROOT, rel);
  if (!fs.existsSync(abs)) return false;
  eval(fs.readFileSync(abs, "utf8"));
  return true;
}

/** 按顺序加载一组相对仓库根的路径 */
function loadMany(list) {
  const missing = [];
  for (const rel of list) if (!loadFile(rel)) missing.push(rel);
  return missing;
}

/* 100 题的数据 + 全部可视化帧表。顺序有依赖：数据先于帧，帧修正类后于主体。 */
const CORE = [
  "js/data/p1.js", "js/data/p2.js", "js/data/p3.js", "js/data/p4.js",
  "js/data/cpp1.js", "js/data/cpp2.js", "js/data/cpp3.js",
  "js/data/index.js",
  "js/viz/headfix.js", "js/viz/env.js", "js/viz/traces.js",
  "js/viz/exact.js", "js/viz/exact2.js", "js/viz/exact3.js", "js/viz/exact4.js",
  "js/viz/exact5.js", "js/viz/exact6.js", "js/viz/exact7.js",
  "js/viz/linefix.js",
  "js/viz/dbg0.js", "js/viz/dbg1.js", "js/viz/dbg2.js", "js/viz/dbg3.js",
  "js/viz/dbg4.js", "js/viz/dbg5.js", "js/viz/dbg6.js",
  "js/viz/dbgR.js", "js/viz/dbgR2.js", "js/viz/dbgR3.js",
  "js/viz/dbgFix.js", "js/viz/dbgFix2.js", "js/viz/dbgFix3.js", "js/viz/dbgFix4.js",
  "js/viz/dbgFix5.js", "js/viz/dbgFix6.js", "js/viz/dbgFix7.js", "js/viz/dbgFix8.js",
];

/** 自动发现 _r*.js（按数字排序，避免 _r10 排在 _r2 前面） */
function replayFiles() {
  return fs
    .readdirSync(ROOT)
    .filter((f) => /^_r\d+\.js$/.test(f))
    .sort((a, b) => parseInt(a.slice(2), 10) - parseInt(b.slice(2), 10));
}

function verifyFiles() {
  return fs
    .readdirSync(ROOT)
    .filter((f) => /^_v\d+\.js$/.test(f))
    .sort((a, b) => parseInt(a.slice(2), 10) - parseInt(b.slice(2), 10));
}

/** 载入 100 题数据与全部帧表。返回缺失文件列表（空数组 = 全齐）。 */
function loadCore() {
  if (typeof global.window === "undefined") global.window = {};
  return loadMany(CORE);
}

/** 载入逐帧独立实现（_r*.js） */
function loadReplay() {
  return loadMany(replayFiles());
}

/** 载入独立答案实现（_v*.js） */
function loadVerify() {
  return loadMany(verifyFiles());
}

/** 按需载入 index.html 里引用的其它前端脚本（highlight / blank 等） */
function loadApp(extra) {
  if (typeof global.window === "undefined") global.window = {};
  return loadMany(extra);
}

module.exports = {
  ROOT,
  JS,
  CORE,
  toPosix,
  loadFile,
  loadMany,
  loadCore,
  loadReplay,
  loadVerify,
  loadApp,
  replayFiles,
  verifyFiles,
};
