// Bun, the resident coach: a hand-drawn, CSS-animated SVG bunny that reacts to your day.
// Moods: start (morning, nothing yet), great, happy, ok, sad, angry.
(function () {
  const INK = "#4a4350", PINK = "#f8c7d4", BLUSH = "#f5b3c6", MOUTH = "#6b4a55";

  function ears(mood) {
    // pivot at the ear BASE; short, wide, soft ears
    const droop = mood === "sad";
    const back = mood === "angry";
    const aL = droop ? -95 : back ? -20 : -8;
    const aR = droop ? 95 : back ? 20 : 8;
    const ear = (cx, a, cls) => `
      <g class="${cls}"><g transform="rotate(${a} ${cx} 58)">
        <ellipse cx="${cx}" cy="36" rx="15" ry="23" fill="#fff" stroke="${INK}" stroke-width="2.5"/>
        <ellipse cx="${cx}" cy="40" rx="8" ry="14" fill="${PINK}"/>
      </g></g>`;
    return ear(60, aL, "m-earL") + ear(100, aR, "m-earR");
  }

  function brows(mood) {
    switch (mood) {
      case "happy":
        return `<path d="M48 70 Q59 64 70 70" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>
                <path d="M90 70 Q101 64 112 70" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`;
      case "sad":
        return `<path d="M48 70 Q60 76 70 72" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>
                <path d="M112 70 Q100 76 90 72" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`;
      case "angry":
        return `<path d="M46 72 L72 82" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>
                <path d="M114 72 L88 82" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>`;
      default: return "";
    }
  }

  function eyes(mood) {
    const big = (x) => `<circle cx="${x}" cy="84" r="7.2" fill="${INK}"/>
      <circle cx="${x + 2.6}" cy="81" r="2.7" fill="#fff" opacity=".95"/>
      <circle cx="${x - 2.2}" cy="87" r="1.3" fill="#fff" opacity=".8"/>`;
    switch (mood) {
      case "great": // joyful closed arcs
        return `<path d="M48 86 Q59 72 70 86" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
                <path d="M90 86 Q101 72 112 86" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
      case "angry": // glaring half-moons under heavy brows
        return `<path d="M51 90 a8 6.5 0 0 1 16 0 Z" fill="${INK}"/>
                <path d="M93 90 a8 6.5 0 0 1 16 0 Z" fill="${INK}"/>
                <circle cx="62" cy="87" r="1.6" fill="#fff" opacity=".9"/>
                <circle cx="104" cy="87" r="1.6" fill="#fff" opacity=".9"/>`;
      case "start": // sleepy closed lids with little lashes
        return `<path d="M48 85 Q59 92 70 85" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
                <path d="M90 85 Q101 92 112 85" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
                <path d="M54 91 l-2 3 M66 91 l2 3 M96 91 l-2 3 M108 91 l2 3" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>`;
      default:
        return big(59) + big(101);
    }
  }

  function mouth(mood) {
    const tooth = (x, y) => `<rect x="${x}" y="${y}" width="8" height="7" rx="2.5" fill="#fff" stroke="${INK}" stroke-width="2"/>`;
    switch (mood) {
      case "great":
        return `<path d="M62 99 Q80 122 98 99 Q80 107 62 99 Z" fill="${MOUTH}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
                <ellipse cx="80" cy="109" rx="7" ry="3.5" fill="${BLUSH}"/>` + tooth(76, 97.5);
      case "happy":
        return `<path d="M66 100 Q80 114 94 100" fill="none" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/>` + tooth(76, 100.5);
      case "ok":
        return `<path d="M71 104 L89 104" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>` + tooth(76, 105);
      case "sad":
        return `<path d="M68 110 Q80 99 92 110" fill="none" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/>`;
      case "angry": // gritted teeth
        return `<rect x="66" y="99" width="28" height="9.5" rx="4.5" fill="#fff" stroke="${INK}" stroke-width="2.4"/>
                <path d="M73.5 99.5 v8.5 M80 99.5 v8.5 M86.5 99.5 v8.5" stroke="${INK}" stroke-width="1.7"/>`;
      default: // start: round yawn
        return `<ellipse cx="80" cy="105" rx="6.5" ry="7.5" fill="${MOUTH}" stroke="${INK}" stroke-width="2"/>
                <ellipse cx="80" cy="108" rx="3.5" ry="2.5" fill="${BLUSH}"/>`;
    }
  }

  function extras(mood) {
    if (mood === "great") return `
      <g class="m-thumb"><g transform="translate(127,86)">
        <ellipse cx="0" cy="8" rx="9" ry="10" fill="#fff" stroke="${INK}" stroke-width="2.5"/>
        <rect x="-4" y="-12" width="8" height="15" rx="4" fill="#fff" stroke="${INK}" stroke-width="2.5" transform="rotate(-18)"/>
      </g></g>
      <g fill="#f2c14e">
        <path class="m-spark s1" d="M30 50 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5 Z"/>
        <path class="m-spark s2" d="M128 34 l2 4.8 4.8 2 -4.8 2 -2 4.8 -2 -4.8 -4.8 -2 4.8 -2 Z"/>
        <path class="m-spark s3" d="M140 64 l1.5 3.6 3.6 1.5 -3.6 1.5 -1.5 3.6 -1.5 -3.6 -3.6 -1.5 3.6 -1.5 Z"/>
      </g>`;
    if (mood === "sad") return `
      <path class="m-tear" d="M108 90 q6 9 0 13 q-6 -4 0 -13" fill="#aeddf5" stroke="#8cc7e8" stroke-width="1.2"/>`;
    if (mood === "angry") return `
      <g class="m-mark" stroke="#ef6a6a" stroke-width="2.8" stroke-linecap="round" fill="none">
        <path d="M128 40 q4 -2 5 -7"/><path d="M134 46 q5 0 8 -4"/>
        <path d="M124 34 q1 -5 -2 -8"/>
      </g>
      <g transform="translate(116,124)">
        <rect x="-2" y="-3" width="26" height="6" rx="3" fill="#f48fb1" stroke="${INK}" stroke-width="2"/>
        <rect x="-8" y="-8" width="9" height="16" rx="3" fill="#f8a8c5" stroke="${INK}" stroke-width="2"/>
        <rect x="21" y="-8" width="9" height="16" rx="3" fill="#f8a8c5" stroke="${INK}" stroke-width="2"/>
      </g>`;
    if (mood === "start") return `
      <g transform="translate(118,112)">
        <rect x="0" y="0" width="16" height="14" rx="3" fill="#fff" stroke="${INK}" stroke-width="2.2"/>
        <path d="M16 4 q7 1 0 7" fill="none" stroke="${INK}" stroke-width="2.2"/>
        <g class="m-steam" fill="none" stroke="#b9b3c4" stroke-width="2" stroke-linecap="round">
          <path d="M4 -4 q2 -3 0 -6"/><path d="M9 -3 q2 -3 0 -6"/>
        </g>
      </g>`;
    return "";
  }

  function svg(mood) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 152" class="mascot-svg mood-${mood}" role="img" aria-label="Bun the coach, feeling ${mood}">
      <defs><filter id="bunsoft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.6"/></filter></defs>
      <ellipse class="m-shadow" cx="80" cy="142" rx="46" ry="7" fill="#d9d2e6" opacity=".5"/>
      <g class="bun">
        ${ears(mood)}
        <!-- feet & arms tucked BEHIND the body so just the tips peek out -->
        <ellipse cx="60" cy="136" rx="12" ry="8" fill="#fff" stroke="${INK}" stroke-width="2.2"/>
        <ellipse cx="100" cy="136" rx="12" ry="8" fill="#fff" stroke="${INK}" stroke-width="2.2"/>
        <ellipse cx="36" cy="100" rx="9" ry="12" fill="#fff" stroke="${INK}" stroke-width="2.2" transform="rotate(16 36 100)"/>
        <ellipse cx="124" cy="100" rx="9" ry="12" fill="#fff" stroke="${INK}" stroke-width="2.2" transform="rotate(-16 124 100)"/>
        <path d="M80 134 C42 134 27 108 31 85 C35 61 53 45 80 45 C107 45 125 61 129 85 C133 108 118 134 80 134 Z"
          fill="#fff" stroke="${INK}" stroke-width="2.5"/>
        <!-- soft airbrushed cheeks -->
        <ellipse cx="48" cy="97" rx="9.5" ry="5.5" fill="${BLUSH}" opacity=".55" filter="url(#bunsoft)"/>
        <ellipse cx="112" cy="97" rx="9.5" ry="5.5" fill="${BLUSH}" opacity=".55" filter="url(#bunsoft)"/>
        ${brows(mood)}
        ${eyes(mood)}
        <path d="M76.5 93 q3.5 -3 7 0 q-1.8 3.5 -3.5 3.5 q-1.7 0 -3.5 -3.5 Z" fill="${BLUSH}" stroke="${INK}" stroke-width="1.6"/>
        ${mouth(mood)}
        ${extras(mood)}
      </g>
    </svg>`;
  }

  // Decide mood + message for a given day key.
  function assess(dayKey) {
    const r = window.S.days[dayKey];
    const logged = !!(r && (r.wake !== null || r.office || r.gymClass || r.steps10k || r.iron || r.b12 || r.vitd ||
      (r.foods && r.foods.length) || r.dilr || r.rc || r.aeon || (r.vocabPages || 0) > 0 || Object.keys(r.qa || {}).length));
    const score = window.Score.overallToday(dayKey);
    const isToday = dayKey === D.fmtKey(D.today());
    const hour = new Date().getHours();
    const v = Number(dayKey.slice(8, 10)) % 2; // alternate phrasings by date

    if (!logged) {
      if (isToday && hour < 12) return { mood: "start", head: v ? "Morning! Clean slate ☀️" : "Fresh day, fresh chances", sub: "Log your wake-up and let's get rolling. I'll be watching 👀" };
      if (isToday && hour < 18) return { mood: "ok", head: "Nothing logged yet today", sub: "No stress. One tap on any card below gets us started." };
      if (isToday) return { mood: "angry", head: "GRRR. Empty day?!", sub: "Me and my pink dumbbell are waiting. Log ONE thing before bed. Just one." };
      return { mood: "sad", head: "This day went unlogged", sub: "It happens. The streak restarts the moment you log today." };
    }
    if (score >= 80) return { mood: "great", head: v ? `${score}% today. THUMBS UP! 🎉` : `${score}%! Absolute machine 💪`, sub: "This is exactly how CAT 2026 gets crushed. Same again tomorrow?" };
    if (score >= 60) return { mood: "happy", head: v ? `${score}% today, solid work!` : `${score}%! I'm doing a happy wiggle`, sub: "Push one more card above 80 and I break out the sparkles." };
    if (score >= 40) return { mood: "ok", head: `${score}%. We move.`, sub: "Decent base. Pick the weakest card below and bump it before bed." };
    if (score >= 20) return { mood: "sad", head: `${score}%... I still believe in you`, sub: "Rough days happen. One small log right now turns the day around." };
    return { mood: "angry", head: `${score}%?! My ears went back`, sub: "Not shame, just fire. Easiest 10 points: vitamins plus a 10k-step walk." };
  }

  window.Mascot = { svg, assess };
})();
