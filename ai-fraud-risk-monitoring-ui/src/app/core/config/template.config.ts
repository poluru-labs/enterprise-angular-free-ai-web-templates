export type NavItem = {
  path: string;
  label: string;
  icon: string;
  exact?: boolean;
  badge?: number;
};

export type Tone = 'ok' | 'warn' | 'rose' | 'info';

export const templateConfig = {
  title: 'Fraud risk monitor',
  eyebrow: 'Risk intelligence',
  summary:
    'Surface suspicious activity early, prioritize investigation queues, and watch model coverage in one place.',
  action: 'Review alerts',
  brand: { mark: 'R', name: 'Risk', accent: 'Watch' },
  workspace: 'Risk Watch · North America',
  user: { initials: 'AP', name: 'Aisha Poluru', role: 'Risk lead' },
  navGroups: [
    {
      label: 'Monitor',
      items: [
        { path: '/', label: 'Monitor', icon: 'shield', exact: true },
        { path: '/alerts', label: 'Alerts', icon: 'warning', badge: 6 },
        { path: '/reports', label: 'Reports', icon: 'monitoring' }
      ]
    },
    {
      label: 'Investigate',
      items: [
        { path: '/cases', label: 'Cases', icon: 'folder_open' },
        { path: '/watchlist', label: 'Watchlist', icon: 'visibility' },
        { path: '/rules', label: 'Rules', icon: 'rule' }
      ]
    }
  ] as { label: string; items: NavItem[] }[],
  metrics: [
    { label: 'Protected volume', value: '$4.28M', trend: '+9.6%', icon: 'shield', path: '/cases' },
    { label: 'Risk alerts', value: '42', trend: '-13%', icon: 'warning', path: '/alerts' },
    { label: 'Blocked attempts', value: '186', trend: '+21%', icon: 'block', path: '/cases' },
    { label: 'Model precision', value: '97.1%', trend: '+0.9%', icon: 'security', path: '/rules' }
  ],
  metricsByPeriod: {
    Today: [
      { label: 'Protected volume', value: '$612k', trend: '+4.1%', icon: 'shield', path: '/cases' },
      { label: 'Risk alerts', value: '9', trend: '-2', icon: 'warning', path: '/alerts' },
      { label: 'Blocked attempts', value: '22', trend: '+6', icon: 'block', path: '/cases' },
      { label: 'Model precision', value: '97.4%', trend: '+0.2%', icon: 'security', path: '/rules' }
    ],
    '7d': [
      { label: 'Protected volume', value: '$4.28M', trend: '+9.6%', icon: 'shield', path: '/cases' },
      { label: 'Risk alerts', value: '42', trend: '-13%', icon: 'warning', path: '/alerts' },
      { label: 'Blocked attempts', value: '186', trend: '+21%', icon: 'block', path: '/cases' },
      { label: 'Model precision', value: '97.1%', trend: '+0.9%', icon: 'security', path: '/rules' }
    ],
    '30d': [
      { label: 'Protected volume', value: '$17.4M', trend: '+12.8%', icon: 'shield', path: '/cases' },
      { label: 'Risk alerts', value: '168', trend: '-8%', icon: 'warning', path: '/alerts' },
      { label: 'Blocked attempts', value: '741', trend: '+18%', icon: 'block', path: '/cases' },
      { label: 'Model precision', value: '96.8%', trend: '+1.4%', icon: 'security', path: '/rules' }
    ]
  },
  activityTitle: 'Live risk activity',
  activity: [
    { title: 'High-risk transfer contained', detail: 'Meera Poluru · Case FR-8821 · $18,400', status: 'Blocked', tone: 'ok' as Tone, path: '/cases', time: '7 min ago' },
    { title: 'New device anomaly', detail: 'Arjun Poluru · account 1842 · Lagos IP', status: 'Review', tone: 'warn' as Tone, path: '/alerts', time: '12 min ago' },
    { title: 'Velocity rule fired', detail: 'Leila Poluru · 11 card attempts in 4 min', status: 'Open', tone: 'rose' as Tone, path: '/alerts', time: '18 min ago' },
    { title: 'Watchlist freeze', detail: 'BIN 414720 frozen by Maya Poluru', status: 'Frozen', tone: 'ok' as Tone, path: '/watchlist', time: '41 min ago' },
    { title: 'Rule pack updated', detail: 'Jordan Poluru · international wires v3.2', status: 'Updated', tone: 'info' as Tone, path: '/rules', time: '1 hr ago' },
    { title: 'SAR draft queued', detail: 'Elena Poluru wire cluster · $41,000', status: 'Filing', tone: 'warn' as Tone, path: '/reports', time: '2 hr ago' }
  ],
  investigators: [
    { name: 'Aisha Poluru', load: '6 cases', focus: 'Wires over $10k', score: '98', shift: 'On call' },
    { name: 'Maya Poluru', load: '4 cases', focus: 'New device fraud', score: '94', shift: 'Backup' },
    { name: 'Arjun Poluru', load: '5 cases', focus: 'Card testing', score: '91', shift: 'Day' },
    { name: 'Jordan Poluru', load: '3 cases', focus: 'ATO / account takeover', score: '96', shift: 'Day' },
    { name: 'Sahana Poluru', load: '2 cases', focus: 'Chargeback clusters', score: '89', shift: 'Off' }
  ],
  alerts: [
    { id: 'AL-441', title: 'Velocity spike on card 8891', detail: 'Leila Poluru · 11 declines then a $2,400 capture', time: '4 min ago', severity: 'High', tone: 'rose' as Tone, path: '/cases', assignee: 'Arjun Poluru', channel: 'Card', ageMinutes: 4 },
    { id: 'AL-440', title: 'Impossible travel', detail: 'Arjun Poluru · Austin to Lagos in 38 minutes', time: '12 min ago', severity: 'High', tone: 'rose' as Tone, path: '/cases', assignee: 'Jordan Poluru', channel: 'ATO', ageMinutes: 12 },
    { id: 'AL-438', title: 'New device on payroll account', detail: 'Kavya Poluru · first seen from a rooted Android', time: '28 min ago', severity: 'Medium', tone: 'warn' as Tone, path: '/alerts', assignee: 'Maya Poluru', channel: 'Device', ageMinutes: 28 },
    { id: 'AL-436', title: 'Rule pack published', detail: 'Jordan Poluru shipped international wires v3.2', time: '1 hr ago', severity: 'Info', tone: 'info' as Tone, path: '/rules', assignee: 'Jordan Poluru', channel: 'Wire', ageMinutes: 60 },
    { id: 'AL-431', title: 'Chargeback cluster', detail: 'Nimbus Retail · 6 claims linked to Diego Poluru', time: '2 hr ago', severity: 'Medium', tone: 'warn' as Tone, path: '/cases', assignee: 'Sahana Poluru', channel: 'Card', ageMinutes: 120 },
    { id: 'AL-429', title: 'Payroll diversion attempt', detail: 'Omar Poluru · new beneficiary in 11 minutes', time: '3 hr ago', severity: 'High', tone: 'rose' as Tone, path: '/cases', assignee: 'Aisha Poluru', channel: 'Wire', ageMinutes: 180 },
    { id: 'AL-427', title: 'Merchant mule pattern', detail: 'Hana Poluru · 4 new MIDs in 90 minutes', time: '4 hr ago', severity: 'Medium', tone: 'warn' as Tone, path: '/watchlist', assignee: 'Maya Poluru', channel: 'Card', ageMinutes: 240 },
    { id: 'AL-422', title: 'Shadow rule hit', detail: 'Payroll beneficiary change · $9,750', time: '5 hr ago', severity: 'Info', tone: 'info' as Tone, path: '/rules', assignee: 'Aisha Poluru', channel: 'Wire', ageMinutes: 300 }
  ],
  cases: [
    { id: 'FR-8821', subject: 'Meera Poluru', type: 'Wire', amount: '$18,400', owner: 'Aisha Poluru', status: 'Blocked', tone: 'ok' as Tone, opened: 'Today 09:12', aging: '7h', score: 92 },
    { id: 'FR-8818', subject: 'Arjun Poluru', type: 'Device', amount: '$6,220', owner: 'Maya Poluru', status: 'Review', tone: 'warn' as Tone, opened: 'Today 08:40', aging: '8h', score: 81 },
    { id: 'FR-8814', subject: 'Leila Poluru', type: 'Card testing', amount: '$2,400', owner: 'Arjun Poluru', status: 'Open', tone: 'rose' as Tone, opened: 'Yesterday', aging: '26h', score: 96 },
    { id: 'FR-8809', subject: 'Diego Poluru', type: 'Chargeback', amount: '$8,110', owner: 'Jordan Poluru', status: 'Open', tone: 'rose' as Tone, opened: 'Yesterday', aging: '30h', score: 74 },
    { id: 'FR-8801', subject: 'Hana Poluru', type: 'ATO', amount: '$1,050', owner: 'Maya Poluru', status: 'Cleared', tone: 'ok' as Tone, opened: 'Mon', aging: '—', score: 40 },
    { id: 'FR-8794', subject: 'Elena Poluru', type: 'Wire', amount: '$41,000', owner: 'Aisha Poluru', status: 'Review', tone: 'warn' as Tone, opened: 'Mon', aging: '2d', score: 88 },
    { id: 'FR-8788', subject: 'Omar Poluru', type: 'Payroll', amount: '$9,750', owner: 'Aisha Poluru', status: 'Open', tone: 'rose' as Tone, opened: 'Today 11:02', aging: '5h', score: 90 },
    { id: 'FR-8782', subject: 'Kavya Poluru', type: 'Device', amount: '$3,180', owner: 'Maya Poluru', status: 'Review', tone: 'warn' as Tone, opened: 'Today 07:18', aging: '9h', score: 77 },
    { id: 'FR-8776', subject: 'Sam Poluru', type: 'ATO', amount: '$14,900', owner: 'Jordan Poluru', status: 'Open', tone: 'rose' as Tone, opened: 'Sun', aging: '3d', score: 93 }
  ],
  rules: [
    { name: 'International wire > $10k', owner: 'Aisha Poluru', hits: '48', precision: '98.2%', status: 'Live', tone: 'ok' as Tone },
    { name: 'New device + payroll', owner: 'Maya Poluru', hits: '16', precision: '94.1%', status: 'Live', tone: 'ok' as Tone },
    { name: 'Card velocity 10 / 5 min', owner: 'Arjun Poluru', hits: '112', precision: '91.0%', status: 'Tuning', tone: 'warn' as Tone },
    { name: 'Impossible travel', owner: 'Jordan Poluru', hits: '9', precision: '99.4%', status: 'Live', tone: 'ok' as Tone },
    { name: 'Chargeback cluster', owner: 'Sahana Poluru', hits: '7', precision: '88.6%', status: 'Paused', tone: 'rose' as Tone },
    { name: 'Payroll beneficiary change', owner: 'Aisha Poluru', hits: '5', precision: '97.8%', status: 'Shadow', tone: 'info' as Tone },
    { name: 'BIN 414720 freeze', owner: 'Maya Poluru', hits: '11', precision: '99.1%', status: 'Live', tone: 'ok' as Tone },
    { name: 'Mule MID burst', owner: 'Arjun Poluru', hits: '4', precision: '86.2%', status: 'Shadow', tone: 'info' as Tone }
  ],
  channels: [
    { label: 'Card', value: 42 },
    { label: 'Wire', value: 28 },
    { label: 'Device', value: 18 },
    { label: 'ATO', value: 12 }
  ],
  coverage: { score: '97.1%', blocked: 186, falsePositives: '2.9%' },
  watchlist: [
    { id: 'WL-12', label: 'BIN 414720', detail: 'Leila Poluru · 11 hits today', risk: 'High', status: 'Frozen', hits: 11, added: 'Today 08:14' },
    { id: 'WL-11', label: 'Device droid-9f2', detail: 'Kavya Poluru · rooted Android', risk: 'High', status: 'Frozen', hits: 6, added: 'Today 07:40' },
    { id: 'WL-09', label: 'IP 102.89.22.14', detail: 'Arjun Poluru · Lagos hop', risk: 'Medium', status: 'Watch', hits: 3, added: 'Yesterday' },
    { id: 'WL-08', label: 'Merchant Nimbus', detail: 'Diego Poluru · chargeback cluster', risk: 'Medium', status: 'Watch', hits: 6, added: 'Mon' },
    { id: 'WL-06', label: 'Beneficiary ACCT-9912', detail: 'Omar Poluru · payroll diversion', risk: 'High', status: 'Frozen', hits: 2, added: 'Today 11:08' },
    { id: 'WL-04', label: 'Device ios-3c8', detail: 'Sam Poluru · emulator fingerprint', risk: 'Medium', status: 'Watch', hits: 4, added: 'Sun' }
  ],
  reports: [
    { id: 'RPT-091', title: 'Daily risk digest', owner: 'Aisha Poluru', period: 'Today', status: 'Ready', tone: 'ok' as Tone, findings: 12, summary: '22 blocks, 9 open alerts, BIN 414720 still the loudest card cluster.' },
    { id: 'RPT-088', title: 'Wire SAR package', owner: 'Aisha Poluru', period: '7d', status: 'Draft', tone: 'warn' as Tone, findings: 3, summary: 'Elena Poluru and Meera Poluru wires share a beneficiary corridor through FR-8794.' },
    { id: 'RPT-084', title: 'Card testing weekly', owner: 'Arjun Poluru', period: '7d', status: 'Ready', tone: 'ok' as Tone, findings: 18, summary: 'Velocity pack caught 112 hits. Precision dipped to 91% — keep it in Tuning.' },
    { id: 'RPT-079', title: 'ATO travel review', owner: 'Jordan Poluru', period: '30d', status: 'Filed', tone: 'info' as Tone, findings: 9, summary: 'Impossible travel held 99.4% precision. Two Austin-Lagos hops remain in review.' },
    { id: 'RPT-071', title: 'Chargeback merchant memo', owner: 'Sahana Poluru', period: '30d', status: 'Queued', tone: 'warn' as Tone, findings: 6, summary: 'Nimbus Retail still clustering on Diego Poluru. Freeze stays on the watchlist.' }
  ],
  models: [
    { name: 'Card velocity v4', auc: '0.981', drift: 'Stable', owner: 'Arjun Poluru' },
    { name: 'Wire graph v3.2', auc: '0.974', drift: 'Watch', owner: 'Aisha Poluru' },
    { name: 'Device reputation', auc: '0.966', drift: 'Stable', owner: 'Maya Poluru' }
  ],
  onCall: { primary: 'Aisha Poluru', backup: 'Maya Poluru', until: '18:00 CT' },
  audit: [
    { time: '16:12', actor: 'Aisha Poluru', action: 'Blocked FR-8821 wire' },
    { time: '15:48', actor: 'Jordan Poluru', action: 'Published wires v3.2' },
    { time: '14:05', actor: 'Maya Poluru', action: 'Assigned FR-8818 to herself' },
    { time: '12:20', actor: 'Arjun Poluru', action: 'Tuned card velocity window' },
    { time: '11:08', actor: 'Aisha Poluru', action: 'Froze beneficiary ACCT-9912' },
    { time: '09:40', actor: 'Sahana Poluru', action: 'Queued Nimbus merchant memo' }
  ],
  timeline: [
    { title: 'Alert raised', detail: 'Velocity + device mismatch', time: '09:12' },
    { title: 'Assigned', detail: 'Aisha Poluru took ownership', time: '09:18' },
    { title: 'Customer contacted', detail: 'Meera Poluru confirmed no travel', time: '10:04' },
    { title: 'Watchlist updated', detail: 'Corridor counterpart added to freeze list', time: '10:16' },
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
        { title: 'Velocity rules', detail: 'Card testing windows of 5 and 15 minutes.', enabled: true },
        { title: 'Shadow new packs for 24h', detail: 'Promote only after Jordan Poluru reviews precision.', enabled: true }
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
        { title: 'Lock cases after 24h idle', detail: 'Return stalled work to the unassigned queue.', enabled: false },
        { title: 'Mask full PANs in the queue', detail: 'Show last four only outside a taken case.', enabled: true }
      ]
    }
  ]
};
