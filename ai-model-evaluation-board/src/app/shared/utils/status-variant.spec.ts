import { statusVariant } from './status-variant';

describe('statusVariant', () => {
  it('maps healthy evaluation states to success', () => {
    expect(statusVariant('Passed')).toBe('success');
    expect(statusVariant('Ready')).toBe('success');
    expect(statusVariant('Enabled')).toBe('success');
    expect(statusVariant('Signed off')).toBe('success');
    expect(statusVariant('Candidate')).toBe('success');
    expect(statusVariant('Baseline')).toBe('success');
    expect(statusVariant('Acknowledged')).toBe('success');
  });

  it('maps review and watch states to warning', () => {
    expect(statusVariant('Review')).toBe('warning');
    expect(statusVariant('In review')).toBe('warning');
    expect(statusVariant('Restricted')).toBe('warning');
    expect(statusVariant('Watch')).toBe('warning');
    expect(statusVariant('Snoozed')).toBe('warning');
    expect(statusVariant('High')).toBe('warning');
    expect(statusVariant('Draft')).toBe('warning');
  });

  it('maps blocked and critical states to danger', () => {
    expect(statusVariant('Blocked')).toBe('danger');
    expect(statusVariant('Open')).toBe('danger');
    expect(statusVariant('Critical')).toBe('danger');
    expect(statusVariant('Retired')).toBe('danger');
  });

  it('maps queued copy to info and unknown labels to neutral', () => {
    expect(statusVariant('Queued')).toBe('info');
    expect(statusVariant('Updated')).toBe('info');
    expect(statusVariant('Pending')).toBe('neutral');
  });
});
