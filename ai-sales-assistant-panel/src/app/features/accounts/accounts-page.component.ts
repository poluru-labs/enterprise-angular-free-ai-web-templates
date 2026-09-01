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
import { filterAccounts, paginate } from '../../shared/utils/sales';

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
          (valueChange)="onSearch($event)"
        ></eds-autocomplete>
        <eds-date-range-picker
          label="Window"
          [startValue]="rangeStart()"
          [endValue]="rangeEnd()"
          (rangeChange)="onRange($event)"
        ></eds-date-range-picker>
        <eds-popover heading="Risk legend" placement="bottom">
          <eds-button trigger variant="secondary" size="sm" icon="info">Legend</eds-button>
          <p class="muted">Low is on track. Watch needs a seller follow-up. High is a stalled champion map. Draft briefs still need Ananya Poluru’s review.</p>
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
            <eds-button variant="primary" size="sm" (clicked)="clearFilters()">Clear search</eds-button>
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
      @for (row of spotlight(); track row.name) {
        <eds-card class="card-pad collection-card" [elevated]="false">
          <div class="section-head">
            <h3>{{ row.name }}</h3>
            <eds-status [label]="row.risk" [variant]="statusVariant(row.risk)"></eds-status>
          </div>
          <p class="meta meta-clamp">{{ row.detail }}</p>
          <p class="meta">{{ row.stage }} · {{ row.pipeline }} · {{ row.region }}</p>
          <p class="meta">Owner {{ row.owner }} · {{ row.next }}</p>
          <div footer class="card-actions">
            <eds-tag [label]="row.brief + ' brief'" variant="info"></eds-tag>
            <eds-button variant="secondary" size="sm" icon="file" (clicked)="openBrief()">Open brief</eds-button>
          </div>
        </eds-card>
      }
    </section>
  `
})
export class AccountsPageComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly config = templateConfig;
  protected readonly statusVariant = statusVariant;
  protected readonly search = signal('');
  protected readonly page = signal(1);
  protected readonly pageSize = 5;
  protected readonly rangeStart = signal('2026-08-01');
  protected readonly rangeEnd = signal('2026-08-30');
  protected readonly tags = signal(['Ready']);

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

  protected readonly filtered = computed(() => filterAccounts(this.config.accounts, this.search(), this.tags()));

  protected readonly pageRows = computed(() => paginate(this.filtered(), this.page(), this.pageSize));

  protected readonly spotlight = computed(() => this.filtered().slice(0, 3));

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const q = params.get('q') ?? '';
      if (q) {
        this.onSearch(q);
      }
    });
  }

  protected openBrief(): void {
    window.dispatchEvent(new CustomEvent('garnet:brief'));
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
