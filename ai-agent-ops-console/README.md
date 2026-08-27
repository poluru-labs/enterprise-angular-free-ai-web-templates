# AgentOps Kit

AI agent operations console: fleet health, runs, tools, human handoffs, and
deploys. Light theme with brand **`#08766C`**.

A **full-height sidebar** stays on the left while the main canvas scrolls.
Navigation is grouped: Operations (Operations, Agents, Runs, Tools) and
Oversight (Handoffs, Alerts), plus Settings.

## Run

Requires Node.js 20+.

```bash
cd ai-agent-ops-console
npm install
npm start
```

Default dev server: http://localhost:4200

| Route | Page |
| --- | --- |
| `/` | Operations — KPIs, run activity, coverage |
| `/agents` | Agent directory — status filters, deploy |
| `/runs` | Run ledger — traces, duration, outcomes |
| `/tools` | Tool catalog — reliability, approval state |
| `/handoffs` | Human review — approve / reject / reassign |
| `/alerts` | Alert queue — policy blocks, reliability |
| `/deploy` | Deploy agent — model, tools, publish |
| `/search` | Workspace search — agents, runs, tools |
| `/settings` | Policies, alerts, and access toggles |

```bash
npm run build
```

Production output: `dist/ai-agent-ops-console`.

## Stack

Angular 21 (standalone components, router), Bootstrap 5, Material Symbols,
DM Sans, `@poluru-labs/enterprise-design-system-angular`. Demo operators
include **Alex Poluru**, Maya Subbu, Priya Subbu, and Sam Poluru.

Copy and tokens live in `src/template.config.ts`. Layout and brand color live
in `src/styles.scss`.
