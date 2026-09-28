import { ChangeDetectionStrategy, Component, HostListener, computed, signal } from '@angular/core';
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

type Kind = 'text' | 'image' | 'conversation';
type Status = 'Unlabeled' | 'In review' | 'Approved' | 'Changes requested';
type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
type QueueFilter = 'all' | Status;

interface Task {
  id: number;
  dataset: string;
  kind: Kind;
  title: string;
  content: string;
  owner: string;
  status: Status;
  label: string;
  note: string;
  flagged: boolean;
  feedback: string;
  confidence: number;
  rating: number;
  batch: string;
  senior: boolean;
}

interface ActivityRow {
  event: string;
  dataset: string;
  member: string;
  time: string;
  date: string;
}

@Component({
  selector: 'app-root',
  imports: [
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
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly page = signal(0);
  readonly kind = signal<Kind>('text');
  readonly selectedId = signal(101);
  readonly label = signal('');
  readonly note = signal('');
  readonly flagged = signal(false);
  readonly confidence = signal(70);
  readonly rating = signal(0);
  readonly senior = signal(false);
  readonly notice = signal('');
  readonly error = signal('');
  readonly search = signal('');
  readonly taskSearch = signal('');
  readonly taskFilter = signal<QueueFilter>('all');
  readonly queueTab = signal(0);
  readonly reviewPage = signal(1);
  readonly activityPage = signal(1);
  readonly modal = signal<'create' | 'review' | null>(null);
  readonly reviewTask = signal<Task | null>(null);
  readonly feedback = signal('');
  readonly newTitle = signal('');
  readonly newContent = signal('');
  readonly newKind = signal<Kind>('text');
  readonly newOwner = signal('Riya Poluru');
  readonly newBatch = signal('');
  readonly imageContent = signal('');
  readonly imageLoading = signal(false);
  readonly drawerOpen = signal(false);
  readonly drawerId = signal('support');
  readonly menuOpen = signal(false);
  readonly helpOpen = signal(false);
  readonly showIntro = signal(true);
  readonly toastOpen = signal(false);
  readonly toastTitle = signal('');
  readonly toastBody = signal('');
  readonly dailyTarget = signal(12);
  readonly reviewStart = signal('09:00');
  readonly sprintEnd = signal('2026-10-03');
  readonly alertsEnabled = signal(true);
  readonly preferredLabel = signal('');
  readonly rangeStart = signal('2026-09-01');
  readonly rangeEnd = signal('2026-09-27');
  readonly guideSelection = signal('order');
  readonly guidelineRating = signal(4);
  readonly expandedIds = signal<Record<string, boolean>>({ text: true, image: true, dialogue: true });
  readonly teamSort = signal<{ key: string; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });

  readonly nav = [
    { label: 'Overview' },
    { label: 'Workbench' },
    { label: 'Datasets' },
    { label: 'Review queue' },
    { label: 'Guidelines' },
    { label: 'Team' },
    { label: 'Activity' },
    { label: 'Settings' },
  ];
  readonly headings = [
    { eyebrow: 'FINE-TUNING DATASETS', title: 'Data Labeling Workbench', summary: 'Annotate text, images, and conversations for fine-tuning datasets with team review queues.' },
    { eyebrow: 'ANNOTATION', title: 'Workbench', summary: 'Read the item, apply a label, and send it to the team review queue.' },
    { eyebrow: 'COLLECTIONS', title: 'Datasets', summary: 'Three active collections covering text, images, and conversations.' },
    { eyebrow: 'TEAM REVIEW', title: 'Review queue', summary: 'Approve careful labels, or send a clear note when something needs another pass.' },
    { eyebrow: 'SHARED RULES', title: 'Guidelines', summary: 'One taxonomy so every annotator labels the same way.' },
    { eyebrow: 'PEOPLE', title: 'Team', summary: 'Annotators and reviewers working from the Poluru Labs workspace.' },
    { eyebrow: 'SESSION LOG', title: 'Activity', summary: 'What the team labeled, reviewed, and exported in this session.' },
    { eyebrow: 'WORKSPACE', title: 'Settings', summary: 'Daily pace, review hours, and the label you prefer to start from.' },
  ];
  readonly kinds = [
    { label: 'Text', value: 'text' },
    { label: 'Images', value: 'image' },
    { label: 'Conversations', value: 'conversation' },
  ];
  readonly kindOptions = [{ label: 'All datasets', value: 'all' }, ...this.kinds];
  readonly datasetKind = signal('all');
  readonly queueTabs = [{ label: 'Awaiting review' }, { label: 'Approved' }, { label: 'Changes requested' }];
  readonly steps = [
    { label: 'Read', description: 'Open the source' },
    { label: 'Label', description: 'Choose one class' },
    { label: 'Note', description: 'Add context' },
    { label: 'Submit', description: 'Send to review' },
  ];
  readonly owners = ['Mira Poluru', 'Kiran Poluru', 'Aarav Poluru', 'Nila Poluru', 'Tara Poluru', 'Dev Poluru', 'Riya Poluru'].map((name) => ({ label: name, value: name }));
  readonly labelSuggestions = ['Order & delivery', 'Returns & refunds', 'Account access', 'Other', 'Circles', 'Squares', 'Mixed shapes', 'Resolved', 'Needs follow-up', 'Escalated', 'Unclear'];
  readonly breadcrumbs = computed(() => [{ label: 'Workspace' }, { label: this.nav[this.page()].label }]);
  readonly datasets = [
    { id: 'support', name: 'Customer intent', kind: 'text' as Kind, owner: 'Mira Poluru', description: 'Turn everyday customer messages into clear intent labels.', icon: 'file' as const },
    { id: 'visual', name: 'Visual classification', kind: 'image' as Kind, owner: 'Kiran Poluru', description: 'Classify visual content with a shared shape taxonomy.', icon: 'eye' as const },
    { id: 'dialogue', name: 'Conversation quality', kind: 'conversation' as Kind, owner: 'Aarav Poluru', description: 'Score support conversations for resolution and helpfulness.', icon: 'mail' as const },
  ];
  readonly tasks = signal<Task[]>([
    { id: 101, dataset: 'support', kind: 'text', title: 'A little help with an order', content: 'Hi there! I placed an order last Thursday and the tracking page still says “processing.” Could you check when it will be dispatched? It’s a birthday gift, so I’d love to know if it can arrive by Friday. Thank you!', owner: 'Mira Poluru', status: 'Unlabeled', label: '', note: '', flagged: false, feedback: '', confidence: 60, rating: 0, batch: 'B101', senior: false },
    { id: 102, dataset: 'support', kind: 'text', title: 'Updating account details', content: 'I have a new email address and would like to update the one on my account. Where can I make this change?', owner: 'Nila Poluru', status: 'Unlabeled', label: '', note: '', flagged: false, feedback: '', confidence: 55, rating: 0, batch: 'B102', senior: false },
    { id: 103, dataset: 'support', kind: 'text', title: 'Requesting a refund', content: 'The item arrived damaged. I would like to return it and receive a refund.', owner: 'Tara Poluru', status: 'In review', label: 'Returns & refunds', note: 'The customer explicitly asks to return a damaged item.', flagged: false, feedback: '', confidence: 88, rating: 4, batch: 'B103', senior: false },
    { id: 104, dataset: 'support', kind: 'text', title: 'Delivery confirmation', content: 'My tracking says delivered, but the parcel is not here. Can you help me locate it?', owner: 'Dev Poluru', status: 'Approved', label: 'Order & delivery', note: 'Tracking conflict. The customer still needs the parcel located.', flagged: false, feedback: '', confidence: 91, rating: 4, batch: 'B104', senior: false },
    { id: 201, dataset: 'visual', kind: 'image', title: 'Classify the visible shapes', content: 'sample-shapes.svg', owner: 'Kiran Poluru', status: 'Unlabeled', label: '', note: '', flagged: false, feedback: '', confidence: 50, rating: 0, batch: 'B201', senior: false },
    { id: 202, dataset: 'visual', kind: 'image', title: 'Check the circle collection', content: 'sample-circles.svg', owner: 'Kiran Poluru', status: 'In review', label: 'Circles', note: 'All visible objects are circular.', flagged: false, feedback: '', confidence: 96, rating: 5, batch: 'B202', senior: false },
    { id: 301, dataset: 'dialogue', kind: 'conversation', title: 'A password reset conversation', content: 'Customer: I cannot sign in to my account.\nAgent: I can help. Have you tried the password reset link?\nCustomer: Yes, I just reset it and can sign in now.\nAgent: Glad that worked. Is there anything else I can help with?\nCustomer: No, that’s everything. Thank you!', owner: 'Aarav Poluru', status: 'Unlabeled', label: '', note: '', flagged: false, feedback: '', confidence: 64, rating: 0, batch: 'B301', senior: false },
    { id: 302, dataset: 'dialogue', kind: 'conversation', title: 'A billing question', content: 'Customer: I was charged twice for the same order.\nAgent: I will forward this to the billing team.\nCustomer: When should I expect an update?\nAgent: They will follow up by email.', owner: 'Aarav Poluru', status: 'Changes requested', label: 'Resolved', note: '', flagged: true, feedback: 'The customer is still waiting for a billing resolution. Revisit the label.', confidence: 42, rating: 2, batch: 'B302', senior: true },
  ]);
  readonly activity = signal<ActivityRow[]>([
    { event: 'Approved task #104', dataset: 'Customer intent', member: 'Riya Poluru', time: 'Today, 09:20', date: '2026-09-27' },
    { event: 'Requested changes on #302', dataset: 'Conversation quality', member: 'Riya Poluru', time: 'Today, 09:05', date: '2026-09-27' },
    { event: 'Submitted task #103 for review', dataset: 'Customer intent', member: 'Tara Poluru', time: 'Yesterday, 16:40', date: '2026-09-26' },
    { event: 'Uploaded circle collection', dataset: 'Visual classification', member: 'Kiran Poluru', time: 'Sep 24, 11:15', date: '2026-09-24' },
    { event: 'Opened customer intent batch', dataset: 'Customer intent', member: 'Mira Poluru', time: 'Sep 22, 10:00', date: '2026-09-22' },
    { event: 'Published conversation guide', dataset: 'Conversation quality', member: 'Aarav Poluru', time: 'Sep 20, 14:30', date: '2026-09-20' },
  ]);
  readonly activityColumns = [
    { key: 'event', label: 'Event' },
    { key: 'dataset', label: 'Dataset' },
    { key: 'member', label: 'Member' },
    { key: 'time', label: 'Time' },
  ];
  readonly teamColumns = [
    { key: 'name', label: 'Member' },
    { key: 'role', label: 'Role' },
    { key: 'assigned', label: 'Assigned' },
    { key: 'approved', label: 'Approved' },
  ];
  readonly guidelines = [
    { heading: 'Choose one label', content: 'Every task takes a single class from the dataset taxonomy. If two labels feel close, pick the one the customer is asking for and explain the choice in the note.', open: true },
    { heading: 'Write a useful note', content: 'Notes should say why the label fits, not repeat the source. Flag a task when the source is incomplete, offensive, or outside the taxonomy.', open: false },
    { heading: 'Send finished work to review', content: 'Submitting moves the task to the review queue. Reviewers approve it or request changes with feedback the annotator can act on.', open: false },
  ];
  readonly taxonomy = [
    { id: 'text', label: 'Customer intent', children: [
      { id: 'order', label: 'Order & delivery' },
      { id: 'returns', label: 'Returns & refunds' },
      { id: 'account', label: 'Account access' },
      { id: 'other-text', label: 'Other' },
    ] },
    { id: 'image', label: 'Visual classification', children: [
      { id: 'circles', label: 'Circles' },
      { id: 'squares', label: 'Squares' },
      { id: 'mixed', label: 'Mixed shapes' },
      { id: 'other-image', label: 'Other' },
    ] },
    { id: 'dialogue', label: 'Conversation quality', children: [
      { id: 'resolved', label: 'Resolved' },
      { id: 'follow', label: 'Needs follow-up' },
      { id: 'escalated', label: 'Escalated' },
      { id: 'unclear', label: 'Unclear' },
    ] },
  ];
  readonly guideCopy: Record<string, string> = {
    order: 'The customer is asking about tracking, dispatch, or a delivery that does not match what they expected.',
    returns: 'The customer wants to send an item back, replace it, or receive a refund.',
    account: 'The customer needs help signing in, resetting access, or changing account details.',
    'other-text': 'The message does not fit the intent taxonomy. Say why in the note.',
    circles: 'Every distinct object in the frame is a circle.',
    squares: 'Every distinct object in the frame is a square or rectangle.',
    mixed: 'The frame contains more than one shape family.',
    'other-image': 'The image does not match the shape taxonomy.',
    resolved: 'The customer’s question is answered and they are not waiting on another team.',
    follow: 'The conversation is polite, but the customer is still waiting for an outcome.',
    escalated: 'The case needs a specialist, a refund decision, or a supervisor.',
    unclear: 'The transcript does not show whether the issue was solved.',
    text: 'Customer intent covers order, account, and refund messages.',
    image: 'Visual classification covers circles, squares, and mixed frames.',
    dialogue: 'Conversation quality covers resolution, follow-up, and escalation.',
  };

  readonly selected = computed(() => this.tasks().find((task) => task.id === this.selectedId()) ?? this.tasks()[0]);
  readonly currentDataset = computed(() => this.datasets.find((dataset) => dataset.kind === this.kind()) ?? this.datasets[0]);
  readonly kindTasks = computed(() => this.tasks().filter((task) => task.kind === this.kind()));
  readonly pending = computed(() => this.tasks().filter((task) => task.status === 'In review'));
  readonly approved = computed(() => this.tasks().filter((task) => task.status === 'Approved'));
  readonly labeled = computed(() => this.tasks().filter((task) => !!task.label));
  readonly changes = computed(() => this.tasks().filter((task) => task.status === 'Changes requested'));
  readonly editable = computed(() => ['Unlabeled', 'Changes requested'].includes(this.selected()?.status ?? ''));
  readonly coverage = computed(() => Math.round((this.labeled().length / Math.max(this.tasks().length, 1)) * 100));
  readonly passRate = computed(() => {
    const decided = this.approved().length + this.changes().length;
    return decided ? Math.round((this.approved().length / decided) * 100) : 0;
  });
  readonly labels = computed(() => this.labelsFor(this.kind()));
  readonly step = computed(() => {
    const task = this.selected();
    if (!task) return 0;
    if (task.status === 'Approved' || task.status === 'In review') return 3;
    if (!this.label()) return 0;
    if (!this.note().trim() && !this.flagged()) return 1;
    return 2;
  });
  readonly queueNav = computed(() => [
    { label: 'All tasks', active: this.taskFilter() === 'all' },
    { label: 'Unlabeled', active: this.taskFilter() === 'Unlabeled' },
    { label: 'In review', active: this.taskFilter() === 'In review' },
    { label: 'Approved', active: this.taskFilter() === 'Approved' },
    { label: 'Changes requested', active: this.taskFilter() === 'Changes requested' },
  ]);
  readonly filteredKindTasks = computed(() => {
    const query = this.taskSearch().trim().toLowerCase();
    return this.kindTasks().filter((task) => {
      const statusOk = this.taskFilter() === 'all' || task.status === this.taskFilter();
      const text = `${task.title} ${task.owner} ${task.label} ${task.id}`.toLowerCase();
      return statusOk && (!query || text.includes(query));
    });
  });
  readonly taskList = computed(() => this.filteredKindTasks().map((task) => ({
    label: `#${task.id} · ${task.title}`,
    description: `${task.status}${task.label ? ' · ' + task.label : ''}`,
    selected: task.id === this.selectedId(),
  })));
  readonly taskListIndex = computed(() => this.filteredKindTasks().findIndex((task) => task.id === this.selectedId()));
  readonly visibleDatasets = computed(() => this.datasets.filter((dataset) => {
    const kindOk = this.datasetKind() === 'all' || dataset.kind === this.datasetKind();
    return kindOk && `${dataset.name} ${dataset.owner}`.toLowerCase().includes(this.search().trim().toLowerCase());
  }));
  readonly visibleQueue = computed(() => this.tasks().filter((task) => task.status === (['In review', 'Approved', 'Changes requested'] as Status[])[this.queueTab()]));
  readonly pagedQueue = computed(() => this.visibleQueue().slice((this.reviewPage() - 1) * 3, this.reviewPage() * 3));
  readonly filteredActivity = computed(() => this.activity().filter((row) => (!this.rangeStart() || row.date >= this.rangeStart()) && (!this.rangeEnd() || row.date <= this.rangeEnd())));
  readonly activityRows = computed(() => this.filteredActivity().slice((this.activityPage() - 1) * 4, this.activityPage() * 4).map(({ event, dataset, member, time }) => ({ event, dataset, member, time })));
  readonly timeline = computed(() => this.filteredActivity().slice(0, 4).map((row, index) => ({
    title: row.event,
    description: `${row.dataset} · ${row.member}`,
    timestamp: row.time,
    status: index === 0 ? 'current' as const : 'complete' as const,
  })));
  readonly team = computed(() => this.owners.map((owner) => ({
    name: owner.value,
    role: owner.value === 'Riya Poluru' ? 'Reviewer' : 'Annotator',
    assigned: this.tasks().filter((task) => task.owner === owner.value).length,
    approved: this.tasks().filter((task) => task.owner === owner.value && task.status === 'Approved').length,
  })));
  readonly sortedTeam = computed(() => {
    const { key, direction } = this.teamSort();
    return [...this.team()].sort((a, b) => {
      const left = String(a[key as keyof typeof a]);
      const right = String(b[key as keyof typeof b]);
      const cmp = left.localeCompare(right, undefined, { numeric: true });
      return direction === 'asc' ? cmp : -cmp;
    }).map((member) => ({ name: member.name, role: member.role, assigned: member.assigned, approved: member.approved }));
  });
  readonly drawerDataset = computed(() => this.datasets.find((dataset) => dataset.id === this.drawerId()) ?? this.datasets[0]);
  readonly guideText = computed(() => this.guideCopy[this.guideSelection()] ?? 'Select a label to read how the team uses it.');
  readonly schemaPreview = computed(() => JSON.stringify({
    dataset: this.currentDataset().id,
    labels: this.labels().map((item) => item.value),
    record: { content: 'string', label: 'string', note: 'string', confidence: '0-100', rating: '0-5' },
  }, null, 2));
  readonly taskMeta = computed(() => {
    const task = this.selected();
    if (!task) return [];
    return [
      { term: 'Dataset', description: this.datasetName(task.dataset) },
      { term: 'Owner', description: task.owner },
      { term: 'Batch', description: task.batch },
      { term: 'Status', description: task.status },
    ];
  });

  @HostListener('window:keydown', ['$event'])
  onKey(event: KeyboardEvent): void {
    if (this.modal() || this.drawerOpen() || this.page() !== 1) return;
    const target = event.target as HTMLElement | null;
    if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
    if (event.key.toLowerCase() === 'n' && !event.metaKey && !event.ctrlKey) {
      event.preventDefault();
      this.nextTask();
    }
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      this.submit();
    }
  }

  navigate(page: number): void {
    this.page.set(page);
    this.error.set('');
  }

  labelsFor(kind: Kind) {
    const values = kind === 'text'
      ? ['Order & delivery', 'Returns & refunds', 'Account access', 'Other']
      : kind === 'image'
        ? ['Circles', 'Squares', 'Mixed shapes', 'Other']
        : ['Resolved', 'Needs follow-up', 'Escalated', 'Unclear'];
    return values.map((value) => ({ label: value, value }));
  }

  stats(dataset: string) {
    const tasks = this.tasks().filter((task) => task.dataset === dataset);
    const labeled = tasks.filter((task) => !!task.label).length;
    return { total: tasks.length, labeled, approved: tasks.filter((task) => task.status === 'Approved').length, coverage: tasks.length ? Math.round((labeled / tasks.length) * 100) : 0 };
  }

  datasetName(id: string): string {
    return this.datasets.find((dataset) => dataset.id === id)?.name || id;
  }

  drawerMeta(id: string) {
    const stats = this.stats(id);
    return [
      { term: 'Tasks', description: String(stats.total) },
      { term: 'Labeled', description: String(stats.labeled) },
      { term: 'Approved', description: String(stats.approved) },
    ];
  }

  kindLabel(kind: Kind): string {
    return kind === 'text' ? 'Text' : kind === 'image' ? 'Images' : 'Conversations';
  }

  tone(status: Status): Tone {
    if (status === 'Approved') return 'success';
    if (status === 'In review') return 'warning';
    if (status === 'Changes requested') return 'danger';
    return 'neutral';
  }

  mediaSrc(content: string): string {
    return content;
  }

  turns(content: string): { role: string; text: string }[] {
    return content.split('\n').filter(Boolean).map((line) => {
      const index = line.indexOf(':');
      return index === -1 ? { role: 'Note', text: line } : { role: line.slice(0, index).trim(), text: line.slice(index + 1).trim() };
    });
  }

  ratingLabel(): string {
    if (this.kind() === 'image') return 'Image clarity';
    if (this.kind() === 'conversation') return 'Reply quality';
    return 'Example clarity';
  }

  choose(task: Task): void {
    this.kind.set(task.kind);
    this.selectedId.set(task.id);
    const preferred = this.labelsFor(task.kind).some((item) => item.value === this.preferredLabel()) ? this.preferredLabel() : '';
    this.label.set(task.label || preferred);
    this.note.set(task.note);
    this.flagged.set(task.flagged);
    this.confidence.set(task.confidence);
    this.rating.set(task.rating);
    this.senior.set(task.senior);
    this.error.set('');
  }

  setNewKind(value: string): void {
    if (value === 'text' || value === 'image' || value === 'conversation') this.newKind.set(value);
  }

  changeKind(value: string): void {
    const task = this.tasks().find((item) => item.kind === value && ['Unlabeled', 'Changes requested'].includes(item.status))
      || this.tasks().find((item) => item.kind === value);
    if (task) this.choose(task);
  }

  onQueueNav(item: { label: string }): void {
    this.taskFilter.set(item.label === 'All tasks' ? 'all' : item.label as Status);
    const visible = this.filteredKindTasks();
    if (visible.length && !visible.some((task) => task.id === this.selectedId())) this.choose(visible[0]);
  }

  onTaskList(event: { index: number }): void {
    const task = this.filteredKindTasks()[event.index];
    if (task) this.choose(task);
  }

  nextTask(): void {
    const tasks = this.filteredKindTasks().length ? this.filteredKindTasks() : this.kindTasks();
    if (!tasks.length) return;
    const index = tasks.findIndex((task) => task.id === this.selectedId());
    this.choose(tasks[(index + 1) % tasks.length]);
  }

  log(event: string, dataset: string): void {
    this.activity.update((rows) => [{ event, dataset: this.datasetName(dataset), member: 'Riya Poluru', time: 'Just now', date: '2026-09-27' }, ...rows]);
  }

  notify(title: string, description = ''): void {
    this.notice.set(description || title);
    this.toastTitle.set(title);
    this.toastBody.set(description);
    this.toastOpen.set(false);
    setTimeout(() => this.toastOpen.set(true));
  }

  submit(): void {
    const task = this.selected();
    if (!task || !this.editable()) return;
    if (!this.labels().some((item) => item.value === this.label())) {
      this.error.set('Select a label before submitting this task.');
      return;
    }
    this.tasks.update((rows) => rows.map((item) => item.id === task.id ? {
      ...item,
      label: this.label(),
      note: this.note().trim(),
      flagged: this.flagged(),
      confidence: this.confidence(),
      rating: this.rating(),
      senior: this.senior(),
      status: 'In review' as Status,
      feedback: '',
    } : item));
    this.log(`Submitted task #${task.id}`, task.dataset);
    this.error.set('');
    this.notify('Sent to review', `Task #${task.id} is in the team review queue.`);
  }

  openReview(task: Task): void {
    this.reviewTask.set(task);
    this.feedback.set('');
    this.error.set('');
    this.modal.set('review');
  }

  decide(status: 'Approved' | 'Changes requested'): void {
    const task = this.reviewTask();
    if (!task || this.tasks().find((item) => item.id === task.id)?.status !== 'In review') return;
    if (status === 'Changes requested' && !this.feedback().trim()) {
      this.error.set('Add feedback so the annotator knows what to change.');
      return;
    }
    this.tasks.update((rows) => rows.map((item) => item.id === task.id ? { ...item, status, feedback: this.feedback().trim() } : item));
    this.log(`${status} on task #${task.id}`, task.dataset);
    this.modal.set(null);
    this.notify(status === 'Approved' ? 'Label approved' : 'Changes requested', `Task #${task.id} is now ${status.toLowerCase()}.`);
  }

  openCreate(): void {
    this.newTitle.set('');
    this.newContent.set('');
    this.imageContent.set('');
    this.newKind.set(this.kind());
    this.newOwner.set('Riya Poluru');
    this.newBatch.set('');
    this.error.set('');
    this.modal.set('create');
  }

  onFiles(detail: { files: File[] }): void {
    const file = detail.files[0];
    this.imageContent.set('');
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      this.error.set('Choose a PNG, JPEG, WebP, or SVG image smaller than 5 MB.');
      return;
    }
    this.error.set('');
    this.imageLoading.set(true);
    const reader = new FileReader();
    reader.onload = () => {
      this.imageContent.set(String(reader.result));
      this.imageLoading.set(false);
    };
    reader.onerror = () => {
      this.error.set('The image could not be read. Try another file.');
      this.imageLoading.set(false);
    };
    reader.readAsDataURL(file);
  }

  create(): void {
    const content = this.newKind() === 'image' ? this.imageContent() : this.newContent().trim();
    if (!this.newTitle().trim() || !content || this.imageLoading()) {
      this.error.set('Add a task title and its text, conversation, or image.');
      return;
    }
    const dataset = this.datasets.find((item) => item.kind === this.newKind())!;
    const id = Math.max(...this.tasks().map((task) => task.id)) + 1;
    const task: Task = {
      id,
      dataset: dataset.id,
      kind: this.newKind(),
      title: this.newTitle().trim(),
      content,
      owner: this.newOwner() || 'Riya Poluru',
      status: 'Unlabeled',
      label: '',
      note: '',
      flagged: false,
      feedback: '',
      confidence: 50,
      rating: 0,
      batch: this.newBatch().trim() || `B${id}`,
      senior: false,
    };
    this.tasks.update((rows) => [...rows, task]);
    this.choose(task);
    this.log(`Created task #${task.id}`, dataset.id);
    this.modal.set(null);
    this.navigate(1);
    this.notify('Task created', 'Your new task is ready to annotate.');
  }

  exportDataset(format: 'json' | 'jsonl' = 'json'): void {
    const records = this.approved().map(({ id, dataset, kind, content, label, note, confidence, rating }) => ({ id, dataset, kind, content, label, note, confidence, rating }));
    const body = format === 'json' ? JSON.stringify({ version: 1, records }, null, 2) : records.map((record) => JSON.stringify(record)).join('\n');
    const url = URL.createObjectURL(new Blob([body], { type: format === 'json' ? 'application/json' : 'application/x-ndjson' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = format === 'json' ? 'approved-labels.json' : 'approved-labels.jsonl';
    anchor.click();
    URL.revokeObjectURL(url);
    this.notify('Export ready', `Downloaded ${records.length} approved records. Sample image paths refer to assets in this project.`);
  }

  exportFromMenu(item: { value: string }): void {
    this.exportDataset(item.value === 'jsonl' ? 'jsonl' : 'json');
  }

  openDataset(id: string): void {
    this.drawerId.set(id);
    this.drawerOpen.set(true);
  }

  openInWorkbench(id: string): void {
    const dataset = this.datasets.find((item) => item.id === id);
    if (!dataset) return;
    this.changeKind(dataset.kind);
    this.drawerOpen.set(false);
    this.navigate(1);
  }

  onRange(range: { start: string; end: string }): void {
    this.rangeStart.set(range.start);
    this.rangeEnd.set(range.end);
    this.activityPage.set(1);
  }

  onGuideSelect(id: string): void {
    this.guideSelection.set(id);
  }

  onGuideToggle(event: { id: string; expanded: boolean }): void {
    this.expandedIds.update((ids) => ({ ...ids, [event.id]: event.expanded }));
  }

  saveSettings(): void {
    if (this.dailyTarget() < 1 || this.dailyTarget() > 200) {
      this.error.set('Set a daily target between 1 and 200 tasks.');
      return;
    }
    if (!this.reviewStart()) {
      this.error.set('Choose when the review window starts.');
      return;
    }
    if (!this.sprintEnd()) {
      this.error.set('Choose the sprint end date.');
      return;
    }
    this.error.set('');
    this.notify('Settings saved', 'Daily target, review hours, and label preference apply to this session.');
  }

  onProfile(item: { value: string }): void {
    const pages: Record<string, number> = { review: 3, team: 5, settings: 7 };
    this.navigate(pages[item.value] ?? 0);
    this.menuOpen.set(false);
  }

  setQueueTab(index: number): void {
    this.queueTab.set(index);
    this.reviewPage.set(1);
  }
}
