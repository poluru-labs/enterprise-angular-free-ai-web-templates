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

export type AccountRow = {
  name: string;
  owner: string;
  stage: string;
  pipeline: string;
  amount: number;
  risk: 'Low' | 'Watch' | 'High';
  brief: 'Ready' | 'Draft' | 'Stale';
  next: string;
  detail: string;
  region: string;
};

export type SignalRow = {
  title: string;
  detail: string;
  owner: string;
  status: 'New' | 'Ready' | 'Review' | 'Watch' | 'Active';
  type: 'Expansion' | 'Renewal' | 'Outreach' | 'Deal risk' | 'Research';
  account: string;
};

export type SequenceRow = {
  name: string;
  owner: string;
  steps: number;
  done: number;
  status: 'Active' | 'Watch' | 'Review' | 'Ready';
  audience: string;
  detail: string;
};

export type MeetingRow = {
  id: string;
  account: string;
  owner: string;
  when: string;
  type: 'QBR' | 'Discovery' | 'Proposal' | 'Legal' | 'Champion';
  status: 'Ready' | 'Draft' | 'Watch';
  attendees: number;
  detail: string;
};

export type ForecastRow = {
  name: string;
  owner: string;
  commit: string;
  upside: string;
  coverage: number;
  status: 'Commit' | 'Upside' | 'At risk';
  detail: string;
};

export const templateConfig = {
  title: 'Sales assistant',
  eyebrow: 'Revenue intelligence',
  summary: 'Equip sellers with AI-generated next steps, account research, and pipeline signals.',
  action: 'Create brief',
  brand: { mark: 'G', name: 'Garnet Close', accent: 'Garnet Close' },
  workspace: 'FY26 Q3 · Enterprise',
  environment: 'Production',
  crmLabel: 'Salesforce live',
  qualityLabel: '$1.84M pipeline',
  user: { initials: 'AP', name: 'Ananya Poluru', role: 'Revenue lead' },
  nav: [
    { path: '/', label: 'Overview', icon: 'dashboard', exact: true },
    { path: '/accounts', label: 'Accounts', icon: 'apartment' },
    { path: '/signals', label: 'Signals', icon: 'sensors' },
    { path: '/sequences', label: 'Sequences', icon: 'conversion_path' },
    { path: '/meetings', label: 'Meetings', icon: 'event' },
    { path: '/forecasts', label: 'Forecasts', icon: 'trending_up' },
    { path: '/settings', label: 'Settings', icon: 'tune' }
  ] as NavItem[],
  metrics: [
    { label: 'Qualified pipeline', value: '$1.84M', trend: '+14.2%', trendDir: 'up' as const, hint: 'this week' },
    { label: 'Accounts researched', value: '96', trend: '+12', trendDir: 'up' as const, hint: 'briefs ready' },
    { label: 'Next best actions', value: '48', trend: '+8', trendDir: 'up' as const, hint: 'open tasks' },
    { label: 'Meeting prep ready', value: '27', trend: '+5', trendDir: 'up' as const, hint: 'this week' }
  ] as Metric[],
  metricsByPeriod: {
    day: [
      { label: 'Qualified pipeline', value: '$284K', trend: '+6.1%', trendDir: 'up' as const, hint: 'today' },
      { label: 'Accounts researched', value: '18', trend: '+3', trendDir: 'up' as const, hint: 'briefs ready' },
      { label: 'Next best actions', value: '11', trend: '-2', trendDir: 'down' as const, hint: 'open tasks' },
      { label: 'Meeting prep ready', value: '6', trend: '+2', trendDir: 'up' as const, hint: 'today' }
    ],
    week: [
      { label: 'Qualified pipeline', value: '$1.84M', trend: '+14.2%', trendDir: 'up' as const, hint: 'this week' },
      { label: 'Accounts researched', value: '96', trend: '+12', trendDir: 'up' as const, hint: 'briefs ready' },
      { label: 'Next best actions', value: '48', trend: '+8', trendDir: 'up' as const, hint: 'open tasks' },
      { label: 'Meeting prep ready', value: '27', trend: '+5', trendDir: 'up' as const, hint: 'this week' }
    ],
    month: [
      { label: 'Qualified pipeline', value: '$6.12M', trend: '+18.4%', trendDir: 'up' as const, hint: 'this month' },
      { label: 'Accounts researched', value: '312', trend: '+41', trendDir: 'up' as const, hint: 'briefs ready' },
      { label: 'Next best actions', value: '164', trend: '+22', trendDir: 'up' as const, hint: 'open tasks' },
      { label: 'Meeting prep ready', value: '88', trend: '+14', trendDir: 'up' as const, hint: 'this month' }
    ]
  } as Record<'day' | 'week' | 'month', Metric[]>,
  alerts: [
    {
      heading: 'Brightside Health is showing expansion intent',
      content:
        'Rohan Poluru’s AE brief flagged three new buying-committee members. Sequence “Clinic expansion” is queued for review.'
    },
    {
      heading: 'Northstar renewal risk is still low',
      content: 'Kavya Poluru confirmed usage is up 18%. Meeting prep for Thursday’s QBR is ready with competitive notes.'
    },
    {
      heading: 'Harborline Retail needs a follow-up',
      content: 'Nikhil Poluru’s SDR sequence stalled after step 3. AI suggests a short champion recap instead of another demo.'
    },
    {
      heading: 'Helix legal language is blocking close',
      content: 'Meera Poluru’s redlines concentrate on data residency. Forecast coverage drops 8 pts if this slips a week.'
    }
  ],
  activity: [
    { title: 'Northstar account brief ready', detail: 'Renewal risk: low · Kavya Poluru', status: 'Ready', time: '8 min ago' },
    { title: 'Expansion signal detected', detail: 'Brightside Health · Rohan Poluru', status: 'New', time: '22 min ago' },
    { title: 'Follow-up sequence suggested', detail: 'Opportunity: Alpha · Nikhil Poluru', status: 'Review', time: '41 min ago' },
    { title: 'Meeting prep packed', detail: 'Helix Logistics · Meera Poluru', status: 'Ready', time: '1 hr ago' },
    { title: 'Champion mapped', detail: 'Lumen Labs · Sravani Poluru', status: 'Active', time: 'Yesterday' },
    { title: 'Forecast commit updated', detail: 'Enterprise book · Ananya Poluru', status: 'Ready', time: 'Yesterday' },
    { title: 'Proposal gap flagged', detail: 'Coral Bay Clinics · Hana Poluru', status: 'Watch', time: '2 days ago' }
  ],
  accounts: [
    {
      name: 'Northstar Analytics',
      owner: 'Kavya Poluru',
      stage: 'Renewal',
      pipeline: '$420K',
      amount: 420000,
      risk: 'Low',
      brief: 'Ready',
      next: 'QBRs Thu',
      detail: 'Usage is up 18%. QBR deck includes competitive notes versus Metricly.',
      region: 'West'
    },
    {
      name: 'Brightside Health',
      owner: 'Rohan Poluru',
      stage: 'Expansion',
      pipeline: '$310K',
      amount: 310000,
      risk: 'Watch',
      brief: 'Ready',
      next: 'Champion recap',
      detail: 'Three new buying-committee members joined this week. Clinic expansion sequence is queued.',
      region: 'Central'
    },
    {
      name: 'Helix Logistics',
      owner: 'Meera Poluru',
      stage: 'Negotiate',
      pipeline: '$265K',
      amount: 265000,
      risk: 'Low',
      brief: 'Ready',
      next: 'Legal review',
      detail: 'Redlines concentrate on data residency. Legal close cadence is on step 2 of 3.',
      region: 'East'
    },
    {
      name: 'Harborline Retail',
      owner: 'Nikhil Poluru',
      stage: 'Qualify',
      pipeline: '$180K',
      amount: 180000,
      risk: 'Watch',
      brief: 'Draft',
      next: 'Follow-up',
      detail: 'Alpha outbound stalled after step 3. Champion recap is the suggested next action.',
      region: 'East'
    },
    {
      name: 'Atlas Freight',
      owner: 'Arjun Poluru',
      stage: 'Discover',
      pipeline: '$155K',
      amount: 155000,
      risk: 'Low',
      brief: 'Ready',
      next: 'Discovery call',
      detail: 'Ops buyer confirmed a 90-day evaluation. Discovery call is booked for Tuesday.',
      region: 'West'
    },
    {
      name: 'Lumen Labs',
      owner: 'Sravani Poluru',
      stage: 'Expand',
      pipeline: '$240K',
      amount: 240000,
      risk: 'Low',
      brief: 'Ready',
      next: 'Success plan',
      detail: 'New VP of Operations is the economic buyer. Success-plan sequence is complete.',
      region: 'Central'
    },
    {
      name: 'Coral Bay Clinics',
      owner: 'Hana Poluru',
      stage: 'Propose',
      pipeline: '$198K',
      amount: 198000,
      risk: 'Watch',
      brief: 'Draft',
      next: 'Proposal tweak',
      detail: 'Asked for a lighter implementation plan. Proposal pack still needs Ananya Poluru’s review.',
      region: 'South'
    },
    {
      name: 'Summit Pay',
      owner: 'Venkata Poluru',
      stage: 'Closed won',
      pipeline: '$72K',
      amount: 72000,
      risk: 'Low',
      brief: 'Ready',
      next: 'Handoff',
      detail: 'Won last Friday. CS handoff brief is packed for Priya Poluru.',
      region: 'East'
    },
    {
      name: 'Rivermark Banks',
      owner: 'Lakshmi Poluru',
      stage: 'Negotiate',
      pipeline: '$288K',
      amount: 288000,
      risk: 'Watch',
      brief: 'Ready',
      next: 'Security review',
      detail: 'SOC2 questionnaire is in flight. Security review is the only remaining blocker.',
      region: 'West'
    },
    {
      name: 'Pinecrest Media',
      owner: 'Priya Poluru',
      stage: 'Qualify',
      pipeline: '$134K',
      amount: 134000,
      risk: 'Low',
      brief: 'Draft',
      next: 'Demo recap',
      detail: 'First demo landed. Recap sequence should go out before Friday.',
      region: 'South'
    },
    {
      name: 'Oakline Energy',
      owner: 'Ramesh Poluru',
      stage: 'Discover',
      pipeline: '$210K',
      amount: 210000,
      risk: 'High',
      brief: 'Stale',
      next: 'Re-engage',
      detail: 'Champion left the company. Research brief is stale and needs a new map.',
      region: 'Central'
    },
    {
      name: 'Silverline Parks',
      owner: 'Meera Poluru',
      stage: 'Propose',
      pipeline: '$96K',
      amount: 96000,
      risk: 'Low',
      brief: 'Ready',
      next: 'Pricing call',
      detail: 'Seasonal parks operator. Pricing call is booked with the regional director.',
      region: 'West'
    }
  ] as AccountRow[],
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
    },
    {
      title: 'Security questionnaire',
      detail: 'Rivermark Banks needs SOC2 answers before legal can close.',
      owner: 'Lakshmi Poluru',
      status: 'Watch',
      type: 'Deal risk',
      account: 'Rivermark Banks'
    },
    {
      title: 'Champion departed',
      detail: 'Oakline Energy’s ops director left. Research pack is stale.',
      owner: 'Ramesh Poluru',
      status: 'New',
      type: 'Research',
      account: 'Oakline Energy'
    }
  ] as SignalRow[],
  sequences: [
    {
      name: 'Clinic expansion',
      owner: 'Rohan Poluru',
      steps: 6,
      done: 4,
      status: 'Active',
      audience: 'Health systems',
      detail: 'Multi-site clinic motion. Step 5 is a champion recap before the economic-buyer meeting.'
    },
    {
      name: 'Renewal QBR',
      owner: 'Kavya Poluru',
      steps: 4,
      done: 3,
      status: 'Active',
      audience: 'Enterprise',
      detail: 'Northstar QBR pack is ready. Last step is the Thursday live review.'
    },
    {
      name: 'Alpha outbound',
      owner: 'Nikhil Poluru',
      steps: 5,
      done: 3,
      status: 'Watch',
      audience: 'Retail',
      detail: 'Stalled after step 3. Suggested rewrite is a short champion recap, not another demo.'
    },
    {
      name: 'Legal close',
      owner: 'Meera Poluru',
      steps: 3,
      done: 2,
      status: 'Review',
      audience: 'Logistics',
      detail: 'Waiting on data-residency language from Helix counsel.'
    },
    {
      name: 'Success plan',
      owner: 'Sravani Poluru',
      steps: 5,
      done: 5,
      status: 'Ready',
      audience: 'Expansion',
      detail: 'Lumen Labs success plan is complete and ready to hand to CS.'
    },
    {
      name: 'Banking security',
      owner: 'Lakshmi Poluru',
      steps: 4,
      done: 1,
      status: 'Watch',
      audience: 'Financial',
      detail: 'SOC2 questionnaire is the first live step for Rivermark Banks.'
    },
    {
      name: 'Parks seasonal',
      owner: 'Meera Poluru',
      steps: 4,
      done: 2,
      status: 'Active',
      audience: 'Public sector',
      detail: 'Silverline Parks pricing call is next. Seasonal close window ends in 21 days.'
    }
  ] as SequenceRow[],
  meetings: [
    {
      id: 'MTG-441',
      account: 'Northstar Analytics',
      owner: 'Kavya Poluru',
      when: 'Thu 10:00',
      type: 'QBR',
      status: 'Ready',
      attendees: 6,
      detail: 'QBR deck, usage snapshot, and Metricly competitive notes are packed.'
    },
    {
      id: 'MTG-442',
      account: 'Brightside Health',
      owner: 'Rohan Poluru',
      when: 'Fri 14:30',
      type: 'Champion',
      status: 'Ready',
      attendees: 3,
      detail: 'Champion recap with the three new buying-committee members.'
    },
    {
      id: 'MTG-448',
      account: 'Helix Logistics',
      owner: 'Meera Poluru',
      when: 'Wed 09:00',
      type: 'Legal',
      status: 'Watch',
      attendees: 4,
      detail: 'Counsel review of data-residency redlines. Need the latest MSA snippet.'
    },
    {
      id: 'MTG-451',
      account: 'Atlas Freight',
      owner: 'Arjun Poluru',
      when: 'Tue 11:15',
      type: 'Discovery',
      status: 'Ready',
      attendees: 5,
      detail: '90-day evaluation agenda. Ops buyer plus two warehouse leads.'
    },
    {
      id: 'MTG-456',
      account: 'Coral Bay Clinics',
      owner: 'Hana Poluru',
      when: 'Mon 16:00',
      type: 'Proposal',
      status: 'Draft',
      attendees: 4,
      detail: 'Lighter implementation plan still needs Ananya Poluru’s review.'
    },
    {
      id: 'MTG-460',
      account: 'Rivermark Banks',
      owner: 'Lakshmi Poluru',
      when: 'Thu 15:00',
      type: 'Legal',
      status: 'Watch',
      attendees: 3,
      detail: 'Security review of the SOC2 questionnaire before legal can close.'
    },
    {
      id: 'MTG-463',
      account: 'Silverline Parks',
      owner: 'Meera Poluru',
      when: 'Wed 13:30',
      type: 'Proposal',
      status: 'Ready',
      attendees: 2,
      detail: 'Seasonal pricing call with the regional director.'
    },
    {
      id: 'MTG-468',
      account: 'Pinecrest Media',
      owner: 'Priya Poluru',
      when: 'Fri 09:30',
      type: 'Discovery',
      status: 'Draft',
      attendees: 4,
      detail: 'Demo recap agenda. First-call notes are still being summarized.'
    }
  ] as MeetingRow[],
  forecasts: [
    {
      name: 'Enterprise commit',
      owner: 'Ananya Poluru',
      commit: '$1.12M',
      upside: '$420K',
      coverage: 92,
      status: 'Commit',
      detail: 'Northstar, Helix, and Lumen are the commit core. Coverage is above the 1.2x bar.'
    },
    {
      name: 'Health systems',
      owner: 'Rohan Poluru',
      commit: '$210K',
      upside: '$310K',
      coverage: 74,
      status: 'Upside',
      detail: 'Brightside expansion is upside until the champion recap lands.'
    },
    {
      name: 'Retail outbound',
      owner: 'Nikhil Poluru',
      commit: '$40K',
      upside: '$180K',
      coverage: 52,
      status: 'At risk',
      detail: 'Harborline stall pulls coverage under the floor. Recap sequence is the recovery plan.'
    },
    {
      name: 'Logistics late-stage',
      owner: 'Meera Poluru',
      commit: '$265K',
      upside: '$96K',
      coverage: 81,
      status: 'Commit',
      detail: 'Helix is commit if residency language clears this week. Silverline is seasonal upside.'
    },
    {
      name: 'Financial services',
      owner: 'Lakshmi Poluru',
      commit: '$0',
      upside: '$288K',
      coverage: 48,
      status: 'At risk',
      detail: 'Rivermark stays upside until SOC2 answers land. Not in this week’s commit.'
    },
    {
      name: 'New logo discover',
      owner: 'Arjun Poluru',
      commit: '$0',
      upside: '$365K',
      coverage: 61,
      status: 'Upside',
      detail: 'Atlas Freight plus Oakline Energy. Oakline needs a new champion map first.'
    }
  ] as ForecastRow[],
  pipeline: [
    { day: 'Mon', value: 42, item: 'Northstar QBR packed · Kavya Poluru', coverage: 88 },
    { day: 'Tue', value: 61, item: 'Atlas discovery call · Arjun Poluru', coverage: 74 },
    { day: 'Wed', value: 84, item: 'Helix legal review · Meera Poluru', coverage: 69 },
    { day: 'Thu', value: 71, item: 'Northstar QBR live · Kavya Poluru', coverage: 92 },
    { day: 'Fri', value: 55, item: 'Brightside champion recap · Rohan Poluru', coverage: 81 }
  ],
  hourly: [
    { hour: '8a', value: 22 },
    { hour: '9a', value: 34 },
    { hour: '10', value: 58 },
    { hour: '11', value: 82 },
    { hour: '12', value: 47 },
    { hour: '1p', value: 66 },
    { hour: '2p', value: 94 },
    { hour: '3p', value: 77 },
    { hour: '4p', value: 51 },
    { hour: '5p', value: 29 }
  ],
  owners: [
    { name: 'Kavya Poluru', focus: 'Renewals', load: 86 },
    { name: 'Rohan Poluru', focus: 'Expansion', load: 78 },
    { name: 'Nikhil Poluru', focus: 'Outbound', load: 64 },
    { name: 'Meera Poluru', focus: 'Late stage', load: 71 },
    { name: 'Lakshmi Poluru', focus: 'Financial', load: 58 }
  ],
  sla: [
    { label: 'Brief freshness', value: 92 },
    { label: 'Meeting prep SLA', value: 88 },
    { label: 'Sequence coverage', value: 76 },
    { label: 'Forecast hygiene', value: 81 }
  ],
  briefs: ['Account research', 'Meeting prep', 'Competitive take', 'Renewal risk', 'Champion map'],
  stages: ['Discover', 'Qualify', 'Propose', 'Negotiate', 'Closed']
};
