import type { ForecastRow, ModelRow, UsageRow } from '../../core/config/template.config';

export type ProviderNode = {
  id: string;
  label: string;
  children?: ProviderNode[];
};

export function filterUsage(rows: UsageRow[], query: string, tags: string[] = []): UsageRow[] {
  const q = query.trim().toLowerCase();
  return rows.filter((item) => {
    const hay = `${item.model} ${item.workspace} ${item.owner} ${item.status}`.toLowerCase();
    const matchesQuery = !q || hay.includes(q);
    const matchesTags =
      tags.length === 0 ||
      tags.some((tag) => item.workspace === tag || item.status === tag || item.model === tag);
    return matchesQuery && matchesTags;
  });
}

export function paginate<T>(rows: T[], page: number, pageSize: number): T[] {
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * pageSize;
  return rows.slice(start, start + pageSize);
}

export function parseMoney(value: string): number {
  const n = Number(value.replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

export function daysToCap(spendPct: number, weeklyGrowthPct: number): number {
  if (spendPct >= 100) {
    return 0;
  }
  if (weeklyGrowthPct <= 0) {
    return 99;
  }
  const remaining = 100 - spendPct;
  const daily = weeklyGrowthPct / 7;
  return Math.max(1, Math.ceil(remaining / daily));
}

export function projectSpend(current: number, growthPct: number): number {
  return Math.round(current * (1 + growthPct / 100));
}

export function applyForecastGrowth(rows: ForecastRow[], growthPct: number): ForecastRow[] {
  return rows.map((row) => {
    const projected = projectSpend(row.current, growthPct);
    return {
      ...row,
      projected,
      daysToCap: daysToCap(row.current, growthPct)
    };
  });
}

export function providerTree(models: ModelRow[]): ProviderNode[] {
  const grouped = new Map<string, ModelRow[]>();
  for (const model of models) {
    const list = grouped.get(model.provider) ?? [];
    list.push(model);
    grouped.set(model.provider, list);
  }

  const children: ProviderNode[] = [...grouped.entries()].map(([provider, items]) => ({
    id: provider.toLowerCase(),
    label: provider,
    children: items.map((item) => ({ id: item.title, label: item.title }))
  }));

  return [{ id: 'catalog', label: 'Lilac Meter', children }];
}

export function selectedModelLabel(id: string, models: ModelRow[]): string {
  if (id === 'catalog') {
    return 'Lilac Meter';
  }
  const model = models.find((item) => item.title === id);
  if (model) {
    return model.title;
  }
  const provider = models.find((item) => item.provider.toLowerCase() === id);
  return provider?.provider ?? 'OpenAI';
}

export function selectedModelOwner(label: string, models: ModelRow[], fallback: string): string {
  const found = models.find((item) => item.title === label || item.provider === label);
  return found?.owner ?? fallback;
}
