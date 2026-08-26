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
      <a class="primary" routerLink="/alerts">
        <span class="material-symbols-outlined">policy</span>
        {{ config.action }}
      </a>
    </section>

    <section class="metrics">
      @for (metric of config.metrics; track metric.label; let index = $index) {
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
          <small class="trend">{{ metric.trend }} this week</small>
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
            <a class="row" [routerLink]="entry.path">
              <span class="status-icon material-symbols-outlined" [class]="entry.tone">
                {{ entry.tone === 'ok' ? 'check_circle' : entry.tone === 'warn' ? 'error' : entry.tone === 'rose' ? 'block' : 'info' }}
              </span>
              <div class="copy">
                <strong>{{ entry.title }}</strong>
                <small>{{ entry.detail }}</small>
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
        <div class="coverage-score"><strong>97</strong><span>.1%</span></div>
        <div class="meter"><span></span></div>
        <div class="coverage-details">
          <div><span>Blocked this week</span><strong>186</strong></div>
          <div><span>False positives</span><strong>2.9%</strong></div>
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
                <small>{{ person.load }} · {{ person.focus }}</small>
              </div>
              <em>{{ person.score }}</em>
            </li>
          }
        </ul>
      </article>

      <article class="panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Open</p>
            <h2>Priority cases</h2>
          </div>
          <a class="text-action" routerLink="/cases">All cases <span class="material-symbols-outlined">arrow_forward</span></a>
        </div>
        <div class="rows">
          @for (item of config.cases.slice(0, 4); track item.id) {
            <a class="row" routerLink="/cases">
              <div class="copy">
                <strong>{{ item.id }} · {{ item.subject }}</strong>
                <small>{{ item.type }} · {{ item.owner }}</small>
              </div>
              <span>{{ item.amount }}</span>
              <span class="status" [class]="item.tone">{{ item.status }}</span>
            </a>
          }
        </div>
      </article>
    </section>

    <section class="panel attention-panel">
      <div>
        <p class="eyebrow">Needs attention</p>
        <h2>Leila Poluru is testing cards</h2>
        <p>11 attempts in four minutes. Aisha Poluru can auto-block the BIN from the alert queue.</p>
      </div>
      <a class="secondary" routerLink="/alerts">
        <span class="material-symbols-outlined">visibility</span>
        Open alert
      </a>
    </section>
  `
})
export class DashboardComponent {
  protected readonly config = templateConfig;

  protected initials(name: string): string {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2);
  }
}
