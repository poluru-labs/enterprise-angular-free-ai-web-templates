# Review Desk

Human review workspace: queue, assignments, policies, and audit. Light theme
with brand **`#3A86FF`**.

A **full-width sticky header** spans the dashboard. A **simple sidebar** lists
Queue, Assignments, Policies, Audit, and Settings.

## Run

Requires Node.js 20+.

```bash
cd ai-human-review-console
npm install
npm start
```

Default dev server: http://localhost:4212

| Route | Page |
| --- | --- |
| `/` | Queue — KPIs, priority items, aging, hourly throughput, shift board |
| `/assignments` | Assignments — search, take / reassign / release |
| `/policies` | Policies — live / tuning / shadow, draft a guideline |
| `/audit` | Audit log — filter by reviewer |
| `/settings` | SLA, team roster, routing toggles |

```bash
npm run build
```

Production output: `dist/ai-human-review-console`.

## Stack

Angular 21 (standalone components, router), Bootstrap 5, Material Symbols,
DM Sans, `@poluru-labs/enterprise-design-system-angular`. Demo people use
surnames ending in **Poluru** (Aisha, Maya, Arjun, Jordan, and others).

Copy and tokens live in `src/template.config.ts`. Layout and brand color live
in `src/styles.scss`.
