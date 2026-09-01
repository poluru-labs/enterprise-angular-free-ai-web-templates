export type StatusVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const SUCCESS = new Set(['complete', 'ready', 'healthy', 'approved', 'default']);
const WARNING = new Set(['review', 'running', 'syncing', 'blocked', 'held', 'canary', 'drift']);
const DANGER = new Set(['failed', 'open', 'critical']);
const INFO = new Set(['queued', 'publish', 'workspace']);

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
