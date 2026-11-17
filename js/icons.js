/* 图标库 — 内联 stroke SVG */
;(function () {
  const P = {
    book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15H6.5A2.5 2.5 0 0 0 4 20.5V5.5Z"/><path d="M4 18.5V21h15"/>',
    repeat: '<path d="M17 2.5 20.5 6 17 9.5"/><path d="M20.5 6H7.5a3.5 3.5 0 0 0-3.5 3.5V11"/><path d="M7 21.5 3.5 18 7 14.5"/><path d="M3.5 18h13a3.5 3.5 0 0 0 3.5-3.5V13"/>',
    dice: '<rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8.5" cy="8.5" r="1.2" fill="currentColor" stroke="none"/><circle cx="15.5" cy="15.5" r="1.2" fill="currentColor" stroke="none"/><circle cx="15.5" cy="8.5" r="1.2" fill="currentColor" stroke="none"/><circle cx="8.5" cy="15.5" r="1.2" fill="currentColor" stroke="none"/>',
    chart: '<path d="M3 20.5h18"/><rect x="5" y="11" width="3.4" height="7" rx="1"/><rect x="10.3" y="6.5" width="3.4" height="11.5" rx="1"/><rect x="15.6" y="9" width="3.4" height="9" rx="1"/>',
    flame: '<path d="M12 2.5c2.6 3.2 1.2 5 .4 6.2-.6.9-1.6 1.1-1.6 1.1s.5-2.4-1.3-3.4c.2 2-1.9 3-1.9 5.6a4.4 4.4 0 0 0 8.8 0c0-3.4-2.2-5.4-4.4-9.5Z"/><path d="M12 21.5A6.5 6.5 0 0 0 18.5 15c0-2.2-.9-3.9-2-5.4"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    check: '<path d="m4.5 12.5 5 5L20 6.5"/>',
    circleDot: '<circle cx="12" cy="12" r="7.6" opacity=".55"/><circle cx="12" cy="12" r="2.6" fill="currentColor" stroke="none"/>',
    half: '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5a8.5 8.5 0 0 1 0 17Z" fill="currentColor" stroke="none"/>',
    star: '<path d="m12 3.2 2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.4l5.9-.8L12 3.2Z"/>',
    play: '<path d="M7 4.5 19 12 7 19.5V4.5Z" fill="currentColor" stroke="none"/>',
    pause: '<rect x="6.5" y="4.5" width="3.6" height="15" rx="1.4" fill="currentColor" stroke="none"/><rect x="13.9" y="4.5" width="3.6" height="15" rx="1.4" fill="currentColor" stroke="none"/>',
    stepF: '<path d="M5 4.5 15 12l-10 7.5V4.5Z" fill="currentColor" stroke="none"/><rect x="16.5" y="4.5" width="2.6" height="15" rx="1" fill="currentColor" stroke="none"/>',
    stepB: '<path d="M19 4.5 9 12l10 7.5V4.5Z" fill="currentColor" stroke="none"/><rect x="4.9" y="4.5" width="2.6" height="15" rx="1" fill="currentColor" stroke="none"/>',
    reset: '<path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1"/><path d="M3.2 4v5h5"/>',
    copy: '<rect x="8.5" y="8.5" width="12" height="12" rx="2.5"/><path d="M15.5 5.5h-9a2.5 2.5 0 0 0-2.5 2.5v9"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/>',
    eyeOff: '<path d="M4 4.5 20 20"/><path d="M9.5 6.2A9.6 9.6 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-3.2 3.9"/><path d="M6.1 8.2A16.7 16.7 0 0 0 2.5 12S6 18 12 18a9.7 9.7 0 0 0 3.7-.7"/>',
    link: '<path d="M10.5 13.5a4 4 0 0 0 5.7 0l3-3a4 4 0 1 0-5.7-5.7l-1.6 1.6"/><path d="M13.5 10.5a4 4 0 0 0-5.7 0l-3 3a4 4 0 1 0 5.7 5.7l1.6-1.6"/>',
    warn: '<path d="M12 3.8 21 19.5H3L12 3.8Z"/><path d="M12 9.5v4.5"/><circle cx="12" cy="17" r=".9" fill="currentColor" stroke="none"/>',
    sparkle: '<path d="M12 3 13.7 9.3 20 11l-6.3 1.7L12 19l-1.7-6.3L4 11l6.3-1.7L12 3Z"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    close: '<path d="M6 6 18 18M18 6 6 18"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/>',
    brain: '<path d="M9.5 4.2A3.2 3.2 0 0 0 6.3 7.4 3 3 0 0 0 4.5 12a3 3 0 0 0 1.4 3.6A3.2 3.2 0 0 0 12 18.4V4.9a2.7 2.7 0 0 0-2.5-.7Z"/><path d="M14.5 4.2A3.2 3.2 0 0 1 17.7 7.4 3 3 0 0 1 19.5 12a3 3 0 0 1-1.4 3.6A3.2 3.2 0 0 1 12 18.4"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5.4l3.4 2"/>',
    left: '<path d="M14.5 5.5 8 12l6.5 6.5"/>',
    right: '<path d="M9.5 5.5 16 12l-6.5 6.5"/>',
    shuffle: '<path d="M3.5 7.5h3.2c1.6 0 2.6.9 3.6 2.3l3.4 4.9c1 1.4 2 2.3 3.6 2.3h3.2"/><path d="M3.5 16.5h3.2c1.6 0 2.6-.9 3.6-2.3"/><path d="M17 5.5c1.4 0 2.4.9 3.5 2"/><path d="m18.5 3.5 2.5 2-2.5 2"/><path d="m18.5 14.5 2.5 2-2.5 2"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.6"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/>',
    wave: '<path d="M2.5 9c2-2.5 4-2.5 6 0s4 2.5 6 0 4-2.5 6 0"/><path d="M2.5 15c2-2.5 4-2.5 6 0s4 2.5 6 0 4-2.5 6 0"/>',
    bolt: '<path d="M13.5 2.5 5 13.5h5.5L9.5 21.5 19 10h-5.8l.3-7.5Z"/>',
    book2: '<path d="M4 4.5h6a3 3 0 0 1 3 3V20a2.5 2.5 0 0 0-2.5-2.5H4V4.5Z"/><path d="M20 4.5h-6a3 3 0 0 0-3 3V20a2.5 2.5 0 0 1 2.5-2.5H20V4.5Z"/>',
    lightbulb: '<path d="M9.5 18h5"/><path d="M10 21h4"/><path d="M12 2.5a6 6 0 0 1 3.6 10.8c-.5.4-.8 1-.8 1.7H9.2c0-.7-.3-1.3-.8-1.7A6 6 0 0 1 12 2.5Z"/>',
    keyboard: '<rect x="2.5" y="6.5" width="19" height="11" rx="2.5"/><path d="M6.5 10.5h.01M9.5 10.5h.01M12.5 10.5h.01M15.5 10.5h.01M18 10.5h.01M8 14h8"/>'
  };

  window.ICO = function (name, cls) {
    const body = P[name] || P.circleDot;
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
      'stroke-linecap="round" stroke-linejoin="round" class="' + (cls || "") + '" aria-hidden="true">' +
      body + "</svg>";
  };

  window.ICO.raw = P;

  window.paintIcons = function (root) {
    (root || document).querySelectorAll("[data-ico]").forEach(el => {
      el.innerHTML = window.ICO(el.dataset.ico);
      el.style.display = "inline-flex";
    });
  };
})();
