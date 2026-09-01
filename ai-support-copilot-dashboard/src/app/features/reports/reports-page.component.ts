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
import { filterReports } from '../../shared/utils/support';

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [EdsBadgeComponent, EdsCardComponent, EdsMeterComponent, EdsStatusComponent, EdsTagComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Quality</p>
        <h1>Reports</h1>
        <p class="summary">CSAT, deflection, and groundedness for copilot-assisted replies across Harbor Desk queues.</p>
      </div>
      <eds-badge [label]="visible().length + ' packs'" variant="brand" [soft]="true" [pill]="true"></eds-badge>
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
          <p class="meta">CSAT {{ item.csat }} · Deflection {{ item.deflection }}%</p>
          <p class="meta">{{ item.owner }} · {{ item.window }}</p>
          <eds-meter [value]="item.grounded" [max]="100" label="Grounded" [showValue]="true"></eds-meter>
          <div footer class="card-actions">
            <eds-tag [label]="item.grounded + '% grounded'" variant="brand"></eds-tag>
          </div>
        </eds-card>
      }
    </section>
  `
})
export class ReportsPageComponent {
  protected readonly config = templateConfig;
  protected readonly statusVariant = statusVariant;
  protected readonly filter = signal('All');
  protected readonly filters = ['All', 'Ready', 'Review', 'Watch'];

  protected readonly visible = computed(() => filterReports(this.config.reports, this.filter()));
}
