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
  protected readonly exportLabel = signal('Export locales');

  protected readonly periodOptions = [
    { label: '7 days', value: '7d' },
    { label: '30 days', value: '30d' },
    { label: '90 days', value: '90d' },
  ];

  protected readonly navItems = [
    { label: 'Overview', icon: 'home' as const },
    { label: 'Strings', icon: 'file' as const },
    { label: 'Locales', icon: 'folder' as const },
    { label: 'Reports', icon: 'check' as const },
  ];

  protected readonly issueTypes = [
    { name: 'Terminology', count: '48', value: 86, color: '#8D0B41' },
    { name: 'Length overflow', count: '31', value: 64, color: '#790938' },
    { name: 'Placeholder mismatch', count: '24', value: 47, color: '#b56084' },
    { name: 'Tone & voice', count: '19', value: 36, color: '#dfbbca' },
  ];

  protected readonly pages = [
    { col1: 'fr-CA', col2: '12', col3: 'Meera Poluru', status: 'In progress' },
    { col1: 'de-DE', col2: '8', col3: 'Nila Poluru', status: 'Review' },
    { col1: 'ja-JP', col2: '5', col3: 'Aarav Poluru', status: 'Ready to publish' },
  ];

  protected readonly reviewers = [
    { name: 'Meera Poluru', role: 'Lead linguist', fixed: '312', score: '98%' },
    { name: 'Nila Poluru', role: 'French specialist', fixed: '284', score: '97%' },
    { name: 'Aarav Poluru', role: 'German specialist', fixed: '251', score: '96%' },
  ];

  protected readonly activity = [
    { time: '10:58', title: 'Batch approved', detail: 'Meera Poluru · Checkout microcopy', tone: 'success' as const },
    { time: '10:21', title: 'Glossary update', detail: 'Nila Poluru · Product terminology', tone: 'success' as const },
    { time: '09:44', title: 'Issue flagged', detail: 'Aarav Poluru · Button label overflow', tone: 'warning' as const },
  ];

  protected readonly metrics = [
    { value: '18', label: 'Locales in review', trend: 'up' as const, trendValue: '2 locales', hint: 'added this sprint' },
    { value: '96.4%', label: 'Approved strings', trend: 'up' as const, trendValue: '1.8%', hint: 'sample catalog' },
    { value: '1,284', label: 'Updates verified', trend: 'up' as const, trendValue: '9.4%', hint: 'this period' },
    { value: '34', label: 'Open issues', trend: 'down' as const, trendValue: '12%', hint: 'needs linguist review' },
  ];

  protected setPeriod(value: string): void {
    this.period.set(value);
  }

  protected exportReport(): void {
    this.exportLabel.set('Exported');
    window.setTimeout(() => this.exportLabel.set('Export locales'), 1800);
  }

  protected statusVariant(status: string): 'success' | 'warning' | 'neutral' {
    if (/ready|clean|pass|complete|approved|stable|sign|verify|publish/i.test(status)) return 'success';
    if (/review|fix|work|fail|adjust|warn|draft|screen|shop/i.test(status)) return 'warning';
    return 'neutral';
  }
}
