export type StatusVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const SUCCESS = new Set(['active', 'ready', 'low', 'closed won', 'commit']);
const WARNING = new Set(['watch', 'review', 'draft', 'upside']);
const DANGER = new Set(['high', 'stalled', 'at risk']);
const INFO = new Set(['new', 'expansion', 'research']);

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
