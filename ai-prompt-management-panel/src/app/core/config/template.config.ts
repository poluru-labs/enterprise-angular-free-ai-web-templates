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

export type PromptStatus = 'Live' | 'Review' | 'Draft' | 'Archived';

export type PromptRow = {
  id: string;
  name: string;
  collection: string;
  owner: string;
  version: string;
  success: string;
  tokens: string;
  status: PromptStatus;
  body: string;
};

export type ExperimentStatus = 'Running' | 'Winner' | 'Paused';

export type ExperimentRow = {
  id: string;
  name: string;
  collection: string;
  owner: string;
  control: string;
  challenger: string;
  lift: string;
  traffic: string;
  status: ExperimentStatus;
  detail: string;
};

export type VersionStatus = 'Live' | 'Candidate' | 'Retired';

export type VersionRow = {
  id: string;
  prompt: string;
  version: string;
  owner: string;
  success: string;
  notes: string;
  status: VersionStatus;
  shipped: string;
};

export type CollectionRow = {
  name: string;
  owner: string;
  prompts: number;
  live: number;
  review: number;
  success: string;
  pinned: boolean;
  detail: string;
};

export const templateConfig = {
  title: 'Prompt library',
  eyebrow: 'Prompt operations',
  summary: 'Create, test, and govern reusable prompts for every team workflow.',
  action: 'New prompt',
  brand: { mark: 'PL', name: 'Poluru Labs', accent: 'Prompt library' },
  workspace: 'FY26 Q3 · Prompt ops',
  user: { initials: 'PP', name: 'Priya Poluru', role: 'Prompt ops lead' },
  nav: [
    { path: '/', label: 'Library', icon: 'menu_book', exact: true },
    { path: '/experiments', label: 'Experiments', icon: 'science' },
    { path: '/versions', label: 'Versions', icon: 'history' },
    { path: '/collections', label: 'Collections', icon: 'folder_special' },
    { path: '/settings', label: 'Settings', icon: 'tune' }
  ] as NavItem[],
  metrics: [
    { label: 'Published prompts', value: '184', trend: '+9', trendDir: 'up' as const, hint: 'this week' },
    { label: 'Avg. success rate', value: '91.8%', trend: '+2.3%', trendDir: 'up' as const, hint: 'live prompts' },
    { label: 'In review', value: '16', trend: '+4', trendDir: 'up' as const, hint: 'awaiting Priya' },
    { label: 'Team contributors', value: '37', trend: '+6', trendDir: 'up' as const, hint: 'authors' }
  ] as Metric[],
  metricsByPeriod: {
    day: [
      { label: 'Published prompts', value: '3', trend: '+1', trendDir: 'up' as const, hint: 'today' },
      { label: 'Avg. success rate', value: '92.1%', trend: '+0.4%', trendDir: 'up' as const, hint: 'live prompts' },
      { label: 'In review', value: '16', trend: '+2', trendDir: 'up' as const, hint: 'awaiting Priya' },
      { label: 'Team contributors', value: '12', trend: '+3', trendDir: 'up' as const, hint: 'authors today' }
    ],
    week: [
      { label: 'Published prompts', value: '184', trend: '+9', trendDir: 'up' as const, hint: 'this week' },
      { label: 'Avg. success rate', value: '91.8%', trend: '+2.3%', trendDir: 'up' as const, hint: 'live prompts' },
      { label: 'In review', value: '16', trend: '+4', trendDir: 'up' as const, hint: 'awaiting Priya' },
      { label: 'Team contributors', value: '37', trend: '+6', trendDir: 'up' as const, hint: 'authors' }
    ],
    month: [
      { label: 'Published prompts', value: '612', trend: '+48', trendDir: 'up' as const, hint: 'this month' },
      { label: 'Avg. success rate', value: '90.4%', trend: '+1.1%', trendDir: 'up' as const, hint: 'live prompts' },
      { label: 'In review', value: '22', trend: '-3', trendDir: 'down' as const, hint: 'vs last month' },
      { label: 'Team contributors', value: '54', trend: '+11', trendDir: 'up' as const, hint: 'authors' }
    ]
  } as Record<'day' | 'week' | 'month', Metric[]>,
  mustHaveFeatures: [
    {
      title: 'Catalog governance',
      detail: 'Keep every system prompt in one library with owner, collection, and live version.',
      status: 'Enabled'
    },
    {
      title: 'Review gate',
      detail: 'Drafts cannot publish until Priya Poluru or a collection owner signs off.',
      status: 'Enabled'
    },
    {
      title: 'Experiment traffic',
      detail: 'Split control and challenger prompts on live traffic and record lift.',
      status: 'Enabled'
    },
    {
      title: 'Version history',
      detail: 'Promote or roll back any prompt without losing the previous body.',
      status: 'Enabled'
    },
    {
      title: 'Collection ACL',
      detail: 'Legal and revenue collections stay restricted to their owners.',
      status: 'Enabled'
    },
    {
      title: 'Success floor',
      detail: 'Block a publish when playground success falls below the workspace floor.',
      status: 'Enabled'
    }
  ],
  activity: [
    {
      title: 'Support triage v3 submitted',
      detail: 'Customer experience · Reviewer: Priya Poluru',
      status: 'Review',
      time: '12 min ago'
    },
    {
      title: 'Email writer promoted',
      detail: 'Marketing collection · Owner: Devika Poluru',
      status: 'Live',
      time: '38 min ago'
    },
    {
      title: 'Sales qualifier forked',
      detail: 'Revenue collection · Owner: Karthik Poluru',
      status: 'Draft',
      time: '1 hr ago'
    },
    {
      title: 'Policy summarizer queued',
      detail: 'Legal collection · Owner: Meera Poluru',
      status: 'Review',
      time: '2 hr ago'
    },
    {
      title: 'RAG rewriter won its experiment',
      detail: 'Engineering · Owner: Arjun Poluru',
      status: 'Live',
      time: 'Yesterday'
    },
    {
      title: 'Refund advisor archived v1',
      detail: 'Customer experience · Owner: Rohan Poluru',
      status: 'Archived',
      time: 'Yesterday'
    }
  ],
  hourly: [
    { hour: '08', value: 28 },
    { hour: '09', value: 44 },
    { hour: '10', value: 67 },
    { hour: '11', value: 72 },
    { hour: '12', value: 39 },
    { hour: '13', value: 51 },
    { hour: '14', value: 88 },
    { hour: '15', value: 81 },
    { hour: '16', value: 58 },
    { hour: '17', value: 34 }
  ],
  prompts: [
    {
      id: 'PR-184',
      name: 'Support triage v3',
      collection: 'Customer experience',
      owner: 'Rohan Poluru',
      version: 'v3',
      success: '94.2%',
      tokens: '1.2k',
      status: 'Live',
      body: 'Classify the ticket, name the policy, and ask one clarifying question before you escalate.'
    },
    {
      id: 'PR-176',
      name: 'Email writer',
      collection: 'Marketing',
      owner: 'Devika Poluru',
      version: 'v5',
      success: '91.8%',
      tokens: '980',
      status: 'Live',
      body: 'Write a concise campaign email in the Garnet Close voice. Never invent discounts.'
    },
    {
      id: 'PR-162',
      name: 'Sales qualifier',
      collection: 'Revenue',
      owner: 'Karthik Poluru',
      version: 'v2',
      success: '86.4%',
      tokens: '740',
      status: 'Draft',
      body: 'Ask four BANT questions, then recommend a next motion. Do not promise pricing.'
    },
    {
      id: 'PR-158',
      name: 'Policy summarizer',
      collection: 'Legal',
      owner: 'Meera Poluru',
      version: 'v4',
      success: '88.1%',
      tokens: '1.6k',
      status: 'Review',
      body: 'Summarize the cited policy in 80 words. Quote the section. Refuse if the source is missing.'
    },
    {
      id: 'PR-151',
      name: 'RAG rewriter',
      collection: 'Engineering',
      owner: 'Arjun Poluru',
      version: 'v6',
      success: '93.5%',
      tokens: '1.1k',
      status: 'Live',
      body: 'Rewrite the retrieved snippets into a grounded answer. Cite every claim.'
    },
    {
      id: 'PR-147',
      name: 'Onboarding coach',
      collection: 'Customer experience',
      owner: 'Ananya Poluru',
      version: 'v2',
      success: '90.7%',
      tokens: '860',
      status: 'Live',
      body: 'Walk a new workspace admin through first publish, review, and collection ACLs.'
    },
    {
      id: 'PR-139',
      name: 'Incident commander',
      collection: 'Engineering',
      owner: 'Venkata Poluru',
      version: 'v1',
      success: '84.9%',
      tokens: '1.4k',
      status: 'Review',
      body: 'Draft a status page update from the incident timeline. Never invent root cause.'
    },
    {
      id: 'PR-133',
      name: 'Refund advisor',
      collection: 'Customer experience',
      owner: 'Rohan Poluru',
      version: 'v2',
      success: '92.6%',
      tokens: '640',
      status: 'Live',
      body: 'Recommend refund or credit using the published policy. Escalate chargebacks.'
    },
    {
      id: 'PR-128',
      name: 'Brand voice rewriter',
      collection: 'Marketing',
      owner: 'Devika Poluru',
      version: 'v1',
      success: '79.3%',
      tokens: '520',
      status: 'Draft',
      body: 'Rewrite the draft to match brand voice. Keep claims that legal already approved.'
    },
    {
      id: 'PR-121',
      name: 'Contract clause finder',
      collection: 'Legal',
      owner: 'Meera Poluru',
      version: 'v3',
      success: '95.1%',
      tokens: '2.1k',
      status: 'Live',
      body: 'Locate the requested clause and quote it. Flag missing indemnity language.'
    }
  ] as PromptRow[],
  experiments: [
    {
      id: 'EX-44',
      name: 'Email writer tone',
      collection: 'Marketing',
      owner: 'Devika Poluru',
      control: 'Email writer v4',
      challenger: 'Email writer v5',
      lift: '+3.1%',
      traffic: '40%',
      status: 'Winner',
      detail: 'v5 shortened subject lines and lifted click-through without inventing discounts.'
    },
    {
      id: 'EX-41',
      name: 'Support triage brevity',
      collection: 'Customer experience',
      owner: 'Rohan Poluru',
      control: 'Support triage v2',
      challenger: 'Support triage v3',
      lift: '+2.4%',
      traffic: '50%',
      status: 'Running',
      detail: 'v3 asks one clarifying question. Priya Poluru is watching CSAT for the next 48 hours.'
    },
    {
      id: 'EX-38',
      name: 'Sales qualifier questions',
      collection: 'Revenue',
      owner: 'Karthik Poluru',
      control: 'Sales qualifier v1',
      challenger: 'Sales qualifier v2',
      lift: '-0.8%',
      traffic: '25%',
      status: 'Paused',
      detail: 'Challenger over-asked pricing. Paused until legal reviews the BANT script.'
    },
    {
      id: 'EX-35',
      name: 'Policy refusal style',
      collection: 'Legal',
      owner: 'Meera Poluru',
      control: 'Policy summarizer v3',
      challenger: 'Policy summarizer v4',
      lift: '+1.6%',
      traffic: '30%',
      status: 'Running',
      detail: 'v4 quotes the section number. Reviewers prefer the longer refusal.'
    },
    {
      id: 'EX-31',
      name: 'RAG citation density',
      collection: 'Engineering',
      owner: 'Arjun Poluru',
      control: 'RAG rewriter v5',
      challenger: 'RAG rewriter v6',
      lift: '+4.2%',
      traffic: '60%',
      status: 'Winner',
      detail: 'v6 cites every claim. Groundedness rose without extra tokens.'
    },
    {
      id: 'EX-28',
      name: 'Onboarding coach length',
      collection: 'Customer experience',
      owner: 'Ananya Poluru',
      control: 'Onboarding coach v1',
      challenger: 'Onboarding coach v2',
      lift: '+1.1%',
      traffic: '20%',
      status: 'Paused',
      detail: 'Paused while Ananya Poluru rewrites the ACL walkthrough.'
    }
  ] as ExperimentRow[],
  versions: [
    {
      id: 'VR-301',
      prompt: 'Support triage',
      version: 'v3',
      owner: 'Rohan Poluru',
      success: '94.2%',
      notes: 'Adds one clarifying question before escalate.',
      status: 'Live',
      shipped: 'Today'
    },
    {
      id: 'VR-298',
      prompt: 'Support triage',
      version: 'v2',
      owner: 'Rohan Poluru',
      success: '91.8%',
      notes: 'Previous live body. Kept for rollback.',
      status: 'Candidate',
      shipped: 'Last week'
    },
    {
      id: 'VR-290',
      prompt: 'Email writer',
      version: 'v5',
      owner: 'Devika Poluru',
      success: '91.8%',
      notes: 'Shorter subjects after EX-44.',
      status: 'Live',
      shipped: 'Today'
    },
    {
      id: 'VR-284',
      prompt: 'Email writer',
      version: 'v4',
      owner: 'Devika Poluru',
      success: '88.7%',
      notes: 'Retired after the winner shipped.',
      status: 'Retired',
      shipped: '2 weeks ago'
    },
    {
      id: 'VR-276',
      prompt: 'RAG rewriter',
      version: 'v6',
      owner: 'Arjun Poluru',
      success: '93.5%',
      notes: 'Cite every claim. Won EX-31.',
      status: 'Live',
      shipped: 'Yesterday'
    },
    {
      id: 'VR-271',
      prompt: 'Policy summarizer',
      version: 'v4',
      owner: 'Meera Poluru',
      success: '88.1%',
      notes: 'Quotes section numbers. Waiting on Priya Poluru.',
      status: 'Candidate',
      shipped: 'Yesterday'
    },
    {
      id: 'VR-264',
      prompt: 'Sales qualifier',
      version: 'v2',
      owner: 'Karthik Poluru',
      success: '86.4%',
      notes: 'Draft after EX-38 pause.',
      status: 'Candidate',
      shipped: '2 days ago'
    },
    {
      id: 'VR-255',
      prompt: 'Contract clause finder',
      version: 'v3',
      owner: 'Meera Poluru',
      success: '95.1%',
      notes: 'Flags missing indemnity language.',
      status: 'Live',
      shipped: 'Last week'
    }
  ] as VersionRow[],
  collections: [
    {
      name: 'Customer experience',
      owner: 'Rohan Poluru',
      prompts: 48,
      live: 31,
      review: 6,
      success: '93.1%',
      pinned: true,
      detail: 'Support triage, refund advisor, and onboarding coach for Harbor Desk.'
    },
    {
      name: 'Marketing',
      owner: 'Devika Poluru',
      prompts: 36,
      live: 22,
      review: 3,
      success: '90.4%',
      pinned: true,
      detail: 'Email writer and brand-voice rewrites for campaign drafts.'
    },
    {
      name: 'Revenue',
      owner: 'Karthik Poluru',
      prompts: 22,
      live: 11,
      review: 2,
      success: '86.8%',
      pinned: false,
      detail: 'Sales qualifier and account briefs for Garnet Close.'
    },
    {
      name: 'Legal',
      owner: 'Meera Poluru',
      prompts: 18,
      live: 9,
      review: 4,
      success: '94.0%',
      pinned: true,
      detail: 'Policy summarizer and contract clause finder. Restricted ACL.'
    },
    {
      name: 'Engineering',
      owner: 'Arjun Poluru',
      prompts: 41,
      live: 28,
      review: 1,
      success: '92.2%',
      pinned: false,
      detail: 'RAG rewriter and incident commander for platform teams.'
    },
    {
      name: 'Quality',
      owner: 'Ananya Poluru',
      prompts: 19,
      live: 12,
      review: 0,
      success: '89.6%',
      pinned: false,
      detail: 'Eval-board helpers used when a suite needs a frozen prompt body.'
    }
  ] as CollectionRow[],
  owners: [
    { name: 'Priya Poluru', role: 'Prompt ops lead', load: 82 },
    { name: 'Rohan Poluru', role: 'Customer experience', load: 71 },
    { name: 'Devika Poluru', role: 'Marketing', load: 64 },
    { name: 'Meera Poluru', role: 'Legal', load: 58 }
  ],
  sla: [
    { label: 'Review cycle', value: 86 },
    { label: 'Live coverage', value: 91 },
    { label: 'Experiment wrap', value: 74 }
  ],
  inbox: [
    { label: 'Support triage v3 in review', description: 'Customer experience · Rohan Poluru' },
    { label: 'Policy summarizer waiting', description: 'Legal · Meera Poluru' },
    { label: 'Incident commander queued', description: 'Engineering · Venkata Poluru' },
    { label: 'Sales qualifier still draft', description: 'Revenue · Karthik Poluru' }
  ]
};
