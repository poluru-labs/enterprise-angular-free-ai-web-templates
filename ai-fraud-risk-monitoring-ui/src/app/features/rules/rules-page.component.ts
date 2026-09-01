import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { templateConfig } from '../../core/config/template.config';

type RuleRow = (typeof templateConfig.rules)[number];

@Component({
  selector: 'app-rules-page',
  standalone: true,
  host: { class: 'page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Models & policy</p>
        <h1>Rules</h1>
        <p class="summary">Pause, promote from shadow, or draft a pack. Precision stays on the card.</p>
      </div>
      <button type="button" class="primary" (click)="showForm.set(true)">
        <span class="material-symbols-outlined">add</span>
        New rule
      </button>
    </section>

    @if (notice()) {
      <p class="notice">{{ notice() }}</p>
    }

    <section class="metrics mini">
      <article class="metric"><p>Live</p><div class="value">{{ count('Live') }}</div></article>
      <article class="metric"><p>Tuning</p><div class="value">{{ count('Tuning') }}</div></article>
      <article class="metric"><p>Shadow</p><div class="value">{{ count('Shadow') }}</div></article>
      <article class="metric"><p>Hits today</p><div class="value">{{ hitsToday() }}</div></article>
    </section>

    <div class="toolbar">
      <label class="search">
        <span class="material-symbols-outlined">search</span>
        <input type="search" placeholder="Search rule or owner" (input)="onQuery($event)" />
      </label>
      <div class="chips">
        @for (item of filters; track item) {
          <button type="button" class="chip" [class.active]="filter() === item" (click)="filter.set(item)">{{ item }}</button>
        }
      </div>
    </div>

    <section class="split">
      <article class="panel list-panel">
        <div class="list-head rules-grid">
          <span>Rule</span>
          <span>Owner</span>
          <span>Hits</span>
          <span>Precision</span>
          <span>Status</span>
        </div>
        @for (item of filtered(); track item.name) {
          <button type="button" class="list-row rules-grid selectable" [class.selected]="selectedName() === item.name" (click)="selectedName.set(item.name)">
            <strong>{{ item.name }}</strong>
            <span>{{ item.owner }}</span>
            <span>{{ item.hits }}</span>
            <span>{{ item.precision }}</span>
            <span class="status" [class]="item.tone">{{ item.status }}</span>
          </button>
        }
        @if (filtered().length === 0) {
          <p class="empty">No rules match this filter.</p>
        }
      </article>

      @if (selected(); as item) {
        <aside class="panel detail">
          <p class="eyebrow">{{ item.owner }}</p>
          <h2>{{ item.name }}</h2>
          <p class="muted">{{ item.hits }} hits · {{ item.precision }} precision</p>
          <div class="meter"><span [style.width]="item.precision"></span></div>
          <div class="inline-actions">
            <button type="button" class="primary" (click)="setStatus(item.name, 'Live', 'ok')">Go live</button>
            <button type="button" class="secondary" (click)="setStatus(item.name, 'Paused', 'rose')">Pause</button>
            <button type="button" class="secondary" (click)="setStatus(item.name, 'Shadow', 'info')">Shadow</button>
          </div>
        </aside>
      }
    </section>

    @if (showForm()) {
      <article class="panel form-panel">
        <div class="panel-header"><h2>Draft a rule</h2></div>
        <label class="field">
          <span>Name</span>
          <input type="text" placeholder="Payroll beneficiary change" [value]="draftName()" (input)="onDraftName($event)" />
        </label>
        <label class="field"><span>Owner</span><input type="text" [value]="draftOwner()" readonly /></label>
        <label class="field">
          <span>Condition</span>
          <textarea rows="3" placeholder="New beneficiary + amount > $5,000 in 15 minutes." [value]="draftCondition()" (input)="onDraftCondition($event)"></textarea>
        </label>
        <div class="inline-actions">
          <button type="button" class="primary" (click)="draft()">Save as shadow</button>
          <button type="button" class="secondary" (click)="showForm.set(false)">Cancel</button>
        </div>
      </article>
    }
  `
})
export class RulesPageComponent {
  protected readonly config = templateConfig;
  protected readonly filters = ['All', 'Live', 'Tuning', 'Shadow', 'Paused'] as const;
  protected readonly filter = signal<(typeof this.filters)[number]>('All');
  protected readonly query = signal('');
  protected readonly selectedName = signal(templateConfig.rules[0].name);
  protected readonly showForm = signal(false);
  protected readonly notice = signal('');
  protected readonly draftName = signal('');
  protected readonly draftOwner = signal('Aisha Poluru');
  protected readonly draftCondition = signal('');
  protected readonly rows = signal<RuleRow[]>(templateConfig.rules.map((item) => ({ ...item })));

  protected readonly filtered = computed(() => {
    const status = this.filter();
    const q = this.query().trim().toLowerCase();
    return this.rows().filter((item) => {
      const statusOk = status === 'All' || item.status === status;
      const qOk = !q || `${item.name} ${item.owner}`.toLowerCase().includes(q);
      return statusOk && qOk;
    });
  });

  protected readonly selected = computed(
    () => this.filtered().find((item) => item.name === this.selectedName()) ?? this.filtered()[0]
  );

  protected count(status: string): number {
    return this.rows().filter((item) => item.status === status).length;
  }

  protected hitsToday(): number {
    return this.rows().reduce((sum, item) => sum + Number.parseInt(item.hits, 10), 0);
  }

  protected onQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected onDraftName(event: Event): void {
    this.draftName.set((event.target as HTMLInputElement).value);
  }

  protected onDraftCondition(event: Event): void {
    this.draftCondition.set((event.target as HTMLTextAreaElement).value);
  }

  protected setStatus(name: string, status: RuleRow['status'], tone: RuleRow['tone']): void {
    this.rows.update((list) => list.map((item) => (item.name === name ? { ...item, status, tone } : item)));
    this.notice.set(`${name} is now ${status}.`);
  }

  protected draft(): void {
    const name = this.draftName().trim() || 'Untitled shadow pack';
    const next: RuleRow = {
      name,
      owner: this.draftOwner(),
      hits: '0',
      precision: '—',
      status: 'Shadow',
      tone: 'info'
    };
    this.rows.update((list) => [next, ...list]);
    this.selectedName.set(name);
    this.filter.set('All');
    this.draftName.set('');
    this.draftCondition.set('');
    this.showForm.set(false);
    this.notice.set(`Shadow rule "${name}" saved. Jordan Poluru will review before go-live.`);
  }
}
