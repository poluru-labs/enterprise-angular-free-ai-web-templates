import { statusVariant } from './status-variant';

describe('statusVariant', () => {
  it('maps live policy states to success', () => {
    expect(statusVariant('Active')).toBe('success');
    expect(statusVariant('Live')).toBe('success');
    expect(statusVariant('Reviewed')).toBe('success');
    expect(statusVariant('Redacted')).toBe('success');
    expect(statusVariant('Allow')).toBe('success');
  });

  it('maps draft and flagged states to warning', () => {
    expect(statusVariant('Draft')).toBe('warning');
    expect(statusVariant('Paused')).toBe('warning');
    expect(statusVariant('Tuning')).toBe('warning');
    expect(statusVariant('Canary')).toBe('warning');
    expect(statusVariant('Flagged')).toBe('warning');
    expect(statusVariant('Open')).toBe('warning');
  });

  it('maps blocked states to danger', () => {
    expect(statusVariant('Down')).toBe('danger');
    expect(statusVariant('Blocked')).toBe('danger');
    expect(statusVariant('Failed')).toBe('danger');
    expect(statusVariant('Block')).toBe('danger');
  });

  it('maps false-positive copy to info and unknown labels to neutral', () => {
    expect(statusVariant('False-positive')).toBe('info');
    expect(statusVariant('Log')).toBe('info');
    expect(statusVariant('Pending review')).toBe('neutral');
  });
});
