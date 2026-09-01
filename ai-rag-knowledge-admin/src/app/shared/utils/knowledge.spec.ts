import { templateConfig } from '../../core/config/template.config';
import {
  collectionTree,
  filterCollections,
  filterSources,
  groundedHits,
  hybridRequest,
  paginate,
  parseScore,
  patchAcl,
  pinCollection,
  retryJob,
  retrievalMode,
  selectedCollectionLabel,
  selectedCollectionOwner,
  slug
} from './knowledge';

describe('filterSources', () => {
  const rows = templateConfig.sources;

  it('matches name, owner, or connector', () => {
    expect(filterSources(rows, 'Legal').every((row) => row.name.includes('Legal') || row.collection === 'Legal')).toBe(true);
    expect(filterSources(rows, 'Nikhil Poluru').every((row) => row.owner === 'Nikhil Poluru')).toBe(true);
    expect(filterSources(rows, 'Zendesk').every((row) => row.type === 'Zendesk')).toBe(true);
  });

  it('applies status and collection tags', () => {
    const tagged = filterSources(rows, '', ['Healthy']);
    expect(tagged.every((row) => row.status === 'Healthy')).toBe(true);
    expect(filterSources(rows, '', ['Engineering']).every((row) => row.collection === 'Engineering')).toBe(true);
  });

  it('returns an empty list when nothing matches', () => {
    expect(filterSources(rows, 'zzzz-not-a-source')).toEqual([]);
  });
});

describe('paginate / parseScore / groundedHits', () => {
  it('slices a page and treats invalid pages as the first page', () => {
    const rows = [1, 2, 3, 4, 5, 6];
    expect(paginate(rows, 2, 2)).toEqual([3, 4]);
    expect(paginate(rows, 0, 2)).toEqual([1, 2]);
  });

  it('parses retrieval scores and drops weak hits', () => {
    expect(parseScore('0.94')).toBe(0.94);
    expect(parseScore('n/a')).toBe(0);
    const hits = groundedHits(templateConfig.queries, 0.85, 3);
    expect(hits.length).toBeLessThanOrEqual(3);
    expect(hits.every((hit) => parseScore(hit.score) >= 0.85)).toBe(true);
  });
});

describe('hybridRequest / retrievalMode', () => {
  it('serializes the playground request and maps tab indexes', () => {
    expect(hybridRequest('How do we rotate API keys?', 8, 'hybrid', 'Nikhil Poluru')).toContain('"top_k": 8');
    expect(retrievalMode(0)).toBe('hybrid');
    expect(retrievalMode(1)).toBe('dense');
    expect(retrievalMode(2)).toBe('keyword');
  });
});

describe('collectionTree', () => {
  it('groups sources under Indigo Vault by collection', () => {
    const tree = collectionTree(templateConfig.collections, templateConfig.sources);
    expect(tree[0].id).toBe('library');
    expect(tree[0].children?.some((node) => node.label === 'Public')).toBe(true);
    const publicNode = tree[0].children?.find((node) => node.id === 'public');
    expect(publicNode?.children?.some((node) => node.id === slug('Product documentation'))).toBe(true);
  });

  it('resolves selected labels and owners', () => {
    expect(selectedCollectionLabel('library', templateConfig.collections, templateConfig.sources)).toBe('Indigo Vault');
    expect(selectedCollectionLabel('legal', templateConfig.collections, templateConfig.sources)).toBe('Legal');
    expect(selectedCollectionLabel('api-reference', templateConfig.collections, templateConfig.sources)).toBe('API reference');
    expect(selectedCollectionOwner('Legal', templateConfig.collections, templateConfig.sources, 'Fallback')).toBe('Venkata Poluru');
    expect(selectedCollectionOwner('Unknown', templateConfig.collections, templateConfig.sources, 'Ananya Poluru')).toBe(
      'Ananya Poluru'
    );
  });
});

describe('retryJob / patchAcl / pinCollection', () => {
  it('retries a failed crawl', () => {
    const next = retryJob(templateConfig.indexJobs, 'IDX-4394');
    const job = next.find((item) => item.id === 'IDX-4394');
    expect(job?.status).toBe('Running');
    expect(job?.stage).toBe('Crawl');
    expect(job?.progress).toBe(8);
  });

  it('approves an ACL review', () => {
    const next = patchAcl(templateConfig.aclReviews, 'ACL-412', 'Approved');
    expect(next.find((item) => item.id === 'ACL-412')?.status).toBe('Approved');
  });

  it('pins and filters collections', () => {
    const pinned = pinCollection(templateConfig.collections, 'Support');
    expect(pinned.find((item) => item.name === 'Support')?.pinned).toBe(true);
    expect(filterCollections(pinned, 'Pinned').every((item) => item.pinned)).toBe(true);
    expect(filterCollections(pinned, 'Restricted').every((item) => item.visibility === 'Restricted')).toBe(true);
  });
});
