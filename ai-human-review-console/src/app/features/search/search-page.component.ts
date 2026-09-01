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
        <p class="summary">Find queue items, assignments, policies, gold labels, and reports. Try ⌘K from any page.</p>
      </div>
    </section>

    <label class="search search-lg">
      <span class="material-symbols-outlined">search</span>
      <input
        type="search"
        placeholder="Search Aisha Poluru, HR-1104, GOLD-12..."
        [value]="query()"
        (input)="onQuery($event)"
      />
    </label>

    <article class="panel">
      @if (results().length === 0) {
        <p class="empty">No matches. Try an HR-id, policy, or reviewer such as “Maya Poluru”.</p>
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
      ...templateConfig.queue.map((item) => ({
        title: `${item.id} · ${item.title}`,
        detail: `${item.queue} · ${item.assignee} · ${item.severity}`,
        path: '/',
        kind: 'Queue'
      })),
      ...templateConfig.assignments.map((item) => ({
        title: `${item.id} · ${item.subject}`,
        detail: `${item.queue} · ${item.owner} · ${item.status}`,
        path: '/assignments',
        kind: 'Assignment'
      })),
      ...templateConfig.policies.map((item) => ({
        title: item.name,
        detail: `${item.owner} · ${item.status} · ${item.agreement}`,
        path: '/policies',
        kind: 'Policy'
      })),
      ...templateConfig.cycles.map((item) => ({
        title: item.name,
        detail: `${item.id} · ${item.owner} · ${item.status}`,
        path: '/calibration',
        kind: 'Calibration'
      })),
      ...templateConfig.goldItems.map((item) => ({
        title: `${item.id} · ${item.title}`,
        detail: `${item.queue} · ${item.label} · ${item.rater}`,
        path: '/calibration',
        kind: 'Gold'
      })),
      ...templateConfig.reports.map((item) => ({
        title: item.title,
        detail: `${item.id} · ${item.owner} · ${item.status}`,
        path: '/reports',
        kind: 'Report'
      })),
      ...templateConfig.reviewers.map((item) => ({
        title: item.name,
        detail: `${item.focus} · ${item.load} · ${item.shift}`,
        path: '/',
        kind: 'Reviewer'
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
