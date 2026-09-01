# Review Desk — human review console

A human-in-the-loop workspace for queue, assignments, policies, calibration, reports, and audit. Review Desk uses a **full-width sticky header** and a **simple sidebar**.

**Brand:** `#3A86FF`  
**Folder:** `ai-human-review-console`

## Demo

| | |
| --- | --- |
| Local demo | [http://localhost:4212](http://localhost:4212) |
| Source | [github.com/poluru-labs/…/ai-human-review-console](https://github.com/poluru-labs/enterprise-angular-free-ai-web-templates/tree/main/ai-human-review-console) |

After `npm start`, take or reassign items on Assignments, publish a calibration cycle, then check Policies and Audit. Try ⌘K for workspace search.

## What you get

- Priority queue with aging, hourly throughput, and period KPIs
- Assignment search with take / reassign / release / resolve
- Policy packs in live, tuning, and shadow, plus draft-a-guideline
- Calibration cycles and gold-set labels
- Reports desk for digests, SLA packs, and agreement scorecards
- Reviewer audit log with export
- Workspace search (⌘K)
- SLA, roster, and routing toggles

## Run

Requires Node.js 20+.

```bash
cd ai-human-review-console
npm install
npm start
```

| Route | Page |
| --- | --- |
| `/` | Queue — KPIs, priority items, aging, hourly throughput, shift board |
| `/assignments` | Assignments — search, take / reassign / release / resolve |
| `/policies` | Policies — live / tuning / shadow, draft a guideline |
| `/calibration` | Calibration — cycles, gold set, rater agreement |
| `/reports` | Reports — digests, SLA packs, agreement scorecards |
| `/audit` | Audit log — filter by reviewer, export |
| `/search` | Search — queue, assignments, policies, gold items, reports |
| `/settings` | SLA, team roster, routing toggles |

```bash
npm run build
```

Production output: `dist/ai-human-review-console`.

## Stack

Angular 21 (standalone components, router), Bootstrap 5, Material Symbols, DM Sans, [`@poluru-labs/enterprise-design-system-angular`](https://www.npmjs.com/package/@poluru-labs/enterprise-design-system-angular). Demo people use surnames ending in **Poluru**.

Copy lives in `src/app/core/config/template.config.ts`. Layout and brand color live in `src/styles.scss`.

```
src/
  app/
    core/config/          shared template copy
    features/             one folder per route
    shared/               spec helpers and initials util
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
