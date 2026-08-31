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
  selector: 'app-conversations-page',
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
        <p class="eyebrow">Live queue</p>
        <h1>Inbox</h1>
      </div>
      <div edsToolbarEnd>
        <eds-split-button label="Draft reply" variant="primary" size="sm" (primaryClick)="openReply()">
          <eds-menu-item label="Refund" value="refund"></eds-menu-item>
          <eds-menu-item label="Tracking" value="tracking"></eds-menu-item>
          <eds-menu-item label="Escalation summary" value="escalation"></eds-menu-item>
        </eds-split-button>
      </div>
    </eds-toolbar>

    <eds-card class="card-pad" [elevated]="false" style="margin-top: 0.85rem">
      <div class="filter-bar">
        <eds-autocomplete
          label="Find a ticket"
          placeholder="#48324 Refund window"
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
        <eds-popover heading="Status legend" placement="bottom">
          <eds-button trigger variant="secondary" size="sm" icon="info">Legend</eds-button>
          <p class="muted">Ready can send. Review needs Ananya Poluru. Watch is waiting on a knowledge hit from Meera Poluru.</p>
        </eds-popover>
      </div>

      <div class="chips" style="margin-bottom: 0.85rem">
        @for (tag of tags(); track tag) {
          <eds-tag [label]="tag" variant="brand" [dismissible]="true" (tagDismiss)="dismissTag(tag)"></eds-tag>
        }
        <eds-badge [label]="filtered().length + ' rows'" variant="neutral" [soft]="true" [pill]="true"></eds-badge>
      </div>

      @if (pageRows().length === 0) {
        <eds-empty-state heading="No conversations match" description="Clear filters or pick another window." [icon]="true">
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
      @for (row of config.conversations.slice(0, 3); track row.id) {
        <eds-card class="card-pad" [elevated]="false">
          <div class="section-head">
            <h3>{{ row.topic }}</h3>
            <eds-status [label]="row.status" [variant]="statusVariant(row.status)"></eds-status>
          </div>
          <p class="meta">{{ row.id }} · {{ row.channel }} · wait {{ row.wait }}</p>
          <p class="meta">Owner {{ row.owner }}</p>
          <eds-tag [label]="row.copilot" variant="info"></eds-tag>
        </eds-card>
      }
    </section>
  `
})
export class ConversationsPageComponent {
  protected readonly config = templateConfig;
  protected readonly search = signal('');
  protected readonly page = signal(1);
  protected readonly pageSize = 5;
  protected readonly rangeStart = signal('2026-08-01');
  protected readonly rangeEnd = signal('2026-08-30');
  protected readonly tags = signal(['Chat', 'Ready']);

  protected readonly suggestions = this.config.conversations.map((item) => item.topic);

  protected readonly columns: EdsDataTableColumn[] = [
    { key: 'id', label: 'Ticket', sortable: true },
    { key: 'topic', label: 'Topic', sortable: true },
    { key: 'owner', label: 'Owner', sortable: true },
    { key: 'channel', label: 'Channel', sortable: true },
    { key: 'wait', label: 'Wait', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'copilot', label: 'Copilot', sortable: true }
  ];

  protected readonly filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    return this.config.conversations.filter(
      (item) =>
        !q ||
        item.topic.toLowerCase().includes(q) ||
        item.owner.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.channel.toLowerCase().includes(q)
    );
  });

  protected readonly pageRows = computed(() => {
    const start = (this.page() - 1) * this.pageSize;
    return this.filtered().slice(start, start + this.pageSize);
  });

  protected openReply(): void {
    window.dispatchEvent(new CustomEvent('harbor:reply'));
  }

  protected onRange(range: { start: string; end: string }): void {
    this.rangeStart.set(range.start);
    this.rangeEnd.set(range.end);
  }

  protected dismissTag(tag: string): void {
    this.tags.update((items) => items.filter((item) => item !== tag));
  }

  protected statusVariant(status: string): 'success' | 'warning' | 'danger' | 'info' | 'neutral' {
    if (status === 'Ready' || status === 'Resolved' || status === 'Active') {
      return 'success';
    }
    if (status === 'Watch' || status === 'Review') {
      return 'warning';
    }
    return 'neutral';
  }
}
