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
    { title: 'Velocity spike on card 8891', detail: 'Leila Poluru · 11 declines then a $2,400 capture', time: '4 min ago', severity: 'High', tone: 'rose', path: '/cases' },
    { title: 'Impossible travel', detail: 'Arjun Poluru · Austin to Lagos in 38 minutes', time: '12 min ago', severity: 'High', tone: 'rose', path: '/cases' },
    { title: 'New device on payroll account', detail: 'Kavya Poluru · first seen from a rooted Android', time: '28 min ago', severity: 'Medium', tone: 'warn', path: '/alerts' },
    { title: 'Rule pack published', detail: 'Jordan Poluru shipped international wires v3.2', time: '1 hr ago', severity: 'Info', tone: 'info', path: '/rules' },
    { title: 'Chargeback cluster', detail: 'Nimbus Retail · 6 claims linked to Diego Poluru', time: '2 hr ago', severity: 'Medium', tone: 'warn', path: '/cases' }
  ],
  cases: [
    { id: 'FR-8821', subject: 'Meera Poluru', type: 'Wire', amount: '$18,400', owner: 'Aisha Poluru', status: 'Blocked', tone: 'ok', opened: 'Today 09:12' },
    { id: 'FR-8818', subject: 'Arjun Poluru', type: 'Device', amount: '$6,220', owner: 'Maya Poluru', status: 'Review', tone: 'warn', opened: 'Today 08:40' },
    { id: 'FR-8814', subject: 'Leila Poluru', type: 'Card testing', amount: '$2,400', owner: 'Arjun Poluru', status: 'Open', tone: 'rose', opened: 'Yesterday' },
    { id: 'FR-8809', subject: 'Diego Poluru', type: 'Chargeback', amount: '$8,110', owner: 'Jordan Poluru', status: 'Open', tone: 'rose', opened: 'Yesterday' },
    { id: 'FR-8801', subject: 'Hana Poluru', type: 'ATO', amount: '$1,050', owner: 'Maya Poluru', status: 'Cleared', tone: 'ok', opened: 'Mon' },
    { id: 'FR-8794', subject: 'Elena Poluru', type: 'Wire', amount: '$41,000', owner: 'Aisha Poluru', status: 'Review', tone: 'warn', opened: 'Mon' }
  ],
  rules: [
    { name: 'International wire > $10k', owner: 'Aisha Poluru', hits: '48', precision: '98.2%', status: 'Live', tone: 'ok' },
    { name: 'New device + payroll', owner: 'Maya Poluru', hits: '16', precision: '94.1%', status: 'Live', tone: 'ok' },
    { name: 'Card velocity 10 / 5 min', owner: 'Arjun Poluru', hits: '112', precision: '91.0%', status: 'Tuning', tone: 'warn' },
    { name: 'Impossible travel', owner: 'Jordan Poluru', hits: '9', precision: '99.4%', status: 'Live', tone: 'ok' },
    { name: 'Chargeback cluster', owner: 'Sahana Poluru', hits: '7', precision: '88.6%', status: 'Paused', tone: 'rose' }
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
    }
  ]
};
