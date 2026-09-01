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

export type SourceRow = {
  name: string;
  type: string;
  owner: string;
  docs: number;
  freshness: string;
  status: 'Healthy' | 'Review' | 'Syncing' | 'Failed';
  collection: string;
  detail: string;
};

export type CollectionRow = {
  name: string;
  sources: number;
  docs: string;
  visibility: 'Workspace' | 'Restricted' | 'Public';
  owner: string;
  pinned: boolean;
  detail: string;
  quality: string;
  lastSync: string;
};

export type IndexJob = {
  id: string;
  source: string;
  owner: string;
  stage: 'Crawl' | 'Chunk' | 'Embed' | 'ACL' | 'Publish';
  progress: number;
  status: 'Running' | 'Complete' | 'Blocked' | 'Failed';
};

export type QueryHit = {
  query: string;
  hit: string;
  score: string;
  citations: number;
};

export type AclReview = {
  id: string;
  source: string;
  owner: string;
  reason: string;
  status: 'Open' | 'Approved' | 'Held';
  severity: 'Critical' | 'High' | 'Watch';
  time: string;
};

export type EvalSuite = {
  id: string;
  name: string;
  owner: string;
  questions: number;
  ndcg: number;
  groundedness: number;
  status: 'Ready' | 'Running' | 'Drift';
  lastRun: string;
  detail: string;
};

export type EmbeddingModel = {
  name: string;
  traffic: number;
  owner: string;
  status: 'Default' | 'Canary' | 'Retired';
};

export const templateConfig = {
  title: 'Knowledge sources',
  eyebrow: 'RAG administration',
  summary:
    'Index, retrieve, and govern enterprise knowledge so answers stay cited, fresh, and permission-aware.',
  action: 'Add source',
  brand: { mark: 'I', name: 'Indigo Vault', accent: 'Indigo Vault' },
  workspace: 'FY26 Q3 · Knowledge',
  environment: 'Production',
  embeddingModel: 'text-embed-3-large',
  qualityLabel: '94.6% nDCG',
  user: { initials: 'AP', name: 'Ananya Poluru', role: 'Knowledge lead' },
  nav: [
    { path: '/', label: 'Overview', icon: 'dashboard', exact: true },
    { path: '/sources', label: 'Sources', icon: 'inventory_2' },
    { path: '/collections', label: 'Collections', icon: 'folder' },
    { path: '/indexing', label: 'Indexing', icon: 'sync' },
    { path: '/retrieval', label: 'Retrieval', icon: 'manage_search' },
    { path: '/governance', label: 'Governance', icon: 'verified_user' },
    { path: '/evaluations', label: 'Evaluations', icon: 'analytics' },
    { path: '/settings', label: 'Settings', icon: 'tune' }
  ] as NavItem[],
  metrics: [
    { label: 'Indexed documents', value: '24,891', trend: '+1,248', trendDir: 'up' as const, hint: 'this week' },
    { label: 'Retrieval quality', value: '94.6%', trend: '+1.7%', trendDir: 'up' as const, hint: 'nDCG@10' },
    { label: 'Syncing sources', value: '8', trend: '+3', trendDir: 'up' as const, hint: 'active jobs' },
    { label: 'Storage used', value: '68 GB', trend: '+4.2%', trendDir: 'up' as const, hint: 'of 120 GB' }
  ] as Metric[],
  metricsByPeriod: {
    day: [
      { label: 'Indexed documents', value: '3,412', trend: '+186', trendDir: 'up' as const, hint: 'today' },
      { label: 'Retrieval quality', value: '93.8%', trend: '+0.4%', trendDir: 'up' as const, hint: 'nDCG@10' },
      { label: 'Syncing sources', value: '3', trend: '-1', trendDir: 'down' as const, hint: 'active jobs' },
      { label: 'Storage used', value: '68 GB', trend: '+0.6%', trendDir: 'up' as const, hint: 'of 120 GB' }
    ],
    week: [
      { label: 'Indexed documents', value: '24,891', trend: '+1,248', trendDir: 'up' as const, hint: 'this week' },
      { label: 'Retrieval quality', value: '94.6%', trend: '+1.7%', trendDir: 'up' as const, hint: 'nDCG@10' },
      { label: 'Syncing sources', value: '8', trend: '+3', trendDir: 'up' as const, hint: 'active jobs' },
      { label: 'Storage used', value: '68 GB', trend: '+4.2%', trendDir: 'up' as const, hint: 'of 120 GB' }
    ],
    month: [
      { label: 'Indexed documents', value: '91,204', trend: '+8,410', trendDir: 'up' as const, hint: 'this month' },
      { label: 'Retrieval quality', value: '95.1%', trend: '+2.3%', trendDir: 'up' as const, hint: 'nDCG@10' },
      { label: 'Syncing sources', value: '11', trend: '+4', trendDir: 'up' as const, hint: 'active jobs' },
      { label: 'Storage used', value: '74 GB', trend: '+9.1%', trendDir: 'up' as const, hint: 'of 120 GB' }
    ]
  } as Record<'day' | 'week' | 'month', Metric[]>,
  alerts: [
    {
      heading: 'Legal KB is pending access review',
      content:
        'Venkata Poluru flagged 412 contracts that still lack a collection ACL. Retrieval is paused for that source until review closes.'
    },
    {
      heading: 'Help-center crawl drifted',
      content: 'Public collection added 88 pages overnight. Citation coverage dropped 2.1 pts — Meera Poluru is re-chunking.'
    },
    {
      heading: 'Embedding model canary',
      content: 'Arjun Poluru started a 10% traffic canary on text-embed-3-large. Hybrid search remains on by default.'
    },
    {
      heading: 'Harbor wiki auth expired',
      content: 'Ramesh Poluru’s Notion token expired at 08:14 CT. Crawl IDX-4394 failed; retry is waiting on re-auth.'
    }
  ],
  activity: [
    { title: 'Product docs synced', detail: '1,204 documents added · Lakshmi Poluru', status: 'Complete', time: '12 min ago' },
    { title: 'Legal knowledge base queued', detail: 'Access review required · Venkata Poluru', status: 'Review', time: '38 min ago' },
    { title: 'Help center index refreshed', detail: 'Collection: public · Meera Poluru', status: 'Ready', time: '1 hr ago' },
    { title: 'Support macros re-embedded', detail: 'Chunk size 512 · Priya Poluru', status: 'Running', time: '2 hr ago' },
    { title: 'Harbor wiki crawl failed', detail: 'Auth token expired · Ramesh Poluru', status: 'Failed', time: '3 hr ago' },
    { title: 'API reference published', detail: 'Git repo · Nikhil Poluru', status: 'Complete', time: '5 hr ago' },
    { title: 'Incident runbooks queued', detail: 'Collection: Ops · Hana Poluru', status: 'Running', time: 'Yesterday' }
  ],
  recentSyncs: [
    { source: 'Product documentation', owner: 'Lakshmi Poluru', docs: '12,440', quality: '96.2%', status: 'Healthy' },
    { source: 'Legal contracts', owner: 'Venkata Poluru', docs: '3,118', quality: '81.4%', status: 'Review' },
    { source: 'Help center', owner: 'Meera Poluru', docs: '6,902', quality: '93.1%', status: 'Healthy' },
    { source: 'Support macros', owner: 'Priya Poluru', docs: '1,447', quality: '88.0%', status: 'Syncing' },
    { source: 'Harbor wiki', owner: 'Ramesh Poluru', docs: '984', quality: '—', status: 'Failed' },
    { source: 'API reference', owner: 'Nikhil Poluru', docs: '1,880', quality: '97.4%', status: 'Healthy' }
  ],
  sources: [
    { name: 'Product documentation', type: 'Confluence', owner: 'Lakshmi Poluru', docs: 12440, freshness: '12 min', status: 'Healthy', collection: 'Public', detail: 'Canonical product how-tos for Harbor Desk and public copilots.' },
    { name: 'Legal contracts', type: 'SharePoint', owner: 'Venkata Poluru', docs: 3118, freshness: '2 d', status: 'Review', collection: 'Legal', detail: 'Vendor NDAs and MSA clauses paused until collection ACLs close.' },
    { name: 'Help center', type: 'Web crawl', owner: 'Meera Poluru', docs: 6902, freshness: '1 hr', status: 'Healthy', collection: 'Public', detail: 'Public crawl of help.harbor.com with citation coverage watch.' },
    { name: 'Support macros', type: 'Zendesk', owner: 'Priya Poluru', docs: 1447, freshness: '18 min', status: 'Syncing', collection: 'Support', detail: 'Refund and triage macros re-embedding at chunk size 512.' },
    { name: 'Harbor wiki', type: 'Notion', owner: 'Ramesh Poluru', docs: 984, freshness: '3 hr', status: 'Failed', collection: 'Internal', detail: 'Internal wiki crawl failed after the Notion auth token expired.' },
    { name: 'Policy handbook', type: 'PDF vault', owner: 'Sravani Poluru', docs: 226, freshness: '6 hr', status: 'Healthy', collection: 'HR', detail: 'Leave, PTO, and workplace policy PDFs with restricted visibility.' },
    { name: 'API reference', type: 'Git repo', owner: 'Nikhil Poluru', docs: 1880, freshness: '4 min', status: 'Healthy', collection: 'Engineering', detail: 'OpenAPI specs and rotation guides published from the platform repo.' },
    { name: 'Sales playbooks', type: 'Drive', owner: 'Hana Poluru', docs: 612, freshness: '22 min', status: 'Healthy', collection: 'GTM', detail: 'Account briefs and objection handling for Garnet Close sequences.' },
    { name: 'Release notes', type: 'Git repo', owner: 'Nikhil Poluru', docs: 418, freshness: '9 min', status: 'Healthy', collection: 'Engineering', detail: 'Shipped-feature notes used by support macros and the help center.' },
    { name: 'Incident runbooks', type: 'Confluence', owner: 'Hana Poluru', docs: 154, freshness: '41 min', status: 'Syncing', collection: 'Ops', detail: 'SEV-1 escalation paths currently crawling into the Ops collection.' },
    { name: 'Customer onboarding', type: 'Drive', owner: 'Lakshmi Poluru', docs: 287, freshness: '2 hr', status: 'Healthy', collection: 'GTM', detail: 'SSO setup, tenant kickoff, and first-week checklists for new logos.' },
    { name: 'Security advisories', type: 'SharePoint', owner: 'Arjun Poluru', docs: 96, freshness: '5 hr', status: 'Review', collection: 'Security', detail: 'CVE patch windows waiting on Security + Legal dual sign-off.' }
  ] as SourceRow[],
  collections: [
    { name: 'Public', sources: 3, docs: '19.3k', visibility: 'Workspace', owner: 'Ananya Poluru', pinned: true, quality: '96.2%', lastSync: '12 min', detail: 'Product docs and help-center pages that copilots may cite without an ACL hold.' },
    { name: 'Legal', sources: 1, docs: '3.1k', visibility: 'Restricted', owner: 'Venkata Poluru', pinned: true, quality: '81.4%', lastSync: '2 d', detail: 'Contracts frozen for retrieval until 412 missing collection ACLs are signed off.' },
    { name: 'Support', sources: 2, docs: '8.3k', visibility: 'Workspace', owner: 'Priya Poluru', pinned: false, quality: '88.0%', lastSync: '18 min', detail: 'Zendesk macros and help-center overlap used by Harbor Desk drafts.' },
    { name: 'Engineering', sources: 2, docs: '2.8k', visibility: 'Workspace', owner: 'Nikhil Poluru', pinned: true, quality: '97.4%', lastSync: '4 min', detail: 'API reference and release notes with the highest nDCG on the vault.' },
    { name: 'HR', sources: 1, docs: '226', visibility: 'Restricted', owner: 'Sravani Poluru', pinned: false, quality: '91.0%', lastSync: '6 hr', detail: 'Policy handbook stays restricted. Citation freeze remains on for answers.' },
    { name: 'GTM', sources: 2, docs: '899', visibility: 'Workspace', owner: 'Hana Poluru', pinned: false, quality: '89.5%', lastSync: '22 min', detail: 'Playbooks and onboarding guides for account teams on Garnet Close.' },
    { name: 'Ops', sources: 1, docs: '154', visibility: 'Workspace', owner: 'Hana Poluru', pinned: false, quality: '89.1%', lastSync: '41 min', detail: 'Incident runbooks for SEV-1 escalation. Crawl IDX-4379 is still live.' },
    { name: 'Security', sources: 1, docs: '96', visibility: 'Restricted', owner: 'Arjun Poluru', pinned: true, quality: '86.0%', lastSync: '5 hr', detail: 'Advisories need dual sign-off before they can publish to retrieval.' },
    { name: 'Internal', sources: 1, docs: '984', visibility: 'Restricted', owner: 'Ramesh Poluru', pinned: false, quality: '—', lastSync: '3 hr', detail: 'Harbor wiki is down after a Notion token expiry. Retry is waiting on re-auth.' }
  ] as CollectionRow[],
  indexJobs: [
    { id: 'IDX-4412', source: 'Support macros', owner: 'Priya Poluru', stage: 'Embed', progress: 72, status: 'Running' },
    { id: 'IDX-4408', source: 'Help center', owner: 'Meera Poluru', stage: 'Chunk', progress: 100, status: 'Complete' },
    { id: 'IDX-4401', source: 'Legal contracts', owner: 'Venkata Poluru', stage: 'ACL', progress: 34, status: 'Blocked' },
    { id: 'IDX-4394', source: 'Harbor wiki', owner: 'Ramesh Poluru', stage: 'Crawl', progress: 12, status: 'Failed' },
    { id: 'IDX-4388', source: 'API reference', owner: 'Nikhil Poluru', stage: 'Publish', progress: 100, status: 'Complete' },
    { id: 'IDX-4379', source: 'Incident runbooks', owner: 'Hana Poluru', stage: 'Crawl', progress: 44, status: 'Running' },
    { id: 'IDX-4366', source: 'Security advisories', owner: 'Arjun Poluru', stage: 'ACL', progress: 18, status: 'Blocked' }
  ] as IndexJob[],
  queries: [
    { query: 'How do we rotate API keys?', hit: 'API reference · Nikhil Poluru', score: '0.94', citations: 3 },
    { query: 'PTO carryover after March', hit: 'Policy handbook · Sravani Poluru', score: '0.91', citations: 2 },
    { query: 'Harbor SLA credits', hit: 'Help center · Meera Poluru', score: '0.87', citations: 4 },
    { query: 'NDA redlines for vendors', hit: 'Legal contracts · Venkata Poluru', score: '0.62', citations: 1 },
    { query: 'On-call escalation for SEV-1', hit: 'Incident runbooks · Hana Poluru', score: '0.89', citations: 3 },
    { query: 'SSO setup for new tenants', hit: 'Customer onboarding · Lakshmi Poluru', score: '0.84', citations: 2 },
    { query: 'CVE-2026-441 patch window', hit: 'Security advisories · Arjun Poluru', score: '0.78', citations: 2 },
    { query: 'Macro for refunds over $500', hit: 'Support macros · Priya Poluru', score: '0.71', citations: 1 }
  ] as QueryHit[],
  aclReviews: [
    {
      id: 'ACL-412',
      source: 'Legal contracts',
      owner: 'Venkata Poluru',
      reason: '412 contracts still lack a collection ACL. Retrieval is paused until review closes.',
      status: 'Open',
      severity: 'Critical',
      time: '38 min ago'
    },
    {
      id: 'ACL-388',
      source: 'Security advisories',
      owner: 'Arjun Poluru',
      reason: 'Restricted collection needs Security + Legal dual sign-off before publish.',
      status: 'Open',
      severity: 'High',
      time: '2 hr ago'
    },
    {
      id: 'ACL-361',
      source: 'Harbor wiki',
      owner: 'Ramesh Poluru',
      reason: 'Internal pages leaked into Public after a Notion share change.',
      status: 'Held',
      severity: 'High',
      time: 'Yesterday'
    },
    {
      id: 'ACL-340',
      source: 'Policy handbook',
      owner: 'Sravani Poluru',
      reason: 'HR visibility stays Restricted. Citation freeze remains on.',
      status: 'Approved',
      severity: 'Watch',
      time: '2 days ago'
    },
    {
      id: 'ACL-318',
      source: 'Sales playbooks',
      owner: 'Hana Poluru',
      reason: 'GTM collection can stay Workspace-visible for account teams.',
      status: 'Approved',
      severity: 'Watch',
      time: '3 days ago'
    }
  ] as AclReview[],
  evalSuites: [
    {
      id: 'EVAL-91',
      name: 'Support golden set',
      owner: 'Priya Poluru',
      questions: 48,
      ndcg: 94.6,
      groundedness: 92,
      status: 'Ready',
      lastRun: '2 hr ago',
      detail: 'Harbor Desk macros, SLA credits, and refund flows scored against grounded citations.'
    },
    {
      id: 'EVAL-88',
      name: 'Legal citation pack',
      owner: 'Venkata Poluru',
      questions: 32,
      ndcg: 81.4,
      groundedness: 88,
      status: 'Drift',
      lastRun: 'Yesterday',
      detail: 'NDA redlines drifted after ACL freeze. Re-run once Legal collection publishes again.'
    },
    {
      id: 'EVAL-74',
      name: 'Product how-to pack',
      owner: 'Lakshmi Poluru',
      questions: 64,
      ndcg: 96.2,
      groundedness: 95,
      status: 'Ready',
      lastRun: '4 hr ago',
      detail: 'Highest nDCG pack. Covers setup, rotation, and workspace admin how-tos.'
    },
    {
      id: 'EVAL-61',
      name: 'Ops SEV runbooks',
      owner: 'Hana Poluru',
      questions: 22,
      ndcg: 89.1,
      groundedness: 90,
      status: 'Running',
      lastRun: '12 min ago',
      detail: 'Nightly SEV-1 escalation pack. Meera Poluru’s runner is still in flight.'
    },
    {
      id: 'EVAL-55',
      name: 'Security advisory pack',
      owner: 'Arjun Poluru',
      questions: 18,
      ndcg: 86.0,
      groundedness: 91,
      status: 'Ready',
      lastRun: '3 days ago',
      detail: 'CVE patch-window questions. Dual sign-off still required before publish.'
    }
  ] as EvalSuite[],
  embeddingModels: [
    { name: 'text-embed-3-large', traffic: 90, owner: 'Arjun Poluru', status: 'Default' },
    { name: 'text-embed-3-small', traffic: 10, owner: 'Arjun Poluru', status: 'Canary' },
    { name: 'embed-legacy-v2', traffic: 0, owner: 'Meera Poluru', status: 'Retired' }
  ] as EmbeddingModel[],
  hourly: [
    { hour: '8a', value: 28 },
    { hour: '9a', value: 42 },
    { hour: '10', value: 68 },
    { hour: '11', value: 81 },
    { hour: '12', value: 54 },
    { hour: '1p', value: 73 },
    { hour: '2p', value: 96 },
    { hour: '3p', value: 88 },
    { hour: '4p', value: 61 },
    { hour: '5p', value: 39 }
  ],
  owners: [
    { name: 'Lakshmi Poluru', focus: 'Product docs', load: 84 },
    { name: 'Meera Poluru', focus: 'Help center', load: 71 },
    { name: 'Priya Poluru', focus: 'Support macros', load: 63 },
    { name: 'Nikhil Poluru', focus: 'API reference', load: 48 },
    { name: 'Hana Poluru', focus: 'Incident runbooks', load: 36 }
  ],
  sla: [
    { label: 'Crawl SLA', value: 94 },
    { label: 'Embed SLA', value: 88 },
    { label: 'ACL review', value: 61 },
    { label: 'Eval freshness', value: 79 }
  ],
  connectors: ['Confluence', 'SharePoint', 'Notion', 'Zendesk', 'Git repo', 'Drive', 'Web crawl', 'PDF vault']
};
