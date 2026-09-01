# Lilac Meter — LLM usage dashboard

Platform analytics for token consumption, spend, and latency. Lilac Meter is a cost-and-usage admin with a **full-width sticky header** and a **simple sidebar**.

**Brand:** `#8D77AB`  
**Folder:** `ai-llm-usage-dashboard`

## Demo

| | |
| --- | --- |
| Local demo | [http://localhost:4215](http://localhost:4215) |
| Source | [github.com/poluru-labs/…/ai-llm-usage-dashboard](https://github.com/poluru-labs/enterprise-angular-free-ai-web-templates/tree/main/ai-llm-usage-dashboard) |

After `npm start`, switch Day / Week / Month on Overview, then open Usage, Models, Budgets, Alerts, and Forecasts. Try ⌘K to search usage.

## What you get

- Token volume, spend, and latency KPIs that change by day / week / month
- Workspace usage table with search, tags, and pagination
- Model directory grouped by provider and owner
- Budget cycle, workspace caps, and weekly checks
- Alert inbox with acknowledge / snooze
- Spend forecasts with a what-if growth slider
- Cost-gate, API key, and retention settings

## Run

Requires Node.js 20+.

```bash
cd ai-llm-usage-dashboard
npm install
npm start
```

| Route | Page |
| --- | --- |
| `/` | Overview — KPIs, token volume, spend health, workspace table |
| `/usage` | Usage — filters, catalog table, pagination |
| `/models` | Model directory — providers, access, owners |
| `/budgets` | Budget cycle, workspace caps, weekly checks |
| `/alerts` | Alert inbox — budget, latency, keys, anomalies |
| `/forecasts` | Month-end spend runway and what-if growth |
| `/settings` | Alerts, cost gate, keys, caps, and retention |

```bash
npm run build
```

Production output: `dist/ai-llm-usage-dashboard`.

## Stack

Angular 21 (standalone components, router), Bootstrap 5, Material Symbols, DM Sans, [`@poluru-labs/enterprise-design-system-angular`](https://www.npmjs.com/package/@poluru-labs/enterprise-design-system-angular). Demo people include **Lakshmi Poluru**, Priya Poluru, Venkata Poluru, Meera Poluru, Hana Poluru, Nikhil Poluru, Sravani Poluru, Ramesh Poluru, and Arjun Poluru.

Copy lives in `src/app/core/config/template.config.ts`. Layout and brand color live in `src/styles.scss`.

```
src/
  app/
    core/config/          shared template copy
    features/             one folder per route
    shared/               spec helpers and usage utils
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
