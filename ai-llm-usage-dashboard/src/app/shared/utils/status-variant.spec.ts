import { spendStatus, statusVariant } from './status-variant';

describe('statusVariant', () => {
  it('maps healthy operational states to success', () => {
    expect(statusVariant('Healthy')).toBe('success');
    expect(statusVariant('Active')).toBe('success');
    expect(statusVariant('Ready')).toBe('success');
    expect(statusVariant('On track')).toBe('success');
    expect(statusVariant('Acknowledged')).toBe('success');
  });

  it('maps watch and restricted states to warning', () => {
    expect(statusVariant('Watch')).toBe('warning');
    expect(statusVariant('Restricted')).toBe('warning');
    expect(statusVariant('Snoozed')).toBe('warning');
    expect(statusVariant('High')).toBe('warning');
  });

  it('maps open and critical states to danger', () => {
    expect(statusVariant('Open')).toBe('danger');
    expect(statusVariant('Critical')).toBe('danger');
    expect(statusVariant('Over cap')).toBe('danger');
  });

  it('maps review copy to info and unknown labels to neutral', () => {
    expect(statusVariant('Updated')).toBe('info');
    expect(statusVariant('Review')).toBe('info');
    expect(statusVariant('Queued')).toBe('info');
    expect(statusVariant('Draft')).toBe('neutral');
  });
});

describe('spendStatus', () => {
  it('labels workspace spend against the 80% watch line', () => {
    expect(spendStatus(48)).toBe('On track');
    expect(spendStatus(80)).toBe('Watch');
    expect(spendStatus(104)).toBe('Over cap');
  });
});
