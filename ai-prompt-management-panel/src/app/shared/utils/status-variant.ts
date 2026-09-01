export type StatusVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const SUCCESS = new Set(['live', 'enabled', 'winner', 'promoted', 'candidate']);
const WARNING = new Set(['review', 'draft', 'paused', 'running']);
const DANGER = new Set(['archived', 'retired', 'blocked']);
const INFO = new Set(['queued', 'updated', 'forked']);

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
