import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, computed, inject, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import {
  EdsAccordionComponent,
  EdsAlertComponent,
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
  EdsDatePickerComponent,
  EdsDateRangePickerComponent,
  EdsDescriptionListComponent,
  EdsDividerComponent,
  EdsDrawerComponent,
  EdsDropdownMenuComponent,
  EdsEmptyStateComponent,
  EdsFileUploadComponent,
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
  EdsPinInputComponent,
  EdsPopoverComponent,
  EdsProgressBarComponent,
  EdsRadioComponent,
  EdsRadioGroupComponent,
  EdsRatingComponent,
  EdsSearchComponent,
  EdsSegmentedControlComponent,
  EdsSelectComponent,
  EdsSideNavComponent,
  EdsSkeletonComponent,
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
  EdsTooltipComponent,
  EdsTreeViewComponent,
  EdsVisuallyHiddenComponent,
} from '@poluru-labs/enterprise-design-system-angular';

type JobStatus = 'Queued' | 'Validating' | 'Training' | 'Evaluating' | 'Succeeded' | 'Failed' | 'Cancelled';
type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
type CheckState = 'pass' | 'warn' | 'fail';

interface Base { id: string; label: string; price: number; throughput: number; }
interface Check { label: string; state: CheckState; detail: string; }
interface Dataset {
  id: string; name: string; rows: number; tokens: number; format: string; owner: string; updated: string;
  status: 'Validated' | 'Issues' | 'Validating'; checks: Check[]; sample: string; split: number;
}
interface Job {
  id: string; name: string; base: string; dataset: string; owner: string; status: JobStatus;
  epochs: number; lr: number; batch: number; warmup: number; seed: number;
  step: number; total: number; phase: number; created: string; gpuHours: number;
  start: number; floor: number; tau: number; overfit: number; error: string;
}
interface Checkpoint { id: string; jobId: string; epoch: number; step: number; train: number; val: number; score: number; }
interface Draft {
  name: string; base: string; dataset: string; split: number; epochs: number; lr: string; batch: string;
  warmup: number; seed: number; earlyStop: boolean; startDate: string;
}

const BASES: Base[] = [
  { id: 'compact-7b', label: 'Compact 7B', price: 0.8, throughput: 2.4 },
  { id: 'standard-13b', label: 'Standard 13B', price: 1.6, throughput: 1.2 },
  { id: 'large-34b', label: 'Large 34B', price: 4, throughput: 0.5 },
];

const passing = (rows: number): Check[] => [
  { label: 'Format', state: 'pass', detail: 'Every line parses as a chat record' },
  { label: 'Roles', state: 'pass', detail: 'Each record ends with an assistant turn' },
  { label: 'Length', state: 'pass', detail: `No record over the 8,192-token limit` },
  { label: 'Duplicates', state: rows > 10000 ? 'warn' : 'pass', detail: rows > 10000 ? `${Math.round(rows * 0.012)} near-duplicate rows` : 'No duplicates found' },
];

const sample = (user: string, reply: string) => JSON.stringify({ messages: [{ role: 'system', content: 'Follow the house style.' }, { role: 'user', content: user }, { role: 'assistant', content: reply }] }, null, 2);

function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

@Component({
  selector: 'app-root',
  imports: [
    NgTemplateOutlet, EdsAccordionComponent, EdsAlertComponent, EdsAvatarComponent, EdsBadgeComponent, EdsBreadcrumbComponent, EdsButtonComponent,
    EdsButtonGroupComponent, EdsCardComponent, EdsCheckboxComponent, EdsCircularProgressComponent, EdsCodeSnippetComponent, EdsComboboxComponent,
    EdsDataTableComponent, EdsDatePickerComponent, EdsDateRangePickerComponent, EdsDescriptionListComponent, EdsDividerComponent, EdsDrawerComponent,
    EdsDropdownMenuComponent, EdsEmptyStateComponent, EdsFileUploadComponent, EdsIconComponent, EdsInputComponent, EdsKbdComponent, EdsLinkComponent,
    EdsListComponent, EdsMenuItemComponent, EdsMeterComponent, EdsModalComponent, EdsNumberInputComponent, EdsPaginationComponent, EdsPinInputComponent,
    EdsPopoverComponent, EdsProgressBarComponent, EdsRadioComponent, EdsRadioGroupComponent, EdsRatingComponent, EdsSearchComponent,
    EdsSegmentedControlComponent, EdsSelectComponent, EdsSideNavComponent, EdsSkeletonComponent, EdsSliderComponent, EdsSpinnerComponent,
    EdsSplitButtonComponent, EdsStatComponent, EdsStatusComponent, EdsStepperComponent, EdsSwitchComponent, EdsTabsComponent, EdsTagComponent,
    EdsTextareaComponent, EdsTimePickerComponent, EdsTimelineComponent, EdsToastComponent, EdsToolbarComponent, EdsTooltipComponent,
    EdsTreeViewComponent, EdsVisuallyHiddenComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly Math = Math;
  readonly bases = BASES;
  readonly pages = ['Overview', 'Jobs', 'New job', 'Datasets', 'Checkpoints', 'Compare', 'Usage', 'Team', 'Settings'];
  readonly headings = [
    { eyebrow: 'WORKSPACE', title: 'Fine-Tuning Console', summary: 'Manage fine-tuning jobs, datasets, hyperparameters, and model checkpoints in one UI.' },
    { eyebrow: 'TRAINING', title: 'Jobs', summary: 'Every run with its progress, loss curves, settings, and event log.' },
    { eyebrow: 'LAUNCH', title: 'New job', summary: 'Pick a base model and dataset, set hyperparameters, and check the estimate before you start.' },
    { eyebrow: 'DATA', title: 'Datasets', summary: 'Upload training files and fix validation issues before they cost GPU time.' },
    { eyebrow: 'OUTPUTS', title: 'Checkpoints', summary: 'Saved weights from each epoch. Review, deploy, or clean them up.' },
    { eyebrow: 'ANALYSIS', title: 'Compare runs', summary: 'Line up hyperparameters and results to see what actually helped.' },
    { eyebrow: 'SPEND', title: 'Usage', summary: 'GPU hours and cost against this month’s quota.' },
    { eyebrow: 'PEOPLE', title: 'Team', summary: 'Who is training what.' },
    { eyebrow: 'WORKSPACE', title: 'Settings', summary: 'Defaults, limits, checkpoint retention, and notifications.' },
  ];
  readonly team = [
    { name: 'Meera Poluru', role: 'Workspace owner', focus: 'Support models' },
    { name: 'Arjun Poluru', role: 'ML engineer', focus: 'Support models' },
    { name: 'Lavanya Poluru', role: 'ML engineer', focus: 'Product Q&A' },
    { name: 'Kiran Poluru', role: 'Data engineer', focus: 'Datasets' },
    { name: 'Pooja Poluru', role: 'Reviewer', focus: 'Legal drafting' },
  ];
  readonly teamNames = this.team.map((member) => member.name);

  readonly datasets = signal<Dataset[]>([
    { id: 'ds-support-v5', name: 'support-replies-v5', rows: 12400, tokens: 3.1, format: 'Chat JSONL', owner: 'Kiran Poluru', updated: 'Sep 24', status: 'Validated', checks: passing(12400), split: 10, sample: sample('My invoice shows the wrong company name.', 'Sorry about that. Open Billing → Details, edit the company name, and the next invoice will use it. I can also reissue this one — just say the word.') },
    { id: 'ds-product-v8', name: 'product-qa-v8', rows: 21000, tokens: 5.6, format: 'Chat JSONL', owner: 'Lavanya Poluru', updated: 'Sep 19', status: 'Validated', checks: passing(21000), split: 10, sample: sample('Does the Team plan include audit logs?', 'Yes. Audit logs are on Team and Enterprise, under Settings → Security → Audit log.') },
    { id: 'ds-contracts-v2', name: 'contract-clauses-v2', rows: 4800, tokens: 2.2, format: 'Chat JSONL', owner: 'Pooja Poluru', updated: 'Sep 12', status: 'Validated', checks: passing(4800), split: 15, sample: sample('Rewrite this clause in plain language: …', 'Either side can end this agreement with 30 days’ written notice.') },
    { id: 'ds-routing-v3', name: 'ticket-routing-v3', rows: 9300, tokens: 0.9, format: 'Chat JSONL', owner: 'Kiran Poluru', updated: 'Sep 26', status: 'Issues', split: 10,
      checks: [
        { label: 'Format', state: 'pass', detail: 'Every line parses as a chat record' },
        { label: 'Roles', state: 'fail', detail: '212 records have no assistant turn' },
        { label: 'Length', state: 'pass', detail: 'No record over the 8,192-token limit' },
        { label: 'Labels', state: 'warn', detail: '“Billing” is 61% of rows; others are thin' },
      ], sample: sample('I was charged twice this month.', 'queue: billing · priority: high') },
    { id: 'ds-release-v1', name: 'release-notes-style', rows: 1150, tokens: 0.4, format: 'Chat JSONL', owner: 'Meera Poluru', updated: 'Sep 27', status: 'Validated', checks: passing(1150), split: 10, sample: sample('Write a release note for: faster CSV export.', 'CSV exports are now up to 3× faster for large workspaces.') },
  ]);

  readonly jobs = signal<Job[]>([
    this.makeJob('ft-2382', 'release-notes-style-a', 'compact-7b', 'ds-release-v1', 'Meera Poluru', 'Queued', 3, 1, 8, 0, 'Today 09:10', 11),
    this.makeJob('ft-2381', 'support-replies-13b', 'standard-13b', 'ds-support-v5', 'Arjun Poluru', 'Training', 3, 1, 16, 0.55, 'Today 07:42', 7),
    this.makeJob('ft-2380', 'product-qa-7b', 'compact-7b', 'ds-product-v8', 'Lavanya Poluru', 'Succeeded', 3, 1, 16, 1, 'Sep 26', 3),
    this.makeJob('ft-2379', 'contract-clauses-34b', 'large-34b', 'ds-contracts-v2', 'Pooja Poluru', 'Succeeded', 6, 2, 8, 1, 'Sep 24', 5),
    this.makeJob('ft-2378', 'ticket-routing-7b', 'compact-7b', 'ds-routing-v3', 'Kiran Poluru', 'Failed', 2, 1, 32, 0, 'Sep 26', 9),
    this.makeJob('ft-2377', 'support-replies-v4-13b', 'standard-13b', 'ds-support-v5', 'Arjun Poluru', 'Cancelled', 4, 1.5, 16, 0.38, 'Sep 21', 13),
    this.makeJob('ft-2376', 'product-qa-13b', 'standard-13b', 'ds-product-v8', 'Lavanya Poluru', 'Succeeded', 2, 0.5, 16, 1, 'Sep 18', 21),
  ]);

  readonly page = signal(0);
  readonly selectedJobId = signal('ft-2381');
  readonly jobFilter = signal('all');
  readonly jobSearch = signal('');
  readonly jobPage = signal(1);
  readonly jobTab = signal(0);
  readonly curveView = signal('both');
  readonly live = signal(true);
  readonly selectedDatasetId = signal('ds-routing-v3');
  readonly revalidating = signal(false);
  readonly selectedCheckpointId = signal('ft-2379-e4');
  readonly deployed = signal<Record<string, string>>({ 'product-qa': 'ft-2376-e2' });
  readonly deleted = signal<Record<string, boolean>>({});
  readonly ratings = signal<Record<string, number>>({ 'ft-2380-e3': 4, 'ft-2376-e2': 3 });
  readonly checkpointNotes = signal<Record<string, string>>({});
  readonly compareIds = signal<Record<string, boolean>>({ 'ft-2380': true, 'ft-2376': true, 'ft-2379': true });
  readonly rangeStart = signal('2026-09-01');
  readonly rangeEnd = signal('2026-09-28');
  readonly quota = signal(400);
  readonly budget = signal(2500);
  readonly maxConcurrent = signal(3);
  readonly keepBest = signal(true);
  readonly cleanupDays = signal('30');
  readonly notifyDone = signal(true);
  readonly notifyEmail = signal('ml-team@poluru.example');
  readonly reportTime = signal('09:00');
  readonly defaultBase = signal('standard-13b');
  readonly defaultOwner = signal('Meera Poluru');
  readonly step = signal(0);
  readonly draft = signal<Draft>(this.blankDraft());
  readonly modal = signal<'deploy' | 'cancel' | null>(null);
  readonly pin = signal('');
  readonly drawerOpen = signal(false);
  readonly menuOpen = signal(false);
  readonly helpOpen = signal(false);
  readonly showIntro = signal(true);
  readonly teamSort = signal<{ key: string; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });
  readonly notice = signal('');
  readonly error = signal('');
  readonly toastOpen = signal(false);
  readonly toastTitle = signal('');
  readonly toastBody = signal('');
  readonly events = signal<{ jobId: string; title: string; description: string; timestamp: string }[]>([
    { jobId: 'ft-2381', title: 'Training started', description: '2,094 steps on 1× GPU node', timestamp: 'Today 07:51' },
    { jobId: 'ft-2381', title: 'Validation passed', description: '11,160 train / 1,240 validation rows', timestamp: 'Today 07:49' },
    { jobId: 'ft-2378', title: 'Failed validation', description: '212 records have no assistant turn', timestamp: 'Sep 26 15:04' },
    { jobId: 'ft-2380', title: 'Job succeeded', description: 'Best checkpoint at epoch 3', timestamp: 'Sep 26 13:22' },
    { jobId: 'ft-2379', title: 'Job succeeded', description: 'Validation loss rose after epoch 4', timestamp: 'Sep 24 22:10' },
  ]);

  readonly navItems = computed(() => this.pages.map((label, i) => ({ label, active: i === this.page() })));
  readonly breadcrumbs = computed(() => [{ label: 'Poluru Labs' }, { label: this.pages[this.page()] }]);
  readonly baseOptions = BASES.map((base) => ({ label: `${base.label} · $${base.price.toFixed(2)} / 1M tokens`, value: base.id }));
  readonly baseShort = BASES.map((base) => ({ label: base.label, value: base.id }));
  readonly datasetOptions = computed(() => this.datasets().map((ds) => ({ label: `${ds.name}${ds.status === 'Validated' ? '' : ' — ' + ds.status.toLowerCase()}`, value: ds.id })));
  readonly statusOptions = [
    { label: 'All', value: 'all' }, { label: 'Active', value: 'active' }, { label: 'Succeeded', value: 'Succeeded' }, { label: 'Failed', value: 'failed' },
  ];
  readonly curveOptions = [{ label: 'Train + validation', value: 'both' }, { label: 'Validation only', value: 'val' }];
  readonly lrOptions = [{ label: '0.5× (safer)', value: '0.5' }, { label: '1× (default)', value: '1' }, { label: '1.5×', value: '1.5' }, { label: '2× (faster, riskier)', value: '2' }];
  readonly cleanupOptions = [{ label: '7 days', value: '7' }, { label: '30 days', value: '30' }, { label: '90 days', value: '90' }, { label: 'Never', value: 'never' }];
  readonly wizardSteps = [
    { label: 'Base model', description: 'What to start from' },
    { label: 'Data', description: 'Training file and split' },
    { label: 'Hyperparameters', description: 'How to train' },
    { label: 'Review', description: 'Estimate and launch' },
  ];
  readonly lifecycle = [{ label: 'Queued' }, { label: 'Validating' }, { label: 'Training' }, { label: 'Evaluating' }, { label: 'Done' }];
  readonly jobTabs = [{ label: 'Curves' }, { label: 'Hyperparameters' }, { label: 'Events' }];
  readonly teamColumns = [{ key: 'name', label: 'Member' }, { key: 'role', label: 'Role' }, { key: 'jobs', label: 'Jobs' }, { key: 'hours', label: 'GPU hours' }, { key: 'focus', label: 'Focus' }];
  readonly guide = [
    { heading: 'Epochs', content: 'How many times the model sees the full dataset. Small datasets usually need 3–4; large ones 1–2. Watch validation loss: if it rises while training loss falls, you have too many.', open: true },
    { heading: 'Learning rate multiplier', content: 'Scales the default step size. Lower is steadier and slower; higher learns faster but can overshoot and overfit.' },
    { heading: 'Batch size', content: 'Rows per step. Larger batches give smoother curves and fewer steps; “Auto” picks one based on dataset size.' },
    { heading: 'Validation split', content: 'Rows held back to measure generalisation. Keep at least a few hundred.' },
  ];

  readonly selectedJob = computed(() => this.jobs().find((job) => job.id === this.selectedJobId()) ?? this.jobs()[0]);
  readonly filteredJobs = computed(() => {
    const query = this.jobSearch().trim().toLowerCase();
    const filter = this.jobFilter();
    return this.jobs().filter((job) => {
      const active = ['Queued', 'Validating', 'Training', 'Evaluating'].includes(job.status);
      const matchesFilter = filter === 'all' || (filter === 'active' ? active : filter === 'failed' ? job.status === 'Failed' || job.status === 'Cancelled' : job.status === filter);
      return matchesFilter && (!query || `${job.id} ${job.name} ${job.owner} ${this.datasetName(job.dataset)}`.toLowerCase().includes(query));
    });
  });
  readonly pagedJobs = computed(() => this.filteredJobs().slice((this.jobPage() - 1) * 6, this.jobPage() * 6));
  readonly activeJobs = computed(() => this.jobs().filter((job) => ['Queued', 'Validating', 'Training', 'Evaluating'].includes(job.status)));
  readonly trainingJob = computed(() => this.jobs().find((job) => job.status === 'Training') ?? this.jobs().find((job) => job.status === 'Succeeded')!);
  readonly gpuUsed = computed(() => Math.round(this.jobs().reduce((sum, job) => sum + job.gpuHours, 0) * 10) / 10);
  readonly monthCost = computed(() => Math.round(this.jobs().reduce((sum, job) => sum + this.jobCost(job), 0)));
  readonly successRate = computed(() => {
    const done = this.jobs().filter((job) => ['Succeeded', 'Failed', 'Cancelled'].includes(job.status));
    return done.length ? Math.round((done.filter((job) => job.status === 'Succeeded').length / done.length) * 100) : 0;
  });
  readonly allCheckpoints = computed(() => this.jobs().flatMap((job) => this.checkpoints(job)).filter((ckpt) => !this.deleted()[ckpt.id]));
  readonly bestScore = computed(() => Math.max(0, ...this.allCheckpoints().map((ckpt) => ckpt.score)));
  readonly selectedCheckpoint = computed(() => this.allCheckpoints().find((ckpt) => ckpt.id === this.selectedCheckpointId()) ?? this.allCheckpoints()[0] ?? null);
  readonly checkpointJob = computed(() => this.jobs().find((job) => job.id === this.selectedCheckpoint()?.jobId) ?? null);
  readonly checkpointTree = computed(() => this.jobs()
    .map((job) => ({ job, list: this.checkpoints(job).filter((ckpt) => !this.deleted()[ckpt.id]) }))
    .filter((entry) => entry.list.length)
    .map(({ job, list }) => {
      const best = this.best(list);
      return { id: job.id, label: `${job.name}`, children: list.map((ckpt) => ({ id: ckpt.id, label: `Epoch ${ckpt.epoch} · val ${ckpt.val.toFixed(3)}${ckpt.id === best?.id ? ' ★' : ''}${this.isDeployed(ckpt.id) ? ' · live' : ''}` })) };
    }));
  readonly treeExpanded = computed(() => Object.fromEntries(this.jobs().map((job) => [job.id, job.id === this.selectedCheckpoint()?.jobId])));
  readonly selectedDataset = computed(() => this.datasets().find((ds) => ds.id === this.selectedDatasetId()) ?? this.datasets()[0]);
  readonly datasetMeta = computed(() => {
    const ds = this.selectedDataset();
    const val = Math.round(ds.rows * (ds.split / 100));
    return [
      { term: 'Rows', description: ds.rows.toLocaleString() },
      { term: 'Tokens', description: `${ds.tokens.toFixed(1)}M` },
      { term: 'Train / validation', description: `${(ds.rows - val).toLocaleString()} / ${val.toLocaleString()}` },
      { term: 'Format', description: ds.format },
      { term: 'Owner', description: ds.owner },
      { term: 'Used by', description: `${this.jobs().filter((job) => job.dataset === ds.id).length} job(s)` },
    ];
  });
  readonly jobMeta = computed(() => {
    const job = this.selectedJob();
    return [
      { term: 'Base model', description: this.baseLabel(job.base) },
      { term: 'Dataset', description: this.datasetName(job.dataset) },
      { term: 'Epochs', description: String(job.epochs) },
      { term: 'Learning rate', description: `${job.lr}× default` },
      { term: 'Batch size', description: String(job.batch) },
      { term: 'Warmup', description: `${job.warmup}% of steps` },
      { term: 'Seed', description: String(job.seed) },
      { term: 'Owner', description: job.owner },
      { term: 'GPU hours', description: job.gpuHours.toFixed(1) },
    ];
  });
  readonly jobEvents = computed(() => this.events().filter((event) => event.jobId === this.selectedJobId()).map((event, i) => ({ ...event, status: i === 0 && this.isActive(this.selectedJob()) ? 'current' as const : 'complete' as const })));
  readonly recentEvents = computed(() => this.events().slice(0, 5).map((event) => ({ ...event, title: `${event.jobId} · ${event.title}`, status: 'complete' as const })));
  readonly configYaml = computed(() => {
    const job = this.selectedJob();
    return [`job: ${job.id}`, `base_model: ${job.base}`, `training_file: ${this.datasetName(job.dataset)}`, 'hyperparameters:', `  n_epochs: ${job.epochs}`, `  learning_rate_multiplier: ${job.lr}`, `  batch_size: ${job.batch}`, `  warmup_ratio: ${job.warmup / 100}`, `seed: ${job.seed}`].join('\n');
  });

  readonly estimate = computed(() => {
    const draft = this.draft();
    const base = BASES.find((item) => item.id === draft.base) ?? BASES[0];
    const ds = this.datasets().find((item) => item.id === draft.dataset);
    if (!ds) return { tokens: 0, cost: 0, hours: 0, steps: 0, batch: 16 };
    const trainRows = Math.round(ds.rows * (1 - draft.split / 100));
    const batch = draft.batch === 'auto' ? (trainRows > 10000 ? 32 : trainRows > 3000 ? 16 : 8) : Number(draft.batch);
    const tokens = ds.tokens * (1 - draft.split / 100) * draft.epochs;
    return { tokens: Math.round(tokens * 10) / 10, cost: Math.round(tokens * base.price * 100) / 100, hours: Math.round((tokens / base.throughput) * 10) / 10, steps: Math.ceil(trainRows / batch) * draft.epochs, batch };
  });
  readonly draftDataset = computed(() => this.datasets().find((ds) => ds.id === this.draft().dataset) ?? null);
  readonly draftSummary = computed(() => {
    const draft = this.draft();
    return [
      { term: 'Name', description: draft.name || '—' },
      { term: 'Base model', description: this.baseLabel(draft.base) },
      { term: 'Dataset', description: this.draftDataset()?.name ?? '—' },
      { term: 'Validation split', description: `${draft.split}%` },
      { term: 'Epochs', description: String(draft.epochs) },
      { term: 'Learning rate', description: `${draft.lr}×` },
      { term: 'Batch size', description: draft.batch === 'auto' ? `Auto (${this.estimate().batch})` : draft.batch },
      { term: 'Start', description: draft.startDate || 'As soon as a GPU is free' },
    ];
  });

  readonly succeededCount = computed(() => this.jobs().filter((job) => job.status === 'Succeeded').length);
  readonly deployments = computed(() => Object.entries(this.deployed()).map(([model, checkpoint]) => ({ model, checkpoint })));
  readonly ownerOptions = this.team.slice(0, 3).map((member) => ({ label: member.name, value: member.name }));
  readonly batchOptions = [{ label: 'Auto', value: 'auto' }, { label: '8', value: '8' }, { label: '16', value: '16' }, { label: '32', value: '32' }];
  readonly compareJobs = computed(() => this.jobs().filter((job) => this.compareIds()[job.id]).slice(0, 3));
  readonly compareRows = computed(() => this.compareJobs().map((job) => {
    const list = this.checkpoints(job);
    const best = this.best(list);
    return { job, best, finalTrain: list.length ? list[list.length - 1].train : null };
  }));
  readonly compareWinner = computed(() => this.compareRows().filter((row) => row.best).sort((a, b) => a.best!.val - b.best!.val)[0]?.job.id ?? '');
  readonly compareNames = computed(() => this.compareJobs().map((job) => job.id).join(', '));

  readonly ownerUsage = computed(() => this.team.map((member) => {
    const mine = this.jobs().filter((job) => job.owner === member.name);
    return { name: member.name, jobs: mine.length, hours: Math.round(mine.reduce((sum, job) => sum + job.gpuHours, 0) * 10) / 10, cost: Math.round(mine.reduce((sum, job) => sum + this.jobCost(job), 0)) };
  }));
  readonly maxOwnerHours = computed(() => Math.max(1, ...this.ownerUsage().map((row) => row.hours)));
  readonly baseUsage = computed(() => BASES.map((base) => {
    const mine = this.jobs().filter((job) => job.base === base.id);
    return { label: base.label, jobs: mine.length, hours: Math.round(mine.reduce((sum, job) => sum + job.gpuHours, 0) * 10) / 10, cost: Math.round(mine.reduce((sum, job) => sum + this.jobCost(job), 0)) };
  }));
  readonly teamRows = computed(() => {
    const { key, direction } = this.teamSort();
    return this.team.map((member) => {
      const usage = this.ownerUsage().find((row) => row.name === member.name)!;
      return { ...member, jobs: usage.jobs, hours: usage.hours };
    }).sort((a, b) => {
      const av = a[key as keyof typeof a];
      const bv = b[key as keyof typeof b];
      const cmp = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv));
      return direction === 'asc' ? cmp : -cmp;
    });
  });
  readonly runningList = computed(() => this.activeJobs().map((job) => ({ label: job.name, description: `${job.status}${job.status === 'Training' ? ' · ' + this.progress(job) + '%' : ''}`, selected: job.id === this.selectedJobId() })));

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const timer = setInterval(() => this.live() && this.tick(), 1500);
      destroyRef.onDestroy(() => clearInterval(timer));
    });
  }

  makeJob(id: string, name: string, base: string, dataset: string, owner: string, status: JobStatus, epochs: number, lr: number, batch: number, done: number, created: string, seed: number): Job {
    const ds = this.datasets?.().find((item) => item.id === dataset);
    const rows = ds ? ds.rows * (1 - ds.split / 100) : 5000;
    const total = Math.ceil(rows / batch) * epochs;
    const r = rng(seed);
    const baseBonus = base === 'large-34b' ? 0.18 : base === 'standard-13b' ? 0.1 : 0;
    const floor = Math.max(0.35, 0.95 - baseBonus - 0.08 * Math.min(lr, 1.5) + r() * 0.08);
    const tokens = ds ? ds.tokens * (1 - ds.split / 100) * epochs * done : 0;
    const throughput = BASES.find((item) => item.id === base)?.throughput ?? 1;
    return {
      id, name, base, dataset, owner, status, epochs, lr, batch, warmup: 5, seed,
      step: Math.round(total * done), total, phase: 0, created, gpuHours: Math.round((tokens / throughput) * 10) / 10,
      start: 2.3 + r() * 0.3, floor, tau: total / (2.2 + lr * 1.4), overfit: Math.max(0, (epochs - 3) * 0.06 + (lr - 1) * 0.12),
      error: status === 'Failed' ? 'Validation failed: 212 records have no assistant turn.' : '',
    };
  }

  blankDraft(): Draft {
    return { name: '', base: this.defaultBase?.() ?? 'standard-13b', dataset: 'ds-support-v5', split: 10, epochs: 3, lr: '1', batch: 'auto', warmup: 5, seed: 42, earlyStop: true, startDate: '' };
  }

  loss(job: Job, step: number): { train: number; val: number } {
    const t = step / job.total;
    const r = rng(job.seed * 1000 + Math.round(t * 200));
    const train = job.floor + (job.start - job.floor) * Math.exp(-step / job.tau) + (r() - 0.5) * 0.05;
    const warm = step < job.total * (job.warmup / 100) ? 0.08 : 0;
    const val = train + 0.06 + warm + job.overfit * Math.max(0, t - 0.55) * 2.2 + (r() - 0.5) * 0.02;
    return { train: Math.max(0.2, train), val: Math.max(0.25, val) };
  }

  checkpoints(job: Job): Checkpoint[] {
    const list: Checkpoint[] = [];
    for (let epoch = 1; epoch <= job.epochs; epoch++) {
      const step = Math.round((job.total * epoch) / job.epochs);
      if (step > job.step) break;
      const { train, val } = this.loss(job, step);
      list.push({ id: `${job.id}-e${epoch}`, jobId: job.id, epoch, step, train: Math.round(train * 1000) / 1000, val: Math.round(val * 1000) / 1000, score: Math.round(Math.max(0, Math.min(99, 118 - val * 50))) });
    }
    return list;
  }

  best(list: Checkpoint[]): Checkpoint | null {
    return list.reduce<Checkpoint | null>((best, ckpt) => (!best || ckpt.val < best.val ? ckpt : best), null);
  }

  curvePath(job: Job, kind: 'train' | 'val'): string {
    if (!job.step) return '';
    const points = 48;
    const max = job.start + 0.3;
    const parts: string[] = [];
    for (let i = 0; i <= points; i++) {
      const step = (job.step * i) / points;
      const value = this.loss(job, Math.max(1, step))[kind];
      parts.push(`${i ? 'L' : 'M'}${((step / job.total) * 560).toFixed(1)},${(180 - (value / max) * 170).toFixed(1)}`);
    }
    return parts.join(' ');
  }

  epochMarks(job: Job): number[] {
    return Array.from({ length: job.epochs - 1 }, (_, i) => ((i + 1) / job.epochs) * 560);
  }

  progress(job: Job): number {
    return job.total ? Math.min(100, Math.round((job.step / job.total) * 100)) : 0;
  }

  lifecycleStep(job: Job): number {
    return { Queued: 0, Validating: 1, Training: 2, Evaluating: 3, Succeeded: 5, Failed: 1, Cancelled: 2 }[job.status];
  }

  isActive(job: Job): boolean {
    return ['Queued', 'Validating', 'Training', 'Evaluating'].includes(job.status);
  }

  tone(status: string): Tone {
    const map: Record<string, Tone> = { Queued: 'neutral', Validating: 'info', Training: 'brand', Evaluating: 'info', Succeeded: 'success', Failed: 'danger', Cancelled: 'warning', Validated: 'success', Issues: 'danger' };
    return map[status] ?? 'neutral';
  }

  checkTone(state: CheckState): Tone {
    return state === 'pass' ? 'success' : state === 'warn' ? 'warning' : 'danger';
  }

  baseLabel(id: string): string {
    return BASES.find((base) => base.id === id)?.label ?? id;
  }

  datasetName(id: string): string {
    return this.datasets().find((ds) => ds.id === id)?.name ?? id;
  }

  jobCost(job: Job): number {
    const ds = this.datasets().find((item) => item.id === job.dataset);
    const base = BASES.find((item) => item.id === job.base);
    if (!ds || !base) return 0;
    return ds.tokens * (1 - ds.split / 100) * job.epochs * (job.step / job.total) * base.price;
  }

  family(jobId: string): string {
    return this.jobs().find((job) => job.id === jobId)?.name.replace(/-(7b|13b|34b)$/, '').replace(/-v\d+$/, '') ?? jobId;
  }

  isDeployed(ckptId: string): boolean {
    return Object.values(this.deployed()).includes(ckptId);
  }

  eta(job: Job): string {
    if (job.status !== 'Training') return '—';
    const minutes = Math.round(((job.total - job.step) / job.total) * 38);
    return minutes > 59 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : `${minutes}m`;
  }

  tick(): void {
    const finished: Job[] = [];
    const next: Record<JobStatus, JobStatus> = { Queued: 'Validating', Validating: 'Training', Training: 'Evaluating', Evaluating: 'Succeeded', Succeeded: 'Succeeded', Failed: 'Failed', Cancelled: 'Cancelled' };
    this.jobs.update((list) => list.map((job) => {
      if (!this.isActive(job)) return job;
      if (job.status === 'Training') {
        const step = Math.min(job.total, job.step + Math.ceil(job.total / 70));
        const throughput = BASES.find((base) => base.id === job.base)?.throughput ?? 1;
        const ds = this.datasets().find((item) => item.id === job.dataset);
        const hours = ds ? (ds.tokens * (1 - ds.split / 100) * job.epochs * (step / job.total)) / throughput : job.gpuHours;
        const updated = { ...job, step, gpuHours: Math.round(hours * 10) / 10 };
        if (step >= job.total) return { ...updated, status: 'Evaluating' as JobStatus, phase: 0 };
        if (Math.floor((job.step / job.total) * job.epochs) < Math.floor((step / job.total) * job.epochs)) this.addEvent(job.id, `Epoch ${Math.floor((step / job.total) * job.epochs)} checkpoint saved`, `Step ${step.toLocaleString()}`);
        return updated;
      }
      if (job.phase < 2) return { ...job, phase: job.phase + 1 };
      const status = next[job.status];
      if (status === 'Training') {
        const running = list.filter((other) => other.status === 'Training').length;
        if (running >= this.maxConcurrent()) return job;
      }
      if (status === 'Succeeded') finished.push(job);
      this.addEvent(job.id, status === 'Succeeded' ? 'Job succeeded' : `${status} started`, status === 'Training' ? `${job.total.toLocaleString()} steps` : '');
      return { ...job, status, phase: 0 };
    }));
    for (const job of finished) this.notify('Job succeeded', `${job.name} finished. Best checkpoint is ready to review.`);
  }

  addEvent(jobId: string, title: string, description: string): void {
    const now = new Date();
    this.events.update((list) => [{ jobId, title, description, timestamp: `Today ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}` }, ...list]);
  }

  navigate(page: number): void {
    this.page.set(page);
    this.error.set('');
    this.drawerOpen.set(false);
  }

  onNav(event: { label: string }): void {
    const index = this.pages.indexOf(event.label);
    if (index >= 0) this.navigate(index);
  }

  openJob(id: string): void {
    this.selectedJobId.set(id);
    this.jobTab.set(0);
    this.navigate(1);
  }

  onRunningList(event: { index: number }): void {
    const job = this.activeJobs()[event.index];
    if (job) this.openJob(job.id);
  }

  globalSearch(value: string): void {
    this.jobSearch.set(value);
    this.jobFilter.set('all');
    this.jobPage.set(1);
    if (value.trim()) this.navigate(1);
  }

  cancelJob(): void {
    const job = this.selectedJob();
    this.jobs.update((list) => list.map((item) => (item.id === job.id ? { ...item, status: 'Cancelled' as JobStatus } : item)));
    this.addEvent(job.id, 'Cancelled', `Stopped at step ${job.step.toLocaleString()}; saved checkpoints are kept`);
    this.closeModal();
    this.notify('Job cancelled', job.name);
  }

  cloneJob(job = this.selectedJob()): void {
    this.draft.set({ name: `${job.name}-retry`, base: job.base, dataset: job.dataset, split: 10, epochs: job.epochs, lr: String(job.lr), batch: String(job.batch), warmup: job.warmup, seed: job.seed + 1, earlyStop: true, startDate: '' });
    this.step.set(0);
    this.navigate(2);
    this.notify('Settings copied', `Starting from ${job.id}. Change anything before launching.`);
  }

  onJobMenu(item: { value: string }): void {
    const job = this.selectedJob();
    if (item.value === 'config') this.download(this.configYaml(), `${job.id}.yaml`, 'text/yaml');
    else if (item.value === 'compare') {
      this.compareIds.update((map) => ({ ...map, [job.id]: true }));
      this.navigate(5);
    }
  }

  patchDraft(change: Partial<Draft>): void {
    this.draft.update((draft) => ({ ...draft, ...change }));
    this.error.set('');
  }

  nextStep(): void {
    const draft = this.draft();
    if (this.step() === 0 && !/^[a-z0-9][a-z0-9-]{2,40}$/.test(draft.name)) {
      this.error.set('Use 3–40 lowercase letters, numbers, or dashes for the job name.');
      return;
    }
    if (this.step() === 1) {
      const ds = this.draftDataset();
      if (!ds) return this.error.set('Pick a dataset.');
      if (ds.status !== 'Validated') return this.error.set(`${ds.name} has validation issues. Fix them on the Datasets page first.`);
      if (Math.round(ds.rows * (draft.split / 100)) < 100) return this.error.set('Hold back at least 100 validation rows.');
    }
    if (this.step() === 2 && (draft.epochs < 1 || draft.epochs > 10)) return this.error.set('Epochs must be between 1 and 10.');
    if (this.step() < 3) {
      this.step.update((value) => value + 1);
      this.error.set('');
      return;
    }
    this.launch();
  }

  prevStep(): void {
    this.step.update((value) => Math.max(0, value - 1));
    this.error.set('');
  }

  onWizardStep(index: number): void {
    if (index < this.step()) this.step.set(index);
  }

  launch(): void {
    const draft = this.draft();
    const id = `ft-${2383 + this.jobs().length - 7}`;
    const job = this.makeJob(id, draft.name, draft.base, draft.dataset, this.defaultOwner(), 'Queued', draft.epochs, Number(draft.lr), this.estimate().batch, 0, draft.startDate ? `Scheduled ${draft.startDate}` : 'Just now', draft.seed);
    job.warmup = draft.warmup;
    this.jobs.update((list) => [job, ...list]);
    this.addEvent(id, 'Queued', `${this.estimate().steps.toLocaleString()} steps · est. $${this.estimate().cost.toFixed(2)}`);
    this.draft.set(this.blankDraft());
    this.step.set(0);
    this.openJob(id);
    this.notify('Job queued', `${draft.name} will start when a GPU is free.`);
  }

  setSplit(value: number): void {
    this.datasets.update((list) => list.map((ds) => (ds.id === this.selectedDatasetId() ? { ...ds, split: value } : ds)));
  }

  revalidate(): void {
    const id = this.selectedDatasetId();
    this.revalidating.set(true);
    setTimeout(() => {
      this.datasets.update((list) => list.map((ds) => (ds.id === id && ds.status === 'Issues' ? { ...ds, status: 'Validated', rows: ds.rows - 212, checks: passing(ds.rows - 212).map((check, i) => (i === 1 ? { ...check, detail: '212 incomplete records were removed' } : check)), updated: 'Today' } : ds)));
      this.revalidating.set(false);
      this.notify('Validation finished', `${this.datasetName(id)} is ready for training.`);
    }, 1200);
  }

  onUpload(detail: { files: File[] }): void {
    const file = detail.files[0];
    if (!file) return;
    if (!/\.(jsonl|csv)$/i.test(file.name)) {
      this.error.set('Upload a .jsonl or .csv file.');
      return;
    }
    const id = `ds-${Date.now()}`;
    const rows = Math.max(120, Math.round(file.size / 420));
    this.datasets.update((list) => [{ id, name: file.name.replace(/\.(jsonl|csv)$/i, ''), rows, tokens: Math.max(0.1, Math.round((file.size / 4e6) * 10) / 10), format: file.name.endsWith('.csv') ? 'CSV' : 'Chat JSONL', owner: 'Meera Poluru', updated: 'Today', status: 'Validating', checks: [], split: 10, sample: sample('…', '…') }, ...list]);
    this.selectedDatasetId.set(id);
    this.error.set('');
    this.revalidating.set(true);
    setTimeout(() => {
      this.datasets.update((list) => list.map((ds) => (ds.id === id ? { ...ds, status: 'Validated', checks: passing(rows) } : ds)));
      this.revalidating.set(false);
      this.notify('Dataset ready', `${file.name} passed validation.`);
    }, 1400);
  }

  trainOn(dataset: Dataset): void {
    this.patchDraft({ dataset: dataset.id, name: this.draft().name || `${dataset.name}-7b`, base: 'compact-7b' });
    this.step.set(0);
    this.navigate(2);
  }

  selectCheckpoint(id: string): void {
    if (this.allCheckpoints().some((ckpt) => ckpt.id === id)) this.selectedCheckpointId.set(id);
    else {
      const first = this.allCheckpoints().find((ckpt) => ckpt.jobId === id);
      if (first) this.selectedCheckpointId.set(first.id);
    }
  }

  openDeploy(): void {
    this.pin.set('');
    this.error.set('');
    this.modal.set('deploy');
  }

  confirmDeploy(): void {
    const ckpt = this.selectedCheckpoint();
    if (!ckpt) return;
    if (this.pin() !== ckpt.jobId.slice(-4)) {
      this.error.set(`Type ${ckpt.jobId.slice(-4)}, the last four digits of the job ID, to confirm.`);
      return;
    }
    this.deployed.update((map) => ({ ...map, [this.family(ckpt.jobId)]: ckpt.id }));
    this.addEvent(ckpt.jobId, `Deployed epoch ${ckpt.epoch}`, `Now serving ${this.family(ckpt.jobId)}`);
    this.closeModal();
    this.notify('Checkpoint deployed', `${ckpt.id} now serves ${this.family(ckpt.jobId)}.`);
  }

  deleteCheckpoint(): void {
    const ckpt = this.selectedCheckpoint();
    if (!ckpt) return;
    if (this.isDeployed(ckpt.id)) {
      this.error.set('This checkpoint is live. Deploy another one before deleting it.');
      return;
    }
    this.deleted.update((map) => ({ ...map, [ckpt.id]: true }));
    this.selectedCheckpointId.set(this.allCheckpoints()[0]?.id ?? '');
    this.notify('Checkpoint deleted', ckpt.id);
  }

  cleanup(): void {
    const removable = this.jobs().flatMap((job) => {
      const list = this.checkpoints(job).filter((ckpt) => !this.deleted()[ckpt.id]);
      const best = this.best(list);
      return list.filter((ckpt) => ckpt.id !== best?.id && !this.isDeployed(ckpt.id) && !this.isActive(job));
    });
    this.deleted.update((map) => ({ ...map, ...Object.fromEntries(removable.map((ckpt) => [ckpt.id, true])) }));
    if (this.deleted()[this.selectedCheckpointId()]) this.selectedCheckpointId.set(this.allCheckpoints()[0]?.id ?? '');
    this.notify('Cleanup finished', removable.length ? `Removed ${removable.length} checkpoint(s), kept the best of each job.` : 'Nothing to remove.');
  }

  setRating(value: number): void {
    const ckpt = this.selectedCheckpoint();
    if (ckpt) this.ratings.update((map) => ({ ...map, [ckpt.id]: value }));
  }

  setCheckpointNote(value: string): void {
    const ckpt = this.selectedCheckpoint();
    if (ckpt) this.checkpointNotes.update((map) => ({ ...map, [ckpt.id]: value }));
  }

  toggleCompare(id: string, value: boolean): void {
    if (value && this.compareJobs().length >= 3) {
      this.error.set('Compare up to three runs at a time. Untick one first.');
      return;
    }
    this.error.set('');
    this.compareIds.update((map) => ({ ...map, [id]: value }));
  }

  comparePath(job: Job): string {
    return this.curvePath(job, 'val');
  }

  onRange(range: { start: string; end: string }): void {
    this.rangeStart.set(range.start);
    this.rangeEnd.set(range.end);
  }

  saveSettings(): void {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.notifyEmail().trim())) {
      this.error.set('Enter a valid email address for notifications.');
      return;
    }
    if (this.maxConcurrent() < 1) {
      this.error.set('Allow at least one concurrent job.');
      return;
    }
    this.error.set('');
    this.notify('Settings saved', `Up to ${this.maxConcurrent()} jobs at once, default ${this.baseLabel(this.defaultBase())}.`);
  }

  exportJobs(): void {
    const rows = [['id', 'name', 'status', 'base', 'dataset', 'epochs', 'lr', 'batch', 'progress', 'gpu_hours', 'cost_usd'], ...this.jobs().map((job) => [job.id, job.name, job.status, job.base, this.datasetName(job.dataset), job.epochs, job.lr, job.batch, this.progress(job) + '%', job.gpuHours, this.jobCost(job).toFixed(2)])];
    this.download(rows.map((row) => row.join(',')).join('\n'), 'fine-tuning-jobs.csv', 'text/csv');
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

  downloadCheckpoint(ckpt: Checkpoint): void {
    const job = this.jobs().find((item) => item.id === ckpt.jobId);
    this.download(JSON.stringify({ checkpoint: ckpt.id, job: ckpt.jobId, base_model: job?.base, epoch: ckpt.epoch, step: ckpt.step, train_loss: ckpt.train, val_loss: ckpt.val, eval_score: ckpt.score }, null, 2), `${ckpt.id}.json`, 'application/json');
  }

  onProfile(item: { value: string }): void {
    if (item.value === 'mine') {
      this.globalSearch('Meera');
    } else this.navigate(item.value === 'team' ? 7 : 8);
    this.menuOpen.set(false);
  }

  closeModal(): void {
    this.modal.set(null);
    this.error.set('');
  }

  notify(title: string, description = ''): void {
    this.notice.set(description ? `${title}: ${description}` : title);
    this.toastTitle.set(title);
    this.toastBody.set(description);
    this.toastOpen.set(false);
    setTimeout(() => this.toastOpen.set(true));
  }
}
