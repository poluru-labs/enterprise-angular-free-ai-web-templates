# Lilac Meter — LLM usage dashboard

Platform analytics for token consumption, spend, and latency. Light canvas
with a **full-width sticky header** in brand **`#8D77AB`**, plus a **simple
sidebar**.

## Run

Requires Node.js 20+.

```bash
cd ai-llm-usage-dashboard
npm install
npm start
```

Default dev server: http://localhost:4215

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

Angular 21 (standalone components, router), Bootstrap 5, Material Symbols,
DM Sans, `@poluru-labs/enterprise-design-system-angular`. Demo people include
**Lakshmi Poluru**, Priya Poluru, Venkata Poluru, Meera Poluru, Hana Poluru,
Nikhil Poluru, Sravani Poluru, Ramesh Poluru, and Arjun Poluru.

Copy and mock data live in `src/template.config.ts`. Layout and brand color
live in `src/app/app.component.ts` and `src/styles.scss`.
