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
  EdsTooltipComponent,
  EdsTreeViewComponent,
  EdsVisuallyHiddenComponent,
} from '@poluru-labs/enterprise-design-system-angular';

type ReleaseStatus = 'Draft' | 'In review' | 'Staging verified' | 'Blocked' | 'Promoted';
type GateResult = 'Pass' | 'Fail' | 'Pending' | 'Skipped';
type ArtifactKind = 'Model' | 'Prompt pack';
type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

interface ChecklistItem {
  id: string;
  label: string;
  assignee: string;
  required: boolean;
  done: boolean;
}

interface QualityGate {
  id: string;
  name: string;
  category: string;
  threshold: string;
  required: boolean;
  result: GateResult;
  measured: string;
}

interface Release {
  id: string;
  name: string;
  kind: ArtifactKind;
  version: string;
  status: ReleaseStatus;
  owner: string;
  targetDate: string;
  updated: string;
  stagingRef: string;
  productionRef: string;
  gates: QualityGate[];
  checklist: ChecklistItem[];
}

interface Approval {
  id: string;
  releaseId: string;
  role: string;
  approver: string;
  decision: 'Approved' | 'Rejected' | 'Pending';
  timestamp: string;
}

interface ArtifactRow {
  id: string;
  name: string;
  kind: ArtifactKind;
  stagingVersion: string;
  productionVersion: string;
  owner: string;
}

interface PromoteDraft {
  releaseId: string;
  window: string;
  rollbackPlan: string;
  notify: boolean;
}

const GATE_CATEGORIES = ['Evaluation', 'Security', 'Performance', 'Compliance', 'Operations'];

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
  readonly gateCategories = GATE_CATEGORIES;
  readonly gateCategoryOptions = [{ label: 'All', value: 'all' }, ...GATE_CATEGORIES.map((c) => ({ label: c, value: c }))];
  readonly pages = ['Overview', 'Releases', 'Gates', 'Checklists', 'Artifacts', 'Approvals', 'Pipeline', 'Team', 'Settings'];
  readonly headings = [
    { eyebrow: 'RELEASE', title: 'AI Release Gates Board', summary: 'Quality gates and sign-off checklists for promoting models and prompts from staging to production.' },
    { eyebrow: 'CANDIDATES', title: 'Releases', summary: 'Promotion requests moving through staging verification and production approval.' },
    { eyebrow: 'QUALITY', title: 'Gates', summary: 'Automated and manual thresholds every release must satisfy.' },
    { eyebrow: 'SIGN-OFF', title: 'Checklists', summary: 'Human tasks assigned to owners before promote is allowed.' },
    { eyebrow: 'INVENTORY', title: 'Artifacts', summary: 'Models and prompt packs with staging vs production versions.' },
    { eyebrow: 'APPROVALS', title: 'Approvals', summary: 'Recorded decisions from engineering, safety, and operations.' },
    { eyebrow: 'FLOW', title: 'Pipeline', summary: 'Where the selected release sits from draft through production.' },
    { eyebrow: 'PEOPLE', title: 'Team', summary: 'Release managers and gate owners.' },
    { eyebrow: 'WORKSPACE', title: 'Settings', summary: 'Promotion windows, notifications, and export.' },
  ];
  readonly team = [
    { name: 'Nisha Poluru', role: 'Release manager' },
    { name: 'Harish Poluru', role: 'ML platform lead' },
    { name: 'Priya Poluru', role: 'Safety reviewer' },
    { name: 'Omar Poluru', role: 'SRE on-call' },
    { name: 'Leela Poluru', role: 'Legal & compliance' },
  ];
  readonly helpAccordion = [
    { heading: 'Gates vs checklist', content: 'Gates are measured automatically (metrics, eval scores, scans). Checklist items are manual attestations with named owners.', open: true },
    { heading: 'Blocked releases', content: 'Any required gate failure or missing checklist item blocks promotion until resolved or waived in Settings.', open: false },
    { heading: 'Prompt packs', content: 'Prompt pack releases follow the same pipeline as model weights but skip latency gates by default.', open: false },
  ];
  readonly teamColumns = [
    { key: 'name', label: 'Member' },
    { key: 'role', label: 'Role' },
    { key: 'releases', label: 'Releases owned' },
    { key: 'approvals', label: 'Approvals this month' },
    { key: 'openItems', label: 'Open checklist items' },
  ];
  readonly approvalColumns = [
    { key: 'release', label: 'Release' },
    { key: 'role', label: 'Role' },
    { key: 'approver', label: 'Approver' },
    { key: 'decision', label: 'Decision' },
    { key: 'timestamp', label: 'When' },
  ];
  readonly artifactColumns = [
    { key: 'name', label: 'Artifact' },
    { key: 'kind', label: 'Type' },
    { key: 'stagingVersion', label: 'Staging' },
    { key: 'productionVersion', label: 'Production' },
    { key: 'owner', label: 'Owner' },
  ];
  readonly pipelineLabels = ['Draft', 'In review', 'Staging verified', 'Approved', 'Promoted'];
  readonly treeExpanded: Record<string, boolean> = Object.fromEntries(GATE_CATEGORIES.map((c) => [c, true]));

  readonly defaultGates = (): QualityGate[] => [
    { id: 'g-eval', name: 'Eval regression', category: 'Evaluation', threshold: '≥ baseline − 2%', required: true, result: 'Pass', measured: '−0.4% vs prod' },
    { id: 'g-red', name: 'Red team pass rate', category: 'Security', threshold: '≥ 85%', required: true, result: 'Pass', measured: '88%' },
    { id: 'g-lat', name: 'Latency p95', category: 'Performance', threshold: '≤ 820 ms', required: true, result: 'Pending', measured: '794 ms (staging)' },
    { id: 'g-cost', name: 'Cost per 1k tokens', category: 'Operations', threshold: '≤ $0.018', required: false, result: 'Pass', measured: '$0.016' },
    { id: 'g-legal', name: 'Legal attestation', category: 'Compliance', threshold: 'Signed', required: true, result: 'Pending', measured: 'Awaiting Leela Poluru' },
  ];

  readonly releases = signal<Release[]>([
    this.makeRelease('rel-301', 'Assistant v3.2 weights', 'Model', '3.2.0', 'In review', 'Harish Poluru', 'Oct 2', 'Sep 28', 'weights@sha-a91f', 'weights@sha-7c02', this.defaultGates(), [
      { id: 'c1', label: 'Runbook updated for rollback', assignee: 'Omar Poluru', required: true, done: true },
      { id: 'c2', label: 'Shadow traffic 24h green', assignee: 'Harish Poluru', required: true, done: true },
      { id: 'c3', label: 'Customer comms draft approved', assignee: 'Nisha Poluru', required: false, done: false },
    ]),
    this.makeRelease('rel-298', 'Support prompt pack Q4', 'Prompt pack', '2026.4', 'Staging verified', 'Priya Poluru', 'Oct 1', 'Sep 27', 'prompts/support-q4.json', 'prompts/support-q3.json', [
      { id: 'g-eval', name: 'Eval regression', category: 'Evaluation', threshold: '≥ baseline − 2%', required: true, result: 'Pass', measured: '+1.1%' },
      { id: 'g-red', name: 'Red team pass rate', category: 'Security', threshold: '≥ 85%', required: true, result: 'Pass', measured: '92%' },
      { id: 'g-legal', name: 'Legal attestation', category: 'Compliance', threshold: 'Signed', required: true, result: 'Pass', measured: 'Signed Sep 26' },
    ], [
      { id: 'c4', label: 'Localization review complete', assignee: 'Priya Poluru', required: true, done: true },
      { id: 'c5', label: 'Help center snippets updated', assignee: 'Nisha Poluru', required: true, done: true },
    ]),
    this.makeRelease('rel-295', 'Reranker micro-model', 'Model', '1.8.1', 'Blocked', 'Harish Poluru', 'Sep 30', 'Sep 25', 'reranker@1.8.1-stg', 'reranker@1.8.0', [
      { id: 'g-eval', name: 'Eval regression', category: 'Evaluation', threshold: '≥ baseline − 2%', required: true, result: 'Fail', measured: '−4.2% vs prod' },
      { id: 'g-lat', name: 'Latency p95', category: 'Performance', threshold: '≤ 120 ms', required: true, result: 'Pass', measured: '98 ms' },
    ], [
      { id: 'c6', label: 'Failure analysis doc linked', assignee: 'Harish Poluru', required: true, done: false },
    ]),
    this.makeRelease('rel-290', 'Copilot tool schema v5', 'Prompt pack', '5.0.0', 'Promoted', 'Nisha Poluru', 'Sep 20', 'Sep 20', 'tools@v5', 'tools@v4', [], []),
  ]);

  readonly approvals = signal<Approval[]>([
    { id: 'a-1', releaseId: 'rel-298', role: 'Safety', approver: 'Priya Poluru', decision: 'Approved', timestamp: 'Sep 27, 11:00' },
    { id: 'a-2', releaseId: 'rel-298', role: 'Operations', approver: 'Omar Poluru', decision: 'Approved', timestamp: 'Sep 27, 14:20' },
    { id: 'a-3', releaseId: 'rel-301', role: 'Safety', approver: 'Priya Poluru', decision: 'Pending', timestamp: '—' },
    { id: 'a-4', releaseId: 'rel-301', role: 'Legal', approver: 'Leela Poluru', decision: 'Pending', timestamp: '—' },
    { id: 'a-5', releaseId: 'rel-295', role: 'ML platform', approver: 'Harish Poluru', decision: 'Rejected', timestamp: 'Sep 25, 09:40' },
  ]);

  readonly artifacts = signal<ArtifactRow[]>([
    { id: 'art-1', name: 'Poluru Assistant weights', kind: 'Model', stagingVersion: '3.2.0', productionVersion: '3.1.4', owner: 'Harish Poluru' },
    { id: 'art-2', name: 'Support prompt pack', kind: 'Prompt pack', stagingVersion: '2026.4', productionVersion: '2026.3', owner: 'Priya Poluru' },
    { id: 'art-3', name: 'Reranker', kind: 'Model', stagingVersion: '1.8.1', productionVersion: '1.8.0', owner: 'Harish Poluru' },
    { id: 'art-4', name: 'Copilot tool schema', kind: 'Prompt pack', stagingVersion: '5.0.0', productionVersion: '5.0.0', owner: 'Nisha Poluru' },
  ]);

  readonly log = signal([
    { title: 'Gate failed on rel-295', description: 'Eval regression −4.2% · Harish Poluru', timestamp: 'Sep 25, 09:38' },
    { title: 'Staging verified rel-298', description: 'Support prompt pack Q4', timestamp: 'Sep 27, 16:10' },
    { title: 'Promoted rel-290', description: 'Copilot tool schema v5 · Nisha Poluru', timestamp: 'Sep 20, 10:05' },
  ]);

  readonly page = signal(0);
  readonly selectedReleaseId = signal('rel-301');
  readonly releaseFilter = signal('all');
  readonly releaseSearch = signal('');
  readonly releasePage = signal(1);
  readonly gateCategory = signal('all');
  readonly checklistReleaseId = signal('rel-301');
  readonly artifactKind = signal('all');
  readonly approvalFilter = signal('all');
  readonly rangeStart = signal('2026-09-01');
  readonly rangeEnd = signal('2026-09-28');
  readonly settingsTab = signal(0);
  readonly settingsTabs = [{ label: 'Promotion' }, { label: 'Alerts & export' }];
  readonly modal = signal<'promote' | null>(null);
  readonly promoteDraft = signal<PromoteDraft>({ releaseId: 'rel-301', window: '2026-10-02', rollbackPlan: 'Revert to weights@sha-7c02', notify: true });
  readonly notifyEmail = signal('releases@poluru.example');
  readonly digestTime = signal('08:00');
  readonly minApprovals = signal(2);
  readonly autoBlockOnFail = signal(true);
  readonly defaultArtifactKind = signal<'Model' | 'Prompt pack'>('Model');
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
  readonly releaseOptions = computed(() => this.releases().map((r) => ({ label: r.name, value: r.id })));

  readonly inReview = computed(() => this.releases().filter((r) => r.status !== 'Promoted' && r.status !== 'Draft'));
  readonly sidebarList = computed(() =>
    this.inReview().slice(0, 4).map((r) => ({
      label: r.name,
      description: `${r.status} · ${r.version}`,
      selected: r.id === this.selectedReleaseId(),
    })),
  );
  readonly blockedCount = computed(() => this.releases().filter((r) => r.status === 'Blocked').length);
  readonly pendingApprovals = computed(() => this.approvals().filter((a) => a.decision === 'Pending').length);
  readonly promotedThisMonth = computed(() => this.releases().filter((r) => r.status === 'Promoted').length);
  readonly gatePassRate = computed(() => {
    const gates = this.releases().flatMap((r) => r.gates);
    const required = gates.filter((g) => g.required && g.result !== 'Skipped');
    if (!required.length) return 100;
    const pass = required.filter((g) => g.result === 'Pass').length;
    return Math.round((pass / required.length) * 100);
  });

  readonly selectedRelease = computed(() => this.releases().find((r) => r.id === this.selectedReleaseId()) ?? this.releases()[0]);
  readonly checklistRelease = computed(() => this.releases().find((r) => r.id === this.checklistReleaseId()) ?? this.releases()[0]);
  readonly filteredReleases = computed(() => {
    const q = this.releaseSearch().trim().toLowerCase();
    const f = this.releaseFilter();
    return this.releases().filter((r) => (f === 'all' || r.status === f || r.kind === f) && (!q || `${r.name} ${r.version} ${r.owner}`.toLowerCase().includes(q)));
  });
  readonly pagedReleases = computed(() => this.filteredReleases().slice((this.releasePage() - 1) * 5, this.releasePage() * 5));
  readonly releaseMeta = computed(() => {
    const r = this.selectedRelease();
    return [
      { term: 'Type', description: r.kind },
      { term: 'Version', description: r.version },
      { term: 'Status', description: r.status },
      { term: 'Owner', description: r.owner },
      { term: 'Target date', description: r.targetDate },
      { term: 'Updated', description: r.updated },
    ];
  });
  readonly releaseProgress = computed(() => {
    const r = this.selectedRelease();
    const gates = r.gates.filter((g) => g.required);
    const gateDone = gates.filter((g) => g.result === 'Pass').length;
    const checks = r.checklist.filter((c) => c.required);
    const checkDone = checks.filter((c) => c.done).length;
    const total = gates.length + checks.length || 1;
    return Math.round(((gateDone + checkDone) / total) * 100);
  });
  readonly releaseDiff = computed(() => {
    const r = this.selectedRelease();
    return { staging: r.stagingRef, production: r.productionRef };
  });
  readonly promoteReady = computed(() => {
    const r = this.selectedRelease();
    if (r.status === 'Blocked' || r.status === 'Promoted') return false;
    const gatesOk = r.gates.filter((g) => g.required).every((g) => g.result === 'Pass' || g.result === 'Skipped');
    const checksOk = r.checklist.filter((c) => c.required).every((c) => c.done);
    const approvalsOk = this.approvals().filter((a) => a.releaseId === r.id && a.decision === 'Pending').length === 0;
    return gatesOk && checksOk && approvalsOk;
  });

  readonly allGates = computed(() => {
    const map = new Map<string, QualityGate & { releases: number }>();
    for (const r of this.releases()) {
      for (const g of r.gates) {
        const prev = map.get(g.id);
        map.set(g.id, { ...g, releases: (prev?.releases ?? 0) + 1 });
      }
    }
    return [...map.values()];
  });
  readonly filteredGates = computed(() => {
    const c = this.gateCategory();
    return this.allGates().filter((g) => c === 'all' || g.category === c);
  });
  readonly gateTree = computed(() =>
    this.gateCategories.map((category) => ({
      id: category,
      label: category,
      children: this.filteredGates()
        .filter((g) => g.category === category)
        .map((g) => ({ id: g.id, label: `${g.name} (${g.result})` })),
    })),
  );

  readonly filteredArtifacts = computed(() => {
    const k = this.artifactKind();
    return this.artifacts().filter((a) => k === 'all' || a.kind === k);
  });
  readonly artifactTableRows = computed(() =>
    this.filteredArtifacts().map((a) => ({
      name: a.name,
      kind: a.kind,
      stagingVersion: a.stagingVersion,
      productionVersion: a.productionVersion,
      owner: a.owner,
    })),
  );
  readonly filteredApprovals = computed(() => {
    const f = this.approvalFilter();
    return this.approvals().filter((a) => f === 'all' || a.decision === f);
  });
  readonly approvalRows = computed(() =>
    this.filteredApprovals().map((a) => ({
      ...a,
      release: this.releaseName(a.releaseId),
    })),
  );

  readonly pipelineIndex = computed(() => {
    const order: ReleaseStatus[] = ['Draft', 'In review', 'Staging verified', 'Blocked', 'Promoted'];
    const s = this.selectedRelease().status;
    if (s === 'Blocked') return 2;
    if (s === 'Promoted') return 4;
    if (s === 'Staging verified') return 2;
    if (s === 'In review') return 1;
    return 0;
  });
  readonly stepperSteps = computed(() => this.pipelineLabels.map((label) => ({ label })));
  readonly promoteModalItems = computed(() => {
    const r = this.selectedRelease();
    return [
      { term: 'Release', description: r.name },
      { term: 'Staging ref', description: r.stagingRef },
      { term: 'Production ref (current)', description: r.productionRef },
    ];
  });

  readonly weeklyPromotions = [1, 0, 2, 1, 3, 2, 1];
  readonly weeklyMax = computed(() => Math.max(...this.weeklyPromotions, 1));
  readonly recentLog = computed(() => this.log().map((item) => ({ ...item, status: 'complete' as const })));

  readonly teamRows = computed(() => {
    const { key, direction } = this.teamSort();
    return this.team
      .map((member) => {
        const releases = this.releases().filter((r) => r.owner === member.name).length;
        const approvals = this.approvals().filter((a) => a.approver === member.name && a.decision === 'Approved').length;
        const openItems = this.releases()
          .flatMap((r) => r.checklist)
          .filter((c) => c.assignee === member.name && !c.done).length;
        return { ...member, releases, approvals, openItems };
      })
      .sort((a, b) => {
        const av = a[key as keyof typeof a];
        const bv = b[key as keyof typeof b];
        const cmp = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv));
        return direction === 'asc' ? cmp : -cmp;
      });
  });

  makeRelease(
    id: string,
    name: string,
    kind: ArtifactKind,
    version: string,
    status: ReleaseStatus,
    owner: string,
    targetDate: string,
    updated: string,
    stagingRef: string,
    productionRef: string,
    gates: QualityGate[],
    checklist: ChecklistItem[],
  ): Release {
    return { id, name, kind, version, status, owner, targetDate, updated, stagingRef, productionRef, gates, checklist };
  }

  releaseName(id: string): string {
    return this.releases().find((r) => r.id === id)?.name ?? id;
  }

  releaseReadiness(r: Release): number {
    const gates = r.gates.filter((g) => g.required);
    const gateDone = gates.filter((g) => g.result === 'Pass').length;
    const checks = r.checklist.filter((c) => c.required);
    const checkDone = checks.filter((c) => c.done).length;
    const total = gates.length + checks.length || 1;
    return Math.round(((gateDone + checkDone) / total) * 100);
  }

  patchPromoteDraft(change: Partial<PromoteDraft>): void {
    this.promoteDraft.update((d) => ({ ...d, ...change }));
  }

  setDefaultArtifactKind(value: string): void {
    if (value === 'Model' || value === 'Prompt pack') this.defaultArtifactKind.set(value);
  }

  statusVariant(status: string): 'success' | 'warning' | 'danger' | 'info' | 'neutral' {
    const map: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
      Promoted: 'success',
      'Staging verified': 'info',
      'In review': 'info',
      Draft: 'neutral',
      Blocked: 'danger',
      Approved: 'success',
      Rejected: 'danger',
      Pending: 'warning',
      Pass: 'success',
      Fail: 'danger',
    };
    return map[status] ?? 'neutral';
  }

  tone(status: string): Tone {
    const map: Record<string, Tone> = {
      Promoted: 'success',
      'Staging verified': 'brand',
      'In review': 'info',
      Draft: 'neutral',
      Blocked: 'danger',
      Pass: 'success',
      Fail: 'danger',
      Pending: 'warning',
      Skipped: 'neutral',
    };
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
    const r = this.inReview()[event.index];
    if (r) {
      this.selectedReleaseId.set(r.id);
      this.navigate(1);
    }
  }

  globalSearch(value: string): void {
    this.search.set(value);
    this.releaseSearch.set(value);
    if (value.trim()) this.navigate(1);
  }

  openRelease(id: string): void {
    this.selectedReleaseId.set(id);
    this.checklistReleaseId.set(id);
    this.navigate(1);
  }

  toggleChecklist(releaseId: string, itemId: string, done: boolean): void {
    this.releases.update((list) =>
      list.map((r) =>
        r.id === releaseId ? { ...r, checklist: r.checklist.map((c) => (c.id === itemId ? { ...c, done } : c)), updated: 'Today' } : r,
      ),
    );
  }

  approve(releaseId: string, role: string): void {
    this.approvals.update((list) =>
      list.map((a) =>
        a.releaseId === releaseId && a.role === role ? { ...a, decision: 'Approved' as const, timestamp: 'Just now', approver: a.approver || 'Nisha Poluru' } : a,
      ),
    );
    this.notify('Approval recorded', `${role} for ${this.releaseName(releaseId)}`);
  }

  openPromoteModal(): void {
    const r = this.selectedRelease();
    this.promoteDraft.set({ releaseId: r.id, window: r.targetDate, rollbackPlan: `Revert to ${r.productionRef}`, notify: true });
    this.error.set('');
    this.modal.set('promote');
  }

  confirmPromote(): void {
    const r = this.selectedRelease();
    if (!this.promoteReady() && this.autoBlockOnFail()) {
      this.error.set('Required gates, checklist items, or pending approvals must be cleared first.');
      return;
    }
    this.releases.update((list) =>
      list.map((rel) =>
        rel.id === r.id
          ? { ...rel, status: 'Promoted' as ReleaseStatus, productionRef: rel.stagingRef, updated: 'Today' }
          : rel,
      ),
    );
    this.log.update((list) => [{ title: `Promoted ${r.name}`, description: `${r.version} · Nisha Poluru`, timestamp: 'Just now' }, ...list]);
    this.closeModal();
    this.notify('Promoted to production', r.name);
  }

  onRange(range: { start: string; end: string }): void {
    this.rangeStart.set(range.start);
    this.rangeEnd.set(range.end);
  }

  exportBoard(): void {
    const body = JSON.stringify({ releases: this.releases(), approvals: this.approvals(), artifacts: this.artifacts() }, null, 2);
    this.download(body, 'release-gates-board.json', 'application/json');
  }

  onExportMenu(item: { value: string }): void {
    if (item.value === 'csv') this.exportReleasesCsv();
  }

  exportReleasesCsv(): void {
    const rows = [
      ['id', 'name', 'kind', 'version', 'status', 'owner', 'targetDate'],
      ...this.releases().map((r) => [r.id, r.name, r.kind, r.version, r.status, r.owner, r.targetDate]),
    ];
    this.download(rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n'), 'releases.csv', 'text/csv');
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
      this.error.set('Enter a valid email for promotion alerts.');
      return;
    }
    this.error.set('');
    this.notify('Settings saved', `Minimum approvals: ${this.minApprovals()}. Auto-block: ${this.autoBlockOnFail() ? 'on' : 'off'}.`);
  }

  onProfile(item: { value: string }): void {
    if (item.value === 'mine') this.globalSearch('Nisha');
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
