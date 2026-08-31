export type NavItem = {
  path: string;
  label: string;
  icon: string;
  exact?: boolean;
};

export const templateConfig = {
  title: 'Sales assistant',
  eyebrow: 'Revenue intelligence',
  summary: 'Equip sellers with AI-generated next steps, account research, and pipeline signals.',
  action: 'Create brief',
  brand: { mark: 'G', name: 'Poluru Revenue', accent: 'Garnet Close' },
  workspace: 'FY26 Q3 · Enterprise',
  user: { initials: 'AP', name: 'Ananya Poluru', role: 'Revenue lead' },
  nav: [
    { path: '/', label: 'Overview', icon: 'dashboard', exact: true },
    { path: '/accounts', label: 'Accounts', icon: 'apartment' },
    { path: '/signals', label: 'Signals', icon: 'sensors' },
    { path: '/sequences', label: 'Sequences', icon: 'conversion_path' },
    { path: '/settings', label: 'Settings', icon: 'tune' }
  ] as NavItem[],
  metrics: [
    { label: 'Qualified pipeline', value: '$1.84M', trend: '+14.2%', trendDir: 'up' as const, hint: 'this week' },
    { label: 'Accounts researched', value: '96', trend: '+12', trendDir: 'up' as const, hint: 'briefs ready' },
    { label: 'Next best actions', value: '48', trend: '+8', trendDir: 'up' as const, hint: 'open tasks' },
    { label: 'Meeting prep ready', value: '27', trend: '+5', trendDir: 'up' as const, hint: 'this week' }
  ],
  alerts: [
    {
      heading: 'Brightside Health is showing expansion intent',
      content: 'Rohan Poluru’s AE brief flagged three new buying-committee members. Sequence “Clinic expansion” is queued for review.'
    },
    {
      heading: 'Northstar renewal risk is still low',
      content: 'Kavya Poluru confirmed usage is up 18%. Meeting prep for Thursday is ready with competitive notes.'
    },
    {
      heading: 'Harborline Retail needs a follow-up',
      content: 'Nikhil Poluru’s SDR sequence stalled after step 3. AI suggests a short champion recap instead of another demo.'
    }
  ],
  activity: [
    { title: 'Northstar account brief ready', detail: 'Renewal risk: low · Kavya Poluru', status: 'Ready', time: '8 min ago' },
    { title: 'Expansion signal detected', detail: 'Brightside Health · Rohan Poluru', status: 'New', time: '22 min ago' },
    { title: 'Follow-up sequence suggested', detail: 'Opportunity: Alpha · Nikhil Poluru', status: 'Review', time: '41 min ago' },
    { title: 'Meeting prep packed', detail: 'Helix Logistics · Meera Poluru', status: 'Ready', time: '1 hr ago' },
    { title: 'Champion mapped', detail: 'Lumen Labs · Sravani Poluru', status: 'Active', time: 'Yesterday' }
  ],
  accounts: [
    { name: 'Northstar Analytics', owner: 'Kavya Poluru', stage: 'Renewal', pipeline: '$420K', risk: 'Low', brief: 'Ready', next: 'QBRs Thu' },
    { name: 'Brightside Health', owner: 'Rohan Poluru', stage: 'Expansion', pipeline: '$310K', risk: 'Watch', brief: 'Ready', next: 'Champion recap' },
    { name: 'Helix Logistics', owner: 'Meera Poluru', stage: 'Negotiate', pipeline: '$265K', risk: 'Low', brief: 'Ready', next: 'Legal review' },
    { name: 'Harborline Retail', owner: 'Nikhil Poluru', stage: 'Qualify', pipeline: '$180K', risk: 'Watch', brief: 'Draft', next: 'Follow-up' },
    { name: 'Atlas Freight', owner: 'Arjun Poluru', stage: 'Discover', pipeline: '$155K', risk: 'Low', brief: 'Ready', next: 'Discovery call' },
    { name: 'Lumen Labs', owner: 'Sravani Poluru', stage: 'Expand', pipeline: '$240K', risk: 'Low', brief: 'Ready', next: 'Success plan' },
    { name: 'Coral Bay Clinics', owner: 'Hana Poluru', stage: 'Propose', pipeline: '$198K', risk: 'Watch', brief: 'Draft', next: 'Proposal tweak' },
    { name: 'Summit Pay', owner: 'Venkata Poluru', stage: 'Closed won', pipeline: '$72K', risk: 'Low', brief: 'Ready', next: 'Handoff' }
  ],
  signals: [
    {
      title: 'Expansion intent',
      detail: 'Three new stakeholders joined the Brightside buying group this week.',
      owner: 'Rohan Poluru',
      status: 'New',
      type: 'Expansion',
      account: 'Brightside Health'
    },
    {
      title: 'Renewal confidence',
      detail: 'Northstar product usage is up 18% versus last quarter.',
      owner: 'Kavya Poluru',
      status: 'Ready',
      type: 'Renewal',
      account: 'Northstar Analytics'
    },
    {
      title: 'Sequence stall',
      detail: 'Harborline went quiet after the third email in Alpha.',
      owner: 'Nikhil Poluru',
      status: 'Review',
      type: 'Outreach',
      account: 'Harborline Retail'
    },
    {
      title: 'Legal friction',
      detail: 'Helix redlines are concentrated in data residency language.',
      owner: 'Meera Poluru',
      status: 'Watch',
      type: 'Deal risk',
      account: 'Helix Logistics'
    },
    {
      title: 'Champion mapped',
      detail: 'Lumen Labs named a new VP of Operations as economic buyer.',
      owner: 'Sravani Poluru',
      status: 'Active',
      type: 'Research',
      account: 'Lumen Labs'
    },
    {
      title: 'Proposal gap',
      detail: 'Coral Bay asked for a lighter implementation plan.',
      owner: 'Hana Poluru',
      status: 'Review',
      type: 'Outreach',
      account: 'Coral Bay Clinics'
    }
  ],
  sequences: [
    { name: 'Clinic expansion', owner: 'Rohan Poluru', steps: 6, done: 4, status: 'Active', audience: 'Health systems' },
    { name: 'Renewal QBR', owner: 'Kavya Poluru', steps: 4, done: 3, status: 'Active', audience: 'Enterprise' },
    { name: 'Alpha outbound', owner: 'Nikhil Poluru', steps: 5, done: 3, status: 'Watch', audience: 'Retail' },
    { name: 'Legal close', owner: 'Meera Poluru', steps: 3, done: 2, status: 'Review', audience: 'Logistics' },
    { name: 'Success plan', owner: 'Sravani Poluru', steps: 5, done: 5, status: 'Ready', audience: 'Expansion' }
  ],
  pipeline: [
    { day: 'Mon', value: 42, item: 'Northstar QBR packed · Kavya Poluru', coverage: 88 },
    { day: 'Tue', value: 61, item: 'Brightside expansion brief · Rohan Poluru', coverage: 74 },
    { day: 'Wed', value: 84, item: 'Helix legal review · Meera Poluru', coverage: 69 },
    { day: 'Thu', value: 71, item: 'Harborline follow-up · Nikhil Poluru', coverage: 52 },
    { day: 'Fri', value: 55, item: 'Lumen champion map · Sravani Poluru', coverage: 81 }
  ],
  hourly: [
    { hour: '9a', value: 34 },
    { hour: '10', value: 58 },
    { hour: '11', value: 82 },
    { hour: '12', value: 47 },
    { hour: '1p', value: 66 },
    { hour: '2p', value: 94 },
    { hour: '3p', value: 77 },
    { hour: '4p', value: 51 }
  ],
  owners: [
    { name: 'Kavya Poluru', focus: 'Renewals', load: 86 },
    { name: 'Rohan Poluru', focus: 'Expansion', load: 78 },
    { name: 'Nikhil Poluru', focus: 'Outbound', load: 64 },
    { name: 'Meera Poluru', focus: 'Late stage', load: 71 }
  ],
  sla: [
    { label: 'Brief freshness', value: 92 },
    { label: 'Meeting prep SLA', value: 88 },
    { label: 'Sequence coverage', value: 76 }
  ],
  briefs: ['Account research', 'Meeting prep', 'Competitive take', 'Renewal risk'],
  stages: ['Discover', 'Qualify', 'Propose', 'Negotiate', 'Closed']
};
