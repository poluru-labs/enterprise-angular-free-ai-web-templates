import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
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
import { templateConfig } from '../template.config';

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
          (valueChange)="search.set($event)"
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
            <eds-button variant="primary" size="sm" (clicked)="search.set('')">Clear search</eds-button>
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
      @for (source of config.sources.slice(0, 3); track source.name) {
        <eds-card class="card-pad" [elevated]="false">
          <div class="section-head">
            <h3>{{ source.name }}</h3>
            <eds-status [label]="source.status" [variant]="statusVariant(source.status)"></eds-status>
          </div>
          <p class="meta">{{ source.type }} · {{ source.docs.toLocaleString() }} docs · {{ source.freshness }}</p>
          <p class="meta">Owner {{ source.owner }}</p>
          <eds-tag [label]="source.collection" variant="info"></eds-tag>
        </eds-card>
      }
    </section>
  `
})
export class SourcesPageComponent {
  protected readonly config = templateConfig;
  protected readonly search = signal('');
  protected readonly page = signal(1);
  protected readonly pageSize = 5;
  protected readonly rangeStart = signal('2026-08-01');
  protected readonly rangeEnd = signal('2026-08-30');
  protected readonly tags = signal(['Healthy', 'Workspace']);

  protected readonly suggestions = this.config.sources.map((item) => item.name);

  protected readonly columns: EdsDataTableColumn[] = [
    { key: 'name', label: 'Source', sortable: true },
    { key: 'type', label: 'Connector', sortable: true },
    { key: 'owner', label: 'Owner', sortable: true },
    { key: 'docs', label: 'Docs', sortable: true },
    { key: 'freshness', label: 'Freshness', sortable: true },
    { key: 'status', label: 'Status', sortable: true }
  ];

  protected readonly filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    return this.config.sources
      .filter((item) => !q || item.name.toLowerCase().includes(q) || item.owner.toLowerCase().includes(q))
      .map((item) => ({
        name: item.name,
        type: item.type,
        owner: item.owner,
        docs: item.docs,
        freshness: item.freshness,
        status: item.status
      }));
  });

  protected readonly pageRows = computed(() => {
    const start = (this.page() - 1) * this.pageSize;
    return this.filtered().slice(start, start + this.pageSize);
  });

  protected openAdd(): void {
    window.dispatchEvent(new CustomEvent('vault:add-source'));
  }

  protected onRange(range: { start: string; end: string }): void {
    this.rangeStart.set(range.start);
    this.rangeEnd.set(range.end);
  }

  protected dismissTag(tag: string): void {
    this.tags.update((items) => items.filter((item) => item !== tag));
  }

  protected statusVariant(status: string): 'success' | 'warning' | 'danger' | 'info' | 'neutral' {
    if (status === 'Healthy') {
      return 'success';
    }
    if (status === 'Review' || status === 'Syncing') {
      return 'warning';
    }
    if (status === 'Failed') {
      return 'danger';
    }
    return 'neutral';
  }
}
