import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
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
  EdsEmptyStateComponent,
  EdsListComponent,
  EdsMeterComponent,
  EdsPaginationComponent,
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
import { filterPrompts, paginate, rankPrompts } from '../../shared/utils/prompt';

@Component({
  selector: 'app-library-page',
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
    EdsEmptyStateComponent,
    EdsListComponent,
    EdsMeterComponent,
    EdsPaginationComponent,
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
          <eds-button variant="primary" icon="plus" (clicked)="openPrompt()">New prompt</eds-button>
        </eds-button-group>
      </div>
    </section>

    <eds-alert
      variant="warning"
      title="Sixteen prompts are still in review"
      message="Rohan Poluru’s support triage v3 and Meera Poluru’s policy summarizer cannot publish until Priya Poluru signs off."
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
            <h2>Playground runs today</h2>
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
          <span><span>Weekly publish target 20</span><strong>90%</strong></span>
          <eds-progress-bar [value]="90" [max]="100" label="Weekly publishes" [showValue]="true"></eds-progress-bar>
        </div>
        <div class="meter-row">
          <span><span>Success floor coverage</span><strong>91 of 100</strong></span>
          <eds-meter [value]="91" [max]="100" label="Success floor" [showValue]="true"></eds-meter>
        </div>
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <div class="section-head">
          <div>
            <p class="eyebrow">Coach</p>
            <h2>Library health</h2>
          </div>
          <eds-circular-progress [value]="78" [max]="100" [size]="64" [showValue]="true"></eds-circular-progress>
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
            <p class="eyebrow">Catalog</p>
            <h2>Published and in-flight prompts</h2>
          </div>
          <eds-tag [label]="filtered().length + ' prompts'" variant="brand"></eds-tag>
        </div>
        <div class="chips" style="margin-bottom: 0.85rem">
          @for (item of filters; track item) {
            <button type="button" class="chip" [class.active]="status() === item" (click)="onStatus(item)">{{ item }}</button>
          }
        </div>
        @if (pageRows().length === 0) {
          <eds-empty-state heading="No prompts match" description="Clear filters or pick another status." [icon]="true">
            <div actions>
              <eds-button variant="primary" size="sm" (clicked)="clearFilters()">Clear filters</eds-button>
            </div>
          </eds-empty-state>
        } @else {
          <div class="table-wrap">
            <eds-data-table [columns]="promptColumns" [rows]="pageRows()" [striped]="true" [compact]="true"></eds-data-table>
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

      <eds-card class="card-pad" [elevated]="false">
        <div class="section-head">
          <div>
            <p class="eyebrow">Workspace</p>
            <h2>Library facts</h2>
          </div>
          <eds-status label="Review gate on" variant="success" [pulse]="true"></eds-status>
        </div>
        <eds-description-list [items]="facts" [columns]="1" [compact]="true"></eds-description-list>
        @if (selected(); as prompt) {
          <eds-divider spacing="md"></eds-divider>
          <p class="eyebrow">Playground</p>
          <h3>{{ prompt.name }}</h3>
          <p class="meta">{{ prompt.body }}</p>
          <div class="inline-actions" style="margin-top: 0.75rem">
            <eds-button variant="primary" size="sm" (clicked)="testPrompt(prompt.name)">Test run</eds-button>
            <eds-tag [label]="prompt.success" variant="brand"></eds-tag>
          </div>
          @if (notice()) {
            <p class="notice" style="margin-top: 0.75rem">{{ notice() }}</p>
          }
        }
      </eds-card>
    </section>

    <section class="grid-3" style="margin-top: 0.9rem">
      <eds-card class="card-pad" [elevated]="false">
        <p class="eyebrow">Owners</p>
        <h2>Review load</h2>
        @for (person of config.owners; track person.name) {
          <div class="owner-row">
            <span><span>{{ person.name }}</span><strong>{{ person.load }}%</strong></span>
            <eds-progress-bar [value]="person.load" [max]="100" [label]="person.role"></eds-progress-bar>
          </div>
        }
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <p class="eyebrow">SLA</p>
        <h2>Library freshness</h2>
        @for (item of config.sla; track item.label) {
          <div class="meter-row">
            <span><span>{{ item.label }}</span><strong>{{ item.value }}</strong></span>
            <eds-meter [value]="item.value" [max]="100" [label]="item.label" [showValue]="true"></eds-meter>
          </div>
        }
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <p class="eyebrow">Live</p>
        <h2>Prompt activity</h2>
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
export class LibraryPageComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly config = templateConfig;
  protected readonly period = signal('week');
  protected readonly coachTab = signal(0);
  protected readonly search = signal('');
  protected readonly status = signal('All');
  protected readonly page = signal(1);
  protected readonly pageSize = 5;
  protected readonly notice = signal('');
  protected readonly statusVariant = statusVariant;
  protected readonly ranked = rankPrompts(this.config.prompts);
  protected readonly filters = ['All', 'Live', 'Review', 'Draft', 'Archived'];

  protected readonly crumbs: EdsBreadcrumbItem[] = [
    { label: 'Prompt library', href: '/' },
    { label: 'Library' }
  ];

  protected readonly periods: EdsSegmentOption[] = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' }
  ];

  protected readonly coachTabs: EdsTabItem[] = [
    { label: 'Gates', content: 'Must-have prompt operations controls.' },
    { label: 'Motion', content: 'Recent publish and review events.' },
    { label: 'Inbox', content: 'Mentions for Priya Poluru.' }
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

  protected readonly promptColumns: EdsDataTableColumn[] = [
    { key: 'name', label: 'Prompt', sortable: true },
    { key: 'collection', label: 'Collection', sortable: true },
    { key: 'owner', label: 'Owner', sortable: true },
    { key: 'success', label: 'Success', sortable: true },
    { key: 'status', label: 'Status', sortable: true }
  ];

  protected readonly filtered = computed(() => filterPrompts(this.config.prompts, this.search(), this.status()));

  protected readonly pageRows = computed(() =>
    paginate(this.filtered(), this.page(), this.pageSize).map((item) => ({
      name: item.name,
      collection: item.collection,
      owner: item.owner,
      success: item.success,
      status: item.status
    }))
  );

  protected readonly selected = computed(() => this.ranked[0] ?? this.config.prompts[0]);

  protected readonly facts: EdsDescriptionListItem[] = [
    { term: 'Workspace', description: this.config.workspace },
    { term: 'Prompt ops lead', description: this.config.user.name },
    { term: 'Live prompts', description: String(this.config.prompts.filter((item) => item.status === 'Live').length) },
    { term: 'In review', description: String(this.config.prompts.filter((item) => item.status === 'Review').length) },
    { term: 'Review gate', description: 'On for production' }
  ];

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const q = params.get('q') ?? '';
      const status = params.get('status');
      if (q) {
        this.onSearch(q);
      }
      if (status) {
        this.onStatus(status);
      }
    });
  }

  protected openPrompt(): void {
    window.dispatchEvent(new CustomEvent('prompt:new'));
  }

  protected onSearch(value: string): void {
    this.search.set(value);
    this.page.set(1);
  }

  protected onStatus(value: string): void {
    this.status.set(value);
    this.page.set(1);
  }

  protected clearFilters(): void {
    this.search.set('');
    this.status.set('All');
    this.page.set(1);
  }

  protected testPrompt(name: string): void {
    this.notice.set(`Playground run queued for ${name}.`);
  }
}
