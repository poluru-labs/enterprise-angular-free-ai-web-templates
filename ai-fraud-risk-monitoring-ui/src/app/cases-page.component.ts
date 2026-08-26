import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { templateConfig } from '../template.config';

type CaseRow = (typeof templateConfig.cases)[number];

@Component({
  selector: 'app-cases-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Investigations</p>
        <h1>Cases</h1>
        <p class="summary">Search, filter, and decide. Notes stay on the record for the next reviewer.</p>
      </div>
    </section>

    @if (notice()) {
      <p class="notice">{{ notice() }}</p>
    }

    <section class="metrics mini">
      <article class="metric"><p>Open cases</p><div class="value">{{ openCount() }}</div></article>
      <article class="metric"><p>Aging &gt; 24h</p><div class="value">{{ agingCount() }}</div></article>
      <article class="metric"><p>Avg score</p><div class="value">84</div></article>
      <article class="metric"><p>At risk</p><div class="value">$77k</div></article>
    </section>

    <div class="toolbar">
      <label class="search">
        <span class="material-symbols-outlined">search</span>
        <input type="search" placeholder="Search ID, subject, or owner" (input)="query.set($any($event.target).value)" />
      </label>
      <div class="chips">
        @for (item of filters; track item) {
          <button type="button" class="chip" [class.active]="filter() === item" (click)="filter.set(item)">{{ item }}</button>
        }
      </div>
    </div>

    <section class="split">
      <article class="panel list-panel">
        <div class="list-head cases-grid">
          <span>Case</span>
          <span>Subject</span>
          <span>Type</span>
          <span>Amount</span>
          <span>Owner</span>
          <span>Status</span>
        </div>
        @for (item of filtered(); track item.id) {
          <button type="button" class="list-row cases-grid selectable" [class.selected]="selectedId() === item.id" (click)="selectedId.set(item.id)">
            <strong>{{ item.id }}</strong>
            <span>{{ item.subject }}</span>
            <span>{{ item.type }}</span>
            <span>{{ item.amount }}</span>
            <span>{{ item.owner }}</span>
            <span class="status" [class]="item.tone">{{ item.status }}</span>
          </button>
        }
      </article>

      @if (selected(); as item) {
        <aside class="panel detail">
          <p class="eyebrow">Score {{ item.score }}</p>
          <h2>{{ item.id }}</h2>
          <p class="muted">{{ item.subject }} · {{ item.type }} · aging {{ item.aging }}</p>
          <dl class="facts">
            <div><dt>Amount</dt><dd>{{ item.amount }}</dd></div>
            <div><dt>Owner</dt><dd>{{ item.owner }}</dd></div>
            <div><dt>Opened</dt><dd>{{ item.opened }}</dd></div>
            <div><dt>Status</dt><dd>{{ item.status }}</dd></div>
          </dl>
          <div class="timeline">
            @for (step of config.timeline; track step.time) {
              <div>
                <strong>{{ step.title }}</strong>
                <small>{{ step.time }} · {{ step.detail }}</small>
              </div>
            }
          </div>
          <label class="field">
            <span>Add note</span>
            <textarea rows="3" placeholder="Outcome, customer contact, or next step."></textarea>
          </label>
          <div class="inline-actions">
            <button type="button" class="primary" (click)="decide(item.id, 'Blocked', 'ok')">Block</button>
            <button type="button" class="secondary" (click)="decide(item.id, 'Cleared', 'ok')">Clear</button>
            <button type="button" class="secondary" (click)="assign(item.id)">Take case</button>
          </div>
        </aside>
      }
    </section>
  `
})
export class CasesPageComponent {
  protected readonly config = templateConfig;
  protected readonly filters = ['All', 'Open', 'Review', 'Blocked', 'Cleared'] as const;
  protected readonly filter = signal<(typeof this.filters)[number]>('All');
  protected readonly query = signal('');
  protected readonly selectedId = signal(templateConfig.cases[0].id);
  protected readonly notice = signal('');
  protected readonly rows = signal<CaseRow[]>(templateConfig.cases.map((item) => ({ ...item })));

  protected readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const status = this.filter();
    return this.rows().filter((item) => {
      const statusOk = status === 'All' || item.status === status;
      const qOk = !q || `${item.id} ${item.subject} ${item.owner} ${item.type}`.toLowerCase().includes(q);
      return statusOk && qOk;
    });
  });

  protected readonly selected = computed(() => this.filtered().find((item) => item.id === this.selectedId()) ?? this.filtered()[0]);
  protected readonly openCount = computed(() => this.rows().filter((item) => item.status === 'Open' || item.status === 'Review').length);
  protected readonly agingCount = computed(() => this.rows().filter((item) => item.aging.includes('d') || item.aging.includes('26') || item.aging.includes('30')).length);

  protected decide(id: string, status: CaseRow['status'], tone: CaseRow['tone']): void {
    this.rows.update((list) => list.map((item) => (item.id === id ? { ...item, status, tone } : item)));
    this.notice.set(`${id} marked ${status} by Aisha Poluru.`);
  }

  protected assign(id: string): void {
    this.rows.update((list) => list.map((item) => (item.id === id ? { ...item, owner: 'Aisha Poluru' } : item)));
    this.notice.set(`${id} assigned to Aisha Poluru.`);
  }
}
