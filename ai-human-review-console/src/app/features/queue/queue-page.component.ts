import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { templateConfig } from '../../core/config/template.config';
import { initials } from '../../shared/utils/initials';
import { agingLabel, statusIcon } from '../../shared/utils/status-icon';

type QueueItem = (typeof templateConfig.queue)[number] & { done?: boolean };

@Component({
  selector: 'app-queue-page',
  standalone: true,
  imports: [RouterLink],
  host: { class: 'page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">{{ config.eyebrow }}</p>
        <h1>{{ config.title }}</h1>
        <p class="summary">{{ config.summary }} {{ config.onCall.primary }} is on call until {{ config.onCall.until }}.</p>
      </div>
      <div class="head-actions">
        <div class="chips">
          @for (item of periods; track item) {
            <button type="button" class="chip" [class.active]="period() === item" (click)="period.set(item)">{{ item }}</button>
          }
        </div>
        <button type="button" class="secondary" (click)="takeNext()">
          <span class="material-symbols-outlined">play_arrow</span>
          Take next
        </button>
        <a class="primary" routerLink="/assignments">
          <span class="material-symbols-outlined">assignment_ind</span>
          {{ config.action }}
        </a>
      </div>
    </section>

    @if (notice()) {
      <p class="notice">{{ notice() }}</p>
    }

    <section class="oncall">
      <span class="pulse"></span>
      <strong>On call</strong>
      <span>{{ config.onCall.primary }} · backup {{ config.onCall.backup }}</span>
      <span class="muted">Until {{ config.onCall.until }}</span>
    </section>

    <section class="metrics">
      @for (metric of visibleMetrics(); track metric.label; let index = $index) {
        <a class="metric" [routerLink]="metric.path">
          <span
            class="metric-icon material-symbols-outlined"
            [class.amber]="index === 1"
            [class.rose]="index === 2"
            [class.blue]="index === 3"
          >{{ metric.icon }}</span>
          <p>{{ metric.label }}</p>
          <div class="value">{{ metric.value }}</div>
          <small class="trend">{{ metric.trend }} · {{ period() }}</small>
        </a>
      }
    </section>

    <section class="dashboard-grid">
      <article class="panel list-panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Priority</p>
            <h2>Items in queue</h2>
          </div>
          <div class="chips">
            @for (item of queues; track item) {
              <button type="button" class="chip" [class.active]="queueFilter() === item" (click)="queueFilter.set(item)">{{ item }}</button>
            }
          </div>
        </div>
        <div class="list-head queue-grid">
          <span>ID</span>
          <span>Item</span>
          <span>Queue</span>
          <span>Owner</span>
          <span>SLA</span>
          <span>Risk</span>
        </div>
        @for (item of filteredQueue(); track item.id) {
          <button type="button" class="list-row queue-grid selectable" [class.selected]="selectedId() === item.id" (click)="selectedId.set(item.id)">
            <strong>{{ item.id }}</strong>
            <span class="copy"><strong>{{ item.title }}</strong><small>{{ item.detail }}</small></span>
            <span>{{ item.queue }}</span>
            <span>{{ item.assignee }}</span>
            <span class="muted">{{ item.sla }}</span>
            <span class="status" [class]="item.tone">{{ item.severity }}</span>
          </button>
        }
        @if (filteredQueue().length === 0) {
          <p class="empty">Nothing waiting in this queue.</p>
        }
        <div class="inline-actions" style="margin: 0.75rem 0 0.35rem">
          <button type="button" class="primary" (click)="act('taken')">Assign to me</button>
          <button type="button" class="secondary" (click)="act('approved')">Approve</button>
          <button type="button" class="secondary" (click)="act('rejected')">Reject</button>
          <button type="button" class="secondary" (click)="act('escalated')">Escalate</button>
        </div>
      </article>

      <article class="panel coverage-panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">SLA</p>
            <h2>On-time reviews</h2>
          </div>
          <span class="coverage-icon material-symbols-outlined">speed</span>
        </div>
        <div class="coverage-score"><strong>{{ coverageWhole }}</strong><span>%</span></div>
        <div class="meter"><span [style.width]="config.coverage.score"></span></div>
        <div class="coverage-details">
          <div><span>Median handle</span><strong>{{ config.coverage.median }}</strong></div>
          <div><span>Breaches today</span><strong>{{ config.coverage.breaches }}</strong></div>
          <div><span>Dual-review hold</span><strong>{{ config.coverage.dualHold }}</strong></div>
        </div>
      </article>
    </section>

    <section class="trio">
      <article class="panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Backlog</p>
            <h2>Aging</h2>
          </div>
        </div>
        <div class="aging-grid">
          @for (item of config.aging; track item.label) {
            <div class="aging-card">
              <p>{{ item.label }}</p>
              <strong>{{ item.value }}</strong>
              <span class="status" [class]="item.tone">{{ agingLabel(item.tone) }}</span>
            </div>
          }
        </div>
      </article>

      <article class="panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Throughput</p>
            <h2>Reviews by hour</h2>
          </div>
        </div>
        <div class="hours">
          @for (item of config.hourly; track item.hour) {
            <div class="hour">
              <span class="hour-bar"><i [style.height.%]="barHeight(item.reviews)"></i></span>
              <small>{{ item.hour }}</small>
            </div>
          }
        </div>
      </article>

      <article class="panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Coverage</p>
            <h2>Shift board</h2>
          </div>
        </div>
        <ul class="people">
          @for (person of config.rotation; track person.name) {
            <li>
              <span class="avatar">{{ initials(person.name) }}</span>
              <div class="copy">
                <strong>{{ person.name }}</strong>
                <small>{{ person.slot }}</small>
              </div>
              <span class="status" [class]="person.role === 'Primary' ? 'rose' : person.role === 'Backup' ? 'warn' : 'info'">{{ person.role }}</span>
            </li>
          }
        </ul>
      </article>
    </section>

    <section class="dashboard-grid">
      <article class="panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Live</p>
            <h2>{{ config.activityTitle }}</h2>
          </div>
          <a class="text-action" routerLink="/assignments">All items <span class="material-symbols-outlined">arrow_forward</span></a>
        </div>
        <div class="rows">
          @for (entry of config.activity; track entry.title) {
            <a class="row" [routerLink]="entry.path">
              <span class="status-icon material-symbols-outlined" [class]="entry.tone">
                {{ statusIcon(entry.tone) }}
              </span>
              <div class="copy">
                <strong>{{ entry.title }}</strong>
                <small>{{ entry.detail }} · {{ entry.time }}</small>
              </div>
              <span class="status" [class]="entry.tone">{{ entry.status }}</span>
            </a>
          }
        </div>
      </article>

      <article class="panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Mix</p>
            <h2>Queue volume</h2>
          </div>
        </div>
        <div class="mix">
          @for (item of config.queues; track item.label) {
            <div>
              <div class="mix-label"><span>{{ item.label }}</span><strong>{{ item.value }}%</strong></div>
              <div class="mix-track"><span [style.width.%]="item.value"></span></div>
            </div>
          }
        </div>
      </article>
    </section>

    <section class="dashboard-grid">
      <article class="panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Desk</p>
            <h2>Reviewers</h2>
          </div>
        </div>
        <ul class="people">
          @for (person of config.reviewers; track person.name) {
            <li>
              <span class="avatar">{{ initials(person.name) }}</span>
              <div class="copy">
                <strong>{{ person.name }}</strong>
                <small>{{ person.focus }} · {{ person.load }}</small>
              </div>
              <em>{{ person.score }}</em>
            </li>
          }
        </ul>
      </article>

      <article class="panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Watch</p>
            <h2>Needs attention</h2>
          </div>
          <a class="text-action" routerLink="/assignments">Queue</a>
        </div>
        <div class="rows">
          @for (item of config.watchlist; track item.label) {
            <div class="row">
              <div class="copy">
                <strong>{{ item.label }}</strong>
                <small>{{ item.detail }}</small>
              </div>
              <span class="status" [class]="item.risk === 'High' ? 'rose' : 'warn'">{{ item.risk }}</span>
            </div>
          }
        </div>
      </article>
    </section>

    <section class="dashboard-grid">
      <article class="panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Today</p>
            <h2>Audit</h2>
          </div>
          <a class="text-action" routerLink="/audit">Full log</a>
        </div>
        <div class="rows">
          @for (item of recentAudit; track item.time + item.action) {
            <div class="row">
              <span class="agenda-time">{{ item.time }}</span>
              <div class="copy">
                <strong>{{ item.actor }}</strong>
                <small>{{ item.action }}</small>
              </div>
            </div>
          }
        </div>
      </article>

      <article class="panel attention-panel" style="margin-top:0">
        <div>
          <p class="eyebrow">Calibration</p>
          <h2>August cycle is live</h2>
          <p>Jordan Poluru published rater guidelines. Dual-review stays on for Safety items from Kavya Poluru.</p>
        </div>
        <a class="secondary" routerLink="/calibration">View calibration</a>
      </article>
    </section>
  `
})
export class QueuePageComponent {
  protected readonly config = templateConfig;
  protected readonly initials = initials;
  protected readonly statusIcon = statusIcon;
  protected readonly agingLabel = agingLabel;
  protected readonly periods = ['Today', '7d', '30d'] as const;
  protected readonly queues = ['All', 'Safety', 'PII', 'Appeals', 'Quality'] as const;
  protected readonly period = signal<(typeof this.periods)[number]>('Today');
  protected readonly queueFilter = signal<(typeof this.queues)[number]>('All');
  protected readonly selectedId = signal(templateConfig.queue[0].id);
  protected readonly notice = signal('');
  protected readonly items = signal<QueueItem[]>(templateConfig.queue.map((item) => ({ ...item })));
  protected readonly recentAudit = templateConfig.audit.slice(0, 4);
  protected readonly coverageWhole = templateConfig.coverage.score.replace('%', '');

  protected readonly visibleMetrics = computed(() => this.config.metricsByPeriod[this.period()]);

  protected readonly filteredQueue = computed(() => {
    const queue = this.queueFilter();
    return this.items().filter((item) => !item.done && (queue === 'All' || item.queue === queue));
  });

  protected barHeight(reviews: number): number {
    const max = Math.max(...this.config.hourly.map((item) => item.reviews));
    return Math.round((reviews / max) * 100);
  }

  protected takeNext(): void {
    const next = this.items().find((item) => item.assignee === 'Unassigned' && !item.done);
    if (!next) {
      this.notice.set('No unassigned items in the queue.');
      return;
    }
    this.selectedId.set(next.id);
    this.act('taken');
  }

  protected act(kind: 'taken' | 'approved' | 'rejected' | 'escalated'): void {
    const id = this.selectedId();
    const item = this.items().find((row) => row.id === id);
    if (!item) {
      return;
    }

    if (kind === 'taken') {
      this.items.update((list) =>
        list.map((row) => (row.id === id ? { ...row, assignee: 'Aisha Poluru' } : row))
      );
      this.notice.set(`${id} assigned to Aisha Poluru.`);
      return;
    }

    this.items.update((list) => list.map((row) => (row.id === id ? { ...row, done: true } : row)));
    const leftover = this.filteredQueue()[0];
    this.selectedId.set(leftover?.id ?? '');
    if (kind === 'approved') {
      this.notice.set(`${id} approved. Maya Poluru will see it in audit.`);
      return;
    }
    if (kind === 'rejected') {
      this.notice.set(`${id} rejected. A note is required before close.`);
      return;
    }
    this.notice.set(`${id} escalated to Sahana Poluru for dual review.`);
  }
}
