import type {
  EndpointRow,
  FilterRow,
  Metric,
  PiiRule,
  PolicyRow,
  ViolationRow
} from '../../core/config/template.config';

export type PlaygroundHit = {
  kind: 'filter' | 'pii';
  id: string;
  label: string;
  action: string;
  score: number;
};

export type PlaygroundVerdict = 'Blocked' | 'Redacted' | 'Flagged' | 'Allowed';

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

export function filterPolicies(rows: PolicyRow[], query: string, status = 'All'): PolicyRow[] {
  const q = query.trim().toLowerCase();
  return rows.filter((item) => {
    const hay = `${item.id} ${item.name} ${item.owner} ${item.severity} ${item.status} ${item.detail}`.toLowerCase();
    const matchesQuery = !q || hay.includes(q);
    const matchesStatus = status === 'All' || item.status === status;
    return matchesQuery && matchesStatus;
  });
}

export function filterFilters(rows: FilterRow[], query: string, status = 'All'): FilterRow[] {
  const q = query.trim().toLowerCase();
  return rows.filter((item) => {
    const hay = `${item.id} ${item.name} ${item.category} ${item.action} ${item.owner} ${item.status}`.toLowerCase();
    const matchesQuery = !q || hay.includes(q);
    const matchesStatus = status === 'All' || item.status === status;
    return matchesQuery && matchesStatus;
  });
}

export function filterPii(rows: PiiRule[], query: string, status = 'All'): PiiRule[] {
  const q = query.trim().toLowerCase();
  return rows.filter((item) => {
    const hay = `${item.id} ${item.entity} ${item.action} ${item.pattern} ${item.owner} ${item.status}`.toLowerCase();
    const matchesQuery = !q || hay.includes(q);
    const matchesStatus = status === 'All' || item.status === status;
    return matchesQuery && matchesStatus;
  });
}

export function filterEndpoints(rows: EndpointRow[], query: string, status = 'All'): EndpointRow[] {
  const q = query.trim().toLowerCase();
  return rows.filter((item) => {
    const hay = `${item.id} ${item.name} ${item.model} ${item.policy} ${item.piiPack} ${item.owner} ${item.status}`.toLowerCase();
    const matchesQuery = !q || hay.includes(q);
    const matchesStatus = status === 'All' || item.status === status;
    return matchesQuery && matchesStatus;
  });
}

export function filterViolations(rows: ViolationRow[], query: string, status = 'All'): ViolationRow[] {
  const q = query.trim().toLowerCase();
  return rows.filter((item) => {
    const hay = `${item.id} ${item.endpoint} ${item.policy} ${item.snippet} ${item.action} ${item.owner} ${item.status}`.toLowerCase();
    const matchesQuery = !q || hay.includes(q);
    const matchesStatus = status === 'All' || item.status === status;
    return matchesQuery && matchesStatus;
  });
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

export function activePolicyCount(rows: PolicyRow[]): number {
  return rows.filter((item) => item.status === 'Active').length;
}

export function liveEndpointCount(rows: EndpointRow[]): number {
  return rows.filter((item) => item.status === 'Live').length;
}

export function openViolationCount(rows: ViolationRow[]): number {
  return rows.filter((item) => item.status === 'Open').length;
}

function pushHit(
  hits: PlaygroundHit[],
  rows: { id: string; action: string }[],
  id: string,
  label: string,
  kind: PlaygroundHit['kind'],
  score: number
): void {
  const row = rows.find((item) => item.id === id);
  if (!row) {
    return;
  }
  hits.push({ kind, id, label, action: row.action, score });
}

export function evaluatePrompt(
  text: string,
  filters: FilterRow[],
  piiRules: PiiRule[],
  threshold = 0.5
): PlaygroundHit[] {
  const hits: PlaygroundHit[] = [];
  const lower = text.toLowerCase();

  if (/\b\d{3}-\d{2}-\d{4}\b/.test(text) || lower.includes('ssn')) {
    pushHit(hits, piiRules, 'ssn', 'SSN', 'pii', 0.98);
  }
  if (/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(text) || lower.includes('@gmail')) {
    pushHit(hits, piiRules, 'email', 'Email', 'pii', 0.94);
  }
  if (/\b(?:\+1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/.test(text)) {
    pushHit(hits, piiRules, 'phone', 'Phone', 'pii', 0.8);
  }
  if (lower.includes('ignore previous') || lower.includes('jailbreak') || lower.includes('system prompt')) {
    pushHit(hits, filters, 'jailbreak', 'Jailbreak', 'filter', 0.88);
  }
  if (lower.includes('slur') || lower.includes('hate')) {
    pushHit(hits, filters, 'hate', 'Hate', 'filter', 0.91);
  }
  if (lower.includes('weapon') || lower.includes('violence')) {
    pushHit(hits, filters, 'violence', 'Violence', 'filter', 0.86);
  }
  if (lower.includes('self-harm') || lower.includes('hurt myself')) {
    pushHit(hits, filters, 'self-harm', 'Self-harm', 'filter', 0.93);
  }
  if (lower.includes('explicit') || lower.includes('sexual')) {
    pushHit(hits, filters, 'sexual', 'Sexual', 'filter', 0.84);
  }

  return hits
    .filter((hit) => hit.score >= threshold)
    .sort((a, b) => b.score - a.score);
}

export function playgroundVerdict(hits: PlaygroundHit[]): PlaygroundVerdict {
  if (hits.some((hit) => hit.action === 'Block')) {
    return 'Blocked';
  }
  if (hits.some((hit) => hit.action === 'Redact' || hit.action === 'Mask' || hit.action === 'Hash')) {
    return 'Redacted';
  }
  if (hits.some((hit) => hit.action === 'Flag' || hit.action === 'Log')) {
    return 'Flagged';
  }
  return 'Allowed';
}

export function coveragePct(endpoints: EndpointRow[], policies: PolicyRow[]): number {
  const live = endpoints.filter((item) => item.status === 'Live');
  if (live.length === 0) {
    return 0;
  }
  const active = new Set(policies.filter((item) => item.status === 'Active').map((item) => item.id));
  const covered = live.filter((item) => active.has(item.policy)).length;
  return Number(((covered / live.length) * 100).toFixed(1));
}
