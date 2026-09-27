import { Component, signal } from '@angular/core';
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
})
export class App {
  protected readonly activeNav = signal('Overview');
  protected readonly period = signal('30d');
  protected readonly exportLabel = signal('Export');

  protected readonly periodOptions = [
    { label: '7 days', value: '7d' },
    { label: '30 days', value: '30d' },
    { label: '90 days', value: '90d' },
  ];

  protected readonly navItems = [
    { label: 'Overview', icon: 'home' as const },
    { label: 'Conversations', icon: 'mail' as const },
    { label: 'Intents', icon: 'folder' as const },
    { label: 'Satisfaction', icon: 'star' as const },
  ];

  protected readonly intents = [
    { name: 'Order status', count: '4,286', value: 86, color: '#72BAA9' },
    { name: 'Product information', count: '3,041', value: 64, color: '#337f70' },
    { name: 'Returns & refunds', count: '2,107', value: 47, color: '#9fd5c8' },
    { name: 'Account support', count: '1,524', value: 35, color: '#d4ebe6' },
  ];

  protected readonly agents = [
    { name: 'Ananya Poluru', role: 'Support specialist', conversations: '1,284', csat: '96%', status: 'Online' },
    { name: 'Rohan Poluru', role: 'Customer success', conversations: '1,109', csat: '94%', status: 'Online' },
    { name: 'Meera Poluru', role: 'Support specialist', conversations: '987', csat: '92%', status: 'Away' },
  ];

  protected readonly activity = [
    { time: '10:42', title: 'Conversation resolved', detail: 'Ananya Poluru · Order #8421', tone: 'success' },
    { time: '10:18', title: 'Escalated to team', detail: 'Rohan Poluru · Billing question', tone: 'warning' },
    { time: '09:56', title: 'Positive feedback received', detail: 'Meera Poluru · 5 star rating', tone: 'success' },
  ];

  protected setPeriod(value: string): void {
    this.period.set(value);
  }

  protected exportReport(): void {
    this.exportLabel.set('Exported');
    window.setTimeout(() => this.exportLabel.set('Export'), 1800);
  }
}
