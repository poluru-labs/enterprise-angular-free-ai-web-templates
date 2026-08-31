export type NavItem = {
  path: string;
  label: string;
  icon: string;
  exact?: boolean;
};

export const templateConfig = {
  title: 'Support copilot',
  eyebrow: 'Customer operations',
  summary: 'Give support teams a live view of AI assistance, resolution quality, and queue health.',
  action: 'Draft reply',
  brand: { mark: 'H', name: 'Poluru Support', accent: 'Harbor Desk' },
  workspace: 'CX · Live queue',
  user: { initials: 'AP', name: 'Ananya Poluru', role: 'Support lead' },
  nav: [
    { path: '/', label: 'Queue', icon: 'dashboard', exact: true },
    { path: '/conversations', label: 'Inbox', icon: 'forum' },
    { path: '/suggestions', label: 'Suggestions', icon: 'auto_awesome' },
    { path: '/knowledge', label: 'Knowledge', icon: 'menu_book' },
    { path: '/settings', label: 'Settings', icon: 'tune' }
  ] as NavItem[],
  metrics: [
    { label: 'AI-assisted replies', value: '1,842', trend: '+15.7%', trendDir: 'up' as const, hint: 'this week' },
    { label: 'Resolution rate', value: '89.4%', trend: '+3.1%', trendDir: 'up' as const, hint: 'closed with copilot' },
    { label: 'Queue waiting', value: '34', trend: '-18%', trendDir: 'down' as const, hint: 'open tickets' },
    { label: 'CSAT score', value: '4.8/5', trend: '+0.2', trendDir: 'up' as const, hint: 'surveyed contacts' }
  ],
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
      content: 'Nikhil Poluru’s team flagged a shipping delay. Copilot generated a timeline; Meera Poluru still needs to attach the policy snippet.'
    }
  ],
  activity: [
    { title: 'Billing issue resolved', detail: 'Suggested response accepted · Kavya Poluru', status: 'Resolved', time: '6 min ago' },
    { title: 'Order status drafted', detail: 'Waiting for agent send · Rohan Poluru', status: 'Ready', time: '18 min ago' },
    { title: 'Escalation summary generated', detail: 'Conversation #48291 · Nikhil Poluru', status: 'Review', time: '34 min ago' },
    { title: 'Refund policy cited', detail: 'Knowledge hit · Meera Poluru', status: 'Ready', time: '1 hr ago' },
    { title: 'CSAT follow-up queued', detail: 'Survey after close · Lakshmi Poluru', status: 'Active', time: 'Yesterday' }
  ],
  conversations: [
    { id: '#48291', topic: 'Delayed shipment', owner: 'Nikhil Poluru', channel: 'Email', wait: '12m', status: 'Review', copilot: 'Summary ready' },
    { id: '#48302', topic: 'Invoice mismatch', owner: 'Kavya Poluru', channel: 'Chat', wait: '4m', status: 'Ready', copilot: 'Draft accepted' },
    { id: '#48318', topic: 'Where is my order', owner: 'Rohan Poluru', channel: 'Chat', wait: '1m', status: 'Ready', copilot: 'Tracking reply' },
    { id: '#48324', topic: 'Refund window', owner: 'Hana Poluru', channel: 'Chat', wait: '8m', status: 'Watch', copilot: 'Needs policy' },
    { id: '#48331', topic: 'Password reset loop', owner: 'Venkata Poluru', channel: 'Email', wait: '16m', status: 'Review', copilot: 'Draft waiting' },
    { id: '#48340', topic: 'Plan upgrade', owner: 'Sravani Poluru', channel: 'Social', wait: '22m', status: 'Active', copilot: 'Offer ready' },
    { id: '#48351', topic: 'Night outage notice', owner: 'Priya Poluru', channel: 'Email', wait: '3m', status: 'Ready', copilot: 'Status page' },
    { id: '#48358', topic: 'Warranty claim', owner: 'Arjun Poluru', channel: 'Email', wait: '19m', status: 'Watch', copilot: 'Draft' }
  ],
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
    }
  ],
  articles: [
    { title: 'Refund window', owner: 'Meera Poluru', freshness: '2d', uses: 214, status: 'Live', topic: 'Billing' },
    { title: 'Carrier delays', owner: 'Rohan Poluru', freshness: '5h', uses: 188, status: 'Live', topic: 'Orders' },
    { title: 'Credit notes', owner: 'Kavya Poluru', freshness: '1d', uses: 96, status: 'Review', topic: 'Billing' },
    { title: 'Magic link reset', owner: 'Venkata Poluru', freshness: '8d', uses: 71, status: 'Watch', topic: 'Account' },
    { title: 'Goodwill credits', owner: 'Nikhil Poluru', freshness: '3d', uses: 54, status: 'Live', topic: 'Escalation' },
    { title: 'Night coverage script', owner: 'Priya Poluru', freshness: '12h', uses: 41, status: 'Live', topic: 'Ops' }
  ],
  hourly: [
    { hour: '9a', value: 28 },
    { hour: '10', value: 46 },
    { hour: '11', value: 72 },
    { hour: '12', value: 51 },
    { hour: '1p', value: 63 },
    { hour: '2p', value: 91 },
    { hour: '3p', value: 77 },
    { hour: '4p', value: 44 }
  ],
  owners: [
    { name: 'Kavya Poluru', focus: 'Billing', load: 82 },
    { name: 'Rohan Poluru', focus: 'Orders', load: 74 },
    { name: 'Nikhil Poluru', focus: 'Escalations', load: 68 },
    { name: 'Hana Poluru', focus: 'Chat', load: 61 }
  ],
  sla: [
    { label: 'First reply SLA', value: 94 },
    { label: 'Copilot draft coverage', value: 88 },
    { label: 'Knowledge hit rate', value: 81 }
  ],
  replyTypes: ['Refund', 'Tracking', 'Escalation summary', 'Account reset'],
  channels: ['Chat', 'Email', 'Social']
};
