# Harbor Desk — AI support copilot

Customer operations for AI-assisted replies, queue health, and knowledge
grounding. Light canvas with a **full-width sticky header** in brand
**`#434E78`**, plus a **simple sidebar**.

## Run

Requires Node.js 20+.

```bash
cd ai-support-copilot-dashboard
npm install
npm start
```

Default dev server: http://localhost:4217

| Route | Page |
| --- | --- |
| `/` | Queue — KPIs, volume, next-best replies, live tickets |
| `/conversations` | Inbox — filters, conversation table, pagination |
| `/suggestions` | Suggestion map — billing, orders, escalations, owners |
| `/knowledge` | Article cycle, hit rates, topic nav |
| `/settings` | Drafts, grounding, retention, and admin PIN |

```bash
npm run build
```

Production output: `dist/ai-support-copilot-dashboard`.

## Stack

Angular 21 (standalone components, router), Bootstrap 5, Material Symbols,
DM Sans, `@poluru-labs/enterprise-design-system-angular`. Demo people include
**Ananya Poluru**, Kavya Poluru, Rohan Poluru, Nikhil Poluru, Meera Poluru,
Sravani Poluru, Hana Poluru, Venkata Poluru, Arjun Poluru, Priya Poluru,
Lakshmi Poluru, and Ramesh Poluru.

Copy and mock data live in `src/template.config.ts`. Layout and brand color
live in `src/app/app.component.ts` and `src/styles.scss`.
