# Code Review Assistant Panel

Review AI-generated code suggestions, acceptance rates, and per-repo productivity metrics.

A light Angular dashboard with top navigation, a `#C3110C` theme, Google Fonts Roboto and Lato, and 15 components from `@poluru-labs/enterprise-design-system-angular`.

## Screenshot

<img width="3360" height="4088" alt="ai-code-review-assistant-ui" src="https://github.com/user-attachments/assets/d723dc76-bf7d-4c4b-a28d-3fd053607277" />


## Features

- Overview with suggestion totals, acceptance rates, estimated time saved, and pending reviews.
- Workspace activity chart with week/month views and a suggestion outcome chart.
- Original/suggested code comparisons rendered as plain text, never executed.
- Searchable review queue with repository and decision filters.
- Accept and decline actions, configurable decline-note requirements, and an activity trail.
- New review submission with title, repository, file path, and code snippets.
- Repository productivity table, historical team performance, and CSV export.
- Responsive horizontal navigation, accessible design-system controls, and review dialogs.

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

Production browser output: `dist/ai-code-review-assistant-ui/browser`.

The application uses browser rendering because the design-system SVG icon implementation requires a browser DOM.

## Demo behavior

All people and metrics are fictional. Session changes reset on reload. No backend, repository connection, code execution, or actual source changes are implemented.

Historical repository decisions are combined with session decisions for overview metrics. Acceptance rate is accepted decisions divided by all decided suggestions; pending suggestions are excluded. Estimated time saved uses a fixed sample number of minutes per accepted suggestion for each repository. Team performance remains the historical snapshot. The activity chart is an illustrative workspace series; its time selector does not change the repository snapshot metrics.

Created by [Subrahmanyam Poluru](https://polurus.com).

Built with [@poluru-labs/enterprise-design-system-angular](https://www.npmjs.com/package/@poluru-labs/enterprise-design-system-angular).
