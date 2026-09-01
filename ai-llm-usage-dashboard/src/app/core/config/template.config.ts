export type NavItem = {
  path: string;
  label: string;
  icon: string;
  exact?: boolean;
};

export type TrendDir = 'up' | 'down';

export type Metric = {
  label: string;
  value: string;
  trend: string;
  trendDir: TrendDir;
  hint: string;
};

export type UsageRow = {
  model: string;
  workspace: string;
  owner: string;
  tokens: string;
  cost: string;
  latency: string;
  status: string;
};

export type ModelRow = {
  title: string;
  detail: string;
  owner: string;
  status: string;
  provider: string;
  access: string;
};

export type WorkspaceCap = {
  name: string;
  owner: string;
  spend: number;
  cap: string;
};

export type OpsAlert = {
  id: string;
  kind: 'Budget' | 'Latency' | 'Keys' | 'Anomaly';
  severity: 'Critical' | 'High' | 'Watch';
  title: string;
  detail: string;
  owner: string;
  status: 'Open' | 'Acknowledged' | 'Snoozed';
  time: string;
};

export type ForecastRow = {
  workspace: string;
  owner: string;
  current: number;
  projected: number;
  cap: string;
  daysToCap: number;
  trend: string;
};

export const templateConfig = {
  title: 'LLM usage',
  eyebrow: 'Platform analytics',
  summary: 'Track token consumption, spend, and latency so every workspace stays inside budget.',
  action: 'Export report',
  brand: { mark: 'L', name: 'Poluru Cloud', accent: 'Lilac Meter' },
  workspace: 'FY26 Q3 · Platform',
  user: { initials: 'LP', name: 'Lakshmi Poluru', role: 'Platform lead' },
  nav: [
    { path: '/', label: 'Overview', icon: 'dashboard', exact: true },
    { path: '/usage', label: 'Usage', icon: 'data_usage' },
    { path: '/models', label: 'Models', icon: 'neurology' },
    { path: '/budgets', label: 'Budgets', icon: 'payments' },
    { path: '/alerts', label: 'Alerts', icon: 'notifications_active' },
    { path: '/forecasts', label: 'Forecasts', icon: 'trending_up' },
    { path: '/settings', label: 'Settings', icon: 'tune' }
  ] as NavItem[],
  metrics: [
    { label: 'Total tokens', value: '84.2M', trend: '+12.4%', trendDir: 'up' as const, hint: 'this week' },
    { label: 'Current spend', value: '$6,842', trend: '+8.1%', trendDir: 'up' as const, hint: 'of $9,200' },
    { label: 'Active models', value: '12', trend: '+2', trendDir: 'up' as const, hint: 'endpoints' },
    { label: 'Avg. latency', value: '1.24s', trend: '-6.8%', trendDir: 'down' as const, hint: 'p95' }
  ] as Metric[],
  metricsByPeriod: {
    day: [
      { label: 'Total tokens', value: '12.6M', trend: '+4.1%', trendDir: 'up' as const, hint: 'today' },
      { label: 'Current spend', value: '$980', trend: '+2.4%', trendDir: 'up' as const, hint: 'of $9,200' },
      { label: 'Active models', value: '9', trend: '0', trendDir: 'up' as const, hint: 'endpoints' },
      { label: 'Avg. latency', value: '1.18s', trend: '-3.2%', trendDir: 'down' as const, hint: 'p95' }
    ],
    week: [
      { label: 'Total tokens', value: '84.2M', trend: '+12.4%', trendDir: 'up' as const, hint: 'this week' },
      { label: 'Current spend', value: '$6,842', trend: '+8.1%', trendDir: 'up' as const, hint: 'of $9,200' },
      { label: 'Active models', value: '12', trend: '+2', trendDir: 'up' as const, hint: 'endpoints' },
      { label: 'Avg. latency', value: '1.24s', trend: '-6.8%', trendDir: 'down' as const, hint: 'p95' }
    ],
    month: [
      { label: 'Total tokens', value: '312.8M', trend: '+9.6%', trendDir: 'up' as const, hint: 'this month' },
      { label: 'Current spend', value: '$24,180', trend: '+6.3%', trendDir: 'up' as const, hint: 'of $36,800' },
      { label: 'Active models', value: '14', trend: '+3', trendDir: 'up' as const, hint: 'endpoints' },
      { label: 'Avg. latency', value: '1.31s', trend: '-1.4%', trendDir: 'down' as const, hint: 'p95' }
    ]
  } as Record<'day' | 'week' | 'month', Metric[]>,
  alerts: [
    {
      heading: 'Production is at 88% of budget',
      content: 'Lakshmi Poluru set an 80% alert. gpt-4.1 in Production will hit the cap in about 4 days at the current rate.'
    },
    {
      heading: 'Support p95 drifted above 1.4s',
      content: 'Venkata Poluru is checking Gemini 1.5 routing. Fallback to claude-3.5 is already allowed.'
    },
    {
      heading: 'Sandbox keys rotate tonight',
      content: 'Hana Poluru scheduled a 02:30 CT rotation. Strict cost gate stays off for sandbox.'
    },
    {
      heading: 'Knowledge embeddings spiked 3.2×',
      content: 'Ramesh Poluru’s overnight reindex on embed-3-large added 9.1M tokens. Forecast now includes the spike.'
    }
  ],
  activity: [
    { title: 'GPT-4.1 API budget updated', detail: 'Production · Lakshmi Poluru', status: 'Updated', time: '12 min ago' },
    { title: 'New model endpoint connected', detail: 'Open-source inference · Meera Poluru', status: 'Active', time: '38 min ago' },
    { title: 'Weekly cost digest generated', detail: 'Finance · Priya Poluru', status: 'Ready', time: '1 hr ago' },
    { title: 'Support overage check', detail: 'Gemini 1.5 · Venkata Poluru', status: 'Watch', time: '2 hr ago' },
    { title: 'Sandbox budget reset', detail: 'mistral-large · Hana Poluru', status: 'Ready', time: 'Yesterday' },
    { title: 'GTM mini model promoted', detail: 'gpt-4.1-mini · Nikhil Poluru', status: 'Active', time: 'Yesterday' },
    { title: 'Knowledge reindex complete', detail: 'embed-3-large · Ramesh Poluru', status: 'Ready', time: '2 days ago' }
  ],
  usage: [
    { model: 'gpt-4.1', workspace: 'Production', owner: 'Lakshmi Poluru', tokens: '32.6M', cost: '$2,940', latency: '1.02s', status: 'Healthy' },
    { model: 'claude-3.5', workspace: 'Research', owner: 'Priya Poluru', tokens: '18.4M', cost: '$1,280', latency: '0.88s', status: 'Healthy' },
    { model: 'gemini-1.5', workspace: 'Support', owner: 'Venkata Poluru', tokens: '14.1M', cost: '$960', latency: '1.41s', status: 'Watch' },
    { model: 'llama-3-70b', workspace: 'Internal tools', owner: 'Meera Poluru', tokens: '11.8M', cost: '$540', latency: '1.65s', status: 'Restricted' },
    { model: 'mistral-large', workspace: 'Sandbox', owner: 'Hana Poluru', tokens: '7.3M', cost: '$122', latency: '1.12s', status: 'Healthy' },
    { model: 'gpt-4.1-mini', workspace: 'GTM', owner: 'Nikhil Poluru', tokens: '4.9M', cost: '$186', latency: '0.74s', status: 'Healthy' },
    { model: 'claude-haiku', workspace: 'Support', owner: 'Sravani Poluru', tokens: '3.2M', cost: '$94', latency: '0.61s', status: 'Healthy' },
    { model: 'embed-3-large', workspace: 'Knowledge', owner: 'Ramesh Poluru', tokens: '9.1M', cost: '$210', latency: '0.22s', status: 'Healthy' },
    { model: 'gpt-4.1', workspace: 'Research', owner: 'Priya Poluru', tokens: '2.4M', cost: '$218', latency: '0.97s', status: 'Healthy' },
    { model: 'claude-3.5', workspace: 'Production', owner: 'Lakshmi Poluru', tokens: '1.8M', cost: '$164', latency: '0.91s', status: 'Healthy' },
    { model: 'gemini-1.5-flash', workspace: 'Support', owner: 'Venkata Poluru', tokens: '6.7M', cost: '$142', latency: '0.54s', status: 'Watch' },
    { model: 'llama-3-8b', workspace: 'Sandbox', owner: 'Hana Poluru', tokens: '5.1M', cost: '$38', latency: '0.48s', status: 'Healthy' }
  ] as UsageRow[],
  models: [
    {
      title: 'gpt-4.1',
      detail: 'Primary production model for customer-facing agents and support flows.',
      owner: 'Lakshmi Poluru',
      status: 'Active',
      provider: 'OpenAI',
      access: 'Open'
    },
    {
      title: 'gpt-4.1-mini',
      detail: 'Low-latency GTM copilot for outbound drafts and account briefs.',
      owner: 'Nikhil Poluru',
      status: 'Active',
      provider: 'OpenAI',
      access: 'Open'
    },
    {
      title: 'embed-3-large',
      detail: 'Embeddings for knowledge retrieval and overnight reindex jobs.',
      owner: 'Ramesh Poluru',
      status: 'Active',
      provider: 'OpenAI',
      access: 'Open'
    },
    {
      title: 'claude-3.5',
      detail: 'Research and long-context summarization workloads.',
      owner: 'Priya Poluru',
      status: 'Active',
      provider: 'Anthropic',
      access: 'Open'
    },
    {
      title: 'claude-haiku',
      detail: 'Fast support classifier and short-form replies.',
      owner: 'Sravani Poluru',
      status: 'Active',
      provider: 'Anthropic',
      access: 'Open'
    },
    {
      title: 'gemini-1.5',
      detail: 'Support copilot with tool use and file grounding.',
      owner: 'Venkata Poluru',
      status: 'Watch',
      provider: 'Google',
      access: 'Open'
    },
    {
      title: 'gemini-1.5-flash',
      detail: 'Burst routing while Gemini 1.5 p95 is on watch.',
      owner: 'Venkata Poluru',
      status: 'Watch',
      provider: 'Google',
      access: 'Open'
    },
    {
      title: 'llama-3-70b',
      detail: 'Self-hosted fallback for internal tooling.',
      owner: 'Meera Poluru',
      status: 'Restricted',
      provider: 'Meta',
      access: 'Restricted'
    },
    {
      title: 'llama-3-8b',
      detail: 'Sandbox evals and prompt experiments before promotion.',
      owner: 'Hana Poluru',
      status: 'Active',
      provider: 'Meta',
      access: 'Open'
    },
    {
      title: 'mistral-large',
      detail: 'Sandbox experiments and prompt evals.',
      owner: 'Hana Poluru',
      status: 'Active',
      provider: 'Mistral',
      access: 'Open'
    }
  ] as ModelRow[],
  budgets: [
    { day: 'Mon', item: 'Production budget review · Lakshmi Poluru', spend: 88 },
    { day: 'Tue', item: 'Research workspace forecast · Priya Poluru', spend: 61 },
    { day: 'Wed', item: 'Support overage check · Venkata Poluru', spend: 74 },
    { day: 'Thu', item: 'Finance monthly digest · Arjun Poluru', spend: 42 },
    { day: 'Fri', item: 'Sandbox budget reset · Hana Poluru', spend: 18 },
    { day: 'Sat', item: 'Knowledge reindex window · Ramesh Poluru', spend: 39 },
    { day: 'Sun', item: 'GTM weekend catch-up · Nikhil Poluru', spend: 22 }
  ],
  workspaces: [
    { name: 'Production', owner: 'Lakshmi Poluru', spend: 88, cap: '$3,400' },
    { name: 'Research', owner: 'Priya Poluru', spend: 61, cap: '$2,100' },
    { name: 'Support', owner: 'Venkata Poluru', spend: 74, cap: '$1,400' },
    { name: 'Internal tools', owner: 'Meera Poluru', spend: 48, cap: '$900' },
    { name: 'Sandbox', owner: 'Hana Poluru', spend: 18, cap: '$400' },
    { name: 'Knowledge', owner: 'Ramesh Poluru', spend: 39, cap: '$700' },
    { name: 'GTM', owner: 'Nikhil Poluru', spend: 22, cap: '$500' }
  ] as WorkspaceCap[],
  hourly: [
    { hour: '8a', value: 24 },
    { hour: '9a', value: 38 },
    { hour: '10', value: 62 },
    { hour: '11', value: 84 },
    { hour: '12', value: 51 },
    { hour: '1p', value: 70 },
    { hour: '2p', value: 96 },
    { hour: '3p', value: 79 },
    { hour: '4p', value: 58 },
    { hour: '5p', value: 41 }
  ],
  owners: [
    { name: 'Lakshmi Poluru', focus: 'Production', load: 88 },
    { name: 'Priya Poluru', focus: 'Research', load: 64 },
    { name: 'Venkata Poluru', focus: 'Support', load: 71 },
    { name: 'Meera Poluru', focus: 'Internal tools', load: 48 },
    { name: 'Hana Poluru', focus: 'Sandbox', load: 18 },
    { name: 'Ramesh Poluru', focus: 'Knowledge', load: 39 }
  ],
  sla: [
    { label: 'Budget SLA', value: 88 },
    { label: 'Latency SLA', value: 81 },
    { label: 'Key rotation', value: 96 },
    { label: 'Cost attribution', value: 92 }
  ],
  formats: ['CSV', 'PDF', 'JSON', 'Sheets'],
  opsAlerts: [
    {
      id: 'ALT-204',
      kind: 'Budget',
      severity: 'High',
      title: 'Production is at 88% of budget',
      detail: 'gpt-4.1 will hit the $3,400 cap in about 4 days at the current rate. Lakshmi Poluru’s 80% alert fired this morning.',
      owner: 'Lakshmi Poluru',
      status: 'Open',
      time: '12 min ago'
    },
    {
      id: 'ALT-198',
      kind: 'Latency',
      severity: 'Watch',
      title: 'Support p95 drifted above 1.4s',
      detail: 'Gemini 1.5 on Support is at 1.41s p95. Venkata Poluru enabled flash fallback and is checking tool-use traces.',
      owner: 'Venkata Poluru',
      status: 'Open',
      time: '38 min ago'
    },
    {
      id: 'ALT-191',
      kind: 'Keys',
      severity: 'Watch',
      title: 'Sandbox keys rotate tonight',
      detail: 'Hana Poluru scheduled a 02:30 CT rotation. Strict cost gate stays off for Sandbox.',
      owner: 'Hana Poluru',
      status: 'Acknowledged',
      time: '1 hr ago'
    },
    {
      id: 'ALT-187',
      kind: 'Anomaly',
      severity: 'High',
      title: 'Knowledge embeddings spiked 3.2×',
      detail: 'Overnight reindex on embed-3-large added 9.1M tokens. Ramesh Poluru confirmed the job was planned.',
      owner: 'Ramesh Poluru',
      status: 'Open',
      time: '3 hr ago'
    },
    {
      id: 'ALT-174',
      kind: 'Budget',
      severity: 'Watch',
      title: 'Support is at 74% of budget',
      detail: 'Sravani Poluru’s haiku traffic is healthy. Gemini 1.5 is the spend driver.',
      owner: 'Venkata Poluru',
      status: 'Snoozed',
      time: 'Yesterday'
    },
    {
      id: 'ALT-162',
      kind: 'Latency',
      severity: 'Critical',
      title: 'llama-3-70b p95 exceeded 1.6s',
      detail: 'Internal tools fallback is Restricted. Meera Poluru is holding new routes until evals pass.',
      owner: 'Meera Poluru',
      status: 'Open',
      time: 'Yesterday'
    },
    {
      id: 'ALT-155',
      kind: 'Anomaly',
      severity: 'Watch',
      title: 'GTM weekend burst on gpt-4.1-mini',
      detail: 'Nikhil Poluru’s outbound sequence ran Saturday. Spend is still inside the $500 cap.',
      owner: 'Nikhil Poluru',
      status: 'Acknowledged',
      time: '2 days ago'
    }
  ] as OpsAlert[],
  forecasts: [
    { workspace: 'Production', owner: 'Lakshmi Poluru', current: 88, projected: 104, cap: '$3,400', daysToCap: 4, trend: '+12%' },
    { workspace: 'Support', owner: 'Venkata Poluru', current: 74, projected: 91, cap: '$1,400', daysToCap: 9, trend: '+8%' },
    { workspace: 'Research', owner: 'Priya Poluru', current: 61, projected: 72, cap: '$2,100', daysToCap: 18, trend: '+6%' },
    { workspace: 'Internal tools', owner: 'Meera Poluru', current: 48, projected: 55, cap: '$900', daysToCap: 28, trend: '+4%' },
    { workspace: 'Knowledge', owner: 'Ramesh Poluru', current: 39, projected: 58, cap: '$700', daysToCap: 21, trend: '+14%' },
    { workspace: 'GTM', owner: 'Nikhil Poluru', current: 22, projected: 31, cap: '$500', daysToCap: 40, trend: '+5%' },
    { workspace: 'Sandbox', owner: 'Hana Poluru', current: 18, projected: 22, cap: '$400', daysToCap: 45, trend: '+3%' }
  ] as ForecastRow[],
  apiKeys: [
    { name: 'prod-openai', workspace: 'Production', owner: 'Lakshmi Poluru', rotates: '2026-09-12', status: 'Healthy' },
    { name: 'prod-anthropic', workspace: 'Production', owner: 'Lakshmi Poluru', rotates: '2026-09-18', status: 'Healthy' },
    { name: 'support-gemini', workspace: 'Support', owner: 'Venkata Poluru', rotates: '2026-09-08', status: 'Watch' },
    { name: 'sandbox-mistral', workspace: 'Sandbox', owner: 'Hana Poluru', rotates: 'Tonight 02:30 CT', status: 'Watch' },
    { name: 'knowledge-embed', workspace: 'Knowledge', owner: 'Ramesh Poluru', rotates: '2026-10-01', status: 'Healthy' }
  ]
};
