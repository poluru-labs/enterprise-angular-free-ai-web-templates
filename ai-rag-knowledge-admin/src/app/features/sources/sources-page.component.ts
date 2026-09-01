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
import { filterSources, paginate } from '../../shared/utils/knowledge';

@Component({
  selector: 'app-sources-page',
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
        <p class="eyebrow">Catalog</p>
        <h1>Sources</h1>
      </div>
      <div edsToolbarEnd>
        <eds-split-button label="Add source" variant="primary" size="sm" (primaryClick)="openAdd()">
          <eds-menu-item label="Connect URL" value="url"></eds-menu-item>
          <eds-menu-item label="Upload files" value="files"></eds-menu-item>
          <eds-menu-item label="Git repo" value="git"></eds-menu-item>
        </eds-split-button>
      </div>
    </eds-toolbar>

    <eds-card class="card-pad" [elevated]="false" style="margin-top: 0.85rem">
      <div class="filter-bar">
        <eds-autocomplete
          label="Find a source"
          placeholder="Product documentation"
          [suggestions]="suggestions"
          [value]="search()"
          (valueChange)="onSearch($event)"
        ></eds-autocomplete>
        <eds-date-range-picker
          label="Last synced"
          [startValue]="rangeStart()"
          [endValue]="rangeEnd()"
          (rangeChange)="onRange($event)"
        ></eds-date-range-picker>
        <eds-popover heading="Status legend" placement="bottom">
          <eds-button trigger variant="secondary" size="sm" icon="info">Legend</eds-button>
          <p class="muted">Healthy sources serve retrieval. Review holds ACLs. Failed needs a re-auth.</p>
        </eds-popover>
      </div>

      <div class="chips" style="margin-bottom: 0.85rem">
        @for (tag of tags(); track tag) {
          <eds-tag [label]="tag" variant="brand" [dismissible]="true" (tagDismiss)="dismissTag(tag)"></eds-tag>
        }
        <eds-badge [label]="filtered().length + ' sources'" variant="neutral" [soft]="true" [pill]="true"></eds-badge>
      </div>

      @if (pageRows().length === 0) {
        <eds-empty-state heading="No sources match" description="Clear filters or connect a new connector." [icon]="true">
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
      @for (source of featured; track source.name) {
        <eds-card class="card-pad collection-card" [elevated]="false">
          <div class="section-head">
            <h3>{{ source.name }}</h3>
            <eds-status [label]="source.status" [variant]="statusVariant(source.status)"></eds-status>
          </div>
          <p class="meta meta-clamp">{{ source.detail }}</p>
          <p class="meta">{{ source.type }} · {{ source.docs.toLocaleString() }} docs · {{ source.freshness }}</p>
          <p class="meta">Owner {{ source.owner }}</p>
          <div footer class="card-actions">
            <eds-tag [label]="source.collection" variant="info"></eds-tag>
            <eds-tag [label]="source.freshness" variant="brand"></eds-tag>
          </div>
        </eds-card>
      }
    </section>
  `
})
export class SourcesPageComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly config = templateConfig;
  protected readonly search = signal('');
  protected readonly page = signal(1);
  protected readonly pageSize = 5;
  protected readonly rangeStart = signal('2026-08-01');
  protected readonly rangeEnd = signal('2026-08-30');
  protected readonly tags = signal(['Healthy']);
  protected readonly statusVariant = statusVariant;
  protected readonly featured = this.config.sources.slice(0, 3);

  protected readonly suggestions = this.config.sources.map((item) => item.name);

  protected readonly columns: EdsDataTableColumn[] = [
    { key: 'name', label: 'Source', sortable: true },
    { key: 'type', label: 'Connector', sortable: true },
    { key: 'owner', label: 'Owner', sortable: true },
    { key: 'docs', label: 'Docs', sortable: true },
    { key: 'freshness', label: 'Freshness', sortable: true },
    { key: 'status', label: 'Status', sortable: true }
  ];

  protected readonly filtered = computed(() => filterSources(this.config.sources, this.search(), this.tags()));

  protected readonly pageRows = computed(() =>
    paginate(this.filtered(), this.page(), this.pageSize).map((item) => ({
      name: item.name,
      type: item.type,
      owner: item.owner,
      docs: item.docs,
      freshness: item.freshness,
      status: item.status
    }))
  );

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const q = params.get('q') ?? '';
      if (q) {
        this.onSearch(q);
      }
    });
  }

  protected openAdd(): void {
    window.dispatchEvent(new CustomEvent('vault:add-source'));
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
