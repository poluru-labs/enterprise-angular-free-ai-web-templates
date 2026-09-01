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
          <eds-button variant="primary" icon="download" (clicked)="openExport()">Export report</eds-button>
        </eds-button-group>
      </div>
    </section>

    <eds-alert
      variant="warning"
      title="Production is at 88% of budget"
      message="Lakshmi Poluru’s 80% alert fired. gpt-4.1 will hit the cap in about 4 days at the current rate."
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
        </eds-card>
      }
    </section>

    <section class="split" style="margin-top: 0.9rem">
      <eds-card class="card-pad" [elevated]="false">
        <div class="section-head">
          <div>
            <p class="eyebrow">Volume</p>
            <h2>Token throughput</h2>
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
          <span><span>Weekly token target 90M</span><strong>93%</strong></span>
          <eds-progress-bar [value]="93" [max]="100" label="Weekly tokens" [showValue]="true"></eds-progress-bar>
        </div>
        <div class="meter-row">
          <span><span>Budget remaining</span><strong>74 of 100</strong></span>
          <eds-meter [value]="74" [max]="100" label="Budget remaining" [showValue]="true"></eds-meter>
        </div>
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <div class="section-head">
          <div>
            <p class="eyebrow">Coach</p>
            <h2>Spend health</h2>
          </div>
          <eds-circular-progress [value]="74" [max]="100" [size]="64" [showValue]="true"></eds-circular-progress>
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
            <p class="eyebrow">Metering</p>
            <h2>Top workspaces</h2>
          </div>
          <eds-tag [label]="usageRows.length + ' rows'" variant="brand"></eds-tag>
        </div>
        <div class="table-wrap">
          <eds-data-table [columns]="usageColumns" [rows]="usageRows" [striped]="true" [compact]="true"></eds-data-table>
        </div>
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <div class="section-head">
          <div>
            <p class="eyebrow">Quality</p>
            <h2>Latency rating</h2>
          </div>
          <eds-status label="Stable" variant="success" [pulse]="true"></eds-status>
        </div>
        <eds-rating [value]="4" [readonly]="true" size="lg"></eds-rating>
        <p class="meta">Scored on Lakshmi Poluru’s production eval set.</p>
        <eds-divider spacing="md" label="Workspace"></eds-divider>
        <eds-description-list [items]="facts" [columns]="1" [compact]="true"></eds-description-list>
      </eds-card>
    </section>

    <section class="grid-3" style="margin-top: 0.9rem">
      <eds-card class="card-pad" [elevated]="false">
        <p class="eyebrow">Owners</p>
        <h2>Workspace load</h2>
        @for (person of config.owners; track person.name) {
          <div class="owner-row">
            <span><span>{{ person.name }}</span><strong>{{ person.load }}%</strong></span>
            <eds-progress-bar [value]="person.load" [max]="100" [label]="person.focus"></eds-progress-bar>
          </div>
        }
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <p class="eyebrow">SLA</p>
        <h2>Platform freshness</h2>
        @for (item of config.sla; track item.label) {
          <div class="meter-row">
            <span><span>{{ item.label }}</span><strong>{{ item.value }}</strong></span>
            <eds-meter [value]="item.value" [max]="100" [label]="item.label" [showValue]="true"></eds-meter>
          </div>
        }
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <p class="eyebrow">Live</p>
        <h2>Usage activity</h2>
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
    { label: 'Lilac Meter', href: '/' },
    { label: 'Overview' }
  ];

  protected readonly periods: EdsSegmentOption[] = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' }
  ];

  protected readonly coachTabs: EdsTabItem[] = [
    { label: 'Alerts', content: 'Budget and latency holds.' },
    { label: 'Motion', content: 'Recent spend and routing events.' },
    { label: 'Inbox', content: 'Mentions for Lakshmi Poluru.' }
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

  protected readonly usageColumns: EdsDataTableColumn[] = [
    { key: 'model', label: 'Model', sortable: true },
    { key: 'workspace', label: 'Workspace', sortable: true },
    { key: 'tokens', label: 'Tokens', sortable: true },
    { key: 'cost', label: 'Cost', sortable: true },
    { key: 'status', label: 'Status', sortable: true }
  ];

  protected readonly usageRows = this.config.usage.slice(0, 6).map((entry) => ({
    model: entry.model,
    workspace: entry.workspace,
    tokens: entry.tokens,
    cost: entry.cost,
    status: entry.status
  }));

  protected readonly facts: EdsDescriptionListItem[] = [
    { term: 'Workspace', description: this.config.workspace },
    { term: 'Platform lead', description: this.config.user.name },
    { term: 'Cost gate', description: 'Off for sandbox' },
    { term: 'Primary model', description: 'gpt-4.1' },
    { term: 'Open alerts', description: String(this.config.opsAlerts.filter((item) => item.status === 'Open').length) }
  ];

  protected openExport(): void {
    window.dispatchEvent(new CustomEvent('meter:export'));
  }
}
