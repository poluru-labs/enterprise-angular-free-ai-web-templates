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
  EdsDropdownMenuComponent,
  EdsEmptyStateComponent,
  EdsFileUploadComponent,
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
  EdsSegmentedControlComponent,
  EdsSelectComponent,
  EdsSideNavComponent,
  EdsSliderComponent,
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
  EdsVisuallyHiddenComponent,
} from '@poluru-labs/enterprise-design-system-angular';

type Status = 'Draft' | 'Running' | 'Paused' | 'Concluded';
type Key = 'A' | 'B';
type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

interface Variant {
  key: Key;
  label: string;
  model: string;
  prompt: string;
  temperature: number;
  maxTokens: number;
  latency: number;
  cost: number;
  trueRate: number;
}

interface Day { a: [number, number]; b: [number, number]; }

interface Experiment {
  id: string;
  name: string;
  hypothesis: string;
  metric: string;
  owner: string;
  status: Status;
  started: string;
  split: number;
  traffic: number;
  planned: number;
  variants: [Variant, Variant];
  days: Day[];
  winner?: Key;
  note?: string;
}

interface Sample { input: string; a: string; b: string; }

const Z_ALPHA: Record<string, number> = { '0.01': 2.576, '0.05': 1.96, '0.1': 1.645 };
const Z_POWER: Record<string, number> = { '0.8': 0.8416, '0.9': 1.2816, '0.95': 1.6449 };

function rng(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function binomial(n: number, p: number, rand: () => number): number {
  const mean = n * p;
  const sd = Math.sqrt(n * p * (1 - p));
  const u = Math.max(1e-9, rand());
  const v = rand();
  const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  return Math.max(0, Math.min(n, Math.round(mean + z * sd)));
}

function normCdf(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}

@Component({
  selector: 'app-root',
  imports: [
    EdsAccordionComponent, EdsAlertComponent, EdsAutocompleteComponent, EdsAvatarComponent, EdsBadgeComponent, EdsBreadcrumbComponent,
    EdsButtonComponent, EdsButtonGroupComponent, EdsCardComponent, EdsCheckboxComponent, EdsCircularProgressComponent, EdsCodeSnippetComponent,
    EdsComboboxComponent, EdsDataTableComponent, EdsDateRangePickerComponent, EdsDescriptionListComponent, EdsDividerComponent,
    EdsDropdownMenuComponent, EdsEmptyStateComponent, EdsFileUploadComponent, EdsInputComponent, EdsKbdComponent, EdsLinkComponent,
    EdsListComponent, EdsMenuItemComponent, EdsMeterComponent, EdsModalComponent, EdsNumberInputComponent, EdsPaginationComponent,
    EdsPopoverComponent, EdsProgressBarComponent, EdsRadioComponent, EdsRadioGroupComponent, EdsSegmentedControlComponent, EdsSelectComponent,
    EdsSideNavComponent, EdsSliderComponent, EdsSplitButtonComponent, EdsStatComponent, EdsStatusComponent, EdsStepperComponent,
    EdsSwitchComponent, EdsTabsComponent, EdsTagComponent, EdsTextareaComponent, EdsTimePickerComponent, EdsTimelineComponent,
    EdsToastComponent, EdsToolbarComponent, EdsVisuallyHiddenComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnDestroy {
  readonly models = ['Atlas 2', 'Atlas 2 mini', 'Orion', 'Orion mini', 'Vega 3'];
  readonly metrics = ['Resolved without follow-up', 'Summary accepted', 'Copy approved', 'Fields correct', 'Reply rated helpful'];

  readonly experiments = signal<Experiment[]>([
    this.seed({
      id: 'EXP-201', name: 'Shorter support replies', owner: 'Aditi Poluru', status: 'Running', started: 'Sep 19', split: 50, traffic: 900, planned: 2400,
      hypothesis: 'Capping replies at three sentences raises the share of tickets closed without a follow-up message.', metric: 'Resolved without follow-up',
      variants: [
        { key: 'A', label: 'Control', model: 'Atlas 2', prompt: 'Answer the customer’s question in full detail. Include every relevant policy.', temperature: 0.7, maxTokens: 600, latency: 1420, cost: 1.1, trueRate: 0.42 },
        { key: 'B', label: 'Three sentences', model: 'Atlas 2', prompt: 'Answer in three sentences or fewer, then offer one clear next step.', temperature: 0.5, maxTokens: 220, latency: 820, cost: 0.55, trueRate: 0.465 },
      ],
    }, 9, 11),
    this.seed({
      id: 'EXP-202', name: 'Atlas 2 vs Orion mini for summaries', owner: 'Rahul Poluru', status: 'Running', started: 'Sep 16', split: 50, traffic: 600, planned: 3800,
      hypothesis: 'The smaller model writes summaries that reviewers accept just as often, at a fraction of the cost.', metric: 'Summary accepted',
      variants: [
        { key: 'A', label: 'Atlas 2', model: 'Atlas 2', prompt: 'Summarize the thread in five bullet points for a busy manager.', temperature: 0.3, maxTokens: 300, latency: 1800, cost: 1.2, trueRate: 0.61 },
        { key: 'B', label: 'Orion mini', model: 'Orion mini', prompt: 'Summarize the thread in five bullet points for a busy manager.', temperature: 0.3, maxTokens: 300, latency: 650, cost: 0.3, trueRate: 0.6 },
      ],
    }, 12, 22),
    this.seed({
      id: 'EXP-203', name: 'Low vs high temperature for product copy', owner: 'Sneha Poluru', status: 'Concluded', started: 'Aug 28', split: 50, traffic: 400, planned: 1500,
      hypothesis: 'A higher temperature produces livelier copy that editors approve more often.', metric: 'Copy approved',
      variants: [
        { key: 'A', label: 'Temperature 0.2', model: 'Vega 3', prompt: 'Write a 40-word product description in our brand voice.', temperature: 0.2, maxTokens: 120, latency: 900, cost: 0.4, trueRate: 0.55 },
        { key: 'B', label: 'Temperature 0.8', model: 'Vega 3', prompt: 'Write a 40-word product description in our brand voice.', temperature: 0.8, maxTokens: 120, latency: 910, cost: 0.4, trueRate: 0.47 },
      ],
      winner: 'A', note: 'Higher temperature drifted off brand voice. Keep 0.2.',
    }, 14, 33),
    this.seed({
      id: 'EXP-204', name: 'Worked example in extraction prompt', owner: 'Manoj Poluru', status: 'Paused', started: 'Sep 21', split: 50, traffic: 300, planned: 1100,
      hypothesis: 'Adding one worked example raises the share of invoices where every field is extracted correctly.', metric: 'Fields correct',
      variants: [
        { key: 'A', label: 'Instructions only', model: 'Orion', prompt: 'Extract vendor, date, total, and currency as JSON.', temperature: 0, maxTokens: 200, latency: 1100, cost: 0.7, trueRate: 0.78 },
        { key: 'B', label: 'With example', model: 'Orion', prompt: 'Extract vendor, date, total, and currency as JSON. Example: {"vendor":"Acme","date":"2026-09-01","total":120.5,"currency":"USD"}', temperature: 0, maxTokens: 200, latency: 1180, cost: 0.78, trueRate: 0.83 },
      ],
    }, 5, 44),
    this.seed({
      id: 'EXP-205', name: 'Friendly vs formal tone', owner: 'Aditi Poluru', status: 'Draft', started: '—', split: 50, traffic: 700, planned: 2000,
      hypothesis: 'A friendlier tone gets more replies rated helpful.', metric: 'Reply rated helpful',
      variants: [
        { key: 'A', label: 'Formal', model: 'Atlas 2 mini', prompt: 'Reply in a formal, professional tone.', temperature: 0.4, maxTokens: 300, latency: 700, cost: 0.35, trueRate: 0.5 },
        { key: 'B', label: 'Friendly', model: 'Atlas 2 mini', prompt: 'Reply in a warm, friendly tone. Use the customer’s first name.', temperature: 0.4, maxTokens: 300, latency: 710, cost: 0.35, trueRate: 0.53 },
      ],
    }, 0, 55),
  ]);

  readonly samples: Record<string, Sample[]> = {
    'EXP-201': [
      { input: 'I was charged twice for my September plan.', a: 'Thanks for reaching out. I can see two charges on September 3. Our billing policy states that duplicate charges are refunded within 5–7 business days once confirmed. I have confirmed the duplicate and started the refund. You will receive an email receipt. If you have other billing questions, our help center covers invoices, plan changes, and payment methods in detail.', b: 'You were charged twice on September 3 — sorry about that. I’ve refunded the duplicate; it will reach your card in 5–7 business days. Next step: watch for the refund email, and reply here if it hasn’t arrived by Sep 12.' },
      { input: 'How do I add a teammate to my workspace?', a: 'To add a teammate, open Settings, then Members. Select Invite, enter their email address, and choose a role. Admins can manage billing and members; Editors can create and edit; Viewers can only read. The invite expires after 7 days. If they do not see it, ask them to check spam.', b: 'Go to Settings → Members → Invite and enter their email. Pick a role (Editor fits most people). Next step: ask them to accept within 7 days.' },
      { input: 'Can I export my data to CSV?', a: 'Yes. Every table view has an Export button in the top right. Choose CSV or Excel. Exports include all visible columns and respect your current filters. Large exports are emailed to you when ready. Admins can also schedule weekly exports from Settings.', b: 'Yes — use Export in the top right of any table and pick CSV. It includes your current filters. Next step: for weekly exports, an admin can schedule them in Settings.' },
      { input: 'The app is slow today.', a: 'I’m sorry to hear that. We are not aware of an incident right now; you can check our status page for live updates. Slowness can come from browser extensions, a large number of open tabs, or network issues. Please try clearing your cache, disabling extensions, and using a different network if possible.', b: 'Sorry about that — our status page shows no incident right now. Try a private window to rule out extensions. Next step: if it’s still slow, send me the page URL and I’ll dig in.' },
    ],
    'EXP-202': [
      { input: 'Thread: 42 messages about moving the launch date.', a: '• Launch moves from Oct 6 to Oct 20\n• Cause: payment provider certification delay\n• Marketing will reschedule the announcement\n• Support needs updated FAQ by Oct 13\n• Decision owner: Rahul Poluru', b: '• Launch now Oct 20 (was Oct 6)\n• Waiting on payment certification\n• Marketing to move announcement\n• Support FAQ due Oct 13\n• Owner: Rahul Poluru' },
      { input: 'Thread: 18 messages about office move logistics.', a: '• Move happens the weekend of Nov 8\n• Pack desks by Friday noon\n• IT moves monitors and docks\n• New badges handed out Monday\n• Parking passes change on Nov 10', b: '• Move: weekend of Nov 8\n• Pack by Friday 12:00\n• IT handles monitors and docks\n• Badges on Monday\n• New parking passes from Nov 10' },
      { input: 'Thread: 27 messages about a pricing change.', a: '• Pro plan rises from $20 to $24 in January\n• Existing customers keep old price for 6 months\n• Sales gets talking points next week\n• Finance to update invoices\n• FAQ owner: Kavya Poluru', b: '• Pro goes to $24 in Jan\n• Current customers locked for 6 months\n• Talking points next week\n• Finance updates invoices\n• FAQ: Kavya Poluru' },
    ],
  };

  readonly page = signal(0);
  readonly selectedId = signal('EXP-201');
  readonly statusFilter = signal<'All' | Status>('All');
  readonly alpha = signal('0.05');
  readonly minSample = signal(500);
  readonly strictEarly = signal(true);
  readonly latencyGuard = signal(2000);
  readonly reportTime = signal('09:00');
  readonly notifyEmail = signal('experiments@poluru.example');
  readonly defaultOwner = signal('Aditi Poluru');
  readonly autoRun = signal(false);
  readonly blind = signal(true);
  readonly samplePage = signal(1);
  readonly votes = signal<Record<string, 'A' | 'B' | 'tie'>>({});
  readonly metricView = signal('rate');
  readonly planBaseline = signal(42);
  readonly planMde = signal(10);
  readonly planAlpha = signal('0.05');
  readonly planPower = signal('0.8');
  readonly planTraffic = signal(900);
  readonly planSplit = signal(50);
  readonly activityStart = signal('2026-09-01');
  readonly activityEnd = signal('2026-09-28');
  readonly activityPage = signal(1);
  readonly modal = signal<'new' | 'winner' | null>(null);
  readonly newStep = signal(0);
  readonly draft = signal({ name: '', hypothesis: '', metric: 'Resolved without follow-up', modelA: 'Atlas 2', modelB: 'Orion mini', promptA: '', promptB: '', temperature: 0.5, split: 50, planned: 2000 });
  readonly winnerKey = signal<Key>('B');
  readonly winnerNote = signal('');
  readonly stopLoser = signal(true);
  readonly teamSort = signal<{ key: string; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });
  readonly notice = signal('');
  readonly error = signal('');
  readonly toastOpen = signal(false);
  readonly toastTitle = signal('');
  readonly toastBody = signal('');
  readonly menuOpen = signal(false);
  readonly helpOpen = signal(false);
  readonly showIntro = signal(true);
  private autoTimer: ReturnType<typeof setInterval> | null = null;

  readonly nav = [
    { label: 'Overview' }, { label: 'Experiments' }, { label: 'Compare' }, { label: 'Significance' },
    { label: 'Planner' }, { label: 'Activity' }, { label: 'Team' }, { label: 'Settings' },
  ];
  readonly headings = [
    { eyebrow: 'LAB', title: 'AI Experiment Lab', summary: 'A/B test prompts, models, and parameters side by side with statistical significance tracking.' },
    { eyebrow: 'SETUP', title: 'Experiments', summary: 'Variants, traffic split, and lifecycle for each test.' },
    { eyebrow: 'SIDE BY SIDE', title: 'Compare', summary: 'Read both variants’ outputs for the same input and vote for the better one.' },
    { eyebrow: 'STATISTICS', title: 'Significance', summary: 'Rates, lift, confidence interval, and p-value for the selected experiment.' },
    { eyebrow: 'PLANNING', title: 'Sample size planner', summary: 'How many samples you need before a result can be trusted.' },
    { eyebrow: 'LOG', title: 'Activity', summary: 'Launches, pauses, decisions, and traffic in this session.' },
    { eyebrow: 'PEOPLE', title: 'Team', summary: 'Who owns which experiments.' },
    { eyebrow: 'WORKSPACE', title: 'Settings', summary: 'Significance level, guardrails, and daily report.' },
  ];
  readonly statuses: ('All' | Status)[] = ['All', 'Running', 'Paused', 'Draft', 'Concluded'];
  readonly lifecycle = [
    { label: 'Draft', description: 'Variants defined' },
    { label: 'Running', description: 'Collecting samples' },
    { label: 'Analysis', description: 'Planned sample reached' },
    { label: 'Concluded', description: 'Winner chosen' },
  ];
  readonly newSteps = [{ label: 'Setup' }, { label: 'Variants' }, { label: 'Traffic' }];
  readonly alphaOptions = [{ label: '0.01 (99% confidence)', value: '0.01' }, { label: '0.05 (95% confidence)', value: '0.05' }, { label: '0.10 (90% confidence)', value: '0.1' }];
  readonly metricOptions = this.metrics.map((metric) => ({ label: metric, value: metric }));
  readonly modelOptions = this.models.map((model) => ({ label: model, value: model }));
  readonly metricViews = [{ label: 'Success rate', value: 'rate' }, { label: 'p-value', value: 'p' }];
  readonly team = [
    { name: 'Aditi Poluru', role: 'Experiment lead', area: 'Support replies', experiments: 2 },
    { name: 'Rahul Poluru', role: 'Engineer', area: 'Summaries', experiments: 1 },
    { name: 'Sneha Poluru', role: 'Content lead', area: 'Product copy', experiments: 1 },
    { name: 'Manoj Poluru', role: 'Engineer', area: 'Extraction', experiments: 1 },
    { name: 'Kavya Poluru', role: 'Analyst', area: 'Statistics review', experiments: 0 },
  ];
  readonly teamNames = this.team.map((member) => member.name);
  readonly teamColumns = [{ key: 'name', label: 'Member' }, { key: 'role', label: 'Role' }, { key: 'area', label: 'Area' }, { key: 'experiments', label: 'Experiments' }];
  readonly activityColumns = [{ key: 'event', label: 'Event' }, { key: 'experiment', label: 'Experiment' }, { key: 'member', label: 'Member' }, { key: 'time', label: 'Time' }];
  readonly guide = [
    { heading: 'What the p-value means', content: 'The chance of seeing a gap at least this large if the two variants were truly the same. Below your significance level, the gap is unlikely to be noise.', open: true },
    { heading: 'Why not stop as soon as it looks good?', content: 'Checking every day and stopping at the first good-looking p-value inflates false positives. With “strict before planned sample” on, early results must clear 0.005 instead.' },
    { heading: 'Minimum detectable effect', content: 'The smallest relative lift worth detecting. Halving it roughly quadruples the samples you need.' },
  ];
  readonly activity = signal([
    { event: 'Added a day of traffic', experiment: 'EXP-201', member: 'Scheduler', time: 'Today, 00:05' },
    { event: 'Paused experiment', experiment: 'EXP-204', member: 'Manoj Poluru', time: 'Yesterday, 17:40' },
    { event: 'Called winner A', experiment: 'EXP-203', member: 'Sneha Poluru', time: 'Sep 11, 10:15' },
    { event: 'Launched experiment', experiment: 'EXP-202', member: 'Rahul Poluru', time: 'Sep 16, 09:00' },
    { event: 'Launched experiment', experiment: 'EXP-201', member: 'Aditi Poluru', time: 'Sep 19, 09:30' },
    { event: 'Created draft', experiment: 'EXP-205', member: 'Aditi Poluru', time: 'Sep 26, 14:20' },
  ]);

  readonly Math = Math;
  readonly breadcrumbs = computed(() => [{ label: 'Lab' }, { label: this.nav[this.page()].label }]);
  readonly selected = computed(() => this.experiments().find((exp) => exp.id === this.selectedId()) ?? this.experiments()[0]);
  readonly filtered = computed(() => this.experiments().filter((exp) => this.statusFilter() === 'All' || exp.status === this.statusFilter()));
  readonly statusNav = computed(() => this.statuses.map((status) => ({
    label: `${status} (${status === 'All' ? this.experiments().length : this.experiments().filter((exp) => exp.status === status).length})`,
    active: status === this.statusFilter(),
  })));
  readonly expList = computed(() => this.filtered().map((exp) => ({ label: exp.name, description: `${exp.id} · ${exp.status}`, selected: exp.id === this.selectedId() })));
  readonly expOptions = computed(() => this.experiments().filter((exp) => exp.days.length).map((exp) => ({ label: `${exp.id} · ${exp.name}`, value: exp.id })));
  readonly stats = computed(() => this.analyze(this.selected()));
  readonly allStats = computed(() => this.experiments().map((exp) => ({ exp, stats: this.analyze(exp) })));
  readonly running = computed(() => this.experiments().filter((exp) => exp.status === 'Running'));
  readonly significantCount = computed(() => this.allStats().filter(({ exp, stats }) => exp.status !== 'Draft' && stats.significant).length);
  readonly totalSamples = computed(() => this.allStats().reduce((sum, { stats }) => sum + stats.nA + stats.nB, 0));
  readonly readyToCall = computed(() => this.allStats().filter(({ exp, stats }) => exp.status === 'Running' && stats.significant && stats.progress >= 100));
  readonly series = computed(() => this.cumulative(this.selected()));
  readonly lifecycleStep = computed(() => {
    const exp = this.selected();
    if (exp.status === 'Concluded') return 3;
    if (exp.status === 'Draft') return 0;
    return this.stats().progress >= 100 ? 2 : 1;
  });
  readonly variantMeta = computed(() => this.selected().variants.map((variant) => [
    { term: 'Model', description: variant.model },
    { term: 'Temperature', description: variant.temperature.toFixed(1) },
    { term: 'Max tokens', description: String(variant.maxTokens) },
    { term: 'Latency', description: `${variant.latency} ms` },
    { term: 'Cost / 1k', description: `$${variant.cost.toFixed(2)}` },
  ]));
  readonly expMeta = computed(() => {
    const exp = this.selected();
    return [
      { term: 'Metric', description: exp.metric },
      { term: 'Owner', description: exp.owner },
      { term: 'Started', description: exp.started },
      { term: 'Daily traffic', description: exp.traffic.toLocaleString() },
      { term: 'Planned per variant', description: exp.planned.toLocaleString() },
      { term: 'Days running', description: String(exp.days.length) },
    ];
  });

  readonly currentSamples = computed(() => this.samples[this.selectedId()] ?? []);
  readonly pagedSample = computed(() => this.currentSamples()[this.samplePage() - 1] ?? null);
  readonly voteTally = computed(() => {
    const list = this.currentSamples().map((_, i) => this.votes()[`${this.selectedId()}:${i}`]).filter(Boolean);
    const a = list.filter((vote) => vote === 'A').length;
    const b = list.filter((vote) => vote === 'B').length;
    const ties = list.filter((vote) => vote === 'tie').length;
    const n = a + b;
    const z = n ? (Math.abs(b - a) - 1) / Math.sqrt(n) : 0;
    return { a, b, ties, total: list.length, p: n ? Math.min(1, 2 * (1 - normCdf(Math.max(0, z)))) : 1 };
  });

  readonly plan = computed(() => {
    const p1 = this.planBaseline() / 100;
    const p2 = Math.min(0.999, p1 * (1 + this.planMde() / 100));
    const za = Z_ALPHA[this.planAlpha()] ?? 1.96;
    const zb = Z_POWER[this.planPower()] ?? 0.8416;
    const pbar = (p1 + p2) / 2;
    const n = Math.ceil((za * Math.sqrt(2 * pbar * (1 - pbar)) + zb * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2))) ** 2 / (p2 - p1) ** 2);
    const share = Math.min(this.planSplit(), 100 - this.planSplit()) / 100;
    const days = Math.ceil(n / Math.max(1, this.planTraffic() * share));
    return { p2, n, total: n * 2, days };
  });
  readonly planCode = computed(() => `# Two-proportion test, two-sided
baseline_rate   = ${(this.planBaseline() / 100).toFixed(3)}
target_rate     = ${this.plan().p2.toFixed(3)}
alpha           = ${this.planAlpha()}
power           = ${this.planPower()}
per_variant_n   = ${this.plan().n}
days_needed     = ${this.plan().days}`);

  readonly activityRows = computed(() => this.activity().slice((this.activityPage() - 1) * 6, this.activityPage() * 6));
  readonly timeline = computed(() => this.activity().slice(0, 5).map((row, i) => ({ title: `${row.event} · ${row.experiment}`, description: row.member, timestamp: row.time, status: i === 0 && this.autoRun() ? 'current' as const : 'complete' as const })));
  readonly sortedTeam = computed(() => {
    const { key, direction } = this.teamSort();
    return [...this.team].sort((a, b) => {
      const av = a[key as keyof typeof a];
      const bv = b[key as keyof typeof b];
      const cmp = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv));
      return direction === 'asc' ? cmp : -cmp;
    });
  });
  readonly configJson = computed(() => {
    const exp = this.selected();
    return JSON.stringify({
      id: exp.id, metric: exp.metric, split: { A: 100 - exp.split, B: exp.split }, plannedPerVariant: exp.planned,
      variants: exp.variants.map(({ key, model, prompt, temperature, maxTokens }) => ({ key, model, prompt, temperature, maxTokens })),
    }, null, 2);
  });

  ngOnDestroy(): void {
    this.stopAuto();
  }

  seed(exp: Omit<Experiment, 'days'>, days: number, seed: number): Experiment {
    const rand = rng(seed);
    const list: Day[] = [];
    for (let i = 0; i < days; i++) list.push(this.simulateDay(exp, rand));
    return { ...exp, days: list };
  }

  simulateDay(exp: Omit<Experiment, 'days'>, rand: () => number): Day {
    const nB = Math.round(exp.traffic * (exp.split / 100) * (0.85 + rand() * 0.3));
    const nA = Math.round(exp.traffic * ((100 - exp.split) / 100) * (0.85 + rand() * 0.3));
    return { a: [nA, binomial(nA, exp.variants[0].trueRate, rand)], b: [nB, binomial(nB, exp.variants[1].trueRate, rand)] };
  }

  totals(days: Day[]) {
    return days.reduce((sum, day) => ({ nA: sum.nA + day.a[0], sA: sum.sA + day.a[1], nB: sum.nB + day.b[0], sB: sum.sB + day.b[1] }), { nA: 0, sA: 0, nB: 0, sB: 0 });
  }

  test(nA: number, sA: number, nB: number, sB: number, zCrit: number) {
    const pA = nA ? sA / nA : 0;
    const pB = nB ? sB / nB : 0;
    const pooled = nA + nB ? (sA + sB) / (nA + nB) : 0;
    const se = Math.sqrt(pooled * (1 - pooled) * (1 / Math.max(nA, 1) + 1 / Math.max(nB, 1)));
    const z = se ? (pB - pA) / se : 0;
    const p = nA && nB ? 2 * (1 - normCdf(Math.abs(z))) : 1;
    const seDiff = Math.sqrt((pA * (1 - pA)) / Math.max(nA, 1) + (pB * (1 - pB)) / Math.max(nB, 1));
    return { pA, pB, z, p, diff: pB - pA, low: pB - pA - zCrit * seDiff, high: pB - pA + zCrit * seDiff };
  }

  analyze(exp: Experiment) {
    const { nA, sA, nB, sB } = this.totals(exp.days);
    const alpha = Number(this.alpha());
    const zCrit = Z_ALPHA[this.alpha()] ?? 1.96;
    const result = this.test(nA, sA, nB, sB, zCrit);
    const progress = Math.min(100, Math.round((Math.min(nA, nB) / exp.planned) * 100));
    const threshold = this.strictEarly() && progress < 100 ? 0.005 : alpha;
    const significant = result.p < threshold && Math.min(nA, nB) >= this.minSample();
    const lift = result.pA ? result.diff / result.pA : 0;
    const leader: Key = result.diff >= 0 ? 'B' : 'A';
    const [a, b] = exp.variants;
    const latencyBreach = [a, b].filter((variant) => variant.latency > this.latencyGuard()).map((variant) => variant.key);
    let verdict: string;
    if (!nA || !nB) verdict = 'No data yet';
    else if (significant) verdict = `${leader} wins on ${exp.metric.toLowerCase()}`;
    else if (progress >= 100) verdict = 'No meaningful difference';
    else verdict = 'Keep collecting';
    const cheaper = b.cost < a.cost ? 'B' : a.cost < b.cost ? 'A' : null;
    const recommendation = significant
      ? `Ship ${leader} (${exp.variants[leader === 'A' ? 0 : 1].label}). Lift ${(lift * 100).toFixed(1)}%.`
      : progress >= 100 && cheaper
        ? `No quality difference. Ship ${cheaper} to cut cost ${Math.round((1 - Math.min(a.cost, b.cost) / Math.max(a.cost, b.cost)) * 100)}%.`
        : `Need about ${Math.max(0, exp.planned - Math.min(nA, nB)).toLocaleString()} more samples per variant.`;
    return { nA, sA, nB, sB, ...result, alpha, threshold, significant, lift, leader, progress, verdict, recommendation, latencyBreach };
  }

  cumulative(exp: Experiment) {
    let acc = { nA: 0, sA: 0, nB: 0, sB: 0 };
    return exp.days.map((day) => {
      acc = { nA: acc.nA + day.a[0], sA: acc.sA + day.a[1], nB: acc.nB + day.b[0], sB: acc.sB + day.b[1] };
      const result = this.test(acc.nA, acc.sA, acc.nB, acc.sB, 1.96);
      return { pA: result.pA, pB: result.pB, p: result.p };
    });
  }

  path(values: number[], min: number, max: number, width = 560, height = 180): string {
    if (!values.length) return '';
    const step = values.length > 1 ? width / (values.length - 1) : 0;
    return values.map((value, i) => `${i ? 'L' : 'M'}${(i * step).toFixed(1)} ${(height - ((value - min) / (max - min || 1)) * height).toFixed(1)}`).join(' ');
  }

  rateBounds(): [number, number] {
    const values = this.series().flatMap((point) => [point.pA, point.pB]);
    if (!values.length) return [0, 1];
    return [Math.max(0, Math.min(...values) - 0.03), Math.min(1, Math.max(...values) + 0.03)];
  }

  ratePath(key: 'pA' | 'pB'): string {
    const [min, max] = this.rateBounds();
    return this.path(this.series().map((point) => point[key]), min, max);
  }

  pPath(): string {
    return this.path(this.series().map((point) => Math.min(1, point.p)), 0, 1);
  }

  alphaY(): number {
    return 180 - Number(this.alpha()) * 180;
  }

  ciPosition(value: number): number {
    const s = this.stats();
    const range = Math.max(Math.abs(s.low), Math.abs(s.high), 0.02) * 1.3;
    return 50 + (value / range) * 50;
  }

  pct(value: number, digits = 1): string {
    return `${(value * 100).toFixed(digits)}%`;
  }

  pText(p: number): string {
    return p < 0.001 ? '< 0.001' : p.toFixed(3);
  }

  tone(status: Status): Tone {
    return status === 'Running' ? 'success' : status === 'Paused' ? 'warning' : status === 'Concluded' ? 'brand' : 'neutral';
  }

  navigate(page: number): void {
    this.page.set(page);
    this.error.set('');
  }

  select(id: string): void {
    this.selectedId.set(id);
    this.samplePage.set(1);
  }

  open(id: string, page: number): void {
    this.select(id);
    this.navigate(page);
  }

  onStatusNav(event: { label: string }): void {
    const status = this.statuses.find((item) => event.label.startsWith(item));
    if (status) this.statusFilter.set(status);
  }

  onExpList(event: { index: number }): void {
    const exp = this.filtered()[event.index];
    if (exp) this.select(exp.id);
  }

  update(id: string, patch: Partial<Experiment>): void {
    this.experiments.update((list) => list.map((exp) => (exp.id === id ? { ...exp, ...patch } : exp)));
  }

  setStatus(status: Status): void {
    const exp = this.selected();
    this.update(exp.id, { status, started: status === 'Running' && exp.started === '—' ? 'Today' : exp.started });
    if (status !== 'Running') this.stopAuto();
    const verb = status === 'Running' ? (exp.status === 'Draft' ? 'Launched' : 'Resumed') : 'Paused';
    this.log(`${verb} experiment`, exp.id);
    this.notify(`${verb} ${exp.id}`, exp.name);
  }

  addDay(id: string = this.selectedId()): void {
    const exp = this.experiments().find((item) => item.id === id);
    if (!exp || exp.status !== 'Running') return;
    const rand = rng(Date.now() % 100000 + exp.days.length * 17);
    this.update(id, { days: [...exp.days, this.simulateDay(exp, rand)] });
  }

  runDay(): void {
    const exp = this.selected();
    if (exp.status !== 'Running') {
      this.error.set('Launch or resume the experiment before adding traffic.');
      return;
    }
    const before = this.stats().significant;
    this.addDay();
    this.log('Added a day of traffic', exp.id);
    const after = this.stats();
    this.notify('Day added', `${exp.id}: p = ${this.pText(after.p)}${!before && after.significant ? ' — now significant' : ''}.`);
  }

  toggleAuto(value: boolean): void {
    if (!value) {
      this.stopAuto();
      return;
    }
    if (this.selected().status !== 'Running') {
      this.error.set('Only running experiments can collect traffic.');
      return;
    }
    this.autoRun.set(true);
    const id = this.selectedId();
    this.autoTimer = setInterval(() => {
      const exp = this.experiments().find((item) => item.id === id);
      if (!exp || exp.status !== 'Running') return this.stopAuto();
      this.addDay(id);
      const stats = this.analyze(this.experiments().find((item) => item.id === id)!);
      if (stats.progress >= 100) {
        this.stopAuto();
        this.log('Reached planned sample', id);
        this.notify('Planned sample reached', `${id}: ${stats.verdict}.`);
      }
    }, 1200);
  }

  stopAuto(): void {
    if (this.autoTimer) clearInterval(this.autoTimer);
    this.autoTimer = null;
    this.autoRun.set(false);
  }

  setSplit(value: number): void {
    this.update(this.selectedId(), { split: Math.round(value) });
  }

  vote(index: number, choice: 'A' | 'B' | 'tie'): void {
    this.votes.update((map) => ({ ...map, [`${this.selectedId()}:${index}`]: choice }));
    if (this.samplePage() < this.currentSamples().length) this.samplePage.update((page) => page + 1);
  }

  voteFor(index: number): string | undefined {
    return this.votes()[`${this.selectedId()}:${index}`];
  }

  flipped(index: number): boolean {
    return this.blind() && index % 2 === 1;
  }

  onImport(event: { files: File[] }): void {
    const count = event.files?.length ?? 0;
    if (count) this.notify('Samples queued', `${count} file(s) will be added after validation.`);
  }

  openNew(): void {
    this.draft.set({ name: '', hypothesis: '', metric: this.metrics[0], modelA: 'Atlas 2', modelB: 'Orion mini', promptA: '', promptB: '', temperature: 0.5, split: 50, planned: this.plan().n });
    this.newStep.set(0);
    this.error.set('');
    this.modal.set('new');
  }

  patchDraft(patch: Partial<ReturnType<App['draft']>>): void {
    this.draft.update((draft) => ({ ...draft, ...patch }));
    this.error.set('');
  }

  nextStep(): void {
    const draft = this.draft();
    if (this.newStep() === 0 && (!draft.name.trim() || !draft.hypothesis.trim())) {
      this.error.set('Give the experiment a name and a hypothesis.');
      return;
    }
    if (this.newStep() === 1 && (!draft.promptA.trim() || !draft.promptB.trim())) {
      this.error.set('Write a prompt for both variants.');
      return;
    }
    if (this.newStep() === 1 && draft.promptA.trim() === draft.promptB.trim() && draft.modelA === draft.modelB) {
      this.error.set('The variants are identical. Change the prompt, the model, or both.');
      return;
    }
    this.error.set('');
    if (this.newStep() < 2) {
      this.newStep.update((step) => step + 1);
      return;
    }
    const id = `EXP-${206 + this.experiments().length - 5}`;
    const exp: Experiment = {
      id, name: draft.name.trim(), hypothesis: draft.hypothesis.trim(), metric: draft.metric, owner: 'Aditi Poluru', status: 'Draft', started: '—',
      split: draft.split, traffic: 800, planned: draft.planned,
      variants: [
        { key: 'A', label: 'Control', model: draft.modelA, prompt: draft.promptA.trim(), temperature: 0.5, maxTokens: 400, latency: 1000, cost: 0.8, trueRate: 0.5 },
        { key: 'B', label: 'Challenger', model: draft.modelB, prompt: draft.promptB.trim(), temperature: draft.temperature, maxTokens: 400, latency: 900, cost: 0.6, trueRate: 0.53 },
      ],
      days: [],
    };
    this.experiments.update((list) => [...list, exp]);
    this.select(id);
    this.modal.set(null);
    this.log('Created draft', id);
    this.notify('Draft created', `${id} is ready to launch.`);
    this.navigate(1);
  }

  prevStep(): void {
    this.error.set('');
    this.newStep.update((step) => Math.max(0, step - 1));
  }

  openWinner(): void {
    this.winnerKey.set(this.stats().leader);
    this.winnerNote.set('');
    this.error.set('');
    this.modal.set('winner');
  }

  setWinnerKey(value: string): void {
    if (value === 'A' || value === 'B') this.winnerKey.set(value);
  }

  confirmWinner(): void {
    if (!this.winnerNote().trim()) {
      this.error.set('Add a short note explaining the decision.');
      return;
    }
    const exp = this.selected();
    this.update(exp.id, { status: 'Concluded', winner: this.winnerKey(), note: this.winnerNote().trim(), split: this.stopLoser() ? (this.winnerKey() === 'B' ? 100 : 0) : exp.split });
    this.stopAuto();
    this.closeModal();
    this.log(`Called winner ${this.winnerKey()}`, exp.id);
    this.notify('Winner recorded', `${exp.id}: variant ${this.winnerKey()} ships.`);
  }

  closeModal(): void {
    this.modal.set(null);
    this.error.set('');
  }

  exportMenu(item: { value: string }): void {
    if (item.value === 'config') this.download(this.configJson(), `${this.selectedId()}-config.json`, 'application/json');
    else this.exportCsv();
  }

  exportCsv(): void {
    const rows = [['id', 'name', 'status', 'n_a', 'rate_a', 'n_b', 'rate_b', 'lift', 'p_value', 'significant'],
      ...this.allStats().map(({ exp, stats }) => [exp.id, exp.name, exp.status, String(stats.nA), stats.pA.toFixed(4), String(stats.nB), stats.pB.toFixed(4), stats.lift.toFixed(4), stats.p.toFixed(4), String(stats.significant)])];
    this.download(rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n'), 'experiments.csv', 'text/csv');
  }

  download(body: string, name: string, type: string): void {
    const url = URL.createObjectURL(new Blob([body], { type }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = name;
    anchor.click();
    URL.revokeObjectURL(url);
    this.notify('Downloaded', name);
  }

  onActivityRange(range: { start: string; end: string }): void {
    this.activityStart.set(range.start);
    this.activityEnd.set(range.end);
  }

  saveSettings(): void {
    if (this.minSample() < 50) {
      this.error.set('Minimum sample per variant should be at least 50.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.notifyEmail().trim())) {
      this.error.set('Enter a valid email address for the daily report.');
      return;
    }
    this.error.set('');
    this.notify('Settings saved', `Significance level ${this.alpha()}, minimum ${this.minSample()} per variant.`);
  }

  onProfile(item: { value: string }): void {
    const pages: Record<string, number> = { experiments: 1, team: 6, settings: 7 };
    this.navigate(pages[item.value] ?? 0);
    this.menuOpen.set(false);
  }

  log(event: string, experiment: string): void {
    this.activity.update((rows) => [{ event, experiment, member: 'Aditi Poluru', time: 'Just now' }, ...rows]);
  }

  notify(title: string, description = ''): void {
    this.notice.set(description ? `${title}: ${description}` : title);
    this.toastTitle.set(title);
    this.toastBody.set(description);
    this.toastOpen.set(false);
    setTimeout(() => this.toastOpen.set(true));
  }
}
