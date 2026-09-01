import { statusVariant } from './status-variant';

describe('statusVariant', () => {
  it('maps healthy support states to success', () => {
    expect(statusVariant('Ready')).toBe('success');
    expect(statusVariant('Resolved')).toBe('success');
    expect(statusVariant('Live')).toBe('success');
    expect(statusVariant('Active')).toBe('success');
    expect(statusVariant('On track')).toBe('success');
  });

  it('maps review and watch states to warning', () => {
    expect(statusVariant('Watch')).toBe('warning');
    expect(statusVariant('Review')).toBe('warning');
    expect(statusVariant('Needs policy')).toBe('warning');
  });

  it('maps breached states to danger', () => {
    expect(statusVariant('Breached')).toBe('danger');
    expect(statusVariant('Critical')).toBe('danger');
    expect(statusVariant('Overdue')).toBe('danger');
  });

  it('maps queued copy to info and unknown labels to neutral', () => {
    expect(statusVariant('New')).toBe('info');
    expect(statusVariant('Queued')).toBe('info');
    expect(statusVariant('Night')).toBe('info');
    expect(statusVariant('Pending')).toBe('neutral');
  });
});
