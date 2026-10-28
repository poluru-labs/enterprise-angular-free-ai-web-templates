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
  protected readonly exportLabel = signal('Export comparison');

  protected readonly periodOptions = [
    { label: '7 days', value: '7d' },
    { label: '30 days', value: '30d' },
    { label: '90 days', value: '90d' },
  ];

  protected readonly navItems = [
    { label: 'Overview', icon: 'home' as const },
    { label: 'Clauses', icon: 'file' as const },
    { label: 'Contracts', icon: 'folder' as const },
    { label: 'Reports', icon: 'check' as const },
  ];

  protected readonly issueTypes = [
    { name: 'Liability', count: '48', value: 86, color: '#090088' },
    { name: 'Payment terms', count: '31', value: 64, color: '#080075' },
    { name: 'Termination', count: '24', value: 47, color: '#5f59b2' },
    { name: 'Confidentiality', count: '19', value: 36, color: '#bab8de' },
  ];

  protected readonly pages = [
    { col1: 'Vendor MSAs batch', col2: '6', col3: 'Aarav Poluru', status: 'In review' },
    { col1: 'Customer enterprise', col2: '4', col3: 'Riya Poluru', status: 'Counsel review' },
    { col1: 'Partner addendum', col2: '2', col3: 'Kavita Poluru', status: 'Ready to sign' },
  ];

  protected readonly reviewers = [
    { name: 'Aarav Poluru', role: 'Legal analyst', fixed: '72', score: '97%' },
    { name: 'Riya Poluru', role: 'Contract manager', fixed: '68', score: '96%' },
    { name: 'Kavita Poluru', role: 'Paralegal', fixed: '54', score: '94%' },
  ];

  protected readonly activity = [
    { time: '10:46', title: 'Clause accepted', detail: 'Aarav Poluru · Indemnity standard text', tone: 'success' as const },
    { time: '10:12', title: 'Deviation noted', detail: 'Riya Poluru · Net-45 payment term', tone: 'warning' as const },
    { time: '09:33', title: 'Playbook updated', detail: 'Kavita Poluru · Data processing clause', tone: 'success' as const },
  ];

  protected readonly metrics = [
    { value: '12', label: 'Contracts in review', trend: 'up' as const, trendValue: '2', hint: 'new this week' },
    { value: '94%', label: 'Standard clause match', trend: 'up' as const, trendValue: '1.2%', hint: 'vs. playbook' },
    { value: '218', label: 'Clauses analyzed', trend: 'up' as const, trendValue: '16.3%', hint: 'this period' },
    { value: '14', label: 'Deviations flagged', trend: 'down' as const, trendValue: '5', hint: 'awaiting counsel' },
  ];

  protected setPeriod(value: string): void {
    this.period.set(value);
  }

  protected exportReport(): void {
    this.exportLabel.set('Exported');
    window.setTimeout(() => this.exportLabel.set('Export comparison'), 1800);
  }

  protected statusVariant(status: string): 'success' | 'warning' | 'neutral' {
    if (/ready|clean|pass|complete|approved|stable|sign|verify|publish/i.test(status)) return 'success';
    if (/review|fix|work|fail|adjust|warn|draft|screen|shop/i.test(status)) return 'warning';
    return 'neutral';
  }
}
