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
  EdsMenuItemComponent,
  EdsMeterComponent,
  EdsModalComponent,
  EdsNumberInputComponent,
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

type TenantStatus = 'Active' | 'Throttled' | 'Suspended';
type KeyStatus = 'Active' | 'Revoked';
type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

interface Tenant {
  id: string;
  name: string;
  plan: string;
  owner: string;
  region: string;
  status: TenantStatus;
  tokensUsed: number;
  tokenLimit: number;
  rpm: number;
  rpmLimit: number;
  burst: number;
}

interface ApiKey {
  id: string;
  tenantId: string;
  label: string;
  prefix: string;
  scopes: string;
  status: KeyStatus;
  created: string;
  lastUsed: string;
}

interface RateRule {
  id: string;
  name: string;
  scope: string;
  limit: number;
  windowSec: number;
  enabled: boolean;
}

interface QuotaAlert {
  id: string;
  tenantId: string;
  title: string;
  severity: 'High' | 'Medium' | 'Low';
  timestamp: string;
}

interface KeyDraft {
  tenantId: string;
  label: string;
  scopes: string;
}

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
    EdsMenuItemComponent,
    EdsMeterComponent,
    EdsModalComponent,
    EdsNumberInputComponent,
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
  readonly nav = [
    { label: 'Overview' },
    { label: 'Tenants' },
    { label: 'Rate limits' },
    { label: 'Token quotas' },
    { label: 'API keys' },
    { label: 'Usage' },
    { label: 'Alerts' },
    { label: 'Team' },
    { label: 'Settings' },
  ];
  readonly pages = this.nav.map((n) => n.label);
  readonly headings = [
    { eyebrow: 'PLATFORM', title: 'Tenant Quota Manager', summary: 'Multi-tenant rate limits, token quotas, and API key management for AI platform teams.' },
    { eyebrow: 'DIRECTORY', title: 'Tenants', summary: 'Workspaces on the platform with plan, region, and current consumption.' },
    { eyebrow: 'THROTTLE', title: 'Rate limits', summary: 'Requests per minute, burst, and windowed rules per route or tenant.' },
    { eyebrow: 'BUDGET', title: 'Token quotas', summary: 'Monthly token pools and soft or hard caps by plan.' },
    { eyebrow: 'ACCESS', title: 'API keys', summary: 'Issue, rotate, and revoke keys with scoped permissions.' },
    { eyebrow: 'METERING', title: 'Usage', summary: 'Tokens and requests over time for billing and capacity planning.' },
    { eyebrow: 'SIGNALS', title: 'Alerts', summary: 'Threshold breaches and anomaly flags per tenant.' },
    { eyebrow: 'PEOPLE', title: 'Team', summary: 'Who owns tenant onboarding and quota policy.' },
    { eyebrow: 'WORKSPACE', title: 'Settings', summary: 'Defaults, webhooks, and export.' },
  ];
  readonly team = [
    { name: 'Raj Poluru', role: 'Platform admin' },
    { name: 'Sonia Poluru', role: 'FinOps analyst' },
    { name: 'Tarun Poluru', role: 'Security engineer' },
    { name: 'Uma Poluru', role: 'Customer success' },
    { name: 'Varun Poluru', role: 'SRE' },
  ];
  readonly helpAccordion = [
    { heading: 'Soft vs hard cap', content: 'Soft caps warn tenants and trigger alerts. Hard caps return 429 and block further tokens until the next period.', open: true },
    { heading: 'Rate vs quota', content: 'Rate limits protect latency (RPM). Token quotas protect cost (monthly pool).', open: false },
    { heading: 'Key rotation', content: 'Creating a new key does not revoke the old one until you explicitly revoke or set an expiry.', open: false },
  ];
  readonly teamColumns = [
    { key: 'name', label: 'Member' },
    { key: 'role', label: 'Role' },
    { key: 'tenants', label: 'Tenants owned' },
    { key: 'keys', label: 'Keys issued' },
    { key: 'alerts', label: 'Alerts handled' },
  ];
  readonly keyColumns = [
    { key: 'label', label: 'Key' },
    { key: 'tenant', label: 'Tenant' },
    { key: 'prefix', label: 'Prefix' },
    { key: 'scopes', label: 'Scopes' },
    { key: 'lastUsed', label: 'Last used' },
  ];

  readonly tenants = signal<Tenant[]>([
    { id: 't-acme', name: 'Acme Robotics', plan: 'Enterprise', owner: 'Uma Poluru', region: 'us-east', status: 'Active', tokensUsed: 8_200_000, tokenLimit: 10_000_000, rpm: 420, rpmLimit: 600, burst: 80 },
    { id: 't-nova', name: 'Nova Health', plan: 'Pro', owner: 'Raj Poluru', region: 'eu-west', status: 'Throttled', tokensUsed: 2_450_000, tokenLimit: 2_500_000, rpm: 180, rpmLimit: 200, burst: 40 },
    { id: 't-lumen', name: 'Lumen Retail', plan: 'Pro', owner: 'Sonia Poluru', region: 'us-west', status: 'Active', tokensUsed: 890_000, tokenLimit: 2_000_000, rpm: 95, rpmLimit: 200, burst: 40 },
    { id: 't-sandbox', name: 'Poluru Sandbox', plan: 'Trial', owner: 'Tarun Poluru', region: 'us-east', status: 'Active', tokensUsed: 120_000, tokenLimit: 500_000, rpm: 25, rpmLimit: 60, burst: 15 },
    { id: 't-frost', name: 'Frost Analytics', plan: 'Enterprise', owner: 'Varun Poluru', region: 'ap-south', status: 'Suspended', tokensUsed: 0, tokenLimit: 15_000_000, rpm: 0, rpmLimit: 800, burst: 100 },
  ]);

  readonly keys = signal<ApiKey[]>([
    { id: 'k-1', tenantId: 't-acme', label: 'Production inference', prefix: 'pk_live_acme_7f3a', scopes: 'chat,embeddings', status: 'Active', created: 'Aug 12', lastUsed: '2 min ago' },
    { id: 'k-2', tenantId: 't-acme', label: 'Batch eval', prefix: 'pk_live_acme_91bc', scopes: 'chat', status: 'Active', created: 'Sep 01', lastUsed: 'Sep 27' },
    { id: 'k-3', tenantId: 't-nova', label: 'EHR copilot', prefix: 'pk_live_nova_2d11', scopes: 'chat,tools', status: 'Active', created: 'Jul 20', lastUsed: 'Just now' },
    { id: 'k-4', tenantId: 't-lumen', label: 'Store kiosk', prefix: 'pk_test_lumen_88aa', scopes: 'chat', status: 'Revoked', created: 'Jun 05', lastUsed: 'Aug 30' },
  ]);

  readonly rules = signal<RateRule[]>([
    { id: 'r-global', name: 'Global chat completions', scope: 'POST /v1/chat/completions', limit: 1200, windowSec: 60, enabled: true },
    { id: 'r-embed', name: 'Embeddings burst', scope: 'POST /v1/embeddings', limit: 3000, windowSec: 60, enabled: true },
    { id: 'r-tenant', name: 'Per-tenant default RPM', scope: 'tenant:*', limit: 600, windowSec: 60, enabled: true },
    { id: 'r-trial', name: 'Trial plan cap', scope: 'plan:trial', limit: 60, windowSec: 60, enabled: true },
  ]);

  readonly alerts = signal<QuotaAlert[]>([
    { id: 'al-1', tenantId: 't-nova', title: 'Token pool 98% consumed', severity: 'High', timestamp: 'Sep 28, 09:14' },
    { id: 'al-2', tenantId: 't-nova', title: 'RPM throttling active', severity: 'Medium', timestamp: 'Sep 28, 09:10' },
    { id: 'al-3', tenantId: 't-acme', title: 'Approaching monthly token soft cap', severity: 'Low', timestamp: 'Sep 27, 18:00' },
  ]);

  readonly log = signal([
    { title: 'Key pk_test_lumen_88aa revoked', description: 'Tarun Poluru', timestamp: 'Sep 26, 11:02' },
    { title: 'Rate rule trial cap enabled', description: 'Raj Poluru', timestamp: 'Sep 25, 08:40' },
    { title: 'Tenant Frost Analytics suspended', description: 'Billing hold · Sonia Poluru', timestamp: 'Sep 24, 16:20' },
  ]);

  readonly page = signal(0);
  readonly selectedTenantId = signal('t-acme');
  readonly tenantFilter = signal('all');
  readonly tenantSearch = signal('');
  readonly keyFilter = signal('all');
  readonly selectedKeyId = signal('k-1');
  readonly rangeStart = signal('2026-09-01');
  readonly rangeEnd = signal('2026-09-28');
  readonly usageMetric = signal('tokens');
  readonly settingsTab = signal(0);
  readonly settingsTabs = [{ label: 'Policy' }, { label: 'Integrations' }];
  readonly modal = signal<'key' | null>(null);
  readonly keyDraft = signal<KeyDraft>({ tenantId: 't-acme', label: '', scopes: 'chat' });
  readonly notifyEmail = signal('platform@poluru.example');
  readonly digestTime = signal('06:30');
  readonly defaultSoftCap = signal(85);
  readonly enforceHardCap = signal(true);
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

  readonly breadcrumbs = computed(() => [{ label: 'Poluru Labs' }, { label: this.pages[this.page()] }]);
  readonly tenantOptions = computed(() => this.tenants().map((t) => ({ label: t.name, value: t.id })));
  readonly tenantSelectWithAll = computed(() => [{ label: 'All tenants', value: 'all' }, ...this.tenantOptions()]);

  readonly throttledCount = computed(() => this.tenants().filter((t) => t.status === 'Throttled' || t.status === 'Suspended').length);
  readonly activeKeys = computed(() => this.keys().filter((k) => k.status === 'Active').length);
  readonly openAlerts = computed(() => this.alerts().length);
  readonly totalTokensUsed = computed(() => this.tenants().reduce((sum, t) => sum + t.tokensUsed, 0));

  readonly selectedTenant = computed(() => this.tenants().find((t) => t.id === this.selectedTenantId()) ?? this.tenants()[0]);
  readonly filteredTenants = computed(() => {
    const q = this.tenantSearch().trim().toLowerCase();
    const f = this.tenantFilter();
    return this.tenants().filter((t) => (f === 'all' || t.status === f || t.plan === f) && (!q || `${t.name} ${t.owner} ${t.plan}`.toLowerCase().includes(q)));
  });
  readonly tenantMeta = computed(() => {
    const t = this.selectedTenant();
    return [
      { term: 'Plan', description: t.plan },
      { term: 'Region', description: t.region },
      { term: 'Status', description: t.status },
      { term: 'Owner', description: t.owner },
      { term: 'RPM', description: `${t.rpm} / ${t.rpmLimit}` },
      { term: 'Burst', description: `${t.burst} req` },
    ];
  });
  readonly tokenPct = (t: Tenant): number => Math.min(100, Math.round((t.tokensUsed / t.tokenLimit) * 100));
  readonly rpmPct = (t: Tenant): number => Math.min(100, Math.round((t.rpm / t.rpmLimit) * 100));

  readonly tenantKeys = computed(() => this.keys().filter((k) => k.tenantId === this.selectedTenantId()));
  readonly keyRows = computed(() =>
    this.keys()
      .filter((k) => this.keyFilter() === 'all' || k.status === this.keyFilter())
      .map((k) => ({ ...k, tenant: this.tenantName(k.tenantId), prefix: k.prefix })),
  );
  readonly selectedKey = computed(() => this.keys().find((k) => k.id === this.selectedKeyId()) ?? this.keys()[0]);

  readonly weeklyTokens = [620, 710, 680, 820, 790, 860, 840];
  readonly weeklyMax = computed(() => Math.max(...this.weeklyTokens, 1));
  readonly recentLog = computed(() => this.log().map((item) => ({ ...item, status: 'complete' as const })));
  readonly sideNavItems = computed(() => this.filteredTenants().map((t) => ({ label: t.name, description: `${this.tokenPct(t)}% tokens`, active: t.id === this.selectedTenantId() })));

  readonly keyModalItems = computed(() => [
    { term: 'Tenant', description: this.tenantName(this.keyDraft().tenantId) },
    { term: 'Scopes', description: this.keyDraft().scopes },
  ]);

  readonly teamRows = computed(() => {
    const { key, direction } = this.teamSort();
    return this.team
      .map((member) => {
        const tenants = this.tenants().filter((t) => t.owner === member.name).length;
        const keys = this.keys().filter((k) => this.tenants().find((t) => t.id === k.tenantId)?.owner === member.name).length;
        const alerts = member.name === 'Raj Poluru' ? 12 : member.name === 'Sonia Poluru' ? 8 : 3;
        return { ...member, tenants, keys, alerts };
      })
      .sort((a, b) => {
        const av = a[key as keyof typeof a];
        const bv = b[key as keyof typeof b];
        const cmp = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv));
        return direction === 'asc' ? cmp : -cmp;
      });
  });

  tenantName(id: string): string {
    return this.tenants().find((t) => t.id === id)?.name ?? id;
  }

  ruleDetailItems(r: RateRule): { term: string; description: string }[] {
    return [
      { term: 'Limit', description: `${r.limit} req` },
      { term: 'Window', description: `${r.windowSec} sec` },
    ];
  }

  keyDetailItems(key: ApiKey): { term: string; description: string }[] {
    return [
      { term: 'Prefix', description: key.prefix },
      { term: 'Scopes', description: key.scopes },
      { term: 'Created', description: key.created },
    ];
  }

  tone(status: string): Tone {
    const map: Record<string, Tone> = {
      Active: 'success',
      Throttled: 'warning',
      Suspended: 'danger',
      Revoked: 'neutral',
      High: 'danger',
      Medium: 'warning',
      Low: 'brand',
    };
    return map[status] ?? 'brand';
  }

  navigate(page: number): void {
    this.page.set(page);
    this.error.set('');
  }

  selectTenant(id: string): void {
    if (this.tenants().some((t) => t.id === id)) this.selectedTenantId.set(id);
  }

  onSideNav(event: { label: string }): void {
    const t = this.tenants().find((x) => x.name === event.label);
    if (t) this.selectTenant(t.id);
  }

  globalSearch(value: string): void {
    this.search.set(value);
    this.tenantSearch.set(value);
    if (value.trim()) this.navigate(1);
  }

  patchTenantLimits(tokens?: number, rpm?: number, burst?: number): void {
    const id = this.selectedTenantId();
    this.tenants.update((list) =>
      list.map((t) =>
        t.id === id
          ? {
              ...t,
              tokenLimit: tokens ?? t.tokenLimit,
              rpmLimit: rpm ?? t.rpmLimit,
              burst: burst ?? t.burst,
            }
          : t,
      ),
    );
    this.notify('Limits updated', this.selectedTenant().name);
  }

  toggleRule(id: string, enabled: boolean): void {
    this.rules.update((list) => list.map((r) => (r.id === id ? { ...r, enabled } : r)));
  }

  openKeyModal(): void {
    this.keyDraft.set({ tenantId: this.selectedTenantId(), label: '', scopes: 'chat' });
    this.error.set('');
    this.modal.set('key');
  }

  patchKeyDraft(change: Partial<KeyDraft>): void {
    this.keyDraft.update((d) => ({ ...d, ...change }));
  }

  createKey(): void {
    const draft = this.keyDraft();
    if (draft.label.trim().length < 3) {
      this.error.set('Key label must be at least 3 characters.');
      return;
    }
    const prefix = `pk_live_${draft.tenantId.slice(2, 6)}_${Math.random().toString(36).slice(2, 6)}`;
    this.keys.update((list) => [
      { id: `k-${Date.now()}`, tenantId: draft.tenantId, label: draft.label.trim(), prefix, scopes: draft.scopes, status: 'Active', created: 'Today', lastUsed: 'Never' },
      ...list,
    ]);
    this.closeModal();
    this.notify('API key created', prefix);
  }

  revokeKey(id: string): void {
    this.keys.update((list) => list.map((k) => (k.id === id ? { ...k, status: 'Revoked' as KeyStatus } : k)));
    this.notify('Key revoked', id);
  }

  dismissAlert(id: string): void {
    this.alerts.update((list) => list.filter((a) => a.id !== id));
    this.notify('Alert dismissed', id);
  }

  onRange(range: { start: string; end: string }): void {
    this.rangeStart.set(range.start);
    this.rangeEnd.set(range.end);
  }

  exportBoard(): void {
    this.download(JSON.stringify({ tenants: this.tenants(), keys: this.keys(), rules: this.rules() }, null, 2), 'quota-board.json', 'application/json');
  }

  onExportMenu(item: { value: string }): void {
    if (item.value === 'tenants') this.exportTenantsCsv();
  }

  exportTenantsCsv(): void {
    const rows = [
      ['id', 'name', 'plan', 'tokensUsed', 'tokenLimit', 'rpm', 'rpmLimit', 'status'],
      ...this.tenants().map((t) => [t.id, t.name, t.plan, t.tokensUsed, t.tokenLimit, t.rpm, t.rpmLimit, t.status]),
    ];
    this.download(rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n'), 'tenants.csv', 'text/csv');
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
      this.error.set('Enter a valid alert email.');
      return;
    }
    this.error.set('');
    this.notify('Settings saved', `Soft cap ${this.defaultSoftCap()}% · hard cap ${this.enforceHardCap() ? 'on' : 'off'}`);
  }

  onProfile(item: { value: string }): void {
    if (item.value === 'mine') this.globalSearch('Raj');
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
