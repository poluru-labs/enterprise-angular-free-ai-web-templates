import { initials } from './initials';

describe('initials', () => {
  it('uses the first letter of each name part', () => {
    expect(initials('Lakshmi Poluru')).toBe('LP');
    expect(initials('Priya Poluru')).toBe('PP');
  });

  it('ignores extra spaces and caps at two characters', () => {
    expect(initials('  Venkata   Poluru  Lead')).toBe('VP');
  });
});
