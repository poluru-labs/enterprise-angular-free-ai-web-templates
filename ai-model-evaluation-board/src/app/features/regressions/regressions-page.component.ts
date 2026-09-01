import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  EdsBadgeComponent,
  EdsButtonComponent,
  EdsCardComponent,
  EdsEmptyStateComponent,
  EdsStatusComponent
} from '@poluru-labs/enterprise-design-system-angular';
import { templateConfig, type RegressionRow } from '../../core/config/template.config';
import { statusVariant } from '../../shared/utils/status-variant';

type RegressionFilter = 'All' | RegressionRow['severity'] | RegressionRow['status'];

@Component({
  selector: 'app-regressions-page',
  standalone: true,
  imports: [
    RouterLink,
    EdsBadgeComponent,
    EdsButtonComponent,
    EdsCardComponent,
    EdsEmptyStateComponent,
    EdsStatusComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Watchtower</p>
        <h1>Regressions</h1>
        <p class="summary">Score drops against the last signed baseline. Ananya Poluru’s board cannot ship while critical items stay open.</p>
      </div>
      <eds-badge [label]="openCount() + ' open'" variant="warning" [soft]="true" [pill]="true"></eds-badge>
    </section>

    @if (notice()) {
      <p class="notice">{{ notice() }}</p>
    }

    <section class="grid-4">
      <eds-card class="card-pad" [elevated]="false">
        <p class="eyebrow">Open</p>
        <h2>{{ openCount() }}</h2>
      </eds-card>
      <eds-card class="card-pad" [elevated]="false">
        <p class="eyebrow">Acknowledged</p>
        <h2>{{ count('Acknowledged') }}</h2>
      </eds-card>
      <eds-card class="card-pad" [elevated]="false">
        <p class="eyebrow">Snoozed</p>
        <h2>{{ count('Snoozed') }}</h2>
      </eds-card>
      <eds-card class="card-pad" [elevated]="false">
        <p class="eyebrow">Critical</p>
        <h2>{{ criticalCount() }}</h2>
      </eds-card>
    </section>

    <div class="chips" style="margin: 0.9rem 0">
      @for (item of filters; track item) {
        <button type="button" class="chip" [class.active]="filter() === item" (click)="filter.set(item)">{{ item }}</button>
      }
    </div>

    <section class="split">
      <eds-card class="card-pad" [elevated]="false">
        @if (filtered().length === 0) {
          <eds-empty-state heading="No regressions in this view" description="Clear the filter or wait for the next suite battery." [icon]="true">
            <div actions>
              <eds-button variant="primary" size="sm" (clicked)="filter.set('All')">Show all</eds-button>
            </div>
          </eds-empty-state>
        } @else {
          @for (item of filtered(); track item.id) {
            <button
              type="button"
              class="alert-row selectable"
              [class.selected]="selectedId() === item.id"
              (click)="selectedId.set(item.id)"
            >
              <div class="copy">
                <strong>{{ item.suite }}</strong>
                <p class="meta">{{ item.id }} · {{ item.model }} · {{ item.delta }}</p>
              </div>
              <eds-status [label]="item.status" [variant]="statusVariant(item.status)"></eds-status>
            </button>
          }
        }
      </eds-card>

      @if (selected(); as item) {
        <eds-card class="card-pad" [elevated]="false">
          <p class="eyebrow">{{ item.id }} · {{ item.time }}</p>
          <h2>{{ item.suite }}</h2>
          <p class="meta">{{ item.detail }}</p>
          <dl class="facts">
            <div>
              <dt>Owner</dt>
              <dd>{{ item.owner }}</dd>
            </div>
            <div>
              <dt>Model</dt>
              <dd>{{ item.model }}</dd>
            </div>
            <div>
              <dt>Delta</dt>
              <dd>{{ item.delta }}</dd>
            </div>
            <div>
              <dt>Severity</dt>
              <dd>{{ item.severity }}</dd>
            </div>
          </dl>
          <div class="inline-actions">
            <eds-button variant="primary" size="sm" (clicked)="acknowledge(item.id)">Acknowledge</eds-button>
            <eds-button variant="secondary" size="sm" (clicked)="snooze(item.id)">Snooze</eds-button>
            <a class="chip" routerLink="/scorecards">Open scorecards</a>
          </div>
        </eds-card>
      }
    </section>
  `
})
export class RegressionsPageComponent {
  protected readonly config = templateConfig;
  protected readonly rows = signal<RegressionRow[]>(this.config.regressions.map((item) => ({ ...item })));
  protected readonly filter = signal<RegressionFilter>('All');
  protected readonly selectedId = signal(this.config.regressions[0]?.id ?? '');
  protected readonly notice = signal('');
  protected readonly statusVariant = statusVariant;
  protected readonly filters: RegressionFilter[] = ['All', 'Critical', 'High', 'Watch', 'Open', 'Acknowledged', 'Snoozed'];

  protected readonly filtered = computed(() => {
    const current = this.filter();
    return this.rows().filter((item) => current === 'All' || item.severity === current || item.status === current);
  });

  protected readonly selected = computed(
    () => this.rows().find((item) => item.id === this.selectedId()) ?? this.filtered()[0]
  );

  protected readonly openCount = computed(() => this.count('Open'));

  protected readonly criticalCount = computed(
    () => this.rows().filter((item) => item.severity === 'Critical' && item.status === 'Open').length
  );

  protected count(status: RegressionRow['status']): number {
    return this.rows().filter((item) => item.status === status).length;
  }

  protected acknowledge(id: string): void {
    this.patch(id, 'Acknowledged', `Acknowledged ${id} for Ananya Poluru.`);
  }

  protected snooze(id: string): void {
    this.patch(id, 'Snoozed', `Snoozed ${id} until the next suite battery.`);
  }

  private patch(id: string, status: RegressionRow['status'], message: string): void {
    this.rows.update((items) => items.map((item) => (item.id === id ? { ...item, status } : item)));
    this.notice.set(message);
  }
}
