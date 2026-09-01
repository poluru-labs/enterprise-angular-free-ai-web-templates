# Garnet Close — AI sales assistant

Equip sellers with AI-generated next steps, account research, and pipeline signals. Garnet Close is a revenue-intelligence admin with a **full-width sticky header** and a **simple sidebar**.

**Brand:** `#BD4444`  
**Folder:** `ai-sales-assistant-panel`

## Demo

| | |
| --- | --- |
| Local demo | [http://localhost:4216](http://localhost:4216) |
| Source | [github.com/poluru-labs/…/ai-sales-assistant-panel](https://github.com/poluru-labs/enterprise-angular-free-ai-web-templates/tree/main/ai-sales-assistant-panel) |

After `npm start`, switch Day / Week / Month on Overview, then open Accounts, Signals, Sequences, Meetings, and Forecasts. Try ⌘K to search accounts. If another template is already on port 4216, start with `npx ng serve --port 4226`.

## What you get

- Qualified pipeline, researched accounts, next-best actions, and meeting-prep KPIs that change by day / week / month
- Seller activity by hour and next-best-action coaching
- Account catalog with search, risk tags, pagination, and equal-height spotlight cards
- Signal map for expansion, renewal, outreach, and deal risk
- Sequence cadences with stall alerts
- Meeting prep packs (QBR, discovery, legal, champion)
- Forecast books with commit / upside / at-risk coverage
- Coaching and retention settings

## Run

Requires Node.js 20+.

```bash
cd ai-sales-assistant-panel
npm install
npm start
```

| Route | Page |
| --- | --- |
| `/` | Overview — KPIs, seller activity, next-best actions, pipeline table |
| `/accounts` | Accounts — filters, research table, pagination |
| `/signals` | Signal map — expansion, renewal, outreach, owners |
| `/sequences` | Sequence cycle, cadence progress, weekly motion |
| `/meetings` | Meeting prep packs by type |
| `/forecasts` | Commit, upside, and at-risk coverage |
| `/settings` | Briefs, coaching, retention, and admin PIN |

```bash
npm run build
```

Production output: `dist/ai-sales-assistant-panel`.

## Stack

Angular 21 (standalone components, router), Bootstrap 5, Material Symbols, DM Sans, [`@poluru-labs/enterprise-design-system-angular`](https://www.npmjs.com/package/@poluru-labs/enterprise-design-system-angular). Demo people include **Ananya Poluru**, Kavya Poluru, Rohan Poluru, Nikhil Poluru, Meera Poluru, Sravani Poluru, Hana Poluru, Venkata Poluru, Arjun Poluru, Lakshmi Poluru, Priya Poluru, and Ramesh Poluru.

Copy lives in `src/app/core/config/template.config.ts`. Layout and brand color live in `src/styles.scss`.

```
src/
  app/
    core/config/          shared template copy
    features/             one folder per route
    shared/               spec helpers and sales utils
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
