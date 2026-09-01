import { templateConfig } from '../../core/config/template.config';
import { filterDatasets, filterSuites, meetsBaseline, paginate, parseScore, rankModels, scoreDelta } from './eval';

describe('parseScore', () => {
  it('reads a percent string', () => {
    expect(parseScore('96.2%')).toBe(96.2);
    expect(parseScore(' 88.4 ')).toBe(88.4);
    expect(parseScore('n/a')).toBe(0);
  });
});

describe('scoreDelta and meetsBaseline', () => {
  it('compares a suite against its baseline', () => {
    expect(scoreDelta('96.2%', '94.0%')).toBe(2.2);
    expect(scoreDelta('88.4%', '91.0%')).toBe(-2.6);
    expect(meetsBaseline('96.2%', '94.0%')).toBe(true);
    expect(meetsBaseline('79.5%', '84.0%')).toBe(false);
  });
});

describe('filterSuites', () => {
  it('filters by query and status', () => {
    const safety = filterSuites(templateConfig.suites, 'safety', 'All');
    expect(safety.every((row) => row.name.toLowerCase().includes('safety'))).toBe(true);

    const blocked = filterSuites(templateConfig.suites, '', 'Blocked');
    expect(blocked.every((row) => row.status === 'Blocked')).toBe(true);
    expect(blocked.some((row) => row.name === 'Multilingual QA')).toBe(true);
  });
});

describe('filterDatasets', () => {
  it('keeps restricted gold sets when asked', () => {
    const restricted = filterDatasets(templateConfig.datasets, '', 'Restricted');
    expect(restricted).toHaveLength(1);
    expect(restricted[0].title).toBe('Red Team Set');
  });
});

describe('rankModels', () => {
  it('orders checkpoints by best score', () => {
    const ranked = rankModels(templateConfig.models);
    expect(ranked[0].name).toBe('horizon-2');
    expect(parseScore(ranked[0].bestScore)).toBeGreaterThan(parseScore(ranked[1].bestScore));
  });
});

describe('paginate', () => {
  it('slices a page of rows', () => {
    expect(paginate([1, 2, 3, 4, 5], 2, 2)).toEqual([3, 4]);
    expect(paginate([1, 2, 3], 0, 2)).toEqual([1, 2]);
  });
});
