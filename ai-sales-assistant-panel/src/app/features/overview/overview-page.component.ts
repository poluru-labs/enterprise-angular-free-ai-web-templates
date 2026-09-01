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
import { metricsForPeriod } from '../../shared/utils/sales';

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
          <eds-button variant="primary" icon="file" (clicked)="openBrief()">Create brief</eds-button>
        </eds-button-group>
      </div>
    </section>

    <eds-alert
      variant="warning"
      title="Brightside Health is showing expansion intent"
      message="Rohan Poluru’s AE brief flagged three new buying-committee members. Sequence “Clinic expansion” is queued for review."
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
            <p class="eyebrow">Pipeline</p>
            <h2>Seller activity</h2>
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
          <span><span>Weekly pipeline target $2.0M</span><strong>92%</strong></span>
          <eds-progress-bar [value]="92" [max]="100" label="Weekly pipeline" [showValue]="true"></eds-progress-bar>
        </div>
        <div class="meter-row">
          <span><span>Meeting prep coverage</span><strong>88 of 100</strong></span>
          <eds-meter [value]="88" [max]="100" label="Meeting prep" [showValue]="true"></eds-meter>
        </div>
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <div class="section-head">
          <div>
            <p class="eyebrow">Coach</p>
            <h2>Next best actions</h2>
          </div>
          <eds-circular-progress [value]="76" [max]="100" [size]="64" [showValue]="true"></eds-circular-progress>
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
            <p class="eyebrow">Accounts</p>
            <h2>Priority pipeline</h2>
          </div>
          <eds-tag [label]="config.accounts.length + ' accounts'" variant="brand"></eds-tag>
        </div>
        <div class="table-wrap">
          <eds-data-table [columns]="accountColumns" [rows]="accountRows" [striped]="true" [compact]="true"></eds-data-table>
        </div>
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <div class="section-head">
          <div>
            <p class="eyebrow">Quality</p>
            <h2>Brief usefulness</h2>
          </div>
          <eds-status label="Trusted" variant="success" [pulse]="true"></eds-status>
        </div>
        <eds-rating [value]="5" [readonly]="true" size="lg"></eds-rating>
        <p class="meta meta-clamp">Scored on Ananya Poluru’s enterprise seller set, including Northstar QBR packs.</p>
        <eds-divider spacing="md" label="Workspace"></eds-divider>
        <eds-description-list [items]="facts" [columns]="1" [compact]="true"></eds-description-list>
      </eds-card>
    </section>

    <section class="grid-3" style="margin-top: 0.9rem">
      <eds-card class="card-pad" [elevated]="false">
        <p class="eyebrow">Owners</p>
        <h2>Seller load</h2>
        <p class="meta meta-clamp">Capacity across renewals, expansion, outbound, and late-stage legal.</p>
        @for (person of config.owners; track person.name) {
          <div class="owner-row">
            <span><span>{{ person.name }}</span><strong>{{ person.load }}%</strong></span>
            <eds-progress-bar [value]="person.load" [max]="100" [label]="person.focus"></eds-progress-bar>
          </div>
        }
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <p class="eyebrow">SLA</p>
        <h2>Assistant freshness</h2>
        <p class="meta meta-clamp">Briefs, meeting prep, and forecast hygiene stay inside Ananya Poluru’s bar.</p>
        @for (item of config.sla; track item.label) {
          <div class="meter-row">
            <span><span>{{ item.label }}</span><strong>{{ item.value }}</strong></span>
            <eds-meter [value]="item.value" [max]="100" [label]="item.label" [showValue]="true"></eds-meter>
          </div>
        }
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <p class="eyebrow">Live</p>
        <h2>Revenue signals</h2>
        <p class="meta meta-clamp">Latest briefs, stalls, and champion maps for the enterprise book.</p>
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
    { label: 'Garnet Close', href: '/' },
    { label: 'Overview' }
  ];

  protected readonly periods: EdsSegmentOption[] = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' }
  ];

  protected readonly coachTabs: EdsTabItem[] = [
    { label: 'Actions', content: 'Open expansion, stall, and legal alerts.' },
    { label: 'Motion', content: 'Recent briefs and sequence events.' },
    { label: 'Inbox', content: 'Mentions for Ananya Poluru.' }
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

  protected readonly accountColumns: EdsDataTableColumn[] = [
    { key: 'name', label: 'Account', sortable: true },
    { key: 'owner', label: 'Owner', sortable: true },
    { key: 'pipeline', label: 'Pipeline', sortable: true },
    { key: 'stage', label: 'Stage', sortable: true },
    { key: 'brief', label: 'Brief', sortable: true }
  ];

  protected readonly accountRows = this.config.accounts.slice(0, 6).map((entry) => ({
    name: entry.name,
    owner: entry.owner,
    pipeline: entry.pipeline,
    stage: entry.stage,
    brief: entry.brief
  }));

  protected readonly facts: EdsDescriptionListItem[] = [
    { term: 'Workspace', description: this.config.workspace },
    { term: 'Revenue lead', description: this.config.user.name },
    { term: 'Auto-brief', description: 'On for enterprise' },
    { term: 'Primary sequence', description: 'Clinic expansion' },
    { term: 'CRM', description: this.config.crmLabel }
  ];

  protected openBrief(): void {
    window.dispatchEvent(new CustomEvent('garnet:brief'));
  }

  protected metricHint(label: string): string {
    const hints: Record<string, string> = {
      'Qualified pipeline': 'Commit plus watched expansion across Northstar, Brightside, and Helix.',
      'Accounts researched': 'Ready briefs for Kavya Poluru, Rohan Poluru, and Meera Poluru.',
      'Next best actions': 'Open stalls, champion recaps, and legal follow-ups.',
      'Meeting prep ready': 'QBR, discovery, and legal packs inside the 24-hour SLA.'
    };
    return hints[label] ?? 'Workspace pulse for Ananya Poluru’s revenue book.';
  }
}
