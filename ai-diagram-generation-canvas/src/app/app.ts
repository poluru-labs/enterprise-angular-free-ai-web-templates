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
  protected readonly exportLabel = signal('Export diagrams');

  protected readonly periodOptions = [
    { label: '7 days', value: '7d' },
    { label: '30 days', value: '30d' },
    { label: '90 days', value: '90d' },
  ];

  protected readonly navItems = [
    { label: 'Overview', icon: 'home' as const },
    { label: 'Canvas', icon: 'file' as const },
    { label: 'Library', icon: 'folder' as const },
    { label: 'Reports', icon: 'check' as const },
  ];

  protected readonly issueTypes = [
    { name: 'Flowcharts', count: '48', value: 86, color: '#FF2626' },
    { name: 'Sequence', count: '31', value: 64, color: '#db2121' },
    { name: 'Architecture', count: '24', value: 47, color: '#ff7272' },
    { name: 'Network', count: '19', value: 36, color: '#ffc2c2' },
  ];

  protected readonly pages = [
    { col1: 'Payments sequence', col2: '5', col3: 'Sana Poluru', status: 'Review' },
    { col1: 'Warehouse layout', col2: '3', col3: 'Kiran Poluru', status: 'Draft' },
    { col1: 'Auth flow v2', col2: '7', col3: 'Tara Poluru', status: 'Approved' },
  ];

  protected readonly reviewers = [
    { name: 'Sana Poluru', role: 'Visual designer', fixed: '148', score: '98%' },
    { name: 'Kiran Poluru', role: 'Architect', fixed: '132', score: '96%' },
    { name: 'Tara Poluru', role: 'Technical writer', fixed: '118', score: '95%' },
  ];

  protected readonly activity = [
    { time: '11:18', title: 'Version published', detail: 'Sana Poluru · Auth flow v2', tone: 'success' as const },
    { time: '10:44', title: 'Comment resolved', detail: 'Kiran Poluru · Warehouse lane labels', tone: 'success' as const },
    { time: '09:57', title: 'Template added', detail: 'Tara Poluru · Standard gateway icon set', tone: 'warning' as const },
  ];

  protected readonly metrics = [
    { value: '148', label: 'Diagrams published', trend: 'up' as const, trendValue: '12', hint: 'this sprint' },
    { value: '86%', label: 'Reuse from templates', trend: 'up' as const, trendValue: '4.1%', hint: 'standard shapes' },
    { value: '326', label: 'Collaborator edits', trend: 'up' as const, trendValue: '17.9%', hint: 'this period' },
    { value: '11', label: 'Pending approval', trend: 'down' as const, trendValue: '2', hint: 'architecture board' },
  ];

  protected setPeriod(value: string): void {
    this.period.set(value);
  }

  protected exportReport(): void {
    this.exportLabel.set('Exported');
    window.setTimeout(() => this.exportLabel.set('Export diagrams'), 1800);
  }

  protected statusVariant(status: string): 'success' | 'warning' | 'neutral' {
    if (/ready|clean|pass|complete|approved|stable|sign|verify|publish/i.test(status)) return 'success';
    if (/review|fix|work|fail|adjust|warn|draft|screen|shop/i.test(status)) return 'warning';
    return 'neutral';
  }
}
