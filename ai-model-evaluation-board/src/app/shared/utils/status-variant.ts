export type StatusVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const SUCCESS = new Set(['passed', 'ready', 'enabled', 'signed off', 'candidate', 'baseline', 'acknowledged']);
const WARNING = new Set(['review', 'in review', 'restricted', 'watch', 'snoozed', 'high', 'draft']);
const DANGER = new Set(['blocked', 'open', 'critical', 'retired']);
const INFO = new Set(['queued', 'updated']);

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
