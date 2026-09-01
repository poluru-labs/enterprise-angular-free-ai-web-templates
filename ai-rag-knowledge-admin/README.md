# Indigo Vault — RAG knowledge admin

Index, retrieve, and govern enterprise knowledge sources. Indigo Vault is a RAG admin with a **full-width sticky header** and a **simple sidebar**.

**Brand:** `#4300FF`  
**Folder:** `ai-rag-knowledge-admin`

## Demo

| | |
| --- | --- |
| Local demo | [http://localhost:4214](http://localhost:4214) |
| Source | [github.com/poluru-labs/…/ai-rag-knowledge-admin](https://github.com/poluru-labs/enterprise-angular-free-ai-web-templates/tree/main/ai-rag-knowledge-admin) |

After `npm start`, switch Day / Week / Month on Overview, then open Sources, Collections, Indexing, Retrieval, Governance, and Evaluations. Try ⌘K to search sources. If another template is already on port 4214, start with `npx ng serve --port 4224`.

## What you get

- Indexed-document, retrieval-quality, and storage KPIs that change by day / week / month
- Source catalog with search, status tags, pagination, and a connector wizard
- Collection tree with pin / unpin and visibility
- Crawl → chunk → embed pipeline with retry on failed jobs
- Hybrid retrieval playground with grounded hits and a min-score floor
- Governance inbox for ACL reviews (approve / hold)
- Evaluation packs with nDCG, groundedness, and a canary embedding model
- Chunking, PII redaction, ACL freeze, and retention settings

## Run

Requires Node.js 20+.

```bash
cd ai-rag-knowledge-admin
npm install
npm start
```

| Route | Page |
| --- | --- |
| `/` | Overview — KPIs, query volume, health coach, recent syncs |
| `/sources` | Source catalog — filters, table, pagination |
| `/collections` | Collection tree, pin / unpin, visibility, and owners |
| `/indexing` | Crawl → chunk → embed pipeline and retry |
| `/retrieval` | Hybrid search playground and grounded hits |
| `/governance` | ACL reviews, citation policy, and freeze |
| `/evaluations` | Golden packs, nDCG, groundedness, embedding canary |
| `/settings` | Chunking, PII, ACL freeze, and retention |

```bash
npm run build
```

Production output: `dist/ai-rag-knowledge-admin`.

## Stack

Angular 21 (standalone components, router), Bootstrap 5, Material Symbols, DM Sans, [`@poluru-labs/enterprise-design-system-angular`](https://www.npmjs.com/package/@poluru-labs/enterprise-design-system-angular). Demo people include **Ananya Poluru**, Venkata Poluru, Lakshmi Poluru, Meera Poluru, Priya Poluru, Nikhil Poluru, Sravani Poluru, Ramesh Poluru, Hana Poluru, and Arjun Poluru.

Copy lives in `src/app/core/config/template.config.ts`. Layout and brand color live in `src/styles.scss`.

```
src/
  app/
    core/config/          shared template copy
    features/             one folder per route
    shared/               spec helpers and knowledge utils
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
