# CAT 2026 Performance OS

A zero-build, offline personal tracker for CAT 2026 prep plus health habits. Apple-inspired light UI, all data stays in your browser (localStorage). Export a JSON backup any time from the header.

## Run it

No build step, no dependencies. Either:

```bash
cd ~/Desktop/cat-tracker
python3 -m http.server 4183
# open http://127.0.0.1:4183
```

or just double-click `index.html` (works over `file://` in Chrome/Safari).

## What it tracks

| Category | Weight | Rule |
|---|---|---|
| Study | 40% | QA 50 / DILR 30 / VARC 20 inside study |
| Diet | 20% | 1200 kcal / 90g protein targets, tiered scoring |
| Gym | 20% | 4 classes/week, 10k-step day = 25% credit |
| Wake Up | 10% | successful days / 7 |
| Office | 5% | attendance / expected working days (Sun + 1st/3rd Sat off, WFH cap 2/month) |
| Vitamins | 5% | Iron x7 + B12 x7 + Vitamin D x1 = 15 weekly doses |

**CAT Readiness Score** (the headline number): QA 40% + DILR 25% + RC 15% + Aeon essays 10% + wake-up consistency 10%.

## Tabs

- **Today**: one-tap daily logging. Wake-up, office status, gym, vitamins, diet (type "2 eggs and 1 scoop whey" and macros are estimated from a built-in 130-item Indian food database), QA questions per chapter, DILR sets, RCs, Aeon essay.
- **Study**: QA chapter manager (total, done, % complete, remaining, required pace/day, projected finish date from your last-14-day pace), DILR and VARC weekly history.
- **Dashboard**: daily activity flow, weekly rhythm radar, weekly totals, month heatmap, ranked categories.
- **Reports**: auto-generated Weekly Report (category deltas vs last week, Weekly Wins, Areas to Improve, Next Week Focus) and Monthly Report (trends vs previous month, week-by-week, momentum).

## Files

| File | Owns |
|---|---|
| `index.html` | shell + load order |
| `styles.css` | design tokens, light Apple theme |
| `foods.js` | food database + natural-language entry parser |
| `core.js` | state, persistence, date utils, full scoring engine |
| `charts.js` | dependency-free SVG rings, line/bar charts, radar |
| `app.js` | all four tabs, rendering and events |

## Notes & assumptions

- A 10k-step day earns the same 25% credit as one gym class (per "10,000 steps = 25% gym credit"); a day with both counts once.
- Days with no food logged are excluded from the weekly diet average rather than scored 0.
- Unknown foods fall back to manual calorie/protein entry.
- Deleting a chapter keeps its logged questions in daily history but stops counting them.
