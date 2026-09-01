import { statusVariant } from './status-variant';

describe('statusVariant', () => {
  it('maps healthy prompt states to success', () => {
    expect(statusVariant('Live')).toBe('success');
    expect(statusVariant('Enabled')).toBe('success');
    expect(statusVariant('Winner')).toBe('success');
    expect(statusVariant('Promoted')).toBe('success');
    expect(statusVariant('Candidate')).toBe('success');
  });

  it('maps review and draft states to warning', () => {
    expect(statusVariant('Review')).toBe('warning');
    expect(statusVariant('Draft')).toBe('warning');
    expect(statusVariant('Paused')).toBe('warning');
    expect(statusVariant('Running')).toBe('warning');
  });

  it('maps archived and retired states to danger', () => {
    expect(statusVariant('Archived')).toBe('danger');
    expect(statusVariant('Retired')).toBe('danger');
    expect(statusVariant('Blocked')).toBe('danger');
  });

  it('maps queued copy to info and unknown labels to neutral', () => {
    expect(statusVariant('Queued')).toBe('info');
    expect(statusVariant('Updated')).toBe('info');
    expect(statusVariant('Forked')).toBe('info');
    expect(statusVariant('Pending')).toBe('neutral');
  });
});
