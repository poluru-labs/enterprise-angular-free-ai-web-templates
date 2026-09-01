export function statusIcon(tone: string): string {
  if (tone === 'ok') {
    return 'check_circle';
  }
  if (tone === 'warn') {
    return 'error';
  }
  if (tone === 'rose') {
    return 'priority_high';
  }
  return 'info';
}

export function agingLabel(tone: string): string {
  if (tone === 'ok') {
    return 'Fresh';
  }
  if (tone === 'rose') {
    return 'Breach risk';
  }
  if (tone === 'warn') {
    return 'Watch';
  }
  return 'On track';
}
