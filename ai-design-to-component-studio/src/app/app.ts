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
  protected readonly exportLabel = signal('Export specs');

  protected readonly periodOptions = [
    { label: '7 days', value: '7d' },
    { label: '30 days', value: '30d' },
    { label: '90 days', value: '90d' },
  ];

  protected readonly navItems = [
    { label: 'Overview', icon: 'home' as const },
    { label: 'Components', icon: 'folder' as const },
    { label: 'Frames', icon: 'file' as const },
    { label: 'Reports', icon: 'check' as const },
  ];

  protected readonly issueTypes = [
    { name: 'Buttons & inputs', count: '48', value: 86, color: '#53C7F0' },
    { name: 'Navigation', count: '31', value: 64, color: '#47abce' },
    { name: 'Data display', count: '24', value: 47, color: '#8fdbf5' },
    { name: 'Feedback', count: '19', value: 36, color: '#cfeffb' },
  ];

  protected readonly pages = [
    { col1: 'Checkout summary card', col2: '6', col3: 'Kiran Poluru', status: 'In review' },
    { col1: 'Filter drawer', col2: '4', col3: 'Mira Poluru', status: 'In progress' },
    { col1: 'Status badge set', col2: '8', col3: 'Tara Poluru', status: 'Ready' },
  ];

  protected readonly reviewers = [
    { name: 'Kiran Poluru', role: 'Design lead', fixed: '64', score: '99%' },
    { name: 'Mira Poluru', role: 'Product designer', fixed: '52', score: '97%' },
    { name: 'Tara Poluru', role: 'UX engineer', fixed: '48', score: '96%' },
  ];

  protected readonly activity = [
    { time: '10:52', title: 'Spec approved', detail: 'Kiran Poluru · Primary button variants', tone: 'success' as const },
    { time: '10:18', title: 'Token sync', detail: 'Mira Poluru · Spacing scale update', tone: 'success' as const },
    { time: '09:40', title: 'Comment thread', detail: 'Tara Poluru · Icon sizing on mobile', tone: 'warning' as const },
  ];

  protected readonly metrics = [
    { value: '64', label: 'Components mapped', trend: 'up' as const, trendValue: '8', hint: 'this sprint' },
    { value: '88%', label: 'Spec completeness', trend: 'up' as const, trendValue: '4.6%', hint: 'design tokens included' },
    { value: '132', label: 'Variants documented', trend: 'up' as const, trendValue: '11.2%', hint: 'all platforms' },
    { value: '9', label: 'Open reviews', trend: 'down' as const, trendValue: '15%', hint: 'awaiting engineering' },
  ];

  protected setPeriod(value: string): void {
    this.period.set(value);
  }

  protected exportReport(): void {
    this.exportLabel.set('Exported');
    window.setTimeout(() => this.exportLabel.set('Export specs'), 1800);
  }

  protected statusVariant(status: string): 'success' | 'warning' | 'neutral' {
    if (/ready|clean|pass|complete|approved|stable|sign|verify|publish/i.test(status)) return 'success';
    if (/review|fix|work|fail|adjust|warn|draft|screen|shop/i.test(status)) return 'warning';
    return 'neutral';
  }
}
