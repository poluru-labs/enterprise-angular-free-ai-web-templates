import { templateConfig } from '../../core/config/template.config';
import {
  coverageLabel,
  filterAccounts,
  filterMeetings,
  metricsForPeriod,
  paginate,
  pipelineTotal,
  selectedSignalLabel,
  selectedSignalOwner,
  sequenceProgress,
  signalTree,
  slug,
  watchCount
} from './sales';

describe('filterAccounts / paginate', () => {
  const rows = templateConfig.accounts;

  it('matches name, owner, or stage', () => {
    expect(filterAccounts(rows, 'Northstar').every((row) => row.name.includes('Northstar'))).toBe(true);
    expect(filterAccounts(rows, 'Kavya Poluru').every((row) => row.owner === 'Kavya Poluru')).toBe(true);
    expect(filterAccounts(rows, 'Negotiate').every((row) => row.stage === 'Negotiate')).toBe(true);
  });

  it('applies risk and brief tags', () => {
    expect(filterAccounts(rows, '', ['Watch']).every((row) => row.risk === 'Watch')).toBe(true);
    expect(filterAccounts(rows, '', ['Ready']).every((row) => row.brief === 'Ready')).toBe(true);
  });

  it('returns an empty list when nothing matches', () => {
    expect(filterAccounts(rows, 'zzzz-not-an-account')).toEqual([]);
  });

  it('slices a page and treats invalid pages as the first page', () => {
    const values = [1, 2, 3, 4, 5, 6];
    expect(paginate(values, 2, 2)).toEqual([3, 4]);
    expect(paginate(values, 0, 2)).toEqual([1, 2]);
  });
});

describe('sequenceProgress / pipelineTotal / coverageLabel', () => {
  it('computes cadence progress and pipeline totals', () => {
    expect(sequenceProgress({ done: 4, steps: 6 })).toBe(67);
    expect(sequenceProgress({ done: 0, steps: 0 })).toBe(0);
    expect(pipelineTotal(templateConfig.accounts)).toBeGreaterThan(1_000_000);
  });

  it('labels forecast coverage against the 1.2x bar', () => {
    expect(coverageLabel(templateConfig.forecasts[0])).toBe('Above bar');
    expect(coverageLabel(templateConfig.forecasts[2])).toBe('Below floor');
  });
});

describe('signalTree', () => {
  it('groups accounts under Garnet Close by signal type', () => {
    const tree = signalTree(templateConfig.signals);
    expect(tree[0].id).toBe('workspace');
    expect(tree[0].children?.some((node) => node.label === 'Expansion')).toBe(true);
    const expansion = tree[0].children?.find((node) => node.id === 'expansion');
    expect(expansion?.children?.some((node) => node.id === slug('Brightside Health'))).toBe(true);
  });

  it('resolves selected labels and owners', () => {
    expect(selectedSignalLabel('workspace', templateConfig.signals)).toBe('Garnet Close');
    expect(selectedSignalLabel('expansion', templateConfig.signals)).toBe('Expansion');
    expect(selectedSignalLabel(slug('Brightside Health'), templateConfig.signals)).toBe('Brightside Health');
    expect(selectedSignalOwner('Brightside Health', templateConfig.signals, 'Fallback')).toBe('Rohan Poluru');
    expect(selectedSignalOwner('Unknown', templateConfig.signals, 'Ananya Poluru')).toBe('Ananya Poluru');
  });
});

describe('filterMeetings / metricsForPeriod / watchCount', () => {
  it('filters meeting packs by type', () => {
    expect(filterMeetings(templateConfig.meetings, '', 'QBR').every((item) => item.type === 'QBR')).toBe(true);
    expect(filterMeetings(templateConfig.meetings, 'Helix', 'All')[0].account).toBe('Helix Logistics');
  });

  it('switches KPI sets by period', () => {
    expect(metricsForPeriod('day', templateConfig.metricsByPeriod, templateConfig.metrics)[0].value).toBe('$284K');
    expect(metricsForPeriod('week', templateConfig.metricsByPeriod, templateConfig.metrics)[0].value).toBe('$1.84M');
    expect(metricsForPeriod('other', templateConfig.metricsByPeriod, templateConfig.metrics)[0].value).toBe('$1.84M');
  });

  it('counts watch accounts plus open signals', () => {
    expect(watchCount(templateConfig.accounts, templateConfig.signals)).toBe(9);
  });
});
