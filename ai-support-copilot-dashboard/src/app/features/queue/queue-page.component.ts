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
import { metricsForPeriod } from '../../shared/utils/support';

@Component({
  selector: 'app-queue-page',
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
          <eds-button variant="primary" icon="edit" (clicked)="openReply()">Draft reply</eds-button>
        </eds-button-group>
      </div>
    </section>

    <eds-alert
      variant="warning"
      title="Billing replies are stacking in the live queue"
      message="Kavya Poluru’s copilot drafts are ready on 11 invoices. Suggestion pack “Refund window” is queued for review."
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
            <h2>Queue pressure</h2>
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
          <span><span>First reply under 15 minutes</span><strong>94%</strong></span>
          <eds-progress-bar [value]="94" [max]="100" label="First reply" [showValue]="true"></eds-progress-bar>
        </div>
        <div class="meter-row">
          <span><span>Copilot coverage</span><strong>88 of 100</strong></span>
          <eds-meter [value]="88" [max]="100" label="Copilot coverage" [showValue]="true"></eds-meter>
        </div>
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <div class="section-head">
          <div>
            <p class="eyebrow">Coach</p>
            <h2>Next best replies</h2>
          </div>
          <eds-circular-progress [value]="89" [max]="100" [size]="64" [showValue]="true"></eds-circular-progress>
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
            <p class="eyebrow">Inbox</p>
            <h2>Live conversations</h2>
          </div>
          <eds-tag [label]="config.conversations.length + ' open'" variant="brand"></eds-tag>
        </div>
        <div class="table-wrap">
          <eds-data-table [columns]="ticketColumns" [rows]="ticketRows" [striped]="true" [compact]="true"></eds-data-table>
        </div>
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <div class="section-head">
          <div>
            <p class="eyebrow">Quality</p>
            <h2>Copilot usefulness</h2>
          </div>
          <eds-status label="Trusted" variant="success" [pulse]="true"></eds-status>
        </div>
        <eds-rating [value]="5" [readonly]="true" size="lg"></eds-rating>
        <p class="meta meta-clamp">Scored on Ananya Poluru’s live support set, including billing and tracking drafts.</p>
        <eds-divider spacing="md" label="Workspace"></eds-divider>
        <eds-description-list [items]="facts" [columns]="1" [compact]="true"></eds-description-list>
      </eds-card>
    </section>

    <section class="grid-3" style="margin-top: 0.9rem">
      <eds-card class="card-pad" [elevated]="false">
        <p class="eyebrow">Owners</p>
        <h2>Agent load</h2>
        <p class="meta meta-clamp">Capacity across billing, orders, escalations, chat, and night coverage.</p>
        @for (person of config.owners; track person.name) {
          <div class="owner-row">
            <span><span>{{ person.name }}</span><strong>{{ person.load }}%</strong></span>
            <eds-progress-bar [value]="person.load" [max]="100" [label]="person.focus"></eds-progress-bar>
          </div>
        }
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <p class="eyebrow">SLA</p>
        <h2>Copilot freshness</h2>
        <p class="meta meta-clamp">First reply, draft coverage, and grounded replies stay inside the Harbor Desk bar.</p>
        @for (item of config.sla; track item.label) {
          <div class="meter-row">
            <span><span>{{ item.label }}</span><strong>{{ item.value }}</strong></span>
            <eds-meter [value]="item.value" [max]="100" [label]="item.label" [showValue]="true"></eds-meter>
          </div>
        }
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <p class="eyebrow">Live</p>
        <h2>Copilot activity</h2>
        <p class="meta meta-clamp">Latest drafts, citations, and CSAT follow-ups for Ananya Poluru’s queue.</p>
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
export class QueuePageComponent {
  protected readonly config = templateConfig;
  protected readonly period = signal('week');
  protected readonly coachTab = signal(0);
  protected readonly statusVariant = statusVariant;

  protected readonly crumbs: EdsBreadcrumbItem[] = [
    { label: 'Harbor Desk', href: '/' },
    { label: 'Queue' }
  ];

  protected readonly periods: EdsSegmentOption[] = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' }
  ];

  protected readonly coachTabs: EdsTabItem[] = [
    { label: 'Actions', content: 'Open billing, escalation, and reset alerts.' },
    { label: 'Motion', content: 'Recent drafts and knowledge hits.' },
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

  protected readonly ticketColumns: EdsDataTableColumn[] = [
    { key: 'id', label: 'Ticket', sortable: true },
    { key: 'topic', label: 'Topic', sortable: true },
    { key: 'owner', label: 'Owner', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'copilot', label: 'Copilot', sortable: true }
  ];

  protected readonly ticketRows = this.config.conversations.slice(0, 6).map((entry) => ({
    id: entry.id,
    topic: entry.topic,
    owner: entry.owner,
    status: entry.status,
    copilot: entry.copilot
  }));

  protected readonly facts: EdsDescriptionListItem[] = [
    { term: 'Workspace', description: this.config.workspace },
    { term: 'Support lead', description: this.config.user.name },
    { term: 'Auto-draft', description: 'On for billing and orders' },
    { term: 'Primary pack', description: 'Refund window' },
    { term: 'Copilot', description: this.config.copilotLabel }
  ];

  protected openReply(): void {
    window.dispatchEvent(new CustomEvent('harbor:reply'));
  }

  protected metricHint(label: string): string {
    const hints: Record<string, string> = {
      'AI-assisted replies': 'Billing, tracking, and night-coverage drafts sent with a copilot first pass.',
      'Resolution rate': 'Closed with a grounded citation from Meera Poluru’s library.',
      'Queue waiting': 'Open tickets still in Review or Watch for Ananya Poluru.',
      'CSAT score': 'Surveyed contacts after copilot-assisted closes this window.'
    };
    return hints[label] ?? 'Workspace pulse for Ananya Poluru’s support queue.';
  }
}
