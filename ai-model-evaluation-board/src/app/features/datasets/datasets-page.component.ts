import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  EdsBadgeComponent,
  EdsButtonComponent,
  EdsCardComponent,
  EdsEmptyStateComponent,
  EdsStatusComponent,
  EdsTagComponent
} from '@poluru-labs/enterprise-design-system-angular';
import { templateConfig } from '../../core/config/template.config';
import { statusVariant } from '../../shared/utils/status-variant';
import { filterDatasets } from '../../shared/utils/eval';

@Component({
  selector: 'app-datasets-page',
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
        <p class="eyebrow">Pinned revisions</p>
        <h1>Datasets</h1>
        <p class="summary">Every evaluation run pins a dataset revision so Ananya Poluru can reproduce last week’s scorecard.</p>
      </div>
      <eds-badge [label]="filtered().length + ' datasets'" variant="brand" [soft]="true" [pill]="true"></eds-badge>
    </section>

    <div class="chips" style="margin-bottom: 0.9rem">
      @for (item of filters; track item) {
        <button type="button" class="chip" [class.active]="status() === item" (click)="status.set(item)">{{ item }}</button>
      }
    </div>

    @if (filtered().length === 0) {
      <eds-empty-state heading="No datasets in this view" description="Show every revision or pin a new gold set." [icon]="true">
        <div actions>
          <eds-button variant="primary" size="sm" (clicked)="status.set('All')">Show all</eds-button>
        </div>
      </eds-empty-state>
    } @else {
      <section class="grid-3">
        @for (dataset of filtered(); track dataset.title) {
          <eds-card class="card-pad collection-card" [elevated]="false">
            <div class="section-head">
              <h3>{{ dataset.title }}</h3>
              <eds-status [label]="dataset.status" [variant]="statusVariant(dataset.status)"></eds-status>
            </div>
            <p class="meta meta-clamp">{{ dataset.detail }}</p>
            <p class="meta">Owner {{ dataset.owner }} · {{ dataset.examples }} examples · {{ dataset.languages }} languages</p>
            <div footer class="card-actions">
              <eds-tag [label]="dataset.revision" variant="brand"></eds-tag>
              <eds-tag
                [label]="dataset.status === 'Restricted' ? 'Restricted access' : 'Open access'"
                variant="info"
              ></eds-tag>
            </div>
          </eds-card>
        }
      </section>
    }
  `
})
export class DatasetsPageComponent {
  protected readonly config = templateConfig;
  protected readonly status = signal('All');
  protected readonly statusVariant = statusVariant;
  protected readonly filters = ['All', 'Ready', 'Restricted', 'Draft'];

  protected readonly filtered = computed(() => filterDatasets(this.config.datasets, '', this.status()));
}
