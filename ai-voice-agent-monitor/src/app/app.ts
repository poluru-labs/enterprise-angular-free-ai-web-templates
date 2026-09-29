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

type CallStatus = 'Active' | 'On hold' | 'Completed' | 'Escalated';
type Sentiment = 'Positive' | 'Neutral' | 'Negative' | 'Frustrated';
type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

interface TranscriptTurn {
  speaker: 'Agent' | 'Caller';
  text: string;
  offsetSec: number;
}

interface VoiceCall {
  id: string;
  caller: string;
  line: string;
  queue: string;
  status: CallStatus;
  sentiment: Sentiment;
  latencyMs: number;
  durationSec: number;
  region: string;
  supervisor?: string;
  escalationReason?: string;
  transcript: TranscriptTurn[];
}

interface Escalation {
  id: string;
  callId: string;
  reason: string;
  supervisor: string;
  opened: string;
  status: 'Open' | 'Resolved';
}

const SAMPLE_TRANSCRIPT: TranscriptTurn[] = [
  { speaker: 'Agent', text: 'Thanks for calling Poluru support. How can I help today?', offsetSec: 0 },
  { speaker: 'Caller', text: 'My shipment was supposed to arrive yesterday.', offsetSec: 8 },
  { speaker: 'Agent', text: 'I can look that up. May I have your order number?', offsetSec: 18 },
  { speaker: 'Caller', text: '10482. This is the third time I have called.', offsetSec: 28 },
];

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
  readonly Math = Math;
  readonly nav = [
    { label: 'Overview' },
    { label: 'Live calls' },
    { label: 'Transcripts' },
    { label: 'Sentiment' },
    { label: 'Latency' },
    { label: 'Escalations' },
    { label: 'Queues' },
    { label: 'Team' },
    { label: 'Settings' },
  ];
  readonly pages = this.nav.map((n) => n.label);
  readonly headings = [
    {
      eyebrow: 'VOICE OPS',
      title: 'Voice Agent Monitor',
      summary: 'Live monitoring of voice calls with transcripts, sentiment, latency, and escalation tracking.',
    },
    { eyebrow: 'LIVE', title: 'Live calls', summary: 'Active sessions with real-time latency and queue placement.' },
    { eyebrow: 'TEXT', title: 'Transcripts', summary: 'Turn-by-turn conversation with speaker labels and timestamps.' },
    { eyebrow: 'MOOD', title: 'Sentiment', summary: 'Rolling sentiment scores and frustration signals per call.' },
    { eyebrow: 'PERF', title: 'Latency', summary: 'Round-trip voice latency against SLA targets.' },
    { eyebrow: 'ESCALATE', title: 'Escalations', summary: 'Supervisor handoffs and resolution status.' },
    { eyebrow: 'ROUTING', title: 'Queues', summary: 'Inbound lines and wait-time by queue.' },
    { eyebrow: 'PEOPLE', title: 'Team', summary: 'Supervisors and floor leads on voice duty.' },
    { eyebrow: 'WORKSPACE', title: 'Settings', summary: 'Alerts, retention, and export defaults.' },
  ];
  readonly team = [
    { name: 'Isha Poluru', role: 'Voice ops lead' },
    { name: 'Jatin Poluru', role: 'Supervisor' },
    { name: 'Keerthi Poluru', role: 'Quality analyst' },
    { name: 'Lokesh Poluru', role: 'Routing admin' },
    { name: 'Maya Poluru', role: 'On-call SRE' },
  ];
  readonly helpAccordion = [
    { heading: 'Latency', content: 'Round-trip time from caller audio to agent playback. SLA target is 320 ms p95.', open: true },
    { heading: 'Escalations', content: 'Supervisor joins the bridge when sentiment drops or the caller requests a human.', open: false },
    { heading: 'Transcripts', content: 'Streaming text is delayed ~2 s for redaction. Demo data is static.', open: false },
  ];
  readonly queueNav = [
    { label: 'Active', description: 'Live' },
    { label: 'On hold', description: 'Paused' },
    { label: 'Escalated', description: 'Supervisor' },
    { label: 'Completed', description: 'Today' },
  ];
  readonly callColumns = [
    { key: 'id', label: 'Call' },
    { key: 'caller', label: 'Caller' },
    { key: 'queue', label: 'Queue' },
    { key: 'status', label: 'Status' },
    { key: 'latencyMs', label: 'Latency (ms)' },
    { key: 'sentiment', label: 'Sentiment' },
  ];
  readonly escColumns = [
    { key: 'id', label: 'Ticket' },
    { key: 'callId', label: 'Call' },
    { key: 'reason', label: 'Reason' },
    { key: 'supervisor', label: 'Supervisor' },
    { key: 'status', label: 'Status' },
  ];
  readonly teamColumns = [
    { key: 'name', label: 'Member' },
    { key: 'role', label: 'Role' },
    { key: 'calls', label: 'Calls today' },
    { key: 'escalations', label: 'Escalations' },
    { key: 'avgLatency', label: 'Avg latency (ms)' },
  ];
  readonly latencyBuckets = [
    { label: '< 200 ms', count: 42 },
    { label: '200–320 ms', count: 88 },
    { label: '320–500 ms', count: 24 },
    { label: '> 500 ms', count: 6 },
  ];
  readonly weeklyCalls = [420, 445, 460, 438, 502, 488, 515];
  readonly frustrationSignals = [
    { label: 'Long hold before agent' },
    { label: 'Repeated verification' },
    { label: 'Talk-over detected' },
    { label: 'Negative keyword: refund delay' },
  ];
  readonly callSteps = [{ label: 'Greeting' }, { label: 'Resolution' }, { label: 'Wrap-up' }];
  readonly lineOptions = [
    { label: 'All lines', value: 'all' },
    { label: 'Support EN', value: 'support' },
    { label: 'Sales', value: 'sales' },
  ];
  readonly sentimentBreakdown = [
    { label: 'Positive', pct: 38 },
    { label: 'Neutral', pct: 41 },
    { label: 'Negative', pct: 14 },
    { label: 'Frustrated', pct: 7 },
  ];

  readonly calls = signal<VoiceCall[]>([
    {
      id: 'call-7721',
      caller: 'Ananya Poluru',
      line: 'Support EN',
      queue: 'Billing',
      status: 'Active',
      sentiment: 'Frustrated',
      latencyMs: 412,
      durationSec: 186,
      region: 'US-West',
      transcript: SAMPLE_TRANSCRIPT,
    },
    {
      id: 'call-7720',
      caller: 'Bhuvan Poluru',
      line: 'Support EN',
      queue: 'General',
      status: 'On hold',
      sentiment: 'Neutral',
      latencyMs: 278,
      durationSec: 92,
      region: 'US-East',
      transcript: [
        { speaker: 'Agent', text: 'One moment while I verify your account.', offsetSec: 0 },
        { speaker: 'Caller', text: 'Sure.', offsetSec: 6 },
      ],
    },
    {
      id: 'call-7718',
      caller: 'Chitra Poluru',
      line: 'Sales',
      queue: 'Enterprise',
      status: 'Escalated',
      sentiment: 'Negative',
      latencyMs: 356,
      durationSec: 240,
      region: 'EU',
      supervisor: 'Jatin Poluru',
      escalationReason: 'Pricing dispute — contract tier mismatch',
      transcript: SAMPLE_TRANSCRIPT,
    },
    {
      id: 'call-7715',
      caller: 'Dev Poluru',
      line: 'Support EN',
      queue: 'General',
      status: 'Completed',
      sentiment: 'Positive',
      latencyMs: 198,
      durationSec: 310,
      region: 'US-West',
      transcript: [
        { speaker: 'Agent', text: 'Your refund has been processed.', offsetSec: 0 },
        { speaker: 'Caller', text: 'Perfect, thank you!', offsetSec: 5 },
      ],
    },
  ]);

  readonly escalations = signal<Escalation[]>([
    { id: 'esc-901', callId: 'call-7718', reason: 'Pricing dispute', supervisor: 'Jatin Poluru', opened: 'Sep 28, 10:14', status: 'Open' },
    { id: 'esc-900', callId: 'call-7702', reason: 'Repeated failed verification', supervisor: 'Isha Poluru', opened: 'Sep 28, 09:02', status: 'Resolved' },
  ]);

  readonly log = signal([
    { title: 'Escalation opened', description: 'call-7718 → Jatin Poluru', timestamp: 'Sep 28, 10:14' },
    { title: 'Latency spike', description: 'US-West p95 480 ms for 6 min', timestamp: 'Sep 28, 09:55' },
    { title: 'Queue cleared', description: 'Billing wait under 30 s', timestamp: 'Sep 28, 09:30' },
  ]);

  readonly page = signal(0);
  readonly selectedCallId = signal('call-7721');
  readonly queueFilter = signal('Active');
  readonly callSearch = signal('');
  readonly lineFilter = signal('all');
  readonly callerSuggest = signal('');
  readonly rangeStart = signal('2026-09-01');
  readonly rangeEnd = signal('2026-09-28');
  readonly settingsTab = signal(0);
  readonly settingsTabs = [{ label: 'Alerts' }, { label: 'Export' }];
  readonly latencySla = signal(320);
  readonly alertEmail = signal('voice@poluru.example');
  readonly recordCalls = signal(true);
  readonly modal = signal<'escalate' | null>(null);
  readonly drawerOpen = signal(false);
  readonly search = signal('');
  readonly menuOpen = signal(false);
  readonly helpOpen = signal(false);
  readonly showIntro = signal(true);
  readonly teamSort = signal<{ key: string; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });
  readonly callPage = signal(1);
  readonly escPage = signal(1);
  readonly notice = signal('');
  readonly error = signal('');
  readonly toastOpen = signal(false);
  readonly toastTitle = signal('');
  readonly toastBody = signal('');
  readonly treeSelected = signal('billing');

  readonly treeItems = [
    {
      id: 'root',
      label: 'Queues',
      children: [
        { id: 'billing', label: 'Billing' },
        { id: 'general', label: 'General' },
        { id: 'enterprise', label: 'Enterprise' },
      ],
    },
  ];

  readonly breadcrumbs = computed(() => [{ label: 'Poluru Labs' }, { label: this.pages[this.page()] }]);
  readonly activeCount = computed(() => this.calls().filter((c) => c.status === 'Active' || c.status === 'On hold').length);
  readonly escalatedCount = computed(() => this.calls().filter((c) => c.status === 'Escalated').length);
  readonly openEscalations = computed(() => this.escalations().filter((e) => e.status === 'Open').length);
  readonly avgLatency = computed(() => {
    const list = this.calls();
    return list.length ? Math.round(list.reduce((s, c) => s + c.latencyMs, 0) / list.length) : 0;
  });
  readonly weeklyMax = computed(() => Math.max(...this.weeklyCalls, 1));
  readonly latencyMax = computed(() => Math.max(...this.latencyBuckets.map((b) => b.count), 1));
  readonly recentLog = computed(() => this.log().map((i) => ({ ...i, status: 'complete' as const })));

  readonly selectedCall = computed(() => this.calls().find((c) => c.id === this.selectedCallId()) ?? this.calls()[0]);

  readonly filteredCalls = computed(() => {
    const q = this.callSearch().trim().toLowerCase();
    const queue = this.queueFilter();
    return this.calls().filter((c) => {
      const matchQueue =
        queue === 'Active'
          ? c.status === 'Active'
          : queue === 'On hold'
            ? c.status === 'On hold'
            : queue === 'Escalated'
              ? c.status === 'Escalated'
              : c.status === 'Completed';
      const matchQ = !q || `${c.id} ${c.caller} ${c.queue}`.toLowerCase().includes(q);
      return matchQueue && matchQ;
    });
  });

  readonly sideNavItems = computed(() =>
    this.queueNav.map((item) => ({
      ...item,
      active: item.label === this.queueFilter(),
    })),
  );

  readonly callTableRows = computed(() =>
    this.calls().map((c) => ({
      id: c.id,
      caller: c.caller,
      queue: c.queue,
      status: c.status,
      latencyMs: c.latencyMs,
      sentiment: c.sentiment,
    })),
  );

  readonly escRows = computed(() =>
    this.escalations().map((e) => ({
      id: e.id,
      callId: e.callId,
      reason: e.reason,
      supervisor: e.supervisor,
      status: e.status,
    })),
  );

  readonly callerSuggestions = computed(() => this.calls().map((c) => c.caller));

  jumpToCaller(name: string): void {
    this.callerSuggest.set(name);
    const call = this.calls().find((c) => c.caller === name);
    if (call) this.selectCall(call.id);
  }

  readonly callDetailMeta = computed(() => {
    const c = this.selectedCall();
    return [
      { term: 'Line', description: c.line },
      { term: 'Queue', description: c.queue },
      { term: 'Region', description: c.region },
      { term: 'Duration', description: `${c.durationSec}s` },
      { term: 'Supervisor', description: c.supervisor ?? '—' },
    ];
  });

  readonly transcriptSnippet = computed(() =>
    this.selectedCall()
      .transcript.map((t) => `[${t.offsetSec}s] ${t.speaker}: ${t.text}`)
      .join('\n'),
  );

  readonly teamRows = computed(() => {
    const { key, direction } = this.teamSort();
    return this.team
      .map((member, i) => ({
        ...member,
        calls: 12 + i * 3,
        escalations: member.name === 'Jatin Poluru' ? 4 : 1,
        avgLatency: 240 + i * 15,
      }))
      .sort((a, b) => {
        const av = a[key as keyof typeof a];
        const bv = b[key as keyof typeof b];
        const cmp = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv));
        return direction === 'asc' ? cmp : -cmp;
      });
  });

  readonly queueStats = computed(() => [
    { name: 'Billing', waiting: 3, active: 2, sla: '32s' },
    { name: 'General', waiting: 1, active: 4, sla: '18s' },
    { name: 'Enterprise', waiting: 0, active: 1, sla: '45s' },
  ]);

  tone(value: string): Tone {
    const map: Record<string, Tone> = {
      Active: 'success',
      'On hold': 'info',
      Completed: 'neutral',
      Escalated: 'warning',
      Positive: 'success',
      Neutral: 'neutral',
      Negative: 'danger',
      Frustrated: 'warning',
      Open: 'warning',
      Resolved: 'success',
    };
    return map[value] ?? 'brand';
  }

  statusVariant(status: string): 'success' | 'warning' | 'danger' | 'info' | 'neutral' {
    const map: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
      Active: 'success',
      'On hold': 'info',
      Escalated: 'warning',
      Completed: 'neutral',
    };
    return map[status] ?? 'neutral';
  }

  latencyClass(ms: number): string {
    return ms > this.latencySla() ? 'warn' : '';
  }

  navigate(page: number): void {
    this.page.set(page);
    this.error.set('');
  }

  selectCall(id: string): void {
    if (this.calls().some((c) => c.id === id)) this.selectedCallId.set(id);
  }

  onQueueNav(event: { label: string }): void {
    this.queueFilter.set(event.label);
  }

  onTreeSelect(id: string): void {
    this.treeSelected.set(id);
  }

  globalSearch(value: string): void {
    this.search.set(value);
    this.callSearch.set(value);
    if (value.trim()) this.navigate(1);
  }

  openEscalate(): void {
    this.modal.set('escalate');
  }

  confirmEscalate(): void {
    const id = this.selectedCallId();
    this.calls.update((list) =>
      list.map((c) =>
        c.id === id
          ? { ...c, status: 'Escalated' as CallStatus, supervisor: 'Jatin Poluru', escalationReason: 'Supervisor requested from monitor' }
          : c,
      ),
    );
    this.escalations.update((list) => [
      { id: `esc-${900 + list.length}`, callId: id, reason: 'Supervisor requested', supervisor: 'Jatin Poluru', opened: 'Just now', status: 'Open' },
      ...list,
    ]);
    this.closeModal();
    this.notify('Escalation created', id);
  }

  resolveEscalation(id: string): void {
    this.escalations.update((list) => list.map((e) => (e.id === id ? { ...e, status: 'Resolved' as const } : e)));
    this.notify('Escalation resolved', id);
  }

  endCallDemo(): void {
    const id = this.selectedCallId();
    this.calls.update((list) => list.map((c) => (c.id === id && c.status !== 'Completed' ? { ...c, status: 'Completed' as CallStatus } : c)));
    this.notify('Call marked completed', id);
  }

  onRange(range: { start: string; end: string }): void {
    this.rangeStart.set(range.start);
    this.rangeEnd.set(range.end);
  }

  exportCalls(): void {
    this.download(JSON.stringify({ calls: this.calls(), escalations: this.escalations() }, null, 2), 'voice-calls.json', 'application/json');
  }

  onExportMenu(item: { value: string }): void {
    if (item.value === 'transcript') this.download(this.transcriptSnippet(), 'transcript.txt', 'text/plain');
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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.alertEmail().trim())) {
      this.error.set('Enter a valid email.');
      return;
    }
    this.error.set('');
    this.notify('Settings saved', `SLA ${this.latencySla()} ms`);
  }

  onProfile(item: { value: string }): void {
    if (item.value === 'mine') this.globalSearch('Isha');
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
