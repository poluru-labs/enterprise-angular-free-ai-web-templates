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
  EdsDateRangePickerComponent,
  EdsDescriptionListComponent,
  EdsDividerComponent,
  EdsDrawerComponent,
  EdsDropdownMenuComponent,
  EdsEmptyStateComponent,
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

type Rating = 'up' | 'down';
type Status = 'New' | 'Triaged' | 'Routed' | 'Dismissed';
type Queue = 'retraining' | 'prompt';
type Severity = 'Low' | 'Medium' | 'High';
type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

interface Feedback {
  id: string;
  rating: Rating;
  surface: string;
  customer: string;
  comment: string;
  question: string;
  answer: string;
  promptVersion: string;
  hoursAgo: number;
  tags: string[];
  status: Status;
  queue: Queue | null;
  assignee: string;
  severity: Severity;
  note: string;
  correction: string;
}

interface Tag { name: string; group: string; variant: Tone; keywords: string[]; }

interface Rule {
  id: string;
  name: string;
  rating: 'any' | Rating;
  tag: string;
  surface: string;
  target: Queue;
  enabled: boolean;
}

interface Batch { id: string; queue: Queue; name: string; items: number; format: string; created: string; by: string; }

const RAW: [Rating, string, string, string, string, string, string, number][] = [
  ['down', 'Support chat', 'Meera Poluru', 'This is wrong, the refund window is 30 days not 14.', 'How long do I have to request a refund?', 'You can request a refund within 14 days of purchase.', 'support-v12', 1],
  ['down', 'Support chat', 'Arjun Poluru', 'Way too long, I just wanted a yes or no.', 'Can I change my plan mid-month?', 'Yes. Plan changes are prorated. When you upgrade, the difference is charged immediately and your next invoice reflects the new plan. When you downgrade, credit is applied to future invoices. Some add-ons are not prorated and…', 'support-v12', 2],
  ['up', 'Help search', 'Lavanya Poluru', 'Exactly what I needed, thanks!', 'reset two-factor', 'Go to Settings → Security → Two-factor and choose Reset. You will need your backup code.', 'search-v4', 2],
  ['down', 'Email drafts', 'Kiran Poluru', 'Tone is cold and robotic for a customer apology.', 'Draft an apology for the delayed shipment.', 'We acknowledge the delay in your shipment. The order will arrive at a later date.', 'email-v7', 3],
  ['down', 'Help search', 'Pooja Poluru', 'Outdated — that menu no longer exists after the redesign.', 'where are invoice settings', 'Open Billing → Legacy invoices → Settings.', 'search-v4', 4],
  ['up', 'Meeting notes', 'Suresh Poluru', 'Great summary, action items were perfect.', 'Summarize the weekly sync.', '• Launch moved to Oct 20\n• Rahul owns payment testing\n• FAQ due Oct 13', 'notes-v3', 5],
  ['down', 'Support chat', 'Anita Poluru', 'It didn’t mention the fee for international transfers. Incomplete.', 'Are there fees for transfers?', 'Domestic transfers are free.', 'support-v12', 5],
  ['down', 'Meeting notes', 'Ravi Poluru', 'The formatting is a mess, please use bullet points.', 'Summarize the design review.', 'The team reviewed the dashboard and discussed the colors and then the spacing and later the charts which need work and also…', 'notes-v3', 6],
  ['down', 'Support chat', 'Deepa Poluru', 'It repeated my phone number back in the chat. That is private.', 'Update my contact number to the new one.', 'Done! Your number 555-0143 has been saved.', 'support-v13', 7],
  ['up', 'Support chat', 'Naveen Poluru', 'Fast and helpful.', 'How do I download my receipt?', 'Open Billing → History and select Download next to the payment.', 'support-v13', 8],
  ['down', 'Help search', 'Sunita Poluru', 'Incorrect, SSO is available on the Team plan too.', 'which plans include sso', 'Single sign-on is only available on Enterprise.', 'search-v4', 9],
  ['down', 'Email drafts', 'Gopal Poluru', 'Too long for a quick follow-up. Make it shorter.', 'Draft a follow-up after the demo.', 'Dear Priya, I hope this message finds you well. I wanted to take a moment to thank you once again for taking the time out of your busy schedule…', 'email-v7', 10],
  ['up', 'Email drafts', 'Harini Poluru', 'Perfect tone, sent it as is.', 'Draft a thank-you to the vendor.', 'Hi Sam — thanks for turning the order around so quickly. It made a real difference this week.', 'email-v7', 11],
  ['down', 'Support chat', 'Venkat Poluru', 'Made up a feature that does not exist. Wrong answer.', 'Can I schedule reports to Slack?', 'Yes, go to Reports → Schedule → Slack.', 'support-v12', 12],
  ['down', 'Meeting notes', 'Kavitha Poluru', 'Missing the decision about the budget. Incomplete notes.', 'Summarize the budget meeting.', '• Reviewed Q3 spend\n• Discussed vendor list', 'notes-v3', 14],
  ['up', 'Help search', 'Rajesh Poluru', 'Quick answer, found it instantly.', 'change time zone', 'Profile → Preferences → Time zone.', 'search-v4', 15],
  ['down', 'Support chat', 'Shanti Poluru', 'Rude reply when I said I was frustrated.', 'This is the third time I have asked.', 'Please read the previous message.', 'support-v13', 16],
  ['down', 'Help search', 'Mohan Poluru', 'Old pricing from last year.', 'price of pro plan', 'Pro is $15 per user per month.', 'search-v4', 18],
  ['up', 'Support chat', 'Bhavana Poluru', 'Helpful and clear, thanks.', 'How do I add a teammate?', 'Settings → Members → Invite, then pick a role.', 'support-v13', 20],
  ['down', 'Email drafts', 'Srinivas Poluru', 'Uses a table in an email, formatting breaks in Outlook.', 'Draft a summary of order status for the client.', '| Order | Status |\n|---|---|\n| 1042 | Shipped |', 'email-v7', 22],
  ['down', 'Support chat', 'Latha Poluru', 'Wrong — you can export to CSV, I do it every week.', 'Can I export to CSV?', 'Export is not supported yet.', 'support-v12', 24],
  ['up', 'Meeting notes', 'Prakash Poluru', 'Exactly the right level of detail.', 'Summarize the customer call.', '• Customer wants SSO\n• Trial extended 14 days\n• Follow-up Friday', 'notes-v3', 26],
  ['down', 'Help search', 'Usha Poluru', 'Didn’t mention the mobile app steps, incomplete.', 'turn off notifications', 'On the web, open Settings → Notifications.', 'search-v4', 30],
  ['down', 'Support chat', 'Ganesh Poluru', 'Rambling answer, too long to read on my phone.', 'Is there a student discount?', 'We offer several discounts. Students, educators, and non-profits may qualify under different programs, each with its own terms…', 'support-v13', 34],
];

@Component({
  selector: 'app-root',
  imports: [
    EdsAccordionComponent, EdsAlertComponent, EdsAutocompleteComponent, EdsAvatarComponent, EdsBadgeComponent, EdsBreadcrumbComponent,
    EdsButtonComponent, EdsButtonGroupComponent, EdsCardComponent, EdsCheckboxComponent, EdsCircularProgressComponent, EdsCodeSnippetComponent,
    EdsComboboxComponent, EdsDataTableComponent, EdsDateRangePickerComponent, EdsDescriptionListComponent, EdsDividerComponent, EdsDrawerComponent,
    EdsDropdownMenuComponent, EdsEmptyStateComponent, EdsInputComponent, EdsKbdComponent, EdsLinkComponent, EdsListComponent, EdsMenuItemComponent,
    EdsMeterComponent, EdsModalComponent, EdsNumberInputComponent, EdsPaginationComponent, EdsPopoverComponent, EdsProgressBarComponent,
    EdsRadioComponent, EdsRadioGroupComponent, EdsSearchComponent, EdsSegmentedControlComponent, EdsSelectComponent, EdsSideNavComponent,
    EdsSplitButtonComponent, EdsStatComponent, EdsStatusComponent, EdsSwitchComponent, EdsTabsComponent, EdsTagComponent, EdsTextareaComponent,
    EdsTimePickerComponent, EdsTimelineComponent, EdsToastComponent, EdsToolbarComponent, EdsTreeViewComponent, EdsVisuallyHiddenComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly reviewers = ['Nisha Poluru', 'Vivek Poluru', 'Asha Poluru', 'Rohit Poluru'];
  readonly surfaces = ['Support chat', 'Help search', 'Email drafts', 'Meeting notes'];
  readonly tags = signal<Tag[]>([
    { name: 'Wrong answer', group: 'Quality', variant: 'danger', keywords: ['wrong', 'incorrect', 'made up', 'not true'] },
    { name: 'Outdated', group: 'Quality', variant: 'warning', keywords: ['outdated', 'old', 'last year', 'no longer'] },
    { name: 'Incomplete', group: 'Quality', variant: 'warning', keywords: ['incomplete', 'missing', 'didn’t mention', 'forgot'] },
    { name: 'Too long', group: 'Style', variant: 'info', keywords: ['too long', 'shorter', 'rambling', 'wall of text'] },
    { name: 'Tone', group: 'Style', variant: 'info', keywords: ['tone', 'rude', 'robotic', 'cold'] },
    { name: 'Formatting', group: 'Style', variant: 'info', keywords: ['format', 'bullet', 'table', 'mess'] },
    { name: 'Privacy', group: 'Safety', variant: 'danger', keywords: ['private', 'phone number', 'personal', 'address'] },
    { name: 'Helpful', group: 'Praise', variant: 'success', keywords: ['helpful', 'perfect', 'exactly', 'great', 'thanks'] },
    { name: 'Fast', group: 'Praise', variant: 'success', keywords: ['fast', 'quick', 'instantly'] },
  ]);

  readonly items = signal<Feedback[]>(RAW.map(([rating, surface, customer, comment, question, answer, promptVersion, hoursAgo], i) => {
    const status: Status = i > 17 ? 'Routed' : i > 14 ? 'Triaged' : i === 12 ? 'Dismissed' : 'New';
    const tags = i > 14 ? this.keywordTags(comment) : [];
    return {
      id: `FB-${(4100 + i).toString()}`, rating, surface, customer, comment, question, answer, promptVersion, hoursAgo, tags, status,
      queue: status === 'Routed' ? (tags.some((tag) => ['Wrong answer', 'Outdated', 'Incomplete'].includes(tag)) ? 'retraining' : 'prompt') : null,
      assignee: i > 14 ? this.reviewers[i % 4] : i % 3 === 0 ? 'Nisha Poluru' : '',
      severity: rating === 'up' ? 'Low' : /private|wrong|made up|incorrect/i.test(comment) ? 'High' : 'Medium',
      note: '', correction: '',
    };
  }));

  readonly page = signal(0);
  readonly view = signal('New');
  readonly search = signal('');
  readonly surfaceFilter = signal('all');
  readonly selectedId = signal('FB-4100');
  readonly checked = signal<Record<string, boolean>>({});
  readonly queueTab = signal(0);
  readonly queuePage = signal(1);
  readonly newTag = signal('');
  readonly selectedTag = signal('Wrong answer');
  readonly treeExpanded: Record<string, boolean> = { Quality: true, Style: true, Safety: true, Praise: true, Custom: true };
  readonly rules = signal<Rule[]>([
    { id: 'r1', name: 'Factual errors to retraining', rating: 'down', tag: 'Wrong answer', surface: 'all', target: 'retraining', enabled: true },
    { id: 'r2', name: 'Stale content to retraining', rating: 'down', tag: 'Outdated', surface: 'all', target: 'retraining', enabled: true },
    { id: 'r3', name: 'Length complaints to prompt queue', rating: 'down', tag: 'Too long', surface: 'all', target: 'prompt', enabled: true },
    { id: 'r4', name: 'Tone issues in email to prompt queue', rating: 'down', tag: 'Tone', surface: 'Email drafts', target: 'prompt', enabled: false },
  ]);
  readonly batches = signal<Batch[]>([
    { id: 'B-017', queue: 'retraining', name: 'support-corrections-sep-w3', items: 42, format: 'JSONL', created: 'Sep 21', by: 'Vivek Poluru' },
    { id: 'T-088', queue: 'prompt', name: 'support-v12: shorten default replies', items: 18, format: 'Ticket', created: 'Sep 23', by: 'Nisha Poluru' },
  ]);
  readonly batchTarget = signal(10);
  readonly slaHours = signal(24);
  readonly autoApply = signal(false);
  readonly redact = signal(true);
  readonly retention = signal('180');
  readonly digestTime = signal('08:30');
  readonly notifyEmail = signal('feedback-review@poluru.example');
  readonly rangeStart = signal('2026-09-01');
  readonly rangeEnd = signal('2026-09-28');
  readonly insightView = signal('volume');
  readonly modal = signal<'rule' | 'batch' | null>(null);
  readonly ruleDraft = signal<Omit<Rule, 'id' | 'enabled'>>({ name: '', rating: 'down', tag: 'Wrong answer', surface: 'all', target: 'retraining' });
  readonly batchName = signal('');
  readonly batchFormat = signal('JSONL');
  readonly includeCorrection = signal(true);
  readonly drawerOpen = signal(false);
  readonly teamSort = signal<{ key: string; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });
  readonly notice = signal('');
  readonly error = signal('');
  readonly toastOpen = signal(false);
  readonly toastTitle = signal('');
  readonly toastBody = signal('');
  readonly menuOpen = signal(false);
  readonly helpOpen = signal(false);
  readonly showIntro = signal(true);
  readonly log = signal([
    { title: 'Created training batch B-017', description: '42 items · Vivek Poluru', timestamp: 'Sep 21, 16:05', status: 'complete' as const },
    { title: 'Opened ticket T-088', description: 'support-v12 length · Nisha Poluru', timestamp: 'Sep 23, 11:40', status: 'complete' as const },
    { title: 'Enabled rule “Length complaints to prompt queue”', description: 'Asha Poluru', timestamp: 'Sep 25, 09:12', status: 'complete' as const },
  ]);

  readonly nav = [
    { label: 'Overview' }, { label: 'Triage' }, { label: 'Queues' }, { label: 'Routing' },
    { label: 'Tags' }, { label: 'Insights' }, { label: 'Team' }, { label: 'Settings' },
  ];
  readonly headings = [
    { eyebrow: 'FEEDBACK', title: 'Feedback Review Console', summary: 'Collect, tag, and route thumbs-up/down user feedback into retraining and prompt-improvement queues.' },
    { eyebrow: 'REVIEW', title: 'Triage', summary: 'Read each rating in context, tag it, and send it where it can be fixed.' },
    { eyebrow: 'DESTINATIONS', title: 'Queues', summary: 'Routed feedback waiting to become a training batch or a prompt ticket.' },
    { eyebrow: 'AUTOMATION', title: 'Routing rules', summary: 'Send tagged feedback to the right queue without manual review.' },
    { eyebrow: 'TAXONOMY', title: 'Tags', summary: 'The labels reviewers use, and the keywords that suggest them.' },
    { eyebrow: 'TRENDS', title: 'Insights', summary: 'Where ratings come from and what people complain about.' },
    { eyebrow: 'PEOPLE', title: 'Team', summary: 'Reviewers and how much they have triaged.' },
    { eyebrow: 'WORKSPACE', title: 'Settings', summary: 'Service level, batch size, privacy, and daily digest.' },
  ];
  readonly views = ['New', 'Thumbs down', 'Thumbs up', 'Untagged', 'Assigned to me', 'Triaged', 'Routed', 'Dismissed', 'All'];
  readonly queueTabs = [{ label: 'Retraining' }, { label: 'Prompt improvement' }];
  readonly surfaceOptions = [{ label: 'All surfaces', value: 'all' }, ...this.surfaces.map((surface) => ({ label: surface, value: surface }))];
  readonly reviewerOptions = [{ label: 'Unassigned', value: '' }, ...this.reviewers.map((name) => ({ label: name, value: name }))];
  readonly ratingOptions = [{ label: 'Any rating', value: 'any' }, { label: 'Thumbs down', value: 'down' }, { label: 'Thumbs up', value: 'up' }];
  readonly retentionOptions = [{ label: '90 days', value: '90' }, { label: '180 days', value: '180' }, { label: '1 year', value: '365' }];
  readonly insightViews = [{ label: 'Volume', value: 'volume' }, { label: 'Thumbs-up rate', value: 'rate' }];
  readonly team = [
    { name: 'Nisha Poluru', role: 'Review lead', focus: 'Support chat', sla: '96%' },
    { name: 'Vivek Poluru', role: 'Data engineer', focus: 'Training batches', sla: '91%' },
    { name: 'Asha Poluru', role: 'Reviewer', focus: 'Email drafts', sla: '94%' },
    { name: 'Rohit Poluru', role: 'Reviewer', focus: 'Help search', sla: '88%' },
  ];
  readonly teamColumns = [{ key: 'name', label: 'Reviewer' }, { key: 'role', label: 'Role' }, { key: 'focus', label: 'Focus' }, { key: 'triaged', label: 'Triaged' }, { key: 'sla', label: 'Within SLA' }];
  readonly guide = [
    { heading: 'Retraining queue', content: 'Factual problems: wrong, outdated, or incomplete answers. Add the corrected answer so the item can become a training example.', open: true },
    { heading: 'Prompt-improvement queue', content: 'Style problems the instructions can fix: length, tone, and formatting. Items are grouped by prompt version.' },
    { heading: 'Dismiss', content: 'Spam, duplicates, or ratings with no actionable signal. Dismissed items are kept for the retention period and then deleted.' },
  ];
  readonly weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  readonly weekly = [
    { up: 64, down: 22 }, { up: 71, down: 30 }, { up: 58, down: 26 }, { up: 80, down: 19 }, { up: 75, down: 33 }, { up: 32, down: 9 }, { up: 28, down: 11 },
  ];

  readonly Math = Math;
  readonly tagNames = computed(() => this.tags().map((tag) => tag.name));
  readonly tagOptions = computed(() => this.tags().map((tag) => ({ label: tag.name, value: tag.name })));
  readonly breadcrumbs = computed(() => [{ label: 'Feedback' }, { label: this.nav[this.page()].label }]);
  readonly counts = computed(() => Object.fromEntries(this.views.map((view) => [view, this.items().filter((item) => this.inView(item, view)).length])));
  readonly sideNav = computed(() => this.views.map((view) => ({ label: `${view} (${this.counts()[view]})`, active: view === this.view() })));
  readonly visible = computed(() => {
    const query = this.search().trim().toLowerCase();
    return this.items()
      .filter((item) => this.inView(item, this.view()))
      .filter((item) => this.surfaceFilter() === 'all' || item.surface === this.surfaceFilter())
      .filter((item) => !query || `${item.comment} ${item.customer} ${item.id} ${item.tags.join(' ')}`.toLowerCase().includes(query))
      .sort((a, b) => a.hoursAgo - b.hoursAgo);
  });
  readonly selected = computed(() => this.items().find((item) => item.id === this.selectedId()) ?? null);
  readonly suggested = computed(() => {
    const item = this.selected();
    return item ? this.keywordTags(item.comment).filter((tag) => !item.tags.includes(tag)) : [];
  });
  readonly selectedMeta = computed(() => {
    const item = this.selected();
    if (!item) return [];
    return [
      { term: 'Surface', description: item.surface },
      { term: 'Prompt version', description: item.promptVersion },
      { term: 'Customer', description: this.redact() ? this.mask(item.customer) : item.customer },
      { term: 'Received', description: this.age(item.hoursAgo) },
    ];
  });
  readonly checkedIds = computed(() => Object.keys(this.checked()).filter((id) => this.checked()[id] && this.visible().some((item) => item.id === id)));
  readonly allChecked = computed(() => this.visible().length > 0 && this.visible().every((item) => this.checked()[item.id]));

  readonly total = computed(() => this.items().length);
  readonly upRate = computed(() => Math.round((this.items().filter((item) => item.rating === 'up').length / Math.max(1, this.total())) * 100));
  readonly newCount = computed(() => this.items().filter((item) => item.status === 'New').length);
  readonly overdue = computed(() => this.items().filter((item) => item.status === 'New' && item.hoursAgo > this.slaHours()).length);
  readonly routedShare = computed(() => Math.round((this.items().filter((item) => item.status === 'Routed').length / Math.max(1, this.total())) * 100));
  readonly queueItems = computed(() => this.items().filter((item) => item.status === 'Routed' && item.queue === (this.queueTab() === 0 ? 'retraining' : 'prompt')));
  readonly pagedQueue = computed(() => this.queueItems().slice((this.queuePage() - 1) * 6, this.queuePage() * 6));
  readonly queueCounts = computed(() => ({
    retraining: this.items().filter((item) => item.status === 'Routed' && item.queue === 'retraining').length,
    prompt: this.items().filter((item) => item.status === 'Routed' && item.queue === 'prompt').length,
  }));
  readonly correctedShare = computed(() => {
    const list = this.items().filter((item) => item.status === 'Routed' && item.queue === 'retraining');
    return list.length ? Math.round((list.filter((item) => item.correction.trim()).length / list.length) * 100) : 0;
  });
  readonly byVersion = computed(() => {
    const groups: Record<string, Feedback[]> = {};
    for (const item of this.queueItems()) (groups[item.promptVersion] ??= []).push(item);
    return Object.entries(groups).map(([version, list]) => ({ version, count: list.length, tags: [...new Set(list.flatMap((item) => item.tags))] })).sort((a, b) => b.count - a.count);
  });
  readonly ruleStats = computed(() => this.rules().map((rule) => ({ ...rule, matches: this.items().filter((item) => item.status !== 'Routed' && item.status !== 'Dismissed' && this.matches(rule, item)).length })));
  readonly tagStats = computed(() => this.tags().map((tag) => ({ ...tag, count: this.items().filter((item) => item.tags.includes(tag.name)).length })));
  readonly maxTag = computed(() => Math.max(1, ...this.tagStats().map((tag) => tag.count)));
  readonly tagTree = computed(() => {
    const groups = [...new Set(this.tags().map((tag) => tag.group))];
    return groups.map((group) => ({ id: group, label: group, children: this.tagStats().filter((tag) => tag.group === group).map((tag) => ({ id: tag.name, label: `${tag.name} (${tag.count})` })) }));
  });
  readonly surfaceStats = computed(() => this.surfaces.map((surface) => {
    const list = this.items().filter((item) => item.surface === surface);
    return { surface, total: list.length, rate: list.length ? Math.round((list.filter((item) => item.rating === 'up').length / list.length) * 100) : 0 };
  }));
  readonly versionStats = computed(() => {
    const versions = [...new Set(this.items().map((item) => item.promptVersion))].sort();
    return versions.map((version) => {
      const list = this.items().filter((item) => item.promptVersion === version);
      const up = list.filter((item) => item.rating === 'up').length;
      return { version, total: list.length, up, rate: Math.round((up / list.length) * 100), top: this.topTag(list) };
    });
  });
  readonly versionList = computed(() => this.byVersion().map((group) => group.version).join(', ') || '—');
  readonly rulesYaml = computed(() => ['rules:', ...this.rules().map((rule) => [
    `  - name: ${rule.name}`,
    `    enabled: ${rule.enabled}`,
    `    when: { rating: ${rule.rating}, tag: "${rule.tag}", surface: ${rule.surface} }`,
    `    route_to: ${rule.target}`,
  ].join('\n'))].join('\n'));
  readonly surfaceList = computed(() => this.surfaceStats().map((row) => ({ label: row.surface, description: `${row.total} ratings · ${row.rate}% thumbs up`, selected: this.surfaceFilter() === row.surface })));
  readonly activeTag = computed(() => this.tagStats().find((tag) => tag.name === this.selectedTag()) ?? null);
  readonly activeTagItems = computed(() => this.items().filter((item) => item.tags.includes(this.selectedTag())).slice(0, 5));
  readonly weeklyMax = computed(() => Math.max(...this.weekly.map((day) => day.up + day.down)));
  readonly teamRows = computed(() => {
    const { key, direction } = this.teamSort();
    return this.team
      .map((member) => ({ ...member, triaged: this.items().filter((item) => item.assignee === member.name && item.status !== 'New').length + 12 }))
      .sort((a, b) => {
        const av = a[key as keyof typeof a];
        const bv = b[key as keyof typeof b];
        const cmp = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv));
        return direction === 'asc' ? cmp : -cmp;
      });
  });
  readonly timeline = computed(() => this.log().slice(0, 6));
  readonly exportPreview = computed(() => {
    const list = this.queueItems().slice(0, 2);
    if (this.batchFormat() === 'CSV') return ['id,question,answer,correction,tags', ...list.map((item) => `${item.id},"${item.question}","${item.answer.slice(0, 40)}…","${item.correction}","${item.tags.join('|')}"`)].join('\n');
    return list.map((item) => JSON.stringify({ id: item.id, input: item.question, rejected: item.answer.slice(0, 40) + '…', ...(this.includeCorrection() ? { chosen: item.correction || null } : {}), tags: item.tags })).join('\n');
  });

  @HostListener('window:keydown', ['$event'])
  onKey(event: KeyboardEvent): void {
    if (this.page() !== 1 || this.modal() || event.metaKey || event.ctrlKey || event.altKey) return;
    const target = event.target as HTMLElement | null;
    if (target && (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable)) return;
    const key = event.key.toLowerCase();
    if (key === 'j') this.step(1);
    else if (key === 'k') this.step(-1);
    else if (key === 'r') this.route('retraining');
    else if (key === 'p') this.route('prompt');
    else if (key === 'd') this.dismiss();
    else return;
    event.preventDefault();
  }

  keywordTags(comment: string): string[] {
    const text = comment.toLowerCase();
    return (this.tags?.() ?? []).filter((tag) => tag.keywords.some((word) => text.includes(word.toLowerCase()))).map((tag) => tag.name);
  }

  inView(item: Feedback, view: string): boolean {
    switch (view) {
      case 'New': return item.status === 'New';
      case 'Thumbs down': return item.rating === 'down' && item.status !== 'Dismissed';
      case 'Thumbs up': return item.rating === 'up' && item.status !== 'Dismissed';
      case 'Untagged': return !item.tags.length && item.status !== 'Dismissed';
      case 'Assigned to me': return item.assignee === 'Nisha Poluru' && item.status !== 'Dismissed';
      case 'Triaged': return item.status === 'Triaged';
      case 'Routed': return item.status === 'Routed';
      case 'Dismissed': return item.status === 'Dismissed';
      default: return true;
    }
  }

  matches(rule: Rule, item: Feedback): boolean {
    return (rule.rating === 'any' || item.rating === rule.rating) && item.tags.includes(rule.tag) && (rule.surface === 'all' || item.surface === rule.surface);
  }

  topTag(list: Feedback[]): string {
    const counts: Record<string, number> = {};
    list.flatMap((item) => item.tags).forEach((tag) => (counts[tag] = (counts[tag] ?? 0) + 1));
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
  }

  mask(name: string): string {
    return name.split(' ').map((part, i) => (i === 0 ? part : part[0] + '.')).join(' ');
  }

  age(hours: number): string {
    return hours < 24 ? `${hours}h ago` : `${Math.floor(hours / 24)}d ${hours % 24}h ago`;
  }

  tagVariant(name: string): Tone {
    return this.tags().find((tag) => tag.name === name)?.variant ?? 'neutral';
  }

  statusTone(status: Status): Tone {
    return status === 'New' ? 'info' : status === 'Triaged' ? 'warning' : status === 'Routed' ? 'success' : 'neutral';
  }

  queueLabel(queue: Queue | null): string {
    return queue === 'retraining' ? 'Retraining' : queue === 'prompt' ? 'Prompt improvement' : '—';
  }

  navigate(page: number): void {
    this.page.set(page);
    this.error.set('');
  }

  setView(view: string): void {
    this.view.set(view);
    this.checked.set({});
    const first = this.visible()[0];
    if (first) this.selectedId.set(first.id);
  }

  onSideNav(event: { label: string }): void {
    const view = this.views.find((item) => event.label.startsWith(item + ' ('));
    if (view) this.setView(view);
  }

  onSurfaceList(event: { label: string }): void {
    this.surfaceFilter.set(this.surfaceFilter() === event.label ? 'all' : event.label);
  }

  selectTag(id: string): void {
    if (this.tagNames().includes(id)) this.selectedTag.set(id);
  }

  openItem(id: string): void {
    this.selectedId.set(id);
    this.navigate(1);
    if (!this.visible().some((item) => item.id === id)) this.view.set('All');
  }

  step(delta: number): void {
    const list = this.visible();
    const index = list.findIndex((item) => item.id === this.selectedId());
    const next = list[Math.min(list.length - 1, Math.max(0, index + delta))];
    if (next) this.selectedId.set(next.id);
  }

  patch(id: string, change: Partial<Feedback>): void {
    this.items.update((list) => list.map((item) => (item.id === id ? { ...item, ...change } : item)));
  }

  addTag(name: string): void {
    const item = this.selected();
    const tag = name.trim();
    if (!item || !tag) return;
    if (!this.tagNames().includes(tag)) {
      this.error.set(`“${tag}” is not in the taxonomy. Add it on the Tags page first.`);
      return;
    }
    if (!item.tags.includes(tag)) this.patch(item.id, { tags: [...item.tags, tag], status: item.status === 'New' ? 'Triaged' : item.status });
    this.newTag.set('');
    this.error.set('');
  }

  removeTag(tag: string): void {
    const item = this.selected();
    if (item) this.patch(item.id, { tags: item.tags.filter((name) => name !== tag) });
  }

  acceptSuggestions(): void {
    const item = this.selected();
    if (!item) return;
    this.patch(item.id, { tags: [...new Set([...item.tags, ...this.suggested()])], status: item.status === 'New' ? 'Triaged' : item.status });
  }

  setSeverity(value: string): void {
    const item = this.selected();
    if (item && (value === 'Low' || value === 'Medium' || value === 'High')) this.patch(item.id, { severity: value });
  }

  route(queue: Queue, id = this.selectedId()): void {
    const item = this.items().find((entry) => entry.id === id);
    if (!item) return;
    if (!item.tags.length) {
      this.error.set('Add at least one tag before routing so the queue owner knows what to fix.');
      return;
    }
    this.patch(id, { status: 'Routed', queue, assignee: item.assignee || 'Nisha Poluru' });
    this.error.set('');
    this.addLog(`Routed ${id} to ${this.queueLabel(queue).toLowerCase()}`, item.tags.join(', '));
    this.notify(`Sent to ${this.queueLabel(queue)}`, `${id} · ${item.tags.join(', ')}`);
    this.advance(id);
  }

  dismiss(id = this.selectedId()): void {
    const item = this.items().find((entry) => entry.id === id);
    if (!item) return;
    this.patch(id, { status: 'Dismissed', queue: null });
    this.notify('Dismissed', id);
    this.advance(id);
  }

  restore(id: string): void {
    this.patch(id, { status: 'New', queue: null });
    this.notify('Moved back to New', id);
  }

  advance(fromId: string): void {
    const next = this.visible().find((item) => item.id !== fromId);
    if (next) this.selectedId.set(next.id);
  }

  onRouteMenu(item: { value: string }): void {
    if (item.value === 'prompt') this.route('prompt');
    else if (item.value === 'dismiss') this.dismiss();
  }

  toggleCheck(id: string, value: boolean): void {
    this.checked.update((map) => ({ ...map, [id]: value }));
  }

  toggleAll(value: boolean): void {
    this.checked.set(value ? Object.fromEntries(this.visible().map((item) => [item.id, true])) : {});
  }

  bulk(action: string): void {
    const ids = this.checkedIds();
    if (!ids.length) return;
    if (action === 'dismiss') {
      this.items.update((list) => list.map((item) => (ids.includes(item.id) ? { ...item, status: 'Dismissed' as Status, queue: null } : item)));
      this.notify('Dismissed', `${ids.length} item(s).`);
    } else if (action === 'assign') {
      this.items.update((list) => list.map((item) => (ids.includes(item.id) ? { ...item, assignee: 'Nisha Poluru' } : item)));
      this.notify('Assigned to you', `${ids.length} item(s).`);
    } else if (action === 'suggest') {
      this.items.update((list) => list.map((item) => (ids.includes(item.id) ? { ...item, tags: [...new Set([...item.tags, ...this.keywordTags(item.comment)])], status: item.status === 'New' ? 'Triaged' as Status : item.status } : item)));
      this.notify('Suggested tags applied', `${ids.length} item(s).`);
    }
    this.checked.set({});
  }

  applyRules(): void {
    const active = this.rules().filter((rule) => rule.enabled);
    let moved = 0;
    this.items.update((list) => list.map((item) => {
      if (item.status === 'Routed' || item.status === 'Dismissed') return item;
      const rule = active.find((entry) => this.matches(entry, item));
      if (!rule) return item;
      moved++;
      return { ...item, status: 'Routed' as Status, queue: rule.target, assignee: item.assignee || 'Nisha Poluru' };
    }));
    this.addLog('Applied routing rules', `${moved} item(s) routed`);
    this.notify('Rules applied', moved ? `${moved} item(s) routed.` : 'Nothing matched. Tag more items or loosen a rule.');
  }

  updateRule(id: string, change: Partial<Rule>): void {
    this.rules.update((list) => list.map((rule) => (rule.id === id ? { ...rule, ...change } : rule)));
  }

  removeRule(id: string): void {
    this.rules.update((list) => list.filter((rule) => rule.id !== id));
  }

  openRule(): void {
    this.ruleDraft.set({ name: '', rating: 'down', tag: this.tagNames()[0], surface: 'all', target: 'retraining' });
    this.error.set('');
    this.modal.set('rule');
  }

  patchRule(change: Partial<Omit<Rule, 'id' | 'enabled'>>): void {
    this.ruleDraft.update((draft) => ({ ...draft, ...change }));
    this.error.set('');
  }

  setRuleRating(value: string): void {
    if (value === 'any' || value === 'up' || value === 'down') this.patchRule({ rating: value });
  }

  setRuleTarget(value: string): void {
    if (value === 'retraining' || value === 'prompt') this.patchRule({ target: value });
  }

  saveRule(): void {
    const draft = this.ruleDraft();
    if (!draft.name.trim()) {
      this.error.set('Name the rule so others know what it does.');
      return;
    }
    if (!this.tagNames().includes(draft.tag)) {
      this.error.set('Pick a tag from the taxonomy.');
      return;
    }
    this.rules.update((list) => [...list, { ...draft, name: draft.name.trim(), id: `r${Date.now()}`, enabled: true }]);
    this.closeModal();
    this.addLog(`Created rule “${draft.name.trim()}”`, 'Nisha Poluru');
    this.notify('Rule created', draft.name.trim());
  }

  createTag(): void {
    const name = this.newTag().trim();
    if (name.length < 3) {
      this.error.set('Tag names need at least three characters.');
      return;
    }
    if (this.tagNames().some((tag) => tag.toLowerCase() === name.toLowerCase())) {
      this.error.set('That tag already exists.');
      return;
    }
    this.tags.update((list) => [...list, { name, group: 'Custom', variant: 'brand', keywords: [name.toLowerCase()] }]);
    this.newTag.set('');
    this.error.set('');
    this.notify('Tag added', `${name} will be suggested when a comment mentions “${name.toLowerCase()}”.`);
  }

  updateKeywords(name: string, value: string): void {
    this.tags.update((list) => list.map((tag) => (tag.name === name ? { ...tag, keywords: value.split(',').map((word) => word.trim()).filter(Boolean) } : tag)));
  }

  openBatch(): void {
    if (!this.queueItems().length) {
      this.error.set('This queue is empty.');
      return;
    }
    this.batchName.set(this.queueTab() === 0 ? `support-corrections-${new Date(2026, 8, 28).toISOString().slice(5, 10)}` : `${this.byVersion()[0]?.version ?? 'prompt'}: improvements`);
    this.batchFormat.set(this.queueTab() === 0 ? 'JSONL' : 'Ticket');
    this.error.set('');
    this.modal.set('batch');
  }

  createBatch(): void {
    const queue: Queue = this.queueTab() === 0 ? 'retraining' : 'prompt';
    const list = this.queueItems();
    if (!this.batchName().trim()) {
      this.error.set('Name the batch.');
      return;
    }
    if (queue === 'retraining' && this.includeCorrection() && list.some((item) => !item.correction.trim())) {
      this.error.set(`${list.filter((item) => !item.correction.trim()).length} item(s) have no corrected answer. Add them in Triage or untick “Include corrected answers”.`);
      return;
    }
    const id = `${queue === 'retraining' ? 'B' : 'T'}-${String(18 + this.batches().length).padStart(3, '0')}`;
    this.batches.update((items) => [{ id, queue, name: this.batchName().trim(), items: list.length, format: this.batchFormat(), created: 'Today', by: 'Nisha Poluru' }, ...items]);
    const ids = list.map((item) => item.id);
    this.items.update((all) => all.map((item) => (ids.includes(item.id) ? { ...item, status: 'Triaged' as Status, queue: null, note: `${item.note ? item.note + ' · ' : ''}In ${id}` } : item)));
    this.closeModal();
    this.addLog(`${queue === 'retraining' ? 'Created training batch' : 'Opened ticket'} ${id}`, `${list.length} items · Nisha Poluru`);
    this.notify(queue === 'retraining' ? 'Batch created' : 'Ticket opened', `${id} with ${list.length} item(s).`);
  }

  closeModal(): void {
    this.modal.set(null);
    this.error.set('');
  }

  exportCsv(): void {
    const rows = [['id', 'rating', 'surface', 'status', 'queue', 'tags', 'prompt_version', 'comment'], ...this.items().map((item) => [item.id, item.rating, item.surface, item.status, item.queue ?? '', item.tags.join('|'), item.promptVersion, item.comment])];
    const url = URL.createObjectURL(new Blob([rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n')], { type: 'text/csv' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'feedback.csv';
    anchor.click();
    URL.revokeObjectURL(url);
    this.notify('Downloaded', 'feedback.csv');
  }

  onExportMenu(item: { value: string }): void {
    if (item.value === 'rules') {
      const url = URL.createObjectURL(new Blob([JSON.stringify(this.rules(), null, 2)], { type: 'application/json' }));
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'routing-rules.json';
      anchor.click();
      URL.revokeObjectURL(url);
      this.notify('Downloaded', 'routing-rules.json');
    }
  }

  onRange(range: { start: string; end: string }): void {
    this.rangeStart.set(range.start);
    this.rangeEnd.set(range.end);
  }

  saveSettings(): void {
    if (this.slaHours() < 1) {
      this.error.set('The review target must be at least one hour.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.notifyEmail().trim())) {
      this.error.set('Enter a valid email for the daily digest.');
      return;
    }
    this.error.set('');
    if (this.autoApply()) this.applyRules();
    this.notify('Settings saved', `Review within ${this.slaHours()}h, batches of ${this.batchTarget()}.`);
  }

  onProfile(item: { value: string }): void {
    const pages: Record<string, number> = { triage: 1, team: 6, settings: 7 };
    if (item.value === 'mine') {
      this.navigate(1);
      this.setView('Assigned to me');
    } else this.navigate(pages[item.value] ?? 0);
    this.menuOpen.set(false);
  }

  addLog(title: string, description: string): void {
    this.log.update((list) => [{ title, description, timestamp: 'Just now', status: 'complete' as const }, ...list]);
  }

  notify(title: string, description = ''): void {
    this.notice.set(description ? `${title}: ${description}` : title);
    this.toastTitle.set(title);
    this.toastBody.set(description);
    this.toastOpen.set(false);
    setTimeout(() => this.toastOpen.set(true));
  }
}
