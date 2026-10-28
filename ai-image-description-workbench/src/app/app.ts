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
  protected readonly exportLabel = signal('Export catalog');

  protected readonly periodOptions = [
    { label: '7 days', value: '7d' },
    { label: '30 days', value: '30d' },
    { label: '90 days', value: '90d' },
  ];

  protected readonly navItems = [
    { label: 'Overview', icon: 'home' as const },
    { label: 'Assets', icon: 'file' as const },
    { label: 'Queues', icon: 'folder' as const },
    { label: 'Reports', icon: 'check' as const },
  ];

  protected readonly issueTypes = [
    { name: 'Marketing hero', count: '48', value: 86, color: '#1591DC' },
    { name: 'Product gallery', count: '31', value: 64, color: '#127dbd' },
    { name: 'Documentation', count: '24', value: 47, color: '#67b8e8' },
    { name: 'Social posts', count: '19', value: 36, color: '#bde0f5' },
  ];

  protected readonly pages = [
    { col1: 'Fall campaign', col2: '24', col3: 'Mira Poluru', status: 'In progress' },
    { col1: 'Help center screenshots', col2: '18', col3: 'Ananya Poluru', status: 'Review' },
    { col1: 'Partner logos', col2: '11', col3: 'Dev Poluru', status: 'Ready' },
  ];

  protected readonly reviewers = [
    { name: 'Mira Poluru', role: 'Content specialist', fixed: '412', score: '98%' },
    { name: 'Ananya Poluru', role: 'Editor', fixed: '386', score: '97%' },
    { name: 'Dev Poluru', role: 'Media coordinator', fixed: '341', score: '95%' },
  ];

  protected readonly activity = [
    { time: '11:02', title: 'Batch approved', detail: 'Mira Poluru · Product gallery set B', tone: 'success' as const },
    { time: '10:25', title: 'Guideline linked', detail: 'Ananya Poluru · Character limit policy', tone: 'success' as const },
    { time: '09:50', title: 'Rework requested', detail: 'Dev Poluru · Hero banner crop context', tone: 'warning' as const },
  ];

  protected readonly metrics = [
    { value: '2,480', label: 'Images in catalog', trend: 'up' as const, trendValue: '120', hint: 'uploaded this month' },
    { value: '89%', label: 'Described & approved', trend: 'up' as const, trendValue: '3.8%', hint: 'sample audit' },
    { value: '412', label: 'Descriptions added', trend: 'up' as const, trendValue: '22.4%', hint: 'this period' },
    { value: '38', label: 'Needs rewrite', trend: 'down' as const, trendValue: '9%', hint: 'quality review' },
  ];

  protected setPeriod(value: string): void {
    this.period.set(value);
  }

  protected exportReport(): void {
    this.exportLabel.set('Exported');
    window.setTimeout(() => this.exportLabel.set('Export catalog'), 1800);
  }

  protected statusVariant(status: string): 'success' | 'warning' | 'neutral' {
    if (/ready|clean|pass|complete|approved|stable|sign|verify|publish/i.test(status)) return 'success';
    if (/review|fix|work|fail|adjust|warn|draft|screen|shop/i.test(status)) return 'warning';
    return 'neutral';
  }
}
