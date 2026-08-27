import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { templateConfig } from '../template.config';

type Assignment = (typeof templateConfig.assignments)[number];

@Component({
  selector: 'app-assignments-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Work</p>
        <h1>Assignments</h1>
        <p class="summary">Take, reassign, or release items. Dual-review Safety work stays with Aisha or Sahana Poluru.</p>
      </div>
    </section>

    @if (notice()) {
      <p class="notice">{{ notice() }}</p>
    }

    <section class="metrics mini">
      <article class="metric"><p>Waiting</p><div class="value">{{ count('Waiting') }}</div></article>
      <article class="metric"><p>In review</p><div class="value">{{ count('In review') }}</div></article>
      <article class="metric"><p>Escalated</p><div class="value">{{ count('Escalated') }}</div></article>
      <article class="metric"><p>Yours</p><div class="value">{{ yours() }}</div></article>
    </section>

    <div class="toolbar">
      <label class="search">
        <span class="material-symbols-outlined">search</span>
        <input type="search" placeholder="Search ID, person, or queue" (input)="query.set($any($event.target).value)" />
      </label>
      <div class="chips">
        @for (item of filters; track item) {
          <button type="button" class="chip" [class.active]="filter() === item" (click)="filter.set(item)">{{ item }}</button>
        }
      </div>
    </div>

    <section class="split">
      <article class="panel list-panel">
        <div class="list-head assign-grid">
          <span>ID</span>
          <span>Subject</span>
          <span>Queue</span>
          <span>Owner</span>
          <span>Status</span>
        </div>
        @for (item of filtered(); track item.id) {
          <button type="button" class="list-row assign-grid selectable" [class.selected]="selectedId() === item.id" (click)="selectedId.set(item.id)">
            <strong>{{ item.id }}</strong>
            <span>{{ item.subject }}</span>
            <span>{{ item.queue }}</span>
            <span>{{ item.owner }}</span>
            <span class="status" [class]="item.tone">{{ item.status }}</span>
          </button>
        }
        @if (filtered().length === 0) {
          <p class="empty">No assignments match this filter.</p>
        }
      </article>

      @if (selected(); as item) {
        <aside class="panel detail">
          <p class="eyebrow">{{ item.id }}</p>
          <h2>{{ item.subject }}</h2>
          <p class="muted">{{ item.queue }} · score {{ item.score }} · aging {{ item.aging }}</p>
          <dl class="facts">
            <div><dt>Owner</dt><dd>{{ item.owner }}</dd></div>
            <div><dt>Opened</dt><dd>{{ item.opened }}</dd></div>
            <div><dt>Status</dt><dd>{{ item.status }}</dd></div>
            <div><dt>Queue</dt><dd>{{ item.queue }}</dd></div>
          </dl>
          <div class="timeline">
            @for (step of config.timeline; track step.time) {
              <div>
                <strong>{{ step.title }}</strong>
                <small>{{ step.time }} · {{ step.detail }}</small>
              </div>
            }
          </div>
          <div class="inline-actions">
            <button type="button" class="primary" (click)="take(item.id)">Assign to me</button>
            <button type="button" class="secondary" (click)="reassign(item.id)">Reassign Maya</button>
            <button type="button" class="secondary" (click)="release(item.id)">Release</button>
          </div>
        </aside>
      }
    </section>
  `
})
export class AssignmentsPageComponent {
  protected readonly config = templateConfig;
  protected readonly filters = ['All', 'Waiting', 'In review', 'Escalated', 'Resolved'] as const;
  protected readonly filter = signal<(typeof this.filters)[number]>('All');
  protected readonly query = signal('');
  protected readonly selectedId = signal(templateConfig.assignments[0].id);
  protected readonly notice = signal('');
  protected readonly rows = signal<Assignment[]>(templateConfig.assignments.map((item) => ({ ...item })));

  protected readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const status = this.filter();
    return this.rows().filter((item) => {
      const matchStatus = status === 'All' || item.status === status;
      const hay = `${item.id} ${item.subject} ${item.queue} ${item.owner}`.toLowerCase();
      return matchStatus && (!q || hay.includes(q));
    });
  });

  protected readonly selected = computed(
    () => this.filtered().find((item) => item.id === this.selectedId()) ?? this.filtered()[0]
  );

  protected count(status: string): number {
    return this.rows().filter((item) => item.status === status).length;
  }

  protected yours(): number {
    return this.rows().filter((item) => item.owner === 'Aisha Poluru').length;
  }

  protected take(id: string): void {
    this.patch(id, { owner: 'Aisha Poluru', status: 'In review', tone: 'warn' });
    this.notice.set(`${id} assigned to Aisha Poluru.`);
  }

  protected reassign(id: string): void {
    this.patch(id, { owner: 'Maya Poluru', status: 'In review', tone: 'warn' });
    this.notice.set(`${id} reassigned to Maya Poluru.`);
  }

  protected release(id: string): void {
    this.patch(id, { owner: 'Unassigned', status: 'Waiting', tone: 'rose' });
    this.notice.set(`${id} returned to the unassigned queue.`);
  }

  private patch(id: string, next: Partial<Assignment>): void {
    this.rows.update((list) => list.map((item) => (item.id === id ? { ...item, ...next } : item)));
    this.selectedId.set(id);
  }
}
