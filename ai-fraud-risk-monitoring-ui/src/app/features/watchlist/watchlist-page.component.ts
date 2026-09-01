import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { templateConfig } from '../../core/config/template.config';

type WatchRow = (typeof templateConfig.watchlist)[number];

@Component({
  selector: 'app-watchlist-page',
  standalone: true,
  host: { class: 'page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Entities</p>
        <h1>Watchlist</h1>
        <p class="summary">Freeze BINs, devices, IPs, and merchants before the next burst. {{ frozenCount() }} entities are frozen.</p>
      </div>
      <button type="button" class="primary" (click)="showForm.set(true)">
        <span class="material-symbols-outlined">add</span>
        Add entity
      </button>
    </section>

    @if (notice()) {
      <p class="notice">{{ notice() }}</p>
    }

    <section class="metrics mini">
      <article class="metric"><p>Entities</p><div class="value">{{ rows().length }}</div></article>
      <article class="metric"><p>Frozen</p><div class="value">{{ frozenCount() }}</div></article>
      <article class="metric"><p>High risk</p><div class="value">{{ highCount() }}</div></article>
      <article class="metric"><p>Hits today</p><div class="value">{{ hitsToday() }}</div></article>
    </section>

    <div class="toolbar">
      <label class="search">
        <span class="material-symbols-outlined">search</span>
        <input type="search" placeholder="Search BIN, device, IP, or merchant" (input)="onQuery($event)" />
      </label>
      <div class="chips">
        @for (item of filters; track item) {
          <button type="button" class="chip" [class.active]="filter() === item" (click)="filter.set(item)">{{ item }}</button>
        }
      </div>
    </div>

    <section class="split">
      <article class="panel list-panel">
        @for (item of filtered(); track item.id) {
          <button type="button" class="list-row alert-row selectable" [class.selected]="selectedId() === item.id" (click)="selectedId.set(item.id)">
            <span class="status-icon material-symbols-outlined" [class]="item.risk === 'High' ? 'rose' : 'warn'">visibility</span>
            <div class="copy">
              <strong>{{ item.label }}</strong>
              <small>{{ item.detail }} · {{ item.hits }} hits</small>
            </div>
            <span class="status" [class]="item.risk === 'High' ? 'rose' : 'warn'">{{ item.risk }}</span>
            <small class="muted">{{ item.status }}</small>
          </button>
        }
        @if (filtered().length === 0) {
          <p class="empty">No entities match this filter.</p>
        }
      </article>

      @if (selected(); as item) {
        <aside class="panel detail">
          <p class="eyebrow">{{ item.id }} · added {{ item.added }}</p>
          <h2>{{ item.label }}</h2>
          <p class="muted">{{ item.detail }}</p>
          <dl class="facts">
            <div><dt>Risk</dt><dd>{{ item.risk }}</dd></div>
            <div><dt>Status</dt><dd>{{ item.status }}</dd></div>
            <div><dt>Hits</dt><dd>{{ item.hits }}</dd></div>
            <div><dt>Added</dt><dd>{{ item.added }}</dd></div>
          </dl>
          <div class="inline-actions">
            <button type="button" class="primary" (click)="setStatus(item.id, 'Frozen')">Freeze</button>
            <button type="button" class="secondary" (click)="setStatus(item.id, 'Watch')">Watch only</button>
            <button type="button" class="secondary" (click)="remove(item.id)">Remove</button>
          </div>
        </aside>
      }
    </section>

    @if (showForm()) {
      <article class="panel form-panel">
        <div class="panel-header"><h2>Add to watchlist</h2></div>
        <label class="field">
          <span>Entity</span>
          <input type="text" placeholder="BIN 414720 or IP 102.89.22.14" [value]="draftLabel()" (input)="onDraftLabel($event)" />
        </label>
        <label class="field">
          <span>Reason</span>
          <input type="text" placeholder="Linked to Leila Poluru card testing" [value]="draftDetail()" (input)="onDraftDetail($event)" />
        </label>
        <div class="inline-actions">
          <button type="button" class="primary" (click)="addEntity()">Freeze entity</button>
          <button type="button" class="secondary" (click)="showForm.set(false)">Cancel</button>
        </div>
      </article>
    }
  `
})
export class WatchlistPageComponent {
  protected readonly filters = ['All', 'High', 'Medium', 'Frozen', 'Watch'] as const;
  protected readonly filter = signal<(typeof this.filters)[number]>('All');
  protected readonly query = signal('');
  protected readonly selectedId = signal(templateConfig.watchlist[0].id);
  protected readonly showForm = signal(false);
  protected readonly notice = signal('');
  protected readonly draftLabel = signal('');
  protected readonly draftDetail = signal('');
  protected readonly rows = signal<WatchRow[]>(templateConfig.watchlist.map((item) => ({ ...item })));

  protected readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const current = this.filter();
    return this.rows().filter((item) => {
      const filterOk =
        current === 'All' || item.risk === current || item.status === current;
      const qOk = !q || `${item.label} ${item.detail} ${item.id}`.toLowerCase().includes(q);
      return filterOk && qOk;
    });
  });

  protected readonly selected = computed(
    () => this.filtered().find((item) => item.id === this.selectedId()) ?? this.filtered()[0]
  );
  protected readonly frozenCount = computed(() => this.rows().filter((item) => item.status === 'Frozen').length);
  protected readonly highCount = computed(() => this.rows().filter((item) => item.risk === 'High').length);
  protected readonly hitsToday = computed(() => this.rows().reduce((sum, item) => sum + item.hits, 0));

  protected onQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected onDraftLabel(event: Event): void {
    this.draftLabel.set((event.target as HTMLInputElement).value);
  }

  protected onDraftDetail(event: Event): void {
    this.draftDetail.set((event.target as HTMLInputElement).value);
  }

  protected setStatus(id: string, status: WatchRow['status']): void {
    this.rows.update((list) => list.map((item) => (item.id === id ? { ...item, status } : item)));
    this.notice.set(`${id} is now ${status}.`);
  }

  protected remove(id: string): void {
    this.rows.update((list) => list.filter((item) => item.id !== id));
    this.notice.set(`${id} removed from the watchlist.`);
  }

  protected addEntity(): void {
    const label = this.draftLabel().trim() || 'Unnamed entity';
    const next: WatchRow = {
      id: `WL-${10 + this.rows().length}`,
      label,
      detail: this.draftDetail().trim() || 'Added by Aisha Poluru',
      risk: 'High',
      status: 'Frozen',
      hits: 0,
      added: 'Just now'
    };
    this.rows.update((list) => [next, ...list]);
    this.selectedId.set(next.id);
    this.draftLabel.set('');
    this.draftDetail.set('');
    this.showForm.set(false);
    this.notice.set(`${label} frozen on the watchlist.`);
  }
}
