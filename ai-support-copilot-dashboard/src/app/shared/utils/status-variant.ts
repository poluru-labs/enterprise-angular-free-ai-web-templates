export type StatusVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const SUCCESS = new Set(['ready', 'resolved', 'live', 'active', 'on track']);
const WARNING = new Set(['watch', 'review', 'needs policy']);
const DANGER = new Set(['breached', 'critical', 'overdue']);
const INFO = new Set(['new', 'queued', 'night']);

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
