# Indigo Vault — RAG knowledge admin

Enterprise workspace for indexing, retrieving, and governing knowledge
sources. Light canvas with a **full-width sticky header** in brand
**`#4300FF`**, plus a **simple sidebar**.

## Run

Requires Node.js 20+.

```bash
cd ai-rag-knowledge-admin
npm install
npm start
```

Default dev server: http://localhost:4214

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

Angular 21 (standalone components, router), Bootstrap 5, Material Symbols,
DM Sans, `@poluru-labs/enterprise-design-system-angular`. Demo people include
**Ananya Poluru**, Venkata Poluru, Lakshmi Poluru, Meera Poluru, Priya Poluru,
Nikhil Poluru, Sravani Poluru, Ramesh Poluru, and Hana Poluru.

Copy and mock data live in `src/template.config.ts`. Layout and brand color
live in `src/app/app.component.ts` and `src/styles.scss`.
