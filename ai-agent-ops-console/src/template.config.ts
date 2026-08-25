export type NavItem = {
  path: string;
  label: string;
  icon: string;
  exact?: boolean;
  badge?: number;
};

export const templateConfig = {
  title: 'Agent operations',
  eyebrow: 'Agent observability',
  summary: 'Monitor autonomous workflows, tool calls, and handoffs across the agent fleet.',
  action: 'Deploy agent',
  brand: { mark: 'A', name: 'AgentOps', accent: 'Kit' },
  workspace: 'AgentOps workspace',
  user: { initials: 'AP', name: 'Alex Poluru', role: 'Workspace admin' },
  navGroups: [
    {
      label: 'Operations',
      items: [
        { path: '/', label: 'Operations', icon: 'dashboard', exact: true },
        { path: '/agents', label: 'Agents', icon: 'smart_toy' },
        { path: '/runs', label: 'Runs', icon: 'timeline' },
        { path: '/tools', label: 'Tools', icon: 'construction' }
      ]
    },
    {
      label: 'Oversight',
      items: [
        { path: '/handoffs', label: 'Handoffs', icon: 'handshake', badge: 2 },
        { path: '/alerts', label: 'Alerts', icon: 'notifications_active', badge: 2 }
      ]
    }
  ] as { label: string; items: NavItem[] }[],
  metrics: [
    { label: 'Active agents', value: '48', trend: '+5', icon: 'smart_toy', path: '/agents' },
    { label: 'Successful runs', value: '98.4%', trend: '+0.6%', icon: 'check_circle', path: '/runs' },
    { label: 'Tool calls today', value: '12.8K', trend: '+18%', icon: 'build', path: '/tools' },
    { label: 'Human handoffs', value: '21', trend: '-11%', icon: 'handshake', path: '/handoffs' }
  ],
  activityTitle: 'Agent run activity',
  activity: [
    { title: 'Invoice triage agent completed', detail: '246 records processed', status: 'Complete', tone: 'ok', path: '/runs' },
    { title: 'Research agent awaiting approval', detail: 'Tool call: web search', status: 'Review', tone: 'warn', path: '/handoffs' },
    { title: 'Onboarding agent deployed', detail: 'Version 2.4.0', status: 'Live', tone: 'ok', path: '/agents' }
  ],
  agents: [
    { id: 'invoice-triage', name: 'Invoice triage', owner: 'Finance', version: '2.4.1', runs: '1,204', success: '99.2%', status: 'Live', tone: 'ok', updated: '12 min ago' },
    { id: 'research', name: 'Research agent', owner: 'Strategy', version: '1.8.0', runs: '318', success: '94.1%', status: 'Review', tone: 'warn', updated: '4 min ago' },
    { id: 'onboarding', name: 'Onboarding agent', owner: 'People', version: '2.4.0', runs: '862', success: '98.7%', status: 'Live', tone: 'ok', updated: '1 hr ago' },
    { id: 'support-router', name: 'Support router', owner: 'Support', version: '3.1.2', runs: '4,110', success: '97.4%', status: 'Live', tone: 'ok', updated: '3 min ago' },
    { id: 'contract-reviewer', name: 'Contract reviewer', owner: 'Legal', version: '0.9.4', runs: '41', success: '91.0%', status: 'Paused', tone: 'rose', updated: '2 days ago' },
    { id: 'collections', name: 'Collections follow-up', owner: 'Finance', version: '1.2.0', runs: '276', success: '96.5%', status: 'Live', tone: 'ok', updated: '28 min ago' }
  ],
  runs: [
    { id: 'RUN-1842', agent: 'Invoice triage', started: '2 min ago', duration: '1m 12s', status: 'Complete', tone: 'ok', detail: '246 records processed' },
    { id: 'RUN-1841', agent: 'Research agent', started: '4 min ago', duration: '—', status: 'Review', tone: 'warn', detail: 'Waiting on web search approval' },
    { id: 'RUN-1839', agent: 'Support router', started: '11 min ago', duration: '48s', status: 'Running', tone: 'info', detail: 'Routing 18 open tickets' },
    { id: 'RUN-1834', agent: 'Onboarding agent', started: '1 hr ago', duration: '3m 04s', status: 'Complete', tone: 'ok', detail: 'Version 2.4.0 rollout' },
    { id: 'RUN-1828', agent: 'Contract reviewer', started: '3 hr ago', duration: '12s', status: 'Failed', tone: 'rose', detail: 'Document parser timeout' },
    { id: 'RUN-1821', agent: 'Collections follow-up', started: '5 hr ago', duration: '2m 41s', status: 'Complete', tone: 'ok', detail: '14 reminder sequences sent' }
  ],
  tools: [
    { name: 'ERP lookup', type: 'Internal API', owner: 'Finance systems', reliability: '99.8%', calls: '4.2K', status: 'Approved', tone: 'ok' },
    { name: 'Web search', type: 'External', owner: 'Platform', reliability: '97.1%', calls: '812', status: 'Restricted', tone: 'warn' },
    { name: 'Ticketing', type: 'Internal API', owner: 'Support', reliability: '99.4%', calls: '3.6K', status: 'Approved', tone: 'ok' },
    { name: 'HRIS records', type: 'Internal API', owner: 'People', reliability: '99.9%', calls: '640', status: 'Approved', tone: 'ok' },
    { name: 'Contract parser', type: 'Internal', owner: 'Legal', reliability: '92.0%', calls: '41', status: 'Degraded', tone: 'rose' },
    { name: 'Slack notify', type: 'Integration', owner: 'Platform', reliability: '99.6%', calls: '1.1K', status: 'Approved', tone: 'ok' }
  ],
  handoffs: [
    { id: 'HO-1092', agent: 'Research agent', reason: 'External web search requires approval', waiting: '4 min', reviewer: 'Alex Poluru', status: 'Waiting', tone: 'warn', risk: 'Medium' },
    { id: 'HO-1088', agent: 'Contract reviewer', reason: 'Clause flagged outside policy', waiting: '26 min', reviewer: 'Maya Subbu', status: 'Waiting', tone: 'warn', risk: 'High' },
    { id: 'HO-1071', agent: 'Support router', reason: 'VIP account escalation', waiting: 'Resolved', reviewer: 'Priya Subbu', status: 'Approved', tone: 'ok', risk: 'Low' },
    { id: 'HO-1064', agent: 'Invoice triage', reason: 'Vendor not in approved directory', waiting: 'Resolved', reviewer: 'Sam Poluru', status: 'Rejected', tone: 'rose', risk: 'Medium' }
  ],
  alerts: [
    { title: 'Research agent awaiting approval', detail: 'Web search tool call is blocked on policy.', time: '4 min ago', severity: 'Action needed', tone: 'warn', path: '/handoffs' },
    { title: 'Contract parser degraded', detail: 'Reliability dropped to 92% in the last hour.', time: '18 min ago', severity: 'Warning', tone: 'rose', path: '/tools' },
    { title: 'Onboarding agent deployed', detail: 'Version 2.4.0 is live in People workspace.', time: '1 hr ago', severity: 'Info', tone: 'info', path: '/agents' },
    { title: 'Run success dipped overnight', detail: 'Successful runs fell 0.4% against the weekly baseline.', time: '6 hr ago', severity: 'Info', tone: 'info', path: '/runs' }
  ],
  settings: [
    { group: 'Workspace policies', items: [
      { title: 'Require approval for external tools', detail: 'Agents must pause before calling unapproved third-party APIs.', enabled: true },
      { title: 'Auto-pause failed agents', detail: 'Stop an agent after three consecutive failed runs.', enabled: true },
      { title: 'Allow production deploys', detail: 'Workspace admins can publish new agent versions.', enabled: true }
    ] },
    { group: 'Alerts', items: [
      { title: 'Handoff notifications', detail: 'Notify reviewers when an agent needs a human decision.', enabled: true },
      { title: 'Reliability warnings', detail: 'Alert when a tool drops below 95% success.', enabled: true },
      { title: 'Daily operations digest', detail: 'Email a summary of runs, handoffs, and incidents.', enabled: false }
    ] },
    { group: 'Access', items: [
      { title: 'Restrict deploy to admins', detail: 'Only workspace admins can ship new agent versions.', enabled: true },
      { title: 'Share run traces with operators', detail: 'Let operators inspect prompts, tools, and outcomes.', enabled: true }
    ] }
  ],
  deployModels: ['Polaris 4.1', 'Polaris 4.1 Mini', 'Atlas Reasoner'],
  deployTools: ['ERP lookup', 'Web search', 'Ticketing', 'HRIS records', 'Slack notify']
};
