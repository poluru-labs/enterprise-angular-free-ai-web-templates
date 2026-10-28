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
    { label: 'Findings', icon: 'warning' as const },
    { label: 'Pages', icon: 'file' as const },
    { label: 'Reports', icon: 'folder' as const },
  ];

  protected readonly issueTypes = [
    { name: 'Color contrast', count: '48', value: 86, color: '#FFA1C5' },
    { name: 'Form labels', count: '31', value: 64, color: '#db8aa9' },
    { name: 'Keyboard focus', count: '24', value: 47, color: '#ffc2d9' },
    { name: 'Alt text & media', count: '19', value: 36, color: '#ffe5ef' },
  ];

  protected readonly pages = [
    { col1: '/checkout', col2: '12', col3: 'Nila Poluru', status: 'In progress' },
    { col1: '/account/settings', col2: '8', col3: 'Aarav Poluru', status: 'Review' },
    { col1: '/help/contact', col2: '5', col3: 'Meera Poluru', status: 'Ready to verify' },
  ];

  protected readonly reviewers = [
    { name: 'Kavita Poluru', role: 'Accessibility lead', fixed: '142', score: '98%' },
    { name: 'Rohan Poluru', role: 'Front-end engineer', fixed: '118', score: '96%' },
    { name: 'Tara Poluru', role: 'QA specialist', fixed: '97', score: '94%' },
  ];

  protected readonly activity = [
    { time: '11:04', title: 'Contrast fix merged', detail: 'Kavita Poluru · Checkout primary button', tone: 'success' as const },
    { time: '10:37', title: 'New finding assigned', detail: 'Rohan Poluru · Missing label on date picker', tone: 'warning' as const },
    { time: '09:52', title: 'Page verified', detail: 'Tara Poluru · Help contact form passed review', tone: 'success' as const },
  ];

  protected readonly metrics = [
    { value: '122', label: 'Open findings', trend: 'down' as const, trendValue: '14.2%', hint: 'vs. previous period' },
    { value: '91.6%', label: 'WCAG AA coverage', trend: 'up' as const, trendValue: '4.8%', hint: 'sample audit scope' },
    { value: '357', label: 'Issues resolved', trend: 'up' as const, trendValue: '22.1%', hint: 'this period' },
    { value: '6', label: 'Critical blockers', trend: 'down' as const, trendValue: '33%', hint: 'needs review' },
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
