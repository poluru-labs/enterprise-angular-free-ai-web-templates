import { Component, computed, signal } from '@angular/core';
import {
  EdsAvatarComponent,
  EdsBadgeComponent,
  EdsButtonComponent,
  EdsCardComponent,
  EdsIconComponent,
  EdsInputComponent,
  EdsProgressBarComponent,
  EdsStatusComponent,
} from '@poluru-labs/enterprise-design-system-angular';

type AuditStatus = 'Verified' | 'Review' | 'Flagged';

interface AuditRecord {
  id: string;
  time: string;
  title: string;
  actor: string;
  model: string;
  framework: string;
  status: AuditStatus;
  hash: string;
}

@Component({
  selector: 'app-root',
  imports: [
    EdsAvatarComponent,
    EdsBadgeComponent,
    EdsButtonComponent,
    EdsCardComponent,
    EdsIconComponent,
    EdsInputComponent,
    EdsProgressBarComponent,
    EdsStatusComponent,
  ],
  templateUrl: './app.html',
})
export class App {
  protected readonly activeNav = signal('Overview');
  protected readonly query = signal('');
  protected readonly statusFilter = signal<'All' | AuditStatus>('All');
  protected readonly lastUpdated = signal('just now');

  protected readonly records: AuditRecord[] = [
    { id: 'ATR-2048', time: '09:42:18', title: 'Customer risk summary generated', actor: 'Ananya Poluru', model: 'GPT-4.1', framework: 'EU AI Act', status: 'Verified', hash: '8f2a…c19e' },
    { id: 'ATR-2047', time: '09:36:04', title: 'Loan decision explanation reviewed', actor: 'Rahul Poluru', model: 'Claude 3.7', framework: 'SOC 2', status: 'Review', hash: 'a91d…72b4' },
    { id: 'ATR-2046', time: '09:21:51', title: 'Support response policy check', actor: 'Meera Poluru', model: 'Gemini 2.5', framework: 'EU AI Act', status: 'Verified', hash: '4bd8…2fd1' },
    { id: 'ATR-2045', time: '08:58:29', title: 'PII handling exception detected', actor: 'Vikram Poluru', model: 'GPT-4.1', framework: 'SOC 2', status: 'Flagged', hash: '0ec7…9a80' },
    { id: 'ATR-2044', time: '08:41:12', title: 'Vendor assessment draft created', actor: 'Nisha Poluru', model: 'Claude 3.7', framework: 'ISO 42001', status: 'Verified', hash: 'df31…b620' },
  ];

  protected readonly filteredRecords = computed(() => {
    const query = this.query().trim().toLowerCase();
    return this.records.filter((record) => {
      const matchesStatus =
        this.statusFilter() === 'All' || record.status === this.statusFilter();
      const matchesQuery =
        !query ||
        `${record.id} ${record.title} ${record.actor} ${record.model}`
          .toLowerCase()
          .includes(query);
      return matchesStatus && matchesQuery;
    });
  });

  protected selectNav(item: string): void {
    this.activeNav.set(item);
  }

  protected updateSearch(value: string): void {
    this.query.set(value);
  }

  protected cycleStatus(): void {
    const filters: Array<'All' | AuditStatus> = ['All', 'Verified', 'Review', 'Flagged'];
    const next = (filters.indexOf(this.statusFilter()) + 1) % filters.length;
    this.statusFilter.set(filters[next]);
  }

  protected refresh(): void {
    this.lastUpdated.set('just now');
  }

  protected badgeVariant(status: AuditStatus): 'success' | 'warning' | 'danger' {
    return status === 'Verified' ? 'success' : status === 'Review' ? 'warning' : 'danger';
  }
}
