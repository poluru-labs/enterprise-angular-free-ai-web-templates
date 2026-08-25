import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { templateConfig } from '../template.config';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">{{ config.eyebrow }}</p>
        <h1>{{ config.title }}</h1>
        <p class="summary">{{ config.summary }}</p>
      </div>
      <a class="primary" routerLink="/deploy">
        <span class="material-symbols-outlined">rocket_launch</span>
        {{ config.action }}
      </a>
    </section>

    <section class="metrics">
      @for (metric of config.metrics; track metric.label; let index = $index) {
        <a class="metric" [routerLink]="metric.path">
          <div class="metric-top">
            <span class="metric-icon material-symbols-outlined" [class.amber]="index === 1" [class.rose]="index === 2" [class.blue]="index === 3">{{ metric.icon }}</span>
            <span class="icon-button" aria-hidden="true"><span class="material-symbols-outlined">chevron_right</span></span>
          </div>
          <p>{{ metric.label }}</p>
          <div class="value">{{ metric.value }}</div>
          <small class="trend"><span class="material-symbols-outlined">trending_up</span>{{ metric.trend }} <em>vs. last week</em></small>
        </a>
      }
    </section>

    <section class="dashboard-grid">
      <article class="panel run-panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Live activity</p>
            <h2>{{ config.activityTitle }}</h2>
          </div>
          <a class="text-action" routerLink="/runs">All runs <span class="material-symbols-outlined">arrow_forward</span></a>
        </div>
        <div class="rows">
          @for (entry of config.activity; track entry.title) {
            <a class="row" [routerLink]="entry.path">
              <span class="status-icon material-symbols-outlined" [class.warn]="entry.tone === 'warn'">{{ entry.tone === 'warn' ? 'error' : 'check_circle' }}</span>
              <div class="copy">
                <strong>{{ entry.title }}</strong>
                <small>{{ entry.detail }}</small>
              </div>
              <span class="status" [class]="entry.tone">{{ entry.status }}</span>
              <span class="icon-button" aria-hidden="true"><span class="material-symbols-outlined">chevron_right</span></span>
            </a>
          }
        </div>
      </article>

      <article class="panel coverage-panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Fleet coverage</p>
            <h2>Healthy agent capacity</h2>
          </div>
          <span class="material-symbols-outlined coverage-icon">monitoring</span>
        </div>
        <div class="coverage-score"><strong>96</strong><span>/100</span></div>
        <div class="meter"><span></span></div>
        <div class="coverage-details">
          <div><span>Available capacity</span><strong>78%</strong></div>
          <div><span>Tool reliability</span><strong>99.1%</strong></div>
        </div>
      </article>
    </section>

    <section class="panel attention-panel">
      <div>
        <p class="eyebrow">Needs attention</p>
        <h2>2 handoffs are waiting for you</h2>
        <p>A research agent needs approval before it can call an external search tool.</p>
      </div>
      <a class="secondary" routerLink="/handoffs">
        <span class="material-symbols-outlined">visibility</span>
        Review request
      </a>
    </section>
  `
})
export class DashboardComponent {
  protected readonly config = templateConfig;
}
