import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { templateConfig } from '../../core/config/template.config';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [RouterLink],
  host: { class: 'page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Workspace search</p>
        <h1>Search</h1>
        <p class="summary">Find alerts, cases, rules, watchlist entities, and reports. Try ⌘K from any page.</p>
      </div>
    </section>

    <label class="search search-lg">
      <span class="material-symbols-outlined">search</span>
      <input
        type="search"
        placeholder="Search Aisha Poluru, FR-8821, BIN 414720..."
        [value]="query()"
        (input)="onQuery($event)"
      />
    </label>

    <article class="panel">
      @if (results().length === 0) {
        <p class="empty">No matches. Try a case ID, alert, or investigator such as “Maya Poluru”.</p>
      } @else {
        @for (result of results(); track result.title + result.path + result.kind) {
          <a class="query-hit" [routerLink]="result.path">
            <div class="copy">
              <strong>{{ result.title }}</strong>
              <small>{{ result.detail }}</small>
            </div>
            <span class="status info">{{ result.kind }}</span>
          </a>
        }
      }
    </article>
  `
})
export class SearchPageComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly query = signal('');

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.query.set(params.get('q') ?? '');
    });
  }

  protected readonly results = computed(() => {
    const term = this.query().trim().toLowerCase();
    const catalog = [
      ...templateConfig.alerts.map((item) => ({
        title: item.title,
        detail: `${item.id} · ${item.assignee} · ${item.channel}`,
        path: '/alerts',
        kind: 'Alert'
      })),
      ...templateConfig.cases.map((item) => ({
        title: `${item.id} · ${item.subject}`,
        detail: `${item.type} · ${item.owner} · ${item.status}`,
        path: '/cases',
        kind: 'Case'
      })),
      ...templateConfig.rules.map((item) => ({
        title: item.name,
        detail: `${item.owner} · ${item.status} · ${item.precision}`,
        path: '/rules',
        kind: 'Rule'
      })),
      ...templateConfig.watchlist.map((item) => ({
        title: item.label,
        detail: `${item.id} · ${item.detail} · ${item.status}`,
        path: '/watchlist',
        kind: 'Watchlist'
      })),
      ...templateConfig.reports.map((item) => ({
        title: item.title,
        detail: `${item.id} · ${item.owner} · ${item.status}`,
        path: '/reports',
        kind: 'Report'
      })),
      ...templateConfig.investigators.map((item) => ({
        title: item.name,
        detail: `${item.focus} · ${item.load} · ${item.shift}`,
        path: '/',
        kind: 'Investigator'
      }))
    ];
    return term
      ? catalog.filter((item) => `${item.title} ${item.detail}`.toLowerCase().includes(term))
      : catalog.slice(0, 10);
  });

  protected onQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }
}
