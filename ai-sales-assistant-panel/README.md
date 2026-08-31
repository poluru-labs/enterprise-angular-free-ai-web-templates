# Garnet Close — AI sales assistant

Equip sellers with AI-generated next steps, account research, and pipeline signals. Garnet Close is a revenue-intelligence admin with a **full-width sticky header** and a **simple sidebar**.

**Brand:** `#BD4444`  
**Folder:** `ai-sales-assistant-panel`

## Demo

| | |
| --- | --- |
| Local demo | [http://localhost:4216](http://localhost:4216) |
| Source | [github.com/poluru-labs/…/ai-sales-assistant-panel](https://github.com/poluru-labs/enterprise-angular-free-ai-web-templates/tree/main/ai-sales-assistant-panel) |

After `npm start`, use **⌘K** or **Create brief** to walk the research stepper, then open Accounts, Signals, and Sequences.

## What you get

- Qualified pipeline, researched accounts, and meeting-prep coverage
- Seller activity by hour and next-best-action coaching
- Account table with risk, stage, and brief status
- Signal map for expansion, renewal, and outreach
- Sequence cadences with stall alerts
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
| `/settings` | Briefs, coaching, retention, and admin PIN |

```bash
npm run build
```

Production output: `dist/ai-sales-assistant-panel`.

## Stack

Angular 21 (standalone components, router), Bootstrap 5, Material Symbols, DM Sans, [`@poluru-labs/enterprise-design-system-angular`](https://www.npmjs.com/package/@poluru-labs/enterprise-design-system-angular). Demo people include **Ananya Poluru**, Kavya Poluru, Rohan Poluru, Nikhil Poluru, Meera Poluru, Sravani Poluru, Hana Poluru, Venkata Poluru, and Priya Poluru.

Copy lives in `src/template.config.ts`. Layout and brand color live in `src/app/app.component.ts` and `src/styles.scss`.

## License

[MIT](../LICENSE) © 2026 [Subrahmanyam Poluru](https://polurus.com) / Poluru Labs
