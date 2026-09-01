import type { ExperimentRow, PromptRow, VersionRow } from '../../core/config/template.config';

export function parseRate(value: string): number {
  const n = Number.parseFloat(value.replace('%', '').trim());
  return Number.isFinite(n) ? n : 0;
}

export function canPublish(success: string, floor: number): boolean {
  return parseRate(success) >= floor;
}

export function filterPrompts(rows: PromptRow[], query: string, status = 'All'): PromptRow[] {
  const q = query.trim().toLowerCase();
  return rows.filter((item) => {
    const hay = `${item.name} ${item.collection} ${item.owner} ${item.status}`.toLowerCase();
    const matchesQuery = !q || hay.includes(q);
    const matchesStatus = status === 'All' || item.status === status;
    return matchesQuery && matchesStatus;
  });
}

export function filterExperiments(rows: ExperimentRow[], query: string, status = 'All'): ExperimentRow[] {
  const q = query.trim().toLowerCase();
  return rows.filter((item) => {
    const hay = `${item.name} ${item.collection} ${item.owner} ${item.status}`.toLowerCase();
    const matchesQuery = !q || hay.includes(q);
    const matchesStatus = status === 'All' || item.status === status;
    return matchesQuery && matchesStatus;
  });
}

export function filterVersions(rows: VersionRow[], query: string, status = 'All'): VersionRow[] {
  const q = query.trim().toLowerCase();
  return rows.filter((item) => {
    const hay = `${item.prompt} ${item.version} ${item.owner} ${item.status}`.toLowerCase();
    const matchesQuery = !q || hay.includes(q);
    const matchesStatus = status === 'All' || item.status === status;
    return matchesQuery && matchesStatus;
  });
}

export function rankPrompts(rows: PromptRow[]): PromptRow[] {
  return [...rows].sort((a, b) => parseRate(b.success) - parseRate(a.success));
}

export function paginate<T>(rows: T[], page: number, pageSize: number): T[] {
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * pageSize;
  return rows.slice(start, start + pageSize);
}
