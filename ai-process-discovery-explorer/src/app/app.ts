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
  protected readonly exportLabel = signal('Export map');

  protected readonly periodOptions = [
    { label: '7 days', value: '7d' },
    { label: '30 days', value: '30d' },
    { label: '90 days', value: '90d' },
  ];

  protected readonly navItems = [
    { label: 'Overview', icon: 'home' as const },
    { label: 'Processes', icon: 'folder' as const },
    { label: 'Teams', icon: 'user' as const },
    { label: 'Reports', icon: 'file' as const },
  ];

  protected readonly issueTypes = [
    { name: 'Onboarding', count: '48', value: 86, color: '#381460' },
    { name: 'Billing', count: '31', value: 64, color: '#301153' },
    { name: 'Support', count: '24', value: 47, color: '#7e6698' },
    { name: 'Fulfillment', count: '19', value: 36, color: '#c7bdd2' },
  ];

  protected readonly pages = [
    { col1: 'Invoice dispute handling', col2: '14', col3: 'Riya Poluru', status: 'Workshop' },
    { col1: 'Returns authorization', col2: '11', col3: 'Kavita Poluru', status: 'Mapped' },
    { col1: 'Vendor onboarding', col2: '19', col3: 'Aarav Poluru', status: 'Draft' },
  ];

  protected readonly reviewers = [
    { name: 'Riya Poluru', role: 'Process analyst', fixed: '56', score: '98%' },
    { name: 'Kavita Poluru', role: 'Ops consultant', fixed: '49', score: '96%' },
    { name: 'Aarav Poluru', role: 'Business analyst', fixed: '44', score: '95%' },
  ];

  protected readonly activity = [
    { time: '11:06', title: 'Flow validated', detail: 'Riya Poluru · Support escalation path', tone: 'success' as const },
    { time: '10:34', title: 'Bottleneck logged', detail: 'Kavita Poluru · Manual CSV export step', tone: 'warning' as const },
    { time: '09:48', title: 'Owner assigned', detail: 'Aarav Poluru · Vendor risk checklist', tone: 'success' as const },
  ];

  protected readonly metrics = [
    { value: '56', label: 'Mapped processes', trend: 'up' as const, trendValue: '7', hint: 'validated this month' },
    { value: '18', label: 'Bottlenecks flagged', trend: 'down' as const, trendValue: '4', hint: 'resolved recently' },
    { value: '124', label: 'Steps documented', trend: 'up' as const, trendValue: '13.6%', hint: 'with owners' },
    { value: '9', label: 'High-risk gaps', trend: 'down' as const, trendValue: '2', hint: 'controls missing' },
  ];

  protected setPeriod(value: string): void {
    this.period.set(value);
  }

  protected exportReport(): void {
    this.exportLabel.set('Exported');
    window.setTimeout(() => this.exportLabel.set('Export map'), 1800);
  }

  protected statusVariant(status: string): 'success' | 'warning' | 'neutral' {
    if (/ready|clean|pass|complete|approved|stable|sign|verify|publish/i.test(status)) return 'success';
    if (/review|fix|work|fail|adjust|warn|draft|screen|shop/i.test(status)) return 'warning';
    return 'neutral';
  }
}
