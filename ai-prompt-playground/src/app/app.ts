import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
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
  EdsTreeViewComponent,
  EdsVisuallyHiddenComponent,
} from '@poluru-labs/enterprise-design-system-angular';

interface SavedPrompt {
  id: string;
  name: string;
  body: string;
  owner: string;
  updated: string;
}

interface PromptVariable {
  key: string;
  value: string;
}

interface ModelDef {
  id: string;
  label: string;
  provider: string;
  latencyMs: number;
  enabled: boolean;
}

interface PromptRun {
  id: string;
  modelId: string;
  modelLabel: string;
  output: string;
  tokens: number;
  ranAt: string;
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
    EdsTreeViewComponent,
    EdsVisuallyHiddenComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly nav = [
    { label: 'Overview' },
    { label: 'Playground' },
    { label: 'Models' },
    { label: 'Variables' },
    { label: 'Diff' },
    { label: 'History' },
    { label: 'Templates' },
    { label: 'Team' },
    { label: 'Settings' },
  ];
  readonly pages = this.nav.map((n) => n.label);
  readonly headings = [
    {
      eyebrow: 'SANDBOX',
      title: 'Prompt Playground',
      summary: 'Interactive sandbox to test prompts against multiple models with variable injection and diff view.',
    },
    { eyebrow: 'COMPOSE', title: 'Playground', summary: 'Edit prompts, inject variables, and run against selected models.' },
    { eyebrow: 'MODELS', title: 'Models', summary: 'Endpoints available in this workspace.' },
    { eyebrow: 'INJECT', title: 'Variables', summary: 'Key-value pairs merged into {{placeholders}}.' },
    { eyebrow: 'COMPARE', title: 'Diff', summary: 'Side-by-side output comparison from recent runs.' },
    { eyebrow: 'RUNS', title: 'History', summary: 'Past executions with token counts.' },
    { eyebrow: 'LIBRARY', title: 'Templates', summary: 'Reusable prompt starters owned by your team.' },
    { eyebrow: 'PEOPLE', title: 'Team', summary: 'Prompt authors and reviewers.' },
    { eyebrow: 'WORKSPACE', title: 'Settings', summary: 'Defaults, temperature, and export.' },
  ];
  readonly team = [
    { name: 'Neha Poluru', role: 'Prompt lead' },
    { name: 'Omar Poluru', role: 'Model ops' },
    { name: 'Pallavi Poluru', role: 'Evaluator' },
    { name: 'Rehan Poluru', role: 'Integrations' },
    { name: 'Sana Poluru', role: 'Platform' },
  ];
  readonly helpAccordion = [
    { heading: 'Variables', content: 'Use {{name}} in the prompt body. Values from the Variables panel replace placeholders before each run.', open: true },
    { heading: 'Multi-model', content: 'Enable models on the Models tab, then Run all in the playground to collect outputs for diff.', open: false },
    { heading: 'Diff view', content: 'Pick two runs from history to compare line-by-line (demo highlights).', open: false },
  ];
  readonly runColumns = [
    { key: 'id', label: 'Run' },
    { key: 'modelLabel', label: 'Model' },
    { key: 'tokens', label: 'Tokens' },
    { key: 'ranAt', label: 'When' },
  ];
  readonly teamColumns = [
    { key: 'name', label: 'Member' },
    { key: 'role', label: 'Role' },
    { key: 'prompts', label: 'Prompts' },
    { key: 'runs', label: 'Runs' },
    { key: 'reviews', label: 'Reviews' },
  ];
  readonly weeklyRuns = [120, 145, 132, 160, 148, 175, 168];

  readonly prompts = signal<SavedPrompt[]>([
    {
      id: 'p-support',
      name: 'Support reply',
      owner: 'Neha Poluru',
      updated: 'Today',
      body: 'You are a concise support agent for {{company}}.\nCustomer: {{question}}\nReply in {{tone}} tone.',
    },
    {
      id: 'p-summary',
      name: 'Meeting summary',
      owner: 'Pallavi Poluru',
      updated: 'Sep 27',
      body: 'Summarize the notes below into bullets with owners.\n\n{{notes}}',
    },
    {
      id: 'p-extract',
      name: 'Invoice extract',
      owner: 'Omar Poluru',
      updated: 'Sep 26',
      body: 'Extract vendor, total, and due date from:\n{{document}}',
    },
  ]);

  readonly variables = signal<PromptVariable[]>([
    { key: 'company', value: 'Poluru Labs' },
    { key: 'question', value: 'Where is my refund?' },
    { key: 'tone', value: 'friendly' },
    { key: 'notes', value: 'Launch moved to Oct 20. Rahul owns QA.' },
  ]);

  readonly models = signal<ModelDef[]>([
    { id: 'assist-v3', label: 'Assist v3', provider: 'Poluru', latencyMs: 420, enabled: true },
    { id: 'assist-v3-mini', label: 'Assist v3 mini', provider: 'Poluru', latencyMs: 180, enabled: true },
    { id: 'reason-v1', label: 'Reason v1', provider: 'Poluru', latencyMs: 890, enabled: false },
  ]);

  readonly runs = signal<PromptRun[]>([
    {
      id: 'run-441',
      modelId: 'assist-v3',
      modelLabel: 'Assist v3',
      tokens: 312,
      ranAt: 'Sep 28, 09:12',
      output: 'Thanks for reaching out to Poluru Labs. Your refund for order #10482 is processing and should post within 3 business days.',
    },
    {
      id: 'run-440',
      modelId: 'assist-v3-mini',
      modelLabel: 'Assist v3 mini',
      tokens: 198,
      ranAt: 'Sep 28, 09:12',
      output: 'Hi! Refund for #10482 is on the way — expect it in about 3 days. Let us know if you need anything else.',
    },
  ]);

  readonly log = signal([
    { title: 'Multi-model run', description: 'Neha Poluru · 2 models', timestamp: 'Sep 28, 09:12' },
    { title: 'Variable set saved', description: 'company, tone', timestamp: 'Sep 28, 08:40' },
  ]);

  readonly page = signal(0);
  readonly selectedPromptId = signal('p-support');
  readonly promptBody = signal('');
  readonly diffLeftId = signal('run-441');
  readonly diffRightId = signal('run-440');
  readonly rangeStart = signal('2026-09-01');
  readonly rangeEnd = signal('2026-09-28');
  readonly temperature = signal(0.4);
  readonly maxTokens = signal(512);
  readonly settingsTab = signal(0);
  readonly settingsTabs = [{ label: 'Generation' }, { label: 'Export' }];
  readonly notifyEmail = signal('prompts@poluru.example');
  readonly search = signal('');
  readonly menuOpen = signal(false);
  readonly helpOpen = signal(false);
  readonly showIntro = signal(true);
  readonly drawerOpen = signal(false);
  readonly modal = signal<'save' | null>(null);
  readonly runPage = signal(1);
  readonly teamSort = signal<{ key: string; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });
  readonly notice = signal('');
  readonly error = signal('');
  readonly toastOpen = signal(false);
  readonly toastTitle = signal('');
  readonly toastBody = signal('');
  readonly lastOutputs = signal<Record<string, string>>({});

  readonly breadcrumbs = computed(() => [{ label: 'Poluru Labs' }, { label: this.pages[this.page()] }]);
  readonly selectedPrompt = computed(() => this.prompts().find((p) => p.id === this.selectedPromptId()) ?? this.prompts()[0]);
  readonly sideNavItems = computed(() =>
    this.prompts().map((p) => ({ label: p.name, description: p.owner, active: p.id === this.selectedPromptId() })),
  );
  readonly enabledModels = computed(() => this.models().filter((m) => m.enabled));
  readonly weeklyMax = computed(() => Math.max(...this.weeklyRuns, 1));
  readonly recentLog = computed(() => this.log().map((i) => ({ ...i, status: 'complete' as const })));
  readonly runRows = computed(() =>
    this.runs().map((r) => ({ id: r.id, modelLabel: r.modelLabel, tokens: r.tokens, ranAt: r.ranAt })),
  );
  readonly modelOptions = computed(() => this.runs().map((r) => ({ label: `${r.modelLabel} (${r.id})`, value: r.id })));

  readonly resolvedPrompt = computed(() => {
    let text = this.promptBody() || this.selectedPrompt().body;
    for (const v of this.variables()) {
      text = text.replaceAll(`{{${v.key}}}`, v.value);
    }
    return text;
  });

  readonly diffLeft = computed(() => this.runs().find((r) => r.id === this.diffLeftId()) ?? this.runs()[0]);
  readonly diffRight = computed(() => this.runs().find((r) => r.id === this.diffRightId()) ?? this.runs()[1] ?? this.runs()[0]);

  readonly diffLines = computed(() => {
    const a = this.diffLeft().output.split('\n');
    const b = this.diffRight().output.split('\n');
    const max = Math.max(a.length, b.length);
    const lines: { left: string; right: string; changed: boolean }[] = [];
    for (let i = 0; i < max; i++) {
      const left = a[i] ?? '';
      const right = b[i] ?? '';
      lines.push({ left, right, changed: left !== right });
    }
    return lines;
  });

  readonly teamRows = computed(() => {
    const { key, direction } = this.teamSort();
    return this.team
      .map((member) => ({
        ...member,
        prompts: this.prompts().filter((p) => p.owner === member.name).length,
        runs: member.name === 'Neha Poluru' ? 840 : 210,
        reviews: member.name === 'Pallavi Poluru' ? 56 : 12,
      }))
      .sort((a, b) => {
        const av = a[key as keyof typeof a];
        const bv = b[key as keyof typeof b];
        const cmp = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv));
        return direction === 'asc' ? cmp : -cmp;
      });
  });

  readonly variableMeta = computed(() =>
    this.variables().map((v) => ({ term: v.key, description: v.value || '(empty)' })),
  );

  constructor() {
    this.promptBody.set(this.prompts()[0].body);
  }

  navigate(page: number): void {
    this.page.set(page);
    this.error.set('');
  }

  selectPrompt(id: string): void {
    const p = this.prompts().find((x) => x.id === id);
    if (p) {
      this.selectedPromptId.set(id);
      this.promptBody.set(p.body);
    }
  }

  onSideNav(event: { label: string }): void {
    const p = this.prompts().find((x) => x.name === event.label);
    if (p) this.selectPrompt(p.id);
  }

  globalSearch(value: string): void {
    this.search.set(value);
    if (value.trim()) {
      this.navigate(1);
      const hit = this.prompts().find((p) => `${p.name} ${p.owner}`.toLowerCase().includes(value.toLowerCase()));
      if (hit) this.selectPrompt(hit.id);
    }
  }

  patchVariable(index: number, patch: Partial<PromptVariable>): void {
    this.variables.update((list) => list.map((v, i) => (i === index ? { ...v, ...patch } : v)));
  }

  addVariable(): void {
    this.variables.update((list) => [...list, { key: 'new_key', value: '' }]);
  }

  removeVariable(index: number): void {
    this.variables.update((list) => list.filter((_, i) => i !== index));
  }

  toggleModel(id: string, enabled: boolean): void {
    this.models.update((list) => list.map((m) => (m.id === id ? { ...m, enabled } : m)));
  }

  runAll(): void {
    const enabled = this.enabledModels();
    if (!enabled.length) {
      this.error.set('Enable at least one model.');
      return;
    }
    this.error.set('');
    const base = this.resolvedPrompt();
    const outputs: Record<string, string> = {};
    const newRuns: PromptRun[] = [];
    for (const m of enabled) {
      const output =
        m.id === 'assist-v3-mini'
          ? `(${m.label}) Quick reply based on prompt length ${base.length} chars at temp ${this.temperature()}.`
          : `(${m.label}) Full response:\n${base.slice(0, 120)}${base.length > 120 ? '…' : ''}`;
      outputs[m.id] = output;
      const id = `run-${440 + newRuns.length + 1}`;
      newRuns.push({ id, modelId: m.id, modelLabel: m.label, output, tokens: 180 + m.latencyMs / 4, ranAt: 'Just now' });
    }
    this.lastOutputs.set(outputs);
    this.runs.update((list) => [...newRuns, ...list]);
    this.notify('Run complete', `${newRuns.length} model(s)`);
    if (newRuns.length >= 2) {
      this.diffLeftId.set(newRuns[0].id);
      this.diffRightId.set(newRuns[1].id);
    }
  }

  savePromptBody(): void {
    const id = this.selectedPromptId();
    const body = this.promptBody();
    this.prompts.update((list) => list.map((p) => (p.id === id ? { ...p, body, updated: 'Today' } : p)));
    this.notify('Prompt saved', this.selectedPrompt().name);
  }

  onRange(range: { start: string; end: string }): void {
    this.rangeStart.set(range.start);
    this.rangeEnd.set(range.end);
  }

  exportWorkspace(): void {
    this.download(
      JSON.stringify({ prompts: this.prompts(), variables: this.variables(), runs: this.runs() }, null, 2),
      'prompt-playground.json',
      'application/json',
    );
  }

  onExportMenu(item: { value: string }): void {
    if (item.value === 'prompt') this.download(this.resolvedPrompt(), 'prompt.txt', 'text/plain');
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
    this.notify('Settings saved', `Temp ${this.temperature()}`);
  }

  onProfile(item: { value: string }): void {
    if (item.value === 'mine') this.globalSearch('Neha');
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
