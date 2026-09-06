import type { IndexRow, Metric, NamespaceRow, VectorRow } from '../../core/config/template.config';

export type NamespaceNode = {
  id: string;
  label: string;
  children?: NamespaceNode[];
};

export function slug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function paginate<T>(rows: T[], page: number, pageSize: number): T[] {
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * pageSize;
  return rows.slice(start, start + pageSize);
}

export function filterIndexes(rows: IndexRow[], query: string, status = 'All'): IndexRow[] {
  const q = query.trim().toLowerCase();
  return rows.filter((item) => {
    const hay = `${item.id} ${item.name} ${item.owner} ${item.metric} ${item.region} ${item.status}`.toLowerCase();
    const matchesQuery = !q || hay.includes(q);
    const matchesStatus = status === 'All' || item.status === status;
    return matchesQuery && matchesStatus;
  });
}

export function filterNamespaces(rows: NamespaceRow[], query: string, status = 'All'): NamespaceRow[] {
  const q = query.trim().toLowerCase();
  return rows.filter((item) => {
    const hay = `${item.id} ${item.name} ${item.index} ${item.owner} ${item.status}`.toLowerCase();
    const matchesQuery = !q || hay.includes(q);
    const matchesStatus = status === 'All' || item.status === status;
    return matchesQuery && matchesStatus;
  });
}

export function filterVectors(rows: VectorRow[], query: string, index = 'All'): VectorRow[] {
  const q = query.trim().toLowerCase();
  return rows.filter((item) => {
    const hay = `${item.id} ${item.index} ${item.namespace} ${item.preview} ${item.owner}`.toLowerCase();
    const matchesQuery = !q || hay.includes(q);
    const matchesIndex = index === 'All' || item.index === index;
    return matchesQuery && matchesIndex;
  });
}

export function similarityHits(rows: VectorRow[], minScore: number, topK: number): VectorRow[] {
  return rows
    .filter((item) => item.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.max(1, topK));
}

export function metricsForPeriod(
  period: string,
  byPeriod: Record<'day' | 'week' | 'month', Metric[]>,
  fallback: Metric[]
): Metric[] {
  if (period === 'day' || period === 'week' || period === 'month') {
    return byPeriod[period];
  }
  return fallback;
}

export function namespaceTree(rows: NamespaceRow[]): NamespaceNode[] {
  const indexes = [...new Set(rows.map((item) => item.index))];
  const children: NamespaceNode[] = indexes.map((index) => ({
    id: slug(index),
    label: index,
    children: rows
      .filter((item) => item.index === index)
      .map((item) => ({ id: item.id, label: item.name }))
  }));
  return [{ id: 'workspace', label: 'Lattice', children }];
}

export function selectedNamespaceLabel(id: string, rows: NamespaceRow[]): string {
  if (id === 'workspace') {
    return 'Lattice';
  }
  const indexMatch = rows.find((item) => slug(item.index) === id);
  if (indexMatch) {
    return indexMatch.index;
  }
  const ns = rows.find((item) => item.id === id);
  return ns?.name ?? 'eu-live';
}

export function warmCount(rows: NamespaceRow[]): number {
  return rows.filter((item) => item.status === 'Warm' || item.status === 'Querying').length;
}

export function averageRecall(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }
  return Number((values.reduce((sum, item) => sum + item, 0) / values.length).toFixed(2));
}
