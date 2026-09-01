import { initials } from './initials';

describe('initials', () => {
  it('uses the first letter of each name part', () => {
    expect(initials('Aisha Poluru')).toBe('AP');
    expect(initials('Maya Poluru')).toBe('MP');
  });

  it('ignores extra spaces and caps at two characters', () => {
    expect(initials('  Jordan   Poluru  Lead')).toBe('JP');
  });
});
