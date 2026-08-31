# Indigo Vault — RAG knowledge admin

Index, retrieve, and govern enterprise knowledge sources. Indigo Vault is a RAG admin with a **full-width sticky header** and a **simple sidebar**.

**Brand:** `#4300FF`  
**Folder:** `ai-rag-knowledge-admin`

## Demo

| | |
| --- | --- |
| Local demo | [http://localhost:4214](http://localhost:4214) |
| Source | [github.com/poluru-labs/…/ai-rag-knowledge-admin](https://github.com/poluru-labs/enterprise-angular-free-ai-web-templates/tree/main/ai-rag-knowledge-admin) |

After `npm start`, open Sources and Collections, then run the hybrid search playground on Retrieval.

## What you get

- Source catalog with sync health and owners
- Collection tree and visibility
- Crawl → chunk → embed pipeline
- Hybrid retrieval playground with grounded hits
- Chunking, ACL freeze, and retention settings

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
| `/collections` | Collection tree, visibility, and owners |
| `/indexing` | Crawl → chunk → embed pipeline and jobs |
| `/retrieval` | Hybrid search playground and grounded hits |
| `/settings` | Chunking, ACL freeze, and retention |

```bash
npm run build
```

Production output: `dist/ai-rag-knowledge-admin`.

## Stack

Angular 21 (standalone components, router), Bootstrap 5, Material Symbols, DM Sans, [`@poluru-labs/enterprise-design-system-angular`](https://www.npmjs.com/package/@poluru-labs/enterprise-design-system-angular). Demo people include **Ananya Poluru**, Venkata Poluru, Lakshmi Poluru, Meera Poluru, Priya Poluru, Nikhil Poluru, Sravani Poluru, Ramesh Poluru, and Hana Poluru.

Copy lives in `src/template.config.ts`. Layout and brand color live in `src/app/app.component.ts` and `src/styles.scss`.

## License

[MIT](../LICENSE) © 2026 [Subrahmanyam Poluru](https://polurus.com) / Poluru Labs
