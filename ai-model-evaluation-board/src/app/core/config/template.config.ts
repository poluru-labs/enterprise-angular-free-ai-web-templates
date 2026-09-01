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

export type SuiteRow = {
  name: string;
  owner: string;
  model: string;
  score: string;
  baseline: string;
  cases: number;
  status: 'Passed' | 'Review' | 'Blocked';
};

export type DatasetRow = {
  title: string;
  detail: string;
  owner: string;
  revision: string;
  examples: string;
  languages: number;
  status: 'Ready' | 'Restricted' | 'Draft';
};

export type ModelRow = {
  name: string;
  family: string;
  checkpoint: string;
  owner: string;
  bestScore: string;
  suitesPassed: string;
  status: 'Candidate' | 'Baseline' | 'Watch' | 'Retired';
};

export type RegressionRow = {
  id: string;
  suite: string;
  model: string;
  owner: string;
  delta: string;
  severity: 'Critical' | 'High' | 'Watch';
  status: 'Open' | 'Acknowledged' | 'Snoozed';
  detail: string;
  time: string;
};

export type ScorecardRow = {
  id: string;
  model: string;
  owner: string;
  day: string;
  item: string;
  status: 'Draft' | 'In review' | 'Signed off' | 'Blocked';
};

export const templateConfig = {
  title: 'Model evaluations',
  eyebrow: 'Quality assurance',
  summary: 'Compare model behavior, run evaluation suites, and make release decisions with confidence.',
  action: 'Run evaluation',
  brand: { mark: 'EV', name: 'Poluru Labs', accent: 'Eval Board' },
  workspace: 'FY26 Q3 · Quality',
  user: { initials: 'AP', name: 'Ananya Poluru', role: 'QA lead' },
  nav: [
    { path: '/', label: 'Board', icon: 'dashboard', exact: true },
    { path: '/suites', label: 'Suites', icon: 'science' },
    { path: '/datasets', label: 'Datasets', icon: 'dataset' },
    { path: '/models', label: 'Models', icon: 'neurology' },
    { path: '/regressions', label: 'Regressions', icon: 'troubleshoot' },
    { path: '/scorecards', label: 'Scorecards', icon: 'fact_check' },
    { path: '/settings', label: 'Settings', icon: 'tune' }
  ] as NavItem[],
  metrics: [
    { label: 'Evaluation runs', value: '328', trend: '+24', trendDir: 'up' as const, hint: 'this week' },
    { label: 'Best score', value: '96.2%', trend: '+0.8%', trendDir: 'up' as const, hint: 'horizon-2' },
    { label: 'Release candidates', value: '5', trend: '+1', trendDir: 'up' as const, hint: 'checkpoints' },
    { label: 'Open regressions', value: '3', trend: '-2', trendDir: 'down' as const, hint: 'vs last week' }
  ] as Metric[],
  metricsByPeriod: {
    day: [
      { label: 'Evaluation runs', value: '41', trend: '+6', trendDir: 'up' as const, hint: 'today' },
      { label: 'Best score', value: '95.4%', trend: '+0.2%', trendDir: 'up' as const, hint: 'horizon-2' },
      { label: 'Release candidates', value: '4', trend: '0', trendDir: 'up' as const, hint: 'checkpoints' },
      { label: 'Open regressions', value: '3', trend: '-1', trendDir: 'down' as const, hint: 'vs yesterday' }
    ],
    week: [
      { label: 'Evaluation runs', value: '328', trend: '+24', trendDir: 'up' as const, hint: 'this week' },
      { label: 'Best score', value: '96.2%', trend: '+0.8%', trendDir: 'up' as const, hint: 'horizon-2' },
      { label: 'Release candidates', value: '5', trend: '+1', trendDir: 'up' as const, hint: 'checkpoints' },
      { label: 'Open regressions', value: '3', trend: '-2', trendDir: 'down' as const, hint: 'vs last week' }
    ],
    month: [
      { label: 'Evaluation runs', value: '1,246', trend: '+88', trendDir: 'up' as const, hint: 'this month' },
      { label: 'Best score', value: '96.2%', trend: '+1.4%', trendDir: 'up' as const, hint: 'horizon-2' },
      { label: 'Release candidates', value: '7', trend: '+2', trendDir: 'up' as const, hint: 'checkpoints' },
      { label: 'Open regressions', value: '5', trend: '-4', trendDir: 'down' as const, hint: 'vs last month' }
    ]
  } as Record<'day' | 'week' | 'month', Metric[]>,
  mustHaveFeatures: [
    {
      title: 'Suite Orchestration',
      detail: 'Queue summarization, safety, and reasoning suites across model checkpoints.',
      status: 'Enabled'
    },
    {
      title: 'Regression Watchtower',
      detail: 'Auto-flag score drops against the last approved baseline.',
      status: 'Enabled'
    },
    {
      title: 'Dataset Versioning',
      detail: 'Pin evaluation datasets to exact revisions for reproducible runs.',
      status: 'Enabled'
    },
    {
      title: 'Scorecard Sign-off',
      detail: 'Route release scorecards to reviewers before a model ships.',
      status: 'Enabled'
    },
    {
      title: 'Checkpoint Leaderboard',
      detail: 'Rank horizon, assist, and lite families by suite score and pass rate.',
      status: 'Enabled'
    },
    {
      title: 'Baseline Gate',
      detail: 'Block a scorecard when any required suite falls below the signed baseline.',
      status: 'Enabled'
    }
  ],
  activity: [
    { title: 'Summarization suite completed', detail: 'Model: horizon-2 · Reviewer: Ananya Poluru', status: 'Passed', time: '12 min ago' },
    { title: 'Safety benchmark flagged', detail: 'Model: assist-pro · Reviewer: Devika Poluru', status: 'Review', time: '38 min ago' },
    { title: 'New dataset attached', detail: 'Multilingual support · Owner: Rohan Poluru', status: 'Ready', time: '1 hr ago' },
    { title: 'Tool-use rerun queued', detail: 'Model: horizon-2 · Owner: Arjun Poluru', status: 'Queued', time: '2 hr ago' },
    { title: 'assist-lite blocked on QA', detail: 'Multilingual QA · Owner: Meera Poluru', status: 'Blocked', time: 'Yesterday' },
    { title: 'Release council invited', detail: 'Scorecard EV-441 · Ananya Poluru', status: 'Review', time: 'Yesterday' }
  ],
  hourly: [
    { hour: '08', value: 32 },
    { hour: '09', value: 48 },
    { hour: '10', value: 71 },
    { hour: '11', value: 64 },
    { hour: '12', value: 41 },
    { hour: '13', value: 58 },
    { hour: '14', value: 86 },
    { hour: '15', value: 79 },
    { hour: '16', value: 54 },
    { hour: '17', value: 38 }
  ],
  suites: [
    { name: 'Summarization Quality', owner: 'Ananya Poluru', model: 'horizon-2', score: '96.2%', baseline: '94.0%', cases: 420, status: 'Passed' },
    { name: 'Safety & Toxicity', owner: 'Devika Poluru', model: 'assist-pro', score: '88.4%', baseline: '91.0%', cases: 310, status: 'Review' },
    { name: 'Reasoning Chain', owner: 'Karthik Poluru', model: 'horizon-2', score: '91.7%', baseline: '90.0%', cases: 260, status: 'Passed' },
    { name: 'Multilingual QA', owner: 'Meera Poluru', model: 'assist-lite', score: '79.5%', baseline: '84.0%', cases: 180, status: 'Blocked' },
    { name: 'Tool Use Accuracy', owner: 'Arjun Poluru', model: 'horizon-2', score: '93.9%', baseline: '92.0%', cases: 150, status: 'Passed' },
    { name: 'Grounded Citations', owner: 'Priya Poluru', model: 'horizon-2', score: '94.1%', baseline: '93.0%', cases: 200, status: 'Passed' },
    { name: 'Refusal Policy', owner: 'Devika Poluru', model: 'assist-pro', score: '90.6%', baseline: '92.5%', cases: 140, status: 'Review' },
    { name: 'Latency Under Load', owner: 'Venkata Poluru', model: 'horizon-2', score: '87.2%', baseline: '85.0%', cases: 90, status: 'Passed' }
  ] as SuiteRow[],
  datasets: [
    {
      title: 'Support Transcripts v4',
      detail: 'Curated customer support conversations for grounded response checks.',
      owner: 'Priya Poluru',
      revision: 'ds-support-4.2',
      examples: '4,280',
      languages: 2,
      status: 'Ready'
    },
    {
      title: 'Multilingual Prompts',
      detail: 'Prompt/response pairs spanning 12 languages for coverage testing.',
      owner: 'Rohan Poluru',
      revision: 'ds-multi-12.1',
      examples: '6,140',
      languages: 12,
      status: 'Ready'
    },
    {
      title: 'Red Team Set',
      detail: 'Adversarial prompts used for safety and jailbreak resistance runs.',
      owner: 'Devika Poluru',
      revision: 'ds-red-3.8',
      examples: '980',
      languages: 4,
      status: 'Restricted'
    },
    {
      title: 'Tool Call Traces',
      detail: 'Recorded function-calling sessions for planner and argument accuracy.',
      owner: 'Arjun Poluru',
      revision: 'ds-tools-1.6',
      examples: '1,240',
      languages: 1,
      status: 'Ready'
    },
    {
      title: 'Citation Gold Set',
      detail: 'Knowledge snippets with required citations for grounded answers.',
      owner: 'Priya Poluru',
      revision: 'ds-cite-2.0',
      examples: '2,060',
      languages: 3,
      status: 'Ready'
    },
    {
      title: 'Reasoning Draft Pack',
      detail: 'Long-form chain-of-thought items still in reviewer calibration.',
      owner: 'Karthik Poluru',
      revision: 'ds-reason-0.9',
      examples: '420',
      languages: 1,
      status: 'Draft'
    }
  ] as DatasetRow[],
  models: [
    {
      name: 'horizon-2',
      family: 'Horizon',
      checkpoint: 'ckpt-441',
      owner: 'Ananya Poluru',
      bestScore: '96.2%',
      suitesPassed: '6 / 8',
      status: 'Candidate'
    },
    {
      name: 'horizon-1.8',
      family: 'Horizon',
      checkpoint: 'ckpt-390',
      owner: 'Karthik Poluru',
      bestScore: '94.8%',
      suitesPassed: '7 / 8',
      status: 'Baseline'
    },
    {
      name: 'assist-pro',
      family: 'Assist',
      checkpoint: 'ckpt-218',
      owner: 'Devika Poluru',
      bestScore: '90.6%',
      suitesPassed: '4 / 8',
      status: 'Watch'
    },
    {
      name: 'assist-lite',
      family: 'Assist',
      checkpoint: 'ckpt-112',
      owner: 'Meera Poluru',
      bestScore: '79.5%',
      suitesPassed: '2 / 8',
      status: 'Watch'
    },
    {
      name: 'harbor-mini',
      family: 'Harbor',
      checkpoint: 'ckpt-077',
      owner: 'Arjun Poluru',
      bestScore: '88.1%',
      suitesPassed: '5 / 8',
      status: 'Candidate'
    },
    {
      name: 'horizon-1.4',
      family: 'Horizon',
      checkpoint: 'ckpt-214',
      owner: 'Venkata Poluru',
      bestScore: '86.3%',
      suitesPassed: '5 / 8',
      status: 'Retired'
    }
  ] as ModelRow[],
  regressions: [
    {
      id: 'REG-204',
      suite: 'Safety & Toxicity',
      model: 'assist-pro',
      owner: 'Devika Poluru',
      delta: '-2.6%',
      severity: 'High',
      status: 'Open',
      detail: 'Toxicity recall dropped against the last signed baseline on jailbreak variants.',
      time: '38 min ago'
    },
    {
      id: 'REG-198',
      suite: 'Multilingual QA',
      model: 'assist-lite',
      owner: 'Meera Poluru',
      delta: '-4.5%',
      severity: 'Critical',
      status: 'Open',
      detail: 'Tamil and Telugu exact-match fell below the 84% gate. Scorecard EV-441 is blocked.',
      time: '2 hr ago'
    },
    {
      id: 'REG-174',
      suite: 'Refusal Policy',
      model: 'assist-pro',
      owner: 'Devika Poluru',
      delta: '-1.9%',
      severity: 'Watch',
      status: 'Snoozed',
      detail: 'Policy refusals drifted on medical advice prompts. Snoozed until the next red-team pack.',
      time: 'Yesterday'
    },
    {
      id: 'REG-161',
      suite: 'Reasoning Chain',
      model: 'horizon-1.8',
      owner: 'Karthik Poluru',
      delta: '-0.8%',
      severity: 'Watch',
      status: 'Acknowledged',
      detail: 'Multi-hop arithmetic dipped overnight. Ananya Poluru acknowledged; rerun is queued.',
      time: 'Yesterday'
    },
    {
      id: 'REG-150',
      suite: 'Grounded Citations',
      model: 'harbor-mini',
      owner: 'Priya Poluru',
      delta: '-1.2%',
      severity: 'High',
      status: 'Open',
      detail: 'Citation coverage missed two required knowledge snippets on support transcripts.',
      time: '2 days ago'
    }
  ] as RegressionRow[],
  scorecards: [
    {
      id: 'EV-441',
      model: 'horizon-2',
      owner: 'Ananya Poluru',
      day: 'Mon',
      item: 'horizon-2 release scorecard drafted · Ananya Poluru',
      status: 'Draft'
    },
    {
      id: 'EV-438',
      model: 'assist-pro',
      owner: 'Devika Poluru',
      day: 'Tue',
      item: 'assist-pro safety review scheduled · Devika Poluru',
      status: 'In review'
    },
    {
      id: 'EV-432',
      model: 'horizon-2',
      owner: 'Karthik Poluru',
      day: 'Wed',
      item: 'Reasoning suite rerun after fix · Karthik Poluru',
      status: 'In review'
    },
    {
      id: 'EV-429',
      model: 'horizon-1.8',
      owner: 'Ananya Poluru',
      day: 'Thu',
      item: 'Scorecard sign-off with release council',
      status: 'Signed off'
    },
    {
      id: 'EV-421',
      model: 'assist-lite',
      owner: 'Meera Poluru',
      day: 'Fri',
      item: 'assist-lite go/no-go decision · Meera Poluru',
      status: 'Blocked'
    }
  ] as ScorecardRow[],
  reviewers: [
    { name: 'Ananya Poluru', role: 'QA lead', load: 86 },
    { name: 'Devika Poluru', role: 'Safety', load: 74 },
    { name: 'Karthik Poluru', role: 'Reasoning', load: 61 },
    { name: 'Meera Poluru', role: 'Localization', load: 48 }
  ],
  sla: [
    { label: 'Suite freshness', value: 92 },
    { label: 'Dataset pin rate', value: 88 },
    { label: 'Scorecard cycle', value: 76 }
  ],
  inbox: [
    { label: 'Safety suite needs review', description: 'assist-pro · Devika Poluru' },
    { label: 'Multilingual QA blocked', description: 'assist-lite · Meera Poluru' },
    { label: 'Scorecard EV-441 drafted', description: 'horizon-2 · Ananya Poluru' },
    { label: 'Citation gold set pinned', description: 'ds-cite-2.0 · Priya Poluru' }
  ]
};
