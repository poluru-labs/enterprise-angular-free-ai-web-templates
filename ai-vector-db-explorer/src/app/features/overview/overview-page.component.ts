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
import { metricsForPeriod } from '../../shared/utils/vector';

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
          <eds-button variant="primary" icon="search" (clicked)="openQuery()">Run query</eds-button>
        </eds-button-group>
      </div>
    </section>

    <eds-alert
      variant="warning"
      title="docs-prod is rebuilding shards 4–6"
      message="Maya Poluru queued a HNSW rebuild. Query traffic stays on the previous snapshot."
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
            <h2>Query pressure</h2>
          </div>
          <eds-badge label="Today" variant="brand" [soft]="true"></eds-badge>
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
          <span><span>p95 under 50ms</span><strong>94%</strong></span>
          <eds-progress-bar [value]="94" [max]="100" label="Latency" [showValue]="true"></eds-progress-bar>
        </div>
        <div class="meter-row">
          <span><span>Recall@10</span><strong>91 of 100</strong></span>
          <eds-meter [value]="91" [max]="100" label="Recall" [showValue]="true"></eds-meter>
        </div>
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <div class="section-head">
          <div>
            <p class="eyebrow">Health</p>
            <h2>Index coach</h2>
          </div>
          <eds-circular-progress [value]="91" [max]="100" [size]="64" [showValue]="true"></eds-circular-progress>
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
            <p class="eyebrow">Catalog</p>
            <h2>Live indexes</h2>
          </div>
          <eds-tag [label]="config.indexes.length + ' indexes'" variant="brand"></eds-tag>
        </div>
        <div class="table-wrap">
          <eds-data-table [columns]="indexColumns" [rows]="indexRows" [striped]="true" [compact]="true"></eds-data-table>
        </div>
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <div class="section-head">
          <div>
            <p class="eyebrow">Quality</p>
            <h2>Eval pack</h2>
          </div>
          <eds-status label="Trusted" variant="success" [pulse]="true"></eds-status>
        </div>
        <eds-rating [value]="5" [readonly]="true" size="lg"></eds-rating>
        <p class="meta meta-clamp">Scored on Maya Poluru’s cosine pack, including policy and FAQ neighborhoods.</p>
        <eds-divider spacing="md" label="Workspace"></eds-divider>
        <eds-description-list [items]="facts" [columns]="1" [compact]="true"></eds-description-list>
      </eds-card>
    </section>

    <section class="grid-3" style="margin-top: 0.9rem">
      <eds-card class="card-pad" [elevated]="false">
        <p class="eyebrow">Owners</p>
        <h2>Index load</h2>
        <p class="meta meta-clamp">Capacity across docs, FAQ, code, stills, and session memory.</p>
        @for (person of config.owners; track person.name) {
          <div class="owner-row">
            <span><span>{{ person.name }}</span><strong>{{ person.load }}%</strong></span>
            <eds-progress-bar [value]="person.load" [max]="100" [label]="person.focus"></eds-progress-bar>
          </div>
        }
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <p class="eyebrow">SLA</p>
        <h2>Serving bar</h2>
        <p class="meta meta-clamp">Latency, recall, replica coverage, and upsert success stay inside the Lattice bar.</p>
        @for (item of config.sla; track item.label) {
          <div class="meter-row">
            <span><span>{{ item.label }}</span><strong>{{ item.value }}</strong></span>
            <eds-meter [value]="item.value" [max]="100" [label]="item.label" [showValue]="true"></eds-meter>
          </div>
        }
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <p class="eyebrow">Live</p>
        <h2>Index activity</h2>
        <p class="meta meta-clamp">Upserts, queries, and neighbor inspects for Maya Poluru’s workspace.</p>
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
    { label: 'Lattice', href: '/' },
    { label: 'Overview' }
  ];

  protected readonly periods: EdsSegmentOption[] = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' }
  ];

  protected readonly coachTabs: EdsTabItem[] = [
    { label: 'Alerts', content: 'Rebuilds, cooling replicas, and frozen holds.' },
    { label: 'Motion', content: 'Recent upserts and queries.' },
    { label: 'Inbox', content: 'Mentions for Maya Poluru.' }
  ];

  protected readonly visibleMetrics = computed(() =>
    metricsForPeriod(this.period(), this.config.metricsByPeriod, this.config.metrics)
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

  protected readonly indexColumns: EdsDataTableColumn[] = [
    { key: 'name', label: 'Index', sortable: true },
    { key: 'metric', label: 'Metric', sortable: true },
    { key: 'owner', label: 'Owner', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'vectors', label: 'Vectors', sortable: true }
  ];

  protected readonly indexRows = this.config.indexes.map((entry) => ({
    name: entry.name,
    metric: entry.metric,
    owner: entry.owner,
    status: entry.status,
    vectors: entry.vectors.toLocaleString('en-US')
  }));

  protected readonly facts: EdsDescriptionListItem[] = [
    { term: 'Workspace', description: this.config.workspace },
    { term: 'Index engineer', description: this.config.user.name },
    { term: 'Default metric', description: 'cosine' },
    { term: 'Graph', description: 'HNSW' },
    { term: 'Serving', description: this.config.copilotLabel }
  ];

  protected openQuery(): void {
    window.dispatchEvent(new CustomEvent('lattice:query'));
  }

  protected metricHint(label: string): string {
    const hints: Record<string, string> = {
      'Indexed vectors': 'docs-prod, support-faq, and code-search after the 48k upsert.',
      'Query p95': 'Cosine k=10 across warm namespaces for Maya Poluru.',
      'Recall@10': 'Eval pack scored by Kavya Poluru on FAQ and policy neighborhoods.',
      'Warm namespaces': 'Ready replicas. Cooling and frozen holds are excluded.'
    };
    return hints[label] ?? 'Workspace pulse for Maya Poluru’s vector indexes.';
  }
}
