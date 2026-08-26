import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
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
            <p class="eyebrow">Watchlist</p>
            <h2>Entities to block</h2>
          </div>
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
            <p class="eyebrow">Audit</p>
            <h2>Latest actions</h2>
          </div>
        </div>
        <div class="rows">
          @for (item of config.audit; track item.time) {
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
    </section>

    <section class="panel attention-panel">
      <div>
        <p class="eyebrow">Needs attention</p>
        <h2>Leila Poluru is testing cards</h2>
        <p>11 attempts in four minutes. Aisha Poluru can auto-block BIN 414720 from the alert queue.</p>
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
  protected readonly periods = ['Today', '7d', '30d'] as const;
  protected readonly period = signal<(typeof this.periods)[number]>('7d');

  protected initials(name: string): string {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2);
  }
}
