import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { EdsAlertComponent, EdsAvatarComponent, EdsBadgeComponent, EdsButtonComponent, EdsCardComponent, EdsCheckboxComponent, EdsDataTableComponent, EdsIconComponent, EdsInputComponent, EdsModalComponent, EdsProgressBarComponent, EdsSegmentedControlComponent, EdsSelectComponent, EdsSideNavComponent, EdsSwitchComponent, EdsTabsComponent, EdsTextareaComponent } from '@poluru-labs/enterprise-design-system-angular';
interface Dataset { id: string; name: string; type: string; owner: string; records: number; reviewed: number; agreement: number; accuracy: number; coverage: number; trend: number[]; }
interface Review { id: string; dataset: string; text: string; first: string; second: string; owner: string; priority: 'High' | 'Medium'; status: 'Open' | 'Resolved'; finalLabel?: string; note?: string; }
@Component({
  selector: 'app-root',
  imports: [DecimalPipe, EdsAlertComponent, EdsAvatarComponent, EdsBadgeComponent, EdsButtonComponent, EdsCardComponent, EdsCheckboxComponent, EdsDataTableComponent, EdsIconComponent, EdsInputComponent, EdsModalComponent, EdsProgressBarComponent, EdsSegmentedControlComponent, EdsSelectComponent, EdsSideNavComponent, EdsSwitchComponent, EdsTabsComponent, EdsTextareaComponent],
  templateUrl: './app.html', styleUrl: './app.scss', changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  readonly page = signal('Overview');
  readonly sidebarOpen = signal(false);
  readonly project = signal('all');
  readonly period = signal('30');
  readonly search = signal('');
  readonly datasetTab = signal(0);
  readonly reviewTab = signal(0);
  readonly notice = signal('');
  readonly modal = signal<'audit' | 'review' | 'dataset' | null>(null);
  readonly selectedDataset = signal<Dataset | null>(null);
  readonly selectedReview = signal<Review | null>(null);
  readonly finalLabel = signal('');
  readonly note = signal('');
  readonly error = signal('');
  readonly auditDataset = signal('support');
  readonly includeDisagreements = signal(true);
  readonly auditName = signal('September quality check');
  readonly accuracyTarget = signal(95);
  readonly agreementTarget = signal(90);
  readonly thresholdAccuracy = signal('95');
  readonly thresholdAgreement = signal('90');
  readonly alertsEnabled = signal(true);
  readonly datasets: Dataset[] = [
    { id: 'support', name: 'Customer support intent', type: 'Text classification', owner: 'Mira Poluru', records: 24800, reviewed: 22320, agreement: 96.2, accuracy: 98.1, coverage: 94, trend: [90.4, 92.6, 91.8, 94.1, 93.8, 95.4, 96.2] },
    { id: 'sentiment', name: 'Product sentiment', type: 'Sentiment analysis', owner: 'Aarav Poluru', records: 18400, reviewed: 15456, agreement: 91.4, accuracy: 96.3, coverage: 89, trend: [86.2, 87.8, 88.3, 87.4, 90.1, 90.5, 91.4] },
    { id: 'entities', name: 'Document entities', type: 'Entity recognition', owner: 'Nila Poluru', records: 12600, reviewed: 8316, agreement: 84.6, accuracy: 91.8, coverage: 78, trend: [81.2, 82.8, 84.1, 82.9, 84.8, 83.5, 84.6] },
    { id: 'images', name: 'Product image tags', type: 'Image classification', owner: 'Kiran Poluru', records: 32000, reviewed: 30080, agreement: 97.1, accuracy: 99.2, coverage: 98, trend: [93.4, 94.2, 94.8, 96.1, 95.7, 96.8, 97.1] },
    { id: 'feedback', name: 'Feedback categories', type: 'Text classification', owner: 'Tara Poluru', records: 9600, reviewed: 6720, agreement: 88.5, accuracy: 94.6, coverage: 85, trend: [83.5, 85.2, 84.8, 86.3, 87.1, 86.7, 88.5] }
  ];
  readonly reviews = signal<Review[]>([
    { id: 'REV-1042', dataset: 'entities', text: 'The agreement with Acme Labs begins on October 12 and renews annually.', first: 'Organization', second: 'Product', owner: 'Nila Poluru', priority: 'High', status: 'Open' },
    { id: 'REV-1043', dataset: 'feedback', text: 'The new layout looks great, but I can no longer find my saved reports.', first: 'Feature request', second: 'Usability issue', owner: 'Tara Poluru', priority: 'High', status: 'Open' },
    { id: 'REV-1044', dataset: 'sentiment', text: 'Delivery was a little late, but the quality was worth the wait.', first: 'Positive', second: 'Neutral', owner: 'Aarav Poluru', priority: 'Medium', status: 'Open' },
    { id: 'REV-1045', dataset: 'support', text: 'Please update the email address associated with my account.', first: 'Account update', second: 'Access issue', owner: 'Mira Poluru', priority: 'Medium', status: 'Open' }
  ]);
  readonly reports = signal<Record<string, string | number>[]>([]);
  readonly team = [
    { name: 'Mira Poluru', role: 'Quality lead', reviewed: 22320, accuracy: '98.1%', agreement: '96.2%' },
    { name: 'Aarav Poluru', role: 'Senior annotator', reviewed: 15456, accuracy: '96.3%', agreement: '91.4%' },
    { name: 'Nila Poluru', role: 'Entity specialist', reviewed: 8316, accuracy: '91.8%', agreement: '84.6%' },
    { name: 'Kiran Poluru', role: 'Image specialist', reviewed: 30080, accuracy: '99.2%', agreement: '97.1%' },
    { name: 'Tara Poluru', role: 'Senior annotator', reviewed: 6720, accuracy: '94.6%', agreement: '88.5%' }
  ];
  readonly sortedTeam = signal([...this.team]);
  sortTeam(sort: { key: string; direction: 'asc' | 'desc' }) {
    this.sortedTeam.update(rows => [...rows].sort((a, b) => {
      const first = a[sort.key as keyof typeof a], second = b[sort.key as keyof typeof b];
      const result = typeof first === 'number' && typeof second === 'number' ? first - second : String(first).localeCompare(String(second), undefined, { numeric: true });
      return sort.direction === 'asc' ? result : -result;
    }));
  }
  readonly navigation = computed(() => ['Overview', 'Datasets', 'Review queue', 'Annotators', 'Reports', 'Settings'].map(label => ({ label, active: this.page() === label })));
  readonly projects = [{ label: 'All datasets', value: 'all' }, ...this.datasets.map(d => ({ label: d.name, value: d.id }))];
  readonly auditOptions = this.projects.slice(1);
  readonly periods = [{ label: '30 days', value: '30' }, { label: '7 days', value: '7' }];
  readonly datasetTabs = [{ label: 'All datasets' }, { label: 'Healthy' }, { label: 'Needs attention' }];
  readonly reviewTabs = [{ label: 'Open' }, { label: 'Resolved' }];
  readonly teamColumns = [{ key: 'name', label: 'Annotator' }, { key: 'role', label: 'Specialty' }, { key: 'reviewed', label: 'Reviewed labels', sortable: true }, { key: 'accuracy', label: 'Label accuracy' }, { key: 'agreement', label: 'Agreement' }];
  readonly reportColumns = [{ key: 'name', label: 'Report' }, { key: 'dataset', label: 'Dataset' }, { key: 'accuracy', label: 'Accuracy' }, { key: 'agreement', label: 'Agreement' }, { key: 'disputes', label: 'Open disputes' }, { key: 'owner', label: 'Created by' }];
  readonly scoped = computed(() => this.datasets.filter(d => this.project() === 'all' || d.id === this.project()));
  readonly totalRecords = computed(() => this.scoped().reduce((sum, d) => sum + d.records, 0));
  readonly reviewed = computed(() => this.scoped().reduce((sum, d) => sum + d.reviewed, 0));
  readonly accuracy = computed(() => this.weighted('accuracy'));
  readonly agreement = computed(() => this.weighted('agreement'));
  readonly healthy = computed(() => this.scoped().filter(d => this.isHealthy(d)).length);
  readonly openReviews = computed(() => this.reviews().filter(r => r.status === 'Open' && (this.project() === 'all' || r.dataset === this.project())));
  readonly visibleReviews = computed(() => this.reviews().filter(r => r.status === (this.reviewTab() === 0 ? 'Open' : 'Resolved') && (this.project() === 'all' || r.dataset === this.project())));
  readonly filteredDatasets = computed(() => this.scoped().filter(d => `${d.name} ${d.owner} ${d.type}`.toLowerCase().includes(this.search().toLowerCase()) && (this.datasetTab() === 0 || this.isHealthy(d) === (this.datasetTab() === 1))));
  readonly trend = computed(() => Array.from({ length: 7 }, (_, i) => {
    const point = this.scoped().reduce((sum, d) => sum + d.trend[i] * d.reviewed, 0) / this.reviewed();
    return this.period() === '30' ? point : point * .35 + this.agreement() * .65;
  }));
  readonly trendPath = computed(() => this.trend().map((point, i) => `${i === 0 ? 'M' : 'L'}${i * 100} ${180 - (point - 75) * 7.2}`).join(' '));
  readonly trendChange = computed(() => this.trend().at(-1)! - this.trend()[0]);
  readonly labelOptions = computed(() => [...new Set([this.selectedReview()?.first, this.selectedReview()?.second])].filter((v): v is string => !!v).map(value => ({ label: value, value })));
  weighted(key: 'accuracy' | 'agreement') { return this.scoped().reduce((sum, d) => sum + d[key] * d.reviewed, 0) / this.reviewed(); }
  isHealthy(dataset: Dataset) { return dataset.accuracy >= this.accuracyTarget() && dataset.agreement >= this.agreementTarget(); }
  datasetName(id: string) { return this.datasets.find(d => d.id === id)?.name || id; }
  navigate(page: string) { this.page.set(page); this.sidebarOpen.set(false); this.error.set(''); }
  openAudit() { this.auditDataset.set(this.project() === 'all' ? 'support' : this.project()); this.error.set(''); this.modal.set('audit'); }
  inspect(dataset: Dataset) { this.selectedDataset.set(dataset); this.modal.set('dataset'); }
  review(item: Review) { this.selectedReview.set(item); this.finalLabel.set(''); this.note.set(''); this.error.set(''); this.modal.set('review'); }
  resolve() {
    const item = this.selectedReview();
    if (!item || !this.labelOptions().some(o => o.value === this.finalLabel()) || !this.note().trim()) { this.error.set('Choose a final label and add a short decision note.'); return; }
    this.reviews.update(rows => rows.map(r => r.id === item.id ? { ...r, status: 'Resolved', finalLabel: this.finalLabel(), note: this.note().trim() } : r));
    this.modal.set(null); this.notice.set(`${item.id} resolved as “${this.finalLabel()}”. The decision is available in the Resolved tab.`);
  }
  runAudit() {
    if (!this.auditName().trim()) { this.error.set('Enter a report name.'); return; }
    const dataset = this.datasets.find(d => d.id === this.auditDataset())!;
    this.reports.update(rows => [{ name: this.auditName().trim(), dataset: dataset.name, accuracy: `${dataset.accuracy}%`, agreement: `${dataset.agreement}%`, disputes: this.includeDisagreements() ? this.reviews().filter(r => r.dataset === dataset.id && r.status === 'Open').length : 'Not included', owner: 'Riya Poluru' }, ...rows]);
    this.modal.set(null); this.navigate('Reports'); this.notice.set('Quality report created from the current sample dataset metrics.');
  }
  saveSettings() {
    const accuracy = Number(this.thresholdAccuracy()), agreement = Number(this.thresholdAgreement());
    if (!this.thresholdAccuracy().trim() || !this.thresholdAgreement().trim() || !Number.isFinite(accuracy) || !Number.isFinite(agreement) || accuracy < 0 || accuracy > 100 || agreement < 0 || agreement > 100) { this.error.set('Both thresholds must be numbers between 0 and 100.'); return; }
    this.accuracyTarget.set(accuracy); this.agreementTarget.set(agreement); this.error.set(''); this.notice.set('Quality thresholds updated. Dataset health has been recalculated.');
  }
  exportReport() {
    const rows: (string | number)[][] = this.page() === 'Reports' && this.reports().length ? [this.reportColumns.map(c => c.label), ...this.reports().map(r => this.reportColumns.map(c => r[c.key]))] : [['Dataset', 'Owner', 'Records', 'Reviewed', 'Agreement %', 'Accuracy %', 'Health'], ...this.scoped().map(d => [d.name, d.owner, d.records, d.reviewed, d.agreement, d.accuracy, this.isHealthy(d) ? 'Healthy' : 'Needs attention'])];
    const csv = rows.map(row => row.map(value => { const s = String(value); return '"' + (/^[=+@-]/.test(s) ? "'" : '') + s.replaceAll('"', '""') + '"'; }).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a'); a.href = url; a.download = 'annotation-quality-report.csv'; a.click(); URL.revokeObjectURL(url); this.notice.set('Your quality report has been exported.');
  }
}
