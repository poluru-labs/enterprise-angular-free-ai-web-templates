import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  EdsBadgeComponent,
  EdsButtonComponent,
  EdsCardComponent,
  EdsStatusComponent,
  EdsTimelineComponent,
  type EdsTimelineItem
} from '@poluru-labs/enterprise-design-system-angular';
import { templateConfig, type ScorecardRow } from '../../core/config/template.config';
import { statusVariant } from '../../shared/utils/status-variant';

@Component({
  selector: 'app-scorecards-page',
  standalone: true,
  imports: [EdsBadgeComponent, EdsButtonComponent, EdsCardComponent, EdsStatusComponent, EdsTimelineComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Release council</p>
        <h1>Scorecards</h1>
        <p class="summary">Sign off a checkpoint only after required suites clear baseline. Blocked cards stay off the release train.</p>
      </div>
      <eds-badge [label]="rows().length + ' scorecards'" variant="brand" [soft]="true"></eds-badge>
    </section>

    @if (notice()) {
      <p class="notice">{{ notice() }}</p>
    }

    <section class="split">
      <eds-card class="card-pad" [elevated]="false">
        <div class="section-head">
          <h2>This week</h2>
          <eds-badge [label]="signedCount() + ' signed'" variant="success" [soft]="true" [pill]="true"></eds-badge>
        </div>
        <eds-timeline [items]="timelineItems()"></eds-timeline>
      </eds-card>

      <div class="stack">
        @for (card of rows(); track card.id) {
          <eds-card class="card-pad" [elevated]="false">
            <div class="section-head">
              <div>
                <p class="eyebrow">{{ card.id }} · {{ card.day }}</p>
                <h3>{{ card.model }}</h3>
              </div>
              <eds-status [label]="card.status" [variant]="statusVariant(card.status)"></eds-status>
            </div>
            <p class="meta">{{ card.item }}</p>
            <div class="inline-actions" style="margin-top: 0.85rem">
              <eds-button variant="primary" size="sm" [disabled]="card.status === 'Signed off' || card.status === 'Blocked'" (clicked)="signOff(card.id)">
                Sign off
              </eds-button>
              <eds-button variant="secondary" size="sm" [disabled]="card.status === 'Blocked'" (clicked)="block(card.id)">
                Block
              </eds-button>
            </div>
          </eds-card>
        }
      </div>
    </section>
  `
})
export class ScorecardsPageComponent {
  protected readonly config = templateConfig;
  protected readonly rows = signal<ScorecardRow[]>(this.config.scorecards.map((item) => ({ ...item })));
  protected readonly notice = signal('');
  protected readonly statusVariant = statusVariant;

  protected readonly signedCount = computed(() => this.rows().filter((item) => item.status === 'Signed off').length);

  protected readonly timelineItems = computed<EdsTimelineItem[]>(() =>
    this.rows().map((entry, index) => ({
      title: entry.item,
      description: `${entry.day} · ${entry.status}`,
      status: entry.status === 'Signed off' ? 'complete' : index === 0 ? 'current' : 'upcoming'
    }))
  );

  protected signOff(id: string): void {
    this.rows.update((items) =>
      items.map((item) => (item.id === id ? { ...item, status: 'Signed off' } : item))
    );
    this.notice.set(`${id} signed off by Ananya Poluru.`);
  }

  protected block(id: string): void {
    this.rows.update((items) => items.map((item) => (item.id === id ? { ...item, status: 'Blocked' } : item)));
    this.notice.set(`${id} blocked until regressions clear.`);
  }
}
