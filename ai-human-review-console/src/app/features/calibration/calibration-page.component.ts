import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { templateConfig } from '../../core/config/template.config';
import type { Tone } from '../../core/config/template.config';
import { initials } from '../../shared/utils/initials';

type Cycle = (typeof templateConfig.cycles)[number];
type GoldItem = (typeof templateConfig.goldItems)[number] & { gold?: boolean };

@Component({
  selector: 'app-calibration-page',
  standalone: true,
  imports: [RouterLink],
  host: { class: 'page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Rater quality</p>
        <h1>Calibration</h1>
        <p class="summary">Gold-set labels, cycle agreement, and guidelines Jordan Poluru publishes for the desk.</p>
      </div>
      <button type="button" class="primary" (click)="startCycle()">
        <span class="material-symbols-outlined">add</span>
        Start cycle
      </button>
    </section>

    @if (notice()) {
      <p class="notice">{{ notice() }}</p>
    }

    <section class="metrics mini">
      <article class="metric"><p>Live</p><div class="value">{{ count('Live') }}</div></article>
      <article class="metric"><p>Draft</p><div class="value">{{ count('Draft') }}</div></article>
      <article class="metric"><p>Gold items</p><div class="value">{{ goldRows().length }}</div></article>
      <article class="metric"><p>Desk agreement</p><div class="value">96.8%</div></article>
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
        <div class="list-head policy-grid">
          <span>Cycle</span>
          <span>Owner</span>
          <span>Items</span>
          <span>Agreement</span>
          <span>Status</span>
        </div>
        @for (item of filtered(); track item.id) {
          <button type="button" class="list-row policy-grid selectable" [class.selected]="selectedId() === item.id" (click)="selectedId.set(item.id)">
            <strong>{{ item.name }}</strong>
            <span>{{ item.owner }}</span>
            <span>{{ item.items }}</span>
            <span>{{ item.agreement }}</span>
            <span class="status" [class]="item.tone">{{ item.status }}</span>
          </button>
        }
        @if (filtered().length === 0) {
          <p class="empty">No cycles in this status.</p>
        }
      </article>

      @if (selected(); as item) {
        <aside class="panel detail">
          <p class="eyebrow">{{ item.id }} · published {{ item.published }}</p>
          <h2>{{ item.name }}</h2>
          <p class="muted">{{ item.owner }} · {{ item.items }} gold items · {{ item.agreement }} agreement</p>
          <div class="inline-actions">
            <button type="button" class="primary" (click)="publish(item.id)">Publish</button>
            <button type="button" class="secondary" (click)="archive(item.id)">Archive</button>
            <a class="secondary" routerLink="/policies">Open policies</a>
          </div>
        </aside>
      }
    </section>

    <section class="dashboard-grid">
      <article class="panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Gold set</p>
            <h2>Labeled examples</h2>
          </div>
        </div>
        <div class="rows">
          @for (item of goldRows(); track item.id) {
            <div class="row">
              <div class="copy">
                <strong>{{ item.id }} · {{ item.title }}</strong>
                <small>{{ item.queue }} · {{ item.label }} · {{ item.rater }}</small>
              </div>
              <button type="button" class="secondary" (click)="markGold(item.id)">
                {{ item.gold ? 'Gold' : 'Mark gold' }}
              </button>
            </div>
          }
        </div>
      </article>

      <article class="panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Desk</p>
            <h2>Rater agreement</h2>
          </div>
        </div>
        <ul class="people">
          @for (person of config.reviewers; track person.name) {
            <li>
              <span class="avatar">{{ initials(person.name) }}</span>
              <div class="copy">
                <strong>{{ person.name }}</strong>
                <small>{{ person.focus }}</small>
              </div>
              <em>{{ person.score }}</em>
            </li>
          }
        </ul>
      </article>
    </section>
  `
})
export class CalibrationPageComponent {
  protected readonly config = templateConfig;
  protected readonly initials = initials;
  protected readonly filters = ['All', 'Live', 'Draft', 'Archived'] as const;
  protected readonly filter = signal<(typeof this.filters)[number]>('All');
  protected readonly selectedId = signal(templateConfig.cycles[0].id);
  protected readonly notice = signal('');
  protected readonly rows = signal<Cycle[]>(templateConfig.cycles.map((item) => ({ ...item })));
  protected readonly goldRows = signal<GoldItem[]>(templateConfig.goldItems.map((item) => ({ ...item })));

  protected readonly filtered = computed(() => {
    const status = this.filter();
    return this.rows().filter((item) => status === 'All' || item.status === status);
  });

  protected readonly selected = computed(
    () => this.filtered().find((item) => item.id === this.selectedId()) ?? this.filtered()[0]
  );

  protected count(status: string): number {
    return this.rows().filter((item) => item.status === status).length;
  }

  protected publish(id: string): void {
    this.setStatus(id, 'Live', 'ok');
    this.notice.set(`${id} published. Reviewers will see Jordan Poluru’s guidelines.`);
  }

  protected archive(id: string): void {
    this.setStatus(id, 'Archived', 'info');
    this.notice.set(`${id} archived.`);
  }

  protected startCycle(): void {
    const next: Cycle = {
      id: `CAL-${10 + this.rows().length}`,
      name: 'On-demand cycle',
      owner: 'Aisha Poluru',
      status: 'Draft',
      tone: 'warn',
      agreement: '—',
      items: 0,
      published: '—'
    };
    this.rows.update((list) => [next, ...list]);
    this.selectedId.set(next.id);
    this.filter.set('All');
    this.notice.set(`${next.id} is a draft. Add gold items before publish.`);
  }

  protected markGold(id: string): void {
    this.goldRows.update((list) =>
      list.map((item) => (item.id === id ? { ...item, gold: true } : item))
    );
    this.notice.set(`${id} marked gold for Aisha Poluru’s set.`);
  }

  private setStatus(id: string, status: Cycle['status'], tone: Tone): void {
    this.rows.update((list) => list.map((item) => (item.id === id ? { ...item, status, tone } : item)));
    this.selectedId.set(id);
  }
}
