import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  EdsAccordionComponent,
  EdsAlertComponent,
  EdsAvatarComponent,
  EdsBadgeComponent,
  EdsBreadcrumbComponent,
  EdsButtonComponent,
  EdsCardComponent,
  EdsCheckboxComponent,
  EdsCircularProgressComponent,
  EdsCodeSnippetComponent,
  EdsDataTableComponent,
  EdsDatePickerComponent,
  EdsDateRangePickerComponent,
  EdsDescriptionListComponent,
  EdsDividerComponent,
  EdsDropdownMenuComponent,
  EdsFileUploadComponent,
  EdsIconComponent,
  EdsInputComponent,
  EdsKbdComponent,
  EdsLinkComponent,
  EdsMenuItemComponent,
  EdsMeterComponent,
  EdsModalComponent,
  EdsNumberInputComponent,
  EdsPaginationComponent,
  EdsPopoverComponent,
  EdsProgressBarComponent,
  EdsRadioComponent,
  EdsRadioGroupComponent,
  EdsSearchComponent,
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
  EdsTooltipComponent,
  EdsVisuallyHiddenComponent,
} from '@poluru-labs/enterprise-design-system-angular';

type StepKind = 'LLM' | 'Branch' | 'Retry' | 'Human' | 'Tool';
type FlowStatus = 'Draft' | 'Published';
type RunStatus = 'Running' | 'Succeeded' | 'Failed' | 'Waiting';
type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

interface FlowStep {
  id: string;
  kind: StepKind;
  label: string;
  config: string;
  retries: number;
  branchLabel?: string;
}

interface Workflow {
  id: string;
  name: string;
  status: FlowStatus;
  owner: string;
  updated: string;
  steps: FlowStep[];
  runs: number;
}

interface FlowRun {
  id: string;
  workflowId: string;
  status: RunStatus;
  started: string;
  durationSec: number;
  trigger: string;
}

interface HumanTask {
  id: string;
  workflowId: string;
  stepLabel: string;
  assignee: string;
  summary: string;
  waitingSince: string;
}

const PALETTE: { kind: StepKind; label: string; hint: string }[] = [
  { kind: 'LLM', label: 'LLM call', hint: 'Prompt + model' },
  { kind: 'Branch', label: 'Branch', hint: 'If / else routes' },
  { kind: 'Retry', label: 'Retry block', hint: 'Wrap fragile steps' },
  { kind: 'Human', label: 'Human review', hint: 'Pause for approval' },
  { kind: 'Tool', label: 'Tool call', hint: 'HTTP or function' },
];

@Component({
  selector: 'app-root',
  imports: [
    EdsAccordionComponent,
    EdsAlertComponent,
    EdsAvatarComponent,
    EdsBadgeComponent,
    EdsBreadcrumbComponent,
    EdsButtonComponent,
    EdsCardComponent,
    EdsCheckboxComponent,
    EdsCircularProgressComponent,
    EdsCodeSnippetComponent,
    EdsDataTableComponent,
    EdsDatePickerComponent,
    EdsDateRangePickerComponent,
    EdsDescriptionListComponent,
    EdsDividerComponent,
    EdsDropdownMenuComponent,
    EdsFileUploadComponent,
    EdsIconComponent,
    EdsInputComponent,
    EdsKbdComponent,
    EdsLinkComponent,
    EdsMenuItemComponent,
    EdsMeterComponent,
    EdsModalComponent,
    EdsNumberInputComponent,
    EdsPaginationComponent,
    EdsPopoverComponent,
    EdsProgressBarComponent,
    EdsRadioComponent,
    EdsRadioGroupComponent,
    EdsSearchComponent,
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
    EdsTooltipComponent,
    EdsVisuallyHiddenComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly Math = Math;
  readonly palette = PALETTE;
  readonly nav = [
    { label: 'Overview' },
    { label: 'Workflows' },
    { label: 'Builder' },
    { label: 'Runs' },
    { label: 'Human queue' },
    { label: 'Branches' },
    { label: 'Integrations' },
    { label: 'Team' },
    { label: 'Settings' },
  ];
  readonly pages = this.nav.map((n) => n.label);
  readonly headings = [
    { eyebrow: 'ORCHESTRATION', title: 'AI Workflow Orchestration UI', summary: 'Drag-and-drop builder for multi-step LLM pipelines with branching, retries, and human-in-the-loop steps.' },
    { eyebrow: 'LIBRARY', title: 'Workflows', summary: 'Named pipelines owned by your team.' },
    { eyebrow: 'DESIGN', title: 'Builder', summary: 'Compose steps on the canvas and configure retries and branches.' },
    { eyebrow: 'EXECUTION', title: 'Runs', summary: 'Live and historical executions with status and duration.' },
    { eyebrow: 'HITL', title: 'Human queue', summary: 'Tasks waiting for reviewer action.' },
    { eyebrow: 'LOGIC', title: 'Branches', summary: 'Conditional paths and merge points across workflows.' },
    { eyebrow: 'CONNECT', title: 'Integrations', summary: 'Triggers and outbound webhooks.' },
    { eyebrow: 'PEOPLE', title: 'Team', summary: 'Workflow owners and on-call reviewers.' },
    { eyebrow: 'WORKSPACE', title: 'Settings', summary: 'Defaults, timeouts, and export.' },
  ];
  readonly team = [
    { name: 'Pranav Poluru', role: 'Workflow architect' },
    { name: 'Quinn Poluru', role: 'Automation engineer' },
    { name: 'Riya Poluru', role: 'Reviewer lead' },
    { name: 'Sameer Poluru', role: 'Integrations' },
    { name: 'Tara Poluru', role: 'SRE' },
  ];
  readonly helpAccordion = [
    { heading: 'Retry blocks', content: 'Wrap one or more steps. Failed attempts retry with backoff before the run fails.', open: true },
    { heading: 'Human steps', content: 'Runs pause until an assignee approves or edits output in the Human queue.', open: false },
    { heading: 'Publishing', content: 'Draft workflows are editable. Published versions are immutable; edits create a new draft.', open: false },
  ];
  readonly runColumns = [
    { key: 'id', label: 'Run' },
    { key: 'workflow', label: 'Workflow' },
    { key: 'status', label: 'Status' },
    { key: 'trigger', label: 'Trigger' },
    { key: 'durationSec', label: 'Duration (s)' },
  ];
  readonly teamColumns = [
    { key: 'name', label: 'Member' },
    { key: 'role', label: 'Role' },
    { key: 'workflows', label: 'Workflows' },
    { key: 'reviews', label: 'Reviews' },
    { key: 'runs', label: 'Runs monitored' },
  ];

  readonly workflows = signal<Workflow[]>([
    {
      id: 'wf-support',
      name: 'Support triage pipeline',
      status: 'Published',
      owner: 'Pranav Poluru',
      updated: 'Sep 28',
      runs: 1240,
      steps: [
        { id: 's1', kind: 'LLM', label: 'Classify ticket', config: 'model: assist-v3', retries: 0 },
        { id: 's2', kind: 'Branch', label: 'Route by severity', config: 'if score > 0.8 → escalate', retries: 0, branchLabel: 'high / low' },
        { id: 's3', kind: 'Human', label: 'Agent approval', config: 'assignee: queue/support', retries: 0 },
        { id: 's4', kind: 'Tool', label: 'Create Jira', config: 'POST /integrations/jira', retries: 2 },
      ],
    },
    {
      id: 'wf-contract',
      name: 'Contract summarization',
      status: 'Draft',
      owner: 'Quinn Poluru',
      updated: 'Sep 27',
      runs: 0,
      steps: [
        { id: 's1', kind: 'LLM', label: 'Extract clauses', config: 'model: assist-v3 · temp 0.2', retries: 1 },
        { id: 's2', kind: 'Retry', label: 'Retry LLM on timeout', config: 'max: 3 · backoff: exp', retries: 3 },
        { id: 's3', kind: 'Human', label: 'Legal review', config: 'assignee: Riya Poluru', retries: 0 },
      ],
    },
  ]);

  readonly runs = signal<FlowRun[]>([
    { id: 'run-9012', workflowId: 'wf-support', status: 'Waiting', started: 'Sep 28, 10:02', durationSec: 45, trigger: 'Webhook' },
    { id: 'run-9010', workflowId: 'wf-support', status: 'Succeeded', started: 'Sep 28, 09:48', durationSec: 32, trigger: 'Schedule' },
    { id: 'run-9008', workflowId: 'wf-support', status: 'Failed', started: 'Sep 28, 09:12', durationSec: 18, trigger: 'API' },
  ]);

  readonly humanTasks = signal<HumanTask[]>([
    { id: 'h-44', workflowId: 'wf-support', stepLabel: 'Agent approval', assignee: 'Riya Poluru', summary: 'Escalated billing dispute — confirm reply', waitingSince: '12 min ago' },
    { id: 'h-43', workflowId: 'wf-contract', stepLabel: 'Legal review', assignee: 'Riya Poluru', summary: 'NDA summary for Acme Robotics', waitingSince: 'Sep 27' },
  ]);

  readonly log = signal([
    { title: 'Published support triage', description: 'Pranav Poluru · v4', timestamp: 'Sep 28, 08:00' },
    { title: 'Run run-9008 failed', description: 'Jira tool 503 · auto retry exhausted', timestamp: 'Sep 28, 09:12' },
  ]);

  readonly page = signal(0);
  readonly selectedWorkflowId = signal('wf-support');
  readonly selectedStepId = signal('s1');
  readonly workflowSearch = signal('');
  readonly runFilter = signal('all');
  readonly runPage = signal(1);
  readonly rangeStart = signal('2026-09-01');
  readonly rangeEnd = signal('2026-09-28');
  readonly settingsTab = signal(0);
  readonly settingsTabs = [{ label: 'Execution' }, { label: 'Export' }];
  readonly defaultTimeout = signal(120);
  readonly notifyEmail = signal('flows@poluru.example');
  readonly dragKind = signal<StepKind | null>(null);
  readonly modal = signal<'publish' | null>(null);
  readonly search = signal('');
  readonly menuOpen = signal(false);
  readonly helpOpen = signal(false);
  readonly showIntro = signal(true);
  readonly teamSort = signal<{ key: string; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });
  readonly notice = signal('');
  readonly error = signal('');
  readonly toastOpen = signal(false);
  readonly toastTitle = signal('');
  readonly toastBody = signal('');

  readonly breadcrumbs = computed(() => [{ label: 'Poluru Labs' }, { label: this.pages[this.page()] }]);
  readonly workflowOptions = computed(() => this.workflows().map((w) => ({ label: w.name, value: w.id })));

  readonly publishedCount = computed(() => this.workflows().filter((w) => w.status === 'Published').length);
  readonly waitingHumans = computed(() => this.humanTasks().length);
  readonly activeRuns = computed(() => this.runs().filter((r) => r.status === 'Running' || r.status === 'Waiting').length);

  readonly selectedWorkflow = computed(() => this.workflows().find((w) => w.id === this.selectedWorkflowId()) ?? this.workflows()[0]);
  readonly selectedStep = computed(() => this.selectedWorkflow().steps.find((s) => s.id === this.selectedStepId()) ?? this.selectedWorkflow().steps[0]);
  readonly filteredWorkflows = computed(() => {
    const q = this.workflowSearch().trim().toLowerCase();
    return this.workflows().filter((w) => !q || `${w.name} ${w.owner}`.toLowerCase().includes(q));
  });
  readonly sideNavItems = computed(() =>
    this.filteredWorkflows().map((w) => ({ label: w.name, description: w.status, active: w.id === this.selectedWorkflowId() })),
  );
  readonly stepMeta = computed(() => {
    const s = this.selectedStep();
    return [
      { term: 'Type', description: s.kind },
      { term: 'Config', description: s.config },
      { term: 'Retries', description: String(s.retries) },
      { term: 'Branch', description: s.branchLabel ?? '—' },
    ];
  });
  readonly flowYaml = computed(() => {
    const w = this.selectedWorkflow();
    return ['workflow:', `  id: ${w.id}`, `  name: ${w.name}`, '  steps:', ...w.steps.map((s, i) => `    - ${i + 1}. ${s.kind}: ${s.label}`)].join('\n');
  });
  readonly branchSteps = computed(() => this.workflows().flatMap((w) => w.steps.filter((s) => s.kind === 'Branch').map((s) => ({ ...s, workflow: w.name }))));
  readonly runRows = computed(() =>
    this.runs()
      .filter((r) => this.runFilter() === 'all' || r.status === this.runFilter())
      .map((r) => ({ ...r, workflow: this.workflowName(r.workflowId) })),
  );
  readonly weeklyRuns = [80, 95, 88, 110, 102, 120, 115];
  readonly weeklyMax = computed(() => Math.max(...this.weeklyRuns, 1));
  readonly recentLog = computed(() => this.log().map((i) => ({ ...i, status: 'complete' as const })));
  readonly builderStepper = computed(() => this.selectedWorkflow().steps.map((s) => ({ label: s.label })));

  readonly teamRows = computed(() => {
    const { key, direction } = this.teamSort();
    return this.team
      .map((member) => ({
        ...member,
        workflows: this.workflows().filter((w) => w.owner === member.name).length,
        reviews: this.humanTasks().filter((h) => h.assignee === member.name).length,
        runs: member.name === 'Tara Poluru' ? 340 : 120,
      }))
      .sort((a, b) => {
        const av = a[key as keyof typeof a];
        const bv = b[key as keyof typeof b];
        const cmp = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv));
        return direction === 'asc' ? cmp : -cmp;
      });
  });

  workflowName(id: string): string {
    return this.workflows().find((w) => w.id === id)?.name ?? id;
  }

  stepClass(kind: StepKind): string {
    if (kind === 'Branch') return 'branch';
    if (kind === 'Human') return 'human';
    if (kind === 'Retry') return 'retry';
    return '';
  }

  tone(status: string): Tone {
    const map: Record<string, Tone> = {
      Published: 'success',
      Draft: 'neutral',
      Succeeded: 'success',
      Running: 'info',
      Waiting: 'warning',
      Failed: 'danger',
    };
    return map[status] ?? 'brand';
  }

  statusVariant(status: string): 'success' | 'warning' | 'danger' | 'info' | 'neutral' {
    const map: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
      Succeeded: 'success',
      Running: 'info',
      Waiting: 'warning',
      Failed: 'danger',
    };
    return map[status] ?? 'neutral';
  }

  navigate(page: number): void {
    this.page.set(page);
    this.error.set('');
  }

  selectWorkflow(id: string): void {
    if (this.workflows().some((w) => w.id === id)) {
      this.selectedWorkflowId.set(id);
      const first = this.workflows().find((w) => w.id === id)?.steps[0];
      if (first) this.selectedStepId.set(first.id);
    }
  }

  onSideNav(event: { label: string }): void {
    const w = this.workflows().find((x) => x.name === event.label);
    if (w) this.selectWorkflow(w.id);
  }

  globalSearch(value: string): void {
    this.search.set(value);
    this.workflowSearch.set(value);
    if (value.trim()) this.navigate(1);
  }

  selectStep(id: string): void {
    if (this.selectedWorkflow().steps.some((s) => s.id === id)) this.selectedStepId.set(id);
  }

  addStep(kind: StepKind): void {
    const wfId = this.selectedWorkflowId();
    const step: FlowStep = {
      id: `s-${Date.now()}`,
      kind,
      label: `${kind} step`,
      config: kind === 'LLM' ? 'model: assist-v3' : 'Configure me',
      retries: kind === 'Retry' ? 3 : 0,
      branchLabel: kind === 'Branch' ? 'path A / path B' : undefined,
    };
    this.workflows.update((list) =>
      list.map((w) => (w.id === wfId ? { ...w, steps: [...w.steps, step], updated: 'Today', status: 'Draft' as FlowStatus } : w)),
    );
    this.selectedStepId.set(step.id);
    this.notify('Step added', step.label);
  }

  moveStep(index: number, delta: number): void {
    const wfId = this.selectedWorkflowId();
    this.workflows.update((list) =>
      list.map((w) => {
        if (w.id !== wfId) return w;
        const next = index + delta;
        if (next < 0 || next >= w.steps.length) return w;
        const steps = [...w.steps];
        [steps[index], steps[next]] = [steps[next], steps[index]];
        return { ...w, steps, updated: 'Today' };
      }),
    );
  }

  removeStep(id: string): void {
    const wfId = this.selectedWorkflowId();
    this.workflows.update((list) =>
      list.map((w) => (w.id === wfId ? { ...w, steps: w.steps.filter((s) => s.id !== id), updated: 'Today' } : w)),
    );
    this.notify('Step removed', id);
  }

  patchStep(change: Partial<FlowStep>): void {
    const wfId = this.selectedWorkflowId();
    const sid = this.selectedStepId();
    this.workflows.update((list) =>
      list.map((w) =>
        w.id === wfId ? { ...w, steps: w.steps.map((s) => (s.id === sid ? { ...s, ...change } : s)), updated: 'Today' } : w,
      ),
    );
  }

  onPaletteDrag(kind: StepKind): void {
    this.dragKind.set(kind);
  }

  onCanvasDrop(): void {
    const kind = this.dragKind();
    if (kind) {
      this.addStep(kind);
      this.dragKind.set(null);
    }
  }

  openPublish(): void {
    this.modal.set('publish');
  }

  confirmPublish(): void {
    const id = this.selectedWorkflowId();
    this.workflows.update((list) => list.map((w) => (w.id === id ? { ...w, status: 'Published' as FlowStatus } : w)));
    this.closeModal();
    this.notify('Workflow published', this.selectedWorkflow().name);
  }

  startRun(): void {
    const w = this.selectedWorkflow();
    const id = `run-${9000 + Math.floor(Math.random() * 99)}`;
    this.runs.update((list) => [{ id, workflowId: w.id, status: 'Running', started: 'Just now', durationSec: 0, trigger: 'Manual' }, ...list]);
    this.notify('Run started', id);
    setTimeout(() => {
      this.runs.update((list) => list.map((r) => (r.id === id ? { ...r, status: 'Succeeded', durationSec: 28 } : r)));
    }, 1200);
  }

  approveTask(id: string): void {
    this.humanTasks.update((list) => list.filter((t) => t.id !== id));
    this.notify('Human step completed', id);
  }

  onRange(range: { start: string; end: string }): void {
    this.rangeStart.set(range.start);
    this.rangeEnd.set(range.end);
  }

  exportFlows(): void {
    this.download(JSON.stringify({ workflows: this.workflows(), runs: this.runs() }, null, 2), 'workflows.json', 'application/json');
  }

  onExportMenu(item: { value: string }): void {
    if (item.value === 'yaml') this.download(this.flowYaml(), 'workflow.yaml', 'text/yaml');
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

  onImportSkip(): void {
    this.notify('Import skipped', 'Demo only.');
  }

  saveSettings(): void {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.notifyEmail().trim())) {
      this.error.set('Enter a valid email.');
      return;
    }
    this.error.set('');
    this.notify('Settings saved', `Default timeout ${this.defaultTimeout()}s`);
  }

  onProfile(item: { value: string }): void {
    if (item.value === 'mine') this.globalSearch('Pranav');
    else this.navigate(item.value === 'team' ? 7 : 8);
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
