import type {
  AgentRow,
  ArticleRow,
  ConversationRow,
  Metric,
  ReportRow,
  SuggestionRow
} from '../../core/config/template.config';

export type SuggestionNode = {
  id: string;
  label: string;
  children?: SuggestionNode[];
};

export function slug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function paginate<T>(rows: T[], page: number, pageSize: number): T[] {
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * pageSize;
  return rows.slice(start, start + pageSize);
}

export function filterConversations(rows: ConversationRow[], query: string, tags: string[] = []): ConversationRow[] {
  const q = query.trim().toLowerCase();
  return rows.filter((item) => {
    const hay = `${item.id} ${item.topic} ${item.owner} ${item.channel} ${item.status} ${item.copilot}`.toLowerCase();
    const matchesQuery = !q || hay.includes(q);
    const matchesTags =
      tags.length === 0 || tags.some((tag) => item.status === tag || item.channel === tag || item.owner === tag);
    return matchesQuery && matchesTags;
  });
}

export function filterArticles(rows: ArticleRow[], query: string, topic = 'All'): ArticleRow[] {
  const q = query.trim().toLowerCase();
  return rows.filter((item) => {
    const hay = `${item.title} ${item.owner} ${item.topic} ${item.status}`.toLowerCase();
    const matchesQuery = !q || hay.includes(q);
    const matchesTopic = topic === 'All' || item.topic === topic;
    return matchesQuery && matchesTopic;
  });
}

export function filterAgents(rows: AgentRow[], shift = 'All'): AgentRow[] {
  if (shift === 'All') {
    return rows;
  }
  return rows.filter((item) => item.shift === shift);
}

export function filterReports(rows: ReportRow[], status = 'All'): ReportRow[] {
  if (status === 'All') {
    return rows;
  }
  return rows.filter((item) => item.status === status);
}

export function metricsForPeriod(
  period: string,
  byPeriod: Record<'day' | 'week' | 'month', Metric[]>,
  fallback: Metric[]
): Metric[] {
  if (period === 'day' || period === 'week' || period === 'month') {
    return byPeriod[period];
  }
  return fallback;
}

export function suggestionTree(suggestions: SuggestionRow[]): SuggestionNode[] {
  const types = [...new Set(suggestions.map((item) => item.type))];
  const children: SuggestionNode[] = types.map((type) => ({
    id: slug(type),
    label: type,
    children: suggestions
      .filter((item) => item.type === type)
      .map((item) => ({ id: slug(item.title), label: item.title }))
  }));
  return [{ id: 'workspace', label: 'Harbor Desk', children }];
}

export function selectedSuggestionLabel(id: string, suggestions: SuggestionRow[]): string {
  if (id === 'workspace') {
    return 'Harbor Desk';
  }
  const typeMatch = suggestions.find((item) => slug(item.type) === id);
  if (typeMatch) {
    return typeMatch.type;
  }
  const title = suggestions.find((item) => slug(item.title) === id);
  return title?.title ?? 'Billing';
}

export function selectedSuggestionOwner(label: string, suggestions: SuggestionRow[], fallback: string): string {
  const found = suggestions.find((item) => item.type === label || item.title === label);
  return found?.owner ?? fallback;
}

export function reviewCount(conversations: ConversationRow[]): number {
  return conversations.filter((item) => item.status === 'Review' || item.status === 'Watch').length;
}

export function averageLoad(agents: AgentRow[]): number {
  if (agents.length === 0) {
    return 0;
  }
  return Math.round(agents.reduce((sum, item) => sum + item.load, 0) / agents.length);
}
