# Annotation Quality Dashboard

Measure inter-annotator agreement, label accuracy, and dataset health for training pipelines.

A light Angular dashboard using the `#72BAA9` theme, Google Fonts Roboto and Lato, and 17 components from `@poluru-labs/enterprise-design-system-angular`.

## Features

- Dataset-scoped agreement, accuracy, reviewed annotation counts, and health indicators.
- Agreement trend charts with 7-day and 30-day views.
- Searchable dataset table with health filters and detail dialogs.
- Disagreement review queue with final label selection and required decision notes.
- Sortable annotator performance table with fictional Poluru names.
- Session-based quality reports and CSV exports.
- Configurable accuracy and agreement thresholds with immediate health recalculation.
- Light sidebar, responsive layouts, and keyboard-accessible design-system controls.

## Local development

```sh
npm ci
npm start
```

Open `http://localhost:4200`.

```sh
npm run build
npm test -- --watch=false
```

Production browser files are generated in `dist/ai-annotation-quality-dashboard/browser`. This dashboard renders in the browser because the design system's SVG icon implementation requires a browser DOM.

## Demo data

All records, people, and metrics are fictional. Changes reset on reload. No backend, authentication, or annotation pipeline is connected.

Agreement and accuracy are seeded percentages weighted by reviewed annotation counts for the selected datasets. They are illustrative, not computed from raw labels. The 7-day series is an illustrative recent-window trend. Changing the chart period does not change the September snapshot metrics. Dataset health requires both configured thresholds; coverage is a separate sample metric. Resolving a dispute updates the review queue but does not rerun an evaluation or change snapshot accuracy. Quality checks capture the existing sample metrics into session reports.

Created by [Subrahmanyam Poluru](https://polurus.com).

Built with [@poluru-labs/enterprise-design-system-angular](https://www.npmjs.com/package/@poluru-labs/enterprise-design-system-angular).
