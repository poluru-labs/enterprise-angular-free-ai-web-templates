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
  protected readonly exportLabel = signal('Export audit');

  protected readonly periodOptions = [
    { label: '7 days', value: '7d' },
    { label: '30 days', value: '30d' },
    { label: '90 days', value: '90d' },
  ];

  protected readonly navItems = [
    { label: 'Overview', icon: 'home' as const },
    { label: 'Formulas', icon: 'file' as const },
    { label: 'Workbooks', icon: 'folder' as const },
    { label: 'Reports', icon: 'check' as const },
  ];

  protected readonly issueTypes = [
    { name: 'Circular references', count: '48', value: 86, color: '#E3F0AF' },
    { name: 'Volatile functions', count: '31', value: 64, color: '#c3ce97' },
    { name: 'Broken links', count: '24', value: 47, color: '#edf5cb' },
    { name: 'Hard-coded values', count: '19', value: 36, color: '#f7fbe9' },
  ];

  protected readonly pages = [
    { col1: 'Revenue model FY26', col2: '9', col3: 'Vikram Poluru', status: 'Fixing' },
    { col1: 'Headcount planner', col2: '6', col3: 'Priya Poluru', status: 'Review' },
    { col1: 'CapEx tracker', col2: '4', col3: 'Rohan Poluru', status: 'Clean' },
  ];

  protected readonly reviewers = [
    { name: 'Vikram Poluru', role: 'Model owner', fixed: '214', score: '99%' },
    { name: 'Priya Poluru', role: 'Analyst', fixed: '198', score: '97%' },
    { name: 'Rohan Poluru', role: 'Controller', fixed: '176', score: '96%' },
  ];

  protected readonly activity = [
    { time: '10:48', title: 'Pattern saved', detail: 'Vikram Poluru · Rolling average template', tone: 'success' as const },
    { time: '10:14', title: 'Circular ref fixed', detail: 'Priya Poluru · Summary tab', tone: 'success' as const },
    { time: '09:39', title: 'Workbook locked', detail: 'Rohan Poluru · Pending sign-off', tone: 'warning' as const },
  ];

  protected readonly metrics = [
    { value: '1,964', label: 'Formulas scanned', trend: 'up' as const, trendValue: '8.4%', hint: 'all workbooks' },
    { value: '97%', label: 'Clean evaluations', trend: 'up' as const, trendValue: '1.1%', hint: 'no circular refs' },
    { value: '214', label: 'Patterns documented', trend: 'up' as const, trendValue: '16', hint: 'shared library' },
    { value: '27', label: 'Errors detected', trend: 'down' as const, trendValue: '18%', hint: 'fix in progress' },
  ];

  protected setPeriod(value: string): void {
    this.period.set(value);
  }

  protected exportReport(): void {
    this.exportLabel.set('Exported');
    window.setTimeout(() => this.exportLabel.set('Export audit'), 1800);
  }

  protected statusVariant(status: string): 'success' | 'warning' | 'neutral' {
    if (/ready|clean|pass|complete|approved|stable|sign|verify|publish/i.test(status)) return 'success';
    if (/review|fix|work|fail|adjust|warn|draft|screen|shop/i.test(status)) return 'warning';
    return 'neutral';
  }
}
