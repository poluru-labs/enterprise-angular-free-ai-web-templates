import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { templateConfig } from '../../core/config/template.config';
import { initials } from '../../shared/utils/initials';

@Component({
  selector: 'app-dashboard-page',
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
        <a class="primary" routerLink="/alerts">
          <span class="material-symbols-outlined">policy</span>
          {{ config.action }}
        </a>
      </div>
    </section>

    <section class="oncall">
      <span class="pulse"></span>
      <strong>On call</strong>
      <span>{{ config.onCall.primary }} · backup {{ config.onCall.backup }} · until {{ config.onCall.until }}</span>
    </section>

    <section class="metrics">
      @for (metric of visibleMetrics(); track metric.label; let index = $index) {
        <a class="metric" [routerLink]="metric.path">
          <div class="metric-top">
            <span
              class="metric-icon material-symbols-outlined"
              [class.amber]="index === 1"
              [class.rose]="index === 2"
              [class.blue]="index === 3"
            >{{ metric.icon }}</span>
          </div>
          <p>{{ metric.label }}</p>
          <div class="value">{{ metric.value }}</div>
          <small class="trend">{{ metric.trend }} · {{ period() }}</small>
        </a>
      }
    </section>

    <section class="dashboard-grid">
      <article class="panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Live</p>
            <h2>{{ config.activityTitle }}</h2>
          </div>
          <a class="text-action" routerLink="/alerts">All alerts <span class="material-symbols-outlined">arrow_forward</span></a>
        </div>
        <div class="rows">
          @for (entry of config.activity; track entry.title) {
            <a class="entry" [routerLink]="entry.path">
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

      <article class="panel coverage-panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Coverage</p>
            <h2>Model precision</h2>
          </div>
          <span class="material-symbols-outlined coverage-icon">security</span>
        </div>
        <div class="coverage-score"><strong>{{ coverageWhole }}</strong><span>{{ coverageFraction }}</span></div>
        <div class="meter"><span [style.width]="config.coverage.score"></span></div>
        <div class="coverage-details">
          <div><span>Blocked this week</span><strong>{{ config.coverage.blocked }}</strong></div>
          <div><span>False positives</span><strong>{{ config.coverage.falsePositives }}</strong></div>
        </div>
        <div class="mix compact">
          @for (item of config.channels; track item.label) {
            <div>
              <div class="mix-label"><strong>{{ item.label }}</strong><span>{{ item.value }}%</span></div>
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
            <p class="eyebrow">Queue</p>
            <h2>Investigators</h2>
          </div>
        </div>
        <ul class="people">
          @for (person of config.investigators; track person.name) {
            <li>
              <span class="avatar">{{ initials(person.name) }}</span>
              <div class="copy">
                <strong>{{ person.name }}</strong>
                <small>{{ person.load }} · {{ person.focus }} · {{ person.shift }}</small>
              </div>
              <em>{{ person.score }}</em>
            </li>
          }
        </ul>
      </article>

      <article class="panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Watchlist</p>
            <h2>Entities to block</h2>
          </div>
          <a class="text-action" routerLink="/watchlist">All entities <span class="material-symbols-outlined">arrow_forward</span></a>
        </div>
        <div class="rows">
          @for (item of config.watchlist.slice(0, 4); track item.id) {
            <a class="entry" routerLink="/watchlist">
              <div class="copy">
                <strong>{{ item.label }}</strong>
                <small>{{ item.detail }} · {{ item.status }}</small>
              </div>
              <span class="status" [class]="item.risk === 'High' ? 'rose' : 'warn'">{{ item.risk }}</span>
            </a>
          }
        </div>
      </article>
    </section>

    <section class="dashboard-grid">
      <article class="panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Open</p>
            <h2>Priority cases</h2>
          </div>
          <a class="text-action" routerLink="/cases">All cases <span class="material-symbols-outlined">arrow_forward</span></a>
        </div>
        <div class="rows">
          @for (item of priorityCases; track item.id) {
            <a class="entry" routerLink="/cases">
              <div class="copy">
                <strong>{{ item.id }} · {{ item.subject }}</strong>
                <small>{{ item.type }} · {{ item.owner }} · aging {{ item.aging }}</small>
              </div>
              <span>{{ item.amount }}</span>
              <span class="status" [class]="item.tone">{{ item.status }}</span>
            </a>
          }
        </div>
      </article>

      <article class="panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Models</p>
            <h2>Drift watch</h2>
          </div>
          <a class="text-action" routerLink="/reports">Reports <span class="material-symbols-outlined">arrow_forward</span></a>
        </div>
        <div class="rows">
          @for (model of config.models; track model.name) {
            <div class="entry">
              <div class="copy">
                <strong>{{ model.name }}</strong>
                <small>{{ model.owner }} · AUC {{ model.auc }}</small>
              </div>
              <span class="status" [class]="model.drift === 'Watch' ? 'warn' : 'ok'">{{ model.drift }}</span>
            </div>
          }
        </div>
      </article>
    </section>

    <section class="panel attention-panel">
      <div>
        <p class="eyebrow">Needs attention</p>
        <h2>Leila Poluru is testing cards</h2>
        <p>11 attempts in four minutes. Aisha Poluru can auto-block BIN 414720 from the alert queue or freeze it on the watchlist.</p>
      </div>
      <div class="head-actions">
        <a class="secondary" routerLink="/watchlist">
          <span class="material-symbols-outlined">visibility</span>
          Open watchlist
        </a>
        <a class="secondary" routerLink="/alerts">
          <span class="material-symbols-outlined">visibility</span>
          Open alert
        </a>
      </div>
    </section>
  `
})
export class DashboardPageComponent {
  protected readonly config = templateConfig;
  protected readonly periods = ['Today', '7d', '30d'] as const;
  protected readonly period = signal<(typeof this.periods)[number]>('7d');
  protected readonly initials = initials;
  protected readonly priorityCases = this.config.cases.slice(0, 4);
  protected readonly coverageWhole = this.config.coverage.score.slice(0, this.config.coverage.score.indexOf('.'));
  protected readonly coverageFraction = this.config.coverage.score.slice(this.config.coverage.score.indexOf('.'));

  protected readonly visibleMetrics = computed(() => this.config.metricsByPeriod[this.period()]);

  protected statusIcon(tone: string): string {
    if (tone === 'ok') {
      return 'check_circle';
    }
    if (tone === 'warn') {
      return 'error';
    }
    if (tone === 'rose') {
      return 'block';
    }
    return 'info';
  }
}
