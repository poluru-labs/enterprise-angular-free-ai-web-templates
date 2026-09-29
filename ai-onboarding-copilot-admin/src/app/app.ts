import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
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
  EdsCodeSnippetComponent,
  EdsDataTableComponent,
  EdsDatePickerComponent,
  EdsDateRangePickerComponent,
  EdsDescriptionListComponent,
  EdsDividerComponent,
  EdsDrawerComponent,
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
  EdsSearchComponent,
  EdsSegmentedControlComponent,
  EdsSelectComponent,
  EdsSideNavComponent,
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

type Status = 'Draft' | 'Published' | 'Paused';
type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
type Placement = 'top' | 'bottom' | 'left' | 'right';

interface GuideStep { id: string; title: string; body: string; anchor: string; placement: Placement; }
interface Guide {
  id: string; name: string; surface: string; status: Status; audienceId: string; owner: string; updated: string;
  starts: number; completions: number; dismissals: number; steps: GuideStep[];
}
interface Tooltip { id: string; label: string; anchor: string; text: string; surface: string; enabled: boolean; views: number; dismissals: number; }
interface Prompt { id: string; title: string; text: string; category: string; surface: string; pinned: boolean; clicks: number; }
interface Audience { id: string; name: string; description: string; plan: string; rule: string; users: number; }
interface PromptDraft { title: string; text: string; category: string; surface: string; pinned: boolean; }

const SURFACES = ['Dashboard', 'Projects', 'Copilot panel', 'Settings', 'Reports'];

@Component({
  selector: 'app-root',
  imports: [
    NgTemplateOutlet, EdsAccordionComponent, EdsAlertComponent, EdsAvatarComponent, EdsBadgeComponent,
    EdsBreadcrumbComponent, EdsButtonComponent, EdsButtonGroupComponent, EdsCardComponent, EdsCheckboxComponent,
    EdsCodeSnippetComponent, EdsDataTableComponent, EdsDatePickerComponent, EdsDateRangePickerComponent,
    EdsDescriptionListComponent, EdsDividerComponent, EdsDrawerComponent, EdsDropdownMenuComponent, EdsEmptyStateComponent,
    EdsFileUploadComponent, EdsInputComponent, EdsKbdComponent, EdsLinkComponent, EdsListComponent, EdsMenuItemComponent,
    EdsMeterComponent, EdsModalComponent, EdsNumberInputComponent, EdsPaginationComponent, EdsPopoverComponent, EdsProgressBarComponent,
    EdsRadioComponent, EdsRadioGroupComponent, EdsSearchComponent, EdsSegmentedControlComponent, EdsSelectComponent,
    EdsSideNavComponent, EdsSplitButtonComponent, EdsStatComponent,
    EdsStatusComponent, EdsStepperComponent, EdsSwitchComponent, EdsTabsComponent, EdsTagComponent, EdsTextareaComponent,
    EdsTimePickerComponent, EdsTimelineComponent, EdsToastComponent, EdsToolbarComponent, EdsTreeViewComponent,
    EdsVisuallyHiddenComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly Math = Math;
  readonly surfaces = SURFACES;
  readonly pages = ['Overview', 'Guides', 'Tooltips', 'Prompts', 'Audiences', 'Analytics', 'Preview', 'Team', 'Settings'];
  readonly headings = [
    { eyebrow: 'ENABLEMENT', title: 'Copilot Onboarding Admin', summary: 'Configure in-app AI copilot guides, tooltips, and suggested prompts for end-user enablement.' },
    { eyebrow: 'TOURS', title: 'Guides', summary: 'Multi-step walkthroughs that introduce features in context.' },
    { eyebrow: 'HINTS', title: 'Tooltips', summary: 'Short labels on specific controls. Shown until the user dismisses them or completes the action.' },
    { eyebrow: 'STARTERS', title: 'Suggested prompts', summary: 'Ready-made questions users can tap to try the copilot.' },
    { eyebrow: 'TARGETING', title: 'Audiences', summary: 'Who sees which guides, tooltips, and prompts.' },
    { eyebrow: 'RESULTS', title: 'Analytics', summary: 'Starts, completions, and dismissals across surfaces.' },
    { eyebrow: 'SANDBOX', title: 'Preview', summary: 'Walk through a guide the way end users will see it.' },
    { eyebrow: 'PEOPLE', title: 'Team', summary: 'Who owns onboarding content.' },
    { eyebrow: 'WORKSPACE', title: 'Settings', summary: 'Defaults, scheduling, and export.' },
  ];
  readonly team = [
    { name: 'Meera Poluru', role: 'Enablement lead' },
    { name: 'Arjun Poluru', role: 'Product designer' },
    { name: 'Lavanya Poluru', role: 'Technical writer' },
    { name: 'Kiran Poluru', role: 'Customer success' },
    { name: 'Pooja Poluru', role: 'Support trainer' },
  ];
  readonly teamNames = this.team.map((member) => member.name);
  readonly categories = ['Getting started', 'Writing', 'Analysis', 'Admin', 'Support'];
  readonly placementOptions = [{ label: 'Top', value: 'top' }, { label: 'Bottom', value: 'bottom' }, { label: 'Left', value: 'left' }, { label: 'Right', value: 'right' }];
  readonly statusFilters = [{ label: 'All', value: 'all' }, { label: 'Published', value: 'Published' }, { label: 'Draft', value: 'Draft' }, { label: 'Paused', value: 'Paused' }];
  readonly helpAccordion = [
    { heading: 'Guides vs tooltips', content: 'Guides walk through several steps in order. Tooltips are one-off hints on a single element.', open: true },
    { heading: 'Anchors', content: 'Anchors are CSS selectors in the product (for example #copilot-input). They must match exactly in each environment.' },
    { heading: 'Audiences', content: 'Content can be limited by plan or role. Users only see the highest-priority matching audience.' },
  ];
  readonly teamColumns = [{ key: 'name', label: 'Member' }, { key: 'role', label: 'Role' }, { key: 'guides', label: 'Guides owned' }, { key: 'published', label: 'Published' }, { key: 'completion', label: 'Avg completion' }];

  readonly audiences = signal<Audience[]>([
    { id: 'aud-all', name: 'All users', description: 'Everyone signed in', plan: 'Any', rule: 'Signed in', users: 12400 },
    { id: 'aud-new', name: 'New this week', description: 'Account created in the last 7 days', plan: 'Any', rule: 'created < 7d', users: 890 },
    { id: 'aud-pro', name: 'Pro & Enterprise', description: 'Paid workspaces', plan: 'Pro, Enterprise', rule: 'plan in (Pro, Enterprise)', users: 4200 },
    { id: 'aud-admin', name: 'Workspace admins', description: 'Can change billing and members', plan: 'Any', rule: 'role = Admin', users: 680 },
  ]);

  readonly guides = signal<Guide[]>([
    this.makeGuide('g-copilot', 'First copilot chat', 'Copilot panel', 'Published', 'aud-new', 'Lavanya Poluru', 'Sep 26', 1820, 1240, 210, [
      { id: 's1', title: 'Open the copilot', body: 'Click the sparkle icon to open the side panel.', anchor: '#copilot-launcher', placement: 'left' },
      { id: 's2', title: 'Try a suggested prompt', body: 'Tap a starter question or type your own.', anchor: '#copilot-prompts', placement: 'top' },
      { id: 's3', title: 'Send a message', body: 'Press Enter or click Send. Replies appear here.', anchor: '#copilot-input', placement: 'top' },
    ]),
    this.makeGuide('g-projects', 'Create your first project', 'Projects', 'Published', 'aud-new', 'Meera Poluru', 'Sep 22', 960, 710, 95, [
      { id: 's1', title: 'New project', body: 'Projects keep files and copilot history together.', anchor: '#new-project', placement: 'bottom' },
      { id: 's2', title: 'Invite teammates', body: 'Add people from your workspace directory.', anchor: '#invite-members', placement: 'right' },
    ]),
    this.makeGuide('g-reports', 'Export a report', 'Reports', 'Draft', 'aud-pro', 'Arjun Poluru', 'Sep 27', 0, 0, 0, [
      { id: 's1', title: 'Pick a date range', body: 'Exports respect the filters you set here.', anchor: '#report-range', placement: 'bottom' },
      { id: 's2', title: 'Download CSV', body: 'Large exports arrive by email.', anchor: '#export-csv', placement: 'top' },
    ]),
    this.makeGuide('g-settings', 'Connect your calendar', 'Settings', 'Paused', 'aud-admin', 'Kiran Poluru', 'Sep 18', 420, 180, 88, [
      { id: 's1', title: 'Integrations', body: 'Calendar sync powers meeting summaries.', anchor: '#integrations-tab', placement: 'right' },
    ]),
  ]);

  readonly tooltips = signal<Tooltip[]>([
    { id: 'tt-1', label: 'Copilot launcher', anchor: '#copilot-launcher', text: 'Ask questions about your workspace here.', surface: 'Dashboard', enabled: true, views: 5400, dismissals: 890 },
    { id: 'tt-2', label: 'Prompt library', anchor: '#copilot-prompts', text: 'Starter prompts change based on what you are viewing.', surface: 'Copilot panel', enabled: true, views: 3200, dismissals: 410 },
    { id: 'tt-3', label: 'Project visibility', anchor: '#project-visibility', text: 'Private projects are only visible to members you invite.', surface: 'Projects', enabled: true, views: 1100, dismissals: 120 },
    { id: 'tt-4', label: 'Model picker', anchor: '#model-select', text: 'Faster models are best for short questions.', surface: 'Copilot panel', enabled: false, views: 800, dismissals: 200 },
    { id: 'tt-5', label: 'Billing cycle', anchor: '#billing-cycle', text: 'Usage resets on the first of each month.', surface: 'Settings', enabled: true, views: 640, dismissals: 90 },
  ]);

  readonly prompts = signal<Prompt[]>([
    { id: 'p-1', title: 'Summarize this page', text: 'Summarize the key points on this page in three bullets.', category: 'Getting started', surface: 'Copilot panel', pinned: true, clicks: 2400 },
    { id: 'p-2', title: 'Draft a follow-up email', text: 'Draft a polite follow-up email about our last meeting.', category: 'Writing', surface: 'Copilot panel', pinned: true, clicks: 1800 },
    { id: 'p-3', title: 'Explain this chart', text: 'Explain what changed in this chart compared to last month.', category: 'Analysis', surface: 'Reports', pinned: false, clicks: 920 },
    { id: 'p-4', title: 'Who has access?', text: 'Who currently has access to this project?', category: 'Admin', surface: 'Projects', pinned: false, clicks: 640 },
    { id: 'p-5', title: 'Reset my password steps', text: 'How do I reset my password if I lost my phone?', category: 'Support', surface: 'Dashboard', pinned: false, clicks: 510 },
  ]);

  readonly log = signal([
    { title: 'Published “First copilot chat”', description: 'Lavanya Poluru · audience New this week', timestamp: 'Sep 26, 14:10' },
    { title: 'Paused “Connect your calendar”', description: 'Kiran Poluru · integration delayed', timestamp: 'Sep 24, 09:02' },
    { title: 'Added tooltip on prompt library', description: 'Meera Poluru', timestamp: 'Sep 23, 16:44' },
  ]);

  readonly page = signal(0);
  readonly selectedGuideId = signal('g-copilot');
  readonly selectedStep = signal(0);
  readonly guideFilter = signal('all');
  readonly guideSearch = signal('');
  readonly guidePage = signal(1);
  readonly selectedTooltipId = signal('tt-1');
  readonly tooltipSurface = signal('all');
  readonly promptFilter = signal('all');
  readonly promptSearch = signal('');
  readonly selectedAudienceId = signal('aud-new');
  readonly previewGuideId = signal('g-copilot');
  readonly previewStep = signal(0);
  readonly previewPlaying = signal(false);
  readonly rangeStart = signal('2026-09-01');
  readonly rangeEnd = signal('2026-09-28');
  readonly analyticsView = signal('guides');
  readonly modal = signal<'guide' | 'prompt' | 'publish' | null>(null);
  readonly promptDraft = signal<PromptDraft>({ title: '', text: '', category: 'Getting started', surface: 'Copilot panel', pinned: false });
  readonly publishDate = signal('');
  readonly autoPublish = signal(false);
  readonly showTooltips = signal(true);
  readonly showPrompts = signal(true);
  readonly defaultAudience = signal('aud-new');
  readonly digestTime = signal('09:00');
  readonly notifyEmail = signal('enablement@poluru.example');
  readonly rolloutPercent = signal(100);
  readonly settingsTab = signal(0);
  readonly settingsTabs = [{ label: 'Defaults' }, { label: 'Digest & import' }];
  readonly search = signal('');
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

  readonly navItems = computed(() => this.pages.map((label, i) => ({ label, active: i === this.page() })));
  readonly breadcrumbs = computed(() => [{ label: 'Poluru Labs' }, { label: this.pages[this.page()] }]);
  readonly surfaceOptions = this.surfaces.map((value) => ({ label: value, value }));
  readonly audienceOptions = computed(() => this.audiences().map((aud) => ({ label: aud.name, value: aud.id })));
  readonly categoryOptions = this.categories.map((value) => ({ label: value, value }));
  readonly guideOptions = computed(() => this.guides().map((g) => ({ label: g.name, value: g.id })));
  readonly analyticsViews = [{ label: 'Guides', value: 'guides' }, { label: 'Tooltips', value: 'tooltips' }, { label: 'Prompts', value: 'prompts' }];

  readonly selectedGuide = computed(() => this.guides().find((g) => g.id === this.selectedGuideId()) ?? this.guides()[0]);
  readonly selectedStepData = computed(() => this.selectedGuide().steps[this.selectedStep()] ?? null);
  readonly filteredGuides = computed(() => {
    const q = this.guideSearch().trim().toLowerCase();
    const f = this.guideFilter();
    return this.guides().filter((g) => (f === 'all' || g.status === f) && (!q || `${g.name} ${g.surface} ${g.owner}`.toLowerCase().includes(q)));
  });
  readonly pagedGuides = computed(() => this.filteredGuides().slice((this.guidePage() - 1) * 5, this.guidePage() * 5));
  readonly drafts = computed(() => this.guides().filter((g) => g.status === 'Draft'));
  readonly publishedCount = computed(() => this.guides().filter((g) => g.status === 'Published').length);
  readonly activeTooltips = computed(() => this.tooltips().filter((t) => t.enabled).length);
  readonly totalStarts = computed(() => this.guides().reduce((sum, g) => sum + g.starts, 0));
  readonly avgCompletion = computed(() => {
    const list = this.guides().filter((g) => g.starts > 0);
    return list.length ? Math.round(list.reduce((sum, g) => sum + this.completionRate(g), 0) / list.length) : 0;
  });
  readonly sidebarList = computed(() => this.drafts().map((g) => ({ label: g.name, description: `${g.surface} · draft`, selected: g.id === this.selectedGuideId() })));
  readonly guideMeta = computed(() => {
    const g = this.selectedGuide();
    const aud = this.audiences().find((a) => a.id === g.audienceId);
    return [
      { term: 'Surface', description: g.surface },
      { term: 'Audience', description: aud?.name ?? g.audienceId },
      { term: 'Status', description: g.status },
      { term: 'Owner', description: g.owner },
      { term: 'Starts', description: g.starts.toLocaleString() },
      { term: 'Completion', description: g.starts ? `${this.completionRate(g)}%` : '—' },
    ];
  });
  readonly stepYaml = computed(() => {
    const g = this.selectedGuide();
    return ['guide:', `  id: ${g.id}`, `  name: ${g.name}`, '  steps:', ...g.steps.map((s, i) => `    - ${i + 1}. ${s.title} (${s.anchor})`)].join('\n');
  });
  readonly recentLog = computed(() => this.log().map((item) => ({ ...item, status: 'complete' as const })));

  readonly visibleTooltips = computed(() => this.tooltips().filter((t) => this.tooltipSurface() === 'all' || t.surface === this.tooltipSurface()));
  readonly selectedTooltip = computed(() => this.tooltips().find((t) => t.id === this.selectedTooltipId()) ?? this.tooltips()[0]);
  readonly tooltipTree = computed(() => this.surfaces.map((surface) => ({
    id: surface, label: surface,
    children: this.tooltips().filter((t) => t.surface === surface).map((t) => ({ id: t.id, label: `${t.label}${t.enabled ? '' : ' (off)'}` })),
  })));
  readonly treeExpanded: Record<string, boolean> = Object.fromEntries(SURFACES.map((s) => [s, true]));

  readonly filteredPrompts = computed(() => {
    const q = this.promptSearch().trim().toLowerCase();
    const f = this.promptFilter();
    return this.prompts().filter((p) => {
      const pin = f === 'pinned' ? p.pinned : f === 'all' ? true : p.surface === f;
      return pin && (!q || `${p.title} ${p.text} ${p.category}`.toLowerCase().includes(q));
    });
  });
  readonly pinnedPrompts = computed(() => this.prompts().filter((p) => p.pinned));
  readonly maxPromptClicks = computed(() => Math.max(1, ...this.prompts().map((p) => p.clicks)));

  readonly selectedAudience = computed(() => this.audiences().find((a) => a.id === this.selectedAudienceId()) ?? this.audiences()[0]);
  readonly audienceUsage = computed(() => this.audiences().map((aud) => ({
    ...aud,
    guides: this.guides().filter((g) => g.audienceId === aud.id).length,
    tooltips: this.tooltips().filter((t) => t.enabled).length,
    prompts: this.prompts().filter((p) => p.surface !== 'Settings').length,
  })));

  readonly surfaceStats = computed(() => this.surfaces.map((surface) => {
    const guides = this.guides().filter((g) => g.surface === surface && g.starts > 0);
    const rate = guides.length ? Math.round(guides.reduce((sum, g) => sum + this.completionRate(g), 0) / guides.length) : 0;
    return { surface, guides: this.guides().filter((g) => g.surface === surface).length, rate, starts: guides.reduce((sum, g) => sum + g.starts, 0) };
  }));
  readonly weeklyStarts = [420, 510, 480, 620, 580, 710];
  readonly weeklyMax = computed(() => Math.max(...this.weeklyStarts, 1));
  readonly topGuides = computed(() => [...this.guides()].filter((g) => g.starts > 0).sort((a, b) => b.starts - a.starts).slice(0, 5));

  readonly previewGuide = computed(() => this.guides().find((g) => g.id === this.previewGuideId()) ?? this.guides()[0]);
  readonly previewStepData = computed(() => this.previewGuide().steps[this.previewStep()] ?? null);
  readonly stepperSteps = computed(() => this.selectedGuide().steps.map((s) => ({ label: s.title })));
  readonly previewStepperSteps = computed(() => this.previewGuide().steps.map((s) => ({ label: s.title })));
  readonly publishAudienceName = computed(() => this.audiences().find((a) => a.id === this.selectedGuide().audienceId)?.name ?? '');
  readonly selectedAudienceItems = computed(() => [
    { term: 'Plans', description: this.selectedAudience().plan },
    { term: 'Rule', description: this.selectedAudience().rule },
    { term: 'Estimated users', description: String(this.selectedAudience().users) },
  ]);
  readonly publishModalItems = computed(() => [
    { term: 'Audience', description: this.publishAudienceName() },
    { term: 'Steps', description: String(this.selectedGuide().steps.length) },
  ]);
  readonly previewStepMeta = computed(() => {
    const step = this.previewStepData();
    return step ? [{ term: 'Anchor', description: step.anchor }, { term: 'Placement', description: step.placement }] : [];
  });

  readonly previewProgress = computed(() => {
    const steps = this.previewGuide().steps.length;
    return steps ? Math.round(((this.previewStep() + 1) / steps) * 100) : 0;
  });

  readonly teamRows = computed(() => {
    const { key, direction } = this.teamSort();
    return this.team.map((member) => {
      const owned = this.guides().filter((g) => g.owner === member.name);
      const pub = owned.filter((g) => g.status === 'Published');
      const completion = pub.length ? Math.round(pub.reduce((sum, g) => sum + this.completionRate(g), 0) / pub.length) : 0;
      return { ...member, guides: owned.length, published: pub.length, completion };
    }).sort((a, b) => {
      const av = a[key as keyof typeof a];
      const bv = b[key as keyof typeof b];
      const cmp = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv));
      return direction === 'asc' ? cmp : -cmp;
    });
  });

  makeGuide(id: string, name: string, surface: string, status: Status, audienceId: string, owner: string, updated: string, starts: number, completions: number, dismissals: number, steps: GuideStep[]): Guide {
    return { id, name, surface, status, audienceId, owner, updated, starts, completions, dismissals, steps };
  }

  completionRate(g: Guide): number {
    return g.starts ? Math.round((g.completions / g.starts) * 100) : 0;
  }

  dismissRate(g: Guide): number {
    return g.starts ? Math.round((g.dismissals / g.starts) * 100) : 0;
  }

  tooltipDismissRate(t: Tooltip): number {
    return t.views ? Math.round((t.dismissals / t.views) * 100) : 0;
  }

  tone(status: Status | string): Tone {
    const map: Record<string, Tone> = { Draft: 'neutral', Published: 'success', Paused: 'warning' };
    return map[status] ?? 'brand';
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

  onSidebarList(event: { index: number }): void {
    const g = this.drafts()[event.index];
    if (g) {
      this.selectedGuideId.set(g.id);
      this.navigate(1);
    }
  }

  globalSearch(value: string): void {
    this.search.set(value);
    this.guideSearch.set(value);
    if (value.trim()) this.navigate(1);
  }

  openGuide(id: string): void {
    this.selectedGuideId.set(id);
    this.selectedStep.set(0);
    this.navigate(1);
  }

  patchGuide(id: string, change: Partial<Guide>): void {
    this.guides.update((list) => list.map((g) => (g.id === id ? { ...g, ...change, updated: 'Today' } : g)));
  }

  patchStep(index: number, change: Partial<GuideStep>): void {
    const id = this.selectedGuideId();
    this.guides.update((list) => list.map((g) => (g.id === id ? { ...g, steps: g.steps.map((s, i) => (i === index ? { ...s, ...change } : s)), updated: 'Today' } : g)));
  }

  moveStep(index: number, delta: number): void {
    const g = this.selectedGuide();
    const next = index + delta;
    if (next < 0 || next >= g.steps.length) return;
    const steps = [...g.steps];
    [steps[index], steps[next]] = [steps[next], steps[index]];
    this.patchGuide(g.id, { steps });
    this.selectedStep.set(next);
  }

  addStep(): void {
    const g = this.selectedGuide();
    const step: GuideStep = { id: `s${Date.now()}`, title: 'New step', body: 'Explain what the user should do here.', anchor: '#selector', placement: 'bottom' };
    this.patchGuide(g.id, { steps: [...g.steps, step] });
    this.selectedStep.set(g.steps.length);
  }

  removeStep(index: number): void {
    const g = this.selectedGuide();
    if (g.steps.length < 2) {
      this.error.set('A guide needs at least one step.');
      return;
    }
    this.patchGuide(g.id, { steps: g.steps.filter((_, i) => i !== index) });
    this.selectedStep.set(Math.max(0, index - 1));
    this.error.set('');
  }

  setPlacement(value: string): void {
    if (value === 'top' || value === 'bottom' || value === 'left' || value === 'right') this.patchStep(this.selectedStep(), { placement: value });
  }

  openPublish(): void {
    this.publishDate.set('');
    this.error.set('');
    this.modal.set('publish');
  }

  confirmPublish(): void {
    const g = this.selectedGuide();
    if (g.steps.some((s) => !s.anchor.startsWith('#') || s.title.length < 3)) {
      this.error.set('Every step needs a title and an anchor starting with #.');
      return;
    }
    this.patchGuide(g.id, { status: 'Published' });
    this.log.update((list) => [{ title: `Published “${g.name}”`, description: `${g.owner} · ${this.audiences().find((a) => a.id === g.audienceId)?.name ?? ''}`, timestamp: 'Just now' }, ...list]);
    this.closeModal();
    this.notify('Guide published', this.publishDate() ? `Scheduled for ${this.publishDate()}` : 'Live now for the target audience.');
  }

  pauseGuide(id = this.selectedGuideId()): void {
    this.patchGuide(id, { status: 'Paused' });
    this.notify('Guide paused', id);
  }

  duplicateGuide(): void {
    const g = this.selectedGuide();
    const copy = this.makeGuide(`g-${Date.now()}`, `${g.name} (copy)`, g.surface, 'Draft', g.audienceId, 'Meera Poluru', 'Today', 0, 0, 0, g.steps.map((s) => ({ ...s, id: `s${Math.random().toString(36).slice(2, 7)}` })));
    this.guides.update((list) => [copy, ...list]);
    this.openGuide(copy.id);
    this.notify('Guide duplicated', copy.name);
  }

  toggleTooltip(id: string, enabled: boolean): void {
    this.tooltips.update((list) => list.map((t) => (t.id === id ? { ...t, enabled } : t)));
  }

  patchTooltip(change: Partial<Tooltip>): void {
    const id = this.selectedTooltipId();
    this.tooltips.update((list) => list.map((t) => (t.id === id ? { ...t, ...change } : t)));
  }

  selectTooltip(id: string): void {
    if (this.tooltips().some((t) => t.id === id)) this.selectedTooltipId.set(id);
  }

  openPromptModal(): void {
    this.promptDraft.set({ title: '', text: '', category: 'Getting started', surface: 'Copilot panel', pinned: false });
    this.error.set('');
    this.modal.set('prompt');
  }

  patchPromptDraft(change: Partial<PromptDraft>): void {
    this.promptDraft.update((draft) => ({ ...draft, ...change }));
    this.error.set('');
  }

  savePrompt(): void {
    const draft = this.promptDraft();
    if (draft.title.trim().length < 4 || draft.text.trim().length < 10) {
      this.error.set('Title (4+ chars) and prompt text (10+ chars) are required.');
      return;
    }
    this.prompts.update((list) => [{ id: `p-${Date.now()}`, title: draft.title.trim(), text: draft.text.trim(), category: draft.category, surface: draft.surface, pinned: draft.pinned, clicks: 0 }, ...list]);
    this.closeModal();
    this.notify('Prompt added', draft.title.trim());
  }

  togglePin(id: string): void {
    this.prompts.update((list) => list.map((p) => (p.id === id ? { ...p, pinned: !p.pinned } : p)));
  }

  previewNext(): void {
    const steps = this.previewGuide().steps.length;
    if (this.previewStep() < steps - 1) this.previewStep.update((v) => v + 1);
    else this.previewPlaying.set(false);
  }

  previewPrev(): void {
    if (this.previewStep() > 0) this.previewStep.update((v) => v - 1);
  }

  startPreview(): void {
    this.previewStep.set(0);
    this.previewPlaying.set(true);
    this.navigate(6);
  }

  onRange(range: { start: string; end: string }): void {
    this.rangeStart.set(range.start);
    this.rangeEnd.set(range.end);
  }

  exportConfig(): void {
    const body = JSON.stringify({ guides: this.guides(), tooltips: this.tooltips(), prompts: this.prompts(), audiences: this.audiences() }, null, 2);
    this.download(body, 'onboarding-config.json', 'application/json');
  }

  onExportMenu(item: { value: string }): void {
    if (item.value === 'csv') this.exportGuidesCsv();
  }

  exportGuidesCsv(): void {
    const rows = [['id', 'name', 'surface', 'status', 'audience', 'starts', 'completions', 'completion_pct'], ...this.guides().map((g) => [g.id, g.name, g.surface, g.status, g.audienceId, g.starts, g.completions, this.completionRate(g)])];
    this.download(rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n'), 'guides.csv', 'text/csv');
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
    this.notify('Import skipped', 'Demo only — export is available from Overview.');
  }

  saveSettings(): void {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.notifyEmail().trim())) {
      this.error.set('Enter a valid email for the weekly digest.');
      return;
    }
    this.error.set('');
    this.notify('Settings saved', `Default audience: ${this.audiences().find((a) => a.id === this.defaultAudience())?.name ?? ''}.`);
  }

  onProfile(item: { value: string }): void {
    if (item.value === 'mine') this.globalSearch('Meera');
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
