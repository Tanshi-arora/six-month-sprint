// Bun, the resident coach: a hand-drawn SVG bunny that reacts to your day.
// Moods: start (morning, nothing yet), great, happy, ok, sad, angry.
(function () {
  const INK = "#4a4350", PINK = "#f8c7d4", BLUSH = "#f7afc2";

  function ears(mood) {
    // pivot at the ear BASE (where it meets the head) so droops hang beside the face
    const droop = mood === "sad";
    const back = mood === "angry";
    const aL = droop ? -100 : back ? -24 : -10;
    const aR = droop ? 100 : back ? 24 : 10;
    const ear = (cx, a) => `
      <g transform="rotate(${a} ${cx} 56)">
        <ellipse cx="${cx}" cy="30" rx="13" ry="27" fill="#fff" stroke="${INK}" stroke-width="2.5"/>
        <ellipse cx="${cx}" cy="33" rx="6.5" ry="17" fill="${PINK}"/>
      </g>`;
    return ear(58, aL) + ear(102, aR);
  }

  function eyes(mood) {
    const dot = (x) => `<circle cx="${x}" cy="84" r="5" fill="${INK}"/><circle cx="${x + 1.8}" cy="82" r="1.7" fill="#fff"/>`;
    switch (mood) {
      case "great": // happy closed arcs
        return `<path d="M52 86 Q60 76 68 86" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
                <path d="M92 86 Q100 76 108 86" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
      case "happy":
        return dot(60) + dot(100) +
          `<path d="M50 74 Q60 70 70 74" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>
           <path d="M90 74 Q100 70 110 74" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`;
      case "ok":
        return dot(60) + dot(100);
      case "sad":
        return dot(60) + dot(100) +
          `<path d="M50 73 Q60 78 68 75" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>
           <path d="M110 73 Q100 78 92 75" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>
           <path d="M108 92 q5 8 0 11 q-5 -3 0 -11" fill="#aeddf5" stroke="#8cc7e8" stroke-width="1"/>`;
      case "angry": // half-lidded glare like an unimpressed gym coach
        return `<path d="M49 76 L69 83" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
                <path d="M111 76 L91 83" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
                <path d="M54 88 a6 5 0 0 1 12 0 Z" fill="${INK}"/>
                <path d="M94 88 a6 5 0 0 1 12 0 Z" fill="${INK}"/>`;
      default: // start: sleepy soft lids
        return `<path d="M52 85 Q60 90 68 85" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
                <path d="M92 85 Q100 90 108 85" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
    }
  }

  function mouth(mood) {
    const tooth = (y) => `<rect x="76.5" y="${y}" width="7" height="6.5" rx="2" fill="#fff" stroke="${INK}" stroke-width="1.8"/>`;
    switch (mood) {
      case "great":
        return `<path d="M67 99 Q80 115 93 99 Q80 105 67 99 Z" fill="#6b4a55" stroke="${INK}" stroke-width="2"/>
                <ellipse cx="80" cy="106" rx="6" ry="3" fill="${BLUSH}"/>` + tooth(98);
      case "happy":
        return `<path d="M69 100 Q80 110 91 100" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>` + tooth(100);
      case "ok":
        return `<path d="M72 103 L88 103" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>` + tooth(103.5);
      case "sad":
        return `<path d="M70 107 Q80 98 90 107" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`;
      case "angry":
        return `<path d="M69 103 q5.5 -5 11 0 q5.5 5 11 0" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`;
      default: // start: little yawn
        return `<ellipse cx="80" cy="104" rx="5" ry="6" fill="#6b4a55" stroke="${INK}" stroke-width="1.8"/>`;
    }
  }

  function extras(mood) {
    if (mood === "great") return `
      <g transform="translate(127,86)">
        <ellipse cx="0" cy="8" rx="9" ry="10" fill="#fff" stroke="${INK}" stroke-width="2.5"/>
        <rect x="-4" y="-12" width="8" height="15" rx="4" fill="#fff" stroke="${INK}" stroke-width="2.5" transform="rotate(-18)"/>
      </g>
      <g fill="#f2c14e">
        <path d="M30 50 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5 Z"/>
        <path d="M128 34 l2 4.8 4.8 2 -4.8 2 -2 4.8 -2 -4.8 -4.8 -2 4.8 -2 Z"/>
        <path d="M140 64 l1.5 3.6 3.6 1.5 -3.6 1.5 -1.5 3.6 -1.5 -3.6 -3.6 -1.5 3.6 -1.5 Z"/>
      </g>`;
    if (mood === "angry") return `
      <g stroke="#ef6a6a" stroke-width="2.5" stroke-linecap="round" fill="none">
        <path d="M128 40 q4 -2 5 -7"/><path d="M134 46 q5 0 8 -4"/>
        <path d="M124 34 q1 -5 -2 -8"/>
      </g>
      <g transform="translate(118,124)">
        <rect x="-2" y="-3" width="26" height="6" rx="3" fill="#f48fb1" stroke="${INK}" stroke-width="2"/>
        <rect x="-8" y="-8" width="9" height="16" rx="3" fill="#f8a8c5" stroke="${INK}" stroke-width="2"/>
        <rect x="21" y="-8" width="9" height="16" rx="3" fill="#f8a8c5" stroke="${INK}" stroke-width="2"/>
      </g>`;
    if (mood === "start") return `
      <g transform="translate(118,114)">
        <rect x="0" y="0" width="16" height="14" rx="3" fill="#fff" stroke="${INK}" stroke-width="2.2"/>
        <path d="M16 4 q7 1 0 7" fill="none" stroke="${INK}" stroke-width="2.2"/>
        <path d="M4 -4 q2 -3 0 -6 M9 -3 q2 -3 0 -6" fill="none" stroke="#b9b3c4" stroke-width="2" stroke-linecap="round"/>
      </g>`;
    return "";
  }

  function svg(mood) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 150" class="mascot-svg" role="img" aria-label="Bun the coach, feeling ${mood}">
      <ellipse cx="80" cy="140" rx="46" ry="7" fill="#d9d2e6" opacity=".5"/>
      ${ears(mood)}
      <path d="M80 134 C42 134 27 108 31 85 C35 61 53 45 80 45 C107 45 125 61 129 85 C133 108 118 134 80 134 Z"
        fill="#fff" stroke="${INK}" stroke-width="2.5"/>
      <ellipse cx="42" cy="100" rx="8" ry="11" fill="#fff" stroke="${INK}" stroke-width="2.2" transform="rotate(18 42 100)"/>
      ${mood !== "great" ? `<ellipse cx="118" cy="100" rx="8" ry="11" fill="#fff" stroke="${INK}" stroke-width="2.2" transform="rotate(-18 118 100)"/>` : ""}
      <ellipse cx="62" cy="133" rx="11" ry="6.5" fill="#fff" stroke="${INK}" stroke-width="2.2"/>
      <ellipse cx="98" cy="133" rx="11" ry="6.5" fill="#fff" stroke="${INK}" stroke-width="2.2"/>
      <ellipse cx="50" cy="95" rx="7.5" ry="4.5" fill="${BLUSH}" opacity=".75"/>
      <ellipse cx="110" cy="95" rx="7.5" ry="4.5" fill="${BLUSH}" opacity=".75"/>
      <path d="M77 93 q3 -2.5 6 0 q-1.5 3 -3 3 q-1.5 0 -3 -3 Z" fill="${BLUSH}" stroke="${INK}" stroke-width="1.6"/>
      ${eyes(mood)}
      ${mouth(mood)}
      ${extras(mood)}
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
