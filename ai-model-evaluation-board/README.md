# Model evaluation board

Compare model behavior, run evaluation suites, and sign off releases. The board uses a light canvas with brand **`#2F6B1F`**.

**Brand:** `#2F6B1F`  
**Folder:** `ai-model-evaluation-board`

## Demo

| | |
| --- | --- |
| Local demo | [http://localhost:4218](http://localhost:4218) |
| Source | [github.com/poluru-labs/…/ai-model-evaluation-board](https://github.com/poluru-labs/enterprise-angular-free-ai-web-templates/tree/main/ai-model-evaluation-board) |

After `npm start`, run an evaluation from the header, then open Suites, Datasets, Models, Regressions, and Scorecards. Try ⌘K to search suites. If another template is already on port 4218, start with `npx ng serve --port 4228`.

## What you get

- Evaluation-run KPIs that change by day / week / month
- Suite orchestration with search, status filters, and pagination
- Dataset versioning with pinned revisions
- Checkpoint leaderboard and release-track controls
- Regression watchtower with acknowledge / snooze
- Scorecard sign-off and block
- Run-evaluation modal (model, suite, notes)

## Run

Requires Node.js 20+.

```bash
cd ai-model-evaluation-board
npm install
npm start
```

| Route | Page |
| --- | --- |
| `/` | Board — KPIs, leaderboard, reviewers, recent activity |
| `/suites` | Suites — quality, safety, and reasoning packs |
| `/datasets` | Datasets — pinned revisions |
| `/models` | Models — checkpoint ranking and release track |
| `/regressions` | Regressions — watchtower inbox |
| `/scorecards` | Scorecards — release sign-off |
| `/settings` | Workspace settings |

```bash
npm run build
```

Production output: `dist/ai-model-evaluation-board`.

## Stack

Angular 21 (standalone components, router), Bootstrap 5, Material Symbols, DM Sans, [`@poluru-labs/enterprise-design-system-angular`](https://www.npmjs.com/package/@poluru-labs/enterprise-design-system-angular). Demo people include **Ananya Poluru**, Devika Poluru, Karthik Poluru, Meera Poluru, Arjun Poluru, Priya Poluru, Rohan Poluru, and Venkata Poluru.

Copy lives in `src/app/core/config/template.config.ts`. Layout and brand color live in `src/styles.scss`.

```
src/
  app/
    core/config/          shared template copy
    features/             one folder per route
    shared/               spec helpers and eval utils
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
