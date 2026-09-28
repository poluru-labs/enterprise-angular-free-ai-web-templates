# Enterprise Angular Free AI Web Templates

Free, production-shaped **Angular 21** demos for AI dashboards, ops consoles, and admin workspaces. Each `ai-*` folder is a **standalone app**: install dependencies, run locally, and customize the theme without touching the rest of the monorepo.

Maintained by [Poluru Labs](https://polurus.com). Source: [github.com/poluru-labs/enterprise-angular-free-ai-web-templates](https://github.com/poluru-labs/enterprise-angular-free-ai-web-templates).

## What you get

- **Light UI** with brand colors tuned per template
- **[`@poluru-labs/enterprise-design-system-angular`](https://www.npmjs.com/package/@poluru-labs/enterprise-design-system-angular)** (tables, tabs, stats, modals, and related components)
- **Google Fonts** — **Roboto** + **Lato** on the EDS dashboard templates
- **Demo data** with sample names (many ending in **Poluru**); footer credit on the showcase apps
- **Signals + `OnPush`** on single-shell dashboards; **`ng build`** and **`ng test --watch=false`** in each app

Some templates use a **multi-route** layout (`src/app/features/…` + router). Others use one **`App`** shell with **top navigation tabs** or a **light sidebar** — open the folder and run it to see the pattern.

## Templates (35)

| Folder | Title | Focus | Brand |
| --- | --- | --- | --- |
| [ai-agent-marketplace-admin](ai-agent-marketplace-admin/) | Agent Marketplace Admin | Listings, approvals, pricing | `#450C3F` |
| [ai-agent-ops-console](ai-agent-ops-console/) | AgentOps Kit | Fleet health, runs, tools, deploys | `#08766C` |
| [ai-annotation-quality-dashboard](ai-annotation-quality-dashboard/) | Annotation Quality Dashboard | Label QA, inter-annotator agreement | `#72BAA9` |
| [ai-chat-analytics-dashboard](ai-chat-analytics-dashboard/) | Chatflow Analytics Dashboard | Conversation volume, intents, CSAT | `#72BAA9` |
| [ai-code-review-assistant-ui](ai-code-review-assistant-ui/) | Code Review Assistant Panel | PR review assists, findings, policies | `#C3110C` |
| [ai-compliance-audit-trail](ai-compliance-audit-trail/) | AI Compliance Audit Trail | Audit log, policies, attestations | `#132440` |
| [ai-content-studio](ai-content-studio/) | Content Studio | Drafts, approvals, brand voice | `#0046FF` |
| [ai-cost-optimization-dashboard](ai-cost-optimization-dashboard/) | AI Cost Optimization Dashboard | Spend, waste, rightsizing | — |
| [ai-data-labeling-workbench](ai-data-labeling-workbench/) | Data Labeling Workbench | Queues, labeling, QA | `#EB5B00` |
| [ai-document-processing-hub](ai-document-processing-hub/) | Document Processing Hub | Upload, extract, validate documents | `#132440` |
| [ai-drift-detection-dashboard](ai-drift-detection-dashboard/) | Drift Detection Dashboard | Model/data drift monitors | `#08CB00` |
| [ai-embedding-search-console](ai-embedding-search-console/) | Semantic Search Console | Embeddings, queries, indexes | `#08CB00` |
| [ai-experiment-lab](ai-experiment-lab/) | AI Experiment Lab | A/B outputs, evaluators, winners | `#B5B9F0` |
| [ai-feedback-review-console](ai-feedback-review-console/) | Feedback Review Console | User feedback triage and routing | `#162E93` |
| [ai-fine-tuning-console](ai-fine-tuning-console/) | Fine-Tuning Console | Datasets, training jobs, metrics | `#162E93` |
| [ai-fraud-risk-monitoring-ui](ai-fraud-risk-monitoring-ui/) | Risk Watch | Fraud alerts, cases, rules | `#FF6600` |
| [ai-guardrails-policy-center](ai-guardrails-policy-center/) | Reef · Guardrails | Filters, PII, safety policies | `#26CCC2` |
| [ai-human-review-console](ai-human-review-console/) | Review Desk | Human review queue and calibration | `#3A86FF` |
| [ai-incident-response-board](ai-incident-response-board/) | AI Incident Response Board | Incidents, timelines, on-call | `#003161` |
| [ai-llm-usage-dashboard](ai-llm-usage-dashboard/) | Lilac Meter | Token spend, latency, budgets | `#8D77AB` |
| [ai-model-evaluation-board](ai-model-evaluation-board/) | AI Model Evaluation Board | Suites, datasets, scorecards | `#2F6B1F` |
| [ai-model-registry-browser](ai-model-registry-browser/) | Model Registry Browser | Catalog, lineage, deploy status | `#EB5B00` |
| [ai-onboarding-copilot-admin](ai-onboarding-copilot-admin/) | Copilot Onboarding Admin | Guides, tooltips, rollout | `#003161` |
| [ai-persona-builder](ai-persona-builder/) | Persona & Tone Builder | Personas, tone, channel rules | `#8CCDEB` |
| [ai-prompt-management-panel](ai-prompt-management-panel/) | AI Prompt Management Panel | Prompt library, versions, collections | `#08766C` |
| [ai-prompt-playground](ai-prompt-playground/) | Prompt Playground | Multi-model prompt test, variables, diff | `#FF6500` |
| [ai-rag-knowledge-admin](ai-rag-knowledge-admin/) | Indigo Vault | RAG sources, indexing, retrieval | `#4300FF` |
| [ai-red-teaming-console](ai-red-teaming-console/) | Red Teaming Console | Attack suites, findings, severity | `#FF3838` |
| [ai-release-gates-board](ai-release-gates-board/) | AI Release Gates Board | Release gates, checks, sign-off | `#465C88` |
| [ai-sales-assistant-panel](ai-sales-assistant-panel/) | Garnet Close | Pipeline, briefs, meetings | `#BD4444` |
| [ai-support-copilot-dashboard](ai-support-copilot-dashboard/) | Harbor Desk | Support queue, drafts, CSAT | `#434E78` |
| [ai-tenant-quota-manager](ai-tenant-quota-manager/) | Tenant Quota Manager | Tenants, API keys, limits | `#261FB3` |
| [ai-vector-db-explorer](ai-vector-db-explorer/) | Lattice | Vector namespaces, neighbors | `#45A9A9` |
| [ai-voice-agent-monitor](ai-voice-agent-monitor/) | Voice Agent Monitor | Live calls, transcripts, latency | `#FF6500` |
| [ai-workflow-orchestration-ui](ai-workflow-orchestration-ui/) | AI Workflow Orchestration UI | Pipeline builder, runs, HITL | `#2A004E` |

Browse any template on GitHub:

`https://github.com/poluru-labs/enterprise-angular-free-ai-web-templates/tree/main/<folder-name>`

Per-template notes may also exist in `<folder>/README.md` where present.

## Getting started

Requires **Node.js 20+** (LTS recommended).

```bash
git clone https://github.com/poluru-labs/enterprise-angular-free-ai-web-templates.git
cd enterprise-angular-free-ai-web-templates/ai-prompt-playground   # any ai-* folder
npm install
npm start
```

Open **http://localhost:4200/** (default). Only one app can bind to 4200 at a time — use another port when running multiple demos:

```bash
ng serve --port 4215
```

Production build and unit tests:

```bash
npm run build
npm test -- --watch=false
```

Build output is under `dist/` (project name is often `ng-boilerplate` in `angular.json`). SSR-enabled apps may log a harmless `NotYetImplemented` line during prerender; the client bundle still builds successfully.

## Stack

| Layer | Details |
| --- | --- |
| Framework | Angular 21, standalone components |
| UI | [`@poluru-labs/enterprise-design-system-angular`](https://www.npmjs.com/package/@poluru-labs/enterprise-design-system-angular) |
| Typography | Roboto + Lato (EDS templates); some router apps use DM Sans |
| State | Signals and computed values on showcase dashboards |
| Routing | Router + feature folders on multi-page templates; tabbed shell on others |
| SSR | Optional server bundle via `@angular/ssr` (varies by app) |

**Where to customize**

- **Brand / tokens** — `src/styles.scss` (`:root` EDS overrides)
- **Shell layout & demo data** — `src/app/app.ts`, `app.html`, `app.scss`
- **Router templates** — `src/app/features/…`, `src/app/core/config/template.config.ts` (or `src/template.config.ts`)

## License

[MIT](./LICENSE) © 2026 [Subrahmanyam Poluru](https://polurus.com) / Poluru Labs
