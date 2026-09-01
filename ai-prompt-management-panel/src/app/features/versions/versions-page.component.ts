import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  EdsBadgeComponent,
  EdsButtonComponent,
  EdsCardComponent,
  EdsEmptyStateComponent,
  EdsStatusComponent,
  EdsTagComponent,
  EdsToolbarComponent
} from '@poluru-labs/enterprise-design-system-angular';
import { templateConfig, type VersionRow } from '../../core/config/template.config';
import { statusVariant } from '../../shared/utils/status-variant';
import { filterVersions } from '../../shared/utils/prompt';

@Component({
  selector: 'app-versions-page',
  standalone: true,
  imports: [
    EdsBadgeComponent,
    EdsButtonComponent,
    EdsCardComponent,
    EdsEmptyStateComponent,
    EdsStatusComponent,
    EdsTagComponent,
    EdsToolbarComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <eds-toolbar [bordered]="false">
      <div edsToolbarStart>
        <p class="eyebrow">History</p>
        <h1>Versions</h1>
      </div>
      <div edsToolbarEnd>
        <eds-badge [label]="liveCount() + ' live'" variant="brand" [soft]="true" [pill]="true"></eds-badge>
      </div>
    </eds-toolbar>

    <p class="summary" style="margin: 0.35rem 0 1rem">Promote a candidate or roll back a live prompt without losing the previous body.</p>

    @if (notice()) {
      <p class="notice">{{ notice() }}</p>
    }

    <div class="chips" style="margin-bottom: 0.9rem">
      @for (item of filters; track item) {
        <button type="button" class="chip" [class.active]="status() === item" (click)="status.set(item)">{{ item }}</button>
      }
    </div>

    @if (filtered().length === 0) {
      <eds-empty-state heading="No versions in this view" description="Show every revision or ship a candidate." [icon]="true">
        <div actions>
          <eds-button variant="primary" size="sm" (clicked)="status.set('All')">Show all</eds-button>
        </div>
      </eds-empty-state>
    } @else {
      <section class="split">
        <eds-card class="card-pad" [elevated]="false">
          @for (item of filtered(); track item.id) {
            <button
              type="button"
              class="alert-row selectable"
              [class.selected]="selectedId() === item.id"
              (click)="selectedId.set(item.id)"
            >
              <div class="copy">
                <strong>{{ item.prompt }} {{ item.version }}</strong>
                <p class="meta">{{ item.id }} · {{ item.success }} · {{ item.shipped }}</p>
              </div>
              <eds-status [label]="item.status" [variant]="statusVariant(item.status)"></eds-status>
            </button>
          }
        </eds-card>

        @if (selected(); as item) {
          <eds-card class="card-pad" [elevated]="false">
            <p class="eyebrow">{{ item.id }} · {{ item.shipped }}</p>
            <h2>{{ item.prompt }} {{ item.version }}</h2>
            <p class="meta">{{ item.notes }}</p>
            <dl class="facts">
              <div>
                <dt>Owner</dt>
                <dd>{{ item.owner }}</dd>
              </div>
              <div>
                <dt>Success</dt>
                <dd>{{ item.success }}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{{ item.status }}</dd>
              </div>
              <div>
                <dt>Shipped</dt>
                <dd>{{ item.shipped }}</dd>
              </div>
            </dl>
            <div class="inline-actions">
              <eds-button variant="primary" size="sm" [disabled]="item.status === 'Live'" (clicked)="promote(item.id)">
                Promote
              </eds-button>
              <eds-button variant="secondary" size="sm" [disabled]="item.status === 'Retired'" (clicked)="rollback(item.id)">
                Roll back
              </eds-button>
              <eds-tag [label]="item.owner" variant="info"></eds-tag>
            </div>
          </eds-card>
        }
      </section>
    }
  `
})
export class VersionsPageComponent {
  protected readonly config = templateConfig;
  protected readonly rows = signal<VersionRow[]>(this.config.versions.map((item) => ({ ...item })));
  protected readonly status = signal('All');
  protected readonly selectedId = signal(this.config.versions[0]?.id ?? '');
  protected readonly notice = signal('');
  protected readonly statusVariant = statusVariant;
  protected readonly filters = ['All', 'Live', 'Candidate', 'Retired'];

  protected readonly filtered = computed(() => filterVersions(this.rows(), '', this.status()));

  protected readonly selected = computed(
    () => this.rows().find((item) => item.id === this.selectedId()) ?? this.filtered()[0]
  );

  protected readonly liveCount = computed(() => this.rows().filter((item) => item.status === 'Live').length);

  protected promote(id: string): void {
    this.rows.update((items) => items.map((item) => (item.id === id ? { ...item, status: 'Live' } : item)));
    this.notice.set(`${id} promoted to live by Priya Poluru.`);
  }

  protected rollback(id: string): void {
    this.rows.update((items) => items.map((item) => (item.id === id ? { ...item, status: 'Retired' } : item)));
    this.notice.set(`${id} rolled back until a candidate ships.`);
  }
}
