import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { EdsAlertComponent, EdsAvatarComponent, EdsBadgeComponent, EdsButtonComponent, EdsCardComponent, EdsCheckboxComponent, EdsDataTableComponent, EdsIconComponent, EdsInputComponent, EdsModalComponent, EdsProgressBarComponent, EdsSegmentedControlComponent, EdsSelectComponent, EdsTabsComponent, EdsTextareaComponent } from '@poluru-labs/enterprise-design-system-angular';
type Kind = 'text' | 'image' | 'conversation';
type Status = 'Unlabeled' | 'In review' | 'Approved' | 'Changes requested';
interface Task { id: number; dataset: string; kind: Kind; title: string; content: string; owner: string; status: Status; label: string; note: string; flagged: boolean; feedback: string; }
@Component({ selector: 'app-root', imports: [DecimalPipe, EdsAlertComponent, EdsAvatarComponent, EdsBadgeComponent, EdsButtonComponent, EdsCardComponent, EdsCheckboxComponent, EdsDataTableComponent, EdsIconComponent, EdsInputComponent, EdsModalComponent, EdsProgressBarComponent, EdsSegmentedControlComponent, EdsSelectComponent, EdsTabsComponent, EdsTextareaComponent], templateUrl: './app.html', styleUrl: './app.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class App {
  readonly page = signal(0);
  readonly kind = signal<Kind>('text');
  readonly selectedId = signal(101);
  readonly label = signal('');
  readonly note = signal('');
  readonly flagged = signal(false);
  readonly notice = signal('');
  readonly error = signal('');
  readonly search = signal('');
  readonly queueTab = signal(0);
  readonly modal = signal<'create' | 'review' | null>(null);
  readonly reviewTask = signal<Task | null>(null);
  readonly feedback = signal('');
  readonly newTitle = signal('');
  readonly newContent = signal('');
  readonly newKind = signal<Kind>('text');
  readonly imageContent = signal('');
  readonly imageLoading = signal(false);
  readonly nav = [{ label: 'Overview' }, { label: 'Workbench' }, { label: 'Datasets' }, { label: 'Review queue' }, { label: 'Team' }, { label: 'Activity' }];
  readonly kinds = [{ label: 'Text', value: 'text' }, { label: 'Images', value: 'image' }, { label: 'Conversations', value: 'conversation' }];
  readonly queueTabs = [{ label: 'Awaiting review' }, { label: 'Approved' }, { label: 'Changes requested' }];
  readonly datasets = [
    { id: 'support', name: 'Customer intent', kind: 'text' as Kind, owner: 'Mira Poluru', description: 'Turn everyday customer messages into clear, useful intent labels.', color: 'blue', icon: 'file' as const },
    { id: 'visual', name: 'Visual classification', kind: 'image' as Kind, owner: 'Kiran Poluru', description: 'Classify visual content with a consistent shared taxonomy.', color: 'purple', icon: 'eye' as const },
    { id: 'dialogue', name: 'Conversation quality', kind: 'conversation' as Kind, owner: 'Aarav Poluru', description: 'Evaluate support conversations for resolution and helpfulness.', color: 'orange', icon: 'mail' as const }
  ];
  readonly tasks = signal<Task[]>([
    { id: 101, dataset: 'support', kind: 'text', title: 'A little help with an order', content: 'Hi there! I placed an order last Thursday and the tracking page still says “processing.” Could you check when it will be dispatched? It’s a birthday gift, so I’d love to know if it can arrive by Friday. Thank you!', owner: 'Mira Poluru', status: 'Unlabeled', label: '', note: '', flagged: false, feedback: '' },
    { id: 102, dataset: 'support', kind: 'text', title: 'Updating account details', content: 'I have a new email address and would like to update the one on my account. Where can I make this change?', owner: 'Nila Poluru', status: 'Unlabeled', label: '', note: '', flagged: false, feedback: '' },
    { id: 103, dataset: 'support', kind: 'text', title: 'Requesting a refund', content: 'The item arrived damaged. I would like to return it and receive a refund.', owner: 'Tara Poluru', status: 'In review', label: 'Returns & refunds', note: 'The customer explicitly asks to return a damaged item.', flagged: false, feedback: '' },
    { id: 104, dataset: 'support', kind: 'text', title: 'Delivery confirmation', content: 'My tracking says delivered, but the parcel is not here. Can you help me locate it?', owner: 'Dev Poluru', status: 'Approved', label: 'Order & delivery', note: '', flagged: false, feedback: '' },
    { id: 201, dataset: 'visual', kind: 'image', title: 'Classify the visible shapes', content: 'sample-shapes.svg', owner: 'Kiran Poluru', status: 'Unlabeled', label: '', note: '', flagged: false, feedback: '' },
    { id: 202, dataset: 'visual', kind: 'image', title: 'Check the circle collection', content: 'sample-circles.svg', owner: 'Kiran Poluru', status: 'In review', label: 'Circles', note: 'All visible objects are circular.', flagged: false, feedback: '' },
    { id: 301, dataset: 'dialogue', kind: 'conversation', title: 'A password reset conversation', content: 'Customer: I cannot sign in to my account.\nAgent: I can help. Have you tried the password reset link?\nCustomer: Yes, I just reset it and can sign in now.\nAgent: Glad that worked. Is there anything else I can help with?\nCustomer: No, that’s everything. Thank you!', owner: 'Aarav Poluru', status: 'Unlabeled', label: '', note: '', flagged: false, feedback: '' },
    { id: 302, dataset: 'dialogue', kind: 'conversation', title: 'A billing question', content: 'Customer: I was charged twice for the same order.\nAgent: I will forward this to the billing team.\nCustomer: When should I expect an update?\nAgent: They will follow up by email.', owner: 'Aarav Poluru', status: 'Changes requested', label: 'Resolved', note: '', flagged: true, feedback: 'The customer is still waiting for a billing resolution. Revisit the label.' }
  ]);
  readonly selected = computed(() => this.tasks().find(t => t.id === this.selectedId())!);
  readonly currentDataset = computed(() => this.datasets.find(d => d.kind === this.kind())!);
  readonly kindTasks = computed(() => this.tasks().filter(t => t.kind === this.kind()));
  readonly pending = computed(() => this.tasks().filter(t => t.status === 'In review'));
  readonly approved = computed(() => this.tasks().filter(t => t.status === 'Approved'));
  readonly labeled = computed(() => this.tasks().filter(t => !!t.label));
  readonly editable = computed(() => ['Unlabeled', 'Changes requested'].includes(this.selected().status));
  readonly visibleDatasets = computed(() => this.datasets.filter(d => `${d.name} ${d.owner}`.toLowerCase().includes(this.search().toLowerCase())));
  readonly visibleQueue = computed(() => this.tasks().filter(t => t.status === ['In review', 'Approved', 'Changes requested'][this.queueTab()]));
  readonly labels = computed(() => (this.kind() === 'text' ? ['Order & delivery', 'Returns & refunds', 'Account access', 'Other'] : this.kind() === 'image' ? ['Circles', 'Squares', 'Mixed shapes', 'Other'] : ['Resolved', 'Needs follow-up', 'Escalated', 'Unclear']).map(value => ({ label: value, value })));
  readonly activity = signal<Record<string, string | number>[]>([{ event: 'Approved task #104', dataset: 'Customer intent', member: 'Riya Poluru', time: 'Today, 09:20' }, { event: 'Requested changes on #302', dataset: 'Conversation quality', member: 'Riya Poluru', time: 'Today, 09:05' }]);
  readonly activityColumns = [{ key: 'event', label: 'Event' }, { key: 'dataset', label: 'Dataset' }, { key: 'member', label: 'Member' }, { key: 'time', label: 'Time' }];
  readonly teamColumns = [{ key: 'name', label: 'Member' }, { key: 'role', label: 'Role' }, { key: 'assigned', label: 'Assigned tasks' }, { key: 'approved', label: 'Approved' }];
  readonly team = computed(() => ['Mira Poluru', 'Kiran Poluru', 'Aarav Poluru', 'Nila Poluru', 'Tara Poluru', 'Dev Poluru', 'Riya Poluru'].map(name => ({ name, role: name === 'Riya Poluru' ? 'Reviewer' : 'Annotator', assigned: this.tasks().filter(t => t.owner === name).length, approved: this.tasks().filter(t => t.owner === name && t.status === 'Approved').length })));
  navigate(page: number) { this.page.set(page); this.error.set(''); }
  stats(dataset: string) { const tasks = this.tasks().filter(t => t.dataset === dataset); return { total: tasks.length, labeled: tasks.filter(t => !!t.label).length, approved: tasks.filter(t => t.status === 'Approved').length }; }
  datasetName(id: string) { return this.datasets.find(d => d.id === id)?.name || id; }
  choose(task: Task) { this.kind.set(task.kind); this.selectedId.set(task.id); this.label.set(task.label); this.note.set(task.note); this.flagged.set(task.flagged); this.error.set(''); }
  changeKind(value: string) { const task = this.tasks().find(t => t.kind === value && ['Unlabeled', 'Changes requested'].includes(t.status)) || this.tasks().find(t => t.kind === value); if (task) this.choose(task); }
  nextTask() { const tasks = this.kindTasks(); const index = tasks.findIndex(t => t.id === this.selectedId()); this.choose(tasks[(index + 1) % tasks.length]); }
  log(event: string, dataset: string) { this.activity.update(rows => [{ event, dataset: this.datasetName(dataset), member: 'Riya Poluru', time: 'Just now' }, ...rows]); }
  submit() {
    if (!this.editable()) return;
    if (!this.labels().some(l => l.value === this.label())) { this.error.set('Select a label before submitting this task.'); return; }
    const task = this.selected();
    this.tasks.update(rows => rows.map(t => t.id === task.id ? { ...t, label: this.label(), note: this.note().trim(), flagged: this.flagged(), status: 'In review', feedback: '' } : t));
    this.log(`Submitted task #${task.id}`, task.dataset); this.notice.set(`Task #${task.id} submitted to the team review queue.`); this.error.set('');
  }
  openReview(task: Task) { this.reviewTask.set(task); this.feedback.set(''); this.error.set(''); this.modal.set('review'); }
  decide(status: 'Approved' | 'Changes requested') {
    const task = this.reviewTask(); if (!task || this.tasks().find(t => t.id === task.id)?.status !== 'In review') return;
    if (status === 'Changes requested' && !this.feedback().trim()) { this.error.set('Add feedback so the annotator knows what to change.'); return; }
    this.tasks.update(rows => rows.map(t => t.id === task.id ? { ...t, status, feedback: this.feedback().trim() } : t));
    this.log(`${status} on task #${task.id}`, task.dataset); this.notice.set(`Task #${task.id}: ${status.toLowerCase()}.`); this.modal.set(null);
  }
  openCreate() { this.newTitle.set(''); this.newContent.set(''); this.imageContent.set(''); this.newKind.set('text'); this.error.set(''); this.modal.set('create'); }
  async upload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0]; this.imageContent.set('');
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) { this.error.set('Choose a PNG, JPEG, or WebP image smaller than 5 MB.'); return; }
    this.error.set(''); this.imageLoading.set(true);
    try {
      const data = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error('read')); reader.readAsDataURL(file); });
      this.imageContent.set(data);
    } catch { this.error.set('The image could not be read. Try another file.'); } finally { this.imageLoading.set(false); }
  }
  create() {
    const content = this.newKind() === 'image' ? this.imageContent() : this.newContent().trim();
    if (!this.newTitle().trim() || !content || this.imageLoading()) { this.error.set('Add a task title and its text, conversation, or image.'); return; }
    const dataset = this.datasets.find(d => d.kind === this.newKind())!;
    const task: Task = { id: Math.max(...this.tasks().map(t => t.id)) + 1, dataset: dataset.id, kind: this.newKind(), title: this.newTitle().trim(), content, owner: 'Riya Poluru', status: 'Unlabeled', label: '', note: '', flagged: false, feedback: '' };
    this.tasks.update(rows => [...rows, task]); this.choose(task); this.log(`Created task #${task.id}`, dataset.id); this.modal.set(null); this.navigate(1); this.notice.set('Your new task is ready to annotate.');
  }
  exportDataset() {
    const records = this.approved().map(({ id, dataset, kind, content, label, note }) => ({ id, dataset, kind, content, label, note }));
    const url = URL.createObjectURL(new Blob([JSON.stringify({ version: 1, records }, null, 2)], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = 'approved-labels.json'; a.click(); URL.revokeObjectURL(url); this.notice.set(`Exported ${records.length} approved records. Sample image paths refer to assets in this project.`);
  }
}
