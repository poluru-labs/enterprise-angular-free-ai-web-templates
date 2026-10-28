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
  protected readonly exportLabel = signal('Export paths');

  protected readonly periodOptions = [
    { label: '7 days', value: '7d' },
    { label: '30 days', value: '30d' },
    { label: '90 days', value: '90d' },
  ];

  protected readonly navItems = [
    { label: 'Overview', icon: 'home' as const },
    { label: 'Paths', icon: 'folder' as const },
    { label: 'Learners', icon: 'user' as const },
    { label: 'Reports', icon: 'star' as const },
  ];

  protected readonly issueTypes = [
    { name: 'Leadership', count: '48', value: 86, color: '#DC0E0E' },
    { name: 'Engineering', count: '31', value: 64, color: '#bd0c0c' },
    { name: 'Compliance', count: '24', value: 47, color: '#e86262' },
    { name: 'Customer skills', count: '19', value: 36, color: '#f5bcbc' },
  ];

  protected readonly pages = [
    { col1: 'New manager essentials', col2: '86', col3: 'Rohan Poluru', status: 'Active' },
    { col1: 'Security fundamentals', col2: '64', col3: 'Kavita Poluru', status: 'Active' },
    { col1: 'Design systems intro', col2: '41', col3: 'Mira Poluru', status: 'Draft' },
  ];

  protected readonly reviewers = [
    { name: 'Rohan Poluru', role: 'Program owner', fixed: '124', score: '97%' },
    { name: 'Kavita Poluru', role: 'Instruction designer', fixed: '98', score: '95%' },
    { name: 'Mira Poluru', role: 'Curriculum specialist', fixed: '87', score: '94%' },
  ];

  protected readonly activity = [
    { time: '11:20', title: 'Milestone reached', detail: 'Kavita Poluru · Security path week 4', tone: 'success' as const },
    { time: '10:33', title: 'Path published', detail: 'Rohan Poluru · Manager essentials', tone: 'success' as const },
    { time: '09:58', title: 'Reminder sent', detail: 'Mira Poluru · 19 learners behind pace', tone: 'warning' as const },
  ];

  protected readonly metrics = [
    { value: '24', label: 'Active paths', trend: 'up' as const, trendValue: '3', hint: 'launched this quarter' },
    { value: '78%', label: 'Completion rate', trend: 'up' as const, trendValue: '5.2%', hint: 'rolling average' },
    { value: '412', label: 'Modules finished', trend: 'up' as const, trendValue: '14.8%', hint: 'this period' },
    { value: '19', label: 'At-risk learners', trend: 'down' as const, trendValue: '8%', hint: 'behind schedule' },
  ];

  protected setPeriod(value: string): void {
    this.period.set(value);
  }

  protected exportReport(): void {
    this.exportLabel.set('Exported');
    window.setTimeout(() => this.exportLabel.set('Export paths'), 1800);
  }

  protected statusVariant(status: string): 'success' | 'warning' | 'neutral' {
    if (/ready|clean|pass|complete|approved|stable|sign|verify|publish/i.test(status)) return 'success';
    if (/review|fix|work|fail|adjust|warn|draft|screen|shop/i.test(status)) return 'warning';
    return 'neutral';
  }
}
