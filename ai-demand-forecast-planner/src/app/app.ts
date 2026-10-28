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
  protected readonly exportLabel = signal('Export forecast');

  protected readonly periodOptions = [
    { label: '7 days', value: '7d' },
    { label: '30 days', value: '30d' },
    { label: '90 days', value: '90d' },
  ];

  protected readonly navItems = [
    { label: 'Overview', icon: 'home' as const },
    { label: 'Forecasts', icon: 'folder' as const },
    { label: 'SKUs', icon: 'file' as const },
    { label: 'Reports', icon: 'star' as const },
  ];

  protected readonly issueTypes = [
    { name: 'Electronics', count: '48', value: 86, color: '#17BEBB' },
    { name: 'Home goods', count: '31', value: 64, color: '#14a3a1' },
    { name: 'Apparel', count: '24', value: 47, color: '#68d5d3' },
    { name: 'Seasonal', count: '19', value: 36, color: '#beedec' },
  ];

  protected readonly pages = [
    { col1: 'Wireless accessories', col2: '12%', col3: 'Dev Poluru', status: 'Review' },
    { col1: 'Kitchen appliances', col2: '8%', col3: 'Nila Poluru', status: 'Stable' },
    { col1: 'Outdoor seasonal', col2: '15%', col3: 'Rohan Poluru', status: 'Adjusting' },
  ];

  protected readonly reviewers = [
    { name: 'Dev Poluru', role: 'Demand planner', fixed: '96', score: '97%' },
    { name: 'Nila Poluru', role: 'Inventory analyst', fixed: '88', score: '95%' },
    { name: 'Rohan Poluru', role: 'Finance partner', fixed: '81', score: '94%' },
  ];

  protected readonly activity = [
    { time: '10:54', title: 'Forecast locked', detail: 'Dev Poluru · Q4 baseline refresh', tone: 'success' as const },
    { time: '10:19', title: 'Override submitted', detail: 'Nila Poluru · Promo uplift scenario', tone: 'warning' as const },
    { time: '09:42', title: 'Actuals imported', detail: 'Rohan Poluru · POS weekly feed', tone: 'success' as const },
  ];

  protected readonly metrics = [
    { value: '96.2%', label: 'Forecast accuracy', trend: 'up' as const, trendValue: '1.4%', hint: 'vs. prior quarter' },
    { value: '1,842', label: 'SKUs tracked', trend: 'up' as const, trendValue: '48', hint: 'new catalog lines' },
    { value: '$4.2M', label: 'Planned revenue', trend: 'up' as const, trendValue: '6.8%', hint: 'next 90 days' },
    { value: '23', label: 'Override requests', trend: 'down' as const, trendValue: '11%', hint: 'awaiting approval' },
  ];

  protected setPeriod(value: string): void {
    this.period.set(value);
  }

  protected exportReport(): void {
    this.exportLabel.set('Exported');
    window.setTimeout(() => this.exportLabel.set('Export forecast'), 1800);
  }

  protected statusVariant(status: string): 'success' | 'warning' | 'neutral' {
    if (/ready|clean|pass|complete|approved|stable|sign|verify|publish/i.test(status)) return 'success';
    if (/review|fix|work|fail|adjust|warn|draft|screen|shop/i.test(status)) return 'warning';
    return 'neutral';
  }
}
