import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  EdsAccordionComponent,
  EdsAlertComponent,
  EdsBadgeComponent,
  EdsBreadcrumbComponent,
  EdsButtonComponent,
  EdsButtonGroupComponent,
  EdsCardComponent,
  EdsCircularProgressComponent,
  EdsDataTableColumn,
  EdsDataTableComponent,
  EdsDescriptionListComponent,
  EdsDividerComponent,
  EdsListComponent,
  EdsMeterComponent,
  EdsProgressBarComponent,
  EdsRatingComponent,
  EdsSegmentedControlComponent,
  EdsStatComponent,
  EdsStatusComponent,
  EdsTabsComponent,
  EdsTagComponent,
  EdsTimelineComponent,
  type EdsAccordionItem,
  type EdsBreadcrumbItem,
  type EdsDescriptionListItem,
  type EdsListItem,
  type EdsSegmentOption,
  type EdsTabItem,
  type EdsTimelineItem
} from '@poluru-labs/enterprise-design-system-angular';
import { templateConfig } from '../../core/config/template.config';
import { statusVariant } from '../../shared/utils/status-variant';

@Component({
  selector: 'app-overview-page',
  standalone: true,
  imports: [
    EdsAccordionComponent,
    EdsAlertComponent,
    EdsBadgeComponent,
    EdsBreadcrumbComponent,
    EdsButtonComponent,
    EdsButtonGroupComponent,
    EdsCardComponent,
    EdsCircularProgressComponent,
    EdsDataTableComponent,
    EdsDescriptionListComponent,
    EdsDividerComponent,
    EdsListComponent,
    EdsMeterComponent,
    EdsProgressBarComponent,
    EdsRatingComponent,
    EdsSegmentedControlComponent,
    EdsStatComponent,
    EdsStatusComponent,
    EdsTabsComponent,
    EdsTagComponent,
    EdsTimelineComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <eds-breadcrumb [items]="crumbs"></eds-breadcrumb>
        <p class="eyebrow">{{ config.eyebrow }}</p>
        <h1>{{ config.title }}</h1>
        <p class="summary">{{ config.summary }}</p>
      </div>
      <div class="head-actions">
        <eds-segmented-control
          size="sm"
          [options]="periods"
          [value]="period()"
          (valueChange)="period.set($event)"
        ></eds-segmented-control>
        <eds-button-group size="sm">
          <eds-button variant="secondary" icon="refresh">Refresh</eds-button>
          <eds-button variant="primary" icon="plus" (clicked)="openAdd()">Add source</eds-button>
        </eds-button-group>
      </div>
    </section>

    <eds-alert
      variant="warning"
      title="Legal KB is pending review"
      message="Venkata Poluru paused retrieval on 412 contracts until collection ACLs are signed off."
      [dismissible]="true"
    ></eds-alert>

    <section class="grid-4" style="margin-top: 1rem">
      @for (metric of visibleMetrics(); track metric.label) {
        <eds-card class="card-pad" [elevated]="false">
          <eds-stat
            [label]="metric.label"
            [value]="metric.value"
            [trend]="metric.trendDir"
            [trendValue]="metric.trend"
            [hint]="metric.hint + ' · ' + period()"
          ></eds-stat>
          <p class="meta meta-clamp">{{ metricHint(metric.label) }}</p>
        </eds-card>
      }
    </section>

    <section class="split" style="margin-top: 0.9rem">
      <eds-card class="card-pad" [elevated]="false">
        <div class="section-head">
          <div>
            <p class="eyebrow">Volume</p>
            <h2>Retrieval queries</h2>
          </div>
          <eds-badge label="Today" variant="brand" [soft]="true" [pill]="true"></eds-badge>
        </div>
        <div class="hours">
          @for (item of config.hourly; track item.hour) {
            <div class="hour">
              <div class="hour-bar"><i [style.height.%]="item.value"></i></div>
              <small>{{ item.hour }}</small>
            </div>
          }
        </div>
        <eds-divider spacing="md"></eds-divider>
        <div class="meter-row">
          <span><span>Weekly target 8,000</span><strong>93%</strong></span>
          <eds-progress-bar [value]="93" [max]="100" label="Weekly target" [showValue]="true"></eds-progress-bar>
        </div>
        <div class="meter-row">
          <span><span>Citation coverage</span><strong>92 of 100</strong></span>
          <eds-meter [value]="92" [max]="100" label="Citation coverage" [showValue]="true"></eds-meter>
        </div>
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <div class="section-head">
          <div>
            <p class="eyebrow">Coach</p>
            <h2>Knowledge health</h2>
          </div>
          <eds-circular-progress [value]="94.6" [max]="100" [size]="64" [showValue]="true"></eds-circular-progress>
        </div>
        <eds-tabs [tabs]="coachTabs" [selectedIndex]="coachTab()" (selectedIndexChange)="coachTab.set($event)"></eds-tabs>
        @if (coachTab() === 0) {
          <eds-accordion [items]="alertItems" [single]="true"></eds-accordion>
        } @else if (coachTab() === 1) {
          <eds-timeline [items]="motionItems"></eds-timeline>
        } @else {
          <eds-list [items]="inboxList" [divided]="true"></eds-list>
        }
      </eds-card>
    </section>

    <section class="split" style="margin-top: 0.9rem">
      <eds-card class="card-pad" [elevated]="false">
        <div class="section-head">
          <div>
            <p class="eyebrow">Sync</p>
            <h2>Recent applications</h2>
          </div>
          <eds-tag [label]="config.recentSyncs.length + ' sources'" variant="brand"></eds-tag>
        </div>
        <div class="table-wrap">
          <eds-data-table [columns]="syncColumns" [rows]="syncRows" [striped]="true" [compact]="true"></eds-data-table>
        </div>
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <div class="section-head">
          <div>
            <p class="eyebrow">Quality</p>
            <h2>Answer rating</h2>
          </div>
          <eds-status label="Stable" variant="success" [pulse]="true"></eds-status>
        </div>
        <eds-rating [value]="4.5" [allowHalf]="true" [readonly]="true" size="lg"></eds-rating>
        <p class="meta">Grounded answers scored by Ananya Poluru’s eval set.</p>
        <eds-divider spacing="md" label="Workspace"></eds-divider>
        <eds-description-list [items]="facts" [columns]="1" [compact]="true"></eds-description-list>
      </eds-card>
    </section>

    <section class="grid-3" style="margin-top: 0.9rem">
      <eds-card class="card-pad" [elevated]="false">
        <p class="eyebrow">Owners</p>
        <h2>Indexer load</h2>
        <p class="meta meta-clamp">Lakshmi Poluru’s product-docs queue is the heaviest indexer this week.</p>
        @for (person of config.owners; track person.name) {
          <div class="owner-row">
            <span><span>{{ person.name }}</span><strong>{{ person.load }}%</strong></span>
            <eds-progress-bar [value]="person.load" [max]="100" [label]="person.focus"></eds-progress-bar>
          </div>
        }
        <p class="meta">Focus is product docs, help center, macros, APIs, and runbooks.</p>
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <p class="eyebrow">SLA</p>
        <h2>Pipeline freshness</h2>
        <p class="meta meta-clamp">Crawl and embed stay inside SLA. ACL review is the open bottleneck.</p>
        @for (item of config.sla; track item.label) {
          <div class="meter-row">
            <span><span>{{ item.label }}</span><strong>{{ item.value }}</strong></span>
            <eds-meter [value]="item.value" [max]="100" [label]="item.label" [showValue]="true"></eds-meter>
          </div>
        }
        <p class="meta">Eval freshness is measured against Meera Poluru’s nightly job.</p>
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <p class="eyebrow">Live</p>
        <h2>Source updates</h2>
        <p class="meta meta-clamp">Latest crawl, embed, and ACL events for Ananya Poluru’s workspace.</p>
        @for (entry of config.activity; track entry.title) {
          <div class="query-hit">
            <div>
              <strong>{{ entry.title }}</strong>
              <p class="meta">{{ entry.detail }}</p>
            </div>
            <eds-status [label]="entry.status" [variant]="statusVariant(entry.status)"></eds-status>
          </div>
        }
      </eds-card>
    </section>
  `
})
export class OverviewPageComponent {
  protected readonly config = templateConfig;
  protected readonly period = signal('week');
  protected readonly coachTab = signal(0);
  protected readonly statusVariant = statusVariant;

  protected readonly crumbs: EdsBreadcrumbItem[] = [
    { label: 'Indigo Vault', href: '/' },
    { label: 'Overview' }
  ];

  protected readonly periods: EdsSegmentOption[] = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' }
  ];

  protected readonly coachTabs: EdsTabItem[] = [
    { label: 'Alerts', content: 'Open indexer issues and ACL holds.' },
    { label: 'Motion', content: 'Recent crawl and embed events.' },
    { label: 'Inbox', content: 'Mentions for Ananya Poluru.' }
  ];

  protected readonly visibleMetrics = computed(
    () => this.config.metricsByPeriod[this.period() as 'day' | 'week' | 'month'] ?? this.config.metrics
  );

  protected readonly alertItems: EdsAccordionItem[] = this.config.alerts.map((item, index) => ({
    heading: item.heading,
    content: item.content,
    open: index === 0
  }));

  protected readonly motionItems: EdsTimelineItem[] = this.config.activity.map((entry, index) => ({
    title: entry.title,
    description: entry.detail,
    timestamp: entry.time,
    status: index === 0 ? 'current' : index < 3 ? 'complete' : 'upcoming'
  }));

  protected readonly inboxList: EdsListItem[] = this.config.activity.map((entry) => ({
    label: entry.title,
    description: entry.detail
  }));

  protected readonly syncColumns: EdsDataTableColumn[] = [
    { key: 'source', label: 'Source', sortable: true },
    { key: 'owner', label: 'Owner', sortable: true },
    { key: 'docs', label: 'Docs', sortable: true },
    { key: 'quality', label: 'Quality', sortable: true },
    { key: 'status', label: 'Status', sortable: true }
  ];

  protected readonly syncRows = this.config.recentSyncs;

  protected readonly facts: EdsDescriptionListItem[] = [
    { term: 'Workspace', description: this.config.workspace },
    { term: 'Knowledge lead', description: this.config.user.name },
    { term: 'Hybrid search', description: 'On · dense + BM25' },
    { term: 'Embedding model', description: 'text-embed-3-large' },
    { term: 'Open ACL reviews', description: String(this.config.aclReviews.filter((item) => item.status === 'Open').length) }
  ];

  protected openAdd(): void {
    window.dispatchEvent(new CustomEvent('vault:add-source'));
  }

  protected metricHint(label: string): string {
    const hints: Record<string, string> = {
      'Indexed documents': 'New chunks from product docs, help center, and API reference.',
      'Retrieval quality': 'nDCG@10 on Priya Poluru’s support golden set.',
      'Syncing sources': 'Support macros and incident runbooks are the live jobs.',
      'Storage used': 'Vector store plus raw snapshots against a 120 GB workspace cap.'
    };
    return hints[label] ?? 'Workspace pulse for Ananya Poluru’s knowledge vault.';
  }
}
