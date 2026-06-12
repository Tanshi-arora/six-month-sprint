// Blob, the resident coach: a meme-sticker style white blob (thick outlines, dot eyes,
// maximum attitude) that reacts to your day. CSS-animated.
// Moods: start, great, happy, ok, sad, angry.
(function () {
  const INK = "#1f1d22", BLUSH = "#f29db4", TONGUE = "#f0808f";

  const blushDashes = `
    <path d="M34 96 l-5 8 M42 99 l-5 8" stroke="${BLUSH}" stroke-width="3" stroke-linecap="round"/>
    <path d="M136 96 l5 8 M128 99 l5 8" stroke="${BLUSH}" stroke-width="3" stroke-linecap="round"/>`;

  function face(mood) {
    const dot = (x) => `<circle cx="${x}" cy="92" r="5.5" fill="${INK}"/>`;
    const glint = (x) => `<circle cx="${x + 2}" cy="90" r="1.6" fill="#fff"/>`;
    switch (mood) {
      case "great": // thug-life pixel shades + smug smile + sparkles
        return `
          <g fill="#15131a">
            <rect x="30" y="80" width="110" height="7"/>
            <rect x="42" y="87" width="30" height="11"/><rect x="47" y="98" width="20" height="6"/>
            <rect x="98" y="87" width="30" height="11"/><rect x="103" y="98" width="20" height="6"/>
          </g>
          <path d="M76 116 Q85 123 94 116" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
          ${blushDashes}`;
      case "happy": // cheeky wink + tongue out
        return `
          ${dot(58)}
          <path d="M104 90 Q112 83 120 90" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>
          <path d="M72 111 q13 -3 26 0" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
          <g class="m-tongue"><path d="M80 112 q2 15 10 14 q8 -1 7 -14 q-8 3 -17 0 Z" fill="${TONGUE}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/></g>
          ${blushDashes}`;
      case "ok":
        return `
          ${dot(58)}${dot(112)}${glint(58)}${glint(112)}
          <path d="M77 114 L93 114" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
          <g class="m-dots" fill="#b9b3c4">
            <circle class="d1" cx="150" cy="78" r="3.5"/><circle class="d2" cx="155" cy="92" r="3.5"/><circle class="d3" cx="150" cy="106" r="3.5"/>
          </g>`;
      case "sad":
        return `
          <path d="M46 79 Q57 86 68 81" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
          <path d="M124 79 Q113 86 102 81" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
          ${dot(58)}${dot(112)}${glint(58)}${glint(112)}
          <path d="M73 118 q4 -5 8 0 q4 5 8 0" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
          <path class="m-tear" d="M120 98 q7 10 0 15 q-7 -5 0 -15" fill="#aeddf5" stroke="#7fbede" stroke-width="2"/>`;
      case "angry": // gritted teeth, anger mark, and the legendary cleaver
        return `
          <path d="M46 76 L70 87" stroke="${INK}" stroke-width="5.5" stroke-linecap="round"/>
          <path d="M124 76 L100 87" stroke="${INK}" stroke-width="5.5" stroke-linecap="round"/>
          ${dot(58)}${dot(112)}
          <rect x="71" y="108" width="28" height="9" rx="4.5" fill="#fff" stroke="${INK}" stroke-width="3.5"/>
          <path d="M80 108.5 v8 M89 108.5 v8" stroke="${INK}" stroke-width="2.5"/>
          <g class="m-mark" stroke="#ef6a6a" stroke-width="3.5" stroke-linecap="round" fill="none">
            <path d="M26 38 q-5 -1 -7 -6"/><path d="M32 32 q-1 -5 3 -9"/><path d="M22 48 q-6 1 -9 -3"/>
          </g>`;
      default: // start: sleepy ∪∪ eyes + tiny o mouth
        return `
          <path d="M49 92 Q58 100 67 92" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>
          <path d="M103 92 Q112 100 121 92" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>
          <ellipse cx="85" cy="115" rx="5" ry="6" fill="${INK}"/>
          ${blushDashes}`;
    }
  }

  function extras(mood) {
    if (mood === "great") return `
      <path d="M79 140 l4 11 M88 138 l4 11 M97 136 l4 11" stroke="#c9c4d4" stroke-width="3.5" stroke-linecap="round"/>
      <g fill="#f2c14e">
        <path class="m-spark s1" d="M22 52 l2.7 6.5 6.5 2.7 -6.5 2.7 -2.7 6.5 -2.7 -6.5 -6.5 -2.7 6.5 -2.7 Z"/>
        <path class="m-spark s2" d="M142 30 l2.2 5.3 5.3 2.2 -5.3 2.2 -2.2 5.3 -2.2 -5.3 -5.3 -2.2 5.3 -2.2 Z"/>
        <path class="m-spark s3" d="M156 70 l1.7 4 4 1.7 -4 1.7 -1.7 4 -1.7 -4 -4 -1.7 4 -1.7 Z"/>
      </g>`;
    if (mood === "angry") return `
      <g class="m-knife"><g transform="translate(124,14) rotate(38)">
        <rect x="0" y="0" width="52" height="24" rx="5" fill="#e6e9ee" stroke="${INK}" stroke-width="4"/>
        <path d="M8 6 l14 12 M20 4 l14 12 M32 2 l14 12" stroke="#b9bfc9" stroke-width="4" stroke-linecap="round"/>
        <rect x="50" y="6" width="18" height="12" rx="5" fill="#b98b5a" stroke="${INK}" stroke-width="4"/>
      </g></g>
      <path class="m-spark s2" d="M120 6 l2.2 5.3 5.3 2.2 -5.3 2.2 -2.2 5.3 -2.2 -5.3 -5.3 -2.2 5.3 -2.2 Z" fill="#f2c14e"/>
      <path d="M76 140 l3 11 M85 139 l3 11 M94 138 l3 11" stroke="#c9c4d4" stroke-width="3.5" stroke-linecap="round"/>`;
    if (mood === "start") return `
      <g transform="translate(124,134)">
        <rect x="0" y="0" width="18" height="16" rx="3.5" fill="#fff" stroke="${INK}" stroke-width="3.5"/>
        <path d="M18 4 q8 2 0 9" fill="none" stroke="${INK}" stroke-width="3.5"/>
        <g class="m-steam" fill="none" stroke="#b9b3c4" stroke-width="2.5" stroke-linecap="round">
          <path d="M5 -5 q2.5 -3.5 0 -7"/><path d="M11 -4 q2.5 -3.5 0 -7"/>
        </g>
      </g>`;
    return "";
  }

  function svg(mood) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 178" class="mascot-svg mood-${mood}" role="img" aria-label="Blob the coach, feeling ${mood}">
      <ellipse class="m-shadow" cx="85" cy="171" rx="46" ry="6" fill="#d9d2e6" opacity=".5"/>
      <g class="bun">
        <!-- tiny body + stub arms behind the giant head -->
        <path d="M57 170 L57 140 Q57 125 70 125 L100 125 Q113 125 113 140 L113 170"
          fill="#fff" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>
        <ellipse cx="85" cy="76" rx="59" ry="57" fill="#fff" stroke="${INK}" stroke-width="5"/>
        ${face(mood)}
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
      if (isToday) return { mood: "angry", head: "Empty day?! Don't make me use this 🔪", sub: "The cleaver is for the excuses, not you. Log ONE thing and I put it down." };
      return { mood: "sad", head: "This day went unlogged", sub: "It happens. The streak restarts the moment you log today." };
    }
    if (score >= 80) return { mood: "great", head: v ? `${score}% today. Too cool 😎` : `${score}%! Absolute machine`, sub: "This is exactly how CAT 2026 gets crushed. Same again tomorrow?" };
    if (score >= 60) return { mood: "happy", head: v ? `${score}% today, solid work!` : `${score}%! Bleh :P that's a good day`, sub: "Push one more card above 80 and the sunglasses come out." };
    if (score >= 40) return { mood: "ok", head: `${score}%. We move.`, sub: "Decent base. Pick the weakest card below and bump it before bed." };
    if (score >= 20) return { mood: "sad", head: `${score}%... I still believe in you`, sub: "Rough days happen. One small log right now turns the day around." };
    return { mood: "angry", head: `${score}%?! The cleaver is out`, sub: "Not shame, just fire. Easiest 10 points: vitamins plus a 10k-step walk." };
  }

  window.Mascot = { svg, assess };
})();
