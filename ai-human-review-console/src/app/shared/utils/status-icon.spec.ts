import { agingLabel, statusIcon } from './status-icon';

describe('statusIcon', () => {
  it('maps tones to Material Symbols names', () => {
    expect(statusIcon('ok')).toBe('check_circle');
    expect(statusIcon('warn')).toBe('error');
    expect(statusIcon('rose')).toBe('priority_high');
    expect(statusIcon('info')).toBe('info');
  });
});

describe('agingLabel', () => {
  it('maps aging tones to operator copy', () => {
    expect(agingLabel('ok')).toBe('Fresh');
    expect(agingLabel('rose')).toBe('Breach risk');
    expect(agingLabel('warn')).toBe('Watch');
    expect(agingLabel('info')).toBe('On track');
  });
});
