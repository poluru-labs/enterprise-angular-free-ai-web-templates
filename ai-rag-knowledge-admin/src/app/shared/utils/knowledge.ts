import type { AclReview, CollectionRow, IndexJob, QueryHit, SourceRow } from '../../core/config/template.config';

export type CollectionNode = {
  id: string;
  label: string;
  children?: CollectionNode[];
};

export function slug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function filterSources(rows: SourceRow[], query: string, tags: string[] = []): SourceRow[] {
  const q = query.trim().toLowerCase();
  return rows.filter((item) => {
    const hay = `${item.name} ${item.type} ${item.owner} ${item.status} ${item.collection}`.toLowerCase();
    const matchesQuery = !q || hay.includes(q);
    const matchesTags =
      tags.length === 0 ||
      tags.some((tag) => item.status === tag || item.collection === tag || item.type === tag);
    return matchesQuery && matchesTags;
  });
}

export function paginate<T>(rows: T[], page: number, pageSize: number): T[] {
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * pageSize;
  return rows.slice(start, start + pageSize);
}

export function parseScore(value: string): number {
  const n = Number.parseFloat(value.trim());
  return Number.isFinite(n) ? n : 0;
}

export function groundedHits(rows: QueryHit[], minScore: number, topK: number): QueryHit[] {
  return rows.filter((item) => parseScore(item.score) >= minScore).slice(0, Math.max(1, topK));
}

export function hybridRequest(query: string, topK: number, mode: string, owner: string): string {
  return JSON.stringify(
    {
      query,
      top_k: topK,
      mode,
      owner
    },
    null,
    2
  );
}

export function collectionTree(collections: CollectionRow[], sources: SourceRow[]): CollectionNode[] {
  const children: CollectionNode[] = collections.map((collection) => ({
    id: slug(collection.name),
    label: collection.name,
    children: sources
      .filter((source) => source.collection === collection.name)
      .map((source) => ({ id: slug(source.name), label: source.name }))
  }));

  return [{ id: 'library', label: 'Indigo Vault', children }];
}

export function selectedCollectionLabel(id: string, collections: CollectionRow[], sources: SourceRow[]): string {
  if (id === 'library') {
    return 'Indigo Vault';
  }
  const collection = collections.find((item) => slug(item.name) === id);
  if (collection) {
    return collection.name;
  }
  const source = sources.find((item) => slug(item.name) === id);
  return source?.name ?? 'Public';
}

export function selectedCollectionOwner(
  label: string,
  collections: CollectionRow[],
  sources: SourceRow[],
  fallback: string
): string {
  const collection = collections.find((item) => item.name === label);
  if (collection) {
    return collection.owner;
  }
  const source = sources.find((item) => item.name === label);
  return source?.owner ?? fallback;
}

export function retryJob(jobs: IndexJob[], id: string): IndexJob[] {
  return jobs.map((job) =>
    job.id === id && job.status === 'Failed' ? { ...job, status: 'Running', stage: 'Crawl', progress: 8 } : job
  );
}

export function patchAcl(rows: AclReview[], id: string, status: AclReview['status']): AclReview[] {
  return rows.map((item) => (item.id === id ? { ...item, status } : item));
}

export function pinCollection(rows: CollectionRow[], name: string): CollectionRow[] {
  return rows.map((item) => (item.name === name ? { ...item, pinned: !item.pinned } : item));
}

export function filterCollections(rows: CollectionRow[], filter: 'All' | 'Pinned' | 'Restricted'): CollectionRow[] {
  if (filter === 'Pinned') {
    return rows.filter((item) => item.pinned);
  }
  if (filter === 'Restricted') {
    return rows.filter((item) => item.visibility === 'Restricted');
  }
  return rows;
}

export function retrievalMode(index: number): 'hybrid' | 'dense' | 'keyword' {
  if (index === 1) {
    return 'dense';
  }
  if (index === 2) {
    return 'keyword';
  }
  return 'hybrid';
}
