# Review Desk — human review console

A human-in-the-loop workspace for queue, assignments, policies, and audit. Review Desk uses a **full-width sticky header** and a **simple sidebar**.

**Brand:** `#3A86FF`  
**Folder:** `ai-human-review-console`

## Demo

| | |
| --- | --- |
| Local demo | [http://localhost:4212](http://localhost:4212) |
| Source | [github.com/poluru-labs/…/ai-human-review-console](https://github.com/poluru-labs/enterprise-angular-free-ai-web-templates/tree/main/ai-human-review-console) |

After `npm start`, take or reassign items on Assignments, then check Policies and Audit.

## What you get

- Priority queue with aging and hourly throughput
- Assignment search with take / reassign / release
- Policy packs in live, tuning, and shadow
- Reviewer audit log
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
| `/assignments` | Assignments — search, take / reassign / release |
| `/policies` | Policies — live / tuning / shadow, draft a guideline |
| `/audit` | Audit log — filter by reviewer |
| `/settings` | SLA, team roster, routing toggles |

```bash
npm run build
```

Production output: `dist/ai-human-review-console`.

## Stack

Angular 21 (standalone components, router), Bootstrap 5, Material Symbols, DM Sans, [`@poluru-labs/enterprise-design-system-angular`](https://www.npmjs.com/package/@poluru-labs/enterprise-design-system-angular). Demo people use surnames ending in **Poluru**.

Copy lives in `src/template.config.ts`. Layout and brand color live in `src/styles.scss`.

## License

[MIT](../LICENSE) © 2026 [Subrahmanyam Poluru](https://polurus.com) / Poluru Labs
