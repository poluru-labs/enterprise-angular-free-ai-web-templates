export type NavItem = {
  path: string;
  label: string;
  icon: string;
  exact?: boolean;
};

export const templateConfig = {
  title: 'Fraud risk monitor',
  eyebrow: 'Risk intelligence',
  summary: 'Surface suspicious activity early, prioritize investigation queues, and watch model coverage in one place.',
  action: 'Review alerts',
  brand: { mark: 'R', name: 'Risk', accent: 'Watch' },
  workspace: 'Poluru Labs',
  user: { initials: 'AP', name: 'Aisha Poluru', role: 'Risk lead' },
  nav: [
    { path: '/', label: 'Monitor', icon: 'shield', exact: true },
    { path: '/alerts', label: 'Alerts', icon: 'warning' },
    { path: '/cases', label: 'Cases', icon: 'folder_open' },
    { path: '/rules', label: 'Rules', icon: 'rule' },
    { path: '/settings', label: 'Settings', icon: 'settings' }
  ] as NavItem[],
  metrics: [
    { label: 'Protected volume', value: '$4.28M', trend: '+9.6%', icon: 'shield', path: '/cases' },
    { label: 'Risk alerts', value: '42', trend: '-13%', icon: 'warning', path: '/alerts' },
    { label: 'Blocked attempts', value: '186', trend: '+21%', icon: 'block', path: '/cases' },
    { label: 'Model precision', value: '97.1%', trend: '+0.9%', icon: 'security', path: '/rules' }
  ],
  activityTitle: 'Live risk activity',
  activity: [
    { title: 'High-risk transfer contained', detail: 'Meera Poluru · Case FR-8821 · $18,400', status: 'Blocked', tone: 'ok', path: '/cases' },
    { title: 'New device anomaly', detail: 'Arjun Poluru · account 1842 · Lagos IP', status: 'Review', tone: 'warn', path: '/alerts' },
    { title: 'Velocity rule fired', detail: 'Leila Poluru · 11 card attempts in 4 min', status: 'Open', tone: 'rose', path: '/alerts' },
    { title: 'Rule pack updated', detail: 'Jordan Poluru · international wires v3.2', status: 'Updated', tone: 'info', path: '/rules' }
  ],
  investigators: [
    { name: 'Aisha Poluru', load: '6 cases', focus: 'Wires over $10k', score: '98' },
    { name: 'Maya Poluru', load: '4 cases', focus: 'New device fraud', score: '94' },
    { name: 'Arjun Poluru', load: '5 cases', focus: 'Card testing', score: '91' },
    { name: 'Jordan Poluru', load: '3 cases', focus: 'ATO / account takeover', score: '96' }
  ],
  alerts: [
    { id: 'AL-441', title: 'Velocity spike on card 8891', detail: 'Leila Poluru · 11 declines then a $2,400 capture', time: '4 min ago', severity: 'High', tone: 'rose', path: '/cases', assignee: 'Arjun Poluru', channel: 'Card' },
    { id: 'AL-440', title: 'Impossible travel', detail: 'Arjun Poluru · Austin to Lagos in 38 minutes', time: '12 min ago', severity: 'High', tone: 'rose', path: '/cases', assignee: 'Jordan Poluru', channel: 'ATO' },
    { id: 'AL-438', title: 'New device on payroll account', detail: 'Kavya Poluru · first seen from a rooted Android', time: '28 min ago', severity: 'Medium', tone: 'warn', path: '/alerts', assignee: 'Maya Poluru', channel: 'Device' },
    { id: 'AL-436', title: 'Rule pack published', detail: 'Jordan Poluru shipped international wires v3.2', time: '1 hr ago', severity: 'Info', tone: 'info', path: '/rules', assignee: 'Jordan Poluru', channel: 'Wire' },
    { id: 'AL-431', title: 'Chargeback cluster', detail: 'Nimbus Retail · 6 claims linked to Diego Poluru', time: '2 hr ago', severity: 'Medium', tone: 'warn', path: '/cases', assignee: 'Sahana Poluru', channel: 'Card' },
    { id: 'AL-429', title: 'Payroll diversion attempt', detail: 'Omar Poluru · new beneficiary in 11 minutes', time: '3 hr ago', severity: 'High', tone: 'rose', path: '/cases', assignee: 'Aisha Poluru', channel: 'Wire' }
  ],
  cases: [
    { id: 'FR-8821', subject: 'Meera Poluru', type: 'Wire', amount: '$18,400', owner: 'Aisha Poluru', status: 'Blocked', tone: 'ok', opened: 'Today 09:12', aging: '7h', score: 92 },
    { id: 'FR-8818', subject: 'Arjun Poluru', type: 'Device', amount: '$6,220', owner: 'Maya Poluru', status: 'Review', tone: 'warn', opened: 'Today 08:40', aging: '8h', score: 81 },
    { id: 'FR-8814', subject: 'Leila Poluru', type: 'Card testing', amount: '$2,400', owner: 'Arjun Poluru', status: 'Open', tone: 'rose', opened: 'Yesterday', aging: '26h', score: 96 },
    { id: 'FR-8809', subject: 'Diego Poluru', type: 'Chargeback', amount: '$8,110', owner: 'Jordan Poluru', status: 'Open', tone: 'rose', opened: 'Yesterday', aging: '30h', score: 74 },
    { id: 'FR-8801', subject: 'Hana Poluru', type: 'ATO', amount: '$1,050', owner: 'Maya Poluru', status: 'Cleared', tone: 'ok', opened: 'Mon', aging: '—', score: 40 },
    { id: 'FR-8794', subject: 'Elena Poluru', type: 'Wire', amount: '$41,000', owner: 'Aisha Poluru', status: 'Review', tone: 'warn', opened: 'Mon', aging: '2d', score: 88 },
    { id: 'FR-8788', subject: 'Omar Poluru', type: 'Payroll', amount: '$9,750', owner: 'Aisha Poluru', status: 'Open', tone: 'rose', opened: 'Today 11:02', aging: '5h', score: 90 }
  ],
  rules: [
    { name: 'International wire > $10k', owner: 'Aisha Poluru', hits: '48', precision: '98.2%', status: 'Live', tone: 'ok' },
    { name: 'New device + payroll', owner: 'Maya Poluru', hits: '16', precision: '94.1%', status: 'Live', tone: 'ok' },
    { name: 'Card velocity 10 / 5 min', owner: 'Arjun Poluru', hits: '112', precision: '91.0%', status: 'Tuning', tone: 'warn' },
    { name: 'Impossible travel', owner: 'Jordan Poluru', hits: '9', precision: '99.4%', status: 'Live', tone: 'ok' },
    { name: 'Chargeback cluster', owner: 'Sahana Poluru', hits: '7', precision: '88.6%', status: 'Paused', tone: 'rose' },
    { name: 'Payroll beneficiary change', owner: 'Aisha Poluru', hits: '5', precision: '97.8%', status: 'Shadow', tone: 'info' }
  ],
  channels: [
    { label: 'Card', value: 42 },
    { label: 'Wire', value: 28 },
    { label: 'Device', value: 18 },
    { label: 'ATO', value: 12 }
  ],
  watchlist: [
    { label: 'BIN 414720', detail: 'Leila Poluru · 11 hits today', risk: 'High' },
    { label: 'Device droid-9f2', detail: 'Kavya Poluru · rooted Android', risk: 'High' },
    { label: 'IP 102.89.22.14', detail: 'Arjun Poluru · Lagos hop', risk: 'Medium' },
    { label: 'Merchant Nimbus', detail: 'Diego Poluru · chargeback cluster', risk: 'Medium' }
  ],
  onCall: { primary: 'Aisha Poluru', backup: 'Maya Poluru', until: '18:00 CT' },
  audit: [
    { time: '16:12', actor: 'Aisha Poluru', action: 'Blocked FR-8821 wire' },
    { time: '15:48', actor: 'Jordan Poluru', action: 'Published wires v3.2' },
    { time: '14:05', actor: 'Maya Poluru', action: 'Assigned FR-8818 to herself' },
    { time: '12:20', actor: 'Arjun Poluru', action: 'Tuned card velocity window' }
  ],
  timeline: [
    { title: 'Alert raised', detail: 'Velocity + device mismatch', time: '09:12' },
    { title: 'Assigned', detail: 'Aisha Poluru took ownership', time: '09:18' },
    { title: 'Customer contacted', detail: 'Meera Poluru confirmed no travel', time: '10:04' },
    { title: 'Decision', detail: 'Hold placed on remaining $18,400', time: '10:22' }
  ],
  team: [
    { name: 'Aisha Poluru', role: 'Risk lead', shift: 'On call' },
    { name: 'Maya Poluru', role: 'Device fraud', shift: 'Backup' },
    { name: 'Arjun Poluru', role: 'Card testing', shift: 'Day' },
    { name: 'Jordan Poluru', role: 'ATO / travel', shift: 'Day' },
    { name: 'Sahana Poluru', role: 'Chargebacks', shift: 'Off' }
  ],
  settings: [
    {
      group: 'Detection',
      items: [
        { title: 'Auto-block high-risk wires', detail: 'Hold amounts over $10k until an analyst clears them.', enabled: true },
        { title: 'Device fingerprinting', detail: 'Flag rooted or emulator clients on first login.', enabled: true },
        { title: 'Velocity rules', detail: 'Card testing windows of 5 and 15 minutes.', enabled: true }
      ]
    },
    {
      group: 'Notifications',
      items: [
        { title: 'Page Aisha Poluru on critical', detail: 'Pager for High alerts during on-call.', enabled: true },
        { title: 'Slack #risk-ops', detail: 'Post blocked attempts and rule changes.', enabled: true },
        { title: 'Daily digest', detail: 'Open cases for Maya, Arjun, and Jordan Poluru.', enabled: false }
      ]
    },
    {
      group: 'Access',
      items: [
        { title: 'Require dual control on wires > $25k', detail: 'Second reviewer must be Maya or Jordan Poluru.', enabled: true },
        { title: 'Lock cases after 24h idle', detail: 'Return stalled work to the unassigned queue.', enabled: false }
      ]
    }
  ]
};
