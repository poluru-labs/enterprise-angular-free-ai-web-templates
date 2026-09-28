import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, computed, signal } from '@angular/core';
import {
  EdsAccordionComponent,
  EdsAlertComponent,
  EdsAutocompleteComponent,
  EdsAvatarComponent,
  EdsBadgeComponent,
  EdsBreadcrumbComponent,
  EdsButtonComponent,
  EdsButtonGroupComponent,
  EdsCardComponent,
  EdsCheckboxComponent,
  EdsCircularProgressComponent,
  EdsCodeSnippetComponent,
  EdsComboboxComponent,
  EdsDataTableComponent,
  EdsDateRangePickerComponent,
  EdsDescriptionListComponent,
  EdsDividerComponent,
  EdsDrawerComponent,
  EdsDropdownMenuComponent,
  EdsEmptyStateComponent,
  EdsIconComponent,
  EdsInputComponent,
  EdsKbdComponent,
  EdsLinkComponent,
  EdsListComponent,
  EdsMenuItemComponent,
  EdsMeterComponent,
  EdsModalComponent,
  EdsNumberInputComponent,
  EdsPaginationComponent,
  EdsPopoverComponent,
  EdsProgressBarComponent,
  EdsRadioComponent,
  EdsRadioGroupComponent,
  EdsRatingComponent,
  EdsSearchComponent,
  EdsSegmentedControlComponent,
  EdsSelectComponent,
  EdsSideNavComponent,
  EdsSliderComponent,
  EdsSpinnerComponent,
  EdsSplitButtonComponent,
  EdsStatComponent,
  EdsStatusComponent,
  EdsStepperComponent,
  EdsSwitchComponent,
  EdsTabsComponent,
  EdsTagComponent,
  EdsTextareaComponent,
  EdsTimePickerComponent,
  EdsTimelineComponent,
  EdsToastComponent,
  EdsToolbarComponent,
  EdsTreeViewComponent,
  EdsVisuallyHiddenComponent,
} from '@poluru-labs/enterprise-design-system-angular';

type Mode = 'keyword' | 'semantic' | 'hybrid';
type Source = 'Handbook' | 'IT Help' | 'Engineering' | 'Support' | 'Finance';

interface Doc {
  id: string;
  title: string;
  source: Source;
  access: 'All staff' | 'Engineering' | 'Finance';
  owner: string;
  updatedDays: number;
  body: string;
  concepts: Record<string, number>;
}

interface Config {
  mode: Mode;
  alpha: number;
  topK: number;
  minScore: number;
  recency: number;
  titleBoost: boolean;
  weights: Record<Source, number>;
}

interface Pin { id: string; phrase: string; docId: string; }
interface Synonym { id: string; terms: string[]; }
interface TestQuery { query: string; relevant: Record<string, number>; }

interface Hit {
  doc: Doc;
  keyword: number;
  semantic: number;
  boost: number;
  score: number;
  pinned: boolean;
}

const STOP = new Set(['a', 'an', 'the', 'to', 'of', 'for', 'in', 'on', 'and', 'or', 'is', 'my', 'i', 'how', 'do', 'what', 'can', 'with', 'when', 'where', 'does', 'we', 'our', 'be', 'at', 'it', 'get']);

const CONCEPTS: Record<string, string> = {
  vacation: 'leave', pto: 'leave', leave: 'leave', holiday: 'leave', holidays: 'leave', time: 'leave', off: 'leave', sick: 'leave', parental: 'family', maternity: 'family', paternity: 'family', family: 'family', baby: 'family',
  expense: 'expense', expenses: 'expense', reimburse: 'expense', reimbursement: 'expense', receipt: 'expense', receipts: 'expense', travel: 'travel', flight: 'travel', hotel: 'travel', trip: 'travel', per: 'travel', diem: 'travel',
  laptop: 'device', hardware: 'device', device: 'device', monitor: 'device', computer: 'device', replace: 'device', broken: 'device',
  password: 'access', sso: 'access', login: 'access', mfa: 'access', locked: 'access', reset: 'access', account: 'access',
  onboarding: 'onboarding', onboard: 'onboarding', hire: 'onboarding', new: 'onboarding', first: 'onboarding', week: 'onboarding', start: 'onboarding',
  deploy: 'deploy', deployment: 'deploy', release: 'deploy', rollback: 'deploy', ship: 'deploy', production: 'deploy', pipeline: 'deploy',
  incident: 'incident', outage: 'incident', pager: 'incident', oncall: 'incident', 'on-call': 'incident', sev: 'incident', postmortem: 'incident', down: 'incident',
  refund: 'billing', refunds: 'billing', cancel: 'billing', billing: 'billing', invoice: 'billing', charge: 'billing', subscription: 'billing', customer: 'billing',
  security: 'security', phishing: 'security', vpn: 'security', suspicious: 'security', email: 'security', report: 'security',
  budget: 'budget', purchase: 'budget', vendor: 'budget', approval: 'budget', procurement: 'budget', buy: 'budget',
  remote: 'remote', home: 'remote', hybrid: 'remote', office: 'remote', wfh: 'remote',
};

@Component({
  selector: 'app-root',
  imports: [
    TitleCasePipe,
    EdsAccordionComponent, EdsAlertComponent, EdsAutocompleteComponent, EdsAvatarComponent, EdsBadgeComponent, EdsBreadcrumbComponent,
    EdsButtonComponent, EdsButtonGroupComponent, EdsCardComponent, EdsCheckboxComponent, EdsCircularProgressComponent, EdsCodeSnippetComponent,
    EdsComboboxComponent, EdsDataTableComponent, EdsDateRangePickerComponent, EdsDescriptionListComponent, EdsDividerComponent, EdsDrawerComponent,
    EdsDropdownMenuComponent, EdsEmptyStateComponent, EdsIconComponent, EdsInputComponent, EdsKbdComponent, EdsLinkComponent, EdsListComponent,
    EdsMenuItemComponent, EdsMeterComponent, EdsModalComponent, EdsNumberInputComponent, EdsPaginationComponent, EdsPopoverComponent,
    EdsProgressBarComponent, EdsRadioComponent, EdsRadioGroupComponent, EdsRatingComponent, EdsSearchComponent, EdsSegmentedControlComponent,
    EdsSelectComponent, EdsSideNavComponent, EdsSliderComponent, EdsSpinnerComponent, EdsSplitButtonComponent, EdsStatComponent, EdsStatusComponent,
    EdsStepperComponent, EdsSwitchComponent, EdsTabsComponent, EdsTagComponent, EdsTextareaComponent, EdsTimePickerComponent, EdsTimelineComponent,
    EdsToastComponent, EdsToolbarComponent, EdsTreeViewComponent, EdsVisuallyHiddenComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnDestroy {
  readonly sources: Source[] = ['Handbook', 'IT Help', 'Engineering', 'Support', 'Finance'];
  readonly docs: Doc[] = [
    { id: 'D-101', title: 'Paid time off policy', source: 'Handbook', access: 'All staff', owner: 'Lakshmi Poluru', updatedDays: 40, body: 'Full-time staff accrue 20 days of paid time off each year. Request vacation in the HR portal at least two weeks ahead. Unused days roll over up to five days.', concepts: { leave: 1 } },
    { id: 'D-102', title: 'Parental and family leave', source: 'Handbook', access: 'All staff', owner: 'Lakshmi Poluru', updatedDays: 120, body: 'Primary caregivers receive 16 weeks of paid leave and secondary caregivers receive 8 weeks. Notify your manager and HR partner 30 days before the expected date.', concepts: { family: 1, leave: 0.6 } },
    { id: 'D-103', title: 'Sick days and medical appointments', source: 'Handbook', access: 'All staff', owner: 'Lakshmi Poluru', updatedDays: 300, body: 'Sick days do not count against PTO. Tell your manager the same morning. For absences longer than three days, a doctor note is needed.', concepts: { leave: 0.8 } },
    { id: 'D-104', title: 'Submitting expense reports', source: 'Finance', access: 'All staff', owner: 'Harish Poluru', updatedDays: 15, body: 'Submit expenses within 30 days with an itemized receipt. Reimbursement is paid with the next payroll run after manager approval.', concepts: { expense: 1 } },
    { id: 'D-105', title: 'Travel booking and per diem', source: 'Finance', access: 'All staff', owner: 'Harish Poluru', updatedDays: 60, body: 'Book flights and hotels through the travel desk. Per diem covers meals at the published city rate. Keep receipts for anything above the rate.', concepts: { travel: 1, expense: 0.5 } },
    { id: 'D-106', title: 'Purchase approvals and vendors', source: 'Finance', access: 'Finance', owner: 'Harish Poluru', updatedDays: 200, body: 'Purchases above $5,000 need a purchase order and two approvals. New vendors complete a security and tax review before the first invoice.', concepts: { budget: 1, billing: 0.2 } },
    { id: 'D-107', title: 'Request or replace a laptop', source: 'IT Help', access: 'All staff', owner: 'Varun Poluru', updatedDays: 25, body: 'Open an IT ticket to request new hardware. Broken laptops are swapped at the service desk the same day. Standard refresh is every three years.', concepts: { device: 1 } },
    { id: 'D-108', title: 'Reset your password or MFA', source: 'IT Help', access: 'All staff', owner: 'Varun Poluru', updatedDays: 8, body: 'Use the self-service portal to reset your SSO password. If your account is locked or you lost your MFA device, call the service desk with your employee ID.', concepts: { access: 1, device: 0.2 } },
    { id: 'D-109', title: 'VPN and remote access', source: 'IT Help', access: 'All staff', owner: 'Varun Poluru', updatedDays: 90, body: 'Connect to the VPN before opening internal tools from home. The client installs automatically on managed laptops.', concepts: { remote: 0.7, security: 0.5, access: 0.4 } },
    { id: 'D-110', title: 'Report a phishing email', source: 'IT Help', access: 'All staff', owner: 'Varun Poluru', updatedDays: 30, body: 'Use the Report button in your mail client for any suspicious email. Do not click links. The security team replies within one business hour.', concepts: { security: 1 } },
    { id: 'D-111', title: 'Your first week', source: 'Handbook', access: 'All staff', owner: 'Gayatri Poluru', updatedDays: 45, body: 'New hires meet their buddy on day one, finish account setup, and join the Wednesday welcome session. Your laptop is ready at the front desk.', concepts: { onboarding: 1, device: 0.2 } },
    { id: 'D-112', title: 'Hybrid work guidelines', source: 'Handbook', access: 'All staff', owner: 'Gayatri Poluru', updatedDays: 150, body: 'Teams choose two shared office days each week. Working from home on other days is fine with your manager’s agreement.', concepts: { remote: 1 } },
    { id: 'D-113', title: 'Release and rollback runbook', source: 'Engineering', access: 'Engineering', owner: 'Karthik Poluru', updatedDays: 12, body: 'Deploy through the pipeline only. Watch error rates for 15 minutes after each production release. Roll back with one command if alerts fire.', concepts: { deploy: 1, incident: 0.3 } },
    { id: 'D-114', title: 'Incident response and on-call', source: 'Engineering', access: 'Engineering', owner: 'Karthik Poluru', updatedDays: 20, body: 'The on-call engineer acknowledges a page within five minutes, opens an incident channel, and posts updates every 30 minutes. A postmortem follows every sev 1.', concepts: { incident: 1 } },
    { id: 'D-115', title: 'Customer refunds and cancellations', source: 'Support', access: 'All staff', owner: 'Divya Poluru', updatedDays: 35, body: 'Refunds within 30 days of the charge are approved by support. Cancelling a subscription stops the next invoice but keeps access until the period ends.', concepts: { billing: 1 } },
    { id: 'D-116', title: 'Escalating a customer outage', source: 'Support', access: 'All staff', owner: 'Divya Poluru', updatedDays: 70, body: 'If several customers report the product is down, page the on-call engineer and post a status page update. Keep the customer informed every hour.', concepts: { incident: 0.8, billing: 0.2 } },
  ];

  readonly page = signal(0);
  readonly query = signal('how do I get reimbursed for a hotel');
  readonly mode = signal<Mode>('hybrid');
  readonly alpha = signal(0.6);
  readonly topK = signal(5);
  readonly minScore = signal(0.05);
  readonly recency = signal(0.1);
  readonly titleBoost = signal(true);
  readonly weights = signal<Record<Source, number>>({ Handbook: 1, 'IT Help': 1, Engineering: 1, Support: 1, Finance: 1 });
  readonly sourceFilter = signal<Record<Source, boolean>>({ Handbook: true, 'IT Help': true, Engineering: true, Support: true, Finance: true });
  readonly accessAs = signal('All staff');
  readonly showBreakdown = signal(true);
  readonly history = signal<string[]>(['laptop is broken', 'pto rollover', 'customer wants a refund', 'production is down']);
  readonly feedback = signal<Record<string, number>>({});
  readonly pins = signal<Pin[]>([{ id: 'p1', phrase: 'first day', docId: 'D-111' }]);
  readonly synonyms = signal<Synonym[]>([
    { id: 's1', terms: ['pto', 'vacation', 'time off'] },
    { id: 's2', terms: ['reimburse', 'expense', 'claim'] },
    { id: 's3', terms: ['outage', 'down', 'incident'] },
  ]);
  readonly newSynonym = signal('');
  readonly newPinPhrase = signal('');
  readonly newPinDoc = signal('D-104');
  readonly baseline = signal<{ config: Config; ndcg: number; mrr: number; recall: number } | null>(null);
  readonly evalPage = signal(1);
  readonly analyticsStart = signal('2026-09-01');
  readonly analyticsEnd = signal('2026-09-27');
  readonly drawerDocId = signal<string | null>(null);
  readonly modal = signal<'index' | 'test' | null>(null);
  readonly newIndexName = signal('');
  readonly newIndexSource = signal('Support');
  readonly chunkSize = signal(512);
  readonly chunkOverlap = signal(64);
  readonly newTestQuery = signal('');
  readonly newTestDocs = signal('');
  readonly reindexing = signal<string | null>(null);
  readonly reindexProgress = signal(0);
  readonly defaultMode = signal('hybrid');
  readonly cacheMinutes = signal(15);
  readonly syncTime = signal('02:00');
  readonly logQueries = signal(true);
  readonly teamSort = signal<{ key: string; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });
  readonly notice = signal('');
  readonly error = signal('');
  readonly toastOpen = signal(false);
  readonly toastTitle = signal('');
  readonly toastBody = signal('');
  readonly menuOpen = signal(false);
  readonly helpOpen = signal(false);
  readonly showIntro = signal(true);
  private timers: ReturnType<typeof setInterval>[] = [];

  readonly nav = [
    { label: 'Search' }, { label: 'Tuning' }, { label: 'Evaluation' }, { label: 'Rules' },
    { label: 'Indexes' }, { label: 'Analytics' }, { label: 'Team' }, { label: 'Settings' },
  ];
  readonly headings = [
    { eyebrow: 'PLAYGROUND', title: 'Semantic Search Console', summary: 'Configure and test semantic and hybrid search over enterprise knowledge with relevance tuning.' },
    { eyebrow: 'RELEVANCE', title: 'Tuning', summary: 'Balance keyword and meaning-based matching, boost sources, and favor fresh content.' },
    { eyebrow: 'QUALITY', title: 'Evaluation', summary: 'Score the current settings against a set of test queries with known good answers.' },
    { eyebrow: 'CURATION', title: 'Rules', summary: 'Synonyms that widen keyword matching and pinned answers for known phrases.' },
    { eyebrow: 'CONTENT', title: 'Indexes', summary: 'Connected knowledge sources, chunking settings, and sync status.' },
    { eyebrow: 'USAGE', title: 'Analytics', summary: 'What people search for, what they click, and where search comes up empty.' },
    { eyebrow: 'PEOPLE', title: 'Team', summary: 'Owners of each knowledge source and the people tuning search.' },
    { eyebrow: 'WORKSPACE', title: 'Settings', summary: 'Defaults for new searches, caching, sync schedule, and logging.' },
  ];
  readonly modes = [{ label: 'Keyword', value: 'keyword' }, { label: 'Semantic', value: 'semantic' }, { label: 'Hybrid', value: 'hybrid' }];
  readonly accessOptions = [{ label: 'All staff', value: 'All staff' }, { label: 'Engineering', value: 'Engineering' }, { label: 'Finance', value: 'Finance' }];
  readonly docOptions = this.docs.map((doc) => ({ label: `${doc.id} · ${doc.title}`, value: doc.id }));
  readonly sourceOptions = this.sources.map((source) => ({ label: source, value: source }));
  readonly suggestions = ['expense report deadline', 'reset mfa', 'parental leave weeks', 'rollback a release', 'report phishing', 'work from home days', 'new vendor approval'];
  readonly savedSearches = ['Leave questions', 'IT self-service', 'On-call basics'];
  readonly savedQueries: Record<string, string> = { 'Leave questions': 'time off for a new baby', 'IT self-service': 'locked out of my account', 'On-call basics': 'what to do when production is down' };
  readonly steps = [
    { label: 'Fetch', description: 'Pull pages from the source' },
    { label: 'Chunk', description: 'Split into passages' },
    { label: 'Index', description: 'Write keyword and vector entries' },
    { label: 'Live', description: 'Serving queries' },
  ];
  readonly testSet = signal<TestQuery[]>([
    { query: 'how many vacation days do I get', relevant: { 'D-101': 3, 'D-103': 1 } },
    { query: 'time off for a new baby', relevant: { 'D-102': 3, 'D-101': 1 } },
    { query: 'get money back for a hotel', relevant: { 'D-105': 3, 'D-104': 2 } },
    { query: 'locked out of my account', relevant: { 'D-108': 3 } },
    { query: 'my computer is broken', relevant: { 'D-107': 3 } },
    { query: 'what to do when production is down', relevant: { 'D-114': 3, 'D-116': 2, 'D-113': 1 } },
    { query: 'customer wants their money back', relevant: { 'D-115': 3 } },
    { query: 'suspicious email', relevant: { 'D-110': 3 } },
    { query: 'working from home', relevant: { 'D-112': 3, 'D-109': 1 } },
    { query: 'buying software from a new supplier', relevant: { 'D-106': 3 } },
  ]);
  readonly indexes = signal([
    { name: 'people-handbook', source: 'Handbook', docs: 5, passages: 142, synced: 'Today, 02:00', status: 'Live', chunk: 512 },
    { name: 'it-help', source: 'IT Help', docs: 4, passages: 88, synced: 'Today, 02:00', status: 'Live', chunk: 384 },
    { name: 'eng-runbooks', source: 'Engineering', docs: 2, passages: 61, synced: 'Today, 02:04', status: 'Live', chunk: 512 },
    { name: 'support-kb', source: 'Support', docs: 2, passages: 47, synced: 'Yesterday, 02:00', status: 'Stale', chunk: 256 },
    { name: 'finance-policies', source: 'Finance', docs: 3, passages: 73, synced: 'Today, 02:01', status: 'Live', chunk: 512 },
  ]);
  readonly team = [
    { name: 'Nandini Poluru', role: 'Search lead', area: 'Relevance tuning', queries: 412 },
    { name: 'Lakshmi Poluru', role: 'People ops', area: 'Handbook', queries: 96 },
    { name: 'Varun Poluru', role: 'IT support', area: 'IT Help', queries: 188 },
    { name: 'Karthik Poluru', role: 'Engineer', area: 'Engineering', queries: 74 },
    { name: 'Divya Poluru', role: 'Support lead', area: 'Support', queries: 151 },
    { name: 'Harish Poluru', role: 'Finance partner', area: 'Finance', queries: 63 },
  ];
  readonly teamColumns = [{ key: 'name', label: 'Member' }, { key: 'role', label: 'Role' }, { key: 'area', label: 'Owns' }, { key: 'queries', label: 'Test queries run' }];
  readonly topQueries = [
    { query: 'pto rollover', count: 184, ctr: 0.71 },
    { query: 'expense deadline', count: 152, ctr: 0.66 },
    { query: 'reset password', count: 139, ctr: 0.82 },
    { query: 'vpn not connecting', count: 97, ctr: 0.44 },
    { query: 'parental leave', count: 81, ctr: 0.75 },
    { query: 'on-call handoff', count: 58, ctr: 0.39 },
  ];
  readonly zeroResults = [
    { query: 'stock options vesting', count: 23 },
    { query: 'gym reimbursement', count: 17 },
    { query: 'badge replacement', count: 12 },
  ];
  readonly weekly = [320, 410, 385, 460, 520, 498, 575];
  readonly guide = [
    { heading: 'Keyword matching', content: 'Scores passages by how often your exact words (and their synonyms) appear, with titles counting double. Best for names, codes, and exact phrases.', open: true },
    { heading: 'Semantic matching', content: 'Scores passages by topic, so “money back for a hotel” finds the travel and expense pages even without shared words.' },
    { heading: 'Hybrid', content: 'Blends both scores. The balance slider sets how much weight meaning gets over exact words.' },
  ];
  readonly sourceTree = [
    { id: 'kb', label: 'Enterprise knowledge', children: this.sources.map((source) => ({ id: source, label: `${source} (${this.docs.filter((doc) => doc.source === source).length})`, children: this.docs.filter((doc) => doc.source === source).map((doc) => ({ id: doc.id, label: doc.title })) })) },
  ];
  readonly activity = signal([
    { title: 'Nightly sync finished', description: '4 of 5 indexes refreshed', timestamp: 'Today, 02:04', status: 'complete' as const },
    { title: 'Synonym added: outage, down, incident', description: 'Divya Poluru', timestamp: 'Yesterday, 16:20', status: 'complete' as const },
    { title: 'Balance changed to 0.60', description: 'Nandini Poluru', timestamp: 'Sep 25, 11:05', status: 'complete' as const },
  ]);

  readonly Math = Math;
  readonly config = computed<Config>(() => ({
    mode: this.mode(), alpha: this.alpha(), topK: this.topK(), minScore: this.minScore(), recency: this.recency(), titleBoost: this.titleBoost(), weights: this.weights(),
  }));
  readonly breadcrumbs = computed(() => [{ label: 'Search' }, { label: this.nav[this.page()].label }]);
  readonly sideNav = computed(() => this.savedSearches.map((label) => ({ label, active: this.savedQueries[label] === this.query() })));
  readonly historyItems = computed(() => this.history().slice(0, 5).map((label) => ({ label, selected: label === this.query() })));
  readonly terms = computed(() => this.tokenize(this.query()));
  readonly expanded = computed(() => this.expand(this.terms()));
  readonly started = Date.now();
  readonly results = computed(() => this.runSearch(this.query(), this.config(), true));
  readonly hitCount = computed(() => this.results().length);
  readonly topScore = computed(() => this.results()[0]?.score ?? 0);
  readonly latency = computed(() => 18 + this.query().length % 9 + (this.mode() === 'keyword' ? 0 : 14) + (this.titleBoost() ? 6 : 0));
  readonly drawerDoc = computed(() => this.docs.find((doc) => doc.id === this.drawerDocId()) ?? null);
  readonly drawerHit = computed(() => this.results().find((hit) => hit.doc.id === this.drawerDocId()) ?? null);

  readonly evaluation = computed(() => this.evaluate(this.config()));
  readonly evalRows = computed(() => this.evaluation().rows.slice((this.evalPage() - 1) * 5, this.evalPage() * 5));
  readonly modeComparison = computed(() => (['keyword', 'semantic', 'hybrid'] as Mode[]).map((mode) => ({ mode, ...this.evaluate({ ...this.config(), mode }) })));
  readonly configJson = computed(() => JSON.stringify({
    mode: this.mode(), balance: this.alpha(), topK: this.topK(), minScore: this.minScore(), recencyBoost: this.recency(), titleBoost: this.titleBoost(),
    sourceWeights: this.weights(), synonyms: this.synonyms().map((s) => s.terms), pins: this.pins().map(({ phrase, docId }) => ({ phrase, docId })),
  }, null, 2));
  readonly requestJson = computed(() => JSON.stringify({
    query: this.query(), mode: this.mode(), topK: this.topK(),
    filters: { sources: this.sources.filter((s) => this.sourceFilter()[s]), access: this.accessAs() },
  }, null, 2));
  readonly sortedTeam = computed(() => {
    const { key, direction } = this.teamSort();
    return [...this.team].sort((a, b) => {
      const av = a[key as keyof typeof a];
      const bv = b[key as keyof typeof b];
      const cmp = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv));
      return direction === 'asc' ? cmp : -cmp;
    });
  });
  readonly feedbackCount = computed(() => Object.keys(this.feedback()).length);
  readonly totalQueries = computed(() => this.weekly.reduce((sum, value) => sum + value, 0));

  ngOnDestroy(): void {
    this.timers.forEach((timer) => clearInterval(timer));
  }

  navigate(page: number): void {
    this.page.set(page);
    this.error.set('');
  }

  tokenize(text: string): string[] {
    return text.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter((word) => word && !STOP.has(word));
  }

  expand(terms: string[]): string[] {
    const out = new Set(terms);
    for (const group of this.synonyms()) {
      const words = group.terms.flatMap((term) => this.tokenize(term));
      if (terms.some((term) => words.includes(term))) words.forEach((word) => out.add(word));
    }
    return [...out];
  }

  keywordScore(doc: Doc, terms: string[], titleBoost: boolean): number {
    if (!terms.length) return 0;
    const title = this.tokenize(doc.title);
    const body = this.tokenize(doc.body);
    let total = 0;
    for (const term of terms) {
      const tf = body.filter((word) => word === term || (term.length > 4 && word.startsWith(term.slice(0, -1)))).length + (titleBoost ? 2 : 1) * title.filter((word) => word === term).length;
      total += tf / (tf + 1.2);
    }
    return total / Math.max(terms.length, 2);
  }

  semanticScore(doc: Doc, terms: string[]): number {
    const query: Record<string, number> = {};
    for (const term of terms) {
      const concept = CONCEPTS[term];
      if (concept) query[concept] = (query[concept] ?? 0) + 1;
    }
    const keys = Object.keys(query);
    if (!keys.length) return 0;
    const dot = keys.reduce((sum, key) => sum + query[key] * (doc.concepts[key] ?? 0), 0);
    const qn = Math.sqrt(keys.reduce((sum, key) => sum + query[key] ** 2, 0));
    const dn = Math.sqrt(Object.values(doc.concepts).reduce((sum, value) => sum + value ** 2, 0));
    return dot / (qn * dn);
  }

  runSearch(text: string, config: Config, withFilters: boolean): Hit[] {
    const terms = this.tokenize(text);
    const expanded = this.expand(terms);
    const phrase = text.toLowerCase();
    const allowed = (doc: Doc) => !withFilters || (this.sourceFilter()[doc.source] && (doc.access === 'All staff' || doc.access === this.accessAs()));
    const hits = this.docs.filter(allowed).map((doc) => {
      const keyword = this.keywordScore(doc, expanded, config.titleBoost);
      const semantic = this.semanticScore(doc, terms);
      const base = config.mode === 'keyword' ? keyword : config.mode === 'semantic' ? semantic : config.alpha * semantic + (1 - config.alpha) * keyword;
      const fresh = Math.max(0, 1 - doc.updatedDays / 365);
      const boost = config.weights[doc.source] * (1 + config.recency * fresh);
      const pinned = withFilters && this.pins().some((pin) => pin.docId === doc.id && pin.phrase.trim() && phrase.includes(pin.phrase.toLowerCase()));
      return { doc, keyword, semantic, boost, score: Math.round(base * boost * 1000) / 1000, pinned, base };
    });
    return hits
      .filter((hit) => hit.pinned || hit.base >= config.minScore)
      .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.score - a.score)
      .slice(0, config.topK)
      .map(({ base, ...hit }) => hit);
  }

  evaluate(config: Config) {
    const rows = this.testSet().map((test) => {
      const ranked = this.runSearch(test.query, { ...config, topK: 10 }, false).map((hit) => hit.doc.id);
      const gains = ranked.slice(0, 5).map((id) => test.relevant[id] ?? 0);
      const dcg = gains.reduce((sum, gain, i) => sum + (2 ** gain - 1) / Math.log2(i + 2), 0);
      const ideal = Object.values(test.relevant).sort((a, b) => b - a).slice(0, 5).reduce((sum, gain, i) => sum + (2 ** gain - 1) / Math.log2(i + 2), 0);
      const firstRank = ranked.findIndex((id) => (test.relevant[id] ?? 0) > 0);
      const relevantIds = Object.keys(test.relevant);
      const found = relevantIds.filter((id) => ranked.slice(0, 5).includes(id)).length;
      return {
        query: test.query,
        ndcg: ideal ? dcg / ideal : 0,
        rr: firstRank >= 0 ? 1 / (firstRank + 1) : 0,
        recall: relevantIds.length ? found / relevantIds.length : 0,
        top: ranked[0] ? this.docs.find((doc) => doc.id === ranked[0])!.title : 'No results',
        expected: relevantIds.map((id) => this.docs.find((doc) => doc.id === id)?.title ?? id).join(', '),
      };
    });
    const avg = (key: 'ndcg' | 'rr' | 'recall') => rows.length ? rows.reduce((sum, row) => sum + row[key], 0) / rows.length : 0;
    return { rows, ndcg: avg('ndcg'), mrr: avg('rr'), recall: avg('recall') };
  }

  highlight(text: string): { text: string; hit: boolean }[] {
    const terms = new Set(this.expanded());
    return text.split(/(\s+)/).map((part) => {
      const word = part.toLowerCase().replace(/[^a-z0-9-]/g, '');
      return { text: part, hit: !!word && terms.has(word) };
    });
  }

  pct(value: number): number {
    return Math.round(Math.min(1, value) * 100);
  }

  setMode(value: string): void {
    if (value === 'keyword' || value === 'semantic' || value === 'hybrid') this.mode.set(value);
  }

  setQuery(value: string): void {
    this.query.set(value);
  }

  commitQuery(value: string = this.query()): void {
    const text = value.trim();
    if (!text) return;
    this.query.set(text);
    this.history.update((list) => [text, ...list.filter((item) => item !== text)].slice(0, 8));
  }

  onSaved(event: { label: string }): void {
    const text = this.savedQueries[event.label];
    if (text) this.commitQuery(text);
  }

  onHistory(event: { label: string }): void {
    this.commitQuery(event.label);
  }

  toggleSource(source: Source, value: boolean): void {
    this.sourceFilter.update((map) => ({ ...map, [source]: value }));
  }

  setWeight(source: Source, value: number): void {
    this.weights.update((map) => ({ ...map, [source]: Math.round(value) / 100 }));
  }

  rate(docId: string, value: number): void {
    this.feedback.update((map) => ({ ...map, [`${this.query()}::${docId}`]: value }));
    this.notify('Judgment saved', `${value} of 5 for “${this.docs.find((doc) => doc.id === docId)?.title}”.`);
  }

  ratingFor(docId: string): number {
    return this.feedback()[`${this.query()}::${docId}`] ?? 0;
  }

  addToTestSet(): void {
    const judged = Object.entries(this.feedback())
      .filter(([key, value]) => key.startsWith(`${this.query()}::`) && value >= 3)
      .reduce<Record<string, number>>((map, [key, value]) => ({ ...map, [key.split('::')[1]]: value >= 5 ? 3 : value >= 4 ? 2 : 1 }), {});
    if (!Object.keys(judged).length) {
      this.error.set('Rate at least one result 3 stars or higher before adding this query to the test set.');
      return;
    }
    this.testSet.update((list) => [...list.filter((test) => test.query !== this.query()), { query: this.query(), relevant: judged }]);
    this.error.set('');
    this.notify('Added to test set', `“${this.query()}” with ${Object.keys(judged).length} relevant result(s).`);
  }

  saveBaseline(): void {
    const result = this.evaluation();
    this.baseline.set({ config: this.config(), ndcg: result.ndcg, mrr: result.mrr, recall: result.recall });
    this.log('Saved a comparison baseline', `nDCG@5 ${result.ndcg.toFixed(3)}`);
    this.notify('Baseline saved', 'Changes to tuning will now show the difference.');
  }

  restoreBaseline(): void {
    const saved = this.baseline();
    if (!saved) return;
    this.mode.set(saved.config.mode);
    this.alpha.set(saved.config.alpha);
    this.topK.set(saved.config.topK);
    this.minScore.set(saved.config.minScore);
    this.recency.set(saved.config.recency);
    this.titleBoost.set(saved.config.titleBoost);
    this.weights.set(saved.config.weights);
    this.notify('Baseline restored', 'Tuning is back to the saved settings.');
  }

  delta(current: number, key: 'ndcg' | 'mrr' | 'recall'): string {
    const saved = this.baseline();
    if (!saved) return 'No baseline';
    const diff = current - saved[key];
    return `${diff >= 0 ? '+' : '−'}${Math.abs(diff).toFixed(3)} vs baseline`;
  }

  trend(current: number, key: 'ndcg' | 'mrr' | 'recall'): 'up' | 'down' | 'flat' {
    const saved = this.baseline();
    if (!saved) return 'flat';
    const diff = current - saved[key];
    return Math.abs(diff) < 0.0005 ? 'flat' : diff > 0 ? 'up' : 'down';
  }

  resetTuning(): void {
    this.mode.set('hybrid');
    this.alpha.set(0.6);
    this.topK.set(5);
    this.minScore.set(0.05);
    this.recency.set(0.1);
    this.titleBoost.set(true);
    this.weights.set({ Handbook: 1, 'IT Help': 1, Engineering: 1, Support: 1, Finance: 1 });
    this.notify('Tuning reset', 'Default relevance settings restored.');
  }

  addSynonym(): void {
    const terms = this.newSynonym().split(',').map((term) => term.trim().toLowerCase()).filter(Boolean);
    if (terms.length < 2) {
      this.error.set('Enter at least two comma-separated terms, for example: laptop, computer, notebook.');
      return;
    }
    this.synonyms.update((list) => [...list, { id: `s${Date.now()}`, terms }]);
    this.newSynonym.set('');
    this.error.set('');
    this.log(`Synonym added: ${terms.join(', ')}`, 'Nandini Poluru');
    this.notify('Synonym added', terms.join(', '));
  }

  removeSynonymTerm(id: string, term: string): void {
    this.synonyms.update((list) => list.map((group) => (group.id === id ? { ...group, terms: group.terms.filter((item) => item !== term) } : group)).filter((group) => group.terms.length > 1));
  }

  addPin(): void {
    const phrase = this.newPinPhrase().trim().toLowerCase();
    if (phrase.length < 3) {
      this.error.set('Enter a phrase of at least three characters.');
      return;
    }
    this.pins.update((list) => [...list, { id: `p${Date.now()}`, phrase, docId: this.newPinDoc() }]);
    this.newPinPhrase.set('');
    this.error.set('');
    this.log(`Pinned ${this.newPinDoc()} for “${phrase}”`, 'Nandini Poluru');
    this.notify('Pin added', `Queries containing “${phrase}” now show ${this.newPinDoc()} first.`);
  }

  removePin(id: string): void {
    this.pins.update((list) => list.filter((pin) => pin.id !== id));
  }

  docTitle(id: string): string {
    return this.docs.find((doc) => doc.id === id)?.title ?? id;
  }

  openDoc(id: string): void {
    this.drawerDocId.set(id);
  }

  docMeta(doc: Doc) {
    return [
      { term: 'Source', description: doc.source },
      { term: 'Access', description: doc.access },
      { term: 'Owner', description: doc.owner },
      { term: 'Updated', description: `${doc.updatedDays} days ago` },
    ];
  }

  pinCurrent(docId: string): void {
    const phrase = this.query().trim().toLowerCase();
    if (!phrase) return;
    this.pins.update((list) => [...list.filter((pin) => pin.phrase !== phrase), { id: `p${Date.now()}`, phrase, docId }]);
    this.drawerDocId.set(null);
    this.notify('Pinned', `${this.docTitle(docId)} now leads for “${phrase}”.`);
  }

  openModal(kind: 'index' | 'test'): void {
    this.error.set('');
    if (kind === 'test') {
      this.newTestQuery.set(this.query());
      this.newTestDocs.set('');
    } else {
      this.newIndexName.set('');
    }
    this.modal.set(kind);
  }

  closeModal(): void {
    this.modal.set(null);
    this.error.set('');
  }

  createIndex(): void {
    const name = this.newIndexName().trim().toLowerCase();
    if (!/^[a-z0-9-]{3,}$/.test(name)) {
      this.error.set('Use at least three lowercase letters, numbers, or dashes for the index name.');
      return;
    }
    if (this.indexes().some((index) => index.name === name)) {
      this.error.set('An index with that name already exists.');
      return;
    }
    if (this.chunkOverlap() >= this.chunkSize()) {
      this.error.set('Chunk overlap must be smaller than the chunk size.');
      return;
    }
    this.indexes.update((list) => [...list, { name, source: this.newIndexSource(), docs: 0, passages: 0, synced: 'Never', status: 'Empty', chunk: this.chunkSize() }]);
    this.closeModal();
    this.log(`Created index ${name}`, 'Nandini Poluru');
    this.notify('Index created', `${name} is ready for its first sync.`);
  }

  createTest(): void {
    const ids = this.newTestDocs().split(',').map((id) => id.trim().toUpperCase()).filter(Boolean);
    if (!this.newTestQuery().trim()) {
      this.error.set('Enter the test query.');
      return;
    }
    const unknown = ids.filter((id) => !this.docs.some((doc) => doc.id === id));
    if (!ids.length || unknown.length) {
      this.error.set(unknown.length ? `Unknown document ID: ${unknown.join(', ')}.` : 'List at least one expected document ID, for example D-104.');
      return;
    }
    const relevant = ids.reduce<Record<string, number>>((map, id, i) => ({ ...map, [id]: i === 0 ? 3 : 2 }), {});
    this.testSet.update((list) => [...list, { query: this.newTestQuery().trim(), relevant }]);
    this.closeModal();
    this.notify('Test query added', `${this.testSet().length} queries in the test set.`);
  }

  reindex(name: string): void {
    if (this.reindexing()) return;
    this.reindexing.set(name);
    this.reindexProgress.set(0);
    const timer = setInterval(() => {
      const next = Math.min(100, this.reindexProgress() + 12);
      this.reindexProgress.set(next);
      if (next >= 100) {
        clearInterval(timer);
        const source = this.indexes().find((index) => index.name === name)?.source;
        const docs = this.docs.filter((doc) => doc.source === source).length;
        this.indexes.update((list) => list.map((index) => (index.name === name ? { ...index, status: 'Live', synced: 'Just now', docs: docs || index.docs, passages: index.passages || docs * 24 } : index)));
        this.reindexing.set(null);
        this.log(`Re-indexed ${name}`, 'Nandini Poluru');
        this.notify('Sync complete', `${name} is live.`);
      }
    }, 350);
    this.timers.push(timer);
  }

  reindexStep(): number {
    const value = this.reindexProgress();
    return value < 25 ? 0 : value < 60 ? 1 : value < 100 ? 2 : 3;
  }

  statusTone(status: string): 'success' | 'warning' | 'neutral' | 'info' {
    return status === 'Live' ? 'success' : status === 'Stale' ? 'warning' : status === 'Syncing' ? 'info' : 'neutral';
  }

  exportMenu(item: { value: string }): void {
    if (item.value === 'request') this.download(this.requestJson(), 'search-request.json');
    else this.download(this.configJson(), 'search-config.json');
  }

  exportConfig(): void {
    this.download(this.configJson(), 'search-config.json');
  }

  download(body: string, name: string): void {
    const url = URL.createObjectURL(new Blob([body], { type: 'application/json' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = name;
    anchor.click();
    URL.revokeObjectURL(url);
    this.notify('Downloaded', name);
  }

  onAnalyticsRange(range: { start: string; end: string }): void {
    this.analyticsStart.set(range.start);
    this.analyticsEnd.set(range.end);
  }

  saveSettings(): void {
    if (this.cacheMinutes() < 0 || this.cacheMinutes() > 120) {
      this.error.set('Cache time must be between 0 and 120 minutes.');
      return;
    }
    this.error.set('');
    this.setMode(this.defaultMode());
    this.notify('Settings saved', `New searches start in ${this.defaultMode()} mode.`);
  }

  onProfile(item: { value: string }): void {
    const pages: Record<string, number> = { eval: 2, team: 6, settings: 7 };
    this.navigate(pages[item.value] ?? 0);
    this.menuOpen.set(false);
  }

  log(title: string, description: string): void {
    this.activity.update((list) => [{ title, description, timestamp: 'Just now', status: 'complete' as const }, ...list].slice(0, 6));
  }

  notify(title: string, description = ''): void {
    this.notice.set(description ? `${title}: ${description}` : title);
    this.toastTitle.set(title);
    this.toastBody.set(description);
    this.toastOpen.set(false);
    setTimeout(() => this.toastOpen.set(true));
  }
}
