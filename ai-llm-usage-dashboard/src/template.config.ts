export type NavItem = {
  path: string;
  label: string;
  icon: string;
  exact?: boolean;
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
    { path: '/settings', label: 'Settings', icon: 'tune' }
  ] as NavItem[],
  metrics: [
    { label: 'Total tokens', value: '84.2M', trend: '+12.4%', trendDir: 'up' as const, hint: 'this week' },
    { label: 'Current spend', value: '$6,842', trend: '+8.1%', trendDir: 'up' as const, hint: 'of $9,200' },
    { label: 'Active models', value: '12', trend: '+2', trendDir: 'up' as const, hint: 'endpoints' },
    { label: 'Avg. latency', value: '1.24s', trend: '-6.8%', trendDir: 'down' as const, hint: 'p95' }
  ],
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
    }
  ],
  activity: [
    { title: 'GPT-4.1 API budget updated', detail: 'Production · Lakshmi Poluru', status: 'Updated', time: '12 min ago' },
    { title: 'New model endpoint connected', detail: 'Open-source inference · Meera Poluru', status: 'Active', time: '38 min ago' },
    { title: 'Weekly cost digest generated', detail: 'Finance · Priya Poluru', status: 'Ready', time: '1 hr ago' },
    { title: 'Support overage check', detail: 'Gemini 1.5 · Venkata Poluru', status: 'Watch', time: '2 hr ago' },
    { title: 'Sandbox budget reset', detail: 'mistral-large · Hana Poluru', status: 'Ready', time: 'Yesterday' }
  ],
  usage: [
    { model: 'gpt-4.1', workspace: 'Production', owner: 'Lakshmi Poluru', tokens: '32.6M', cost: '$2,940', latency: '1.02s', status: 'Healthy' },
    { model: 'claude-3.5', workspace: 'Research', owner: 'Priya Poluru', tokens: '18.4M', cost: '$1,280', latency: '0.88s', status: 'Healthy' },
    { model: 'gemini-1.5', workspace: 'Support', owner: 'Venkata Poluru', tokens: '14.1M', cost: '$960', latency: '1.41s', status: 'Watch' },
    { model: 'llama-3-70b', workspace: 'Internal tools', owner: 'Meera Poluru', tokens: '11.8M', cost: '$540', latency: '1.65s', status: 'Restricted' },
    { model: 'mistral-large', workspace: 'Sandbox', owner: 'Hana Poluru', tokens: '7.3M', cost: '$122', latency: '1.12s', status: 'Healthy' },
    { model: 'gpt-4.1-mini', workspace: 'GTM', owner: 'Nikhil Poluru', tokens: '4.9M', cost: '$186', latency: '0.74s', status: 'Healthy' },
    { model: 'claude-haiku', workspace: 'Support', owner: 'Sravani Poluru', tokens: '3.2M', cost: '$94', latency: '0.61s', status: 'Healthy' },
    { model: 'embed-3-large', workspace: 'Knowledge', owner: 'Ramesh Poluru', tokens: '9.1M', cost: '$210', latency: '0.22s', status: 'Healthy' }
  ],
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
      title: 'claude-3.5',
      detail: 'Research and long-context summarization workloads.',
      owner: 'Priya Poluru',
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
      title: 'llama-3-70b',
      detail: 'Self-hosted fallback for internal tooling.',
      owner: 'Meera Poluru',
      status: 'Restricted',
      provider: 'Meta',
      access: 'Restricted'
    },
    {
      title: 'mistral-large',
      detail: 'Sandbox experiments and prompt evals.',
      owner: 'Hana Poluru',
      status: 'Active',
      provider: 'Mistral',
      access: 'Open'
    },
    {
      title: 'embed-3-large',
      detail: 'Embeddings for knowledge retrieval.',
      owner: 'Ramesh Poluru',
      status: 'Active',
      provider: 'OpenAI',
      access: 'Open'
    }
  ],
  budgets: [
    { day: 'Mon', item: 'Production budget review · Lakshmi Poluru', spend: 88 },
    { day: 'Tue', item: 'Research workspace forecast · Priya Poluru', spend: 61 },
    { day: 'Wed', item: 'Support overage check · Venkata Poluru', spend: 74 },
    { day: 'Thu', item: 'Finance monthly digest · Arjun Poluru', spend: 42 },
    { day: 'Fri', item: 'Sandbox budget reset · Hana Poluru', spend: 18 }
  ],
  workspaces: [
    { name: 'Production', owner: 'Lakshmi Poluru', spend: 88, cap: '$3,400' },
    { name: 'Research', owner: 'Priya Poluru', spend: 61, cap: '$2,100' },
    { name: 'Support', owner: 'Venkata Poluru', spend: 74, cap: '$1,400' },
    { name: 'Internal tools', owner: 'Meera Poluru', spend: 48, cap: '$900' }
  ],
  hourly: [
    { hour: '9a', value: 38 },
    { hour: '10', value: 62 },
    { hour: '11', value: 84 },
    { hour: '12', value: 51 },
    { hour: '1p', value: 70 },
    { hour: '2p', value: 96 },
    { hour: '3p', value: 79 },
    { hour: '4p', value: 58 }
  ],
  owners: [
    { name: 'Lakshmi Poluru', focus: 'Production', load: 88 },
    { name: 'Priya Poluru', focus: 'Research', load: 64 },
    { name: 'Venkata Poluru', focus: 'Support', load: 71 },
    { name: 'Meera Poluru', focus: 'Internal tools', load: 48 }
  ],
  sla: [
    { label: 'Budget SLA', value: 88 },
    { label: 'Latency SLA', value: 81 },
    { label: 'Key rotation', value: 96 }
  ],
  formats: ['CSV', 'PDF', 'JSON', 'Sheets']
};
