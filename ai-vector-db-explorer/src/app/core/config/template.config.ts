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

export type IndexRow = {
  id: string;
  name: string;
  metric: 'cosine' | 'dot' | 'l2';
  dimensions: number;
  vectors: number;
  namespaces: number;
  status: 'Healthy' | 'Rebuilding' | 'Stale' | 'Down';
  owner: string;
  region: string;
  detail: string;
};

export type NamespaceRow = {
  id: string;
  name: string;
  index: string;
  vectors: number;
  status: 'Warm' | 'Cooling' | 'Frozen' | 'Querying';
  owner: string;
  p95: string;
  detail: string;
};

export type VectorRow = {
  id: string;
  index: string;
  namespace: string;
  preview: string;
  owner: string;
  score: number;
  status: 'Indexed' | 'Pending' | 'Stale';
  dims: number;
};

export type NeighborRow = {
  id: string;
  source: string;
  neighbor: string;
  score: number;
  namespace: string;
  owner: string;
  status: 'Match' | 'Watch' | 'Weak';
};

export type ClusterRow = {
  id: string;
  label: string;
  size: number;
  cohesion: number;
  index: string;
  owner: string;
  status: 'Stable' | 'Drift' | 'Watch';
  detail: string;
};

export const templateConfig = {
  title: 'Vector explorer',
  eyebrow: 'Indexes',
  summary: 'Browse embeddings, namespaces, and similarity scores across Lattice vector indexes.',
  action: 'Run query',
  brand: { mark: 'L', name: 'Lattice', accent: 'Lattice' },
  workspace: 'Vectors · Production',
  environment: 'Production',
  copilotLabel: 'HNSW live',
  qualityLabel: '0.91 recall',
  user: { initials: 'MP', name: 'Maya Poluru', role: 'Index engineer' },
  nav: [
    { path: '/', label: 'Overview', icon: 'dashboard', exact: true },
    { path: '/indexes', label: 'Indexes', icon: 'hub' },
    { path: '/namespaces', label: 'Namespaces', icon: 'account_tree' },
    { path: '/vectors', label: 'Vectors', icon: 'blur_on' },
    { path: '/search', label: 'Search', icon: 'search' },
    { path: '/neighbors', label: 'Neighbors', icon: 'share' },
    { path: '/clusters', label: 'Clusters', icon: 'bubble_chart' },
    { path: '/settings', label: 'Settings', icon: 'tune' }
  ] as NavItem[],
  metrics: [
    { label: 'Indexed vectors', value: '4.06M', trend: '+6.2%', trendDir: 'up' as const, hint: 'this week' },
    { label: 'Query p95', value: '38ms', trend: '-4ms', trendDir: 'down' as const, hint: 'cosine k=10' },
    { label: 'Recall@10', value: '0.91', trend: '+0.03', trendDir: 'up' as const, hint: 'eval pack' },
    { label: 'Warm namespaces', value: '11', trend: '+1', trendDir: 'up' as const, hint: 'ready to query' }
  ] as Metric[],
  metricsByPeriod: {
    day: [
      { label: 'Indexed vectors', value: '4.01M', trend: '+0.4%', trendDir: 'up' as const, hint: 'today' },
      { label: 'Query p95', value: '41ms', trend: '+2ms', trendDir: 'up' as const, hint: 'cosine k=10' },
      { label: 'Recall@10', value: '0.90', trend: '+0.01', trendDir: 'up' as const, hint: 'eval pack' },
      { label: 'Warm namespaces', value: '10', trend: '0', trendDir: 'up' as const, hint: 'ready to query' }
    ],
    week: [
      { label: 'Indexed vectors', value: '4.06M', trend: '+6.2%', trendDir: 'up' as const, hint: 'this week' },
      { label: 'Query p95', value: '38ms', trend: '-4ms', trendDir: 'down' as const, hint: 'cosine k=10' },
      { label: 'Recall@10', value: '0.91', trend: '+0.03', trendDir: 'up' as const, hint: 'eval pack' },
      { label: 'Warm namespaces', value: '11', trend: '+1', trendDir: 'up' as const, hint: 'ready to query' }
    ],
    month: [
      { label: 'Indexed vectors', value: '3.82M', trend: '+11%', trendDir: 'up' as const, hint: 'this month' },
      { label: 'Query p95', value: '36ms', trend: '-7ms', trendDir: 'down' as const, hint: 'cosine k=10' },
      { label: 'Recall@10', value: '0.92', trend: '+0.04', trendDir: 'up' as const, hint: 'eval pack' },
      { label: 'Warm namespaces', value: '12', trend: '+2', trendDir: 'up' as const, hint: 'ready to query' }
    ]
  } as Record<'day' | 'week' | 'month', Metric[]>,
  alerts: [
    {
      heading: 'docs-prod is rebuilding shards 4–6',
      content: 'Maya Poluru queued a HNSW rebuild after the nightly upsert. Query traffic stays on the previous snapshot.'
    },
    {
      heading: 'support-faq namespace eu-live is cooling',
      content: 'Kavya Poluru reduced replicas after traffic dropped. p95 is still 29ms.'
    },
    {
      heading: 'image-clips recall dipped on canary',
      content: 'Ishaan Poluru’s CLIP pack scored 0.81. Neighbors look noisy on product stills.'
    },
    {
      heading: 'session-memory legal-hold is frozen',
      content: 'Priya Poluru froze writes. Reads stay open for the audit window.'
    }
  ],
  activity: [
    { title: 'Upsert batch landed', detail: 'docs-prod · 48k vectors · Maya Poluru', status: 'Indexed', time: '4 min ago' },
    { title: 'Similarity query', detail: 'support-faq · k=12 · Kavya Poluru', status: 'Querying', time: '11 min ago' },
    { title: 'Namespace warmed', detail: 'us-live · code-search · Nikhil Poluru', status: 'Warm', time: '28 min ago' },
    { title: 'Neighbor inspect', detail: 'vec_1842 · 0.94 cosine · Arjun Poluru', status: 'Match', time: '41 min ago' },
    { title: 'Cluster drift watch', detail: 'image-clips · stills · Ishaan Poluru', status: 'Watch', time: '2 hr ago' },
    { title: 'Index snapshot', detail: 'session-memory · Anika Poluru', status: 'Ready', time: 'Yesterday' }
  ],
  indexes: [
    {
      id: 'docs-prod',
      name: 'docs-prod',
      metric: 'cosine',
      dimensions: 1536,
      vectors: 2_410_000,
      namespaces: 4,
      status: 'Rebuilding',
      owner: 'Maya Poluru',
      region: 'eu-central-1',
      detail: 'Policy and handbook chunks. HNSW rebuild on shards 4–6.'
    },
    {
      id: 'support-faq',
      name: 'support-faq',
      metric: 'cosine',
      dimensions: 768,
      vectors: 412_000,
      namespaces: 3,
      status: 'Healthy',
      owner: 'Kavya Poluru',
      region: 'eu-central-1',
      detail: 'FAQ answers for Lattice copilots and Maya Poluru’s eval pack.'
    },
    {
      id: 'code-search',
      name: 'code-search',
      metric: 'dot',
      dimensions: 1024,
      vectors: 1_120_000,
      namespaces: 2,
      status: 'Healthy',
      owner: 'Nikhil Poluru',
      region: 'us-east-1',
      detail: 'Repo embeddings for Quill Copilot.'
    },
    {
      id: 'image-clips',
      name: 'image-clips',
      metric: 'l2',
      dimensions: 512,
      vectors: 88_400,
      namespaces: 2,
      status: 'Stale',
      owner: 'Ishaan Poluru',
      region: 'us-west-2',
      detail: 'Product stills. Canary recall dropped to 0.81.'
    },
    {
      id: 'session-memory',
      name: 'session-memory',
      metric: 'cosine',
      dimensions: 1536,
      vectors: 62_200,
      namespaces: 2,
      status: 'Healthy',
      owner: 'Anika Poluru',
      region: 'eu-central-1',
      detail: 'Short-lived conversation memory with a 14-day TTL.'
    }
  ] as IndexRow[],
  namespaces: [
    {
      id: 'eu-live',
      name: 'eu-live',
      index: 'docs-prod',
      vectors: 1_820_000,
      status: 'Querying',
      owner: 'Maya Poluru',
      p95: '36ms',
      detail: 'Primary EU traffic. Rebuild is isolated to a shadow graph.'
    },
    {
      id: 'us-live',
      name: 'us-live',
      index: 'docs-prod',
      vectors: 410_000,
      status: 'Warm',
      owner: 'Arjun Poluru',
      p95: '42ms',
      detail: 'US replica. Catching up after the 48k upsert.'
    },
    {
      id: 'staging',
      name: 'staging',
      index: 'support-faq',
      vectors: 64_000,
      status: 'Warm',
      owner: 'Kavya Poluru',
      p95: '22ms',
      detail: 'Draft FAQs before they promote to eu-live.'
    },
    {
      id: 'canary',
      name: 'canary',
      index: 'image-clips',
      vectors: 12_400,
      status: 'Cooling',
      owner: 'Ishaan Poluru',
      p95: '51ms',
      detail: 'CLIP canary. Neighbors look noisy on dark stills.'
    },
    {
      id: 'legal-hold',
      name: 'legal-hold',
      index: 'session-memory',
      vectors: 8_200,
      status: 'Frozen',
      owner: 'Priya Poluru',
      p95: '19ms',
      detail: 'Writes frozen. Reads stay open for the audit window.'
    },
    {
      id: 'code-us',
      name: 'code-us',
      index: 'code-search',
      vectors: 980_000,
      status: 'Warm',
      owner: 'Nikhil Poluru',
      p95: '31ms',
      detail: 'Default namespace for Quill Copilot.'
    }
  ] as NamespaceRow[],
  vectors: [
    {
      id: 'vec_1842',
      index: 'docs-prod',
      namespace: 'eu-live',
      preview: 'Rotate API keys every 90 days and store hashes only.',
      owner: 'Maya Poluru',
      score: 0.94,
      status: 'Indexed',
      dims: 1536
    },
    {
      id: 'vec_1840',
      index: 'support-faq',
      namespace: 'eu-live',
      preview: 'Refunds are issued within 30 days with a prepaid label.',
      owner: 'Kavya Poluru',
      score: 0.91,
      status: 'Indexed',
      dims: 768
    },
    {
      id: 'vec_1836',
      index: 'code-search',
      namespace: 'code-us',
      preview: 'export function embed(text: string): Float32Array',
      owner: 'Nikhil Poluru',
      score: 0.88,
      status: 'Indexed',
      dims: 1024
    },
    {
      id: 'vec_1829',
      index: 'image-clips',
      namespace: 'canary',
      preview: 'SKU-440 still · dark studio lighting',
      owner: 'Ishaan Poluru',
      score: 0.71,
      status: 'Stale',
      dims: 512
    },
    {
      id: 'vec_1822',
      index: 'session-memory',
      namespace: 'legal-hold',
      preview: 'Customer asked to export chat history for legal.',
      owner: 'Priya Poluru',
      score: 0.86,
      status: 'Indexed',
      dims: 1536
    },
    {
      id: 'vec_1818',
      index: 'docs-prod',
      namespace: 'us-live',
      preview: 'PII must be redacted before it lands in the prompt log.',
      owner: 'Arjun Poluru',
      score: 0.9,
      status: 'Indexed',
      dims: 1536
    },
    {
      id: 'vec_1811',
      index: 'support-faq',
      namespace: 'staging',
      preview: 'Night coverage cites the status page, not the outage channel.',
      owner: 'Rohan Poluru',
      score: 0.83,
      status: 'Pending',
      dims: 768
    },
    {
      id: 'vec_1804',
      index: 'code-search',
      namespace: 'code-us',
      preview: 'hnswlib::HierarchicalNSW<float> index(space, dim);',
      owner: 'Dev Poluru',
      score: 0.87,
      status: 'Indexed',
      dims: 1024
    }
  ] as VectorRow[],
  neighbors: [
    { id: 'n-01', source: 'vec_1842', neighbor: 'vec_1818', score: 0.94, namespace: 'eu-live', owner: 'Maya Poluru', status: 'Match' },
    { id: 'n-02', source: 'vec_1842', neighbor: 'vec_1840', score: 0.81, namespace: 'eu-live', owner: 'Kavya Poluru', status: 'Match' },
    { id: 'n-03', source: 'vec_1840', neighbor: 'vec_1811', score: 0.77, namespace: 'staging', owner: 'Rohan Poluru', status: 'Watch' },
    { id: 'n-04', source: 'vec_1836', neighbor: 'vec_1804', score: 0.89, namespace: 'code-us', owner: 'Nikhil Poluru', status: 'Match' },
    { id: 'n-05', source: 'vec_1829', neighbor: 'vec_stills_09', score: 0.54, namespace: 'canary', owner: 'Ishaan Poluru', status: 'Weak' },
    { id: 'n-06', source: 'vec_1822', neighbor: 'vec_1842', score: 0.62, namespace: 'legal-hold', owner: 'Priya Poluru', status: 'Watch' }
  ] as NeighborRow[],
  clusters: [
    {
      id: 'c-policy',
      label: 'Policy language',
      size: 18400,
      cohesion: 0.92,
      index: 'docs-prod',
      owner: 'Maya Poluru',
      status: 'Stable',
      detail: 'Retention, PII, and key-rotation chunks stay tight.'
    },
    {
      id: 'c-refund',
      label: 'Refunds and credits',
      size: 6200,
      cohesion: 0.88,
      index: 'support-faq',
      owner: 'Kavya Poluru',
      status: 'Stable',
      detail: 'Prepaid-label replies cluster next to invoice credits.'
    },
    {
      id: 'c-code',
      label: 'Index internals',
      size: 9100,
      cohesion: 0.84,
      index: 'code-search',
      owner: 'Nikhil Poluru',
      status: 'Stable',
      detail: 'HNSW and IVF source files share a neighborhood.'
    },
    {
      id: 'c-stills',
      label: 'Dark product stills',
      size: 1400,
      cohesion: 0.61,
      index: 'image-clips',
      owner: 'Ishaan Poluru',
      status: 'Drift',
      detail: 'Studio lighting is pulling neighbors off the SKU pack.'
    },
    {
      id: 'c-memory',
      label: 'Legal exports',
      size: 420,
      cohesion: 0.73,
      index: 'session-memory',
      owner: 'Priya Poluru',
      status: 'Watch',
      detail: 'Hold namespace is small but drifting toward policy docs.'
    }
  ] as ClusterRow[],
  hourly: [
    { hour: '8a', value: 22 },
    { hour: '9a', value: 38 },
    { hour: '10', value: 54 },
    { hour: '11', value: 71 },
    { hour: '12', value: 48 },
    { hour: '1p', value: 66 },
    { hour: '2p', value: 88 },
    { hour: '3p', value: 74 },
    { hour: '4p', value: 41 },
    { hour: '5p', value: 24 }
  ],
  owners: [
    { name: 'Maya Poluru', focus: 'docs-prod', load: 86 },
    { name: 'Kavya Poluru', focus: 'support-faq', load: 71 },
    { name: 'Nikhil Poluru', focus: 'code-search', load: 64 },
    { name: 'Ishaan Poluru', focus: 'image-clips', load: 58 },
    { name: 'Anika Poluru', focus: 'session-memory', load: 44 }
  ],
  sla: [
    { label: 'Query p95 under 50ms', value: 94 },
    { label: 'Recall@10', value: 91 },
    { label: 'Warm replica coverage', value: 88 },
    { label: 'Upsert success', value: 97 }
  ],
  metricsList: ['cosine', 'dot', 'l2'],
  ownersList: [
    'Maya Poluru',
    'Kavya Poluru',
    'Arjun Poluru',
    'Nikhil Poluru',
    'Ishaan Poluru',
    'Anika Poluru',
    'Priya Poluru',
    'Rohan Poluru'
  ]
};
