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
  EdsToolbarComponent,
  type EdsSelectOption
} from '@poluru-labs/enterprise-design-system-angular';
import { templateConfig } from '../../core/config/template.config';
import { filterVectors, paginate } from '../../shared/utils/vector';

@Component({
  selector: 'app-vectors-page',
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
    EdsToolbarComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <eds-toolbar [bordered]="true">
      <div edsToolbarStart>
        <p class="eyebrow">Embeddings</p>
        <h1>Vectors</h1>
      </div>
      <div edsToolbarEnd>
        <eds-badge [label]="filtered().length + ' rows'" variant="neutral" [soft]="true"></eds-badge>
      </div>
    </eds-toolbar>

    <eds-card class="card-pad" [elevated]="false" style="margin-top: 0.85rem">
      <div class="filter-bar">
        <eds-search
          placeholder="Search id, preview, owner"
          [clearable]="true"
          [value]="query()"
          (valueChange)="onQuery($event)"
        ></eds-search>
        <eds-select label="Index" [options]="indexOptions" [value]="index()" (valueChange)="onIndex($event)"></eds-select>
      </div>

      @if (pageRows().length === 0) {
        <eds-empty-state heading="No vectors match" description="Clear the query or pick another index." [icon]="true">
          <div actions>
            <eds-button variant="primary" size="sm" (clicked)="clearFilters()">Reset</eds-button>
          </div>
        </eds-empty-state>
      } @else {
        <div class="table-wrap">
          <eds-data-table [columns]="columns" [rows]="pageRows()" [striped]="true" [sortable]="true" [compact]="true"></eds-data-table>
        </div>
        <div class="pager">
          <eds-pagination [page]="page()" [pageSize]="pageSize" [total]="filtered().length" (pageChange)="page.set($event)"></eds-pagination>
        </div>
      }
    </eds-card>
  `
})
export class VectorsPageComponent {
  protected readonly config = templateConfig;
  protected readonly query = signal('');
  protected readonly index = signal('All');
  protected readonly page = signal(1);
  protected readonly pageSize = 6;

  protected readonly indexOptions: EdsSelectOption[] = [
    { label: 'All indexes', value: 'All' },
    ...this.config.indexes.map((item) => ({ label: item.name, value: item.id }))
  ];

  protected readonly filtered = computed(() => filterVectors(this.config.vectors, this.query(), this.index()));

  protected readonly pageRows = computed(() =>
    paginate(this.filtered(), this.page(), this.pageSize).map((row) => ({
      id: row.id,
      index: row.index,
      namespace: row.namespace,
      preview: row.preview,
      owner: row.owner,
      score: row.score.toFixed(2),
      status: row.status
    }))
  );

  protected readonly columns: EdsDataTableColumn[] = [
    { key: 'id', label: 'Id', sortable: true },
    { key: 'index', label: 'Index', sortable: true },
    { key: 'namespace', label: 'Namespace', sortable: true },
    { key: 'preview', label: 'Preview' },
    { key: 'score', label: 'Score', sortable: true },
    { key: 'owner', label: 'Owner', sortable: true },
    { key: 'status', label: 'Status', sortable: true }
  ];

  protected onQuery(value: string): void {
    this.query.set(value);
    this.page.set(1);
  }

  protected onIndex(value: string): void {
    this.index.set(value);
    this.page.set(1);
  }

  protected clearFilters(): void {
    this.query.set('');
    this.index.set('All');
    this.page.set(1);
  }
}
