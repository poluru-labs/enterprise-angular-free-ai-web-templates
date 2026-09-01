# Risk Watch — fraud and risk monitoring

Alerts, cases, detection rules, watchlist, and investigator queues. Risk Watch uses a **full-height sticky sidebar**.

**Brand:** `#FF6600`  
**Folder:** `ai-fraud-risk-monitoring-ui`

## Demo

| | |
| --- | --- |
| Local demo | [http://localhost:4210](http://localhost:4210) |
| Source | [github.com/poluru-labs/…/ai-fraud-risk-monitoring-ui](https://github.com/poluru-labs/enterprise-angular-free-ai-web-templates/tree/main/ai-fraud-risk-monitoring-ui) |

After `npm start`, acknowledge an alert, freeze a watchlist entity, then pause or shadow a detection pack on Rules. If another template is already on port 4210, start with `npx ng serve --port 4214`.

## What you get

- Monitor KPIs, live activity, model drift, and on-call
- Alert queue with severity filters, acknowledge, assign, and snooze
- Case ledger with timeline, notes, escalate / block / clear
- Entity watchlist (BIN, device, IP, merchant) with freeze actions
- Detection packs in live / shadow / pause, plus draft-a-rule
- Reports desk for daily digests and SAR packages
- Workspace search (⌘K)
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
| `/` | Monitor — KPIs, live activity, coverage, investigators, watchlist |
| `/alerts` | Alert queue — search, severity filters, acknowledge, assign, snooze |
| `/cases` | Case ledger — status filters, timeline, notes, block / clear / escalate |
| `/watchlist` | Entities — freeze BINs, devices, IPs, and merchants |
| `/rules` | Detection packs — live / shadow / pause, draft a new rule |
| `/reports` | Reports — daily digest, SAR packages, model memos |
| `/search` | Search — alerts, cases, rules, watchlist, investigators |
| `/settings` | Thresholds, team roster, toggles, audit log |

```bash
npm run build
```

Production output: `dist/ai-fraud-risk-monitoring-ui`.

## Stack

Angular 21 (standalone components, router), Bootstrap 5, Material Symbols, DM Sans, [`@poluru-labs/enterprise-design-system-angular`](https://www.npmjs.com/package/@poluru-labs/enterprise-design-system-angular). Demo people use surnames ending in **Poluru**.

Copy lives in `src/app/core/config/template.config.ts`. Layout and brand color live in `src/styles.scss`.

```
src/
  app/
    core/config/          shared template copy
    features/             one folder per route
    shared/               spec helpers and initials util
    app.component.ts
    app.config.ts
    app.routes.ts
  environments/
  assets/
```

```bash
npm test
npm run lint
npm run lint:fix
```

## License

[MIT](../LICENSE) © 2026 [Subrahmanyam Poluru](https://polurus.com) / Poluru Labs
