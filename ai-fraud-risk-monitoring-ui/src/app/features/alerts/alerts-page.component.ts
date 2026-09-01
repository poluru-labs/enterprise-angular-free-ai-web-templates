import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { templateConfig } from '../../core/config/template.config';

type AlertRow = (typeof templateConfig.alerts)[number] & { done?: boolean; snoozed?: boolean };

@Component({
  selector: 'app-alerts-page',
  standalone: true,
  imports: [RouterLink],
  host: { class: 'page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Detection</p>
        <h1>Alerts</h1>
        <p class="summary">Triage high-risk signals. Assign, snooze, or open the linked case. {{ openCount() }} remain in the queue.</p>
      </div>
      <a class="secondary" routerLink="/settings">
        <span class="material-symbols-outlined">tune</span>
        Alert settings
      </a>
    </section>

    @if (notice()) {
      <p class="notice">{{ notice() }}</p>
    }

    <section class="metrics mini">
      <article class="metric"><p>Open</p><div class="value">{{ openCount() }}</div></article>
      <article class="metric"><p>High</p><div class="value">{{ highCount() }}</div></article>
      <article class="metric"><p>Median age</p><div class="value">{{ medianAge() }}</div></article>
      <article class="metric"><p>Assigned to you</p><div class="value">{{ assignedToYou() }}</div></article>
    </section>

    <div class="toolbar">
      <label class="search">
        <span class="material-symbols-outlined">search</span>
        <input type="search" placeholder="Search person, BIN, or rule" (input)="onQuery($event)" />
      </label>
      <div class="chips">
        @for (item of filters; track item) {
          <button type="button" class="chip" [class.active]="filter() === item" (click)="filter.set(item)">{{ item }}</button>
        }
      </div>
    </div>

    <section class="split">
      <article class="panel list-panel">
        @for (alert of filtered(); track alert.id) {
          <button type="button" class="list-row alert-row selectable" [class.selected]="selectedId() === alert.id" (click)="selectedId.set(alert.id)">
            <span class="status-icon material-symbols-outlined" [class]="alert.tone">
              {{ alert.tone === 'warn' ? 'error' : alert.tone === 'rose' ? 'warning' : 'info' }}
            </span>
            <div class="copy">
              <strong>{{ alert.title }}</strong>
              <small>{{ alert.detail }}</small>
            </div>
            <span class="status" [class]="alert.tone">{{ alert.severity }}</span>
            <small class="muted">{{ alert.time }}</small>
          </button>
        }
        @if (filtered().length === 0) {
          <p class="empty">No alerts match this filter.</p>
        }
      </article>

      @if (selected(); as alert) {
        <aside class="panel detail">
          <p class="eyebrow">{{ alert.id }}</p>
          <h2>{{ alert.title }}</h2>
          <p class="muted">{{ alert.detail }}</p>
          <dl class="facts">
            <div><dt>Severity</dt><dd>{{ alert.severity }}</dd></div>
            <div><dt>Channel</dt><dd>{{ alert.channel }}</dd></div>
            <div><dt>Assignee</dt><dd>{{ alert.assignee }}</dd></div>
            <div><dt>Age</dt><dd>{{ alert.time }}</dd></div>
          </dl>
          <div class="inline-actions">
            <button type="button" class="primary" (click)="ack(alert.id)">Acknowledge</button>
            <button type="button" class="secondary" (click)="assign(alert.id)">Assign to me</button>
            <button type="button" class="secondary" (click)="snooze(alert.id)">Snooze 30m</button>
            <a class="secondary" [routerLink]="alert.path">Open case</a>
          </div>
        </aside>
      }
    </section>
  `
})
export class AlertsPageComponent {
  protected readonly config = templateConfig;
  protected readonly filters = ['All', 'High', 'Medium', 'Info'] as const;
  protected readonly filter = signal<(typeof this.filters)[number]>('All');
  protected readonly query = signal('');
  protected readonly selectedId = signal(templateConfig.alerts[0].id);
  protected readonly notice = signal('');
  protected readonly rows = signal<AlertRow[]>(templateConfig.alerts.map((item) => ({ ...item })));

  protected readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const sev = this.filter();
    return this.rows().filter((item) => {
      const sevOk = sev === 'All' || item.severity === sev;
      const qOk = !q || `${item.title} ${item.detail} ${item.assignee} ${item.channel}`.toLowerCase().includes(q);
      return sevOk && qOk && !item.done && !item.snoozed;
    });
  });

  protected readonly selected = computed(
    () => this.filtered().find((item) => item.id === this.selectedId()) ?? this.filtered()[0]
  );
  protected readonly openCount = computed(() => this.rows().filter((item) => !item.done && !item.snoozed).length);
  protected readonly highCount = computed(
    () => this.rows().filter((item) => !item.done && !item.snoozed && item.severity === 'High').length
  );
  protected readonly assignedToYou = computed(
    () => this.rows().filter((item) => !item.done && !item.snoozed && item.assignee === 'Aisha Poluru').length
  );
  protected readonly medianAge = computed(() => {
    const ages = this.rows()
      .filter((item) => !item.done && !item.snoozed)
      .map((item) => item.ageMinutes)
      .sort((a, b) => a - b);
    if (ages.length === 0) {
      return '—';
    }
    const mid = ages[Math.floor(ages.length / 2)];
    return mid >= 60 ? `${Math.round(mid / 60)}h` : `${mid}m`;
  });

  protected onQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected ack(id: string): void {
    this.rows.update((list) => list.map((item) => (item.id === id ? { ...item, done: true } : item)));
    this.notice.set('Alert acknowledged and removed from the queue.');
  }

  protected assign(id: string): void {
    this.rows.update((list) => list.map((item) => (item.id === id ? { ...item, assignee: 'Aisha Poluru' } : item)));
    this.notice.set('Assigned to Aisha Poluru.');
  }

  protected snooze(id: string): void {
    this.rows.update((list) => list.map((item) => (item.id === id ? { ...item, snoozed: true } : item)));
    this.notice.set('Alert snoozed for 30 minutes.');
  }
}
