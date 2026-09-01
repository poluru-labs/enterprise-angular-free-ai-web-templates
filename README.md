# Enterprise Angular Free AI Web Templates

Free, production-shaped Angular 21 templates for AI dashboards, ops consoles, and admin workspaces. Each folder is a self-contained app: install it, run it, and restyle it independently.

Maintained by [Poluru Labs](https://polurus.com). Source: [github.com/poluru-labs/enterprise-angular-free-ai-web-templates](https://github.com/poluru-labs/enterprise-angular-free-ai-web-templates).

## Templates

| Template | Product | What it covers | Brand | Local demo |
| --- | --- | --- | --- | --- |
| [LLM usage](ai-llm-usage-dashboard/README.md) | Lilac Meter | Token spend, latency, budgets, alerts, and forecasts | `#8D77AB` | [localhost:4215](http://localhost:4215) |
| [Prompt management](ai-prompt-management-panel/README.md) | Prompt library | Prompt catalog, experiments, versions, and collections | `#08766C` | [localhost:4219](http://localhost:4219) |
| [RAG knowledge](ai-rag-knowledge-admin/README.md) | Indigo Vault | Sources, collections, indexing, retrieval, governance, and evaluations | `#4300FF` | [localhost:4214](http://localhost:4214) |
| [Model evaluation](ai-model-evaluation-board/README.md) | Evaluation board | Suites, datasets, models, regressions, and scorecards | `#2F6B1F` | [localhost:4218](http://localhost:4218) |
| [Agent ops](ai-agent-ops-console/README.md) | AgentOps Kit | Fleet health, runs, tools, handoffs, and deploys | `#08766C` | [localhost:4200](http://localhost:4200) |
| [Support copilot](ai-support-copilot-dashboard/README.md) | Harbor Desk | Queue health, AI drafts, knowledge, and CSAT | `#434E78` | [localhost:4217](http://localhost:4217) |
| [Sales assistant](ai-sales-assistant-panel/README.md) | Garnet Close | Account briefs, pipeline signals, and sequences | `#BD4444` | [localhost:4216](http://localhost:4216) |
| [Content studio](ai-content-studio/README.md) | Content Studio | Drafts, approvals, library, brand voice, and calendar | `#0046FF` | [localhost:4200](http://localhost:4200) |
| [Fraud risk](ai-fraud-risk-monitoring-ui/README.md) | Risk Watch | Alerts, cases, detection rules, and investigators | `#FF6600` | [localhost:4210](http://localhost:4210) |
| [Human review](ai-human-review-console/README.md) | Review Desk | Review queue, assignments, calibration, reports, and audit | `#3A86FF` | [localhost:4212](http://localhost:4212) |

Browse source for any template:

`https://github.com/poluru-labs/enterprise-angular-free-ai-web-templates/tree/main/<folder-name>`

Templates that share port `4200` (AgentOps Kit, content studio) should be started one at a time, or given a unique `--port` when you run `ng serve`.

## Getting started

Requires Node.js 20+.

```bash
git clone https://github.com/poluru-labs/enterprise-angular-free-ai-web-templates.git
cd enterprise-angular-free-ai-web-templates/ai-support-copilot-dashboard
npm install
npm start
```

Replace the folder name with any template from the table. Open the local demo URL for that app. Production build:

```bash
npm run build
```

Output lands in `dist/<template-name>`.

## Stack

- Angular 21 (standalone components)
- `@angular/router` on the multi-page templates
- Bootstrap 5
- DM Sans + Material Symbols
- [`@poluru-labs/enterprise-design-system-angular`](https://www.npmjs.com/package/@poluru-labs/enterprise-design-system-angular)

Copy and mock data live in each app’s `src/template.config.ts` or `src/app/core/config/template.config.ts`. Layout and brand color live in `src/styles.scss` or `src/app/app.component.ts`.

## License

[MIT](./LICENSE) © 2026 [Subrahmanyam Poluru](https://polurus.com) / Poluru Labs
