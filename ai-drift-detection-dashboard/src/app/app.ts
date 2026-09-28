import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, computed, signal } from '@angular/core';
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
  EdsDataTableComponent,
  EdsDateRangePickerComponent,
  EdsDescriptionListComponent,
  EdsDividerComponent,
  EdsDrawerComponent,
  EdsDropdownMenuComponent,
  EdsEmptyStateComponent,
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
  EdsVisuallyHiddenComponent,
} from '@poluru-labs/enterprise-design-system-angular';

type Severity = 'Stable' | 'Warning' | 'Critical';
type AlertState = 'Open' | 'Acknowledged' | 'Resolved';
type RunState = 'Queued' | 'Training' | 'Validating' | 'Promoted';
type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

interface Feature {
  id: string;
  name: string;
  model: string;
  kind: 'Numeric' | 'Categorical';
  owner: string;
  bins: string[];
  baseline: number[];
  current: number[];
  baselineMean: number;
  currentMean: number;
  unit: string;
}

interface Model {
  id: string;
  name: string;
  version: string;
  owner: string;
  metric: string;
  baseline: number;
  weekly: number[];
  predictionBaseline: number[];
  predictionCurrent: number[];
}

interface DriftAlert {
  id: string;
  title: string;
  target: string;
  model: string;
  severity: Severity;
  score: number;
  opened: string;
  state: AlertState;
  owner: string;
  note: string;
}

interface Rule {
  id: string;
  model: string;
  threshold: number;
  minFeatures: number;
  cooldown: number;
  enabled: boolean;
}

interface Run {
  id: string;
  model: string;
  reason: string;
  requestedBy: string;
  window: string;
  state: RunState;
  started: string;
}

@Component({
  selector: 'app-root',
  imports: [
    NgTemplateOutlet,
    EdsSpinnerComponent,
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
    EdsDataTableComponent,
    EdsDateRangePickerComponent,
    EdsDescriptionListComponent,
    EdsDividerComponent,
    EdsDrawerComponent,
    EdsDropdownMenuComponent,
    EdsEmptyStateComponent,
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
    EdsVisuallyHiddenComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnDestroy {
  readonly page = signal(0);
  readonly window = signal('30');
  readonly modelFilter = signal('all');
  readonly featureSearch = signal('');
  readonly severityFilter = signal<'all' | Severity>('all');
  readonly selectedFeatureId = signal('basket_value');
  readonly alertTab = signal(0);
  readonly alertPage = signal(1);
  readonly activityPage = signal(1);
  readonly warnAt = signal(0.1);
  readonly criticalAt = signal(0.25);
  readonly checkTime = signal('06:00');
  readonly notifyEmail = signal('drift-team@poluru.example');
  readonly channel = signal('email');
  readonly baselineStart = signal('2026-06-01');
  readonly baselineEnd = signal('2026-06-30');
  readonly showBanner = signal(true);
  readonly muted = signal<Record<string, boolean>>({});
  readonly notice = signal('');
  readonly error = signal('');
  readonly toastOpen = signal(false);
  readonly toastTitle = signal('');
  readonly toastBody = signal('');
  readonly menuOpen = signal(false);
  readonly helpOpen = signal(false);
  readonly drawerAlertId = signal<string | null>(null);
  readonly modal = signal<'retrain' | 'note' | null>(null);
  readonly retrainModel = signal('churn');
  readonly retrainReason = signal('');
  readonly retrainStart = signal('2026-08-28');
  readonly retrainEnd = signal('2026-09-27');
  readonly retrainConfirm = signal(false);
  readonly alertNote = signal('');
  readonly teamSort = signal<{ key: string; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });
  private timers: ReturnType<typeof setInterval>[] = [];

  readonly nav = [
    { label: 'Overview' },
    { label: 'Features' },
    { label: 'Models' },
    { label: 'Alerts' },
    { label: 'Retraining' },
    { label: 'Team' },
    { label: 'Activity' },
    { label: 'Settings' },
  ];
  readonly headings = [
    { eyebrow: 'MONITORING', title: 'Drift Detection Dashboard', summary: 'Monitor data and model drift with distribution charts, alerts, and retraining triggers.' },
    { eyebrow: 'DATA DRIFT', title: 'Features', summary: 'Compare each input’s current distribution with its baseline window.' },
    { eyebrow: 'MODEL DRIFT', title: 'Models', summary: 'Track headline metrics and prediction mix against the baseline.' },
    { eyebrow: 'SIGNALS', title: 'Alerts', summary: 'Acknowledge, investigate, and resolve drift signals as they open.' },
    { eyebrow: 'ACTIONS', title: 'Retraining', summary: 'Rules that start a new training run, plus runs started by hand.' },
    { eyebrow: 'PEOPLE', title: 'Team', summary: 'Owners responsible for each model and its inputs.' },
    { eyebrow: 'LOG', title: 'Activity', summary: 'Checks, alerts, and runs from this session.' },
    { eyebrow: 'WORKSPACE', title: 'Settings', summary: 'Thresholds, check schedule, baseline window, and where alerts go.' },
  ];
  readonly windows = [
    { label: '7 days', value: '7' },
    { label: '30 days', value: '30' },
    { label: '90 days', value: '90' },
  ];
  readonly alertTabs = [{ label: 'Open' }, { label: 'Acknowledged' }, { label: 'Resolved' }];
  readonly severityOptions = [
    { label: 'All severities', value: 'all' },
    { label: 'Critical', value: 'Critical' },
    { label: 'Warning', value: 'Warning' },
    { label: 'Stable', value: 'Stable' },
  ];
  readonly runSteps = [
    { label: 'Queued', description: 'Waiting for capacity' },
    { label: 'Training', description: 'Fitting on the new window' },
    { label: 'Validating', description: 'Checking against holdout' },
    { label: 'Promoted', description: 'Serving traffic' },
  ];
  readonly team = [
    { name: 'Ananya Poluru', role: 'Monitoring lead', models: 'Churn', oncall: 'This week' },
    { name: 'Vikram Poluru', role: 'Data engineer', models: 'Fraud', oncall: 'Next week' },
    { name: 'Meera Poluru', role: 'Analyst', models: 'Demand', oncall: 'Oct 12' },
    { name: 'Rohan Poluru', role: 'Data engineer', models: 'Churn, Demand', oncall: 'Oct 19' },
    { name: 'Sita Poluru', role: 'Analyst', models: 'Fraud', oncall: 'Oct 26' },
  ];
  readonly teamColumns = [
    { key: 'name', label: 'Member' },
    { key: 'role', label: 'Role' },
    { key: 'models', label: 'Models' },
    { key: 'oncall', label: 'On call' },
  ];
  readonly activityColumns = [
    { key: 'event', label: 'Event' },
    { key: 'target', label: 'Target' },
    { key: 'member', label: 'Member' },
    { key: 'time', label: 'Time' },
  ];
  readonly guide = [
    { heading: 'How drift is scored', content: 'Each feature uses the Population Stability Index (PSI) between the baseline window and the current window. Below the warning threshold is stable; above the critical threshold opens a critical alert.', open: true },
    { heading: 'What triggers retraining', content: 'A rule fires when enough features on a model cross its PSI threshold and the cooldown has passed. Paused rules still show whether they would fire.' },
    { heading: 'Muting a feature', content: 'Muted features stay on the chart but do not count toward alerts or retraining rules. Use it for known seasonal shifts.' },
  ];

  readonly models: Model[] = [
    { id: 'churn', name: 'Churn model', version: 'v3.4', owner: 'Ananya Poluru', metric: 'AUC', baseline: 0.87, weekly: [0.87, 0.868, 0.866, 0.861, 0.855, 0.849, 0.842, 0.836], predictionBaseline: [0.62, 0.23, 0.15], predictionCurrent: [0.51, 0.27, 0.22] },
    { id: 'fraud', name: 'Fraud model', version: 'v7.1', owner: 'Vikram Poluru', metric: 'Precision', baseline: 0.92, weekly: [0.921, 0.92, 0.919, 0.921, 0.918, 0.917, 0.919, 0.916], predictionBaseline: [0.94, 0.04, 0.02], predictionCurrent: [0.93, 0.045, 0.025] },
    { id: 'demand', name: 'Demand forecast', version: 'v2.0', owner: 'Meera Poluru', metric: 'Accuracy', baseline: 0.81, weekly: [0.81, 0.806, 0.803, 0.797, 0.79, 0.786, 0.781, 0.778], predictionBaseline: [0.33, 0.41, 0.26], predictionCurrent: [0.27, 0.4, 0.33] },
  ];
  readonly features: Feature[] = [
    { id: 'basket_value', name: 'Basket value', model: 'churn', kind: 'Numeric', owner: 'Rohan Poluru', bins: ['0', '20', '40', '60', '80', '100', '120', '140'], baseline: [0.08, 0.16, 0.22, 0.2, 0.14, 0.1, 0.06, 0.04], current: [0.04, 0.08, 0.13, 0.17, 0.19, 0.17, 0.13, 0.09], baselineMean: 58.2, currentMean: 74.6, unit: '$' },
    { id: 'session_length', name: 'Session length', model: 'churn', kind: 'Numeric', owner: 'Rohan Poluru', bins: ['0m', '2m', '4m', '6m', '8m', '10m', '12m', '14m'], baseline: [0.12, 0.2, 0.22, 0.18, 0.12, 0.08, 0.05, 0.03], current: [0.1, 0.18, 0.21, 0.19, 0.14, 0.09, 0.06, 0.03], baselineMean: 5.1, currentMean: 5.5, unit: 'min' },
    { id: 'days_active', name: 'Days since signup', model: 'churn', kind: 'Numeric', owner: 'Ananya Poluru', bins: ['0', '30', '60', '90', '120', '150', '180', '210'], baseline: [0.18, 0.16, 0.14, 0.13, 0.12, 0.1, 0.09, 0.08], current: [0.27, 0.19, 0.13, 0.11, 0.09, 0.08, 0.07, 0.06], baselineMean: 96, currentMean: 78, unit: 'days' },
    { id: 'device', name: 'Device type', model: 'churn', kind: 'Categorical', owner: 'Ananya Poluru', bins: ['iOS', 'Android', 'Web', 'Tablet'], baseline: [0.38, 0.34, 0.2, 0.08], current: [0.37, 0.35, 0.2, 0.08], baselineMean: 0, currentMean: 0, unit: '' },
    { id: 'txn_amount', name: 'Transaction amount', model: 'fraud', kind: 'Numeric', owner: 'Vikram Poluru', bins: ['0', '50', '100', '150', '200', '250', '300', '350'], baseline: [0.3, 0.24, 0.16, 0.11, 0.08, 0.05, 0.04, 0.02], current: [0.28, 0.23, 0.17, 0.12, 0.08, 0.06, 0.04, 0.02], baselineMean: 96, currentMean: 101, unit: '$' },
    { id: 'merchant_country', name: 'Merchant country', model: 'fraud', kind: 'Categorical', owner: 'Sita Poluru', bins: ['US', 'CA', 'GB', 'IN', 'Other'], baseline: [0.52, 0.12, 0.1, 0.14, 0.12], current: [0.44, 0.1, 0.09, 0.22, 0.15], baselineMean: 0, currentMean: 0, unit: '' },
    { id: 'hour_of_day', name: 'Hour of day', model: 'fraud', kind: 'Numeric', owner: 'Sita Poluru', bins: ['0h', '3h', '6h', '9h', '12h', '15h', '18h', '21h'], baseline: [0.05, 0.03, 0.08, 0.15, 0.2, 0.19, 0.18, 0.12], current: [0.06, 0.04, 0.08, 0.14, 0.19, 0.19, 0.18, 0.12], baselineMean: 13.8, currentMean: 13.5, unit: 'h' },
    { id: 'store_traffic', name: 'Store traffic', model: 'demand', kind: 'Numeric', owner: 'Meera Poluru', bins: ['0', '1k', '2k', '3k', '4k', '5k', '6k', '7k'], baseline: [0.06, 0.12, 0.2, 0.24, 0.18, 0.11, 0.06, 0.03], current: [0.03, 0.07, 0.12, 0.18, 0.22, 0.19, 0.12, 0.07], baselineMean: 3120, currentMean: 3860, unit: 'visits' },
    { id: 'promo_flag', name: 'Promotion active', model: 'demand', kind: 'Categorical', owner: 'Meera Poluru', bins: ['None', 'Discount', 'Bundle'], baseline: [0.7, 0.2, 0.1], current: [0.55, 0.3, 0.15], baselineMean: 0, currentMean: 0, unit: '' },
  ];
  readonly modelOptions = [{ label: 'All models', value: 'all' }, ...this.models.map((model) => ({ label: model.name, value: model.id }))];
  readonly retrainOptions = this.models.map((model) => ({ label: `${model.name} ${model.version}`, value: model.id }));

  readonly alertStates = signal<Record<string, AlertState>>({ 'model-demand': 'Acknowledged' });
  readonly alertNotes = signal<Record<string, string>>({});
  readonly rules = signal<Rule[]>([
    { id: 'r-churn', model: 'churn', threshold: 0.2, minFeatures: 1, cooldown: 7, enabled: true },
    { id: 'r-fraud', model: 'fraud', threshold: 0.25, minFeatures: 2, cooldown: 14, enabled: true },
    { id: 'r-demand', model: 'demand', threshold: 0.2, minFeatures: 2, cooldown: 7, enabled: false },
  ]);
  readonly runs = signal<Run[]>([
    { id: 'RUN-1042', model: 'fraud', reason: 'Monthly refresh', requestedBy: 'Vikram Poluru', window: 'Aug 1 – Aug 31', state: 'Promoted', started: 'Sep 02, 04:10' },
    { id: 'RUN-1043', model: 'demand', reason: 'Holiday calendar update', requestedBy: 'Meera Poluru', window: 'Jun 1 – Sep 15', state: 'Promoted', started: 'Sep 16, 22:40' },
  ]);
  readonly activity = signal<{ event: string; target: string; member: string; time: string; date: string }[]>([
    { event: 'Daily drift check finished', target: 'All models', member: 'Scheduler', time: 'Today, 06:00', date: '2026-09-27' },
    { event: 'Critical drift on Basket value', target: 'Churn model', member: 'Scheduler', time: 'Today, 06:01', date: '2026-09-27' },
    { event: 'Acknowledged Demand forecast accuracy drop', target: 'Demand forecast', member: 'Meera Poluru', time: 'Yesterday, 17:25', date: '2026-09-26' },
    { event: 'Promoted RUN-1043', target: 'Demand forecast', member: 'Meera Poluru', time: 'Sep 16, 23:58', date: '2026-09-16' },
    { event: 'Updated baseline window', target: 'Fraud model', member: 'Vikram Poluru', time: 'Sep 05, 10:12', date: '2026-09-05' },
    { event: 'Promoted RUN-1042', target: 'Fraud model', member: 'Vikram Poluru', time: 'Sep 02, 06:30', date: '2026-09-02' },
  ]);

  readonly Math = Math;
  readonly modelNav = computed(() => this.modelOptions.map((option) => ({ label: option.label, active: option.value === this.modelFilter() })));
  readonly breadcrumbs = computed(() => [{ label: 'Monitoring' }, { label: this.nav[this.page()].label }]);
  readonly retrained = signal<Record<string, boolean>>({});
  readonly scored = computed(() => this.features.map((feature) => {
    const psi = this.retrained()[feature.model] ? 0 : this.psi(feature.baseline, feature.current, Number(this.window()));
    const rebased = this.retrained()[feature.model] ? { baseline: feature.current, baselineMean: feature.currentMean } : {};
    return { ...feature, ...rebased, psi, severity: this.severityOf(psi), muted: !!this.muted()[feature.id] };
  }));
  readonly scopedFeatures = computed(() => this.scored().filter((feature) => this.modelFilter() === 'all' || feature.model === this.modelFilter()));
  readonly visibleFeatures = computed(() => {
    const query = this.featureSearch().trim().toLowerCase();
    return this.scopedFeatures()
      .filter((feature) => this.severityFilter() === 'all' || feature.severity === this.severityFilter())
      .filter((feature) => !query || `${feature.name} ${feature.owner} ${this.modelName(feature.model)}`.toLowerCase().includes(query))
      .sort((a, b) => b.psi - a.psi);
  });
  readonly selectedFeature = computed(() => this.scored().find((feature) => feature.id === this.selectedFeatureId()) ?? this.scored()[0]);
  readonly drifting = computed(() => this.scopedFeatures().filter((feature) => !feature.muted && feature.severity !== 'Stable'));
  readonly critical = computed(() => this.scopedFeatures().filter((feature) => !feature.muted && feature.severity === 'Critical'));
  readonly stableShare = computed(() => {
    const list = this.scopedFeatures();
    return list.length ? Math.round((list.filter((feature) => feature.severity === 'Stable').length / list.length) * 100) : 100;
  });
  readonly topFeatures = computed(() => [...this.scopedFeatures()].sort((a, b) => b.psi - a.psi).slice(0, 5));
  readonly maxPsi = computed(() => Math.max(this.criticalAt() * 1.4, ...this.scored().map((feature) => feature.psi)));

  readonly modelStats = computed(() => this.models.map((model) => {
    const points = this.retrained()[model.id] ? [...this.windowPoints(model.weekly), model.baseline] : this.windowPoints(model.weekly);
    const latest = points[points.length - 1];
    const drop = model.baseline - latest;
    const inputs = this.scored().filter((feature) => feature.model === model.id && !feature.muted);
    const worst = inputs.reduce((max, feature) => Math.max(max, feature.psi), 0);
    const predictionPsi = this.psi(model.predictionBaseline, model.predictionCurrent, 30);
    const severity: Severity = drop >= 0.03 || worst >= this.criticalAt() ? 'Critical' : drop >= 0.015 || worst >= this.warnAt() ? 'Warning' : 'Stable';
    return { ...model, points, latest, drop, worst, predictionPsi, severity, drifting: inputs.filter((feature) => feature.severity !== 'Stable').length };
  }));
  readonly visibleModels = computed(() => this.modelStats().filter((model) => this.modelFilter() === 'all' || model.id === this.modelFilter()));

  readonly alerts = computed<DriftAlert[]>(() => {
    const fromFeatures = this.scored()
      .filter((feature) => !feature.muted && feature.severity !== 'Stable')
      .map((feature) => ({
        id: `feature-${feature.id}`,
        title: `${feature.name} shifted`,
        target: feature.name,
        model: feature.model,
        severity: feature.severity,
        score: feature.psi,
        opened: feature.severity === 'Critical' ? 'Today, 06:01' : 'Today, 06:02',
        state: this.alertStates()[`feature-${feature.id}`] ?? 'Open' as AlertState,
        owner: feature.owner,
        note: this.alertNotes()[`feature-${feature.id}`] ?? '',
      }));
    const fromModels = this.modelStats()
      .filter((model) => model.drop >= 0.015)
      .map((model) => ({
        id: `model-${model.id}`,
        title: `${model.name} ${model.metric} dropped`,
        target: model.metric,
        model: model.id,
        severity: (model.drop >= 0.03 ? 'Critical' : 'Warning') as Severity,
        score: model.drop,
        opened: 'Yesterday, 06:00',
        state: this.alertStates()[`model-${model.id}`] ?? 'Open' as AlertState,
        owner: model.owner,
        note: this.alertNotes()[`model-${model.id}`] ?? '',
      }));
    return [...fromModels, ...fromFeatures].sort((a, b) => (a.severity === b.severity ? b.score - a.score : a.severity === 'Critical' ? -1 : 1));
  });
  readonly openAlerts = computed(() => this.alerts().filter((alert) => alert.state === 'Open'));
  readonly tabAlerts = computed(() => this.alerts().filter((alert) => alert.state === (['Open', 'Acknowledged', 'Resolved'] as AlertState[])[this.alertTab()]));
  readonly pagedAlerts = computed(() => this.tabAlerts().slice((this.alertPage() - 1) * 5, this.alertPage() * 5));
  readonly drawerAlert = computed(() => this.alerts().find((alert) => alert.id === this.drawerAlertId()) ?? null);
  readonly drawerFeature = computed(() => {
    const alert = this.drawerAlert();
    return alert?.id.startsWith('feature-') ? this.scored().find((feature) => `feature-${feature.id}` === alert.id) ?? null : null;
  });
  readonly alertList = computed(() => this.openAlerts().slice(0, 4).map((alert) => ({
    label: alert.title,
    description: `${this.modelName(alert.model)} · ${alert.severity} · ${alert.id.startsWith('model-') ? '−' + (alert.score * 100).toFixed(1) + ' pts' : 'PSI ' + alert.score.toFixed(2)}`,
  })));

  readonly ruleStatus = computed(() => this.rules().map((rule) => {
    const over = this.scored().filter((feature) => feature.model === rule.model && !feature.muted && feature.psi >= rule.threshold);
    const running = this.runs().some((run) => run.model === rule.model && run.state !== 'Promoted');
    return { ...rule, over, fires: over.length >= rule.minFeatures, running };
  }));
  readonly firing = computed(() => this.ruleStatus().filter((rule) => rule.enabled && rule.fires && !rule.running));
  readonly activeRun = computed(() => this.runs().find((run) => run.state !== 'Promoted') ?? null);
  readonly runStep = computed(() => {
    const run = this.activeRun();
    return run ? ['Queued', 'Training', 'Validating', 'Promoted'].indexOf(run.state) : 0;
  });
  readonly timeline = computed(() => this.runs().slice().reverse().slice(0, 4).map((run) => ({
    title: `${run.id} · ${this.modelName(run.model)}`,
    description: `${run.reason} · ${run.requestedBy}`,
    timestamp: `${run.started} · ${run.state}`,
    status: run.state === 'Promoted' ? 'complete' as const : 'current' as const,
  })));
  readonly filteredActivity = computed(() => this.activity());
  readonly activityRows = computed(() => this.filteredActivity().slice((this.activityPage() - 1) * 5, this.activityPage() * 5).map(({ event, target, member, time }) => ({ event, target, member, time })));
  readonly sortedTeam = computed(() => {
    const { key, direction } = this.teamSort();
    return [...this.team].sort((a, b) => {
      const cmp = String(a[key as keyof typeof a]).localeCompare(String(b[key as keyof typeof b]));
      return direction === 'asc' ? cmp : -cmp;
    });
  });
  readonly configPreview = computed(() => JSON.stringify({
    schedule: `daily at ${this.checkTime()}`,
    baseline: { start: this.baselineStart(), end: this.baselineEnd() },
    thresholds: { warning: this.warnAt(), critical: this.criticalAt() },
    notify: { channel: this.channel(), to: this.notifyEmail() },
    muted: Object.keys(this.muted()).filter((id) => this.muted()[id]),
  }, null, 2));

  ngOnDestroy(): void {
    this.timers.forEach((timer) => clearInterval(timer));
  }

  navigate(page: number): void {
    this.page.set(page);
    this.error.set('');
  }

  psi(baseline: number[], current: number[], days: number): number {
    const scale = days === 7 ? 0.55 : days === 90 ? 1.3 : 1;
    const eps = 0.0001;
    const raw = baseline.reduce((sum, b, i) => {
      const c = current[i] ?? 0;
      return sum + (c - b) * Math.log((c + eps) / (b + eps));
    }, 0);
    return Math.round(raw * scale * 1000) / 1000;
  }

  severityOf(psi: number): Severity {
    if (psi >= this.criticalAt()) return 'Critical';
    if (psi >= this.warnAt()) return 'Warning';
    return 'Stable';
  }

  tone(severity: Severity | AlertState | RunState): Tone {
    switch (severity) {
      case 'Critical': return 'danger';
      case 'Warning': case 'Acknowledged': case 'Training': case 'Validating': return 'warning';
      case 'Stable': case 'Resolved': case 'Promoted': return 'success';
      case 'Queued': return 'info';
      default: return 'neutral';
    }
  }

  statusTone(severity: Severity): 'success' | 'warning' | 'danger' {
    return severity === 'Critical' ? 'danger' : severity === 'Warning' ? 'warning' : 'success';
  }

  modelName(id: string): string {
    return this.models.find((model) => model.id === id)?.name ?? id;
  }

  windowPoints(weekly: number[]): number[] {
    return this.window() === '7' ? weekly.slice(-2) : this.window() === '90' ? weekly : weekly.slice(-5);
  }

  barHeight(value: number, feature: Feature): number {
    const max = Math.max(...feature.baseline, ...feature.current);
    return Math.max(4, (value / max) * 150);
  }

  trendPath(points: number[], min: number, max: number, width = 300, height = 90): string {
    if (points.length < 2) return '';
    return points.map((point, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - ((point - min) / Math.max(max - min, 0.0001)) * height;
      return `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ');
  }

  modelPath(model: { points: number[]; baseline: number }): string {
    const min = Math.min(...model.points, model.baseline) - 0.01;
    const max = Math.max(...model.points, model.baseline) + 0.005;
    return this.trendPath(model.points, min, max);
  }

  baselineY(model: { points: number[]; baseline: number }): number {
    const min = Math.min(...model.points, model.baseline) - 0.01;
    const max = Math.max(...model.points, model.baseline) + 0.005;
    return 90 - ((model.baseline - min) / (max - min)) * 90;
  }

  psiWidth(psi: number): number {
    return Math.min(100, (psi / this.maxPsi()) * 100);
  }

  meanShift(feature: Feature): string {
    if (feature.kind === 'Categorical') {
      const index = feature.current.reduce((best, value, i) => Math.abs(value - feature.baseline[i]) > Math.abs(feature.current[best] - feature.baseline[best]) ? i : best, 0);
      const delta = (feature.current[index] - feature.baseline[index]) * 100;
      return `${feature.bins[index]} ${delta >= 0 ? '+' : ''}${delta.toFixed(0)} pts`;
    }
    const delta = ((feature.currentMean - feature.baselineMean) / feature.baselineMean) * 100;
    return `${delta >= 0 ? '+' : ''}${delta.toFixed(1)}% mean`;
  }

  featureMeta(feature: Feature & { psi: number; severity: Severity }) {
    return [
      { term: 'Model', description: this.modelName(feature.model) },
      { term: 'Type', description: feature.kind },
      { term: 'Owner', description: feature.owner },
      { term: 'PSI', description: feature.psi.toFixed(3) },
      { term: 'Baseline', description: feature.kind === 'Numeric' ? `${feature.baselineMean} ${feature.unit}` : 'Mix shown in chart' },
      { term: 'Current', description: feature.kind === 'Numeric' ? `${feature.currentMean} ${feature.unit}` : this.meanShift(feature) },
    ];
  }

  onModelNav(event: { label: string }): void {
    const option = this.modelOptions.find((item) => item.label === event.label);
    this.modelFilter.set(option?.value ?? 'all');
    const first = this.visibleFeatures()[0];
    if (first) this.selectedFeatureId.set(first.id);
  }

  selectFeature(id: string): void {
    this.selectedFeatureId.set(id);
  }

  openFeature(id: string): void {
    this.selectedFeatureId.set(id);
    this.navigate(1);
  }

  toggleMute(id: string, value: boolean): void {
    this.muted.update((map) => ({ ...map, [id]: value }));
    const feature = this.features.find((item) => item.id === id);
    this.log(value ? `Muted ${feature?.name}` : `Unmuted ${feature?.name}`, this.modelName(feature?.model ?? ''));
  }

  setSeverityFilter(value: string): void {
    if (value === 'all' || value === 'Stable' || value === 'Warning' || value === 'Critical') this.severityFilter.set(value);
  }

  setAlertState(id: string, state: AlertState): void {
    const alert = this.alerts().find((item) => item.id === id);
    this.alertStates.update((map) => ({ ...map, [id]: state }));
    if (alert) this.log(`${state} “${alert.title}”`, this.modelName(alert.model));
    this.notify(`Alert ${state.toLowerCase()}`, alert ? alert.title : '');
  }

  openAlert(id: string): void {
    this.drawerAlertId.set(id);
  }

  onAlertList(event: { index: number }): void {
    const alert = this.openAlerts()[event.index];
    if (alert) this.openAlert(alert.id);
  }

  closeModal(): void {
    this.modal.set(null);
    this.error.set('');
  }

  openNote(): void {
    this.alertNote.set(this.drawerAlert()?.note ?? '');
    this.error.set('');
    this.modal.set('note');
  }

  saveNote(): void {
    const alert = this.drawerAlert();
    if (!alert) return;
    if (!this.alertNote().trim()) {
      this.error.set('Write a short note before saving.');
      return;
    }
    this.alertNotes.update((map) => ({ ...map, [alert.id]: this.alertNote().trim() }));
    this.error.set('');
    this.modal.set(null);
    this.log(`Added a note to “${alert.title}”`, this.modelName(alert.model));
    this.notify('Note saved', alert.title);
  }

  setAlertTab(index: number): void {
    this.alertTab.set(index);
    this.alertPage.set(1);
  }

  updateRule(id: string, patch: Partial<Rule>): void {
    this.rules.update((rules) => rules.map((rule) => (rule.id === id ? { ...rule, ...patch } : rule)));
  }

  openRetrain(model?: string): void {
    this.retrainModel.set(model ?? (this.modelFilter() !== 'all' ? this.modelFilter() : 'churn'));
    this.retrainReason.set(model ? this.defaultReason(model) : '');
    this.retrainConfirm.set(false);
    this.error.set('');
    this.modal.set('retrain');
  }

  defaultReason(model: string): string {
    const over = this.ruleStatus().find((rule) => rule.model === model)?.over ?? [];
    return over.length ? `Drift on ${over.map((feature) => feature.name).join(', ')}` : '';
  }

  startRetrain(): void {
    if (this.activeRun()) {
      this.error.set('A run is already in progress. Wait for it to finish before starting another.');
      return;
    }
    if (!this.retrainReason().trim()) {
      this.error.set('Add a reason so the team knows why this run started.');
      return;
    }
    if (!this.retrainStart() || !this.retrainEnd()) {
      this.error.set('Choose the training data window.');
      return;
    }
    if (!this.retrainConfirm()) {
      this.error.set('Confirm that the new version will replace the current one after validation.');
      return;
    }
    this.launchRun(this.retrainModel(), this.retrainReason().trim(), 'Ananya Poluru', `${this.retrainStart()} – ${this.retrainEnd()}`);
    this.error.set('');
    this.modal.set(null);
  }

  runRule(model: string): void {
    if (this.activeRun()) {
      this.notify('Run in progress', 'Wait for the current run to finish.');
      return;
    }
    this.launchRun(model, this.defaultReason(model) || 'Rule threshold crossed', 'Retraining rule', 'Last 30 days');
  }

  launchRun(model: string, reason: string, requestedBy: string, window: string): void {
    const id = `RUN-${1044 + this.runs().length - 2}`;
    this.runs.update((runs) => [...runs, { id, model, reason, requestedBy, window, state: 'Queued', started: 'Just now' }]);
    this.log(`Started ${id}`, this.modelName(model));
    this.notify('Retraining started', `${id} for ${this.modelName(model)} is queued.`);
    const order: RunState[] = ['Queued', 'Training', 'Validating', 'Promoted'];
    const timer = setInterval(() => {
      const run = this.runs().find((item) => item.id === id);
      if (!run) return;
      const next = order[order.indexOf(run.state) + 1];
      if (!next) {
        clearInterval(timer);
        return;
      }
      this.runs.update((runs) => runs.map((item) => (item.id === id ? { ...item, state: next } : item)));
      if (next === 'Promoted') {
        clearInterval(timer);
        this.retrained.update((map) => ({ ...map, [model]: true }));
        this.log(`Promoted ${id}`, this.modelName(model));
        this.notify('New version live', `${id} passed validation. ${this.modelName(model)} inputs now use the new baseline.`);
      }
    }, 2500);
    this.timers.push(timer);
  }

  runsMenu(item: { value: string }): void {
    if (item.value === 'csv') this.exportCsv();
    else this.exportConfig();
  }

  exportCsv(): void {
    const rows = [['feature', 'model', 'psi', 'severity', 'muted'], ...this.scored().map((feature) => [feature.name, this.modelName(feature.model), String(feature.psi), feature.severity, String(feature.muted)])];
    this.download(rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n'), 'drift-report.csv', 'text/csv');
    this.notify('Report downloaded', `${this.scored().length} features in drift-report.csv.`);
  }

  exportConfig(): void {
    this.download(this.configPreview(), 'drift-monitor.json', 'application/json');
    this.notify('Config downloaded', 'drift-monitor.json');
  }

  download(body: string, name: string, type: string): void {
    const url = URL.createObjectURL(new Blob([body], { type }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = name;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  runCheck(): void {
    this.log('Manual drift check finished', this.modelFilter() === 'all' ? 'All models' : this.modelName(this.modelFilter()));
    this.notify('Check complete', `${this.drifting().length} features drifting · ${this.openAlerts().length} open alerts.`);
  }

  onBaseline(range: { start: string; end: string }): void {
    this.baselineStart.set(range.start);
    this.baselineEnd.set(range.end);
  }

  onRetrainWindow(range: { start: string; end: string }): void {
    this.retrainStart.set(range.start);
    this.retrainEnd.set(range.end);
  }

  setWarn(value: number): void {
    this.warnAt.set(Math.round(value) / 100);
  }

  setCritical(value: number): void {
    this.criticalAt.set(Math.round(value) / 100);
  }

  saveSettings(): void {
    if (this.warnAt() >= this.criticalAt()) {
      this.error.set('The warning threshold must be lower than the critical threshold.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.notifyEmail().trim())) {
      this.error.set('Enter a valid email address for alerts.');
      return;
    }
    if (!this.baselineStart() || !this.baselineEnd()) {
      this.error.set('Choose a baseline window.');
      return;
    }
    this.error.set('');
    this.log('Updated monitor settings', 'All models');
    this.notify('Settings saved', `Warning at ${this.warnAt().toFixed(2)}, critical at ${this.criticalAt().toFixed(2)}.`);
  }

  onProfile(item: { value: string }): void {
    const pages: Record<string, number> = { alerts: 3, team: 5, settings: 7 };
    this.navigate(pages[item.value] ?? 0);
    this.menuOpen.set(false);
  }

  log(event: string, target: string): void {
    this.activity.update((rows) => [{ event, target, member: 'Ananya Poluru', time: 'Just now', date: '2026-09-27' }, ...rows]);
  }

  notify(title: string, description = ''): void {
    this.notice.set(description ? `${title}: ${description}` : title);
    this.toastTitle.set(title);
    this.toastBody.set(description);
    this.toastOpen.set(false);
    setTimeout(() => this.toastOpen.set(true));
  }
}
