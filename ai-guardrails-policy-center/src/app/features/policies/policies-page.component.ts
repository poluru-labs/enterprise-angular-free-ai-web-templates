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
import { filterPolicies, paginate } from '../../shared/utils/policy';

@Component({
  selector: 'app-policies-page',
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
        <h1>Policies</h1>
        <p class="summary">Safety packs attached to LLM endpoints, with named owners.</p>
      </div>
      <eds-badge [label]="filtered().length + ' policies'" variant="brand" [soft]="true"></eds-badge>
    </section>

    <eds-card class="card-pad" [elevated]="false">
      <div class="filter-bar">
        <eds-autocomplete
          label="Find a policy"
          placeholder="safety-core"
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
        <eds-empty-state heading="No policies match" description="Clear filters or pick another status." [icon]="true">
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
          <p class="meta">{{ row.severity }} · {{ row.endpoints }} endpoints</p>
          <p class="meta">Owner {{ row.owner }}</p>
          <div footer class="card-actions">
            <eds-tag [label]="row.severity" variant="info"></eds-tag>
          </div>
        </eds-card>
      }
    </section>
  `
})
export class PoliciesPageComponent {
  protected readonly config = templateConfig;
  protected readonly statusVariant = statusVariant;
  protected readonly search = signal('');
  protected readonly status = signal('All');
  protected readonly page = signal(1);
  protected readonly pageSize = 5;

  protected readonly suggestions = this.config.policies.map((item) => item.name);

  protected readonly statusOptions: EdsSelectOption[] = [
    { label: 'All statuses', value: 'All' },
    { label: 'Active', value: 'Active' },
    { label: 'Draft', value: 'Draft' },
    { label: 'Paused', value: 'Paused' }
  ];

  protected readonly filtered = computed(() => filterPolicies(this.config.policies, this.search(), this.status()));

  protected readonly pageRows = computed(() =>
    paginate(this.filtered(), this.page(), this.pageSize).map((row) => ({
      name: row.name,
      severity: row.severity,
      endpoints: String(row.endpoints),
      owner: row.owner,
      status: row.status
    }))
  );

  protected readonly columns: EdsDataTableColumn[] = [
    { key: 'name', label: 'Policy', sortable: true },
    { key: 'severity', label: 'Severity', sortable: true },
    { key: 'endpoints', label: 'Endpoints', sortable: true },
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
