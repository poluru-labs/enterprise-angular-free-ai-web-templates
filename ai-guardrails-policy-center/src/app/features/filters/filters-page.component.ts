import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  EdsBadgeComponent,
  EdsButtonComponent,
  EdsCardComponent,
  EdsDataTableColumn,
  EdsDataTableComponent,
  EdsEmptyStateComponent,
  EdsPaginationComponent,
  EdsProgressBarComponent,
  EdsSearchComponent,
  EdsSelectComponent,
  EdsStatusComponent,
  EdsTagComponent,
  type EdsSelectOption
} from '@poluru-labs/enterprise-design-system-angular';
import { templateConfig } from '../../core/config/template.config';
import { statusVariant } from '../../shared/utils/status-variant';
import { filterFilters, paginate } from '../../shared/utils/policy';

@Component({
  selector: 'app-filters-page',
  standalone: true,
  imports: [
    EdsBadgeComponent,
    EdsButtonComponent,
    EdsCardComponent,
    EdsDataTableComponent,
    EdsEmptyStateComponent,
    EdsPaginationComponent,
    EdsProgressBarComponent,
    EdsSearchComponent,
    EdsSelectComponent,
    EdsStatusComponent,
    EdsTagComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Content</p>
        <h1>Filters</h1>
        <p class="summary">Hate, sexual, violence, self-harm, and jailbreak classifiers with live thresholds.</p>
      </div>
      <eds-badge [label]="filtered().length + ' filters'" variant="brand" [soft]="true"></eds-badge>
    </section>

    <eds-card class="card-pad" [elevated]="false">
      <div class="filter-bar">
        <eds-search
          placeholder="Search category, owner, action"
          [clearable]="true"
          [value]="query()"
          (valueChange)="onQuery($event)"
        ></eds-search>
        <eds-select label="Status" [options]="statusOptions" [value]="status()" (valueChange)="onStatus($event)"></eds-select>
      </div>

      @if (pageRows().length === 0) {
        <eds-empty-state heading="No filters match" description="Clear the query or pick another status." [icon]="true">
          <div actions>
            <eds-button variant="primary" size="sm" (clicked)="clearFilters()">Reset</eds-button>
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
      @for (row of filtered(); track row.id) {
        <eds-card class="card-pad collection-card" [elevated]="false">
          <div class="section-head">
            <h3>{{ row.name }}</h3>
            <eds-status [label]="row.status" [variant]="statusVariant(row.status)"></eds-status>
          </div>
          <p class="meta">{{ row.category }} · {{ row.action }} · {{ row.owner }}</p>
          <eds-progress-bar [value]="Math.round(row.threshold * 100)" [max]="100" label="Threshold" [showValue]="true"></eds-progress-bar>
          <div footer class="card-actions">
            <eds-tag [label]="row.action" variant="info"></eds-tag>
          </div>
        </eds-card>
      }
    </section>
  `
})
export class FiltersPageComponent {
  protected readonly config = templateConfig;
  protected readonly statusVariant = statusVariant;
  protected readonly Math = Math;
  protected readonly query = signal('');
  protected readonly status = signal('All');
  protected readonly page = signal(1);
  protected readonly pageSize = 6;

  protected readonly statusOptions: EdsSelectOption[] = [
    { label: 'All statuses', value: 'All' },
    { label: 'Active', value: 'Active' },
    { label: 'Tuning', value: 'Tuning' },
    { label: 'Paused', value: 'Paused' }
  ];

  protected readonly filtered = computed(() => filterFilters(this.config.filters, this.query(), this.status()));

  protected readonly pageRows = computed(() =>
    paginate(this.filtered(), this.page(), this.pageSize).map((row) => ({
      name: row.name,
      category: row.category,
      threshold: row.threshold.toFixed(2),
      action: row.action,
      owner: row.owner,
      status: row.status
    }))
  );

  protected readonly columns: EdsDataTableColumn[] = [
    { key: 'name', label: 'Filter', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'threshold', label: 'Threshold', sortable: true },
    { key: 'action', label: 'Action', sortable: true },
    { key: 'owner', label: 'Owner', sortable: true },
    { key: 'status', label: 'Status', sortable: true }
  ];

  protected onQuery(value: string): void {
    this.query.set(value);
    this.page.set(1);
  }

  protected onStatus(value: string): void {
    this.status.set(value);
    this.page.set(1);
  }

  protected clearFilters(): void {
    this.query.set('');
    this.status.set('All');
    this.page.set(1);
  }
}
