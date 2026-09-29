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
  EdsEmptyStateComponent,
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
  EdsTreeViewComponent,
  EdsVisuallyHiddenComponent,
} from '@poluru-labs/enterprise-design-system-angular';

type DeployStatus = 'Production' | 'Staging' | 'Registered' | 'Retired';
type LicenseKind = 'Proprietary' | 'Open source';
type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

interface RegistryModel {
  id: string;
  name: string;
  vendor: string;
  license: LicenseKind;
  licenseDetail: string;
  deployment: DeployStatus;
  parentId: string | null;
  contextK: number;
  paramsB: number;
  owner: string;
  updated: string;
  tags: string[];
  latencyMs: number;
}

interface ModelVersion {
  id: string;
  modelId: string;
  label: string;
  artifact: string;
  created: string;
  author: string;
}

interface DeploymentRow {
  id: string;
  modelId: string;
  environment: string;
  region: string;
  status: DeployStatus;
  replicas: number;
  updated: string;
}

interface EndpointRow {
  modelId: string;
  name: string;
  url: string;
  auth: string;
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
    EdsCircularProgressComponent,
    EdsCodeSnippetComponent,
    EdsDataTableComponent,
    EdsDatePickerComponent,
    EdsDateRangePickerComponent,
    EdsDescriptionListComponent,
    EdsDividerComponent,
    EdsDropdownMenuComponent,
    EdsEmptyStateComponent,
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
    { label: 'Catalog' },
    { label: 'Lineage' },
    { label: 'Deployments' },
    { label: 'Versions' },
    { label: 'Endpoints' },
    { label: 'Compare' },
    { label: 'Team' },
    { label: 'Settings' },
  ];
  readonly pages = this.nav.map((n) => n.label);
  readonly headings = [
    { eyebrow: 'REGISTRY', title: 'Model Registry Browser', summary: 'Catalog of all models (proprietary and open source) with cards, lineage, and deployment status.' },
    { eyebrow: 'CATALOG', title: 'Model catalog', summary: 'Browse registered weights and hosted APIs with license and ownership metadata.' },
    { eyebrow: 'PROVENANCE', title: 'Lineage', summary: 'Parent models, fine-tunes, and distillation chains.' },
    { eyebrow: 'RUNTIME', title: 'Deployments', summary: 'Where each model runs and how many replicas are active.' },
    { eyebrow: 'ARTIFACTS', title: 'Versions', summary: 'Immutable artifact URIs and release notes.' },
    { eyebrow: 'ACCESS', title: 'Endpoints', summary: 'Inference URLs and authentication modes per model.' },
    { eyebrow: 'DIFF', title: 'Compare', summary: 'Side-by-side specs for two registry entries.' },
    { eyebrow: 'PEOPLE', title: 'Team', summary: 'Curators and deployment owners.' },
    { eyebrow: 'WORKSPACE', title: 'Settings', summary: 'Sync, webhooks, and export.' },
  ];
  readonly team = [
    { name: 'Karan Poluru', role: 'Registry curator' },
    { name: 'Lina Poluru', role: 'MLOps engineer' },
    { name: 'Mohan Poluru', role: 'Open-source liaison' },
    { name: 'Neha Poluru', role: 'Security reviewer' },
    { name: 'Ojas Poluru', role: 'FinOps' },
  ];
  readonly helpAccordion = [
    { heading: 'Registered vs production', content: 'Registered models are catalog entries only. Production means at least one live deployment serves traffic.', open: true },
    { heading: 'Lineage', content: 'Parent links are manual for external models and automatic for internal fine-tunes.', open: false },
    { heading: 'Open weights', content: 'Open-source entries include license text and download mirrors where applicable.', open: false },
  ];
  readonly teamColumns = [
    { key: 'name', label: 'Member' },
    { key: 'role', label: 'Role' },
    { key: 'models', label: 'Models owned' },
    { key: 'deployments', label: 'Deployments' },
    { key: 'reviews', label: 'Reviews' },
  ];
  readonly deployColumns = [
    { key: 'model', label: 'Model' },
    { key: 'environment', label: 'Environment' },
    { key: 'region', label: 'Region' },
    { key: 'status', label: 'Status' },
    { key: 'replicas', label: 'Replicas' },
  ];
  readonly endpointColumns = [
    { key: 'model', label: 'Model' },
    { key: 'name', label: 'Endpoint' },
    { key: 'url', label: 'URL' },
    { key: 'auth', label: 'Auth' },
  ];
  readonly treeExpanded: Record<string, boolean> = { Proprietary: true, 'Open source': true };

  readonly models = signal<RegistryModel[]>([
    { id: 'm-assist', name: 'Poluru Assistant v3.2', vendor: 'Poluru Labs', license: 'Proprietary', licenseDetail: 'Internal', deployment: 'Production', parentId: 'm-assist-base', contextK: 128, paramsB: 8, owner: 'Karan Poluru', updated: 'Sep 28', tags: ['chat', 'tools'], latencyMs: 420 },
    { id: 'm-assist-base', name: 'Poluru Assistant base', vendor: 'Poluru Labs', license: 'Proprietary', licenseDetail: 'Internal', deployment: 'Staging', parentId: 'm-llama', contextK: 128, paramsB: 8, owner: 'Lina Poluru', updated: 'Sep 20', tags: ['base'], latencyMs: 380 },
    { id: 'm-llama', name: 'Llama 3.1 70B', vendor: 'Meta', license: 'Open source', licenseDetail: 'Llama 3.1', deployment: 'Registered', parentId: null, contextK: 128, paramsB: 70, owner: 'Mohan Poluru', updated: 'Aug 02', tags: ['oss', 'base'], latencyMs: 890 },
    { id: 'm-gpt', name: 'GPT-4o', vendor: 'OpenAI', license: 'Proprietary', licenseDetail: 'API terms', deployment: 'Production', parentId: null, contextK: 128, paramsB: 0, owner: 'Neha Poluru', updated: 'Sep 15', tags: ['shadow', 'api'], latencyMs: 510 },
    { id: 'm-claude', name: 'Claude Sonnet', vendor: 'Anthropic', license: 'Proprietary', licenseDetail: 'API terms', deployment: 'Staging', parentId: null, contextK: 200, paramsB: 0, owner: 'Neha Poluru', updated: 'Sep 10', tags: ['shadow'], latencyMs: 480 },
    { id: 'm-rerank', name: 'Poluru Reranker 1.8', vendor: 'Poluru Labs', license: 'Proprietary', licenseDetail: 'Internal', deployment: 'Production', parentId: 'm-bge', contextK: 8, paramsB: 0.3, owner: 'Lina Poluru', updated: 'Sep 25', tags: ['embeddings'], latencyMs: 95 },
    { id: 'm-bge', name: 'BGE-large-en-v1.5', vendor: 'BAAI', license: 'Open source', licenseDetail: 'MIT', deployment: 'Registered', parentId: null, contextK: 0.5, paramsB: 0.33, owner: 'Mohan Poluru', updated: 'Jul 18', tags: ['oss', 'embeddings'], latencyMs: 40 },
    { id: 'm-mistral', name: 'Mistral Large', vendor: 'Mistral', license: 'Proprietary', licenseDetail: 'Commercial API', deployment: 'Retired', parentId: null, contextK: 128, paramsB: 0, owner: 'Ojas Poluru', updated: 'Jun 01', tags: ['legacy'], latencyMs: 0 },
  ]);

  readonly versions = signal<ModelVersion[]>([
    { id: 'ver-1', modelId: 'm-assist', label: '3.2.0', artifact: 's3://poluru-models/assist/3.2.0/', created: 'Sep 28', author: 'Karan Poluru' },
    { id: 'ver-2', modelId: 'm-assist', label: '3.1.4', artifact: 's3://poluru-models/assist/3.1.4/', created: 'Sep 12', author: 'Lina Poluru' },
    { id: 'ver-3', modelId: 'm-rerank', label: '1.8.1', artifact: 's3://poluru-models/rerank/1.8.1/', created: 'Sep 25', author: 'Lina Poluru' },
  ]);

  readonly deployments = signal<DeploymentRow[]>([
    { id: 'd-1', modelId: 'm-assist', environment: 'Production', region: 'us-east', status: 'Production', replicas: 12, updated: 'Sep 28' },
    { id: 'd-2', modelId: 'm-assist-base', environment: 'Staging', region: 'us-east', status: 'Staging', replicas: 4, updated: 'Sep 27' },
    { id: 'd-3', modelId: 'm-gpt', environment: 'Shadow', region: 'us-east', status: 'Production', replicas: 2, updated: 'Sep 26' },
    { id: 'd-4', modelId: 'm-rerank', environment: 'Production', region: 'eu-west', status: 'Production', replicas: 6, updated: 'Sep 25' },
  ]);

  readonly endpoints = signal<EndpointRow[]>([
    { modelId: 'm-assist', name: 'Chat completions', url: 'https://api.poluru.example/v1/chat', auth: 'Bearer API key' },
    { modelId: 'm-rerank', name: 'Rerank', url: 'https://api.poluru.example/v1/rerank', auth: 'Bearer API key' },
    { modelId: 'm-gpt', name: 'Shadow proxy', url: 'https://shadow.poluru.example/openai', auth: 'Internal mTLS' },
  ]);

  readonly log = signal([
    { title: 'Registered Poluru Assistant v3.2', description: 'Karan Poluru · production deploy queued', timestamp: 'Sep 28, 09:00' },
    { title: 'Retired Mistral Large', description: 'Cost optimization · Ojas Poluru', timestamp: 'Jun 01, 14:00' },
    { title: 'Added BGE mirror', description: 'Mohan Poluru · open-source catalog', timestamp: 'Jul 18, 11:30' },
  ]);

  readonly page = signal(0);
  readonly selectedModelId = signal('m-assist');
  readonly compareA = signal('m-assist');
  readonly compareB = signal('m-gpt');
  readonly catalogFilter = signal('all');
  readonly catalogSearch = signal('');
  readonly catalogPage = signal(1);
  readonly deployFilter = signal('all');
  readonly rangeStart = signal('2026-09-01');
  readonly rangeEnd = signal('2026-09-28');
  readonly settingsTab = signal(0);
  readonly settingsTabs = [{ label: 'Sync' }, { label: 'Export' }];
  readonly modal = signal<'register' | null>(null);
  readonly registerName = signal('');
  readonly notifyEmail = signal('registry@poluru.example');
  readonly autoSync = signal(true);
  readonly routingWeight = signal(80);
  readonly defaultCatalogView = signal('cards');
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
  readonly modelOptions = computed(() => this.models().map((m) => ({ label: m.name, value: m.id })));

  readonly prodCount = computed(() => this.models().filter((m) => m.deployment === 'Production').length);
  readonly ossCount = computed(() => this.models().filter((m) => m.license === 'Open source').length);
  readonly registeredOnly = computed(() => this.models().filter((m) => m.deployment === 'Registered').length);

  readonly selectedModel = computed(() => this.models().find((m) => m.id === this.selectedModelId()) ?? this.models()[0]);
  readonly filteredCatalog = computed(() => {
    const q = this.catalogSearch().trim().toLowerCase();
    const f = this.catalogFilter();
    return this.models().filter((m) => {
      const typeOk = f === 'all' || m.license === f || m.deployment === f;
      return typeOk && (!q || `${m.name} ${m.vendor} ${m.tags.join(' ')}`.toLowerCase().includes(q));
    });
  });
  readonly pagedCatalog = computed(() => this.filteredCatalog().slice((this.catalogPage() - 1) * 6, this.catalogPage() * 6));
  readonly modelMeta = computed(() => {
    const m = this.selectedModel();
    return [
      { term: 'Vendor', description: m.vendor },
      { term: 'License', description: `${m.license} · ${m.licenseDetail}` },
      { term: 'Deployment', description: m.deployment },
      { term: 'Context', description: `${m.contextK}k tokens` },
      { term: 'Parameters', description: m.paramsB ? `${m.paramsB}B` : 'Hosted API' },
      { term: 'Owner', description: m.owner },
    ];
  });
  readonly lineageChain = computed(() => {
    const chain: RegistryModel[] = [];
    let current: RegistryModel | undefined = this.selectedModel();
    const seen = new Set<string>();
    while (current && !seen.has(current.id)) {
      chain.unshift(current);
      seen.add(current.id);
      current = current.parentId ? this.models().find((m) => m.id === current!.parentId) : undefined;
    }
    return chain;
  });
  readonly lineageTree = computed(() => [
    {
      id: 'Proprietary',
      label: 'Proprietary',
      children: this.models().filter((m) => m.license === 'Proprietary').map((m) => ({ id: m.id, label: m.name })),
    },
    {
      id: 'Open source',
      label: 'Open source',
      children: this.models().filter((m) => m.license === 'Open source').map((m) => ({ id: m.id, label: m.name })),
    },
  ]);
  readonly modelVersions = computed(() => this.versions().filter((v) => v.modelId === this.selectedModelId()));
  readonly deployRows = computed(() =>
    this.deployments()
      .filter((d) => this.deployFilter() === 'all' || d.status === this.deployFilter())
      .map((d) => ({ ...d, model: this.modelName(d.modelId) })),
  );
  readonly endpointRows = computed(() => this.endpoints().map((e) => ({ ...e, model: this.modelName(e.modelId) })));
  readonly sideNavItems = computed(() =>
    this.filteredCatalog().slice(0, 8).map((m) => ({ label: m.name, description: m.deployment, active: m.id === this.selectedModelId() })),
  );
  readonly compareMetaA = computed(() => this.compareItems(this.compareA()));
  readonly compareMetaB = computed(() => this.compareItems(this.compareB()));

  readonly weeklyRegistrations = [1, 2, 1, 3, 2, 4, 2];
  readonly weeklyMax = computed(() => Math.max(...this.weeklyRegistrations, 1));
  readonly recentLog = computed(() => this.log().map((i) => ({ ...i, status: 'complete' as const })));

  readonly teamRows = computed(() => {
    const { key, direction } = this.teamSort();
    return this.team
      .map((member) => ({
        ...member,
        models: this.models().filter((m) => m.owner === member.name).length,
        deployments: this.deployments().filter((d) => this.models().find((m) => m.id === d.modelId)?.owner === member.name).length,
        reviews: member.name === 'Neha Poluru' ? 11 : 5,
      }))
      .sort((a, b) => {
        const av = a[key as keyof typeof a];
        const bv = b[key as keyof typeof b];
        const cmp = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv));
        return direction === 'asc' ? cmp : -cmp;
      });
  });

  modelName(id: string): string {
    return this.models().find((m) => m.id === id)?.name ?? id;
  }

  compareItems(id: string): { term: string; description: string }[] {
    const m = this.models().find((x) => x.id === id);
    if (!m) return [];
    return [
      { term: 'Vendor', description: m.vendor },
      { term: 'Context', description: `${m.contextK}k` },
      { term: 'Latency p95', description: m.latencyMs ? `${m.latencyMs} ms` : '—' },
      { term: 'Deployment', description: m.deployment },
    ];
  }

  artifactSnippet(v: ModelVersion): string {
    return `artifact:\n  model: ${this.modelName(v.modelId)}\n  version: ${v.label}\n  uri: ${v.artifact}`;
  }

  tone(status: string): Tone {
    const map: Record<string, Tone> = {
      Production: 'success',
      Staging: 'info',
      Registered: 'neutral',
      Retired: 'warning',
      Proprietary: 'brand',
      'Open source': 'success',
    };
    return map[status] ?? 'brand';
  }

  navigate(page: number): void {
    this.page.set(page);
    this.error.set('');
  }

  selectModel(id: string): void {
    if (this.models().some((m) => m.id === id)) this.selectedModelId.set(id);
  }

  onSideNav(event: { label: string }): void {
    const m = this.models().find((x) => x.name === event.label);
    if (m) this.selectModel(m.id);
  }

  globalSearch(value: string): void {
    this.search.set(value);
    this.catalogSearch.set(value);
    if (value.trim()) this.navigate(1);
  }

  openRegister(): void {
    this.registerName.set('');
    this.modal.set('register');
  }

  confirmRegister(): void {
    if (this.registerName().trim().length < 4) {
      this.error.set('Model name must be at least 4 characters.');
      return;
    }
    const id = `m-${Date.now()}`;
    this.models.update((list) => [
      ...list,
      {
        id,
        name: this.registerName().trim(),
        vendor: 'Poluru Labs',
        license: 'Proprietary',
        licenseDetail: 'Internal',
        deployment: 'Registered',
        parentId: null,
        contextK: 32,
        paramsB: 1,
        owner: 'Karan Poluru',
        updated: 'Today',
        tags: ['new'],
        latencyMs: 0,
      },
    ]);
    this.selectModel(id);
    this.closeModal();
    this.notify('Model registered', this.registerName().trim());
  }

  onRange(range: { start: string; end: string }): void {
    this.rangeStart.set(range.start);
    this.rangeEnd.set(range.end);
  }

  exportRegistry(): void {
    this.download(JSON.stringify({ models: this.models(), versions: this.versions(), deployments: this.deployments() }, null, 2), 'model-registry.json', 'application/json');
  }

  onExportMenu(item: { value: string }): void {
    if (item.value === 'csv') this.exportCatalogCsv();
  }

  exportCatalogCsv(): void {
    const rows = [
      ['id', 'name', 'vendor', 'license', 'deployment', 'owner'],
      ...this.models().map((m) => [m.id, m.name, m.vendor, m.license, m.deployment, m.owner]),
    ];
    this.download(rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n'), 'catalog.csv', 'text/csv');
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
      this.error.set('Enter a valid notification email.');
      return;
    }
    this.error.set('');
    this.notify('Settings saved', `Auto-sync ${this.autoSync() ? 'on' : 'off'}`);
  }

  onProfile(item: { value: string }): void {
    if (item.value === 'mine') this.globalSearch('Karan');
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
