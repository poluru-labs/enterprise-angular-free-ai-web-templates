# Harbor Desk — AI support copilot

Give support teams a live view of AI-assisted replies, resolution quality, and queue health. Harbor Desk is a customer-operations admin with a **full-width sticky header** and a **simple sidebar**.

**Brand:** `#434E78`  
**Folder:** `ai-support-copilot-dashboard`

## Demo

| | |
| --- | --- |
| Local demo | [http://localhost:4217](http://localhost:4217) |
| Source | [github.com/poluru-labs/…/ai-support-copilot-dashboard](https://github.com/poluru-labs/enterprise-angular-free-ai-web-templates/tree/main/ai-support-copilot-dashboard) |

After `npm start`, try **⌘K** to draft a copilot reply, open the inbox drawer from the bell, and walk Queue → Inbox → Suggestions → Knowledge → Settings.

## What you get

- Live queue KPIs (AI-assisted replies, resolution rate, wait, CSAT)
- Hourly volume, SLA meters, and agent load
- Conversation inbox with search, date range, tags, and pagination
- Suggestion map for billing, orders, and escalations
- Knowledge publish cycle and article hit rates
- Workspace settings for auto-draft, grounding, and retention

## Run

Requires Node.js 20+.

```bash
cd ai-support-copilot-dashboard
npm install
npm start
```

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

Angular 21 (standalone components, router), Bootstrap 5, Material Symbols, DM Sans, [`@poluru-labs/enterprise-design-system-angular`](https://www.npmjs.com/package/@poluru-labs/enterprise-design-system-angular). Demo people include **Ananya Poluru**, Kavya Poluru, Rohan Poluru, Nikhil Poluru, Meera Poluru, Sravani Poluru, Hana Poluru, Venkata Poluru, Arjun Poluru, Priya Poluru, and Lakshmi Poluru.

Copy lives in `src/template.config.ts`. Layout and brand color live in `src/app/app.component.ts` and `src/styles.scss`.

## License

[MIT](../LICENSE) © 2026 [Subrahmanyam Poluru](https://polurus.com) / Poluru Labs
