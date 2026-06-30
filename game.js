// Game Mode — a play layer on top of the existing scores. Pure functions read window.S / window.Score.
// ONE credit currency: you bank credits from momentum/combos/streaks/weekly/monthly and spend them on
// anything. Balance may go negative. Rewards scale by today's band (no hard cliff).
(function () {
  const { fmtKey, parseKey, addDays, today, weekKeys, monday, monthKeys } = window.D;

  const EARN = {
    mom: { 20: 200, 10: 100, 5: 50, small: 25, held: 25 }, // by improvement vs yesterday (held = maintained)
    bonus80: 50, chest: 200, combo: 25,
    streak: { 3: 150, 5: 200, 10: 500, 20: 1000 },
    weekly: { diet: 200, study: 300, gym: 250, wake: 150 },
    month: 1000,
  };
  const BAD = 40;          // below this % = a "default" day (feeds the slump penalty)
  const FLOOR = 30;        // below this % a day banks nothing; 30-49 = half, 50+ = full
  const MONTH_FRAC = 0.7;  // a "good month" = ≥70% of the month's tracked days are wins
  const WEEKLY_TARGETS = { diet: 5, study: 6, gym: 4, wake: 6 };

  // ONE currency. Quick-buys have set prices; the free-form spends take the actual amount.
  const REWARDS = [
    { id: "coffee", name: "Coffee", emoji: "☕", cost: 100 },
    { id: "treat", name: "Sweet Treat", emoji: "🍰", cost: 150 },
    { id: "momos", name: "Momos", emoji: "🥟", cost: 250 },
    { id: "meal", name: "Meal", emoji: "🍔", cost: 500 },
  ];
  const SPEND_CATS = [
    { id: "shopping", emoji: "🛍️", name: "Shopping" },
    { id: "salon", emoji: "💇", name: "Salon" },
    { id: "trip", emoji: "✈️", name: "Trip" },
    { id: "other", emoji: "✨", name: "Other" },
  ];
  const LADDERS = {
    Study: ["QA questions", "1 DILR set", "20 min reading", "1 vocab session"],
    Gym: ["Gym class", "10k steps", "30 min walk", "15 min stretch"],
    Diet: ["Hit calories", "Hit 90g protein", "Log a balanced meal", "Water + fruit"],
  };
  const SKIP_RULES = {
    gym: { label: "Skip Gym", needs: "Diet 90+ · OR +20 QA · OR 2 DILR sets" },
    diet: { label: "Skip Diet", needs: "Gym class · OR 10k steps" },
    study: { label: "Skip Study", needs: "Gym done AND Diet 90+" },
  };

  const PLAN_START = window.PLAN_START || "2026-06-15";
  const S = () => window.S;
  const Score = () => window.Score;
  const hasData = (k) => Score().dailyActivity(k) > 0;
  const prevKey = (k) => fmtKey(addDays(parseKey(k), -1));

  // Today's score with a compensated skip removed (its weight re-balances, like office on off-days).
  function questScore(key) {
    const c = Score().dailyScores(key);
    const W = Score().WEIGHTS;
    const sk = skipState(key);
    const drop = sk.cat && sk.met ? sk.cat : null;
    let sum = 0, wsum = 0;
    for (const k in W) { if (c[k] == null || k === drop) continue; sum += c[k] * W[k]; wsum += W[k]; }
    return wsum ? Math.round(sum / wsum) : 0;
  }

  // A "win" (for streaks / monthly): ≥30% and either improved ≥5pts on yesterday or held a solid 50%+.
  function goodDay(key) {
    if (!hasData(key)) return false;
    const t = questScore(key);
    if (t < FLOOR) return false;
    return (t - questScore(prevKey(key))) >= 5 || t >= 50;
  }

  function streakEndingAt(key) {
    let n = 0, k = key;
    while (k >= PLAN_START && goodDay(k)) { n++; k = prevKey(k); }
    return n;
  }
  function currentStreak() {
    let k = fmtKey(today());
    if (!hasData(k)) k = prevKey(k);
    return streakEndingAt(k);
  }

  // ---- combos ----
  function combosFor(key) {
    const r = S().days[key] || {};
    const ds = Score().dailyScores(key);
    const gymWin = !!(r.gymClass || r.steps10k);
    const dietWin = (Score().dietDay(key).score || 0) >= 80;
    const studyWin = (ds.study || 0) > 0;
    const readWin = (r.readMin || 0) >= 20;
    const wakeWin = r.wake === true || !!r.wakeTime;
    const out = [];
    if (gymWin && dietWin) out.push({ name: "Fitness Combo", emoji: "🏋️" });
    if (studyWin && readWin) out.push({ name: "Scholar Combo", emoji: "📚" });
    if (wakeWin && gymWin) out.push({ name: "Morning Warrior", emoji: "🌅" });
    return out;
  }

  // ---- strategic skip ----
  function skipState(key) {
    const r = S().days[key] || {};
    const cat = r.skipCat || null;
    if (!cat) return { cat: null, met: false };
    const diet = Score().dietDay(key).score || 0;
    const qaToday = qaQuestionsToday(key);
    const dilrSets = Math.floor(daySub(key, "dilr") / 4);
    let met = false;
    if (cat === "gym") met = diet >= 90 || qaToday >= 20 || dilrSets >= 2;
    else if (cat === "diet") met = !!(r.gymClass || r.steps10k);
    else if (cat === "study") met = !!(r.gymClass || r.steps10k) && diet >= 90;
    return { cat, met, needs: SKIP_RULES[cat] ? SKIP_RULES[cat].needs : "" };
  }
  function qaQuestionsToday(key) {
    const r = S().days[key] || {}; const qa = r.qa || {};
    return S().chapters.filter((c) => (c.subject || "qa") === "qa").reduce((a, c) => a + (qa[c.id] || 0), 0);
  }
  function daySub(key, subject) {
    const r = S().days[key] || {}; const qa = r.qa || {};
    return S().chapters.filter((c) => (c.subject || "qa") === subject).reduce((a, c) => a + (qa[c.id] || 0), 0);
  }

  // ---- weekly targets ----
  function weeklyProgress(d) {
    const keys = weekKeys(d).filter((k) => k >= PLAN_START && k <= fmtKey(today()));
    let diet = 0, study = 0, gym = 0, wake = 0;
    for (const k of keys) {
      const r = S().days[k]; if (!r) continue;
      if ((Score().dietDay(k).score || 0) >= 80) diet++;
      if ((Score().dailyScores(k).study || 0) > 0) study++;
      if (r.gymClass) gym++;
      if (r.wake === true || r.wakeTime) wake++;
    }
    return {
      diet: { have: diet, need: WEEKLY_TARGETS.diet, reward: EARN.weekly.diet, label: "Sweet treat" },
      study: { have: study, need: WEEKLY_TARGETS.study, reward: EARN.weekly.study, label: "Shopping" },
      gym: { have: gym, need: WEEKLY_TARGETS.gym, reward: EARN.weekly.gym, label: "Favourite meal" },
      wake: { have: wake, need: WEEKLY_TARGETS.wake, reward: EARN.weekly.wake, label: "Sleep in" },
    };
  }

  // ---- monthly milestone ----
  function monthGood(d) {
    const keys = monthKeys(d).filter((k) => k >= PLAN_START && k <= fmtKey(today()));
    const have = keys.filter((k) => goodDay(k)).length;
    const need = Math.max(1, Math.round(keys.length * MONTH_FRAC));
    return { have, need, avail: keys.length, earned: have >= need };
  }
  function claimedThisMonth(id) {
    const ym = fmtKey(today()).slice(0, 7);
    return (((S().game && S().game.claims) || []).some((c) => c.id === id && (c.date || "").slice(0, 7) === ym));
  }
  function canNightOut() { return monthGood(today()).earned && !claimedThisMonth("nightout"); }

  // ---- earnings ----
  function allDayKeys() {
    const out = []; let k = PLAN_START; const end = fmtKey(today()); let guard = 0;
    while (k <= end && guard++ < 800) { out.push(k); k = fmtKey(addDays(parseKey(k), 1)); }
    return out;
  }
  // Momentum: rewards IMPROVEMENT over yesterday, scaled by today's band (no 50% cliff).
  // <30% → nothing · 30-49% → half · 50%+ → full · 80%+ → +bonus · 100% → chest.
  function dayEvents(key) {
    if (!hasData(key)) return [];
    const t = questScore(key);
    if (t < FLOOR) return [];
    const y = questScore(prevKey(key));
    const delta = t - y;
    const mult = t < 50 ? 0.5 : 1;
    const ev = [];
    let base, lbl;
    if (delta >= 20) { base = EARN.mom[20]; lbl = `Momentum +${delta}% → ${t}%`; }
    else if (delta >= 10) { base = EARN.mom[10]; lbl = `Momentum +${delta}% → ${t}%`; }
    else if (delta >= 5) { base = EARN.mom[5]; lbl = `Momentum +${delta}% → ${t}%`; }
    else if (delta > 0) { base = EARN.mom.small; lbl = `Edged up to ${t}%`; }
    else { base = EARN.mom.held; lbl = t >= 50 ? `Held ${t}%` : `Showed up — ${t}%`; }
    ev.push({ date: key, icon: "📈", label: lbl, amt: Math.round(base * mult) });
    for (const c of combosFor(key)) ev.push({ date: key, icon: c.emoji, label: c.name, amt: Math.round(EARN.combo * mult) });
    if (t >= 100) ev.push({ date: key, icon: "🎁", label: "Perfect 100% day", amt: EARN.chest });
    else if (t >= 80) ev.push({ date: key, icon: "🌟", label: `Strong day — ${t}%`, amt: EARN.bonus80 });
    const st = streakEndingAt(key); if (EARN.streak[st]) ev.push({ date: key, icon: "🔥", label: `${st}-day streak!`, amt: EARN.streak[st] });
    return ev;
  }
  function dayEarn(key) { return dayEvents(key).reduce((a, e) => a + e.amt, 0); }

  // Full dated statement (newest first): per-day events + weekly + monthly + active-slump penalty.
  function earnLog() {
    const ev = [];
    for (const k of allDayKeys()) for (const e of dayEvents(k)) ev.push(e);
    const WLAB = { diet: "Diet target", study: "Study target", gym: "Gym classes", wake: "Wake-ups" };
    const weeks = [...new Set(allDayKeys().map((k) => fmtKey(monday(parseKey(k)))))];
    for (const wk of weeks) { const wp = weeklyProgress(parseKey(wk)); for (const key in wp) if (wp[key].have >= wp[key].need) ev.push({ date: wk, week: true, icon: "🗓️", label: `Weekly ${WLAB[key]} (${wp[key].have}/${wp[key].need})`, amt: wp[key].reward }); }
    const months = [...new Set(allDayKeys().map((k) => k.slice(0, 7)))];
    for (const ym of months) { const mg = monthGood(parseKey(ym + "-01")); if (mg.earned) ev.push({ date: ym + "-01", month: true, icon: "🍻", label: `Good month — Night Out (${mg.have}/${mg.need})`, amt: EARN.month }); }
    const drain = currentDrain(); if (drain > 0) ev.push({ date: fmtKey(today()), icon: "😬", label: "Slump penalty — recover to restore", amt: -drain });
    ev.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
    return ev;
  }
  function earnedTotal() { return earnLog().reduce((a, e) => a + e.amt, 0); }
  function spentTotal() { return ((S().game && S().game.claims) || []).reduce((a, c) => a + (c.cost || 0), 0); }
  function balance() { return earnedTotal() - spentTotal(); }   // credit ledger — may go negative

  // ---- slump penalty / freeze ----
  function badRun(key) {
    let n = 0, k = key;
    while (k >= PLAN_START && questScore(k) < BAD) { n++; k = prevKey(k); }
    return n;
  }
  function currentDrain() {
    const tk = fmtKey(today());
    if (goodDay(tk)) return 0;                  // a win today clears the active drain
    const run = badRun(prevKey(tk));
    return run >= 2 ? 50 * (run * (run + 1) / 2 - 1) : 0;
  }
  function punishment() {
    const tk = fmtKey(today()), yk = prevKey(tk);
    const out = { recovery: false, redeemLocked: false, lostWallet: currentDrain(), note: "" };
    const run = badRun(yk);
    if (run >= 3 && !goodDay(tk)) { out.recovery = true; out.redeemLocked = true; out.note = `${run} low days in a row — spending is FROZEN and the wallet is down −₹${out.lostWallet}. Log a winning day to thaw and restore it.`; }
    else if (run >= 3 && goodDay(tk)) out.note = "Back on track — you cleared a win today, spending thawed and balance restored.";
    return out;
  }
  function redeemLocked() { return punishment().redeemLocked; }
  function canSpend() { return !redeemLocked(); }      // spend freely (even into the red), unless deep slump

  // ---- today's flavour ----
  function dailyReward(key) {
    if (!hasData(key)) return null;
    const t = questScore(key), earned = dayEarn(key);
    if (t >= 100) return { emoji: "🎁", text: "Mystery Chest!" };
    if (earned > 0) return { emoji: "💰", text: `+₹${earned} banked today` };
    return null;
  }
  function claimedThisMonthAny(id) { return claimedThisMonth(id); }
  function level() { return Math.max(1, Math.floor(earnedTotal() / 1000) + 1); }

  window.Game = {
    EARN, REWARDS, SPEND_CATS, FLOOR, BAD, WEEKLY_TARGETS, LADDERS, SKIP_RULES,
    questScore, goodDay, dayEvents, dayEarn, currentStreak, streakEndingAt, combosFor,
    skipState, weeklyProgress, monthGood, canNightOut, claimedThisMonth: claimedThisMonthAny,
    earnedTotal, earnLog, spentTotal, balance, canSpend, redeemLocked,
    dailyReward, punishment, level, qaQuestionsToday,
  };
})();
