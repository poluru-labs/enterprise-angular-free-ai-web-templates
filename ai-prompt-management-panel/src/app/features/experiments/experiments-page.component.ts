import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  EdsBadgeComponent,
  EdsButtonComponent,
  EdsCardComponent,
  EdsEmptyStateComponent,
  EdsStatusComponent,
  EdsTagComponent
} from '@poluru-labs/enterprise-design-system-angular';
import { templateConfig, type ExperimentRow } from '../../core/config/template.config';
import { statusVariant } from '../../shared/utils/status-variant';
import { filterExperiments } from '../../shared/utils/prompt';

@Component({
  selector: 'app-experiments-page',
  standalone: true,
  imports: [
    EdsBadgeComponent,
    EdsButtonComponent,
    EdsCardComponent,
    EdsEmptyStateComponent,
    EdsStatusComponent,
    EdsTagComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Traffic splits</p>
        <h1>Experiments</h1>
        <p class="summary">Compare control and challenger prompts before Priya Poluru promotes a winner to live.</p>
      </div>
      <eds-badge [label]="runningCount() + ' running'" variant="brand" [soft]="true" [pill]="true"></eds-badge>
    </section>

    @if (notice()) {
      <p class="notice">{{ notice() }}</p>
    }

    <div class="chips" style="margin-bottom: 0.9rem">
      @for (item of filters; track item) {
        <button type="button" class="chip" [class.active]="status() === item" (click)="status.set(item)">{{ item }}</button>
      }
    </div>

    @if (filtered().length === 0) {
      <eds-empty-state heading="No experiments in this view" description="Show every split or start a new challenger." [icon]="true">
        <div actions>
          <eds-button variant="primary" size="sm" (clicked)="status.set('All')">Show all</eds-button>
        </div>
      </eds-empty-state>
    } @else {
      <section class="grid-3">
        @for (item of filtered(); track item.id) {
          <eds-card
            class="card-pad collection-card"
            [class.selected-card]="selectedId() === item.id"
            [elevated]="false"
            (click)="selectedId.set(item.id)"
          >
            <div class="section-head">
              <h3>{{ item.name }}</h3>
              <eds-status [label]="item.status" [variant]="statusVariant(item.status)"></eds-status>
            </div>
            <p class="meta meta-clamp">{{ item.detail }}</p>
            <p class="meta">{{ item.id }} · {{ item.control }} vs {{ item.challenger }} · {{ item.traffic }} traffic</p>
            <div footer class="card-actions">
              <eds-tag [label]="item.lift" variant="brand"></eds-tag>
              <eds-tag [label]="item.owner" variant="info"></eds-tag>
              @if (item.status !== 'Winner') {
                <eds-button variant="primary" size="sm" (clicked)="declareWinner(item.id); $event.stopPropagation()">
                  Declare winner
                </eds-button>
              }
            </div>
          </eds-card>
        }
      </section>
    }
  `
})
export class ExperimentsPageComponent {
  protected readonly config = templateConfig;
  protected readonly rows = signal<ExperimentRow[]>(this.config.experiments.map((item) => ({ ...item })));
  protected readonly status = signal('All');
  protected readonly selectedId = signal(this.config.experiments[0]?.id ?? '');
  protected readonly notice = signal('');
  protected readonly statusVariant = statusVariant;
  protected readonly filters = ['All', 'Running', 'Winner', 'Paused'];

  protected readonly filtered = computed(() => filterExperiments(this.rows(), '', this.status()));

  protected readonly runningCount = computed(
    () => this.rows().filter((item) => item.status === 'Running').length
  );

  protected declareWinner(id: string): void {
    this.rows.update((items) =>
      items.map((item) => (item.id === id ? { ...item, status: 'Winner' } : item))
    );
    this.notice.set(`${id} marked as winner for Priya Poluru.`);
  }
}
