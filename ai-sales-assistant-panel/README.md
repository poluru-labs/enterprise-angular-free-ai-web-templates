# Garnet Close — AI sales assistant

Revenue intelligence for account briefs, pipeline signals, and sequences.
Light canvas with a **full-width sticky header** in brand **`#BD4444`**, plus a
**simple sidebar**.

## Run

Requires Node.js 20+.

```bash
cd ai-sales-assistant-panel
npm install
npm start
```

Default dev server: http://localhost:4216

| Route | Page |
| --- | --- |
| `/` | Overview — KPIs, seller activity, next-best actions, pipeline table |
| `/accounts` | Accounts — filters, research table, pagination |
| `/signals` | Signal map — expansion, renewal, outreach, owners |
| `/sequences` | Sequence cycle, cadence progress, weekly motion |
| `/settings` | Briefs, coaching, retention, and admin PIN |

```bash
npm run build
```

Production output: `dist/ai-sales-assistant-panel`.

## Stack

Angular 21 (standalone components, router), Bootstrap 5, Material Symbols,
DM Sans, `@poluru-labs/enterprise-design-system-angular`. Demo people include
**Ananya Poluru**, Kavya Poluru, Rohan Poluru, Nikhil Poluru, Meera Poluru,
Sravani Poluru, Hana Poluru, Venkata Poluru, Arjun Poluru, and Priya Poluru.

Copy and mock data live in `src/template.config.ts`. Layout and brand color
live in `src/app/app.component.ts` and `src/styles.scss`.
