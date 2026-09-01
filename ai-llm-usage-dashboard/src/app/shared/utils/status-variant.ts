export type StatusVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const SUCCESS = new Set(['active', 'ready', 'healthy', 'on track', 'acknowledged']);
const WARNING = new Set(['watch', 'restricted', 'snoozed', 'high']);
const DANGER = new Set(['critical', 'open', 'over cap']);
const INFO = new Set(['updated', 'review', 'queued']);

export function statusVariant(status: string): StatusVariant {
  const key = status.trim().toLowerCase();
  if (SUCCESS.has(key)) {
    return 'success';
  }
  if (DANGER.has(key)) {
    return 'danger';
  }
  if (WARNING.has(key)) {
    return 'warning';
  }
  if (INFO.has(key)) {
    return 'info';
  }
  return 'neutral';
}

export function spendStatus(spend: number): 'Watch' | 'On track' | 'Over cap' {
  if (spend >= 100) {
    return 'Over cap';
  }
  if (spend >= 80) {
    return 'Watch';
  }
  return 'On track';
}
