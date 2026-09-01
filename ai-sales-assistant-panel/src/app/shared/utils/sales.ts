import type { AccountRow, ForecastRow, MeetingRow, Metric, SequenceRow, SignalRow } from '../../core/config/template.config';

export type SignalNode = {
  id: string;
  label: string;
  children?: SignalNode[];
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

export function filterAccounts(rows: AccountRow[], query: string, tags: string[] = []): AccountRow[] {
  const q = query.trim().toLowerCase();
  return rows.filter((item) => {
    const hay = `${item.name} ${item.owner} ${item.stage} ${item.risk} ${item.brief} ${item.region}`.toLowerCase();
    const matchesQuery = !q || hay.includes(q);
    const matchesTags =
      tags.length === 0 || tags.some((tag) => item.risk === tag || item.brief === tag || item.stage === tag || item.region === tag);
    return matchesQuery && matchesTags;
  });
}

export function filterMeetings(rows: MeetingRow[], query: string, type = 'All'): MeetingRow[] {
  const q = query.trim().toLowerCase();
  return rows.filter((item) => {
    const hay = `${item.account} ${item.owner} ${item.type} ${item.status}`.toLowerCase();
    const matchesQuery = !q || hay.includes(q);
    const matchesType = type === 'All' || item.type === type;
    return matchesQuery && matchesType;
  });
}

export function sequenceProgress(item: Pick<SequenceRow, 'done' | 'steps'>): number {
  if (item.steps <= 0) {
    return 0;
  }
  return Math.round((item.done / item.steps) * 100);
}

export function pipelineTotal(rows: AccountRow[]): number {
  return rows.reduce((sum, item) => sum + item.amount, 0);
}

export function coverageLabel(row: ForecastRow): string {
  if (row.coverage >= 80) {
    return 'Above bar';
  }
  if (row.coverage >= 60) {
    return 'Watch';
  }
  return 'Below floor';
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

export function signalTree(signals: SignalRow[]): SignalNode[] {
  const types = [...new Set(signals.map((item) => item.type))];
  const children: SignalNode[] = types.map((type) => ({
    id: slug(type),
    label: type,
    children: signals
      .filter((item) => item.type === type)
      .map((item) => ({ id: slug(item.account), label: item.account }))
  }));
  return [{ id: 'workspace', label: 'Garnet Close', children }];
}

export function selectedSignalLabel(id: string, signals: SignalRow[]): string {
  if (id === 'workspace') {
    return 'Garnet Close';
  }
  const typeMatch = signals.find((item) => slug(item.type) === id);
  if (typeMatch) {
    return typeMatch.type;
  }
  const account = signals.find((item) => slug(item.account) === id);
  return account?.account ?? 'Expansion';
}

export function selectedSignalOwner(label: string, signals: SignalRow[], fallback: string): string {
  const found = signals.find((item) => item.account === label || item.type === label);
  return found?.owner ?? fallback;
}

export function watchCount(accounts: AccountRow[], signals: SignalRow[]): number {
  const watchAccounts = accounts.filter((item) => item.risk === 'Watch' || item.risk === 'High').length;
  const openSignals = signals.filter((item) => item.status === 'New' || item.status === 'Review').length;
  return watchAccounts + openSignals;
}
