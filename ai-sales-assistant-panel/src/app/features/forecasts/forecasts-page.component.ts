import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  EdsBadgeComponent,
  EdsCardComponent,
  EdsMeterComponent,
  EdsStatusComponent,
  EdsTagComponent
} from '@poluru-labs/enterprise-design-system-angular';
import { templateConfig } from '../../core/config/template.config';
import { statusVariant } from '../../shared/utils/status-variant';
import { coverageLabel } from '../../shared/utils/sales';

@Component({
  selector: 'app-forecasts-page',
  standalone: true,
  imports: [EdsBadgeComponent, EdsCardComponent, EdsMeterComponent, EdsStatusComponent, EdsTagComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Coverage</p>
        <h1>Forecasts</h1>
        <p class="summary">Commit, upside, and at-risk books for Ananya Poluru’s enterprise forecast. Coverage bar is 1.2x.</p>
      </div>
      <eds-badge [label]="visible().length + ' books'" variant="brand" [soft]="true" [pill]="true"></eds-badge>
    </section>

    <div class="chips" style="margin-bottom: 0.9rem">
      @for (item of filters; track item) {
        <button type="button" class="chip" [class.active]="filter() === item" (click)="filter.set(item)">{{ item }}</button>
      }
    </div>

    <section class="grid-3">
      @for (item of visible(); track item.name) {
        <eds-card class="card-pad collection-card" [elevated]="false">
          <div class="section-head">
            <h3>{{ item.name }}</h3>
            <eds-status [label]="item.status" [variant]="statusVariant(item.status)"></eds-status>
          </div>
          <p class="meta meta-clamp">{{ item.detail }}</p>
          <p class="meta">Commit {{ item.commit }} · Upside {{ item.upside }}</p>
          <p class="meta">{{ item.owner }}</p>
          <eds-meter [value]="item.coverage" [max]="100" [label]="item.name" [showValue]="true"></eds-meter>
          <div footer class="card-actions">
            <eds-tag [label]="coverageLabel(item)" variant="brand"></eds-tag>
          </div>
        </eds-card>
      }
    </section>
  `
})
export class ForecastsPageComponent {
  protected readonly config = templateConfig;
  protected readonly statusVariant = statusVariant;
  protected readonly coverageLabel = coverageLabel;
  protected readonly filter = signal('All');
  protected readonly filters = ['All', 'Commit', 'Upside', 'At risk'];

  protected readonly visible = computed(() => {
    if (this.filter() === 'All') {
      return this.config.forecasts;
    }
    return this.config.forecasts.filter((item) => item.status === this.filter());
  });
}
