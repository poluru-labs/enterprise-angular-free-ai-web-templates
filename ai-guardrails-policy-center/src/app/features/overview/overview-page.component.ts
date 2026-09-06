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
import { coveragePct, metricsForPeriod } from '../../shared/utils/policy';

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
          <eds-button variant="primary" icon="filter" (clicked)="openTest()">Test prompt</eds-button>
        </eds-button-group>
      </div>
    </section>

    <eds-alert
      variant="warning"
      title="Jailbreak filter is tuning on chat-prod"
      message="Maya Poluru raised the threshold to 0.72 after a false-positive spike on support drafts."
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
            <h2>Blocked pressure</h2>
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
          <span><span>PII catch rate</span><strong>97%</strong></span>
          <eds-progress-bar [value]="97" [max]="100" label="PII" [showValue]="true"></eds-progress-bar>
        </div>
        <div class="meter-row">
          <span><span>Live coverage</span><strong>{{ coverage }} of 100</strong></span>
          <eds-meter [value]="coverage" [max]="100" label="Coverage" [showValue]="true"></eds-meter>
        </div>
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <div class="section-head">
          <div>
            <p class="eyebrow">Health</p>
            <h2>Policy coach</h2>
          </div>
          <eds-circular-progress [value]="coverage" [max]="100" [size]="64" [showValue]="true"></eds-circular-progress>
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
            <h2>Safety policies</h2>
          </div>
          <eds-tag [label]="config.policies.length + ' policies'" variant="brand"></eds-tag>
        </div>
        <div class="table-wrap">
          <eds-data-table [columns]="policyColumns" [rows]="policyRows" [striped]="true" [compact]="true"></eds-data-table>
        </div>
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <div class="section-head">
          <div>
            <p class="eyebrow">Quality</p>
            <h2>Safety pack</h2>
          </div>
          <eds-status label="Trusted" variant="success" [pulse]="true"></eds-status>
        </div>
        <eds-rating [value]="5" [readonly]="true" size="lg"></eds-rating>
        <p class="meta meta-clamp">Scored on Maya Poluru’s safety-core pack, including jailbreak and SSN traces.</p>
        <eds-divider spacing="md" label="Workspace"></eds-divider>
        <eds-description-list [items]="facts" [columns]="1" [compact]="true"></eds-description-list>
      </eds-card>
    </section>

    <section class="grid-3" style="margin-top: 0.9rem">
      <eds-card class="card-pad" [elevated]="false">
        <p class="eyebrow">Owners</p>
        <h2>Policy load</h2>
        <p class="meta meta-clamp">Capacity across safety-core, PII packs, endpoints, and voice hold.</p>
        @for (person of config.owners; track person.name) {
          <div class="owner-row">
            <span><span>{{ person.name }}</span><strong>{{ person.load }}%</strong></span>
            <eds-progress-bar [value]="person.load" [max]="100" [label]="person.focus"></eds-progress-bar>
          </div>
        }
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <p class="eyebrow">SLA</p>
        <h2>Safety bar</h2>
        <p class="meta meta-clamp">Coverage, PII catch, review time, and false-positive budget stay inside the Reef bar.</p>
        @for (item of config.sla; track item.label) {
          <div class="meter-row">
            <span><span>{{ item.label }}</span><strong>{{ item.value }}</strong></span>
            <eds-meter [value]="item.value" [max]="100" [label]="item.label" [showValue]="true"></eds-meter>
          </div>
        }
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <p class="eyebrow">Live</p>
        <h2>Policy activity</h2>
        <p class="meta meta-clamp">Publishes, hashes, and flags for Maya Poluru’s workspace.</p>
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
  protected readonly coverage = Math.round(coveragePct(templateConfig.endpoints, templateConfig.policies));

  protected readonly crumbs: EdsBreadcrumbItem[] = [
    { label: 'Reef', href: '/' },
    { label: 'Overview' }
  ];

  protected readonly periods: EdsSegmentOption[] = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' }
  ];

  protected readonly coachTabs: EdsTabItem[] = [
    { label: 'Alerts', content: 'Tuning filters, missed PII, and uncovered endpoints.' },
    { label: 'Motion', content: 'Recent publishes and hashes.' },
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

  protected readonly policyColumns: EdsDataTableColumn[] = [
    { key: 'name', label: 'Policy', sortable: true },
    { key: 'severity', label: 'Severity', sortable: true },
    { key: 'owner', label: 'Owner', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'endpoints', label: 'Endpoints', sortable: true }
  ];

  protected readonly policyRows = this.config.policies.map((entry) => ({
    name: entry.name,
    severity: entry.severity,
    owner: entry.owner,
    status: entry.status,
    endpoints: String(entry.endpoints)
  }));

  protected readonly facts: EdsDescriptionListItem[] = [
    { term: 'Workspace', description: this.config.workspace },
    { term: 'Policy engineer', description: this.config.user.name },
    { term: 'Default pack', description: 'safety-core' },
    { term: 'PII pack', description: 'pii-strict' },
    { term: 'Serving', description: this.config.copilotLabel }
  ];

  protected openTest(): void {
    window.dispatchEvent(new CustomEvent('reef:test'));
  }

  protected metricHint(label: string): string {
    const hints: Record<string, string> = {
      'Blocked prompts': 'Jailbreak, hate, and violence hits on chat-prod this window.',
      'PII redactions': 'Email, phone, and SSN packs owned by Kavya Poluru.',
      'Policy coverage': 'Live endpoints with an Active safety policy attached.',
      'False positives': 'Reviewed by Maya Poluru after the jailbreak threshold raise.'
    };
    return hints[label] ?? 'Workspace pulse for Maya Poluru’s guardrails.';
  }
}
