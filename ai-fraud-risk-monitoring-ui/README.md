# Risk Watch

AI fraud and risk monitoring workspace: alerts, cases, detection rules, and
investigator queues. Light theme with brand **`#FF6600`**.

A **full-height sticky sidebar** stays in view while the main canvas scrolls.
Navigation is a simple list: Monitor, Alerts, Cases, Rules, Settings.

## Run

Requires Node.js 20+.

```bash
cd ai-fraud-risk-monitoring-ui
npm install
npm start
```

Default dev server: http://localhost:4210

| Route | Page |
| --- | --- |
| `/` | Monitor — KPIs, live activity, coverage, on-call, watchlist, investigators |
| `/alerts` | Alert queue — search, severity filters, acknowledge, assign |
| `/cases` | Case ledger — status filters, timeline, block / clear / take case |
| `/rules` | Detection packs — live / shadow / pause, draft a new rule |
| `/settings` | Thresholds, team roster, toggles, audit log |

```bash
npm run build
```

Production output: `dist/ai-fraud-risk-monitoring-ui`.

## Stack

Angular 21 (standalone components, router), Bootstrap 5, Material Symbols,
DM Sans, `@poluru-labs/enterprise-design-system-angular`. Demo people use
surnames ending in **Poluru** (Aisha, Maya, Arjun, Jordan, and others).

Copy and tokens live in `src/template.config.ts`. Layout and brand color live
in `src/styles.scss`.
