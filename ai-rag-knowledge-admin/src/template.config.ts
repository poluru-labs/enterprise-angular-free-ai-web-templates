export type NavItem = {
  path: string;
  label: string;
  icon: string;
  exact?: boolean;
};

export const templateConfig = {
  title: 'Knowledge sources',
  eyebrow: 'RAG administration',
  summary:
    'Index, retrieve, and govern enterprise knowledge so answers stay cited, fresh, and permission-aware.',
  action: 'Add source',
  brand: { mark: 'I', name: 'Poluru Cloud', accent: 'Indigo Vault' },
  workspace: 'FY26 Q3 · Knowledge',
  user: { initials: 'AP', name: 'Ananya Poluru', role: 'Knowledge lead' },
  nav: [
    { path: '/', label: 'Overview', icon: 'dashboard', exact: true },
    { path: '/sources', label: 'Sources', icon: 'inventory_2' },
    { path: '/collections', label: 'Collections', icon: 'folder' },
    { path: '/indexing', label: 'Indexing', icon: 'sync' },
    { path: '/retrieval', label: 'Retrieval', icon: 'manage_search' },
    { path: '/settings', label: 'Settings', icon: 'tune' }
  ] as NavItem[],
  metrics: [
    { label: 'Indexed documents', value: '24,891', trend: '+1,248', trendDir: 'up' as const, hint: 'this week' },
    { label: 'Retrieval quality', value: '94.6%', trend: '+1.7%', trendDir: 'up' as const, hint: 'nDCG@10' },
    { label: 'Syncing sources', value: '8', trend: '+3', trendDir: 'up' as const, hint: 'active jobs' },
    { label: 'Storage used', value: '68 GB', trend: '+4.2%', trendDir: 'up' as const, hint: 'of 120 GB' }
  ],
  alerts: [
    {
      heading: 'Legal KB is pending access review',
      content: 'Venkata Poluru flagged 412 contracts that still lack a collection ACL. Retrieval is paused for that source until review closes.'
    },
    {
      heading: 'Help-center crawl drifted',
      content: 'Public collection added 88 pages overnight. Citation coverage dropped 2.1 pts — Meera Poluru is re-chunking.'
    },
    {
      heading: 'Embedding model canary',
      content: 'Arjun Poluru started a 10% traffic canary on text-embed-3-large. Hybrid search remains on by default.'
    }
  ],
  activity: [
    { title: 'Product docs synced', detail: '1,204 documents added · Lakshmi Poluru', status: 'Complete', time: '12 min ago' },
    { title: 'Legal knowledge base queued', detail: 'Access review required · Venkata Poluru', status: 'Review', time: '38 min ago' },
    { title: 'Help center index refreshed', detail: 'Collection: public · Meera Poluru', status: 'Ready', time: '1 hr ago' },
    { title: 'Support macros re-embedded', detail: 'Chunk size 512 · Priya Poluru', status: 'Running', time: '2 hr ago' },
    { title: 'Harbor wiki crawl failed', detail: 'Auth token expired · Ramesh Poluru', status: 'Failed', time: '3 hr ago' }
  ],
  recentSyncs: [
    { source: 'Product documentation', owner: 'Lakshmi Poluru', docs: '12,440', quality: '96.2%', status: 'Healthy' },
    { source: 'Legal contracts', owner: 'Venkata Poluru', docs: '3,118', quality: '81.4%', status: 'Review' },
    { source: 'Help center', owner: 'Meera Poluru', docs: '6,902', quality: '93.1%', status: 'Healthy' },
    { source: 'Support macros', owner: 'Priya Poluru', docs: '1,447', quality: '88.0%', status: 'Syncing' },
    { source: 'Harbor wiki', owner: 'Ramesh Poluru', docs: '984', quality: '—', status: 'Failed' }
  ],
  sources: [
    { name: 'Product documentation', type: 'Confluence', owner: 'Lakshmi Poluru', docs: 12440, freshness: '12 min', status: 'Healthy', collection: 'Public' },
    { name: 'Legal contracts', type: 'SharePoint', owner: 'Venkata Poluru', docs: 3118, freshness: '2 d', status: 'Review', collection: 'Legal' },
    { name: 'Help center', type: 'Web crawl', owner: 'Meera Poluru', docs: 6902, freshness: '1 hr', status: 'Healthy', collection: 'Public' },
    { name: 'Support macros', type: 'Zendesk', owner: 'Priya Poluru', docs: 1447, freshness: '18 min', status: 'Syncing', collection: 'Support' },
    { name: 'Harbor wiki', type: 'Notion', owner: 'Ramesh Poluru', docs: 984, freshness: '3 hr', status: 'Failed', collection: 'Internal' },
    { name: 'Policy handbook', type: 'PDF vault', owner: 'Sravani Poluru', docs: 226, freshness: '6 hr', status: 'Healthy', collection: 'HR' },
    { name: 'API reference', type: 'Git repo', owner: 'Nikhil Poluru', docs: 1880, freshness: '4 min', status: 'Healthy', collection: 'Engineering' },
    { name: 'Sales playbooks', type: 'Drive', owner: 'Hana Poluru', docs: 612, freshness: '22 min', status: 'Healthy', collection: 'GTM' }
  ],
  collections: [
    { name: 'Public', sources: 3, docs: '19.3k', visibility: 'Workspace', owner: 'Ananya Poluru' },
    { name: 'Legal', sources: 1, docs: '3.1k', visibility: 'Restricted', owner: 'Venkata Poluru' },
    { name: 'Support', sources: 2, docs: '8.3k', visibility: 'Workspace', owner: 'Priya Poluru' },
    { name: 'Engineering', sources: 2, docs: '2.8k', visibility: 'Workspace', owner: 'Nikhil Poluru' },
    { name: 'HR', sources: 1, docs: '226', visibility: 'Restricted', owner: 'Sravani Poluru' },
    { name: 'GTM', sources: 1, docs: '612', visibility: 'Workspace', owner: 'Hana Poluru' }
  ],
  indexJobs: [
    { id: 'IDX-4412', source: 'Support macros', owner: 'Priya Poluru', stage: 'Embed', progress: 72, status: 'Running' },
    { id: 'IDX-4408', source: 'Help center', owner: 'Meera Poluru', stage: 'Chunk', progress: 100, status: 'Complete' },
    { id: 'IDX-4401', source: 'Legal contracts', owner: 'Venkata Poluru', stage: 'ACL', progress: 34, status: 'Blocked' },
    { id: 'IDX-4394', source: 'Harbor wiki', owner: 'Ramesh Poluru', stage: 'Crawl', progress: 12, status: 'Failed' },
    { id: 'IDX-4388', source: 'API reference', owner: 'Nikhil Poluru', stage: 'Publish', progress: 100, status: 'Complete' }
  ],
  queries: [
    { query: 'How do we rotate API keys?', hit: 'API reference · Nikhil Poluru', score: '0.94', citations: 3 },
    { query: 'PTO carryover after March', hit: 'Policy handbook · Sravani Poluru', score: '0.91', citations: 2 },
    { query: 'Harbor SLA credits', hit: 'Help center · Meera Poluru', score: '0.87', citations: 4 },
    { query: 'NDA redlines for vendors', hit: 'Legal contracts · Venkata Poluru', score: '0.62', citations: 1 }
  ],
  hourly: [
    { hour: '9a', value: 42 },
    { hour: '10', value: 68 },
    { hour: '11', value: 81 },
    { hour: '12', value: 54 },
    { hour: '1p', value: 73 },
    { hour: '2p', value: 96 },
    { hour: '3p', value: 88 },
    { hour: '4p', value: 61 }
  ],
  recruiters: [
    { name: 'Lakshmi Poluru', focus: 'Product docs', load: 84 },
    { name: 'Meera Poluru', focus: 'Help center', load: 71 },
    { name: 'Priya Poluru', focus: 'Support macros', load: 63 },
    { name: 'Nikhil Poluru', focus: 'API reference', load: 48 }
  ],
  sla: [
    { label: 'Crawl SLA', value: 94 },
    { label: 'Embed SLA', value: 88 },
    { label: 'ACL review', value: 61 }
  ],
  connectors: ['Confluence', 'SharePoint', 'Notion', 'Zendesk', 'Git repo', 'Drive', 'Web crawl', 'PDF vault']
};
