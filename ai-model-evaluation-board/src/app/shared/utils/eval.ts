import type { DatasetRow, ModelRow, SuiteRow } from '../../core/config/template.config';

export function parseScore(score: string): number {
  const n = Number.parseFloat(score.replace('%', '').trim());
  return Number.isFinite(n) ? n : 0;
}

export function scoreDelta(score: string, baseline: string): number {
  return Math.round((parseScore(score) - parseScore(baseline)) * 10) / 10;
}

export function meetsBaseline(score: string, baseline: string): boolean {
  return parseScore(score) >= parseScore(baseline);
}

export function filterSuites(rows: SuiteRow[], query: string, status = 'All'): SuiteRow[] {
  const q = query.trim().toLowerCase();
  return rows.filter((item) => {
    const hay = `${item.name} ${item.owner} ${item.model} ${item.status}`.toLowerCase();
    const matchesQuery = !q || hay.includes(q);
    const matchesStatus = status === 'All' || item.status === status;
    return matchesQuery && matchesStatus;
  });
}

export function filterDatasets(rows: DatasetRow[], query: string, status = 'All'): DatasetRow[] {
  const q = query.trim().toLowerCase();
  return rows.filter((item) => {
    const hay = `${item.title} ${item.owner} ${item.revision} ${item.status}`.toLowerCase();
    const matchesQuery = !q || hay.includes(q);
    const matchesStatus = status === 'All' || item.status === status;
    return matchesQuery && matchesStatus;
  });
}

export function rankModels(rows: ModelRow[]): ModelRow[] {
  return [...rows].sort((a, b) => parseScore(b.bestScore) - parseScore(a.bestScore));
}

export function paginate<T>(rows: T[], page: number, pageSize: number): T[] {
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * pageSize;
  return rows.slice(start, start + pageSize);
}
