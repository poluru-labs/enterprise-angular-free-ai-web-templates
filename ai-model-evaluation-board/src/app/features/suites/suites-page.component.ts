import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import {
  EdsAutocompleteComponent,
  EdsBadgeComponent,
  EdsButtonComponent,
  EdsCardComponent,
  EdsDataTableColumn,
  EdsDataTableComponent,
  EdsEmptyStateComponent,
  EdsPaginationComponent,
  EdsPopoverComponent,
  EdsStatusComponent,
  EdsTagComponent,
  EdsToolbarComponent
} from '@poluru-labs/enterprise-design-system-angular';
import { templateConfig } from '../../core/config/template.config';
import { statusVariant } from '../../shared/utils/status-variant';
import { filterSuites, paginate, scoreDelta } from '../../shared/utils/eval';

@Component({
  selector: 'app-suites-page',
  standalone: true,
  imports: [
    EdsAutocompleteComponent,
    EdsBadgeComponent,
    EdsButtonComponent,
    EdsCardComponent,
    EdsDataTableComponent,
    EdsEmptyStateComponent,
    EdsPaginationComponent,
    EdsPopoverComponent,
    EdsStatusComponent,
    EdsTagComponent,
    EdsToolbarComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <eds-toolbar [bordered]="false">
      <div edsToolbarStart>
        <p class="eyebrow">Quality packs</p>
        <h1>Suites</h1>
      </div>
      <div edsToolbarEnd>
        <eds-button variant="primary" size="sm" icon="plus" (clicked)="openRun()">Run evaluation</eds-button>
      </div>
    </eds-toolbar>

    <eds-card class="card-pad" [elevated]="false" style="margin-top: 0.85rem">
      <div class="filter-bar">
        <eds-autocomplete
          label="Find a suite"
          placeholder="Summarization"
          [suggestions]="suggestions"
          [value]="search()"
          (valueChange)="onSearch($event)"
        ></eds-autocomplete>
        <eds-popover heading="Status legend" placement="bottom">
          <eds-button trigger variant="secondary" size="sm" icon="info">Legend</eds-button>
          <p class="muted">Passed meets baseline. Review is a drop under 3 points. Blocked fails the release gate.</p>
        </eds-popover>
      </div>

      <div class="chips" style="margin-bottom: 0.85rem">
        @for (item of filters; track item) {
          <button type="button" class="chip" [class.active]="status() === item" (click)="onStatus(item)">{{ item }}</button>
        }
        <eds-badge [label]="filtered().length + ' suites'" variant="neutral" [soft]="true" [pill]="true"></eds-badge>
      </div>

      @if (pageRows().length === 0) {
        <eds-empty-state heading="No suites match" description="Clear filters or pick another status." [icon]="true">
          <div actions>
            <eds-button variant="primary" size="sm" (clicked)="clearFilters()">Clear filters</eds-button>
          </div>
        </eds-empty-state>
      } @else {
        <div class="table-wrap">
          <eds-data-table [columns]="columns" [rows]="pageRows()" [striped]="true" [sortable]="true"></eds-data-table>
        </div>
        <div class="pager">
          <eds-pagination
            [page]="page()"
            [pageSize]="pageSize"
            [total]="filtered().length"
            (pageChange)="page.set($event)"
          ></eds-pagination>
        </div>
      }
    </eds-card>

    <section class="grid-3" style="margin-top: 0.9rem">
      @for (suite of featured; track suite.name) {
        <eds-card class="card-pad collection-card" [elevated]="false">
          <div class="section-head">
            <h3>{{ suite.name }}</h3>
            <eds-status [label]="suite.status" [variant]="statusVariant(suite.status)"></eds-status>
          </div>
          <p class="meta">{{ suite.model }} · {{ suite.score }} vs {{ suite.baseline }}</p>
          <p class="meta">Owner {{ suite.owner }} · {{ suite.cases }} cases · {{ deltaLabel(suite.score, suite.baseline) }}</p>
          <div footer class="card-actions">
            <eds-tag [label]="suite.model" variant="brand"></eds-tag>
          </div>
        </eds-card>
      }
    </section>
  `
})
export class SuitesPageComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly config = templateConfig;
  protected readonly search = signal('');
  protected readonly status = signal('All');
  protected readonly page = signal(1);
  protected readonly pageSize = 5;
  protected readonly statusVariant = statusVariant;
  protected readonly featured = this.config.suites.slice(0, 3);
  protected readonly filters = ['All', 'Passed', 'Review', 'Blocked'];
  protected readonly suggestions = this.config.suites.map((item) => item.name);

  protected readonly columns: EdsDataTableColumn[] = [
    { key: 'name', label: 'Suite', sortable: true },
    { key: 'owner', label: 'Owner', sortable: true },
    { key: 'model', label: 'Model', sortable: true },
    { key: 'score', label: 'Score', sortable: true },
    { key: 'baseline', label: 'Baseline', sortable: true },
    { key: 'status', label: 'Status', sortable: true }
  ];

  protected readonly filtered = computed(() => filterSuites(this.config.suites, this.search(), this.status()));

  protected readonly pageRows = computed(() => paginate(this.filtered(), this.page(), this.pageSize));

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const q = params.get('q') ?? '';
      if (q) {
        this.onSearch(q);
      }
    });
  }

  protected openRun(): void {
    window.dispatchEvent(new CustomEvent('eval:run'));
  }

  protected onSearch(value: string): void {
    this.search.set(value);
    this.page.set(1);
  }

  protected onStatus(value: string): void {
    this.status.set(value);
    this.page.set(1);
  }

  protected clearFilters(): void {
    this.search.set('');
    this.status.set('All');
    this.page.set(1);
  }

  protected deltaLabel(score: string, baseline: string): string {
    const delta = scoreDelta(score, baseline);
    return (delta >= 0 ? '+' : '') + delta.toFixed(1) + ' vs baseline';
  }
}
