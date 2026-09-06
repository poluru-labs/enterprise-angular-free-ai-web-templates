import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  EdsAutocompleteComponent,
  EdsBadgeComponent,
  EdsButtonComponent,
  EdsCardComponent,
  EdsDataTableColumn,
  EdsDataTableComponent,
  EdsEmptyStateComponent,
  EdsPaginationComponent,
  EdsSelectComponent,
  EdsStatusComponent,
  EdsTagComponent,
  type EdsSelectOption
} from '@poluru-labs/enterprise-design-system-angular';
import { templateConfig } from '../../core/config/template.config';
import { statusVariant } from '../../shared/utils/status-variant';
import { filterIndexes, paginate } from '../../shared/utils/vector';

@Component({
  selector: 'app-indexes-page',
  standalone: true,
  imports: [
    EdsAutocompleteComponent,
    EdsBadgeComponent,
    EdsButtonComponent,
    EdsCardComponent,
    EdsDataTableComponent,
    EdsEmptyStateComponent,
    EdsPaginationComponent,
    EdsSelectComponent,
    EdsStatusComponent,
    EdsTagComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Catalog</p>
        <h1>Indexes</h1>
        <p class="summary">Registered vector indexes, metrics, and named owners.</p>
      </div>
      <eds-badge [label]="filtered().length + ' indexes'" variant="brand" [soft]="true"></eds-badge>
    </section>

    <eds-card class="card-pad" [elevated]="false">
      <div class="filter-bar">
        <eds-autocomplete
          label="Find an index"
          placeholder="docs-prod"
          [suggestions]="suggestions"
          [value]="search()"
          (valueChange)="onSearch($event)"
        ></eds-autocomplete>
        <eds-select
          label="Status"
          [options]="statusOptions"
          [value]="status()"
          (valueChange)="onStatus($event)"
        ></eds-select>
      </div>

      @if (pageRows().length === 0) {
        <eds-empty-state heading="No indexes match" description="Clear filters or pick another status." [icon]="true">
          <div actions>
            <eds-button variant="primary" size="sm" (clicked)="clearFilters()">Clear search</eds-button>
          </div>
        </eds-empty-state>
      } @else {
        <div class="table-wrap">
          <eds-data-table [columns]="columns" [rows]="pageRows()" [striped]="true" [sortable]="true"></eds-data-table>
        </div>
        <div class="pager">
          <eds-pagination [page]="page()" [pageSize]="pageSize" [total]="filtered().length" (pageChange)="page.set($event)"></eds-pagination>
        </div>
      }
    </eds-card>

    <section class="grid-3" style="margin-top: 0.9rem">
      @for (row of spotlight(); track row.id) {
        <eds-card class="card-pad collection-card" [elevated]="false">
          <div class="section-head">
            <h3>{{ row.name }}</h3>
            <eds-status [label]="row.status" [variant]="statusVariant(row.status)"></eds-status>
          </div>
          <p class="meta meta-clamp">{{ row.detail }}</p>
          <p class="meta">{{ row.metric }} · {{ row.dimensions }}d · {{ row.vectors.toLocaleString('en-US') }} vectors</p>
          <p class="meta">Owner {{ row.owner }}</p>
          <div footer class="card-actions">
            <eds-tag [label]="row.region" variant="info"></eds-tag>
          </div>
        </eds-card>
      }
    </section>
  `
})
export class IndexesPageComponent {
  protected readonly config = templateConfig;
  protected readonly statusVariant = statusVariant;
  protected readonly search = signal('');
  protected readonly status = signal('All');
  protected readonly page = signal(1);
  protected readonly pageSize = 5;

  protected readonly suggestions = this.config.indexes.map((item) => item.name);

  protected readonly statusOptions: EdsSelectOption[] = [
    { label: 'All statuses', value: 'All' },
    { label: 'Healthy', value: 'Healthy' },
    { label: 'Rebuilding', value: 'Rebuilding' },
    { label: 'Stale', value: 'Stale' },
    { label: 'Down', value: 'Down' }
  ];

  protected readonly filtered = computed(() => filterIndexes(this.config.indexes, this.search(), this.status()));

  protected readonly pageRows = computed(() =>
    paginate(this.filtered(), this.page(), this.pageSize).map((row) => ({
      name: row.name,
      metric: row.metric,
      dims: String(row.dimensions),
      vectors: row.vectors.toLocaleString('en-US'),
      owner: row.owner,
      status: row.status
    }))
  );

  protected readonly columns: EdsDataTableColumn[] = [
    { key: 'name', label: 'Index', sortable: true },
    { key: 'metric', label: 'Metric', sortable: true },
    { key: 'dims', label: 'Dims', sortable: true },
    { key: 'vectors', label: 'Vectors', sortable: true },
    { key: 'owner', label: 'Owner', sortable: true },
    { key: 'status', label: 'Status', sortable: true }
  ];

  protected readonly spotlight = computed(() => this.filtered().slice(0, 3));

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
}
