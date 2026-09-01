# Prompt library — prompt management panel

Create, test, and govern reusable prompts for every team workflow. Prompt library uses a light canvas with brand **`#08766C`**.

**Brand:** `#08766C`  
**Folder:** `ai-prompt-management-panel`

## Demo

| | |
| --- | --- |
| Local demo | [http://localhost:4219](http://localhost:4219) |
| Source | [github.com/poluru-labs/…/ai-prompt-management-panel](https://github.com/poluru-labs/enterprise-angular-free-ai-web-templates/tree/main/ai-prompt-management-panel) |

After `npm start`, create a prompt from the header, then open Experiments, Versions, and Collections. Try ⌘K to search the library. If another template is already on port 4219, start with `npx ng serve --port 4229`.

## What you get

- Published-prompt, success-rate, and review KPIs that change by day / week / month
- Prompt catalog with search, status filters, pagination, and a playground test run
- Experiment board with declare-winner
- Version history with promote / roll back
- Collections with pin / unpin
- Review inbox and new-prompt modal (name, collection, body)

## Run

Requires Node.js 20+.

```bash
cd ai-prompt-management-panel
npm install
npm start
```

| Route | Page |
| --- | --- |
| `/` | Library — KPIs, catalog, playground, activity |
| `/experiments` | Experiments — control vs challenger |
| `/versions` | Versions — promote and roll back |
| `/collections` | Collections — pinned team libraries |
| `/settings` | Workspace settings |

```bash
npm run build
```

Production output: `dist/ai-prompt-management-panel`.

## Stack

Angular 21 (standalone components, router), Bootstrap 5, Material Symbols, DM Sans, [`@poluru-labs/enterprise-design-system-angular`](https://www.npmjs.com/package/@poluru-labs/enterprise-design-system-angular). Demo people include **Priya Poluru**, Rohan Poluru, Devika Poluru, Karthik Poluru, Meera Poluru, Arjun Poluru, Ananya Poluru, and Venkata Poluru.

Copy lives in `src/app/core/config/template.config.ts`. Layout and brand color live in `src/styles.scss`.

```
src/
  app/
    core/config/          shared template copy
    features/             one folder per route
    shared/               spec helpers and prompt utils
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
