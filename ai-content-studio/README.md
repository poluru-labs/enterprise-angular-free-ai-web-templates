# Content Studio — AI content workspace

Draft, approve, and schedule campaign content with brand guardrails. Content Studio uses a brand bar in **`#0046FF`** and a compact sidebar.

**Brand:** `#0046FF`  
**Folder:** `ai-content-studio`

## Demo

| | |
| --- | --- |
| Local demo | [http://localhost:4200](http://localhost:4200) |
| Source | [github.com/poluru-labs/…/ai-content-studio](https://github.com/poluru-labs/enterprise-angular-free-ai-web-templates/tree/main/ai-content-studio) |

After `npm start`, open Projects and Calendar, then check Brand voice. If another template is already on port 4200, start with `npx ng serve --port 4213`.

## What you get

- Production, approval, and brand-match KPIs
- Project list with owners and due dates
- Editorial calendar
- Brand-voice guardrails
- Draft / approve workflow modal

## Run

Requires Node.js 20+.

```bash
cd ai-content-studio
npm install
npm start
```

| Route | Page |
| --- | --- |
| `/` | Dashboard — KPIs, features, and recent activity |
| `/projects` | Projects — owners, progress, due dates |
| `/calendar` | Calendar — weekly publishing plan |
| `/brand-voice` | Brand voice — naming and claim rules |
| `/settings` | Workspace toggles |

```bash
npm run build
```

Production output: `dist/ai-content-studio`.

## Stack

Angular 21 (standalone components, router), Bootstrap 5, Material Symbols, DM Sans, [`@poluru-labs/enterprise-design-system-angular`](https://www.npmjs.com/package/@poluru-labs/enterprise-design-system-angular).

Copy lives in `src/template.config.ts`. Layout and brand color live in `src/app/app.component.ts` and `src/styles.scss`.

## License

[MIT](../LICENSE) © 2026 [Subrahmanyam Poluru](https://polurus.com) / Poluru Labs
