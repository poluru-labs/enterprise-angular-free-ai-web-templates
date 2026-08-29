# LLM Usage Dashboard

Platform analytics for LLM consumption: token usage, spend, model latency,
and budgets across workspaces. Light theme with brand **`#08766C`**.

A **simple sidebar** and a **sticky, full-width header** stay in place while
the main canvas scrolls. Navigation: Overview, Usage, Models, Budgets, and
Settings.

## Run

Requires Node.js 20+.

```bash
cd ai-llm-usage-dashboard
npm install
npm start
```

Default dev server: http://localhost:4200

| Route | Page |
| --- | --- |
| `/` | Overview — KPIs, must-have features, recent usage activity |
| `/usage` | Usage — per-model token, cost, and latency table |
| `/models` | Model directory — owners and access status |
| `/budgets` | Budget timeline — weekly checks and reviews |
| `/settings` | Budget alerts, latency notifications, and cost gate toggles |

```bash
npm run build
```

Production output: `dist/ai-llm-usage-dashboard`.

## Stack

Angular 21 (standalone components, router), Bootstrap 5, Material Symbols,
DM Sans, `@poluru-labs/enterprise-design-system-angular`. Demo owners include
**Alex Poluru**, Priya Poluru, Maya Poluru, and Sam Poluru.

Copy and tokens live in `src/template.config.ts`. Layout and brand color live
in `src/app/app.component.ts` and `src/styles.scss`.
