import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { templateConfig } from '../../core/config/template.config';

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
        <p class="eyebrow">Intelligence</p>
        <h1>Reports</h1>
        <p class="summary">Daily digests, SAR packages, and model memos for Aisha Poluru’s risk desk.</p>
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
            <button type="button" class="primary" (click)="file(item.id)">File SAR</button>
            <button type="button" class="secondary" (click)="queue(item.id)">Queue for review</button>
            <a class="secondary" routerLink="/cases">Open cases</a>
          </div>
        </aside>
      }
    </section>

    <section class="dashboard-grid">
      <article class="panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Models</p>
            <h2>Precision by pack</h2>
          </div>
        </div>
        <div class="mix">
          @for (item of config.channels; track item.label) {
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
            <div class="entry">
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
    this.rows.update((list) =>
      list.map((item) => (item.id === id ? { ...item, status: 'Filed', tone: 'info' } : item))
    );
    this.notice.set(`${id} marked Filed. Treasury will receive Aisha Poluru’s package.`);
  }

  protected queue(id: string): void {
    this.rows.update((list) =>
      list.map((item) => (item.id === id ? { ...item, status: 'Queued', tone: 'warn' } : item))
    );
    this.notice.set(`${id} queued for Jordan Poluru.`);
  }

  protected generate(): void {
    const next: ReportRow = {
      id: `RPT-0${92 + this.rows().length}`,
      title: 'On-demand risk digest',
      owner: 'Aisha Poluru',
      period: 'Today',
      status: 'Ready',
      tone: 'ok',
      findings: 4,
      summary: 'Generated from the live queue: card testing on Leila Poluru and payroll diversion on Omar Poluru.'
    };
    this.rows.update((list) => [next, ...list]);
    this.selectedId.set(next.id);
    this.filter.set('All');
    this.notice.set(`${next.id} is ready. Review before filing.`);
  }
}
