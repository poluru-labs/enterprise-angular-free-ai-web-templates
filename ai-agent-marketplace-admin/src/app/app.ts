import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { EdsAlertComponent, EdsAvatarComponent, EdsBadgeComponent, EdsButtonComponent, EdsCardComponent, EdsDataTableComponent, EdsIconComponent, EdsInputComponent, EdsModalComponent, EdsProgressBarComponent, EdsSegmentedControlComponent, EdsSelectComponent, EdsSideNavComponent, EdsSwitchComponent, EdsTabsComponent } from '@poluru-labs/enterprise-design-system-angular';

type AgentStatus = 'Published' | 'In review' | 'Draft';
interface Agent { id: number; name: string; category: string; description: string; owner: string; version: string; status: AgentStatus; runs: number; success: number; icon: 'mail' | 'file' | 'folder' | 'search' | 'user' | 'check-circle'; color: string; }
@Component({
  selector: 'app-root',
  imports: [DecimalPipe, EdsAlertComponent, EdsAvatarComponent, EdsBadgeComponent, EdsButtonComponent, EdsCardComponent, EdsDataTableComponent, EdsIconComponent, EdsInputComponent, EdsModalComponent, EdsProgressBarComponent, EdsSegmentedControlComponent, EdsSelectComponent, EdsSideNavComponent, EdsSwitchComponent, EdsTabsComponent],
  templateUrl: './app.html', styleUrl: './app.scss', changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  readonly page = signal('Overview');
  readonly mobileNav = signal(false);
  readonly query = signal('');
  readonly category = signal('All categories');
  readonly catalogTab = signal(0);
  readonly period = signal('30');
  readonly notice = signal('');
  readonly modal = signal<'create' | 'detail' | null>(null);
  readonly selected = signal<Agent | null>(null);
  readonly formName = signal('');
  readonly formDescription = signal('');
  readonly formCategory = signal('Productivity');
  readonly formError = signal('');
  readonly releaseVersion = signal('');
  readonly enforceReview = signal(true);
  readonly auditEnabled = signal(true);
  readonly agents = signal<Agent[]>([
    { id: 1, name: 'Support Concierge', category: 'Customer support', description: 'Resolve everyday requests with thoughtful, context-aware responses.', owner: 'Aarav Poluru', version: '2.4.0', status: 'Published', runs: 52480, success: 99.2, icon: 'mail', color: 'plum' },
    { id: 2, name: 'Document Analyst', category: 'Operations', description: 'Turn lengthy documents into clear summaries and actionable insights.', owner: 'Mira Poluru', version: '1.8.2', status: 'Published', runs: 31860, success: 98.8, icon: 'file', color: 'blue' },
    { id: 3, name: 'Knowledge Scout', category: 'Productivity', description: 'Find the right answers across your internal knowledge workspace.', owner: 'Kiran Poluru', version: '3.1.0', status: 'Published', runs: 26940, success: 99.6, icon: 'search', color: 'green' },
    { id: 4, name: 'People Partner', category: 'People', description: 'Make onboarding and everyday people operations feel effortless.', owner: 'Nila Poluru', version: '1.2.0', status: 'Published', runs: 17140, success: 98.4, icon: 'user', color: 'orange' },
    { id: 5, name: 'Contract Reviewer', category: 'Operations', description: 'Surface key clauses, obligations, and risks before the next signature.', owner: 'Dev Poluru', version: '1.0.0', status: 'In review', runs: 0, success: 0, icon: 'check-circle', color: 'blue' },
    { id: 6, name: 'Project Coordinator', category: 'Productivity', description: 'Keep project updates, milestones, and next steps in one place.', owner: 'Tara Poluru', version: '1.0.0', status: 'In review', runs: 0, success: 0, icon: 'folder', color: 'plum' }
  ]);
  readonly activity = signal([
    { action: 'Published Support Concierge', detail: 'Version 2.4.0 · Production', owner: 'Aarav Poluru', time: '24 min ago' },
    { action: 'Submitted Contract Reviewer', detail: 'Version 1.0.0 · Awaiting approval', owner: 'Dev Poluru', time: '1 hour ago' },
    { action: 'Updated Document Analyst', detail: 'Version 1.8.2 · Release approved', owner: 'Mira Poluru', time: '2 hours ago' }
  ]);
  readonly navItems = computed(() => ['Overview', 'Marketplace', 'Approvals', 'Analytics', 'Governance', 'Activity'].map(label => ({ label, active: this.page() === label })));
  readonly tabs = [{ label: 'All agents' }, { label: 'Published' }, { label: 'In review' }, { label: 'Drafts' }];
  readonly categories = ['All categories', 'Customer support', 'Operations', 'Productivity', 'People'].map(value => ({ value, label: value }));
  readonly createCategories = this.categories.slice(1);
  readonly periods = [{ label: '7 days', value: '7' }, { label: '30 days', value: '30' }];
  readonly pending = computed(() => this.agents().filter(a => a.status === 'In review'));
  readonly published = computed(() => this.agents().filter(a => a.status === 'Published'));
  readonly runs = computed(() => Math.round(this.agents().reduce((sum, a) => sum + a.runs, 0) * (this.period() === '7' ? 0.27 : 1)));
  readonly filtered = computed(() => this.agents().filter(a => {
    const status = ['', 'Published', 'In review', 'Draft'][this.catalogTab()];
    return (!status || a.status === status) && (this.category() === 'All categories' || a.category === this.category()) && `${a.name} ${a.owner} ${a.description}`.toLowerCase().includes(this.query().toLowerCase());
  }));
  readonly bars = computed(() => this.period() === '7' ? [48, 64, 52, 78, 67, 86, 96] : [28, 35, 32, 43, 36, 51, 45, 55, 49, 65, 59, 72, 65, 80, 75, 91, 82, 96, 88, 100]);
  readonly auditColumns = [{ key: 'action', label: 'Event' }, { key: 'detail', label: 'Details' }, { key: 'owner', label: 'Member' }, { key: 'time', label: 'Time' }];
  navigate(label: string) { this.page.set(label); this.mobileNav.set(false); }
  openCreate() { this.formName.set(''); this.formDescription.set(''); this.formError.set(''); this.modal.set('create'); }
  openAgent(agent: Agent) { this.selected.set(agent); this.releaseVersion.set(''); this.formError.set(''); this.modal.set('detail'); }
  log(action: string, detail: string) { this.activity.update(rows => [{ action, detail, owner: 'Riya Poluru', time: 'Just now' }, ...rows]); }
  createAgent() {
    const name = this.formName().trim();
    if (!name || !this.formDescription().trim()) { this.formError.set('Add an agent name and description to continue.'); return; }
    if (this.agents().some(a => a.name.toLowerCase() === name.toLowerCase())) { this.formError.set('An agent with this name already exists.'); return; }
    this.agents.update(rows => [...rows, { id: Date.now(), name, description: this.formDescription().trim(), category: this.formCategory(), owner: 'Riya Poluru', version: '1.0.0', status: 'Draft', runs: 0, success: 0, icon: 'folder', color: 'plum' }]);
    this.log(`Created ${name}`, 'Version 1.0.0 · Draft'); this.modal.set(null); this.navigate('Marketplace'); this.catalogTab.set(3); this.query.set(''); this.category.set('All categories'); this.notice.set(`${name} saved as a draft. Open it to submit for approval.`);
  }
  changeStatus(agent: Agent, status: AgentStatus) {
    this.agents.update(rows => rows.map(a => a.id === agent.id ? { ...a, status } : a));
    this.log(`${status === 'Published' ? 'Approved' : status === 'Draft' ? 'Returned to draft' : 'Submitted'} ${agent.name}`, `Version ${agent.version} · ${status}`);
    this.modal.set(null); this.notice.set(`${agent.name} ${status === 'Published' ? 'is now published.' : status === 'Draft' ? 'was returned to draft for changes.' : 'was submitted for approval.'}`);
  }
  submitVersion(agent: Agent) {
    const version = this.releaseVersion().trim();
    const parts = version.split('.').map(Number), previous = agent.version.split('.').map(Number);
    const differing = parts.findIndex((n, i) => n !== previous[i]);
    if (!/^\d+\.\d+\.\d+$/.test(version) || differing < 0 || parts[differing] <= previous[differing]) { this.formError.set('Enter a higher version, such as 2.5.0.'); return; }
    this.agents.update(rows => rows.map(a => a.id === agent.id ? { ...a, version, status: 'In review' } : a));
    this.log(`Submitted ${agent.name}`, `Version ${version} · Awaiting approval`); this.modal.set(null); this.notice.set(`Version ${version} submitted for approval.`);
  }
  exportReport() {
    const csv = [['Agent', 'Owner', 'Version', 'Status', 'Runs (30 days)'], ...this.agents().map(a => [a.name, a.owner, a.version, a.status, String(a.runs)])].map(row => row.map(v => '"' + (/^[=+@-]/.test(v) ? "'" : '') + v.replaceAll('"', '""') + '"').join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a'); link.href = url; link.download = 'agent-marketplace-report.csv'; link.click(); URL.revokeObjectURL(url); this.notice.set('Your marketplace report has been exported.');
  }
}
