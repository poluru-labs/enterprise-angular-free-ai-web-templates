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
  protected readonly exportLabel = signal('Export matches');

  protected readonly periodOptions = [
    { label: '7 days', value: '7d' },
    { label: '30 days', value: '30d' },
    { label: '90 days', value: '90d' },
  ];

  protected readonly navItems = [
    { label: 'Overview', icon: 'home' as const },
    { label: 'Candidates', icon: 'user' as const },
    { label: 'Roles', icon: 'folder' as const },
    { label: 'Reports', icon: 'file' as const },
  ];

  protected readonly issueTypes = [
    { name: 'Excellent fit', count: '48', value: 86, color: '#9B4444' },
    { name: 'Good fit', count: '31', value: 64, color: '#853a3a' },
    { name: 'Partial fit', count: '24', value: 47, color: '#be8585' },
    { name: 'Needs review', count: '19', value: 36, color: '#e3cbcb' },
  ];

  protected readonly pages = [
    { col1: 'Senior product designer', col2: '14', col3: 'Ananya Poluru', status: 'Interviewing' },
    { col1: 'Platform engineer', col2: '11', col3: 'Rohan Poluru', status: 'Screening' },
    { col1: 'Customer success lead', col2: '7', col3: 'Tara Poluru', status: 'New' },
  ];

  protected readonly reviewers = [
    { name: 'Ananya Poluru', role: 'Recruiting lead', fixed: '89', score: '96%' },
    { name: 'Rohan Poluru', role: 'Technical recruiter', fixed: '76', score: '94%' },
    { name: 'Tara Poluru', role: 'Coordinator', fixed: '62', score: '92%' },
  ];

  protected readonly activity = [
    { time: '11:12', title: 'Match promoted', detail: 'Ananya Poluru · Platform engineer req', tone: 'success' as const },
    { time: '10:49', title: 'Profile updated', detail: 'Rohan Poluru · Candidate portfolio link', tone: 'success' as const },
    { time: '10:05', title: 'Recruiter note added', detail: 'Tara Poluru · Salary band clarification', tone: 'warning' as const },
  ];

  protected readonly metrics = [
    { value: '128', label: 'Active candidates', trend: 'up' as const, trendValue: '6.2%', hint: 'in pipeline' },
    { value: '86%', label: 'Profile completeness', trend: 'up' as const, trendValue: '3.4%', hint: 'average score' },
    { value: '34', label: 'Strong matches', trend: 'up' as const, trendValue: '9.1%', hint: 'this week' },
    { value: '11', label: 'Interviews scheduled', trend: 'up' as const, trendValue: '4', hint: 'confirmed slots' },
  ];

  protected setPeriod(value: string): void {
    this.period.set(value);
  }

  protected exportReport(): void {
    this.exportLabel.set('Exported');
    window.setTimeout(() => this.exportLabel.set('Export matches'), 1800);
  }

  protected statusVariant(status: string): 'success' | 'warning' | 'neutral' {
    if (/ready|clean|pass|complete|approved|stable|sign|verify|publish/i.test(status)) return 'success';
    if (/review|fix|work|fail|adjust|warn|draft|screen|shop/i.test(status)) return 'warning';
    return 'neutral';
  }
}
