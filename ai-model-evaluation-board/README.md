# Model evaluation board

Compare model behavior, run evaluation suites, and sign off releases. The board uses a light canvas with brand **`#2F6B1F`**.

**Brand:** `#2F6B1F`  
**Folder:** `ai-model-evaluation-board`

## Demo

| | |
| --- | --- |
| Local demo | [http://localhost:4200](http://localhost:4200) |
| Source | [github.com/poluru-labs/…/ai-model-evaluation-board](https://github.com/poluru-labs/enterprise-angular-free-ai-web-templates/tree/main/ai-model-evaluation-board) |

After `npm start`, run an evaluation from the header, then open Suites, Datasets, and Scorecards. If another template is already on port 4200, start with `npx ng serve --port 4218`.

## What you get

- Evaluation-run KPIs and regression watch
- Suite orchestration across checkpoints
- Dataset versioning
- Scorecard sign-off
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
| `/` | Board — KPIs, suites, recent activity |
| `/suites` | Suites — quality, safety, and reasoning packs |
| `/datasets` | Datasets — pinned revisions |
| `/scorecards` | Scorecards — release sign-off |
| `/settings` | Workspace settings |

```bash
npm run build
```

Production output: `dist/ai-model-evaluation-board`.

## Stack

Angular 21 (standalone components, router), Bootstrap 5, Material Symbols, DM Sans, [`@poluru-labs/enterprise-design-system-angular`](https://www.npmjs.com/package/@poluru-labs/enterprise-design-system-angular). Demo people include **Ananya Poluru**, Devika Poluru, and Rohan Poluru.

Copy lives in `src/template.config.ts`. Layout and brand color live in `src/app/app.component.ts` and `src/styles.scss`.

## License

[MIT](../LICENSE) © 2026 [Subrahmanyam Poluru](https://polurus.com) / Poluru Labs
