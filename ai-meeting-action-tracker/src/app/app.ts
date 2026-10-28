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
  protected readonly exportLabel = signal('Export actions');

  protected readonly periodOptions = [
    { label: '7 days', value: '7d' },
    { label: '30 days', value: '30d' },
    { label: '90 days', value: '90d' },
  ];

  protected readonly navItems = [
    { label: 'Overview', icon: 'home' as const },
    { label: 'Actions', icon: 'check' as const },
    { label: 'Meetings', icon: 'calendar' as const },
    { label: 'Reports', icon: 'folder' as const },
  ];

  protected readonly issueTypes = [
    { name: 'Decisions', count: '48', value: 86, color: '#362FD9' },
    { name: 'Follow-ups', count: '31', value: 64, color: '#2e28bb' },
    { name: 'Blockers', count: '24', value: 47, color: '#7c78e6' },
    { name: 'Research notes', count: '19', value: 36, color: '#c7c5f4' },
  ];

  protected readonly pages = [
    { col1: 'Finalize Q4 roadmap', col2: 'Oct 28', col3: 'Priya Poluru', status: 'In progress' },
    { col1: 'Vendor review summary', col2: 'Oct 30', col3: 'Rohan Poluru', status: 'Review' },
    { col1: 'Budget sign-off', col2: 'Nov 2', col3: 'Meera Poluru', status: 'Ready' },
  ];

  protected readonly reviewers = [
    { name: 'Ananya Poluru', role: 'Team coordinator', fixed: '48', score: '97%' },
    { name: 'Rohan Poluru', role: 'Operations lead', fixed: '41', score: '95%' },
    { name: 'Meera Poluru', role: 'Project manager', fixed: '36', score: '93%' },
  ];

  protected readonly activity = [
    { time: '11:04', title: 'Action marked complete', detail: 'Ananya Poluru · Sprint planning notes', tone: 'success' as const },
    { time: '10:37', title: 'Owner reassigned', detail: 'Rohan Poluru · Vendor escalation', tone: 'warning' as const },
    { time: '09:52', title: 'Meeting synced', detail: 'Meera Poluru · Weekly leadership standup', tone: 'success' as const },
  ];

  protected readonly metrics = [
    { value: '42', label: 'Open actions', trend: 'down' as const, trendValue: '8.3%', hint: 'vs. last period' },
    { value: '91%', label: 'On-time completion', trend: 'up' as const, trendValue: '4.2%', hint: 'rolling 30 days' },
    { value: '156', label: 'Closed this month', trend: 'up' as const, trendValue: '11.1%', hint: 'verified owners' },
    { value: '7', label: 'Overdue items', trend: 'down' as const, trendValue: '22%', hint: 'needs attention' },
  ];

  protected setPeriod(value: string): void {
    this.period.set(value);
  }

  protected exportReport(): void {
    this.exportLabel.set('Exported');
    window.setTimeout(() => this.exportLabel.set('Export actions'), 1800);
  }

  protected statusVariant(status: string): 'success' | 'warning' | 'neutral' {
    if (/ready|clean|pass|complete|approved|stable|sign|verify|publish/i.test(status)) return 'success';
    if (/review|fix|work|fail|adjust|warn|draft|screen|shop/i.test(status)) return 'warning';
    return 'neutral';
  }
}
