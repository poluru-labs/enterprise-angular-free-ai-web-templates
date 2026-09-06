import { templateConfig } from '../../core/config/template.config';
import {
  averageRecall,
  filterIndexes,
  filterNamespaces,
  filterVectors,
  metricsForPeriod,
  namespaceTree,
  paginate,
  selectedNamespaceLabel,
  similarityHits,
  slug,
  warmCount
} from './vector';

describe('filterIndexes / filterNamespaces / filterVectors', () => {
  it('matches index name, owner, or status', () => {
    expect(filterIndexes(templateConfig.indexes, 'docs-prod')[0].id).toBe('docs-prod');
    expect(filterIndexes(templateConfig.indexes, 'Kavya Poluru').every((row) => row.owner === 'Kavya Poluru')).toBe(true);
    expect(filterIndexes(templateConfig.indexes, '', 'Healthy').every((row) => row.status === 'Healthy')).toBe(true);
  });

  it('filters namespaces and vectors', () => {
    expect(filterNamespaces(templateConfig.namespaces, '', 'Frozen')[0].id).toBe('legal-hold');
    expect(filterVectors(templateConfig.vectors, 'vec_1842')[0].id).toBe('vec_1842');
    expect(filterVectors(templateConfig.vectors, '', 'support-faq').every((row) => row.index === 'support-faq')).toBe(true);
  });

  it('returns empty when nothing matches', () => {
    expect(filterIndexes(templateConfig.indexes, 'zzzz-not-an-index')).toEqual([]);
  });

  it('slices a page and treats invalid pages as the first page', () => {
    const values = [1, 2, 3, 4, 5, 6];
    expect(paginate(values, 2, 2)).toEqual([3, 4]);
    expect(paginate(values, 0, 2)).toEqual([1, 2]);
  });
});

describe('similarityHits / namespaceTree', () => {
  it('keeps neighbors above the floor and respects k', () => {
    const hits = similarityHits(templateConfig.vectors, 0.85, 3);
    expect(hits.length).toBeLessThanOrEqual(3);
    expect(hits.every((item) => item.score >= 0.85)).toBe(true);
    expect(hits[0].score).toBeGreaterThanOrEqual(hits[hits.length - 1].score);
  });

  it('groups namespaces under Lattice by index', () => {
    const tree = namespaceTree(templateConfig.namespaces);
    expect(tree[0].id).toBe('workspace');
    expect(tree[0].children?.some((node) => node.label === 'docs-prod')).toBe(true);
    const docs = tree[0].children?.find((node) => node.id === slug('docs-prod'));
    expect(docs?.children?.some((node) => node.id === 'eu-live')).toBe(true);
  });

  it('resolves selected labels', () => {
    expect(selectedNamespaceLabel('workspace', templateConfig.namespaces)).toBe('Lattice');
    expect(selectedNamespaceLabel('docs-prod', templateConfig.namespaces)).toBe('docs-prod');
    expect(selectedNamespaceLabel('eu-live', templateConfig.namespaces)).toBe('eu-live');
  });
});

describe('metricsForPeriod / warmCount / averageRecall', () => {
  it('switches KPI sets by period', () => {
    expect(metricsForPeriod('day', templateConfig.metricsByPeriod, templateConfig.metrics)[0].value).toBe('4.01M');
    expect(metricsForPeriod('week', templateConfig.metricsByPeriod, templateConfig.metrics)[0].value).toBe('4.06M');
    expect(metricsForPeriod('other', templateConfig.metricsByPeriod, templateConfig.metrics)[0].value).toBe('4.06M');
  });

  it('counts warm namespaces and average recall', () => {
    expect(warmCount(templateConfig.namespaces)).toBe(4);
    expect(averageRecall([])).toBe(0);
    expect(averageRecall([0.91, 0.88, 0.81])).toBe(0.87);
  });
});
