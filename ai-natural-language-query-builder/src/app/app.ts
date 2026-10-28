import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  EdsAvatarComponent,
  EdsBadgeComponent,
  EdsButtonComponent,
  EdsCardComponent,
  EdsDividerComponent,
  EdsIconComponent,
  EdsProgressBarComponent,
  EdsSegmentedControlComponent,
  EdsStatComponent,
  EdsStatusComponent,
  EdsTooltipComponent,
} from '@poluru-labs/enterprise-design-system-angular';

@Component({
  selector: 'app-root',
  imports: [
    EdsAvatarComponent,
    EdsBadgeComponent,
    EdsButtonComponent,
    EdsCardComponent,
    EdsDividerComponent,
    EdsIconComponent,
    EdsProgressBarComponent,
    EdsSegmentedControlComponent,
    EdsStatComponent,
    EdsStatusComponent,
    EdsTooltipComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly activeNav = signal('Overview');
  protected readonly period = signal('30d');
  protected readonly exportLabel = signal('Export queries');

  protected readonly periodOptions = [
    { label: '7 days', value: '7d' },
    { label: '30 days', value: '30d' },
    { label: '90 days', value: '90d' },
  ];

  protected readonly navItems = [
    { label: 'Overview', icon: 'home' as const },
    { label: 'Queries', icon: 'search' as const },
    { label: 'Datasets', icon: 'folder' as const },
    { label: 'Reports', icon: 'file' as const },
  ];

  protected readonly issueTypes = [
    { name: 'Revenue', count: '48', value: 86, color: '#000957' },
    { name: 'Operations', count: '31', value: 64, color: '#00084b' },
    { name: 'Support', count: '24', value: 47, color: '#595f92' },
    { name: 'Product usage', count: '19', value: 36, color: '#b8bad0' },
  ];

  protected readonly pages = [
    { col1: 'orders_fact', col2: '284', col3: 'Nila Poluru', status: 'Healthy' },
    { col1: 'support_tickets', col2: '196', col3: 'Aarav Poluru', status: 'Healthy' },
    { col1: 'web_events', col2: '142', col3: 'Priya Poluru', status: 'Review' },
  ];

  protected readonly reviewers = [
    { name: 'Nila Poluru', role: 'Data analyst', fixed: '142', score: '98%' },
    { name: 'Aarav Poluru', role: 'BI engineer', fixed: '118', score: '96%' },
    { name: 'Priya Poluru', role: 'Ops analyst', fixed: '97', score: '95%' },
  ];

  protected readonly activity = [
    { time: '11:08', title: 'Query saved', detail: 'Nila Poluru · Monthly revenue rollup', tone: 'success' as const },
    { time: '10:41', title: 'Validation failed', detail: 'Aarav Poluru · Missing date filter', tone: 'warning' as const },
    { time: '09:55', title: 'Shared with team', detail: 'Priya Poluru · Support backlog view', tone: 'success' as const },
  ];

  protected readonly metrics = [
    { value: '186', label: 'Saved queries', trend: 'up' as const, trendValue: '12.1%', hint: 'workspace total' },
    { value: '94%', label: 'Validation pass rate', trend: 'up' as const, trendValue: '2.3%', hint: 'last 30 days' },
    { value: '1,042', label: 'Runs this month', trend: 'up' as const, trendValue: '18.4%', hint: 'all teams' },
    { value: '8', label: 'Needs review', trend: 'down' as const, trendValue: '3', hint: 'ambiguous filters' },
  ];

  protected setPeriod(value: string): void {
    this.period.set(value);
  }

  protected exportReport(): void {
    this.exportLabel.set('Exported');
    window.setTimeout(() => this.exportLabel.set('Export queries'), 1800);
  }

  protected statusVariant(status: string): 'success' | 'warning' | 'neutral' {
    if (/ready|clean|pass|complete|approved|stable|sign|verify|publish/i.test(status)) return 'success';
    if (/review|fix|work|fail|adjust|warn|draft|screen|shop/i.test(status)) return 'warning';
    return 'neutral';
  }
}
