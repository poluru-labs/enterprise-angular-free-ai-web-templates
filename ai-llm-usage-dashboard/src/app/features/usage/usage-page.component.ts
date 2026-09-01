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
  EdsDateRangePickerComponent,
  EdsEmptyStateComponent,
  EdsMenuItemComponent,
  EdsPaginationComponent,
  EdsPopoverComponent,
  EdsSplitButtonComponent,
  EdsStatusComponent,
  EdsTagComponent,
  EdsToolbarComponent
} from '@poluru-labs/enterprise-design-system-angular';
import { templateConfig } from '../../core/config/template.config';
import { statusVariant } from '../../shared/utils/status-variant';
import { filterUsage, paginate } from '../../shared/utils/usage';

@Component({
  selector: 'app-usage-page',
  standalone: true,
  imports: [
    EdsAutocompleteComponent,
    EdsBadgeComponent,
    EdsButtonComponent,
    EdsCardComponent,
    EdsDataTableComponent,
    EdsDateRangePickerComponent,
    EdsEmptyStateComponent,
    EdsMenuItemComponent,
    EdsPaginationComponent,
    EdsPopoverComponent,
    EdsSplitButtonComponent,
    EdsStatusComponent,
    EdsTagComponent,
    EdsToolbarComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <eds-toolbar [bordered]="false">
      <div edsToolbarStart>
        <p class="eyebrow">Metering</p>
        <h1>Usage</h1>
      </div>
      <div edsToolbarEnd>
        <eds-split-button label="Export report" variant="primary" size="sm" (primaryClick)="openExport()">
          <eds-menu-item label="CSV" value="csv"></eds-menu-item>
          <eds-menu-item label="PDF" value="pdf"></eds-menu-item>
          <eds-menu-item label="JSON" value="json"></eds-menu-item>
        </eds-split-button>
      </div>
    </eds-toolbar>

    <eds-card class="card-pad" [elevated]="false" style="margin-top: 0.85rem">
      <div class="filter-bar">
        <eds-autocomplete
          label="Find a model"
          placeholder="gpt-4.1"
          [suggestions]="suggestions"
          [value]="search()"
          (valueChange)="onSearch($event)"
        ></eds-autocomplete>
        <eds-date-range-picker
          label="Window"
          [startValue]="rangeStart()"
          [endValue]="rangeEnd()"
          (rangeChange)="onRange($event)"
        ></eds-date-range-picker>
        <eds-popover heading="Status legend" placement="bottom">
          <eds-button trigger variant="secondary" size="sm" icon="info">Legend</eds-button>
          <p class="muted">Healthy is inside budget. Watch is over 80%. Restricted needs an owner grant.</p>
        </eds-popover>
      </div>

      <div class="chips" style="margin-bottom: 0.85rem">
        @for (tag of tags(); track tag) {
          <eds-tag [label]="tag" variant="brand" [dismissible]="true" (tagDismiss)="dismissTag(tag)"></eds-tag>
        }
        <eds-badge [label]="filtered().length + ' rows'" variant="neutral" [soft]="true" [pill]="true"></eds-badge>
      </div>

      @if (pageRows().length === 0) {
        <eds-empty-state heading="No usage matches" description="Clear filters or pick another window." [icon]="true">
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
      @for (row of featured; track row.model + row.workspace) {
        <eds-card class="card-pad" [elevated]="false">
          <div class="section-head">
            <h3>{{ row.model }}</h3>
            <eds-status [label]="row.status" [variant]="statusVariant(row.status)"></eds-status>
          </div>
          <p class="meta">{{ row.workspace }} · {{ row.tokens }} · {{ row.cost }}</p>
          <p class="meta">Owner {{ row.owner }} · {{ row.latency }}</p>
          <eds-tag [label]="row.workspace" variant="info"></eds-tag>
        </eds-card>
      }
    </section>
  `
})
export class UsagePageComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly config = templateConfig;
  protected readonly search = signal('');
  protected readonly page = signal(1);
  protected readonly pageSize = 5;
  protected readonly rangeStart = signal('2026-08-01');
  protected readonly rangeEnd = signal('2026-08-30');
  protected readonly tags = signal(['Production', 'Healthy']);
  protected readonly statusVariant = statusVariant;
  protected readonly featured = this.config.usage.slice(0, 3);

  protected readonly suggestions = [...new Set(this.config.usage.map((item) => item.model))];

  protected readonly columns: EdsDataTableColumn[] = [
    { key: 'model', label: 'Model', sortable: true },
    { key: 'workspace', label: 'Workspace', sortable: true },
    { key: 'owner', label: 'Owner', sortable: true },
    { key: 'tokens', label: 'Tokens', sortable: true },
    { key: 'cost', label: 'Cost', sortable: true },
    { key: 'latency', label: 'Latency', sortable: true },
    { key: 'status', label: 'Status', sortable: true }
  ];

  protected readonly filtered = computed(() => filterUsage(this.config.usage, this.search(), this.tags()));

  protected readonly pageRows = computed(() => paginate(this.filtered(), this.page(), this.pageSize));

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const q = params.get('q') ?? '';
      if (q) {
        this.onSearch(q);
      }
    });
  }

  protected openExport(): void {
    window.dispatchEvent(new CustomEvent('meter:export'));
  }

  protected onSearch(value: string): void {
    this.search.set(value);
    this.page.set(1);
  }

  protected onRange(range: { start: string; end: string }): void {
    this.rangeStart.set(range.start);
    this.rangeEnd.set(range.end);
  }

  protected dismissTag(tag: string): void {
    this.tags.update((items) => items.filter((item) => item !== tag));
    this.page.set(1);
  }

  protected clearFilters(): void {
    this.search.set('');
    this.tags.set([]);
    this.page.set(1);
  }
}
