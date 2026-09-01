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
import { rankModels } from '../../shared/utils/eval';

@Component({
  selector: 'app-board-page',
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
          <eds-button variant="primary" icon="plus" (clicked)="openRun()">Run evaluation</eds-button>
        </eds-button-group>
      </div>
    </section>

    <eds-alert
      variant="warning"
      title="Three regressions are still open"
      message="Devika Poluru’s safety suite and Meera Poluru’s multilingual QA are below baseline. Scorecard EV-441 cannot sign off until they clear."
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
            <p class="eyebrow">Throughput</p>
            <h2>Eval runs today</h2>
          </div>
          <eds-badge label="Live" variant="brand" [soft]="true" [pill]="true"></eds-badge>
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
          <span><span>Weekly run target 350</span><strong>94%</strong></span>
          <eds-progress-bar [value]="94" [max]="100" label="Weekly runs" [showValue]="true"></eds-progress-bar>
        </div>
        <div class="meter-row">
          <span><span>Baseline coverage</span><strong>88 of 100</strong></span>
          <eds-meter [value]="88" [max]="100" label="Baseline coverage" [showValue]="true"></eds-meter>
        </div>
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <div class="section-head">
          <div>
            <p class="eyebrow">Coach</p>
            <h2>Release health</h2>
          </div>
          <eds-circular-progress [value]="74" [max]="100" [size]="64" [showValue]="true"></eds-circular-progress>
        </div>
        <eds-tabs [tabs]="coachTabs" [selectedIndex]="coachTab()" (selectedIndexChange)="coachTab.set($event)"></eds-tabs>
        @if (coachTab() === 0) {
          <eds-accordion [items]="featureItems" [single]="true"></eds-accordion>
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
            <p class="eyebrow">Leaderboard</p>
            <h2>Checkpoint ranking</h2>
          </div>
          <eds-tag [label]="rankedModels.length + ' models'" variant="brand"></eds-tag>
        </div>
        <div class="table-wrap">
          <eds-data-table [columns]="modelColumns" [rows]="leaderboardRows" [striped]="true" [compact]="true"></eds-data-table>
        </div>
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <div class="section-head">
          <div>
            <p class="eyebrow">Workspace</p>
            <h2>Quality facts</h2>
          </div>
          <eds-status label="Gate on" variant="success" [pulse]="true"></eds-status>
        </div>
        <eds-description-list [items]="facts" [columns]="1" [compact]="true"></eds-description-list>
      </eds-card>
    </section>

    <section class="grid-3" style="margin-top: 0.9rem">
      <eds-card class="card-pad" [elevated]="false">
        <p class="eyebrow">Reviewers</p>
        <h2>Queue load</h2>
        @for (person of config.reviewers; track person.name) {
          <div class="owner-row">
            <span><span>{{ person.name }}</span><strong>{{ person.load }}%</strong></span>
            <eds-progress-bar [value]="person.load" [max]="100" [label]="person.role"></eds-progress-bar>
          </div>
        }
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <p class="eyebrow">SLA</p>
        <h2>Board freshness</h2>
        @for (item of config.sla; track item.label) {
          <div class="meter-row">
            <span><span>{{ item.label }}</span><strong>{{ item.value }}</strong></span>
            <eds-meter [value]="item.value" [max]="100" [label]="item.label" [showValue]="true"></eds-meter>
          </div>
        }
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <p class="eyebrow">Live</p>
        <h2>Evaluation activity</h2>
        @for (entry of config.activity.slice(0, 4); track entry.title) {
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
export class BoardPageComponent {
  protected readonly config = templateConfig;
  protected readonly period = signal('week');
  protected readonly coachTab = signal(0);
  protected readonly statusVariant = statusVariant;
  protected readonly rankedModels = rankModels(this.config.models);

  protected readonly crumbs: EdsBreadcrumbItem[] = [
    { label: 'Eval Board', href: '/' },
    { label: 'Board' }
  ];

  protected readonly periods: EdsSegmentOption[] = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' }
  ];

  protected readonly coachTabs: EdsTabItem[] = [
    { label: 'Gates', content: 'Must-have evaluation controls.' },
    { label: 'Motion', content: 'Recent suite and scorecard events.' },
    { label: 'Inbox', content: 'Mentions for Ananya Poluru.' }
  ];

  protected readonly visibleMetrics = computed(
    () => this.config.metricsByPeriod[this.period() as 'day' | 'week' | 'month'] ?? this.config.metrics
  );

  protected readonly featureItems: EdsAccordionItem[] = this.config.mustHaveFeatures.map((item, index) => ({
    heading: item.title,
    content: item.detail,
    open: index === 0
  }));

  protected readonly motionItems: EdsTimelineItem[] = this.config.activity.map((entry, index) => ({
    title: entry.title,
    description: entry.detail,
    timestamp: entry.time,
    status: index === 0 ? 'current' : index < 3 ? 'complete' : 'upcoming'
  }));

  protected readonly inboxList: EdsListItem[] = this.config.inbox;

  protected readonly modelColumns: EdsDataTableColumn[] = [
    { key: 'name', label: 'Model', sortable: true },
    { key: 'family', label: 'Family', sortable: true },
    { key: 'bestScore', label: 'Best', sortable: true },
    { key: 'status', label: 'Status', sortable: true }
  ];

  protected readonly leaderboardRows = this.rankedModels.slice(0, 6).map((item) => ({
    name: item.name,
    family: item.family,
    bestScore: item.bestScore,
    status: item.status
  }));

  protected readonly facts: EdsDescriptionListItem[] = [
    { term: 'Workspace', description: this.config.workspace },
    { term: 'QA lead', description: this.config.user.name },
    { term: 'Primary checkpoint', description: 'horizon-2' },
    { term: 'Open regressions', description: String(this.config.regressions.filter((item) => item.status === 'Open').length) },
    { term: 'Release gate', description: 'On for production' }
  ];

  protected openRun(): void {
    window.dispatchEvent(new CustomEvent('eval:run'));
  }
}
