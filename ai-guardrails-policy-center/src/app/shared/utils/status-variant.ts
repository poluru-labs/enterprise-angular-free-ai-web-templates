export type StatusVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const SUCCESS = new Set([
  'active',
  'live',
  'reviewed',
  'redacted',
  'allow',
  'allowed',
  'healthy',
  'ready'
]);
const WARNING = new Set([
  'draft',
  'paused',
  'tuning',
  'canary',
  'flag',
  'flagged',
  'open',
  'pending'
]);
const DANGER = new Set(['down', 'blocked', 'failed', 'critical', 'block']);
const INFO = new Set(['false-positive', 'log', 'queued', 'mask', 'hash']);

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
