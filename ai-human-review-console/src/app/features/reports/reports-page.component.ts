import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { templateConfig } from '../../core/config/template.config';
import type { Tone } from '../../core/config/template.config';

type ReportRow = (typeof templateConfig.reports)[number];

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [RouterLink],
  host: { class: 'page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Operations</p>
        <h1>Reports</h1>
        <p class="summary">Daily digests, SLA packs, and agreement scorecards for Aisha Poluru’s review desk.</p>
      </div>
      <button type="button" class="primary" (click)="generate()">
        <span class="material-symbols-outlined">add</span>
        Generate digest
      </button>
    </section>

    @if (notice()) {
      <p class="notice">{{ notice() }}</p>
    }

    <section class="metrics mini">
      <article class="metric"><p>Ready</p><div class="value">{{ count('Ready') }}</div></article>
      <article class="metric"><p>Draft</p><div class="value">{{ count('Draft') }}</div></article>
      <article class="metric"><p>Filed</p><div class="value">{{ count('Filed') }}</div></article>
      <article class="metric"><p>Findings</p><div class="value">{{ findings() }}</div></article>
    </section>

    <div class="toolbar">
      <div class="chips">
        @for (item of filters; track item) {
          <button type="button" class="chip" [class.active]="filter() === item" (click)="filter.set(item)">{{ item }}</button>
        }
      </div>
    </div>

    <section class="split">
      <article class="panel list-panel">
        @for (item of filtered(); track item.id) {
          <button type="button" class="list-row alert-row selectable" [class.selected]="selectedId() === item.id" (click)="selectedId.set(item.id)">
            <span class="status-icon material-symbols-outlined" [class]="item.tone">description</span>
            <div class="copy">
              <strong>{{ item.title }}</strong>
              <small>{{ item.owner }} · {{ item.period }} · {{ item.findings }} findings</small>
            </div>
            <span class="status" [class]="item.tone">{{ item.status }}</span>
            <small class="muted">{{ item.id }}</small>
          </button>
        }
        @if (filtered().length === 0) {
          <p class="empty">No reports in this status.</p>
        }
      </article>

      @if (selected(); as item) {
        <aside class="panel detail">
          <p class="eyebrow">{{ item.id }} · {{ item.period }}</p>
          <h2>{{ item.title }}</h2>
          <p class="muted">{{ item.summary }}</p>
          <dl class="facts">
            <div><dt>Owner</dt><dd>{{ item.owner }}</dd></div>
            <div><dt>Status</dt><dd>{{ item.status }}</dd></div>
            <div><dt>Findings</dt><dd>{{ item.findings }}</dd></div>
            <div><dt>Window</dt><dd>{{ item.period }}</dd></div>
          </dl>
          <div class="inline-actions">
            <button type="button" class="primary" (click)="file(item.id)">File</button>
            <button type="button" class="secondary" (click)="queue(item.id)">Queue for review</button>
            <a class="secondary" routerLink="/audit">Open audit</a>
          </div>
        </aside>
      }
    </section>

    <section class="dashboard-grid">
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
              <div class="mix-label"><strong>{{ item.label }}</strong><span>{{ item.value }}% of volume</span></div>
              <div class="mix-track"><span [style.width.%]="item.value"></span></div>
            </div>
          }
        </div>
      </article>
      <article class="panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Audit</p>
            <h2>Latest filings</h2>
          </div>
        </div>
        <div class="rows">
          @for (item of config.audit.slice(0, 5); track item.time + item.action) {
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
  `
})
export class ReportsPageComponent {
  protected readonly config = templateConfig;
  protected readonly filters = ['All', 'Ready', 'Draft', 'Queued', 'Filed'] as const;
  protected readonly filter = signal<(typeof this.filters)[number]>('All');
  protected readonly selectedId = signal(templateConfig.reports[0].id);
  protected readonly notice = signal('');
  protected readonly rows = signal<ReportRow[]>(templateConfig.reports.map((item) => ({ ...item })));

  protected readonly filtered = computed(() => {
    const status = this.filter();
    return this.rows().filter((item) => status === 'All' || item.status === status);
  });

  protected readonly selected = computed(
    () => this.filtered().find((item) => item.id === this.selectedId()) ?? this.filtered()[0]
  );

  protected count(status: string): number {
    return this.rows().filter((item) => item.status === status).length;
  }

  protected findings(): number {
    return this.rows().reduce((sum, item) => sum + item.findings, 0);
  }

  protected file(id: string): void {
    this.patch(id, { status: 'Filed', tone: 'info' });
    this.notice.set(`${id} marked Filed. Leadership will receive Aisha Poluru’s pack.`);
  }

  protected queue(id: string): void {
    this.patch(id, { status: 'Queued', tone: 'warn' });
    this.notice.set(`${id} queued for Jordan Poluru.`);
  }

  protected generate(): void {
    const next: ReportRow = {
      id: `RPT-0${42 + this.rows().length}`,
      title: 'On-demand review digest',
      owner: 'Aisha Poluru',
      period: 'Today',
      status: 'Ready',
      tone: 'ok',
      findings: 4,
      summary: 'Generated from the live queue: HR-1101 PII leak and HR-1091 dual-review hold.'
    };
    this.rows.update((list) => [next, ...list]);
    this.selectedId.set(next.id);
    this.filter.set('All');
    this.notice.set(`${next.id} is ready. Review before filing.`);
  }

  private patch(id: string, next: { status: ReportRow['status']; tone: Tone }): void {
    this.rows.update((list) => list.map((item) => (item.id === id ? { ...item, ...next } : item)));
    this.selectedId.set(id);
  }
}
