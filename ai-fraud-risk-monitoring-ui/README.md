# Risk Watch — fraud and risk monitoring

Alerts, cases, detection rules, and investigator queues. Risk Watch uses a **full-height sticky sidebar**.

**Brand:** `#FF6600`  
**Folder:** `ai-fraud-risk-monitoring-ui`

## Demo

| | |
| --- | --- |
| Local demo | [http://localhost:4210](http://localhost:4210) |
| Source | [github.com/poluru-labs/…/ai-fraud-risk-monitoring-ui](https://github.com/poluru-labs/enterprise-angular-free-ai-web-templates/tree/main/ai-fraud-risk-monitoring-ui) |

After `npm start`, acknowledge an alert, open a case, then pause or shadow a detection pack on Rules.

## What you get

- Monitor KPIs, live activity, and on-call
- Alert queue with severity filters
- Case ledger with timeline and take-case actions
- Detection packs in live / shadow / pause
- Thresholds, roster, and audit log

## Run

Requires Node.js 20+.

```bash
cd ai-fraud-risk-monitoring-ui
npm install
npm start
```

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

Angular 21 (standalone components, router), Bootstrap 5, Material Symbols, DM Sans, [`@poluru-labs/enterprise-design-system-angular`](https://www.npmjs.com/package/@poluru-labs/enterprise-design-system-angular). Demo people use surnames ending in **Poluru**.

Copy lives in `src/template.config.ts`. Layout and brand color live in `src/styles.scss`.

## License

[MIT](../LICENSE) © 2026 [Subrahmanyam Poluru](https://polurus.com) / Poluru Labs
