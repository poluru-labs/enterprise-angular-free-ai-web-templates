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
  EdsRatingComponent,
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

type PersonaStatus = 'Draft' | 'Published' | 'Archived';
type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

interface ToneProfile {
  formality: number;
  warmth: number;
  brevity: number;
  playfulness: number;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

interface SampleThread {
  id: string;
  title: string;
  messages: ChatMessage[];
}

interface PersonaVersion {
  id: string;
  label: string;
  published: string;
  author: string;
  notes: string;
}

interface Persona {
  id: string;
  name: string;
  status: PersonaStatus;
  channel: string;
  owner: string;
  updated: string;
  version: string;
  tone: ToneProfile;
  instructions: string;
  greeting: string;
  versions: PersonaVersion[];
  samples: SampleThread[];
}

interface ChannelRow {
  channel: string;
  personaId: string;
  traffic: string;
  locale: string;
}

const CHANNELS = ['Support widget', 'Sales assistant', 'Internal copilot', 'Mobile app'];

@Component({
  selector: 'app-root',
  imports: [
    NgTemplateOutlet,
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
    EdsRatingComponent,
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
  readonly Math = Math;
  readonly channels = CHANNELS;
  readonly channelOptions = CHANNELS.map((c) => ({ label: c, value: c }));
  readonly pages = ['Overview', 'Personas', 'Tone studio', 'Versions', 'Samples', 'Preview', 'Channels', 'Team', 'Settings'];
  readonly headings = [
    { eyebrow: 'VOICE', title: 'Persona & Tone Builder', summary: 'Design, preview, and version chatbot personas with tone sliders and sample conversations.' },
    { eyebrow: 'LIBRARY', title: 'Personas', summary: 'Named voice profiles used across channels and locales.' },
    { eyebrow: 'TUNING', title: 'Tone studio', summary: 'Sliders and instructions that shape how the bot sounds.' },
    { eyebrow: 'HISTORY', title: 'Versions', summary: 'Published snapshots with notes for rollback and comparison.' },
    { eyebrow: 'EXAMPLES', title: 'Sample conversations', summary: 'Fixed threads used to regression-test tone changes.' },
    { eyebrow: 'TRY IT', title: 'Preview', summary: 'Send a message and see a demo reply using the current sliders.' },
    { eyebrow: 'ROUTING', title: 'Channels', summary: 'Which persona is live on each surface.' },
    { eyebrow: 'PEOPLE', title: 'Team', summary: 'Writers and reviewers who own personas.' },
    { eyebrow: 'WORKSPACE', title: 'Settings', summary: 'Export, review cadence, and defaults.' },
  ];
  readonly team = [
    { name: 'Aisha Poluru', role: 'Content design lead' },
    { name: 'Benjamin Poluru', role: 'Conversation designer' },
    { name: 'Chitra Poluru', role: 'Localization' },
    { name: 'Deepak Poluru', role: 'Product manager' },
    { name: 'Elena Poluru', role: 'Quality reviewer' },
  ];
  readonly helpAccordion = [
    { heading: 'Tone sliders', content: 'Sliders are relative weights. The model still follows hard rules in the instruction block.', open: true },
    { heading: 'Samples vs preview', content: 'Samples are saved transcripts for regression. Preview is a one-off message with demo output only.', open: false },
    { heading: 'Publishing', content: 'Publishing creates an immutable version. Channels can pin to a version or follow latest published.', open: false },
  ];
  readonly channelColumns = [
    { key: 'channel', label: 'Channel' },
    { key: 'persona', label: 'Persona' },
    { key: 'traffic', label: 'Traffic split' },
    { key: 'locale', label: 'Locales' },
  ];
  readonly teamColumns = [
    { key: 'name', label: 'Member' },
    { key: 'role', label: 'Role' },
    { key: 'personas', label: 'Personas owned' },
    { key: 'published', label: 'Versions shipped' },
    { key: 'reviews', label: 'Reviews this month' },
  ];
  readonly treeExpanded: Record<string, boolean> = Object.fromEntries(CHANNELS.map((c) => [c, true]));

  readonly personas = signal<Persona[]>([
    this.makePersona(
      'p-support',
      'Support — calm & clear',
      'Published',
      'Support widget',
      'Aisha Poluru',
      'Sep 28',
      '2.3.0',
      { formality: 55, warmth: 78, brevity: 70, playfulness: 15 },
      'You are a patient support agent for Poluru Labs. Use plain language. Never invent account details.',
      'Hi — I’m here to help with your workspace. What are you trying to do?',
      [
        { id: 'v23', label: '2.3.0', published: 'Sep 28', author: 'Aisha Poluru', notes: 'Warmer greeting, shorter paragraphs' },
        { id: 'v22', label: '2.2.0', published: 'Sep 12', author: 'Benjamin Poluru', notes: 'Added escalation wording' },
      ],
      [
        {
          id: 's1',
          title: 'Password reset',
          messages: [
            { role: 'user', text: 'I forgot my password.' },
            { role: 'assistant', text: 'No problem — open Settings → Security and choose Send reset link. The email usually arrives within two minutes.' },
          ],
        },
        {
          id: 's2',
          title: 'Billing question',
          messages: [
            { role: 'user', text: 'Why was I charged twice?' },
            { role: 'assistant', text: 'I can help you check. Duplicate charges are often a pending authorization. Share the invoice date and last four digits of the card and I’ll walk through the ledger.' },
          ],
        },
      ],
    ),
    this.makePersona(
      'p-sales',
      'Sales — upbeat guide',
      'Published',
      'Sales assistant',
      'Deepak Poluru',
      'Sep 25',
      '1.4.0',
      { formality: 40, warmth: 65, brevity: 50, playfulness: 45 },
      'You help prospects compare Poluru plans. Be enthusiastic but accurate. Offer a demo when appropriate.',
      'Welcome! Want a quick tour of what teams like yours ship with Poluru?',
      [{ id: 'v14', label: '1.4.0', published: 'Sep 25', author: 'Deepak Poluru', notes: 'Enterprise tier messaging' }],
      [
        {
          id: 's3',
          title: 'Plan comparison',
          messages: [
            { role: 'user', text: 'Pro vs Enterprise?' },
            { role: 'assistant', text: 'Pro includes shared workspaces and standard SSO. Enterprise adds dedicated support, custom retention, and advanced audit logs — happy to map that to your checklist.' },
          ],
        },
      ],
    ),
    this.makePersona(
      'p-internal',
      'Internal copilot — direct',
      'Draft',
      'Internal copilot',
      'Benjamin Poluru',
      'Sep 27',
      '0.9.0',
      { formality: 70, warmth: 35, brevity: 85, playfulness: 10 },
      'Answer engineers concisely. Cite internal doc IDs when possible. No marketing language.',
      'Ask about runbooks, dashboards, or release notes.',
      [],
      [
        {
          id: 's4',
          title: 'Deploy question',
          messages: [
            { role: 'user', text: 'How do I roll back assistant v3?' },
            { role: 'assistant', text: 'Use release gates board → Promote → select previous manifest weights@sha-7c02. Page Omar Poluru if the gate is blocked.' },
          ],
        },
      ],
    ),
  ]);

  readonly channelMap = signal<ChannelRow[]>([
    { channel: 'Support widget', personaId: 'p-support', traffic: '100%', locale: 'en-US' },
    { channel: 'Sales assistant', personaId: 'p-sales', traffic: '100%', locale: 'en-US' },
    { channel: 'Internal copilot', personaId: 'p-internal', traffic: 'Staging only', locale: 'en-US' },
    { channel: 'Mobile app', personaId: 'p-support', traffic: '80% / 20% experiment', locale: 'en-US, es-MX' },
  ]);

  readonly log = signal([
    { title: 'Published Support 2.3.0', description: 'Aisha Poluru · Support widget', timestamp: 'Sep 28, 10:00' },
    { title: 'Sample thread updated', description: 'Billing question copy tightened', timestamp: 'Sep 27, 15:22' },
    { title: 'Draft saved', description: 'Internal copilot — Benjamin Poluru', timestamp: 'Sep 27, 09:10' },
  ]);

  readonly page = signal(0);
  readonly selectedPersonaId = signal('p-support');
  readonly selectedSampleId = signal('s1');
  readonly selectedVersionId = signal('v23');
  readonly personaFilter = signal('all');
  readonly personaSearch = signal('');
  readonly personaPage = signal(1);
  readonly previewInput = signal('');
  readonly previewMessages = signal<ChatMessage[]>([]);
  readonly rangeStart = signal('2026-09-01');
  readonly rangeEnd = signal('2026-09-28');
  readonly settingsTab = signal(0);
  readonly settingsTabs = [{ label: 'Defaults' }, { label: 'Export' }];
  readonly modal = signal<'publish' | null>(null);
  readonly publishNotes = signal('');
  readonly notifyEmail = signal('personas@poluru.example');
  readonly digestTime = signal('17:00');
  readonly minReviewScore = signal(4);
  readonly autoSave = signal(true);
  readonly previewLocale = signal('en-US');
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
  readonly personaOptions = computed(() => this.personas().map((p) => ({ label: p.name, value: p.id })));

  readonly drafts = computed(() => this.personas().filter((p) => p.status === 'Draft'));
  readonly sidebarList = computed(() =>
    this.drafts().map((p) => ({ label: p.name, description: `${p.channel} · draft`, selected: p.id === this.selectedPersonaId() })),
  );
  readonly publishedCount = computed(() => this.personas().filter((p) => p.status === 'Published').length);
  readonly totalVersions = computed(() => this.personas().reduce((sum, p) => sum + p.versions.length, 0));
  readonly avgWarmth = computed(() => {
    const list = this.personas();
    return list.length ? Math.round(list.reduce((sum, p) => sum + p.tone.warmth, 0) / list.length) : 0;
  });

  readonly selectedPersona = computed(() => this.personas().find((p) => p.id === this.selectedPersonaId()) ?? this.personas()[0]);
  readonly filteredPersonas = computed(() => {
    const q = this.personaSearch().trim().toLowerCase();
    const f = this.personaFilter();
    return this.personas().filter((p) => (f === 'all' || p.status === f || p.channel === f) && (!q || `${p.name} ${p.channel} ${p.owner}`.toLowerCase().includes(q)));
  });
  readonly pagedPersonas = computed(() => this.filteredPersonas().slice((this.personaPage() - 1) * 5, this.personaPage() * 5));
  readonly personaMeta = computed(() => {
    const p = this.selectedPersona();
    return [
      { term: 'Channel', description: p.channel },
      { term: 'Status', description: p.status },
      { term: 'Version', description: p.version },
      { term: 'Owner', description: p.owner },
      { term: 'Updated', description: p.updated },
      { term: 'Samples', description: String(p.samples.length) },
    ];
  });
  readonly personaSnippet = computed(() => {
    const p = this.selectedPersona();
    return ['persona:', `  name: ${p.name}`, `  tone:`, `    formality: ${p.tone.formality}`, `    warmth: ${p.tone.warmth}`, `  instructions: |`, ...p.instructions.split('\n').map((line) => `    ${line}`)].join('\n');
  });
  readonly selectedSample = computed(() => {
    const p = this.selectedPersona();
    return p.samples.find((s) => s.id === this.selectedSampleId()) ?? p.samples[0] ?? null;
  });
  readonly selectedVersion = computed(() => {
    const p = this.selectedPersona();
    return p.versions.find((v) => v.id === this.selectedVersionId()) ?? p.versions[0] ?? null;
  });
  readonly personaTree = computed(() =>
    this.channels.map((channel) => ({
      id: channel,
      label: channel,
      children: this.personas()
        .filter((p) => p.channel === channel)
        .map((p) => ({ id: p.id, label: p.name })),
    })),
  );
  readonly channelTableRows = computed(() =>
    this.channelMap().map((row) => ({
      channel: row.channel,
      persona: this.personaName(row.personaId),
      traffic: row.traffic,
      locale: row.locale,
    })),
  );
  readonly weeklyPublishes = [2, 1, 3, 2, 4, 1, 2];
  readonly weeklyMax = computed(() => Math.max(...this.weeklyPublishes, 1));
  readonly recentLog = computed(() => this.log().map((item) => ({ ...item, status: 'complete' as const })));
  readonly toneBalance = computed(() => {
    const t = this.selectedPersona().tone;
    return Math.round((t.formality + t.warmth + t.brevity + (100 - t.playfulness)) / 4);
  });
  readonly versionDetailItems = computed(() => {
    const ver = this.selectedVersion();
    return ver
      ? [
          { term: 'Version', description: ver.label },
          { term: 'Author', description: ver.author },
          { term: 'Notes', description: ver.notes },
        ]
      : [];
  });

  readonly publishModalItems = computed(() => [
    { term: 'Persona', description: this.selectedPersona().name },
    { term: 'Next version', description: this.nextVersionLabel() },
    { term: 'Channel', description: this.selectedPersona().channel },
  ]);

  readonly teamRows = computed(() => {
    const { key, direction } = this.teamSort();
    return this.team
      .map((member) => {
        const personas = this.personas().filter((p) => p.owner === member.name).length;
        const published = this.personas()
          .flatMap((p) => p.versions)
          .filter((v) => v.author === member.name).length;
        const reviews = member.name === 'Elena Poluru' ? 14 : member.name === 'Aisha Poluru' ? 9 : 4;
        return { ...member, personas, published, reviews };
      })
      .sort((a, b) => {
        const av = a[key as keyof typeof a];
        const bv = b[key as keyof typeof b];
        const cmp = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv));
        return direction === 'asc' ? cmp : -cmp;
      });
  });

  makePersona(
    id: string,
    name: string,
    status: PersonaStatus,
    channel: string,
    owner: string,
    updated: string,
    version: string,
    tone: ToneProfile,
    instructions: string,
    greeting: string,
    versions: PersonaVersion[],
    samples: SampleThread[],
  ): Persona {
    return { id, name, status, channel, owner, updated, version, tone, instructions, greeting, versions, samples };
  }

  personaName(id: string): string {
    return this.personas().find((p) => p.id === id)?.name ?? id;
  }

  personaToneBalance(p: Persona): number {
    const t = p.tone;
    return Math.round((t.formality + t.warmth + t.brevity + (100 - t.playfulness)) / 4);
  }

  nextVersionLabel(): string {
    const v = this.selectedPersona().version;
    const parts = v.split('.').map(Number);
    if (parts.length === 3) parts[2] += 1;
    return parts.join('.');
  }

  tone(status: string): Tone {
    const map: Record<string, Tone> = { Draft: 'neutral', Published: 'success', Archived: 'warning' };
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
    const p = this.drafts()[event.index];
    if (p) {
      this.selectedPersonaId.set(p.id);
      this.navigate(2);
    }
  }

  globalSearch(value: string): void {
    this.search.set(value);
    this.personaSearch.set(value);
    if (value.trim()) this.navigate(1);
  }

  selectPersona(id: string): void {
    if (this.personas().some((p) => p.id === id)) {
      this.selectedPersonaId.set(id);
      const p = this.personas().find((x) => x.id === id)!;
      if (p.samples[0]) this.selectedSampleId.set(p.samples[0].id);
      if (p.versions[0]) this.selectedVersionId.set(p.versions[0].id);
    }
  }

  patchTone(change: Partial<ToneProfile>): void {
    const id = this.selectedPersonaId();
    this.personas.update((list) =>
      list.map((p) => (p.id === id ? { ...p, tone: { ...p.tone, ...change }, updated: 'Today' } : p)),
    );
  }

  patchInstructions(value: string): void {
    const id = this.selectedPersonaId();
    this.personas.update((list) => list.map((p) => (p.id === id ? { ...p, instructions: value, updated: 'Today' } : p)));
  }

  patchGreeting(value: string): void {
    const id = this.selectedPersonaId();
    this.personas.update((list) => list.map((p) => (p.id === id ? { ...p, greeting: value, updated: 'Today' } : p)));
  }

  openPublish(): void {
    this.publishNotes.set('');
    this.error.set('');
    this.modal.set('publish');
  }

  confirmPublish(): void {
    const p = this.selectedPersona();
    if (p.instructions.trim().length < 20) {
      this.error.set('Instructions should be at least 20 characters before publishing.');
      return;
    }
    const label = this.nextVersionLabel();
    const ver: PersonaVersion = {
      id: `v-${Date.now()}`,
      label,
      published: 'Just now',
      author: 'Aisha Poluru',
      notes: this.publishNotes().trim() || 'Published from tone studio',
    };
    this.personas.update((list) =>
      list.map((persona) =>
        persona.id === p.id
          ? { ...persona, status: 'Published' as PersonaStatus, version: label, versions: [ver, ...persona.versions], updated: 'Today' }
          : persona,
      ),
    );
    this.selectedVersionId.set(ver.id);
    this.log.update((list) => [{ title: `Published ${p.name} ${label}`, description: p.channel, timestamp: 'Just now' }, ...list]);
    this.closeModal();
    this.notify('Version published', label);
  }

  sendPreview(): void {
    const text = this.previewInput().trim();
    if (text.length < 2) {
      this.error.set('Type a short message to preview.');
      return;
    }
    this.error.set('');
    const p = this.selectedPersona();
    const warm = p.tone.warmth > 60;
    const brief = p.tone.brevity > 65;
    const reply = warm
      ? brief
        ? `Thanks for reaching out! ${p.greeting.split('.')[0]}.`
        : `Thanks for your message. ${p.greeting} (Demo reply — warmth ${p.tone.warmth}.)`
      : `Acknowledged. ${brief ? 'Steps:' : 'Here is a direct answer based on your persona settings.'} [demo]`;
    this.previewMessages.update((msgs) => [...msgs, { role: 'user', text }, { role: 'assistant', text: reply }]);
    this.previewInput.set('');
  }

  resetPreview(): void {
    const p = this.selectedPersona();
    this.previewMessages.set([{ role: 'assistant', text: p.greeting }]);
  }

  onRange(range: { start: string; end: string }): void {
    this.rangeStart.set(range.start);
    this.rangeEnd.set(range.end);
  }

  exportPersonas(): void {
    this.download(JSON.stringify({ personas: this.personas(), channels: this.channelMap() }, null, 2), 'personas.json', 'application/json');
  }

  onExportMenu(item: { value: string }): void {
    if (item.value === 'yaml') this.download(this.personaSnippet(), 'persona.yaml', 'text/yaml');
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
    this.notify('Import skipped', 'Demo only — export from Overview or Settings.');
  }

  saveSettings(): void {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.notifyEmail().trim())) {
      this.error.set('Enter a valid email for review reminders.');
      return;
    }
    this.error.set('');
    this.notify('Settings saved', `Min review score: ${this.minReviewScore()}/5`);
  }

  onProfile(item: { value: string }): void {
    if (item.value === 'mine') this.globalSearch('Aisha');
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
