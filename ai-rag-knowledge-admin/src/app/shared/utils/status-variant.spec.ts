import { statusVariant } from './status-variant';

describe('statusVariant', () => {
  it('maps healthy vault states to success', () => {
    expect(statusVariant('Complete')).toBe('success');
    expect(statusVariant('Ready')).toBe('success');
    expect(statusVariant('Healthy')).toBe('success');
    expect(statusVariant('Approved')).toBe('success');
    expect(statusVariant('Default')).toBe('success');
  });

  it('maps review and running states to warning', () => {
    expect(statusVariant('Review')).toBe('warning');
    expect(statusVariant('Running')).toBe('warning');
    expect(statusVariant('Syncing')).toBe('warning');
    expect(statusVariant('Blocked')).toBe('warning');
    expect(statusVariant('Held')).toBe('warning');
    expect(statusVariant('Canary')).toBe('warning');
    expect(statusVariant('Drift')).toBe('warning');
  });

  it('maps failed and open states to danger', () => {
    expect(statusVariant('Failed')).toBe('danger');
    expect(statusVariant('Open')).toBe('danger');
    expect(statusVariant('Critical')).toBe('danger');
  });

  it('maps queued copy to info and unknown labels to neutral', () => {
    expect(statusVariant('Queued')).toBe('info');
    expect(statusVariant('Publish')).toBe('info');
    expect(statusVariant('Workspace')).toBe('info');
    expect(statusVariant('Pending')).toBe('neutral');
  });
});
