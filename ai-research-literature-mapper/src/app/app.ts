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
    { label: 'Papers', icon: 'file' as const },
    { label: 'Themes', icon: 'folder' as const },
    { label: 'Reports', icon: 'star' as const },
  ];

  protected readonly issueTypes = [
    { name: 'Clinical outcomes', count: '48', value: 86, color: '#5BBCFF' },
    { name: 'Methods', count: '31', value: 64, color: '#4ea2db' },
    { name: 'Policy', count: '24', value: 47, color: '#94d3ff' },
    { name: 'Economics', count: '19', value: 36, color: '#d1ecff' },
  ];

  protected readonly pages = [
    { col1: 'Diabetes intervention meta', col2: '86', col3: 'Kavita Poluru', status: 'Synthesizing' },
    { col1: 'Urban mobility policy', col2: '54', col3: 'Mira Poluru', status: 'Screening' },
    { col1: 'Workforce health study', col2: '42', col3: 'Nila Poluru', status: 'Complete' },
  ];

  protected readonly reviewers = [
    { name: 'Kavita Poluru', role: 'Lead researcher', fixed: '384', score: '99%' },
    { name: 'Mira Poluru', role: 'Analyst', fixed: '312', score: '97%' },
    { name: 'Nila Poluru', role: 'Librarian', fixed: '286', score: '96%' },
  ];

  protected readonly activity = [
    { time: '10:50', title: 'Cluster merged', detail: 'Kavita Poluru · Outcomes theme', tone: 'success' as const },
    { time: '10:22', title: 'Duplicate flagged', detail: 'Mira Poluru · DOI collision', tone: 'warning' as const },
    { time: '09:36', title: 'Export shared', detail: 'Nila Poluru · Policy brief citations', tone: 'success' as const },
  ];

  protected readonly metrics = [
    { value: '384', label: 'Sources cataloged', trend: 'up' as const, trendValue: '28', hint: 'added this month' },
    { value: '72', label: 'Theme clusters', trend: 'up' as const, trendValue: '5', hint: 'peer reviewed' },
    { value: '1,126', label: 'Annotations', trend: 'up' as const, trendValue: '19.2%', hint: 'all projects' },
    { value: '16', label: 'Conflicts to resolve', trend: 'down' as const, trendValue: '3', hint: 'methodology tags' },
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
