import { statusVariant } from './status-variant';

describe('statusVariant', () => {
  it('maps healthy index states to success', () => {
    expect(statusVariant('Healthy')).toBe('success');
    expect(statusVariant('Indexed')).toBe('success');
    expect(statusVariant('Warm')).toBe('success');
    expect(statusVariant('Match')).toBe('success');
    expect(statusVariant('Stable')).toBe('success');
    expect(statusVariant('Ready')).toBe('success');
  });

  it('maps rebuild and drift states to warning', () => {
    expect(statusVariant('Rebuilding')).toBe('warning');
    expect(statusVariant('Stale')).toBe('warning');
    expect(statusVariant('Watch')).toBe('warning');
    expect(statusVariant('Cooling')).toBe('warning');
    expect(statusVariant('Pending')).toBe('warning');
    expect(statusVariant('Drift')).toBe('warning');
  });

  it('maps failed states to danger', () => {
    expect(statusVariant('Down')).toBe('danger');
    expect(statusVariant('Failed')).toBe('danger');
    expect(statusVariant('Frozen')).toBe('danger');
  });

  it('maps querying copy to info and unknown labels to neutral', () => {
    expect(statusVariant('Querying')).toBe('info');
    expect(statusVariant('Queued')).toBe('info');
    expect(statusVariant('Pending review')).toBe('neutral');
  });
});
