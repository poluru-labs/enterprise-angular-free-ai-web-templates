import { templateConfig } from '../../core/config/template.config';
import {
  applyForecastGrowth,
  daysToCap,
  filterUsage,
  paginate,
  parseMoney,
  projectSpend,
  providerTree,
  selectedModelLabel,
  selectedModelOwner
} from './usage';

describe('filterUsage', () => {
  const rows = templateConfig.usage;

  it('matches model, workspace, or owner', () => {
    expect(filterUsage(rows, 'gemini-1.5').every((row) => row.model.includes('gemini'))).toBe(true);
    expect(filterUsage(rows, 'Support').every((row) => row.workspace === 'Support' || row.owner.includes('Venkata') || row.owner.includes('Sravani'))).toBe(true);
    expect(filterUsage(rows, 'Lakshmi Poluru').every((row) => row.owner === 'Lakshmi Poluru')).toBe(true);
  });

  it('applies workspace and status tags', () => {
    const tagged = filterUsage(rows, '', ['Production', 'Healthy']);
    expect(tagged.some((row) => row.workspace === 'Production')).toBe(true);
    expect(tagged.some((row) => row.status === 'Healthy')).toBe(true);
  });

  it('returns an empty list when nothing matches', () => {
    expect(filterUsage(rows, 'zzzz-not-a-model')).toEqual([]);
  });
});

describe('paginate', () => {
  it('slices a page and treats invalid pages as the first page', () => {
    const rows = [1, 2, 3, 4, 5, 6];
    expect(paginate(rows, 2, 2)).toEqual([3, 4]);
    expect(paginate(rows, 0, 2)).toEqual([1, 2]);
  });
});

describe('parseMoney / daysToCap / projectSpend', () => {
  it('parses currency strings', () => {
    expect(parseMoney('$2,940')).toBe(2940);
    expect(parseMoney('$9,200')).toBe(9200);
    expect(parseMoney('n/a')).toBe(0);
  });

  it('projects days remaining against weekly growth', () => {
    expect(daysToCap(100, 12)).toBe(0);
    expect(daysToCap(88, 0)).toBe(99);
    expect(daysToCap(88, 12)).toBeGreaterThan(0);
  });

  it('applies a growth rate to current spend', () => {
    expect(projectSpend(88, 12)).toBe(99);
    expect(applyForecastGrowth(templateConfig.forecasts, 12)[0].projected).toBe(99);
  });
});

describe('providerTree', () => {
  it('groups models under Lilac Meter by provider', () => {
    const tree = providerTree(templateConfig.models);
    expect(tree[0].id).toBe('catalog');
    expect(tree[0].children?.some((node) => node.label === 'OpenAI')).toBe(true);
    const openai = tree[0].children?.find((node) => node.id === 'openai');
    expect(openai?.children?.some((node) => node.id === 'gpt-4.1')).toBe(true);
  });

  it('resolves selected labels and owners', () => {
    expect(selectedModelLabel('catalog', templateConfig.models)).toBe('Lilac Meter');
    expect(selectedModelLabel('gpt-4.1', templateConfig.models)).toBe('gpt-4.1');
    expect(selectedModelLabel('anthropic', templateConfig.models)).toBe('Anthropic');
    expect(selectedModelOwner('gpt-4.1', templateConfig.models, 'Fallback')).toBe('Lakshmi Poluru');
    expect(selectedModelOwner('Unknown', templateConfig.models, 'Lakshmi Poluru')).toBe('Lakshmi Poluru');
  });
});
