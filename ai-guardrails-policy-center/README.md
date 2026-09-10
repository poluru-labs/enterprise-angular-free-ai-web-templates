# Reef — Guardrails policy center

Define and test content filters, PII redaction rules, and safety policies for LLM endpoints. Reef is a policy admin with a **full-width sticky header** and a **simple sidebar**.

## Screenshot

<img width="3360" height="4234" alt="ai-guardrails-policy-center" src="https://github.com/user-attachments/assets/45769cd4-3fdd-4127-b840-56f977702485" />


**Brand:** `#26CCC2`  
**Folder:** `ai-guardrails-policy-center`

## Demo

| | |
| --- | --- |
| Local demo | [http://localhost:4221](http://localhost:4221) |
| Source | [github.com/poluru-labs/…/ai-guardrails-policy-center](https://github.com/poluru-labs/enterprise-angular-free-ai-web-templates/tree/main/ai-guardrails-policy-center) |

After `npm start`, switch Day / Week / Month on Overview, then open Policies, Filters, PII rules, Endpoints, Playground, and Violations. Try ⌘K to jump into the playground. If another template is already on port 4221, start with `npx ng serve --port 4231`.

## What you get

- Blocked-prompt, PII-redaction, coverage, and false-positive KPIs that change by day / week / month
- Safety policy catalog with search, status filters, pagination, and owner cards
- Content filters for hate, sexual, violence, self-harm, and jailbreak
- PII redaction rules for email, phone, SSN, PAN, address, and name
- LLM endpoints with attached policies and PII packs
- Playground that scores a prompt against filters and PII rules
- Violation inbox for blocked, redacted, and flagged hits
- Threshold, logging, and retention settings

## Run

Requires Node.js 20+.

```bash
cd ai-guardrails-policy-center
npm install
npm start
```

| Route | Page |
| --- | --- |
| `/` | Overview — KPIs, blocked volume, policy coach, live catalog |
| `/policies` | Safety policy catalog — filters, table, pagination |
| `/filters` | Content classifiers and thresholds |
| `/pii` | PII redaction rules |
| `/endpoints` | LLM endpoints with attached packs |
| `/playground` | Test a prompt against policies |
| `/violations` | Blocked, redacted, and flagged hits |
| `/settings` | Thresholds, logging, and retention |

```bash
npm run build
```

Production output: `dist/ai-guardrails-policy-center`.

## Stack

Angular 21 (standalone components, router), Bootstrap 5, Material Symbols, DM Sans, [`@poluru-labs/enterprise-design-system-angular`](https://www.npmjs.com/package/@poluru-labs/enterprise-design-system-angular). Demo people include **Maya Poluru**, Kavya Poluru, Arjun Poluru, Nikhil Poluru, Anika Poluru, Priya Poluru, and Rohan Poluru.

Copy lives in `src/app/core/config/template.config.ts`. Layout and brand color live in `src/styles.scss`.

```
src/
  app/
    core/config/          shared template copy
    features/             one folder per route
    shared/               spec helpers and policy utils
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
