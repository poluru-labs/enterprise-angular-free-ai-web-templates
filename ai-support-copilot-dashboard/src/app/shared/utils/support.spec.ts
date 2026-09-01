import { templateConfig } from '../../core/config/template.config';
import {
  averageLoad,
  filterAgents,
  filterArticles,
  filterConversations,
  filterReports,
  metricsForPeriod,
  paginate,
  reviewCount,
  selectedSuggestionLabel,
  selectedSuggestionOwner,
  slug,
  suggestionTree
} from './support';

describe('filterConversations / paginate', () => {
  const rows = templateConfig.conversations;

  it('matches topic, owner, or ticket id', () => {
    expect(filterConversations(rows, 'Refund').every((row) => row.topic.includes('Refund'))).toBe(true);
    expect(filterConversations(rows, 'Kavya Poluru').every((row) => row.owner === 'Kavya Poluru')).toBe(true);
    expect(filterConversations(rows, '#48291')[0].id).toBe('#48291');
  });

  it('applies channel and status tags', () => {
    expect(filterConversations(rows, '', ['Chat']).every((row) => row.channel === 'Chat')).toBe(true);
    expect(filterConversations(rows, '', ['Review']).every((row) => row.status === 'Review')).toBe(true);
  });

  it('returns an empty list when nothing matches', () => {
    expect(filterConversations(rows, 'zzzz-not-a-ticket')).toEqual([]);
  });

  it('slices a page and treats invalid pages as the first page', () => {
    const values = [1, 2, 3, 4, 5, 6];
    expect(paginate(values, 2, 2)).toEqual([3, 4]);
    expect(paginate(values, 0, 2)).toEqual([1, 2]);
  });
});

describe('filterArticles / filterAgents / filterReports', () => {
  it('filters articles by topic', () => {
    expect(filterArticles(templateConfig.articles, '', 'Billing').every((item) => item.topic === 'Billing')).toBe(true);
    expect(filterArticles(templateConfig.articles, 'Magic', 'All')[0].title).toBe('Magic link reset');
  });

  it('filters agents by shift and reports by status', () => {
    expect(filterAgents(templateConfig.agents, 'Night').every((item) => item.shift === 'Night')).toBe(true);
    expect(filterAgents(templateConfig.agents, 'All')).toHaveLength(templateConfig.agents.length);
    expect(filterReports(templateConfig.reports, 'Watch').every((item) => item.status === 'Watch')).toBe(true);
  });
});

describe('suggestionTree', () => {
  it('groups drafts under Harbor Desk by type', () => {
    const tree = suggestionTree(templateConfig.suggestions);
    expect(tree[0].id).toBe('workspace');
    expect(tree[0].children?.some((node) => node.label === 'Billing')).toBe(true);
    const billing = tree[0].children?.find((node) => node.id === 'billing');
    expect(billing?.children?.some((node) => node.id === slug('Refund window reply'))).toBe(true);
  });

  it('resolves selected labels and owners', () => {
    expect(selectedSuggestionLabel('workspace', templateConfig.suggestions)).toBe('Harbor Desk');
    expect(selectedSuggestionLabel('billing', templateConfig.suggestions)).toBe('Billing');
    expect(selectedSuggestionLabel(slug('Refund window reply'), templateConfig.suggestions)).toBe('Refund window reply');
    expect(selectedSuggestionOwner('Billing', templateConfig.suggestions, 'Fallback')).toBe('Hana Poluru');
    expect(selectedSuggestionOwner('Unknown', templateConfig.suggestions, 'Ananya Poluru')).toBe('Ananya Poluru');
  });
});

describe('metricsForPeriod / reviewCount / averageLoad', () => {
  it('switches KPI sets by period', () => {
    expect(metricsForPeriod('day', templateConfig.metricsByPeriod, templateConfig.metrics)[0].value).toBe('412');
    expect(metricsForPeriod('week', templateConfig.metricsByPeriod, templateConfig.metrics)[0].value).toBe('1,842');
    expect(metricsForPeriod('other', templateConfig.metricsByPeriod, templateConfig.metrics)[0].value).toBe('1,842');
  });

  it('counts review conversations and average agent load', () => {
    expect(reviewCount(templateConfig.conversations)).toBe(6);
    expect(averageLoad([])).toBe(0);
    expect(averageLoad(templateConfig.agents)).toBeGreaterThan(50);
  });
});
