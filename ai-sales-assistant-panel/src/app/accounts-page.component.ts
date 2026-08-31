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
  selector: 'app-accounts-page',
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
        <p class="eyebrow">Research</p>
        <h1>Accounts</h1>
      </div>
      <div edsToolbarEnd>
        <eds-split-button label="Create brief" variant="primary" size="sm" (primaryClick)="openBrief()">
          <eds-menu-item label="Account research" value="research"></eds-menu-item>
          <eds-menu-item label="Meeting prep" value="prep"></eds-menu-item>
          <eds-menu-item label="Renewal risk" value="renewal"></eds-menu-item>
        </eds-split-button>
      </div>
    </eds-toolbar>

    <eds-card class="card-pad" [elevated]="false" style="margin-top: 0.85rem">
      <div class="filter-bar">
        <eds-autocomplete
          label="Find an account"
          placeholder="Northstar Analytics"
          [suggestions]="suggestions"
          [value]="search()"
          (valueChange)="search.set($event)"
        ></eds-autocomplete>
        <eds-date-range-picker
          label="Window"
          [startValue]="rangeStart()"
          [endValue]="rangeEnd()"
          (rangeChange)="onRange($event)"
        ></eds-date-range-picker>
        <eds-popover heading="Risk legend" placement="bottom">
          <eds-button trigger variant="secondary" size="sm" icon="info">Legend</eds-button>
          <p class="muted">Low is on track. Watch needs a seller follow-up. Draft briefs still need Ananya Poluru’s review.</p>
        </eds-popover>
      </div>

      <div class="chips" style="margin-bottom: 0.85rem">
        @for (tag of tags(); track tag) {
          <eds-tag [label]="tag" variant="brand" [dismissible]="true" (tagDismiss)="dismissTag(tag)"></eds-tag>
        }
        <eds-badge [label]="filtered().length + ' rows'" variant="neutral" [soft]="true" [pill]="true"></eds-badge>
      </div>

      @if (pageRows().length === 0) {
        <eds-empty-state heading="No accounts match" description="Clear filters or pick another window." [icon]="true">
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
      @for (row of config.accounts.slice(0, 3); track row.name) {
        <eds-card class="card-pad" [elevated]="false">
          <div class="section-head">
            <h3>{{ row.name }}</h3>
            <eds-status [label]="row.risk" [variant]="riskVariant(row.risk)"></eds-status>
          </div>
          <p class="meta">{{ row.stage }} · {{ row.pipeline }}</p>
          <p class="meta">Owner {{ row.owner }} · {{ row.next }}</p>
          <eds-tag [label]="row.brief + ' brief'" variant="info"></eds-tag>
        </eds-card>
      }
    </section>
  `
})
export class AccountsPageComponent {
  protected readonly config = templateConfig;
  protected readonly search = signal('');
  protected readonly page = signal(1);
  protected readonly pageSize = 5;
  protected readonly rangeStart = signal('2026-08-01');
  protected readonly rangeEnd = signal('2026-08-30');
  protected readonly tags = signal(['Enterprise', 'Ready']);

  protected readonly suggestions = this.config.accounts.map((item) => item.name);

  protected readonly columns: EdsDataTableColumn[] = [
    { key: 'name', label: 'Account', sortable: true },
    { key: 'owner', label: 'Owner', sortable: true },
    { key: 'stage', label: 'Stage', sortable: true },
    { key: 'pipeline', label: 'Pipeline', sortable: true },
    { key: 'risk', label: 'Risk', sortable: true },
    { key: 'brief', label: 'Brief', sortable: true },
    { key: 'next', label: 'Next step', sortable: true }
  ];

  protected readonly filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    return this.config.accounts.filter(
      (item) =>
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.owner.toLowerCase().includes(q) ||
        item.stage.toLowerCase().includes(q)
    );
  });

  protected readonly pageRows = computed(() => {
    const start = (this.page() - 1) * this.pageSize;
    return this.filtered().slice(start, start + this.pageSize);
  });

  protected openBrief(): void {
    window.dispatchEvent(new CustomEvent('garnet:brief'));
  }

  protected onRange(range: { start: string; end: string }): void {
    this.rangeStart.set(range.start);
    this.rangeEnd.set(range.end);
  }

  protected dismissTag(tag: string): void {
    this.tags.update((items) => items.filter((item) => item !== tag));
  }

  protected riskVariant(status: string): 'success' | 'warning' | 'danger' | 'info' | 'neutral' {
    if (status === 'Low') {
      return 'success';
    }
    if (status === 'Watch') {
      return 'warning';
    }
    return 'neutral';
  }
}
