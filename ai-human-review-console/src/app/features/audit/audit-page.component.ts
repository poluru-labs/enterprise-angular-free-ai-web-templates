import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { templateConfig } from '../../core/config/template.config';
import { initials } from '../../shared/utils/initials';

@Component({
  selector: 'app-audit-page',
  standalone: true,
  host: { class: 'page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Accountability</p>
        <h1>Audit log</h1>
        <p class="summary">Every assignment, decision, calibration, and policy change from the Review Desk team.</p>
      </div>
      <button type="button" class="secondary" (click)="exportLog()">
        <span class="material-symbols-outlined">download</span>
        Export
      </button>
    </section>

    @if (notice()) {
      <p class="notice">{{ notice() }}</p>
    }

    <section class="metrics mini">
      <article class="metric"><p>Events</p><div class="value">{{ filtered().length }}</div></article>
      <article class="metric"><p>Reviewers</p><div class="value">{{ reviewerCount }}</div></article>
      <article class="metric"><p>Decisions</p><div class="value">{{ countKind('Decision') }}</div></article>
      <article class="metric"><p>Escalations</p><div class="value">{{ countKind('Escalation') }}</div></article>
    </section>

    <div class="toolbar">
      <label class="search">
        <span class="material-symbols-outlined">search</span>
        <input type="search" placeholder="Search actor or action" (input)="onQuery($event)" />
      </label>
      <div class="chips">
        @for (item of actors; track item) {
          <button type="button" class="chip" [class.active]="actor() === item" (click)="actor.set(item)">{{ item }}</button>
        }
      </div>
    </div>

    <article class="panel">
      <div class="rows">
        @for (item of filtered(); track item.time + item.action) {
          <div class="row">
            <span class="agenda-time">{{ item.time }}</span>
            <span class="avatar">{{ initials(item.actor) }}</span>
            <div class="copy">
              <strong>{{ item.actor }}</strong>
              <small>{{ item.action }}</small>
            </div>
            <span class="status info">{{ item.kind }}</span>
          </div>
        }
        @if (filtered().length === 0) {
          <p class="empty">No events match this filter.</p>
        }
      </div>
    </article>
  `
})
export class AuditPageComponent {
  protected readonly config = templateConfig;
  protected readonly initials = initials;
  protected readonly actors = ['All', 'Aisha Poluru', 'Maya Poluru', 'Arjun Poluru', 'Jordan Poluru', 'Sahana Poluru'] as const;
  protected readonly actor = signal<(typeof this.actors)[number]>('All');
  protected readonly query = signal('');
  protected readonly notice = signal('');
  protected readonly reviewerCount = new Set(templateConfig.audit.map((item) => item.actor)).size;

  protected readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const who = this.actor();
    return this.config.audit.filter((item) => {
      const matchWho = who === 'All' || item.actor === who;
      const hay = `${item.actor} ${item.action} ${item.kind}`.toLowerCase();
      return matchWho && (!q || hay.includes(q));
    });
  });

  protected countKind(kind: string): number {
    return this.config.audit.filter((item) => item.kind === kind).length;
  }

  protected onQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected exportLog(): void {
    this.notice.set(`Exported ${this.filtered().length} events for Aisha Poluru.`);
  }
}
