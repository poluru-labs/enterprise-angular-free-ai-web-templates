import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { templateConfig } from '../template.config';

type RuleRow = (typeof templateConfig.rules)[number];

@Component({
  selector: 'app-rules-page',
  standalone: true,
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
      <article class="metric"><p>Hits today</p><div class="value">197</div></article>
    </section>

    <div class="toolbar">
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
        <label class="field"><span>Name</span><input type="text" placeholder="Payroll beneficiary change" /></label>
        <label class="field"><span>Owner</span><input type="text" value="Aisha Poluru" /></label>
        <label class="field"><span>Condition</span><textarea rows="3" placeholder="New beneficiary + amount > $5,000 in 15 minutes."></textarea></label>
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
  protected readonly selectedName = signal(templateConfig.rules[0].name);
  protected readonly showForm = signal(false);
  protected readonly notice = signal('');
  protected readonly rows = signal<RuleRow[]>(templateConfig.rules.map((item) => ({ ...item })));

  protected readonly filtered = computed(() => {
    const status = this.filter();
    return this.rows().filter((item) => status === 'All' || item.status === status);
  });

  protected readonly selected = computed(() => this.filtered().find((item) => item.name === this.selectedName()) ?? this.filtered()[0]);

  protected count(status: string): number {
    return this.rows().filter((item) => item.status === status).length;
  }

  protected setStatus(name: string, status: RuleRow['status'], tone: RuleRow['tone']): void {
    this.rows.update((list) => list.map((item) => (item.name === name ? { ...item, status, tone } : item)));
    this.notice.set(`${name} is now ${status}.`);
  }

  protected draft(): void {
    this.showForm.set(false);
    this.notice.set('Shadow rule saved. Jordan Poluru will review before go-live.');
  }
}
