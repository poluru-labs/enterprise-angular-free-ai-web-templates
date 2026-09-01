import { statusVariant } from './status-variant';

describe('statusVariant', () => {
  it('maps healthy sales states to success', () => {
    expect(statusVariant('Active')).toBe('success');
    expect(statusVariant('Ready')).toBe('success');
    expect(statusVariant('Low')).toBe('success');
    expect(statusVariant('Closed won')).toBe('success');
    expect(statusVariant('Commit')).toBe('success');
  });

  it('maps review and watch states to warning', () => {
    expect(statusVariant('Watch')).toBe('warning');
    expect(statusVariant('Review')).toBe('warning');
    expect(statusVariant('Draft')).toBe('warning');
    expect(statusVariant('Upside')).toBe('warning');
  });

  it('maps stalled and high-risk states to danger', () => {
    expect(statusVariant('High')).toBe('danger');
    expect(statusVariant('Stalled')).toBe('danger');
    expect(statusVariant('At risk')).toBe('danger');
  });

  it('maps new copy to info and unknown labels to neutral', () => {
    expect(statusVariant('New')).toBe('info');
    expect(statusVariant('Expansion')).toBe('info');
    expect(statusVariant('Research')).toBe('info');
    expect(statusVariant('Pending')).toBe('neutral');
  });
});
