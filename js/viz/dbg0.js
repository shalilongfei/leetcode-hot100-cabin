/* =========================================================
   dbg — 调试器式逐行 trace
   每个函数都严格按 C++ 代码行的执行顺序产出帧：
   变量表、指针、容器状态、递归调用栈都随行更新。
   ========================================================= */
;(function () {
  window.DBG = window.DBG || {};

  /* 帧工厂：line 必填，其余状态按需 */
  function mk(S) {
    return function F(line, note, state) {
      S.push(Object.assign({ line, note }, state || {}));
      return S;
    };
  }
  window.DBG.mk = mk;

  /* 深拷贝（份量很小，避免帧间引用共享） */
  function cp(o) { return o == null ? o : JSON.parse(JSON.stringify(o)); }
  window.DBG.cp = cp;

  /* 矩阵转成 grid 需要的字符串二维数组不变形 */
  function gridOf(g) { return g.map(r => r.slice()); }
  window.DBG.gridOf = gridOf;
})();
