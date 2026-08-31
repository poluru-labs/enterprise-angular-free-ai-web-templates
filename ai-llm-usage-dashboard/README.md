# Lilac Meter — LLM usage dashboard

Platform analytics for token consumption, spend, and latency. Lilac Meter is a cost-and-usage admin with a **full-width sticky header** and a **simple sidebar**.

**Brand:** `#8D77AB`  
**Folder:** `ai-llm-usage-dashboard`

## Demo

| | |
| --- | --- |
| Local demo | [http://localhost:4215](http://localhost:4215) |
| Source | [github.com/poluru-labs/…/ai-llm-usage-dashboard](https://github.com/poluru-labs/enterprise-angular-free-ai-web-templates/tree/main/ai-llm-usage-dashboard) |

After `npm start`, switch Day / Week / Month on Overview, then open Usage, Models, and Budgets.

## What you get

- Token volume, spend, and latency KPIs
- Workspace usage table with filters and pagination
- Model directory by provider and owner
- Budget cycle, caps, and weekly checks
- Cost-gate and retention settings

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
| `/settings` | Alerts, cost gate, caps, and retention |

```bash
npm run build
```

Production output: `dist/ai-llm-usage-dashboard`.

## Stack

Angular 21 (standalone components, router), Bootstrap 5, Material Symbols, DM Sans, [`@poluru-labs/enterprise-design-system-angular`](https://www.npmjs.com/package/@poluru-labs/enterprise-design-system-angular). Demo people include **Lakshmi Poluru**, Priya Poluru, Venkata Poluru, Meera Poluru, Hana Poluru, Nikhil Poluru, Sravani Poluru, Ramesh Poluru, and Arjun Poluru.

Copy lives in `src/template.config.ts`. Layout and brand color live in `src/app/app.component.ts` and `src/styles.scss`.

## License

[MIT](../LICENSE) © 2026 [Subrahmanyam Poluru](https://polurus.com) / Poluru Labs
