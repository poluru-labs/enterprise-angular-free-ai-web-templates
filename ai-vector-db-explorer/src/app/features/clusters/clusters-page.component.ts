import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  EdsCardComponent,
  EdsCircularProgressComponent,
  EdsProgressBarComponent,
  EdsSkeletonComponent,
  EdsSpinnerComponent,
  EdsStatusComponent,
  EdsTagComponent
} from '@poluru-labs/enterprise-design-system-angular';
import { templateConfig } from '../../core/config/template.config';
import { statusVariant } from '../../shared/utils/status-variant';

@Component({
  selector: 'app-clusters-page',
  standalone: true,
  imports: [
    EdsCardComponent,
    EdsCircularProgressComponent,
    EdsProgressBarComponent,
    EdsSkeletonComponent,
    EdsSpinnerComponent,
    EdsStatusComponent,
    EdsTagComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Neighborhoods</p>
        <h1>Clusters</h1>
        <p class="summary">Cohesion and drift across Lattice indexes.</p>
      </div>
      <eds-spinner size="sm" label="Live" [showLabel]="true"></eds-spinner>
    </section>

    <section class="grid-3">
      @for (row of config.clusters; track row.id) {
        <eds-card class="card-pad collection-card" [elevated]="false">
          <div class="section-head">
            <h3>{{ row.label }}</h3>
            <eds-status [label]="row.status" [variant]="statusVariant(row.status)"></eds-status>
          </div>
          <div class="forecast-hero">
            <eds-circular-progress [value]="Math.round(row.cohesion * 100)" [max]="100" [size]="56" [showValue]="true"></eds-circular-progress>
            <div>
              <p class="meta">{{ row.index }} · {{ row.owner }}</p>
              <p class="meta">{{ row.size.toLocaleString('en-US') }} vectors</p>
            </div>
          </div>
          <p class="meta meta-clamp">{{ row.detail }}</p>
          <eds-progress-bar [value]="Math.round(row.cohesion * 100)" [max]="100" label="Cohesion" [showValue]="true"></eds-progress-bar>
          <div footer class="card-actions">
            <eds-tag [label]="row.index" variant="info"></eds-tag>
          </div>
        </eds-card>
      }
    </section>

    <eds-card class="card-pad" [elevated]="false" style="margin-top: 0.9rem">
      <p class="eyebrow">Rebuild</p>
      <h2>Shadow graph</h2>
      <p class="meta">docs-prod shards 4–6 are still copying into the new HNSW graph.</p>
      <eds-skeleton [lines]="3"></eds-skeleton>
    </eds-card>
  `
})
export class ClustersPageComponent {
  protected readonly config = templateConfig;
  protected readonly statusVariant = statusVariant;
  protected readonly Math = Math;
}
