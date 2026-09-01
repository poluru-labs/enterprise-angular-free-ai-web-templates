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

export type ConversationRow = {
  id: string;
  topic: string;
  owner: string;
  channel: 'Chat' | 'Email' | 'Social';
  wait: string;
  waitMinutes: number;
  status: 'Ready' | 'Review' | 'Watch' | 'Active';
  copilot: string;
  detail: string;
};

export type SuggestionRow = {
  title: string;
  detail: string;
  owner: string;
  status: 'Ready' | 'Review' | 'Watch' | 'Active';
  type: 'Billing' | 'Orders' | 'Escalation' | 'Account' | 'Sales assist';
  ticket: string;
};

export type ArticleRow = {
  title: string;
  owner: string;
  freshness: string;
  uses: number;
  status: 'Live' | 'Review' | 'Watch';
  topic: string;
  detail: string;
};

export type AgentRow = {
  name: string;
  focus: string;
  load: number;
  shift: 'Day' | 'Swing' | 'Night';
  status: 'On track' | 'Watch' | 'Overdue';
  open: number;
  detail: string;
};

export type ReportRow = {
  name: string;
  owner: string;
  csat: string;
  deflection: number;
  grounded: number;
  status: 'Ready' | 'Review' | 'Watch';
  window: string;
  detail: string;
};

export const templateConfig = {
  title: 'Support copilot',
  eyebrow: 'Customer operations',
  summary: 'Give support teams a live view of AI assistance, resolution quality, and queue health.',
  action: 'Draft reply',
  brand: { mark: 'H', name: 'Harbor Desk', accent: 'Harbor Desk' },
  workspace: 'CX · Live queue',
  environment: 'Production',
  copilotLabel: 'Auto-draft on',
  qualityLabel: '4.8/5 CSAT',
  user: { initials: 'AP', name: 'Ananya Poluru', role: 'Support lead' },
  nav: [
    { path: '/', label: 'Queue', icon: 'dashboard', exact: true },
    { path: '/conversations', label: 'Inbox', icon: 'forum' },
    { path: '/suggestions', label: 'Suggestions', icon: 'auto_awesome' },
    { path: '/knowledge', label: 'Knowledge', icon: 'menu_book' },
    { path: '/agents', label: 'Agents', icon: 'group' },
    { path: '/reports', label: 'Reports', icon: 'analytics' },
    { path: '/settings', label: 'Settings', icon: 'tune' }
  ] as NavItem[],
  metrics: [
    { label: 'AI-assisted replies', value: '1,842', trend: '+15.7%', trendDir: 'up' as const, hint: 'this week' },
    { label: 'Resolution rate', value: '89.4%', trend: '+3.1%', trendDir: 'up' as const, hint: 'closed with copilot' },
    { label: 'Queue waiting', value: '34', trend: '-18%', trendDir: 'down' as const, hint: 'open tickets' },
    { label: 'CSAT score', value: '4.8/5', trend: '+0.2', trendDir: 'up' as const, hint: 'surveyed contacts' }
  ] as Metric[],
  metricsByPeriod: {
    day: [
      { label: 'AI-assisted replies', value: '412', trend: '+8.4%', trendDir: 'up' as const, hint: 'today' },
      { label: 'Resolution rate', value: '88.1%', trend: '+1.2%', trendDir: 'up' as const, hint: 'closed with copilot' },
      { label: 'Queue waiting', value: '12', trend: '-4', trendDir: 'down' as const, hint: 'open tickets' },
      { label: 'CSAT score', value: '4.7/5', trend: '+0.1', trendDir: 'up' as const, hint: 'surveyed contacts' }
    ],
    week: [
      { label: 'AI-assisted replies', value: '1,842', trend: '+15.7%', trendDir: 'up' as const, hint: 'this week' },
      { label: 'Resolution rate', value: '89.4%', trend: '+3.1%', trendDir: 'up' as const, hint: 'closed with copilot' },
      { label: 'Queue waiting', value: '34', trend: '-18%', trendDir: 'down' as const, hint: 'open tickets' },
      { label: 'CSAT score', value: '4.8/5', trend: '+0.2', trendDir: 'up' as const, hint: 'surveyed contacts' }
    ],
    month: [
      { label: 'AI-assisted replies', value: '7,410', trend: '+12.9%', trendDir: 'up' as const, hint: 'this month' },
      { label: 'Resolution rate', value: '90.2%', trend: '+4.0%', trendDir: 'up' as const, hint: 'closed with copilot' },
      { label: 'Queue waiting', value: '28', trend: '-22%', trendDir: 'down' as const, hint: 'open tickets' },
      { label: 'CSAT score', value: '4.8/5', trend: '+0.3', trendDir: 'up' as const, hint: 'surveyed contacts' }
    ]
  } as Record<'day' | 'week' | 'month', Metric[]>,
  alerts: [
    {
      heading: 'Billing replies are stacking in the live queue',
      content: 'Kavya Poluru’s copilot drafts are ready on 11 invoices. Suggestion pack “Refund window” is queued for review.'
    },
    {
      heading: 'Order status coverage is still high',
      content: 'Rohan Poluru confirmed 94% of tracking questions were sent with a copilot draft. Night coverage is on for Priya Poluru.'
    },
    {
      heading: 'Escalation #48291 needs a human summary',
      content:
        'Nikhil Poluru’s team flagged a shipping delay. Copilot generated a timeline; Meera Poluru still needs to attach the policy snippet.'
    },
    {
      heading: 'Password reset loop is repeating',
      content: 'Venkata Poluru’s magic-link article is eight days stale. Watch status until the workaround is republished.'
    }
  ],
  activity: [
    { title: 'Billing issue resolved', detail: 'Suggested response accepted · Kavya Poluru', status: 'Resolved', time: '6 min ago' },
    { title: 'Order status drafted', detail: 'Waiting for agent send · Rohan Poluru', status: 'Ready', time: '18 min ago' },
    { title: 'Escalation summary generated', detail: 'Conversation #48291 · Nikhil Poluru', status: 'Review', time: '34 min ago' },
    { title: 'Refund policy cited', detail: 'Knowledge hit · Meera Poluru', status: 'Ready', time: '1 hr ago' },
    { title: 'CSAT follow-up queued', detail: 'Survey after close · Lakshmi Poluru', status: 'Active', time: 'Yesterday' },
    { title: 'Night outage notice sent', detail: 'Status page cited · Priya Poluru', status: 'Ready', time: 'Yesterday' },
    { title: 'Warranty claim watching', detail: 'Needs policy attach · Arjun Poluru', status: 'Watch', time: '2 days ago' }
  ],
  conversations: [
    {
      id: '#48291',
      topic: 'Delayed shipment',
      owner: 'Nikhil Poluru',
      channel: 'Email',
      wait: '12m',
      waitMinutes: 12,
      status: 'Review',
      copilot: 'Summary ready',
      detail: 'Three carrier scans missed. Timeline is drafted; policy snippet still needs attaching.'
    },
    {
      id: '#48302',
      topic: 'Invoice mismatch',
      owner: 'Kavya Poluru',
      channel: 'Chat',
      wait: '4m',
      waitMinutes: 4,
      status: 'Ready',
      copilot: 'Draft accepted',
      detail: 'Line item 4 billed twice. Credit-note draft is accepted and waiting to send.'
    },
    {
      id: '#48318',
      topic: 'Where is my order',
      owner: 'Rohan Poluru',
      channel: 'Chat',
      wait: '1m',
      waitMinutes: 1,
      status: 'Ready',
      copilot: 'Tracking reply',
      detail: 'Dallas scan this morning. ETA Thursday. Tracking reply is ready.'
    },
    {
      id: '#48324',
      topic: 'Refund window',
      owner: 'Hana Poluru',
      channel: 'Chat',
      wait: '8m',
      waitMinutes: 8,
      status: 'Watch',
      copilot: 'Needs policy',
      detail: 'Cite the 30-day policy and offer a prepaid label. Waiting on Meera Poluru’s article.'
    },
    {
      id: '#48331',
      topic: 'Password reset loop',
      owner: 'Venkata Poluru',
      channel: 'Email',
      wait: '16m',
      waitMinutes: 16,
      status: 'Review',
      copilot: 'Draft waiting',
      detail: 'Clear session cookie, then send magic link. Article is eight days stale.'
    },
    {
      id: '#48340',
      topic: 'Plan upgrade',
      owner: 'Sravani Poluru',
      channel: 'Social',
      wait: '22m',
      waitMinutes: 22,
      status: 'Active',
      copilot: 'Offer ready',
      detail: 'Customer asked about annual billing. Pro comparison is attached.'
    },
    {
      id: '#48351',
      topic: 'Night outage notice',
      owner: 'Priya Poluru',
      channel: 'Email',
      wait: '3m',
      waitMinutes: 3,
      status: 'Ready',
      copilot: 'Status page',
      detail: 'Night coverage script cited the status page. Ready to send.'
    },
    {
      id: '#48358',
      topic: 'Warranty claim',
      owner: 'Arjun Poluru',
      channel: 'Email',
      wait: '19m',
      waitMinutes: 19,
      status: 'Watch',
      copilot: 'Draft',
      detail: 'Hardware warranty path. Needs the goodwill-credit policy before send.'
    },
    {
      id: '#48366',
      topic: 'SSO timeout',
      owner: 'Lakshmi Poluru',
      channel: 'Chat',
      wait: '7m',
      waitMinutes: 7,
      status: 'Ready',
      copilot: 'Reset steps',
      detail: 'Workspace admin hit an IdP timeout. Copilot drafted the rotation steps.'
    },
    {
      id: '#48372',
      topic: 'Duplicate charge',
      owner: 'Kavya Poluru',
      channel: 'Email',
      wait: '9m',
      waitMinutes: 9,
      status: 'Review',
      copilot: 'Credit draft',
      detail: 'Second invoice this month. Needs Ananya Poluru before the credit goes out.'
    },
    {
      id: '#48380',
      topic: 'Missing parts',
      owner: 'Rohan Poluru',
      channel: 'Chat',
      wait: '5m',
      waitMinutes: 5,
      status: 'Ready',
      copilot: 'Reship offer',
      detail: 'Warehouse confirmed a short-ship. Reship label is in the draft.'
    },
    {
      id: '#48388',
      topic: 'API 429 errors',
      owner: 'Nikhil Poluru',
      channel: 'Email',
      wait: '14m',
      waitMinutes: 14,
      status: 'Watch',
      copilot: 'Runbook',
      detail: 'Rate-limit runbook is cited. Waiting on incident #SEV-19 from Ops.'
    }
  ] as ConversationRow[],
  suggestions: [
    {
      title: 'Refund window reply',
      detail: 'Cite the 30-day policy and offer a prepaid label.',
      owner: 'Hana Poluru',
      status: 'Review',
      type: 'Billing',
      ticket: '#48324'
    },
    {
      title: 'Tracking update',
      detail: 'Carrier scan from Dallas this morning. ETA Thursday.',
      owner: 'Rohan Poluru',
      status: 'Ready',
      type: 'Orders',
      ticket: '#48318'
    },
    {
      title: 'Escalation timeline',
      detail: 'Three scans missed. Recommend goodwill credit.',
      owner: 'Nikhil Poluru',
      status: 'Review',
      type: 'Escalation',
      ticket: '#48291'
    },
    {
      title: 'Invoice correction',
      detail: 'Line item 4 billed twice. Copilot drafted a credit note.',
      owner: 'Kavya Poluru',
      status: 'Ready',
      type: 'Billing',
      ticket: '#48302'
    },
    {
      title: 'Reset loop workaround',
      detail: 'Clear session cookie, then send magic link.',
      owner: 'Venkata Poluru',
      status: 'Watch',
      type: 'Account',
      ticket: '#48331'
    },
    {
      title: 'Upgrade offer',
      detail: 'Customer asked about annual billing. Attach Pro comparison.',
      owner: 'Sravani Poluru',
      status: 'Active',
      type: 'Sales assist',
      ticket: '#48340'
    },
    {
      title: 'SSO timeout steps',
      detail: 'Rotate the IdP certificate, then re-test login.',
      owner: 'Lakshmi Poluru',
      status: 'Ready',
      type: 'Account',
      ticket: '#48366'
    },
    {
      title: 'Rate-limit runbook',
      detail: 'Cite SEV-19 and the backoff window from Ops.',
      owner: 'Nikhil Poluru',
      status: 'Watch',
      type: 'Escalation',
      ticket: '#48388'
    }
  ] as SuggestionRow[],
  articles: [
    {
      title: 'Refund window',
      owner: 'Meera Poluru',
      freshness: '2d',
      uses: 214,
      status: 'Live',
      topic: 'Billing',
      detail: '30-day refund policy plus prepaid-label steps used by Harbor Desk drafts.'
    },
    {
      title: 'Carrier delays',
      owner: 'Rohan Poluru',
      freshness: '5h',
      uses: 188,
      status: 'Live',
      topic: 'Orders',
      detail: 'Tracking language for missed scans and ETA windows.'
    },
    {
      title: 'Credit notes',
      owner: 'Kavya Poluru',
      freshness: '1d',
      uses: 96,
      status: 'Review',
      topic: 'Billing',
      detail: 'Invoice correction macros. Needs Ananya Poluru before they stay live.'
    },
    {
      title: 'Magic link reset',
      owner: 'Venkata Poluru',
      freshness: '8d',
      uses: 71,
      status: 'Watch',
      topic: 'Account',
      detail: 'Session-cookie workaround is eight days stale and repeating in the queue.'
    },
    {
      title: 'Goodwill credits',
      owner: 'Nikhil Poluru',
      freshness: '3d',
      uses: 54,
      status: 'Live',
      topic: 'Escalation',
      detail: 'Credit amounts for missed scans and delayed shipments.'
    },
    {
      title: 'Night coverage script',
      owner: 'Priya Poluru',
      freshness: '12h',
      uses: 41,
      status: 'Live',
      topic: 'Ops',
      detail: 'Status-page citations for overnight incidents.'
    },
    {
      title: 'SSO rotation',
      owner: 'Lakshmi Poluru',
      freshness: '6h',
      uses: 33,
      status: 'Live',
      topic: 'Account',
      detail: 'IdP certificate rotation for workspace admins.'
    },
    {
      title: 'Rate-limit runbook',
      owner: 'Nikhil Poluru',
      freshness: '4d',
      uses: 22,
      status: 'Watch',
      topic: 'Ops',
      detail: 'API 429 backoff. Waiting on SEV-19 from Ops before republish.'
    }
  ] as ArticleRow[],
  agents: [
    {
      name: 'Kavya Poluru',
      focus: 'Billing',
      load: 82,
      shift: 'Day',
      status: 'On track',
      open: 9,
      detail: 'Invoice and credit-note queue. Copilot coverage is 94% on billing chats.'
    },
    {
      name: 'Rohan Poluru',
      focus: 'Orders',
      load: 74,
      shift: 'Day',
      status: 'On track',
      open: 7,
      detail: 'Tracking and reship. Night coverage handoff to Priya Poluru is clean.'
    },
    {
      name: 'Nikhil Poluru',
      focus: 'Escalations',
      load: 68,
      shift: 'Swing',
      status: 'Watch',
      open: 5,
      detail: 'Delayed shipment plus API 429. Policy snippets still missing on #48291.'
    },
    {
      name: 'Hana Poluru',
      focus: 'Chat',
      load: 61,
      shift: 'Day',
      status: 'On track',
      open: 6,
      detail: 'Refund window chats. Waiting on Meera Poluru’s article refresh.'
    },
    {
      name: 'Priya Poluru',
      focus: 'Night coverage',
      load: 44,
      shift: 'Night',
      status: 'On track',
      open: 3,
      detail: 'Status-page notices and overnight outages. Script is 12 hours fresh.'
    },
    {
      name: 'Venkata Poluru',
      focus: 'Account',
      load: 57,
      shift: 'Day',
      status: 'Overdue',
      open: 4,
      detail: 'Password-reset loop is repeating. Magic-link article is eight days stale.'
    }
  ] as AgentRow[],
  reports: [
    {
      name: 'Weekly CSAT',
      owner: 'Ananya Poluru',
      csat: '4.8/5',
      deflection: 41,
      grounded: 92,
      status: 'Ready',
      window: 'This week',
      detail: 'Surveyed contacts after copilot-assisted closes. Billing drove the lift.'
    },
    {
      name: 'Billing quality',
      owner: 'Kavya Poluru',
      csat: '4.9/5',
      deflection: 48,
      grounded: 95,
      status: 'Ready',
      window: 'This week',
      detail: 'Credit-note drafts stay grounded in the refund-window article.'
    },
    {
      name: 'Orders deflection',
      owner: 'Rohan Poluru',
      csat: '4.7/5',
      deflection: 62,
      grounded: 91,
      status: 'Ready',
      window: 'This week',
      detail: 'Tracking replies deflected 62% of “where is my order” chats.'
    },
    {
      name: 'Escalation review',
      owner: 'Nikhil Poluru',
      csat: '4.4/5',
      deflection: 18,
      grounded: 74,
      status: 'Review',
      window: 'This week',
      detail: 'Groundedness dropped while policy snippets were missing on delayed shipments.'
    },
    {
      name: 'Night coverage',
      owner: 'Priya Poluru',
      csat: '4.6/5',
      deflection: 55,
      grounded: 88,
      status: 'Ready',
      window: 'Last night',
      detail: 'Status-page citations kept overnight CSAT above the 4.5 floor.'
    },
    {
      name: 'Account resets',
      owner: 'Venkata Poluru',
      csat: '4.2/5',
      deflection: 22,
      grounded: 61,
      status: 'Watch',
      window: 'This week',
      detail: 'Stale magic-link article is dragging groundedness on reset loops.'
    }
  ] as ReportRow[],
  hourly: [
    { hour: '8a', value: 18 },
    { hour: '9a', value: 28 },
    { hour: '10', value: 46 },
    { hour: '11', value: 72 },
    { hour: '12', value: 51 },
    { hour: '1p', value: 63 },
    { hour: '2p', value: 91 },
    { hour: '3p', value: 77 },
    { hour: '4p', value: 44 },
    { hour: '5p', value: 26 }
  ],
  owners: [
    { name: 'Kavya Poluru', focus: 'Billing', load: 82 },
    { name: 'Rohan Poluru', focus: 'Orders', load: 74 },
    { name: 'Nikhil Poluru', focus: 'Escalations', load: 68 },
    { name: 'Hana Poluru', focus: 'Chat', load: 61 },
    { name: 'Priya Poluru', focus: 'Night coverage', load: 44 }
  ],
  sla: [
    { label: 'First reply SLA', value: 94 },
    { label: 'Copilot draft coverage', value: 88 },
    { label: 'Knowledge hit rate', value: 81 },
    { label: 'Grounded replies', value: 86 }
  ],
  replyTypes: ['Refund', 'Tracking', 'Escalation summary', 'Account reset', 'Credit note'],
  channels: ['Chat', 'Email', 'Social']
};
