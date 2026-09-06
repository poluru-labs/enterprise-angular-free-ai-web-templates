import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  EdsBadgeComponent,
  EdsButtonComponent,
  EdsCardComponent,
  EdsDataTableColumn,
  EdsDataTableComponent,
  EdsEmptyStateComponent,
  EdsPaginationComponent,
  EdsSearchComponent,
  EdsSelectComponent,
  EdsStatusComponent,
  EdsTagComponent,
  type EdsSelectOption
} from '@poluru-labs/enterprise-design-system-angular';
import { templateConfig } from '../../core/config/template.config';
import { statusVariant } from '../../shared/utils/status-variant';
import { filterEndpoints, paginate } from '../../shared/utils/policy';

@Component({
  selector: 'app-endpoints-page',
  standalone: true,
  imports: [
    EdsBadgeComponent,
    EdsButtonComponent,
    EdsCardComponent,
    EdsDataTableComponent,
    EdsEmptyStateComponent,
    EdsPaginationComponent,
    EdsSearchComponent,
    EdsSelectComponent,
    EdsStatusComponent,
    EdsTagComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Surfaces</p>
        <h1>Endpoints</h1>
        <p class="summary">LLM endpoints with attached safety policies and PII packs.</p>
      </div>
      <eds-badge [label]="filtered().length + ' endpoints'" variant="brand" [soft]="true"></eds-badge>
    </section>

    <eds-card class="card-pad" [elevated]="false">
      <div class="filter-bar">
        <eds-search
          placeholder="Search model, policy, owner"
          [clearable]="true"
          [value]="query()"
          (valueChange)="onQuery($event)"
        ></eds-search>
        <eds-select label="Status" [options]="statusOptions" [value]="status()" (valueChange)="onStatus($event)"></eds-select>
      </div>

      @if (pageRows().length === 0) {
        <eds-empty-state heading="No endpoints match" description="Clear the query or pick another status." [icon]="true">
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
          <p class="meta">{{ row.model }} · {{ row.rpm }} rpm</p>
          <p class="meta">{{ row.policy }} · {{ row.piiPack }}</p>
          <p class="meta">Owner {{ row.owner }}</p>
          <div footer class="card-actions">
            <eds-tag [label]="row.policy" variant="info"></eds-tag>
          </div>
        </eds-card>
      }
    </section>
  `
})
export class EndpointsPageComponent {
  protected readonly config = templateConfig;
  protected readonly statusVariant = statusVariant;
  protected readonly query = signal('');
  protected readonly status = signal('All');
  protected readonly page = signal(1);
  protected readonly pageSize = 6;

  protected readonly statusOptions: EdsSelectOption[] = [
    { label: 'All statuses', value: 'All' },
    { label: 'Live', value: 'Live' },
    { label: 'Canary', value: 'Canary' },
    { label: 'Down', value: 'Down' }
  ];

  protected readonly filtered = computed(() => filterEndpoints(this.config.endpoints, this.query(), this.status()));

  protected readonly pageRows = computed(() =>
    paginate(this.filtered(), this.page(), this.pageSize).map((row) => ({
      name: row.name,
      model: row.model,
      policy: row.policy,
      pii: row.piiPack,
      rpm: String(row.rpm),
      owner: row.owner,
      status: row.status
    }))
  );

  protected readonly columns: EdsDataTableColumn[] = [
    { key: 'name', label: 'Endpoint', sortable: true },
    { key: 'model', label: 'Model', sortable: true },
    { key: 'policy', label: 'Policy', sortable: true },
    { key: 'pii', label: 'PII pack', sortable: true },
    { key: 'rpm', label: 'RPM', sortable: true },
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
