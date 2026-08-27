export type NavItem = {
  path: string;
  label: string;
  icon: string;
  exact?: boolean;
};

export const templateConfig = {
  title: 'Review queue',
  eyebrow: 'Quality control',
  summary: 'Route important AI decisions to the right experts and keep every review accountable.',
  action: 'Open queue',
  brand: { mark: 'R', name: 'Review', accent: 'Desk' },
  workspace: 'Review Desk',
  user: { initials: 'AP', name: 'Aisha Poluru', role: 'Review lead' },
  nav: [
    { path: '/', label: 'Queue', icon: 'fact_check', exact: true },
    { path: '/assignments', label: 'Assignments', icon: 'assignment_ind' },
    { path: '/policies', label: 'Policies', icon: 'policy' },
    { path: '/audit', label: 'Audit', icon: 'history' },
    { path: '/settings', label: 'Settings', icon: 'settings' }
  ] as NavItem[],
  metrics: [
    { label: 'Awaiting review', value: '128', trend: '-7.8%', icon: 'fact_check', path: '/assignments' },
    { label: 'Reviewed today', value: '462', trend: '+16%', icon: 'assignment_turned_in', path: '/audit' },
    { label: 'Avg. handling time', value: '4m 18s', trend: '-9%', icon: 'timer', path: '/' },
    { label: 'Reviewer agreement', value: '96.8%', trend: '+1.1%', icon: 'groups', path: '/policies' }
  ],
  activityTitle: 'Queue updates',
  activity: [
    { title: 'Sensitive content assigned', detail: 'Meera Poluru · Policy queue · HR-1104', status: 'Assigned', tone: 'warn', path: '/assignments' },
    { title: 'Decision appeal resolved', detail: 'Arjun Poluru · Case HR-1098', status: 'Complete', tone: 'ok', path: '/audit' },
    { title: 'Calibration published', detail: 'Jordan Poluru · August 2026 cycle', status: 'Ready', tone: 'info', path: '/policies' },
    { title: 'SLA breach risk', detail: 'Leila Poluru · HR-1101 aging 2h 40m', status: 'At risk', tone: 'rose', path: '/assignments' }
  ],
  reviewers: [
    { name: 'Aisha Poluru', load: '12 items', focus: 'Safety / self-harm', score: '99' },
    { name: 'Maya Poluru', load: '9 items', focus: 'PII redaction', score: '97' },
    { name: 'Arjun Poluru', load: '11 items', focus: 'Appeals', score: '95' },
    { name: 'Jordan Poluru', load: '7 items', focus: 'Policy calibration', score: '98' }
  ],
  queue: [
    { id: 'HR-1104', title: 'Sensitive medical claim', detail: 'Meera Poluru · Policy review · model: Atlas 4', time: '4 min ago', severity: 'High', tone: 'rose', queue: 'Safety', assignee: 'Unassigned', sla: '26m left' },
    { id: 'HR-1101', title: 'PII in generated reply', detail: 'Leila Poluru · Support copilot leaked a SSN fragment', time: '12 min ago', severity: 'High', tone: 'rose', queue: 'PII', assignee: 'Maya Poluru', sla: '18m left' },
    { id: 'HR-1098', title: 'Appeal on blocked output', detail: 'Arjun Poluru · User contesting a policy refusal', time: '28 min ago', severity: 'Medium', tone: 'warn', queue: 'Appeals', assignee: 'Arjun Poluru', sla: '1h 12m' },
    { id: 'HR-1094', title: 'Brand voice mismatch', detail: 'Diego Poluru · Sales assistant tone drifted off-policy', time: '41 min ago', severity: 'Low', tone: 'info', queue: 'Quality', assignee: 'Jordan Poluru', sla: '3h' },
    { id: 'HR-1091', title: 'Child-safety classifier miss', detail: 'Kavya Poluru · dual-review required', time: '1 hr ago', severity: 'High', tone: 'rose', queue: 'Safety', assignee: 'Aisha Poluru', sla: '9m left' },
    { id: 'HR-1086', title: 'Hallucinated citation', detail: 'Hana Poluru · RAG answer cited a missing source', time: '2 hr ago', severity: 'Medium', tone: 'warn', queue: 'Quality', assignee: 'Unassigned', sla: '2h 05m' }
  ],
  assignments: [
    { id: 'HR-1104', subject: 'Meera Poluru', queue: 'Safety', owner: 'Unassigned', status: 'Waiting', tone: 'rose', opened: 'Today 09:12', aging: '26m', score: 92 },
    { id: 'HR-1101', subject: 'Leila Poluru', queue: 'PII', owner: 'Maya Poluru', status: 'In review', tone: 'warn', opened: 'Today 08:40', aging: '18m', score: 88 },
    { id: 'HR-1098', subject: 'Arjun Poluru', queue: 'Appeals', owner: 'Arjun Poluru', status: 'In review', tone: 'warn', opened: 'Today 08:11', aging: '1h', score: 71 },
    { id: 'HR-1094', subject: 'Diego Poluru', queue: 'Quality', owner: 'Jordan Poluru', status: 'In review', tone: 'info', opened: 'Yesterday', aging: '3h', score: 54 },
    { id: 'HR-1091', subject: 'Kavya Poluru', queue: 'Safety', owner: 'Aisha Poluru', status: 'Escalated', tone: 'rose', opened: 'Today 07:58', aging: '9m', score: 97 },
    { id: 'HR-1086', subject: 'Hana Poluru', queue: 'Quality', owner: 'Unassigned', status: 'Waiting', tone: 'warn', opened: 'Yesterday', aging: '2h', score: 63 },
    { id: 'HR-1079', subject: 'Elena Poluru', queue: 'Appeals', owner: 'Sahana Poluru', status: 'Resolved', tone: 'ok', opened: 'Mon', aging: '—', score: 40 }
  ],
  policies: [
    { name: 'Self-harm dual review', owner: 'Aisha Poluru', hits: '38', agreement: '99.1%', status: 'Live', tone: 'ok' },
    { name: 'PII redaction before send', owner: 'Maya Poluru', hits: '64', agreement: '97.4%', status: 'Live', tone: 'ok' },
    { name: 'Brand voice check', owner: 'Jordan Poluru', hits: '112', agreement: '91.0%', status: 'Tuning', tone: 'warn' },
    { name: 'Citation required for RAG', owner: 'Arjun Poluru', hits: '22', agreement: '94.8%', status: 'Live', tone: 'ok' },
    { name: 'Child-safety classifier', owner: 'Aisha Poluru', hits: '9', agreement: '99.6%', status: 'Live', tone: 'ok' },
    { name: 'Financial advice block', owner: 'Sahana Poluru', hits: '14', agreement: '88.2%', status: 'Shadow', tone: 'info' }
  ],
  queues: [
    { label: 'Safety', value: 34 },
    { label: 'PII', value: 28 },
    { label: 'Appeals', value: 22 },
    { label: 'Quality', value: 16 }
  ],
  watchlist: [
    { label: 'HR-1091', detail: 'Kavya Poluru · dual-review SLA', risk: 'High' },
    { label: 'Prompt pack v4.2', detail: 'Leila Poluru · PII leaks rising', risk: 'High' },
    { label: 'Appeals cluster', detail: 'Arjun Poluru · 6 related cases', risk: 'Medium' },
    { label: 'Voice model 3.1', detail: 'Diego Poluru · brand drift', risk: 'Medium' }
  ],
  onCall: { primary: 'Aisha Poluru', backup: 'Maya Poluru', until: '18:00 CT' },
  aging: [
    { label: '< 15m', value: 18, tone: 'ok' },
    { label: '15–60m', value: 41, tone: 'info' },
    { label: '1–4h', value: 27, tone: 'warn' },
    { label: '4h+', value: 8, tone: 'rose' }
  ],
  hourly: [
    { hour: '09', reviews: 36 },
    { hour: '10', reviews: 52 },
    { hour: '11', reviews: 61 },
    { hour: '12', reviews: 28 },
    { hour: '13', reviews: 44 },
    { hour: '14', reviews: 71 },
    { hour: '15', reviews: 58 },
    { hour: '16', reviews: 40 }
  ],
  rotation: [
    { name: 'Aisha Poluru', slot: 'Now – 18:00', role: 'Primary' },
    { name: 'Maya Poluru', slot: 'Now – 18:00', role: 'Backup' },
    { name: 'Arjun Poluru', slot: '18:00 – 22:00', role: 'Next' },
    { name: 'Sahana Poluru', slot: '22:00 – 08:00', role: 'Night' }
  ],
  audit: [
    { time: '16:12', actor: 'Aisha Poluru', action: 'Approved HR-1079 appeal' },
    { time: '15:48', actor: 'Jordan Poluru', action: 'Published brand voice v2.1' },
    { time: '14:05', actor: 'Maya Poluru', action: 'Assigned HR-1101 to herself' },
    { time: '12:20', actor: 'Arjun Poluru', action: 'Rejected hallucinated citation' },
    { time: '11:04', actor: 'Sahana Poluru', action: 'Escalated HR-1091 to dual review' },
    { time: '09:18', actor: 'Aisha Poluru', action: 'Took Safety queue on call' }
  ],
  timeline: [
    { title: 'Item raised', detail: 'Safety classifier score 0.92', time: '09:12' },
    { title: 'Assigned', detail: 'Aisha Poluru took ownership', time: '09:18' },
    { title: 'Second reviewer', detail: 'Maya Poluru added for dual control', time: '09:26' },
    { title: 'Decision', detail: 'Held for policy rewrite', time: '09:41' }
  ],
  team: [
    { name: 'Aisha Poluru', role: 'Review lead', shift: 'On call' },
    { name: 'Maya Poluru', role: 'PII / privacy', shift: 'Backup' },
    { name: 'Arjun Poluru', role: 'Appeals', shift: 'Day' },
    { name: 'Jordan Poluru', role: 'Quality / voice', shift: 'Day' },
    { name: 'Sahana Poluru', role: 'Safety dual-review', shift: 'Off' }
  ],
  settings: [
    {
      group: 'Routing',
      items: [
        { title: 'Auto-assign Safety to Aisha Poluru', detail: 'High-severity Safety items skip the unassigned pile.', enabled: true },
        { title: 'Dual review on child-safety', detail: 'Second reviewer must be Maya or Sahana Poluru.', enabled: true },
        { title: 'Round-robin Quality queue', detail: 'Spread brand and citation work across Jordan and Arjun Poluru.', enabled: true }
      ]
    },
    {
      group: 'Notifications',
      items: [
        { title: 'Page Aisha Poluru on High SLA', detail: 'Pager when remaining SLA drops under 15 minutes.', enabled: true },
        { title: 'Slack #review-desk', detail: 'Post assignments, escalations, and policy changes.', enabled: true },
        { title: 'Daily digest', detail: 'Open items for Maya, Arjun, and Jordan Poluru.', enabled: false }
      ]
    },
    {
      group: 'Access',
      items: [
        { title: 'Lock items after 2h idle', detail: 'Return stalled work to the unassigned queue.', enabled: false },
        { title: 'Require note on Reject', detail: 'Reviewers must leave a reason before closing.', enabled: true }
      ]
    }
  ]
};
