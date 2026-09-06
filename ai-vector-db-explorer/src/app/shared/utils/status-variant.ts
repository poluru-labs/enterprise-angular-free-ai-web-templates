export type StatusVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const SUCCESS = new Set(['healthy', 'live', 'ready', 'indexed', 'warm', 'active', 'match', 'stable']);
const WARNING = new Set(['rebuilding', 'watch', 'stale', 'cooling', 'pending', 'drift', 'weak']);
const DANGER = new Set(['down', 'failed', 'critical', 'frozen']);
const INFO = new Set(['querying', 'queued', 'warming', 'new']);

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
