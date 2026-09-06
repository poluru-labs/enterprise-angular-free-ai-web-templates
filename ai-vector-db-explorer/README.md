# Lattice — AI vector DB explorer

Browse, search, and inspect embeddings, namespaces, and similarity scores across vector indexes. Lattice is a vector-ops admin with a **full-width sticky header**, a **simple sidebar**, and **square corners**.

**Brand:** `#45A9A9`  
**Folder:** `ai-vector-db-explorer`

## Demo

| | |
| --- | --- |
| Local demo | [http://localhost:4220](http://localhost:4220) |
| Source | [github.com/poluru-labs/…/ai-vector-db-explorer](https://github.com/poluru-labs/enterprise-angular-free-ai-web-templates/tree/main/ai-vector-db-explorer) |

After `npm start`, switch Day / Week / Month on Overview, then open Indexes, Namespaces, Vectors, Search, Neighbors, and Clusters. Try ⌘K to jump into similarity search. If another template is already on port 4220, start with `npx ng serve --port 4230`.

## What you get

- Indexed-vector, query p95, recall, and warm-namespace KPIs that change by day / week / month
- Index catalog with search, status filters, pagination, and owner cards
- Namespace tree with warm / cooling / frozen partitions
- Vector browser with preview text and similarity scores
- Similarity playground with k, min score, and cosine / dot / L2
- Neighbor inspect with pairwise scores
- Cluster cohesion and drift
- Upsert, replica, metric, and retention settings

## Run

Requires Node.js 20+.

```bash
cd ai-vector-db-explorer
npm install
npm start
```

| Route | Page |
| --- | --- |
| `/` | Overview — KPIs, query volume, index coach, live catalog |
| `/indexes` | Index catalog — filters, table, pagination |
| `/namespaces` | Namespace tree and replica health |
| `/vectors` | Embedding browser |
| `/search` | Similarity playground and hits |
| `/neighbors` | Pairwise scores around a source vector |
| `/clusters` | Cohesion and drift |
| `/settings` | Rebuild, replicas, metric, and retention |

```bash
npm run build
```

Production output: `dist/ai-vector-db-explorer`.

## Stack

Angular 21 (standalone components, router), Bootstrap 5, Material Symbols, DM Sans, [`@poluru-labs/enterprise-design-system-angular`](https://www.npmjs.com/package/@poluru-labs/enterprise-design-system-angular). Demo people include **Maya Poluru**, Kavya Poluru, Arjun Poluru, Nikhil Poluru, Ishaan Poluru, Anika Poluru, Priya Poluru, Rohan Poluru, and Dev Poluru.

Copy lives in `src/app/core/config/template.config.ts`. Layout and brand color live in `src/styles.scss`.

```
src/
  app/
    core/config/          shared template copy
    features/             one folder per route
    shared/               spec helpers and vector utils
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
