import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  EdsBadgeComponent,
  EdsCardComponent,
  EdsProgressBarComponent,
  EdsStatusComponent,
  EdsTagComponent
} from '@poluru-labs/enterprise-design-system-angular';
import { templateConfig } from '../../core/config/template.config';
import { statusVariant } from '../../shared/utils/status-variant';
import { averageLoad, filterAgents } from '../../shared/utils/support';

@Component({
  selector: 'app-agents-page',
  standalone: true,
  imports: [EdsBadgeComponent, EdsCardComponent, EdsProgressBarComponent, EdsStatusComponent, EdsTagComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Staffing</p>
        <h1>Agents</h1>
        <p class="summary">Shift load, open tickets, and copilot coverage for Ananya Poluru’s Harbor Desk team.</p>
      </div>
      <eds-badge [label]="averageLoad(visible()) + '% avg load'" variant="brand" [soft]="true" [pill]="true"></eds-badge>
    </section>

    <div class="chips" style="margin-bottom: 0.9rem">
      @for (item of shifts; track item) {
        <button type="button" class="chip" [class.active]="shift() === item" (click)="shift.set(item)">{{ item }}</button>
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
          <p class="meta">{{ item.open }} open · {{ item.focus }}</p>
          <eds-progress-bar [value]="item.load" [max]="100" [label]="item.name" [showValue]="true"></eds-progress-bar>
          <div footer class="card-actions">
            <eds-tag [label]="item.shift" variant="brand"></eds-tag>
          </div>
        </eds-card>
      }
    </section>
  `
})
export class AgentsPageComponent {
  protected readonly config = templateConfig;
  protected readonly statusVariant = statusVariant;
  protected readonly averageLoad = averageLoad;
  protected readonly shift = signal('All');
  protected readonly shifts = ['All', 'Day', 'Swing', 'Night'];

  protected readonly visible = computed(() => filterAgents(this.config.agents, this.shift()));
}
