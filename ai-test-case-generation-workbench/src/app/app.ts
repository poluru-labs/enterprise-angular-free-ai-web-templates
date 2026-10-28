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
  protected readonly exportLabel = signal('Export cases');

  protected readonly periodOptions = [
    { label: '7 days', value: '7d' },
    { label: '30 days', value: '30d' },
    { label: '90 days', value: '90d' },
  ];

  protected readonly navItems = [
    { label: 'Overview', icon: 'home' as const },
    { label: 'Cases', icon: 'check' as const },
    { label: 'Suites', icon: 'folder' as const },
    { label: 'Reports', icon: 'file' as const },
  ];

  protected readonly issueTypes = [
    { name: 'Smoke', count: '48', value: 86, color: '#084177' },
    { name: 'Regression', count: '31', value: 64, color: '#073866' },
    { name: 'Integration', count: '24', value: 47, color: '#5e84a7' },
    { name: 'Accessibility', count: '19', value: 36, color: '#bacad9' },
  ];

  protected readonly pages = [
    { col1: 'Checkout flow', col2: '48', col3: 'Tara Poluru', status: 'Passing' },
    { col1: 'Account settings', col2: '36', col3: 'Rohan Poluru', status: 'Failing' },
    { col1: 'Admin dashboard', col2: '29', col3: 'Nila Poluru', status: 'Passing' },
  ];

  protected readonly reviewers = [
    { name: 'Tara Poluru', role: 'QA lead', fixed: '126', score: '98%' },
    { name: 'Rohan Poluru', role: 'Automation engineer', fixed: '114', score: '96%' },
    { name: 'Nila Poluru', role: 'Manual tester', fixed: '98', score: '95%' },
  ];

  protected readonly activity = [
    { time: '11:15', title: 'Suite green', detail: 'Tara Poluru · Checkout smoke run', tone: 'success' as const },
    { time: '10:28', title: 'Failure triaged', detail: 'Rohan Poluru · Settings password reset', tone: 'warning' as const },
    { time: '09:47', title: 'Cases imported', detail: 'Nila Poluru · API contract pack', tone: 'success' as const },
  ];

  protected readonly metrics = [
    { value: '842', label: 'Active test cases', trend: 'up' as const, trendValue: '9.7%', hint: 'repository total' },
    { value: '92%', label: 'Pass rate', trend: 'up' as const, trendValue: '1.9%', hint: 'last full run' },
    { value: '126', label: 'New cases this sprint', trend: 'up' as const, trendValue: '14', hint: 'peer reviewed' },
    { value: '17', label: 'Failed scenarios', trend: 'down' as const, trendValue: '21%', hint: 'under investigation' },
  ];

  protected setPeriod(value: string): void {
    this.period.set(value);
  }

  protected exportReport(): void {
    this.exportLabel.set('Exported');
    window.setTimeout(() => this.exportLabel.set('Export cases'), 1800);
  }

  protected statusVariant(status: string): 'success' | 'warning' | 'neutral' {
    if (/ready|clean|pass|complete|approved|stable|sign|verify|publish/i.test(status)) return 'success';
    if (/review|fix|work|fail|adjust|warn|draft|screen|shop/i.test(status)) return 'warning';
    return 'neutral';
  }
}
