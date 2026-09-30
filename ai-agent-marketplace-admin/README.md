# Agent Marketplace Admin

Publish, version, and govern internal AI agents with approval workflows and usage analytics.

An Angular dashboard with a `#450C3F` plum theme, Google Fonts Roboto and Lato, and components from `@poluru-labs/enterprise-design-system-angular`.

## Screenshot

<img width="3360" height="4516" alt="ai-agent-marketplace-admin" src="https://github.com/user-attachments/assets/8bf16255-7f59-4af6-a122-fb3c4c2f392f" />


## Features

- Overview with invocation trends, publication metrics, and an approval queue.
- Searchable agent catalog with category and status filters.
- Draft creation, approval submission, approval or return for changes, and version validation.
- Usage analytics with 7-day and 30-day views and CSV report export.
- Governance preferences and a workspace activity trail.
- Responsive navigation, keyboard-accessible controls, and design-system dialogs.

All data is fictional. Names end in Poluru. Changes are held in memory for the current session and reset on reload; no backend, authentication, or real agent execution is connected. Version submission replaces the demo record and moves it into review; production version history is not implemented.

## Development

```sh
npm ci
npm start
```

Open `http://localhost:4200`.

```sh
npm run build
npm test -- --watch=false
```

The dashboard uses browser rendering because the design system's SVG icon implementation is incompatible with the server DOM. Production browser output is in `dist/ai-agent-marketplace-admin/browser`.

Created by [Subrahmanyam Poluru](https://polurus.com).

Built with [@poluru-labs/enterprise-design-system-angular](https://www.npmjs.com/package/@poluru-labs/enterprise-design-system-angular).
