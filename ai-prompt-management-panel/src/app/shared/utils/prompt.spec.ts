import { templateConfig } from '../../core/config/template.config';
import {
  canPublish,
  filterExperiments,
  filterPrompts,
  filterVersions,
  paginate,
  parseRate,
  rankPrompts
} from './prompt';

describe('parseRate', () => {
  it('reads a percent string', () => {
    expect(parseRate('91.8%')).toBe(91.8);
    expect(parseRate(' 88.1 ')).toBe(88.1);
    expect(parseRate('n/a')).toBe(0);
  });
});

describe('canPublish', () => {
  it('compares success against a floor', () => {
    expect(canPublish('91.8%', 88)).toBe(true);
    expect(canPublish('79.3%', 88)).toBe(false);
  });
});

describe('filterPrompts', () => {
  it('filters by query and status', () => {
    const support = filterPrompts(templateConfig.prompts, 'support', 'All');
    expect(support.every((row) => row.name.toLowerCase().includes('support'))).toBe(true);

    const review = filterPrompts(templateConfig.prompts, '', 'Review');
    expect(review.every((row) => row.status === 'Review')).toBe(true);
    expect(review.some((row) => row.name === 'Policy summarizer')).toBe(true);
  });
});

describe('filterExperiments', () => {
  it('keeps paused splits when asked', () => {
    const paused = filterExperiments(templateConfig.experiments, '', 'Paused');
    expect(paused.every((row) => row.status === 'Paused')).toBe(true);
    expect(paused.some((row) => row.id === 'EX-38')).toBe(true);
  });
});

describe('filterVersions', () => {
  it('keeps retired revisions when asked', () => {
    const retired = filterVersions(templateConfig.versions, '', 'Retired');
    expect(retired).toHaveLength(1);
    expect(retired[0].id).toBe('VR-284');
  });
});

describe('rankPrompts', () => {
  it('orders prompts by success rate', () => {
    const ranked = rankPrompts(templateConfig.prompts);
    expect(ranked[0].name).toBe('Contract clause finder');
    expect(parseRate(ranked[0].success)).toBeGreaterThan(parseRate(ranked[1].success));
  });
});

describe('paginate', () => {
  it('slices a page of rows', () => {
    expect(paginate([1, 2, 3, 4, 5], 2, 2)).toEqual([3, 4]);
    expect(paginate([1, 2, 3], 0, 2)).toEqual([1, 2]);
  });
});
