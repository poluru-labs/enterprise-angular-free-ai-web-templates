export const templateConfig = {
  eyebrow: 'Platform analytics',
  title: 'LLM usage',
  summary: 'Track model consumption, spend, and latency across your organization.',
  action: 'Export report',
  metrics: [
    { label: 'Total tokens', value: '84.2M', trend: '+12.4%', icon: 'data_usage' },
    { label: 'Current spend', value: '$6,842', trend: '+8.1%', icon: 'payments' },
    { label: 'Active models', value: '12', trend: '+2', icon: 'neurology' },
    { label: 'Avg. latency', value: '1.24s', trend: '-6.8%', icon: 'speed' }
  ],
  mustHaveFeatures: [
    {
      title: 'Usage Metering',
      detail: 'Track token consumption per model, workspace, and API key.',
      status: 'Enabled'
    },
    {
      title: 'Budget Alerts',
      detail: 'Notify workspace owners before spend crosses a set threshold.',
      status: 'Enabled'
    },
    {
      title: 'Latency Monitoring',
      detail: 'Watch p50/p95 response times across model providers.',
      status: 'Enabled'
    },
    {
      title: 'Cost Allocation',
      detail: 'Break down spend by team, project, and environment.',
      status: 'Enabled'
    }
  ],
  activity: [
    { title: 'GPT-4.1 API budget updated', detail: 'Production workspace · Alex Poluru', status: 'Updated' },
    { title: 'New model endpoint connected', detail: 'Open-source inference · Maya Poluru', status: 'Active' },
    { title: 'Weekly cost digest generated', detail: 'Finance workspace · Priya Poluru', status: 'Ready' }
  ],
  usage: [
    { model: 'gpt-4.1', workspace: 'Production', tokens: '32.6M', cost: '$2,940', latency: '1.02s' },
    { model: 'claude-3.5', workspace: 'Research', tokens: '18.4M', cost: '$1,280', latency: '0.88s' },
    { model: 'gemini-1.5', workspace: 'Support', tokens: '14.1M', cost: '$960', latency: '1.41s' },
    { model: 'llama-3-70b', workspace: 'Internal tools', tokens: '11.8M', cost: '$540', latency: '1.65s' },
    { model: 'mistral-large', workspace: 'Sandbox', tokens: '7.3M', cost: '$122', latency: '1.12s' }
  ],
  models: [
    {
      title: 'gpt-4.1',
      detail: 'Primary production model for customer-facing agents and support flows.',
      owner: 'Alex Poluru',
      status: 'Active'
    },
    {
      title: 'claude-3.5',
      detail: 'Research and long-context summarization workloads.',
      owner: 'Priya Poluru',
      status: 'Active'
    },
    {
      title: 'llama-3-70b',
      detail: 'Self-hosted fallback model for internal tooling.',
      owner: 'Sam Poluru',
      status: 'Restricted'
    }
  ],
  budgets: [
    { day: 'Mon', item: 'Production budget review · Alex Poluru' },
    { day: 'Tue', item: 'Research workspace forecast update · Priya Poluru' },
    { day: 'Wed', item: 'Support workspace overage check · Maya Poluru' },
    { day: 'Thu', item: 'Finance monthly digest sent' },
    { day: 'Fri', item: 'Sandbox budget reset · Sam Poluru' }
  ]
};
