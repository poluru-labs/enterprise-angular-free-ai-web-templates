export const templateConfig = {
  eyebrow: 'Quality assurance',
  title: 'Model evaluations',
  summary: 'Compare model behavior, run evaluation suites, and make release decisions with confidence.',
  action: 'Run evaluation',
  metrics: [
    { label: 'Evaluation runs', value: '328', trend: '+24', icon: 'science' },
    { label: 'Best score', value: '96.2%', trend: '+0.8%', icon: 'emoji_events' },
    { label: 'Release candidates', value: '5', trend: '+1', icon: 'rocket_launch' },
    { label: 'Open regressions', value: '3', trend: '-2', icon: 'troubleshoot' }
  ],
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
    }
  ],
  activity: [
    { title: 'Summarization suite completed', detail: 'Model: horizon-2 · Reviewer: Ananya Poluru', status: 'Passed' },
    { title: 'Safety benchmark flagged', detail: 'Model: assist-pro · Reviewer: Devika Poluru', status: 'Review' },
    { title: 'New dataset attached', detail: 'Multilingual support · Owner: Rohan Poluru', status: 'Ready' }
  ],
  suites: [
    { name: 'Summarization Quality', owner: 'Ananya Poluru', model: 'horizon-2', score: '96.2%', status: 'Passed' },
    { name: 'Safety & Toxicity', owner: 'Devika Poluru', model: 'assist-pro', score: '88.4%', status: 'Review' },
    { name: 'Reasoning Chain', owner: 'Karthik Poluru', model: 'horizon-2', score: '91.7%', status: 'Passed' },
    { name: 'Multilingual QA', owner: 'Meera Poluru', model: 'assist-lite', score: '79.5%', status: 'Blocked' },
    { name: 'Tool Use Accuracy', owner: 'Arjun Poluru', model: 'horizon-2', score: '93.9%', status: 'Passed' }
  ],
  datasets: [
    {
      title: 'Support Transcripts v4',
      detail: 'Curated customer support conversations for grounded response checks.',
      owner: 'Priya Poluru',
      status: 'Ready'
    },
    {
      title: 'Multilingual Prompts',
      detail: 'Prompt/response pairs spanning 12 languages for coverage testing.',
      owner: 'Rohan Poluru',
      status: 'Ready'
    },
    {
      title: 'Red Team Set',
      detail: 'Adversarial prompts used for safety and jailbreak resistance runs.',
      owner: 'Devika Poluru',
      status: 'Restricted'
    }
  ],
  scorecards: [
    { day: 'Mon', item: 'horizon-2 release scorecard drafted · Ananya Poluru' },
    { day: 'Tue', item: 'assist-pro safety review scheduled · Devika Poluru' },
    { day: 'Wed', item: 'Reasoning suite rerun after fix · Karthik Poluru' },
    { day: 'Thu', item: 'Scorecard sign-off with release council' },
    { day: 'Fri', item: 'assist-lite go/no-go decision · Meera Poluru' }
  ]
};