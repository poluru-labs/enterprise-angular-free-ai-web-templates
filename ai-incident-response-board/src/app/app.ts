import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, computed, inject, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
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

type Sev = 'SEV1' | 'SEV2' | 'SEV3' | 'SEV4';
type Kind = 'Model failure' | 'Hallucination' | 'SLA breach' | 'Degradation';
type Status = 'Open' | 'Acknowledged' | 'Mitigating' | 'Resolved';
type Pm = 'Not needed' | 'Needed' | 'Draft' | 'Published';
type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
type StepState = 'pending' | 'running' | 'done';

interface Incident {
  id: string; title: string; kind: Kind; sev: Sev; service: string; status: Status; commander: string; responders: string[];
  openedAt: number; ackAt: number | null; resolvedAt: number | null; impact: number; description: string;
  pm: Pm; rootCause: string; factors: string[]; actions: { text: string; done: boolean }[]; pmSummary: string; runbookRating: number;
  escalated: boolean; files: string[];
}
interface Report {
  id: string; service: string; reporter: string; question: string; answer: string; problem: string; at: number;
  incident: string | null; status: 'New' | 'Linked' | 'Dismissed';
}
interface Step { text: string; auto: boolean; effect?: 'fallback' | 'rollback' | 'contain' | 'page' | 'status' | 'scale'; }
interface Runbook { id: string; name: string; kind: Kind; steps: Step[]; uses: number; }
interface Run { runbookId: string; states: StepState[]; }
interface Event { incident: string; at: number; title: string; detail: string; }
interface Draft { title: string; kind: Kind; sev: Sev; service: string; commander: string; impact: number; description: string; }
interface Rule { id: string; name: string; enabled: boolean; }

const DAY_START = 590;

@Component({
  selector: 'app-root',
  imports: [
    NgTemplateOutlet, EdsAccordionComponent, EdsAlertComponent, EdsAutocompleteComponent, EdsAvatarComponent, EdsBadgeComponent,
    EdsBreadcrumbComponent, EdsButtonComponent, EdsButtonGroupComponent, EdsCardComponent, EdsCheckboxComponent, EdsCircularProgressComponent,
    EdsCodeSnippetComponent, EdsComboboxComponent, EdsDataTableComponent, EdsDatePickerComponent, EdsDateRangePickerComponent,
    EdsDescriptionListComponent, EdsDividerComponent, EdsDrawerComponent, EdsDropdownMenuComponent, EdsEmptyStateComponent,
    EdsFileUploadComponent, EdsIconComponent, EdsInputComponent, EdsKbdComponent, EdsLinkComponent, EdsListComponent, EdsMenuItemComponent,
    EdsMeterComponent, EdsModalComponent, EdsNumberInputComponent, EdsPaginationComponent, EdsPopoverComponent, EdsProgressBarComponent,
    EdsRadioComponent, EdsRadioGroupComponent, EdsRatingComponent, EdsSearchComponent, EdsSegmentedControlComponent, EdsSelectComponent,
    EdsSideNavComponent, EdsSkeletonComponent, EdsSliderComponent, EdsSpinnerComponent, EdsSplitButtonComponent, EdsStatComponent,
    EdsStatusComponent, EdsStepperComponent, EdsSwitchComponent, EdsTabsComponent, EdsTagComponent, EdsTextareaComponent,
    EdsTimePickerComponent, EdsTimelineComponent, EdsToastComponent, EdsToolbarComponent, EdsTooltipComponent, EdsTreeViewComponent,
    EdsVisuallyHiddenComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly Math = Math;
  readonly pages = ['Board', 'Incidents', 'Reports', 'Runbooks', 'SLAs', 'On-call', 'Postmortems', 'Team', 'Settings'];
  readonly headings = [
    { eyebrow: 'RESPONSE', title: 'AI Incident Response Board', summary: 'Triage model failures, hallucination reports, and SLA breaches with runbook automation.' },
    { eyebrow: 'RESPONSE', title: 'Incidents', summary: 'Everything open and recently resolved, with its clock, owner, and timeline.' },
    { eyebrow: 'INTAKE', title: 'Hallucination reports', summary: 'Wrong answers reported by users. Link them to an incident or open a new one.' },
    { eyebrow: 'AUTOMATION', title: 'Runbooks', summary: 'Repeatable response steps. Automated steps run on their own; manual steps wait for a person.' },
    { eyebrow: 'COMMITMENTS', title: 'Service levels', summary: 'Targets for acknowledging and resolving incidents, and how well we meet them.' },
    { eyebrow: 'PEOPLE', title: 'On-call', summary: 'Who gets paged this week, and what happens when nobody answers.' },
    { eyebrow: 'LEARNING', title: 'Postmortems', summary: 'Write up what happened, why, and what we will change.' },
    { eyebrow: 'PEOPLE', title: 'Team', summary: 'Responders and their recent load.' },
    { eyebrow: 'WORKSPACE', title: 'Settings', summary: 'Notifications, quiet hours, and defaults.' },
  ];
  readonly services = ['Support assistant', 'Search answers', 'Email drafts', 'Summaries API'];
  readonly kinds: Kind[] = ['Model failure', 'Hallucination', 'SLA breach', 'Degradation'];
  readonly sevs: Sev[] = ['SEV1', 'SEV2', 'SEV3', 'SEV4'];
  readonly statuses: Status[] = ['Open', 'Acknowledged', 'Mitigating', 'Resolved'];
  readonly team = [
    { name: 'Meera Poluru', role: 'Incident lead' },
    { name: 'Arjun Poluru', role: 'Platform engineer' },
    { name: 'Lavanya Poluru', role: 'ML engineer' },
    { name: 'Kiran Poluru', role: 'Support operations' },
    { name: 'Pooja Poluru', role: 'Content quality' },
    { name: 'Ravi Poluru', role: 'Platform engineer' },
  ];
  readonly teamNames = this.team.map((member) => member.name);
  readonly factorOptions = ['Stale index', 'Missing eval coverage', 'Provider outage', 'Bad deploy', 'Alert too quiet', 'No fallback configured', 'Prompt change', 'Traffic spike'];
  readonly rootCauses = ['Provider outage', 'Bad deploy', 'Stale knowledge source', 'Prompt regression', 'Capacity', 'Unknown'].map((value) => ({ label: value, value }));

  readonly now = signal(0);
  readonly live = signal(true);
  readonly targets = signal<Record<Sev, { ack: number; resolve: number }>>({
    SEV1: { ack: 5, resolve: 60 }, SEV2: { ack: 15, resolve: 240 }, SEV3: { ack: 60, resolve: 1440 }, SEV4: { ack: 240, resolve: 4320 },
  });

  readonly incidents = signal<Incident[]>([
    this.inc('INC-2041', 'Support assistant returning empty replies', 'Model failure', 'SEV1', 'Support assistant', 'Open', '', -3, null, null, 38, 'Roughly a third of chats get a blank reply since 09:46. Error rate on the primary model endpoint is climbing.'),
    this.inc('INC-2040', 'Search answers cite a discontinued refund policy', 'Hallucination', 'SEV2', 'Search answers', 'Acknowledged', 'Meera Poluru', -52, -41, null, 6, 'Answers quote a 14-day refund window. The policy changed to 30 days on Sep 1.'),
    this.inc('INC-2039', 'Summaries API p95 latency above 4 s', 'SLA breach', 'SEV2', 'Summaries API', 'Mitigating', 'Arjun Poluru', -190, -182, null, 14, 'p95 latency has been over the 2 s contract for three hours. Partner batch jobs are timing out.'),
    this.inc('INC-2038', 'Email drafts invent order numbers', 'Hallucination', 'SEV3', 'Email drafts', 'Open', '', -35, null, null, 2, 'Drafts include order numbers that do not exist when the customer did not provide one.'),
    this.inc('INC-2037', 'Answer quality down 8 points on billing questions', 'Degradation', 'SEV3', 'Support assistant', 'Acknowledged', 'Lavanya Poluru', -300, -250, null, 9, 'Weekly quality sample shows a drop limited to billing topics after Thursday’s prompt change.'),
    this.inc('INC-2036', 'Timeouts from primary model provider', 'Model failure', 'SEV1', 'Search answers', 'Resolved', 'Meera Poluru', -1500, -1497, -1452, 0, 'Provider outage in one region. Traffic moved to the fallback model.', 'Draft'),
    this.inc('INC-2035', 'Support first response over target', 'SLA breach', 'SEV2', 'Support assistant', 'Resolved', 'Kiran Poluru', -2900, -2880, -2600, 0, 'Queue backed up after a capacity change; first responses averaged 9 minutes.', 'Needed'),
    this.inc('INC-2034', 'Wrong office hours for the Chennai branch', 'Hallucination', 'SEV4', 'Search answers', 'Resolved', 'Pooja Poluru', -4300, -4200, -3100, 0, 'Knowledge article had last year’s hours.', 'Not needed'),
    this.inc('INC-2033', 'Bad deploy of email-drafts v7.2', 'Model failure', 'SEV2', 'Email drafts', 'Resolved', 'Ravi Poluru', -5800, -5790, -5700, 0, 'New prompt template dropped the signature block and closing line.', 'Published'),
  ]);

  readonly reports = signal<Report[]>([
    { id: 'RPT-918', service: 'Search answers', reporter: 'Anita Poluru', question: 'How long do I have to return an item?', answer: 'You can request a refund within 14 days…', problem: 'Policy is 30 days now', at: -6, incident: null, status: 'New' },
    { id: 'RPT-917', service: 'Email drafts', reporter: 'Venkat Poluru', question: 'Draft a reply about my late order', answer: '…your order #A-55821 has shipped…', problem: 'That order number does not exist', at: -9, incident: null, status: 'New' },
    { id: 'RPT-916', service: 'Search answers', reporter: 'Deepa Poluru', question: 'refund window', answer: 'Refunds are accepted within 14 days of purchase.', problem: 'Outdated refund policy', at: -14, incident: null, status: 'New' },
    { id: 'RPT-915', service: 'Support assistant', reporter: 'Suresh Poluru', question: 'Can I export reports to Slack?', answer: 'Yes, open Reports → Schedule → Slack.', problem: 'This feature does not exist', at: -22, incident: null, status: 'New' },
    { id: 'RPT-914', service: 'Email drafts', reporter: 'Harini Poluru', question: 'Follow up on my refund', answer: '…regarding order #B-10442…', problem: 'Made-up order number', at: -31, incident: null, status: 'New' },
    { id: 'RPT-913', service: 'Search answers', reporter: 'Naveen Poluru', question: 'return policy for electronics', answer: 'Electronics can be returned within 14 days.', problem: 'Wrong number of days', at: -40, incident: 'INC-2040', status: 'Linked' },
    { id: 'RPT-912', service: 'Summaries API', reporter: 'Latha Poluru', question: 'Summarise the attached contract', answer: 'The contract renews annually…', problem: 'Summary mentions a clause that is not in the document', at: -65, incident: null, status: 'New' },
    { id: 'RPT-911', service: 'Search answers', reporter: 'Mohan Poluru', question: 'is shipping free', answer: 'Shipping is always free.', problem: 'Only over $50', at: -90, incident: null, status: 'New' },
    { id: 'RPT-910', service: 'Support assistant', reporter: 'Usha Poluru', question: 'What are your support hours?', answer: 'We are open 24/7.', problem: 'Support is 8am–8pm', at: -120, incident: null, status: 'Dismissed' },
  ]);

  readonly runbooks = signal<Runbook[]>([
    { id: 'rb-fallback', name: 'Switch to fallback model', kind: 'Model failure', uses: 14, steps: [
      { text: 'Page the on-call primary', auto: true, effect: 'page' },
      { text: 'Route traffic to the fallback model', auto: true, effect: 'fallback' },
      { text: 'Confirm replies look normal in the live sample', auto: false },
      { text: 'Post a status page update', auto: true, effect: 'status' },
      { text: 'Open a ticket with the model provider', auto: false },
    ] },
    { id: 'rb-rollback', name: 'Roll back the last deploy', kind: 'Model failure', uses: 9, steps: [
      { text: 'Page the on-call primary', auto: true, effect: 'page' },
      { text: 'Roll back to the previous prompt and model version', auto: true, effect: 'rollback' },
      { text: 'Check the error rate is under 1%', auto: false },
      { text: 'Post a status page update', auto: true, effect: 'status' },
    ] },
    { id: 'rb-contain', name: 'Contain a wrong answer', kind: 'Hallucination', uses: 21, steps: [
      { text: 'Turn on strict citation mode for the service', auto: true, effect: 'contain' },
      { text: 'Remove the stale source from the search index', auto: true, effect: 'contain' },
      { text: 'Review 20 recent answers on the topic', auto: false },
      { text: 'Add the corrected fact to the knowledge base', auto: false },
      { text: 'Email the people who reported it', auto: true, effect: 'status' },
    ] },
    { id: 'rb-latency', name: 'Shed load and scale', kind: 'SLA breach', uses: 6, steps: [
      { text: 'Turn on the response cache', auto: true, effect: 'contain' },
      { text: 'Add two nodes to the serving pool', auto: true, effect: 'scale' },
      { text: 'Check p95 latency is under 2 s', auto: false },
      { text: 'Post a status page update', auto: true, effect: 'status' },
    ] },
    { id: 'rb-quality', name: 'Investigate a quality drop', kind: 'Degradation', uses: 4, steps: [
      { text: 'Compare the last two prompt versions on the eval set', auto: true, effect: 'contain' },
      { text: 'Read 30 low-scoring answers', auto: false },
      { text: 'Revert or fix the prompt', auto: false },
    ] },
  ]);
  readonly runs = signal<Record<string, Run>>({
    'INC-2039': { runbookId: 'rb-latency', states: ['done', 'done', 'pending', 'pending'] },
  });
  readonly rules = signal<Rule[]>([
    { id: 'auto-fallback', name: 'Run “Switch to fallback model” when a SEV1 model failure opens', enabled: true },
    { id: 'reports-sev2', name: 'Raise a hallucination to SEV2 once 10 reports are linked', enabled: true },
    { id: 'page-secondary', name: 'Page the secondary if a SEV1 is not acknowledged within its target', enabled: true },
    { id: 'status-page', name: 'Post a status page update when a SEV1 or SEV2 opens', enabled: false },
  ]);
  readonly events = signal<Event[]>([
    { incident: 'INC-2041', at: -3, title: 'Opened by alert', detail: 'Empty-reply rate above 20% for 3 minutes' },
    { incident: 'INC-2040', at: -52, title: 'Opened from reports', detail: '3 reports about refund policy' },
    { incident: 'INC-2040', at: -41, title: 'Acknowledged', detail: 'Meera Poluru is commander' },
    { incident: 'INC-2039', at: -190, title: 'Opened by alert', detail: 'p95 latency 4.3 s' },
    { incident: 'INC-2039', at: -182, title: 'Acknowledged', detail: 'Arjun Poluru is commander' },
    { incident: 'INC-2039', at: -170, title: 'Runbook step done', detail: 'Turn on the response cache' },
    { incident: 'INC-2039', at: -160, title: 'Runbook step done', detail: 'Add two nodes to the serving pool' },
    { incident: 'INC-2038', at: -35, title: 'Opened from reports', detail: '2 reports about invented order numbers' },
    { incident: 'INC-2037', at: -300, title: 'Opened by quality check', detail: 'Billing topic score 71 → 63' },
    { incident: 'INC-2036', at: -1452, title: 'Resolved', detail: 'Provider recovered; traffic moved back' },
  ]);

  readonly rotation = signal([
    { day: 'Mon Sep 28', primary: 'Meera Poluru', secondary: 'Arjun Poluru' },
    { day: 'Tue Sep 29', primary: 'Meera Poluru', secondary: 'Arjun Poluru' },
    { day: 'Wed Sep 30', primary: 'Lavanya Poluru', secondary: 'Ravi Poluru' },
    { day: 'Thu Oct 1', primary: 'Lavanya Poluru', secondary: 'Ravi Poluru' },
    { day: 'Fri Oct 2', primary: 'Arjun Poluru', secondary: 'Kiran Poluru' },
    { day: 'Sat Oct 3', primary: 'Ravi Poluru', secondary: 'Meera Poluru' },
    { day: 'Sun Oct 4', primary: 'Ravi Poluru', secondary: 'Meera Poluru' },
  ]);
  readonly escalation = [
    { heading: 'Level 1 · Primary on-call', content: 'Paged immediately by phone and push. Has the acknowledgement target to respond.', open: true },
    { heading: 'Level 2 · Secondary on-call', content: 'Paged if the primary has not acknowledged within the target for the severity.' },
    { heading: 'Level 3 · Incident lead', content: 'Meera Poluru is paged for any SEV1 still unacknowledged 10 minutes after opening.' },
  ];

  readonly page = signal(0);
  readonly selectedId = signal('INC-2041');
  readonly incidentTab = signal(0);
  readonly sevFilter = signal('open');
  readonly search = signal('');
  readonly listPage = signal(1);
  readonly reportFilter = signal('New');
  readonly checkedReports = signal<Record<string, boolean>>({});
  readonly linkTarget = signal('INC-2040');
  readonly selectedRunbookId = signal('rb-fallback');
  readonly runbookLoading = signal(false);
  readonly runTarget = signal('INC-2041');
  readonly update = signal('');
  readonly pmId = signal('INC-2035');
  readonly newAction = signal('');
  readonly newFactor = signal('');
  readonly rangeStart = signal('2026-09-01');
  readonly rangeEnd = signal('2026-09-28');
  readonly modal = signal<'new' | 'resolve' | 'override' | null>(null);
  readonly draft = signal<Draft>({ title: '', kind: 'Model failure', sev: 'SEV2', service: 'Support assistant', commander: 'Meera Poluru', impact: 5, description: '' });
  readonly resolveDraft = signal({ cause: 'Unknown', note: '', pm: true });
  readonly override = signal({ date: '2026-09-29', person: 'Kiran Poluru', slot: 'primary' });
  readonly emailOn = signal(true);
  readonly smsOn = signal(true);
  readonly email = signal('incidents@poluru.example');
  readonly quietStart = signal('22:00');
  readonly quietEnd = signal('07:00');
  readonly defaultCommander = signal('Meera Poluru');
  readonly retention = signal('365');
  readonly statusPage = signal(true);
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
  readonly serviceOptions = this.services.map((value) => ({ label: value, value }));
  readonly kindOptions = this.kinds.map((value) => ({ label: value, value }));
  readonly teamOptions = this.team.map((member) => ({ label: member.name, value: member.name }));
  readonly filterOptions = [{ label: 'Open', value: 'open' }, { label: 'SEV1', value: 'SEV1' }, { label: 'SEV2', value: 'SEV2' }, { label: 'SEV3+', value: 'low' }, { label: 'All', value: 'all' }];
  readonly reportFilterOptions = [{ label: 'New', value: 'New' }, { label: 'Linked', value: 'Linked' }, { label: 'Dismissed', value: 'Dismissed' }];
  readonly retentionOptions = [{ label: '90 days', value: '90' }, { label: '1 year', value: '365' }, { label: '3 years', value: '1095' }];
  readonly lifecycle = this.statuses.map((label) => ({ label }));
  readonly incidentTabs = [{ label: 'Timeline' }, { label: 'Runbook' }, { label: 'Reports' }];
  readonly teamColumns = [{ key: 'name', label: 'Responder' }, { key: 'role', label: 'Role' }, { key: 'commanding', label: 'Commanding' }, { key: 'handled', label: 'Handled (30 d)' }, { key: 'onCall', label: 'On-call days' }];
  readonly weekly = [3, 5, 2, 4, 1, 3];
  readonly weekLabels = ['Aug 17', 'Aug 24', 'Aug 31', 'Sep 7', 'Sep 14', 'Sep 21'];

  readonly selected = computed(() => this.incidents().find((inc) => inc.id === this.selectedId()) ?? this.incidents()[0]);
  readonly open = computed(() => this.incidents().filter((inc) => inc.status !== 'Resolved'));
  readonly openOptions = computed(() => this.open().map((inc) => ({ label: `${inc.id} · ${inc.title}`, value: inc.id })));
  readonly highSev = computed(() => this.open().filter((inc) => inc.sev === 'SEV1' || inc.sev === 'SEV2'));
  readonly breaching = computed(() => this.open().filter((inc) => this.clock(inc).breached));
  readonly board = computed(() => this.statuses.map((status) => ({
    status,
    items: this.incidents().filter((inc) => inc.status === status && (status !== 'Resolved' || this.now() - (inc.resolvedAt ?? 0) < 1600)).sort((a, b) => a.sev.localeCompare(b.sev)),
  })));
  readonly filtered = computed(() => {
    const query = this.search().trim().toLowerCase();
    const filter = this.sevFilter();
    return this.incidents().filter((inc) => {
      const ok = filter === 'all' || (filter === 'open' ? inc.status !== 'Resolved' : filter === 'low' ? inc.sev === 'SEV3' || inc.sev === 'SEV4' : inc.sev === filter);
      return ok && (!query || `${inc.id} ${inc.title} ${inc.service} ${inc.commander} ${inc.kind}`.toLowerCase().includes(query));
    });
  });
  readonly paged = computed(() => this.filtered().slice((this.listPage() - 1) * 6, this.listPage() * 6));
  readonly mtta = computed(() => this.avg(this.incidents().filter((inc) => inc.ackAt !== null).map((inc) => inc.ackAt! - inc.openedAt)));
  readonly mttr = computed(() => this.avg(this.incidents().filter((inc) => inc.resolvedAt !== null).map((inc) => inc.resolvedAt! - inc.openedAt)));
  readonly selectedMeta = computed(() => {
    const inc = this.selected();
    return [
      { term: 'Service', description: inc.service },
      { term: 'Type', description: inc.kind },
      { term: 'Commander', description: inc.commander || 'Unassigned' },
      { term: 'Opened', description: this.fmt(inc.openedAt) },
      { term: 'Acknowledged', description: inc.ackAt === null ? '—' : `${this.fmt(inc.ackAt)} (${this.dur(inc.ackAt - inc.openedAt)})` },
      { term: 'Affected requests', description: `${inc.impact}%` },
    ];
  });
  readonly selectedEvents = computed(() => this.events().filter((event) => event.incident === this.selectedId()).sort((a, b) => b.at - a.at).map((event, i) => ({ title: event.title, description: event.detail, timestamp: this.fmt(event.at), status: i === 0 && this.selected().status !== 'Resolved' ? 'current' as const : 'complete' as const })));
  readonly recentEvents = computed(() => [...this.events()].sort((a, b) => b.at - a.at).slice(0, 6).map((event) => ({ title: `${event.incident} · ${event.title}`, description: event.detail, timestamp: this.fmt(event.at), status: 'complete' as const })));
  readonly selectedReports = computed(() => this.reports().filter((report) => report.incident === this.selectedId()));
  readonly selectedRun = computed(() => this.runs()[this.selectedId()] ?? null);
  readonly runDetail = computed(() => {
    const run = this.selectedRun();
    const rb = this.runbooks().find((item) => item.id === run?.runbookId);
    if (!run || !rb) return null;
    return {
      name: rb.name,
      done: run.states.filter((state) => state === 'done').length,
      next: run.states.findIndex((state) => state !== 'done'),
      steps: rb.steps.map((step, i) => ({ ...step, state: run.states[i] })),
    };
  });
  readonly suggestedRunbook = computed(() => this.runbooks().find((rb) => rb.kind === this.selected().kind) ?? this.runbooks()[0]);

  readonly visibleReports = computed(() => this.reports().filter((report) => report.status === this.reportFilter()));
  readonly newReports = computed(() => this.reports().filter((report) => report.status === 'New'));
  readonly checkedReportIds = computed(() => Object.keys(this.checkedReports()).filter((id) => this.checkedReports()[id] && this.visibleReports().some((report) => report.id === id)));
  readonly clusters = computed(() => {
    const groups: Record<string, Report[]> = {};
    for (const report of this.newReports()) {
      const key = `${report.service}|${this.topic(report)}`;
      (groups[key] ??= []).push(report);
    }
    return Object.entries(groups).filter(([, list]) => list.length > 1).map(([key, list]) => ({ service: key.split('|')[0], topic: key.split('|')[1], ids: list.map((report) => report.id) }));
  });

  readonly selectedRunbook = computed(() => this.runbooks().find((rb) => rb.id === this.selectedRunbookId()) ?? this.runbooks()[0]);
  readonly runbookTree = computed(() => this.kinds.map((kind) => ({ id: kind, label: kind, children: this.runbooks().filter((rb) => rb.kind === kind).map((rb) => ({ id: rb.id, label: rb.name })) })).filter((node) => node.children.length));
  readonly treeExpanded: Record<string, boolean> = { 'Model failure': true, Hallucination: true, 'SLA breach': true, Degradation: true };
  readonly runbookYaml = computed(() => {
    const rb = this.selectedRunbook();
    return [`runbook: ${rb.id}`, `for: ${rb.kind.toLowerCase()}`, 'steps:', ...rb.steps.map((step) => `  - ${step.auto ? 'run' : 'ask'}: "${step.text}"`)].join('\n');
  });
  readonly activeRuns = computed(() => Object.entries(this.runs()).map(([incident, run]) => ({
    incident, run, name: this.runbooks().find((rb) => rb.id === run.runbookId)?.name ?? run.runbookId,
    done: run.states.filter((state) => state === 'done').length, total: run.states.length,
  })));

  readonly sevRows = computed(() => this.sevs.map((sev) => {
    const list = this.incidents().filter((inc) => inc.sev === sev);
    const acked = list.filter((inc) => inc.ackAt !== null);
    const ackOk = acked.filter((inc) => inc.ackAt! - inc.openedAt <= this.targets()[sev].ack).length;
    const resolved = list.filter((inc) => inc.resolvedAt !== null);
    const resOk = resolved.filter((inc) => inc.resolvedAt! - inc.openedAt <= this.targets()[sev].resolve).length;
    return { sev, count: list.length, ack: acked.length ? Math.round((ackOk / acked.length) * 100) : 100, resolve: resolved.length ? Math.round((resOk / resolved.length) * 100) : 100 };
  }));
  readonly compliance = computed(() => {
    const checks = this.incidents().flatMap((inc) => {
      const t = this.targets()[inc.sev];
      const out: boolean[] = [];
      if (inc.ackAt !== null) out.push(inc.ackAt - inc.openedAt <= t.ack);
      if (inc.resolvedAt !== null) out.push(inc.resolvedAt - inc.openedAt <= t.resolve);
      return out;
    });
    return checks.length ? Math.round((checks.filter(Boolean).length / checks.length) * 100) : 100;
  });
  readonly breaches = computed(() => this.incidents().flatMap((inc) => {
    const t = this.targets()[inc.sev];
    const out: { inc: Incident; what: string; over: number }[] = [];
    const ackTime = (inc.ackAt ?? this.now()) - inc.openedAt;
    if (ackTime > t.ack) out.push({ inc, what: inc.ackAt === null ? 'Acknowledge (still open)' : 'Acknowledge', over: ackTime - t.ack });
    const resTime = (inc.resolvedAt ?? this.now()) - inc.openedAt;
    if (resTime > t.resolve) out.push({ inc, what: inc.resolvedAt === null ? 'Resolve (still open)' : 'Resolve', over: resTime - t.resolve });
    return out;
  }));
  readonly serviceCompliance = computed(() => this.services.map((service) => {
    const list = this.incidents().filter((inc) => inc.service === service);
    const bad = this.breaches().filter((row) => row.inc.service === service).length;
    return { service, count: list.length, rate: list.length ? Math.round(Math.max(0, 1 - bad / (list.length * 2)) * 100) : 100 };
  }));
  readonly weeklyBars = computed(() => [...this.weekly, this.breaches().length]);
  readonly weeklyMax = computed(() => Math.max(...this.weeklyBars(), 1));

  readonly onCallNow = computed(() => this.rotation()[0]);
  readonly rotationRows = computed(() => this.rotation());

  readonly pmList = computed(() => this.incidents().filter((inc) => inc.status === 'Resolved'));
  readonly pmIncident = computed(() => this.incidents().find((inc) => inc.id === this.pmId()) ?? this.pmList()[0]);
  readonly pmDone = computed(() => {
    const actions = this.pmIncident()?.actions ?? [];
    return actions.length ? Math.round((actions.filter((action) => action.done).length / actions.length) * 100) : 0;
  });

  readonly teamRows = computed(() => {
    const { key, direction } = this.teamSort();
    return this.team.map((member) => ({
      ...member,
      commanding: this.open().filter((inc) => inc.commander === member.name).length,
      handled: this.incidents().filter((inc) => inc.commander === member.name || inc.responders.includes(member.name)).length + 3,
      onCall: this.rotation().filter((day) => day.primary === member.name || day.secondary === member.name).length,
    })).sort((a, b) => {
      const av = a[key as keyof typeof a];
      const bv = b[key as keyof typeof b];
      const cmp = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv));
      return direction === 'asc' ? cmp : -cmp;
    });
  });
  readonly sidebarList = computed(() => this.highSev().map((inc) => ({ label: `${inc.sev} · ${inc.id}`, description: this.clock(inc).label, selected: inc.id === this.selectedId() })));

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const timer = setInterval(() => this.live() && this.tick(), 4000);
      destroyRef.onDestroy(() => clearInterval(timer));
    });
  }

  inc(id: string, title: string, kind: Kind, sev: Sev, service: string, status: Status, commander: string, openedAt: number, ackAt: number | null, resolvedAt: number | null, impact: number, description: string, pm: Pm = 'Not needed'): Incident {
    return {
      id, title, kind, sev, service, status, commander, responders: commander ? [commander] : [], openedAt, ackAt, resolvedAt, impact, description,
      pm, rootCause: pm === 'Not needed' ? '' : id === 'INC-2036' ? 'Provider outage' : 'Capacity', factors: pm === 'Needed' ? ['Alert too quiet'] : pm === 'Draft' ? ['Provider outage', 'No fallback configured'] : [],
      actions: pm === 'Draft' ? [{ text: 'Make fallback routing automatic for SEV1', done: true }, { text: 'Add a second provider region', done: false }] : pm === 'Needed' ? [{ text: 'Alert on queue depth, not only latency', done: false }] : [],
      pmSummary: pm === 'Draft' ? 'The primary provider timed out in one region for 48 minutes. We switched to the fallback model by hand after 20 minutes.' : '',
      runbookRating: pm === 'Draft' ? 4 : 0, escalated: false, files: [],
    };
  }

  fmt(minute: number): string {
    const abs = DAY_START + minute;
    const dayOffset = Math.floor(abs / 1440);
    const within = ((abs % 1440) + 1440) % 1440;
    const time = `${String(Math.floor(within / 60)).padStart(2, '0')}:${String(within % 60).padStart(2, '0')}`;
    return dayOffset === 0 ? time : `Sep ${28 + dayOffset} ${time}`;
  }

  dur(minutes: number): string {
    const m = Math.max(0, Math.round(minutes));
    if (m < 60) return `${m}m`;
    if (m < 1440) return `${Math.floor(m / 60)}h ${m % 60}m`;
    return `${Math.floor(m / 1440)}d ${Math.floor((m % 1440) / 60)}h`;
  }

  avg(values: number[]): string {
    return values.length ? this.dur(values.reduce((sum, value) => sum + value, 0) / values.length) : '—';
  }

  clock(inc: Incident): { label: string; used: number; target: number; breached: boolean; phase: string } {
    const t = this.targets()[inc.sev];
    if (inc.status === 'Resolved') return { label: `Resolved in ${this.dur((inc.resolvedAt ?? 0) - inc.openedAt)}`, used: 1, target: 1, breached: false, phase: 'Done' };
    const phase = inc.ackAt === null ? 'Acknowledge' : 'Resolve';
    const target = inc.ackAt === null ? t.ack : t.resolve;
    const used = this.now() - inc.openedAt;
    const left = target - used;
    return { label: left >= 0 ? `${this.dur(left)} to ${phase.toLowerCase()}` : `${phase} target missed by ${this.dur(-left)}`, used: Math.min(used, target), target, breached: left < 0, phase };
  }

  sevTone(sev: Sev): Tone {
    return sev === 'SEV1' ? 'danger' : sev === 'SEV2' ? 'warning' : sev === 'SEV3' ? 'info' : 'neutral';
  }

  statusTone(status: string): Tone {
    const map: Record<string, Tone> = { Open: 'danger', Acknowledged: 'warning', Mitigating: 'info', Resolved: 'success', Needed: 'warning', Draft: 'info', Published: 'success', 'Not needed': 'neutral' };
    return map[status] ?? 'neutral';
  }

  topic(report: Report): string {
    const text = `${report.question} ${report.problem}`.toLowerCase();
    if (/order/.test(text)) return 'Order numbers';
    if (/refund|return/.test(text)) return 'Refunds and returns';
    if (/ship/.test(text)) return 'Shipping';
    if (/feature|slack|export/.test(text)) return 'Features';
    return 'Other';
  }

  tick(): void {
    this.now.update((value) => value + 1);
    if (!this.rules().find((rule) => rule.id === 'page-secondary')?.enabled) return;
    for (const inc of this.open()) {
      if (inc.sev === 'SEV1' && inc.ackAt === null && !inc.escalated && this.now() - inc.openedAt > this.targets().SEV1.ack) {
        const secondary = this.onCallNow().secondary;
        this.patch(inc.id, { escalated: true, responders: [...new Set([...inc.responders, secondary])] });
        this.addEvent(inc.id, 'Escalated', `Not acknowledged in ${this.targets().SEV1.ack}m — paged ${secondary}`);
        this.notify('Escalated', `${inc.id} paged ${secondary}.`);
      }
    }
  }

  patch(id: string, change: Partial<Incident>): void {
    this.incidents.update((list) => list.map((inc) => (inc.id === id ? { ...inc, ...change } : inc)));
  }

  addEvent(incident: string, title: string, detail: string): void {
    this.events.update((list) => [...list, { incident, at: this.now(), title, detail }]);
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

  openIncident(id: string, tab = 0): void {
    this.selectedId.set(id);
    this.incidentTab.set(tab);
    this.navigate(1);
    if (!this.filtered().some((inc) => inc.id === id)) this.sevFilter.set('all');
  }

  onSidebarList(event: { index: number }): void {
    const inc = this.highSev()[event.index];
    if (inc) this.openIncident(inc.id);
  }

  globalSearch(value: string): void {
    this.search.set(value);
    this.sevFilter.set('all');
    this.listPage.set(1);
    if (value.trim()) this.navigate(1);
  }

  acknowledge(id = this.selectedId()): void {
    const inc = this.incidents().find((item) => item.id === id);
    if (!inc || inc.ackAt !== null) return;
    const commander = inc.commander || this.defaultCommander();
    this.patch(id, { status: 'Acknowledged', ackAt: this.now(), commander, responders: [...new Set([...inc.responders, commander])] });
    this.addEvent(id, 'Acknowledged', `${commander} is commander`);
    this.notify('Acknowledged', `${id} · ${commander}`);
  }

  advance(inc: Incident): void {
    if (inc.status === 'Open') this.acknowledge(inc.id);
    else if (inc.status === 'Acknowledged') {
      this.patch(inc.id, { status: 'Mitigating' });
      this.addEvent(inc.id, 'Mitigating', 'Mitigation under way');
    } else if (inc.status === 'Mitigating') this.openResolve(inc.id);
  }

  setCommander(value: string): void {
    const inc = this.selected();
    this.patch(inc.id, { commander: value, responders: [...new Set([...inc.responders, value])] });
    this.addEvent(inc.id, 'Commander changed', value);
  }

  changeSev(delta: number): void {
    const inc = this.selected();
    const index = Math.min(3, Math.max(0, this.sevs.indexOf(inc.sev) + delta));
    const sev = this.sevs[index];
    if (sev === inc.sev) return;
    this.patch(inc.id, { sev });
    this.addEvent(inc.id, delta < 0 ? 'Severity raised' : 'Severity lowered', `${inc.sev} → ${sev}`);
    this.notify(delta < 0 ? 'Severity raised' : 'Severity lowered', `${inc.id} is now ${sev}.`);
  }

  onSevMenu(item: { value: string }): void {
    this.changeSev(item.value === 'up' ? -1 : 1);
  }

  postUpdate(): void {
    const text = this.update().trim();
    if (text.length < 5) {
      this.error.set('Write at least a short sentence for the update.');
      return;
    }
    this.addEvent(this.selectedId(), 'Update from Meera Poluru', text);
    this.update.set('');
    this.error.set('');
    this.notify('Update posted', this.selectedId());
  }

  onFiles(detail: { files: File[] }): void {
    const names = detail.files.map((file) => file.name);
    if (!names.length) return;
    this.patch(this.selectedId(), { files: [...this.selected().files, ...names] });
    this.addEvent(this.selectedId(), 'Attached files', names.join(', '));
  }

  startRunbook(incidentId: string, runbookId: string): void {
    const rb = this.runbooks().find((item) => item.id === runbookId);
    const inc = this.incidents().find((item) => item.id === incidentId);
    if (!rb || !inc) return;
    if (inc.status === 'Resolved') {
      this.error.set('That incident is already resolved.');
      return;
    }
    if (this.runs()[incidentId] && this.runs()[incidentId].states.some((state) => state !== 'done')) {
      this.error.set(`${incidentId} already has a runbook in progress.`);
      return;
    }
    this.error.set('');
    this.runs.update((map) => ({ ...map, [incidentId]: { runbookId, states: rb.steps.map(() => 'pending' as StepState) } }));
    this.runbooks.update((list) => list.map((item) => (item.id === runbookId ? { ...item, uses: item.uses + 1 } : item)));
    this.addEvent(incidentId, 'Runbook started', rb.name);
    this.continueRun(incidentId);
  }

  continueRun(incidentId: string): void {
    const run = this.runs()[incidentId];
    const rb = this.runbooks().find((item) => item.id === run?.runbookId);
    if (!run || !rb) return;
    const index = run.states.findIndex((state) => state !== 'done');
    if (index < 0) {
      this.addEvent(incidentId, 'Runbook finished', rb.name);
      this.notify('Runbook finished', `${rb.name} on ${incidentId}`);
      return;
    }
    const step = rb.steps[index];
    if (!step.auto) return;
    this.setStep(incidentId, index, 'running');
    setTimeout(() => {
      this.applyEffect(incidentId, step);
      this.setStep(incidentId, index, 'done');
      this.addEvent(incidentId, 'Automated step done', step.text);
      this.continueRun(incidentId);
    }, 1100);
  }

  completeManual(incidentId: string, index: number): void {
    const rb = this.runbooks().find((item) => item.id === this.runs()[incidentId]?.runbookId);
    this.setStep(incidentId, index, 'done');
    this.addEvent(incidentId, 'Step confirmed by Meera Poluru', rb?.steps[index].text ?? '');
    this.continueRun(incidentId);
  }

  setStep(incidentId: string, index: number, state: StepState): void {
    this.runs.update((map) => {
      const run = map[incidentId];
      return run ? { ...map, [incidentId]: { ...run, states: run.states.map((value, i) => (i === index ? state : value)) } } : map;
    });
  }

  applyEffect(incidentId: string, step: Step): void {
    const inc = this.incidents().find((item) => item.id === incidentId);
    if (!inc) return;
    const mitigate = (impact: number) => ({ impact, status: (inc.status === 'Open' || inc.status === 'Acknowledged' ? 'Mitigating' : inc.status) as Status, ackAt: inc.ackAt ?? this.now(), commander: inc.commander || this.defaultCommander() });
    if (step.effect === 'fallback') this.patch(incidentId, mitigate(Math.round(inc.impact * 0.1)));
    else if (step.effect === 'rollback') this.patch(incidentId, mitigate(0));
    else if (step.effect === 'contain' || step.effect === 'scale') this.patch(incidentId, { impact: Math.round(inc.impact * 0.5) });
    else if (step.effect === 'page') this.patch(incidentId, { responders: [...new Set([...inc.responders, this.onCallNow().primary])] });
  }

  stepIcon(state: StepState, auto: boolean): string {
    return state === 'done' ? '✓' : auto ? '⚙' : '●';
  }

  openResolve(id = this.selectedId()): void {
    this.selectedId.set(id);
    const inc = this.selected();
    this.resolveDraft.set({ cause: 'Unknown', note: '', pm: inc.sev === 'SEV1' || inc.sev === 'SEV2' });
    this.error.set('');
    this.modal.set('resolve');
  }

  confirmResolve(): void {
    const draft = this.resolveDraft();
    const inc = this.selected();
    if (draft.note.trim().length < 10) {
      this.error.set('Describe the fix in a sentence or two (at least 10 characters).');
      return;
    }
    if ((inc.sev === 'SEV1' || inc.sev === 'SEV2') && !draft.pm) {
      this.error.set('SEV1 and SEV2 incidents always need a postmortem.');
      return;
    }
    this.patch(inc.id, { status: 'Resolved', resolvedAt: this.now(), ackAt: inc.ackAt ?? this.now(), impact: 0, rootCause: draft.cause, pm: draft.pm ? 'Needed' : 'Not needed' });
    this.addEvent(inc.id, 'Resolved', draft.note.trim());
    this.closeModal();
    this.notify('Incident resolved', `${inc.id} in ${this.dur(this.now() - inc.openedAt)}.`);
  }

  openNew(fromReports: Report[] = []): void {
    const first = fromReports[0];
    this.draft.set({
      title: first ? `${first.service}: wrong answers about ${this.topic(first).toLowerCase()}` : '',
      kind: first ? 'Hallucination' : 'Model failure', sev: first ? (fromReports.length >= 3 ? 'SEV2' : 'SEV3') : 'SEV2',
      service: first?.service ?? 'Support assistant', commander: this.defaultCommander(), impact: first ? 2 : 5,
      description: fromReports.map((report) => `${report.id}: “${report.answer}” — ${report.problem}`).join('\n'),
    });
    this.pendingReports = fromReports.map((report) => report.id);
    this.error.set('');
    this.modal.set('new');
  }

  pendingReports: string[] = [];

  patchDraft(change: Partial<Draft>): void {
    this.draft.update((draft) => ({ ...draft, ...change }));
    this.error.set('');
  }

  setDraftSev(value: string): void {
    if (this.sevs.includes(value as Sev)) this.patchDraft({ sev: value as Sev });
  }

  setDraftKind(value: string): void {
    if (this.kinds.includes(value as Kind)) this.patchDraft({ kind: value as Kind });
  }

  createIncident(): void {
    const draft = this.draft();
    if (draft.title.trim().length < 8) {
      this.error.set('Give the incident a clear title (at least 8 characters).');
      return;
    }
    const id = `INC-${2042 + this.incidents().length - 9}`;
    const inc = this.inc(id, draft.title.trim(), draft.kind, draft.sev, draft.service, 'Open', draft.commander, this.now(), null, null, draft.impact, draft.description.trim());
    this.incidents.update((list) => [inc, ...list]);
    this.addEvent(id, 'Declared by Meera Poluru', `${draft.sev} · ${draft.kind}`);
    if (this.pendingReports.length) this.linkReports(this.pendingReports, id);
    this.pendingReports = [];
    this.closeModal();
    this.openIncident(id);
    this.notify('Incident declared', `${id} · ${draft.sev}`);
    if (this.rules().find((rule) => rule.id === 'status-page')?.enabled && (draft.sev === 'SEV1' || draft.sev === 'SEV2')) this.addEvent(id, 'Status page updated', 'Investigating');
    if (draft.sev === 'SEV1' && draft.kind === 'Model failure' && this.rules().find((rule) => rule.id === 'auto-fallback')?.enabled) {
      this.incidentTab.set(1);
      this.startRunbook(id, 'rb-fallback');
    }
  }

  linkReports(ids: string[], incidentId: string): void {
    this.reports.update((list) => list.map((report) => (ids.includes(report.id) ? { ...report, incident: incidentId, status: 'Linked' as const } : report)));
    this.addEvent(incidentId, 'Reports linked', ids.join(', '));
    const inc = this.incidents().find((item) => item.id === incidentId);
    const count = this.reports().filter((report) => report.incident === incidentId).length;
    if (inc && inc.kind === 'Hallucination' && count >= 10 && (inc.sev === 'SEV3' || inc.sev === 'SEV4') && this.rules().find((rule) => rule.id === 'reports-sev2')?.enabled) {
      this.patch(incidentId, { sev: 'SEV2' });
      this.addEvent(incidentId, 'Severity raised by rule', `${count} linked reports`);
    }
  }

  linkChecked(): void {
    const ids = this.checkedReportIds();
    if (!ids.length) return;
    if (!this.open().some((inc) => inc.id === this.linkTarget())) {
      this.error.set('Pick an open incident to link to.');
      return;
    }
    this.linkReports(ids, this.linkTarget());
    this.checkedReports.set({});
    this.notify('Reports linked', `${ids.length} to ${this.linkTarget()}.`);
  }

  dismissChecked(): void {
    const ids = this.checkedReportIds();
    this.reports.update((list) => list.map((report) => (ids.includes(report.id) ? { ...report, status: 'Dismissed' as const } : report)));
    this.checkedReports.set({});
    this.notify('Dismissed', `${ids.length} report(s).`);
  }

  selectCluster(ids: string[]): void {
    this.reportFilter.set('New');
    this.checkedReports.set(Object.fromEntries(ids.map((id) => [id, true])));
  }

  newFromChecked(): void {
    const ids = this.checkedReportIds();
    this.openNew(this.reports().filter((report) => ids.includes(report.id)));
  }

  toggleReport(id: string, value: boolean): void {
    this.checkedReports.update((map) => ({ ...map, [id]: value }));
  }

  selectRunbook(id: string): void {
    if (!this.runbooks().some((rb) => rb.id === id)) return;
    this.runbookLoading.set(true);
    this.selectedRunbookId.set(id);
    setTimeout(() => this.runbookLoading.set(false), 350);
  }

  toggleRule(id: string, enabled: boolean): void {
    this.rules.update((list) => list.map((rule) => (rule.id === id ? { ...rule, enabled } : rule)));
  }

  setTarget(sev: Sev, key: 'ack' | 'resolve', value: number): void {
    this.targets.update((map) => ({ ...map, [sev]: { ...map[sev], [key]: value } }));
  }

  onRange(range: { start: string; end: string }): void {
    this.rangeStart.set(range.start);
    this.rangeEnd.set(range.end);
  }

  openOverride(): void {
    this.override.set({ date: '2026-09-29', person: 'Kiran Poluru', slot: 'primary' });
    this.error.set('');
    this.modal.set('override');
  }

  saveOverride(): void {
    const { date, person, slot } = this.override();
    const day = new Date(`${date}T12:00:00`);
    const label = `${day.toLocaleDateString('en-US', { weekday: 'short' })} ${day.toLocaleDateString('en-US', { month: 'short' })} ${day.getDate()}`;
    const row = this.rotation().find((item) => item.day === label);
    if (!row) {
      this.error.set('Pick a date in this week (Sep 28 – Oct 4).');
      return;
    }
    const other = slot === 'primary' ? row.secondary : row.primary;
    if (other === person) {
      this.error.set(`${person} is already ${slot === 'primary' ? 'secondary' : 'primary'} that day.`);
      return;
    }
    this.rotation.update((list) => list.map((item) => (item.day === label ? { ...item, [slot]: person } : item)));
    this.closeModal();
    this.notify('Override saved', `${person} is ${slot} on ${label}.`);
  }

  patchPm(change: Partial<Incident>): void {
    const inc = this.pmIncident();
    if (inc) this.patch(inc.id, { ...change, pm: change.pm ?? (inc.pm === 'Needed' ? 'Draft' : inc.pm) });
  }

  addFactor(value: string): void {
    const inc = this.pmIncident();
    const factor = value.trim();
    if (!inc || !factor || inc.factors.includes(factor)) return;
    this.patchPm({ factors: [...inc.factors, factor] });
    this.newFactor.set('');
  }

  removeFactor(factor: string): void {
    const inc = this.pmIncident();
    if (inc) this.patchPm({ factors: inc.factors.filter((item) => item !== factor) });
  }

  addAction(): void {
    const inc = this.pmIncident();
    const text = this.newAction().trim();
    if (!inc || text.length < 5) {
      this.error.set('Describe the action item in a few words.');
      return;
    }
    this.patchPm({ actions: [...inc.actions, { text, done: false }] });
    this.newAction.set('');
    this.error.set('');
  }

  toggleAction(index: number, done: boolean): void {
    const inc = this.pmIncident();
    if (inc) this.patchPm({ actions: inc.actions.map((action, i) => (i === index ? { ...action, done } : action)) });
  }

  publishPm(): void {
    const inc = this.pmIncident();
    if (!inc) return;
    if (inc.pmSummary.trim().length < 30) return this.error.set('Write a summary of at least 30 characters before publishing.');
    if (!inc.actions.length) return this.error.set('Add at least one action item.');
    this.error.set('');
    this.patch(inc.id, { pm: 'Published' });
    this.notify('Postmortem published', inc.id);
  }

  saveSettings(): void {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email().trim())) {
      this.error.set('Enter a valid email address.');
      return;
    }
    this.error.set('');
    this.notify('Settings saved', `Quiet hours ${this.quietStart()}–${this.quietEnd()} (SEV1 still pages).`);
  }

  exportCsv(): void {
    const rows = [['id', 'severity', 'type', 'service', 'status', 'commander', 'opened', 'acknowledged', 'resolved', 'impact_pct'], ...this.incidents().map((inc) => [inc.id, inc.sev, inc.kind, inc.service, inc.status, inc.commander, this.fmt(inc.openedAt), inc.ackAt === null ? '' : this.fmt(inc.ackAt), inc.resolvedAt === null ? '' : this.fmt(inc.resolvedAt), inc.impact])];
    this.download(rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n'), 'incidents.csv', 'text/csv');
  }

  onExportMenu(item: { value: string }): void {
    if (item.value === 'timeline') {
      const lines = this.selectedEvents().map((event) => `${event.timestamp}  ${event.title} — ${event.description}`).reverse();
      this.download(`${this.selected().id} ${this.selected().title}\n\n${lines.join('\n')}`, `${this.selected().id}-timeline.txt`, 'text/plain');
    }
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

  onProfile(item: { value: string }): void {
    if (item.value === 'mine') this.globalSearch('Meera');
    else this.navigate(item.value === 'oncall' ? 5 : 8);
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
