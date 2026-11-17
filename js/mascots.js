/* DSH 大鲸鱼 + 鲸鱼娘 —— 鲸鱼用 deepseek-harness 官方 BrandWordmark 的路径几何重绘；
   女孩按公开设定还原：蓝色渐层长发、呆毛、鲸类头鳍、蓝瞳、深蓝白女仆长裙、鲸尾。
   mood: idle | happy | think | cheer */
;(function () {

  /* ---------- 官方鲸鱼路径（viewBox 0 0 182 24 中的 mark 部分） ---------- */
  const WHALE_MAIN = "M23.0584 4.95203C22.8129 4.83203 22.7074 5.06103 22.5639 5.17704C22.5149 5.21454 22.4734 5.26354 22.4319 5.30854C22.0734 5.69155 21.6543 5.94306 21.1073 5.91306C20.3073 5.86806 19.6243 6.11957 19.0203 6.73158C18.8918 5.97706 18.4652 5.52655 17.8162 5.23754C17.4767 5.08753 17.1332 4.93703 16.8952 4.61052C16.7292 4.37801 16.6837 4.11901 16.6007 3.8635C16.5477 3.70949 16.4952 3.55199 16.3177 3.52549C16.1252 3.49549 16.0497 3.65699 15.9742 3.792C15.6722 4.34401 15.5552 4.95203 15.5667 5.56805C15.5932 6.95359 16.1782 8.05712 17.3407 8.84215C17.4727 8.93215 17.5067 9.02215 17.4652 9.15366C17.3857 9.42416 17.2917 9.68667 17.2087 9.95718C17.1557 10.1297 17.0767 10.1677 16.8917 10.0922C16.2537 9.82568 15.7027 9.43117 15.2156 8.95465C14.3891 8.15513 13.6416 7.2726 12.7096 6.58158C12.4906 6.42007 12.2716 6.27007 12.045 6.12707C11.094 5.20354 12.1696 4.44502 12.4186 4.35501C12.6791 4.26101 12.5091 3.938 11.6675 3.942C10.826 3.9455 10.056 4.22751 9.07446 4.60302C8.93096 4.65952 8.77995 4.70052 8.62545 4.73452C7.73492 4.56552 6.80989 4.52802 5.84386 4.63702C4.02481 4.83953 2.57177 5.69955 1.50373 7.1676C0.220694 8.93215 -0.0813148 10.9372 0.288196 13.0283C0.676708 15.2323 1.80174 17.0569 3.53029 18.4834C5.32285 19.9625 7.38741 20.6875 9.74298 20.5485C11.1735 20.466 12.7661 20.2745 14.5626 18.7539C15.0156 18.9795 15.4912 19.0695 16.2797 19.137C16.8872 19.1935 17.4722 19.107 17.9252 19.013C18.6347 18.8629 18.5857 18.2059 18.3292 18.0854C16.2497 17.1169 16.7062 17.5109 16.2912 17.1919C17.3477 15.9419 18.9618 13.7198 19.4598 10.6942C19.5088 10.3602 19.5713 9.88968 19.5638 9.61917C19.5598 9.45417 19.5978 9.39016 19.7863 9.37116C20.3073 9.31116 20.8128 9.16866 21.2773 8.91315C22.6249 8.17713 23.1684 6.96809 23.2964 5.51905C23.3154 5.29754 23.2924 5.06853 23.0584 4.95203Z";

  const WHALE_DETAIL = "M11.3165 17.9954C9.30097 16.4109 8.32344 15.8894 7.91992 15.9119C7.54241 15.9344 7.61042 16.3664 7.69342 16.6479C7.78042 16.9259 7.89342 17.1174 8.05193 17.3614C8.16143 17.5229 8.23694 17.7629 7.94243 17.9434C7.29341 18.3449 6.16487 17.8084 6.11187 17.7819C4.79833 17.0084 3.7003 15.9874 2.92628 14.5908C2.17875 13.2468 1.74474 11.8047 1.67324 10.2657C1.65424 9.89418 1.76374 9.76267 2.13375 9.69517C2.62077 9.60517 3.12278 9.58617 3.6093 9.65767C5.66636 9.95818 7.41741 10.8777 8.88545 12.3348C9.72348 13.1643 10.3575 14.1558 11.0105 15.1243C11.705 16.1529 12.4521 17.1329 13.4036 17.9364C13.7396 18.2179 14.0076 18.4319 14.2641 18.5899C13.4906 18.6764 12.1996 18.6949 11.3165 17.9964V17.9954ZM12.2826 11.7817C12.2826 11.6167 12.4146 11.4852 12.5806 11.4852C12.6181 11.4852 12.6521 11.4927 12.6826 11.5037C12.7241 11.5187 12.7621 11.5412 12.7921 11.5752C12.8451 11.6277 12.8751 11.7027 12.8751 11.7817C12.8751 11.9467 12.7431 12.0782 12.5771 12.0782C12.4111 12.0782 12.2826 11.9467 12.2826 11.7817ZM15.2831 13.3208C15.0906 13.3998 14.8981 13.4673 14.7131 13.4748C14.4261 13.4898 14.1131 13.3733 13.9431 13.2308C13.6791 13.0093 13.4901 12.8853 13.4111 12.4988C13.3771 12.3338 13.3961 12.0782 13.4261 11.9317C13.4941 11.6162 13.4186 11.4137 13.1961 11.2297C13.0151 11.0797 12.7846 11.0382 12.5316 11.0382C12.4371 11.0382 12.3506 10.9967 12.2861 10.9632C12.1806 10.9107 12.0936 10.7792 12.1766 10.6177C12.2031 10.5652 12.3316 10.4377 12.3616 10.4152C12.7051 10.2197 13.1011 10.2837 13.4676 10.4302C13.8071 10.5692 14.0641 10.8242 14.4336 11.1847C14.8111 11.6202 14.8791 11.7402 15.0941 12.0672C15.2641 12.3228 15.4186 12.5853 15.5247 12.8858C15.5887 13.0733 15.5057 13.2268 15.2831 13.3208Z";

  const uid = () => Math.random().toString(36).slice(2, 7);

  function spout(mood) {
    const big = mood === "happy" || mood === "cheer";
    const drops = big
      ? '<circle cx="6" cy="1.4" r=".42"/><circle cx="10.4" cy="0.6" r=".34"/><circle cx="13" cy="2" r=".3"/><circle cx="8" cy="2.6" r=".26"/>'
      : '<circle cx="8.2" cy="1.6" r=".34"/><circle cx="11.4" cy="1.2" r=".26"/>';
    return '<g class="mg-spout" fill="#7fe3ff" opacity=".9">' +
      '<path d="M8.4 4.4 C 7.2 3, 7.4 1.6, 8.2 0.4" fill="none" stroke="#7fe3ff" stroke-width=".42" stroke-linecap="round"/>' +
      '<path d="M8.8 4.4 C 9.2 2.6, 10.4 1.6, 11.8 1.6" fill="none" stroke="#7fe3ff" stroke-width=".34" stroke-linecap="round"/>' +
      '<path d="M8.2 4.4 C 6.8 3.6, 6 2.6, 5.8 1.4" fill="none" stroke="#7fe3ff" stroke-width=".3" stroke-linecap="round" opacity=".7"/>' +
      drops + "</g>";
  }

  /* ---------- 鲸鱼：官方轮廓，双色分层 ---------- */
  function whale(mood, id) {
    const u = id || ("w" + uid());
    return `<svg width="23.6" height="18.2" viewBox="0 2.8 23.6 18.2" class="mwhale mwhale-${mood}" aria-hidden="true">
<defs>
  <linearGradient id="${u}a" x1=".15" y1=".1" x2=".7" y2="1">
    <stop offset="0" stop-color="#2b6cff"/><stop offset=".5" stop-color="#1c4ed8"/><stop offset="1" stop-color="#0a2a6b"/>
  </linearGradient>
  <linearGradient id="${u}b" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#eaf6ff"/><stop offset="1" stop-color="#9fd8ff"/>
  </linearGradient>
  <filter id="${u}c" x="-30%" y="-30%" width="160%" height="160%">
    <feGaussianBlur stdDeviation=".32" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
</defs>
<g filter="url(#${u}c)">
  <path d="${WHALE_MAIN}" fill="url(#${u}a)"/>
  <path d="${WHALE_DETAIL}" fill="#bfe6ff" opacity=".42"/>
</g>
${spout(mood)}
</svg>`;
  }

  /* ---------- 鲸鱼娘：120 x 176 ---------- */
  function girl(mood, id) {
    const u = id || ("g" + uid());
    const ink = "#12285a";
    let eyes, brows, mouth, extra = "", armRight = "", tail = "";

    if (mood === "happy" || mood === "cheer") {
      eyes = `<path d="M44 58 q6 -7 12 0" fill="none" stroke="${ink}" stroke-width="2.6" stroke-linecap="round"/>
              <path d="M64 58 q6 -7 12 0" fill="none" stroke="${ink}" stroke-width="2.6" stroke-linecap="round"/>`;
      mouth = `<path d="M55 68 q5 6 10 0 q-5 3 -10 0Z" fill="#e8607f" opacity=".92"/>`;
      extra = `<g class="mg-stars" fill="#ffe9a8">
        <path d="M94 34 l1.7 3.6 3.8.5-2.8 2.7.7 3.8-3.4-1.8-3.4 1.8.7-3.8-2.8-2.7 3.8-.5Z"/>
        <path d="M20 46 l1.2 2.5 2.7.4-2 1.9.5 2.7-2.4-1.3-2.4 1.3.5-2.7-2-1.9 2.7-.4Z" opacity=".85"/>
      </g>`;
    } else if (mood === "think") {
      eyes = `<ellipse cx="50" cy="58" rx="4.6" ry="5.4" fill="url(#${u}i)"/>
              <ellipse cx="70" cy="58" rx="4.6" ry="5.4" fill="url(#${u}i)"/>
              <circle cx="52" cy="55.4" r="1.7" fill="#fff"/><circle cx="72" cy="55.4" r="1.7" fill="#fff"/>`;
      mouth = `<path d="M56 69 q4 2 7 0" fill="none" stroke="${ink}" stroke-width="1.7" stroke-linecap="round" opacity=".8"/>`;
      extra = `<g class="mg-q" fill="none" stroke="#9fe9f7" stroke-width="2" stroke-linecap="round" opacity=".85">
        <path d="M98 30 q7 -7 0 -12 q-7 -3 -7 4"/><circle cx="91" cy="36" r="1.8" fill="#9fe9f7" stroke="none"/>
      </g>`;
      armRight = `<path d="M84 116 q12 -6 9 -18" fill="none" stroke="#1b3f8f" stroke-width="8" stroke-linecap="round"/>
                  <circle cx="93" cy="95" r="4.6" fill="#ffe0cf"/>`;
    } else if (mood === "cheer") {
      eyes = `<ellipse cx="50" cy="58" rx="5" ry="6" fill="url(#${u}i)"/>
              <ellipse cx="70" cy="58" rx="5" ry="6" fill="url(#${u}i)"/>
              <circle cx="48" cy="55" r="2.2" fill="#fff"/><circle cx="68" cy="55" r="2.2" fill="#fff"/>`;
      mouth = `<path d="M53 67 q7 9 14 0 q-7 4 -14 0Z" fill="#e8607f"/>`;
      armRight = `<path d="M84 112 q16 -4 18 -22" fill="none" stroke="#1b3f8f" stroke-width="8" stroke-linecap="round"/>
                  <circle cx="103" cy="87" r="4.8" fill="#ffe0cf"/>`;
      extra = `<g class="mg-stars" fill="#ffe9a8">
        <path d="M100 60 l1.4 3 3.2.4-2.4 2.3.6 3.2-2.8-1.5-2.8 1.5.6-3.2-2.4-2.3 3.2-.4Z"/>
      </g>`;
    } else {
      eyes = `<ellipse cx="50" cy="58" rx="4.8" ry="6" fill="url(#${u}i)"/>
              <ellipse cx="70" cy="58" rx="4.8" ry="6" fill="url(#${u}i)"/>
              <circle cx="48.2" cy="55.4" r="2" fill="#fff"/><circle cx="68.2" cy="55.4" r="2" fill="#fff"/>
              <circle cx="51.6" cy="60.6" r=".95" fill="#fff" opacity=".7"/>
              <circle cx="71.6" cy="60.6" r=".95" fill="#fff" opacity=".7"/>`;
      mouth = `<path d="M57 69 q4 3 7 0" fill="none" stroke="${ink}" stroke-width="1.8" stroke-linecap="round" opacity=".85"/>`;
    }

    if (!armRight) {
      armRight = `<path d="M84 114 q13 7 12 19" fill="none" stroke="#1b3f8f" stroke-width="8" stroke-linecap="round"/>
                  <circle cx="96" cy="135" r="4.4" fill="#ffe0cf"/>`;
    }

    brows = `<path d="M43 49 q6 -3 12 -1" fill="none" stroke="#2a5fa8" stroke-width="1.7" stroke-linecap="round" opacity=".7"/>
             <path d="M65 48 q6 -2 12 1" fill="none" stroke="#2a5fa8" stroke-width="1.7" stroke-linecap="round" opacity=".7"/>`;

    /* 鲸尾：从裙后伸出 */
    tail = `<g class="mg-tail">
      <path d="M92 134 C 108 130, 118 118, 120 104 C 123 114, 121 124, 114 132 C 119 137, 121 147, 117 156 C 110 146, 101 139, 91 138 Z"
            fill="url(#${u}k)"/>
      <path d="M92 136 C 104 133, 112 124, 114 113" fill="none" stroke="#7fd4ff" stroke-width="1.4" opacity=".5"/>
    </g>`;

    return `<svg width="120" height="176" viewBox="0 0 120 176" class="mgirl mgirl-${mood}" aria-hidden="true">
<defs>
  <linearGradient id="${u}h" x1=".2" y1="0" x2=".85" y2="1">
    <stop offset="0" stop-color="#1e56e8"/><stop offset=".45" stop-color="#3f9bfa"/><stop offset="1" stop-color="#9be6ff"/>
  </linearGradient>
  <linearGradient id="${u}i" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#123a8f"/><stop offset=".6" stop-color="#2f7bff"/><stop offset="1" stop-color="#7fdcff"/>
  </linearGradient>
  <linearGradient id="${u}d" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#1b3f8f"/><stop offset="1" stop-color="#0d1f4a"/>
  </linearGradient>
  <linearGradient id="${u}k" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#2f6ff5"/><stop offset="1" stop-color="#0d2a63"/>
  </linearGradient>
  <radialGradient id="${u}c" cx=".5" cy=".38" r=".68">
    <stop offset="0" stop-color="#fff8f2"/><stop offset="1" stop-color="#ffdfc9"/>
  </radialGradient>
</defs>
<ellipse cx="60" cy="170" rx="34" ry="5" fill="#4fd1e8" opacity=".14"/>
${tail}

<!-- 后发 -->
<path d="M60 12 C 28 12, 16 34, 18 62 C 19 92, 24 122, 28 150 C 38 154, 50 154, 54 150 C 44 126, 40 96, 42 66 C 43 40, 50 30, 60 30 C 70 30, 77 40, 78 66 C 80 96, 76 126, 66 150 C 70 154, 82 154, 92 150 C 96 122, 101 92, 102 62 C 104 34, 92 12, 60 12 Z" fill="url(#${u}h)"/>

<!-- 女仆长裙 -->
<path d="M38 98 C 46 93, 74 93, 82 98 L 95 154 C 78 163, 42 163, 25 154 Z" fill="url(#${u}d)"/>
<path d="M52 100 L 68 100 L 76 155 C 64 159, 56 159, 44 155 Z" fill="#f7fbff"/>
<rect x="41" y="110" width="38" height="7" rx="3.5" fill="#ffffff" opacity=".92"/>
<ellipse cx="34" cy="104" rx="11" ry="9.5" fill="#e8f2ff"/>
<ellipse cx="86" cy="104" rx="11" ry="9.5" fill="#e8f2ff"/>
<path d="M46 96 Q 60 110 74 96 L 74 102 Q 60 116 46 102 Z" fill="#ffffff" opacity=".95"/>
${armRight}

<!-- 脸 -->
<path d="M60 28 C 40 28, 34 44, 34 57 C 34 72, 46 84, 60 84 C 74 84, 86 72, 86 57 C 86 44, 80 28, 60 28 Z" fill="url(#${u}c)"/>

<!-- 鲸类头鳍 + 呆毛 -->
<path d="M47 24 C 44 13, 48 4, 56 1 C 53 9, 52 16, 53 25 Z" fill="url(#${u}k)"/>
<path d="M69 23 C 72 12, 78 6, 85 7 C 79 13, 75 18, 74 26 Z" fill="url(#${u}k)"/>
<path d="M60 21 C 61 10, 67 3, 75 4 C 67 9, 63 14, 62 22 Z" fill="url(#${u}h)"/>

<!-- 刘海 -->
<path d="M34 57 C 34 30, 44 19, 60 19 C 76 19, 86 30, 86 57 C 80 38, 72 32, 60 32 C 48 32, 40 38, 34 57 Z" fill="url(#${u}h)"/>
<path d="M42 34 C 48 26, 58 24, 66 27" fill="none" stroke="#bff0ff" stroke-width="2.2" opacity=".5" stroke-linecap="round"/>

${brows}
${eyes}
<ellipse cx="41" cy="67" rx="5.6" ry="2.9" fill="#ff9db4" opacity="${mood === "happy" || mood === "cheer" ? ".62" : ".42"}"/>
<ellipse cx="79" cy="67" rx="5.6" ry="2.9" fill="#ff9db4" opacity="${mood === "happy" || mood === "cheer" ? ".62" : ".42"}"/>
${mouth}
${extra}
</svg>`;
  }

  /* ---------- 场景 ---------- */
  function scene(mood) {
    return `<svg class="mscene" viewBox="0 0 300 182" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
<defs>
  <radialGradient id="msGlow" cx=".5" cy=".62" r=".62">
    <stop offset="0" stop-color="#2b6cff" stop-opacity=".34"/><stop offset="1" stop-color="#4fd1e8" stop-opacity="0"/>
  </radialGradient>
</defs>
<ellipse cx="150" cy="156" rx="146" ry="32" fill="url(#msGlow)"/>
<g class="ms-stars" fill="#bfe9ff">
  <circle cx="30" cy="22" r="1.3" opacity=".7"/><circle cx="56" cy="10" r=".9" opacity=".45"/>
  <circle cx="268" cy="26" r="1.2" opacity=".6"/><circle cx="288" cy="52" r=".9" opacity=".35"/>
  <circle cx="14" cy="64" r="1.1" opacity=".4"/><circle cx="250" cy="8" r="1" opacity=".45"/>
</g>
<g class="ms-whale" transform="translate(4,52) scale(5.3)"><g class="ms-whale-in">${whale(mood)}</g></g>
<g class="ms-girl" transform="translate(186,10) scale(0.88)"><g class="ms-girl-in">${girl(mood)}</g></g>
<g class="ms-bubbles" fill="#8fe6ff" opacity=".45">
  <circle cx="150" cy="128" r="2.1"/><circle cx="164" cy="112" r="1.4"/><circle cx="174" cy="134" r="1.1"/>
</g>
</svg>`;
  }

  /* ---------- 主视觉：宽幅深海场景（460 x 330） ---------- */
  function heroScene(mood) {
    const u = "hs" + uid();
    return `<svg viewBox="0 0 460 340" class="hero-scene" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
<defs>
  <linearGradient id="${u}ray" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#7fe3ff" stop-opacity=".28"/>
    <stop offset="1" stop-color="#7fe3ff" stop-opacity="0"/>
  </linearGradient>
  <radialGradient id="${u}halo" cx=".42" cy=".62" r=".58">
    <stop offset="0" stop-color="#2b6cff" stop-opacity=".36"/>
    <stop offset=".55" stop-color="#1d4ed8" stop-opacity=".15"/>
    <stop offset="1" stop-color="#4fd1e8" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="${u}floor" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#4fd1e8" stop-opacity="0"/>
    <stop offset=".35" stop-color="#4fd1e8" stop-opacity=".5"/>
    <stop offset=".7" stop-color="#a78bfa" stop-opacity=".32"/>
    <stop offset="1" stop-color="#4fd1e8" stop-opacity="0"/>
  </linearGradient>
  <clipPath id="${u}clip"><rect x="0" y="0" width="460" height="340"/></clipPath>
</defs>

<g clip-path="url(#${u}clip)">
  <ellipse cx="216" cy="212" rx="222" ry="122" fill="url(#${u}halo)"/>

  <g opacity=".5">
    <path d="M92 0 L138 0 L176 296 L112 296 Z" fill="url(#${u}ray)"/>
    <path d="M212 0 L238 0 L256 268 L222 268 Z" fill="url(#${u}ray)" opacity=".55"/>
    <path d="M318 0 L348 0 L356 232 L326 232 Z" fill="url(#${u}ray)" opacity=".38"/>
  </g>

  <g class="hs-stars" fill="#cfefff">
    <circle cx="44" cy="40" r="1.4" opacity=".65"/><circle cx="86" cy="22" r=".9" opacity=".4"/>
    <circle cx="416" cy="52" r="1.2" opacity=".5"/><circle cx="392" cy="24" r=".9" opacity=".35"/>
    <circle cx="360" cy="88" r="1" opacity=".3"/><circle cx="164" cy="28" r=".85" opacity=".35"/>
    <circle cx="286" cy="16" r="1.1" opacity=".45"/><circle cx="28" cy="126" r=".9" opacity=".28"/>
  </g>
  <g class="hs-fish" fill="#8fd8ff" opacity=".45">
    <ellipse cx="404" cy="148" rx="6.4" ry="2.9"/><path d="M397.6 148 l-5.6 -3.6 v7.2 Z"/>
    <ellipse cx="430" cy="168" rx="4.8" ry="2.2"/><path d="M425 168 l-4.4 -2.7 v5.4 Z"/>
    <ellipse cx="386" cy="186" rx="3.8" ry="1.8"/><path d="M382 186 l-3.6 -2.2 v4.4 Z"/>
  </g>

  <!-- 主鲸 -->
  <g class="hs-whale" transform="translate(18,74) scale(10.5)"><g class="hs-whale-in">${whale(mood)}</g></g>

  <g class="hs-bubbles" fill="#9fe9f7">
    <circle cx="134" cy="256" r="3.2" opacity=".45"/>
    <circle cx="158" cy="218" r="2.1" opacity=".4"/>
    <circle cx="176" cy="184" r="1.5" opacity=".3"/>
    <circle cx="272" cy="264" r="2.4" opacity=".35"/>
    <circle cx="288" cy="230" r="1.7" opacity=".28"/>
  </g>

  <path d="M0 322 C 80 314, 152 330, 232 322 C 312 314, 384 330, 460 320" fill="none" stroke="url(#${u}floor)" stroke-width="1.5"/>
  <ellipse cx="230" cy="330" rx="212" ry="14" fill="#2b6cff" opacity=".10"/>
</g>
</svg>`;
  }

  /* ---------- 小头像（右栏状态条用） ---------- */
  function avatar(mood) {
    const u = "av" + uid();
    return `<svg viewBox="0 0 96 96" class="mg-avatar" aria-hidden="true">
<defs>
  <linearGradient id="${u}r" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#4fd1e8" stop-opacity=".55"/><stop offset="1" stop-color="#a78bfa" stop-opacity=".2"/>
  </linearGradient>
</defs>
<circle cx="48" cy="48" r="45" fill="#0a1226"/>
<circle cx="48" cy="48" r="45" fill="none" stroke="url(#${u}r)" stroke-width="1.6"/>
<g transform="translate(9,6) scale(0.65)">${girl(mood)}</g>
</svg>`;
  }

  /* ---------- 迷你图标 ---------- */
  function miniWhale() {
    return `<svg viewBox="0 2.8 23.6 18.2" aria-hidden="true">
<defs>
  <linearGradient id="mwg" x1=".2" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#4a90ff"/><stop offset="1" stop-color="#0d2a63"/>
  </linearGradient>
</defs>
<circle cx="11.8" cy="11.8" r="11.4" fill="#0a1226" stroke="rgba(79,209,232,.35)" stroke-width=".5"/>
<g transform="translate(1.4,2.6) scale(.86)">
  <path d="${WHALE_MAIN}" fill="url(#mwg)"/>
  <path d="${WHALE_DETAIL}" fill="#bfe8ff" opacity=".9"/>
</g>
</svg>`;
  }

  function miniGirl() {
    return `<svg viewBox="0 0 120 176" aria-hidden="true">
<circle cx="60" cy="60" r="58" fill="#0a1226" stroke="rgba(139,92,246,.3)" stroke-width="2"/>
<g transform="translate(18,-4) scale(.7)">${girl("idle")}</g>
</svg>`;
  }

  window.MASCOT = {
    whale, girl, scene, heroScene, avatar, miniWhale, miniGirl,

    moodFor(p) {
      if (p.done >= 80) return "cheer";
      if (p.done >= 30) return "happy";
      return "idle";
    },

    line(mood, ctx) {
      const lines = {
        idle: [
          "先把 <b>一句话本质</b> 过一遍，再动手写，速度会快一倍。",
          "别急着刷下一题 —— 先说出这题的<b>不变量</b>。",
          "40 道不算慢，怕的是 40 道都只是「看过答案」。",
          "C++ 模板已经默认打开了，想换 Python 点代码块右上角。"
        ],
        happy: [
          "节奏不错，接下来用<b>抽考</b>把会的题重排一遍。",
          "过了一半，剩下的按 <b>分类</b> 扫，别按题号扫。",
          "错题里躺着的，才是真正要花时间的。"
        ],
        cheer: [
          "全部通关了！现在开始<b>限时重刷</b>，目标 15 分钟一道。",
          "记住：模板是手感的来源，不是记忆的负担。"
        ],
        think: [
          "先想：这题属于哪个<b>模板家族</b>？再想细节。",
          "写不出来就回到「一句话本质」，别从代码开始。"
        ]
      };
      const arr = lines[mood] || lines.idle;
      if (ctx && ctx.hint) return ctx.hint;
      return arr[Math.floor(Math.random() * arr.length)];
    }
  };
})();
