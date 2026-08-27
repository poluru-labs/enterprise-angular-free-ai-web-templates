import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { templateConfig } from '../template.config';

@Component({
  selector: 'app-audit-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Accountability</p>
        <h1>Audit log</h1>
        <p class="summary">Every assignment, decision, and policy change from the Review Desk team.</p>
      </div>
    </section>

    <section class="metrics mini">
      <article class="metric"><p>Events today</p><div class="value">{{ filtered().length }}</div></article>
      <article class="metric"><p>Reviewers</p><div class="value">5</div></article>
      <article class="metric"><p>Approvals</p><div class="value">1</div></article>
      <article class="metric"><p>Escalations</p><div class="value">1</div></article>
    </section>

    <div class="toolbar">
      <label class="search">
        <span class="material-symbols-outlined">search</span>
        <input type="search" placeholder="Search actor or action" (input)="query.set($any($event.target).value)" />
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
  protected readonly actors = ['All', 'Aisha Poluru', 'Maya Poluru', 'Arjun Poluru', 'Jordan Poluru'] as const;
  protected readonly actor = signal<(typeof this.actors)[number]>('All');
  protected readonly query = signal('');

  protected readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const who = this.actor();
    return this.config.audit.filter((item) => {
      const matchWho = who === 'All' || item.actor === who;
      const hay = `${item.actor} ${item.action}`.toLowerCase();
      return matchWho && (!q || hay.includes(q));
    });
  });

  protected initials(name: string): string {
    return name.split(' ').map((part) => part[0]).join('').slice(0, 2);
  }
}
