import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  EdsCardComponent,
  EdsMeterComponent,
  EdsProgressBarComponent,
  EdsSkeletonComponent,
  EdsSpinnerComponent,
  EdsStatusComponent,
  EdsStepperComponent,
  EdsTimelineComponent,
  type EdsStepperStep,
  type EdsTimelineItem
} from '@poluru-labs/enterprise-design-system-angular';
import { templateConfig } from '../template.config';

@Component({
  selector: 'app-budgets-page',
  standalone: true,
  imports: [
    EdsCardComponent,
    EdsMeterComponent,
    EdsProgressBarComponent,
    EdsSkeletonComponent,
    EdsSpinnerComponent,
    EdsStatusComponent,
    EdsStepperComponent,
    EdsTimelineComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Finance</p>
        <h1>Budgets</h1>
        <p class="summary">Weekly checks across workspaces. Production is the current hotspot for Lakshmi Poluru.</p>
      </div>
      <eds-spinner size="sm" label="Live spend" [showLabel]="true"></eds-spinner>
    </section>

    <eds-card class="card-pad" [elevated]="false">
      <div class="section-head">
        <h2>Month cycle</h2>
        <eds-status label="Review" variant="info" [pulse]="true"></eds-status>
      </div>
      <eds-stepper [steps]="steps" [current]="2"></eds-stepper>
    </eds-card>

    <section class="split" style="margin-top: 0.9rem">
      <eds-card class="card-pad" [elevated]="false">
        <h2>Workspace caps</h2>
        @for (item of config.workspaces; track item.name) {
          <div class="job-row">
            <div class="job-head">
              <div>
                <strong>{{ item.name }}</strong>
                <p class="meta">{{ item.owner }} · cap {{ item.cap }}</p>
              </div>
              <eds-status [label]="item.spend >= 80 ? 'Watch' : 'On track'" [variant]="item.spend >= 80 ? 'warning' : 'success'"></eds-status>
            </div>
            @if (item.spend >= 80) {
              <eds-progress-bar [value]="item.spend" [max]="100" [label]="item.name" [showValue]="true"></eds-progress-bar>
            } @else if (item.name === 'Internal tools') {
              <eds-skeleton variant="text" [lines]="2"></eds-skeleton>
            } @else {
              <eds-meter [value]="item.spend" [max]="100" [label]="item.name" [showValue]="true"></eds-meter>
            }
          </div>
        }
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <h2>This week</h2>
        <eds-timeline [items]="timeline"></eds-timeline>
      </eds-card>
    </section>
  `
})
export class BudgetsPageComponent {
  protected readonly config = templateConfig;

  protected readonly steps: EdsStepperStep[] = [
    { label: 'Forecast', description: 'Plan caps' },
    { label: 'Allocate', description: 'By workspace' },
    { label: 'Review', description: 'Owner sign-off' },
    { label: 'Alert', description: '80% notices' },
    { label: 'Close', description: 'Month-end' }
  ];

  protected readonly timeline: EdsTimelineItem[] = this.config.budgets.map((entry, index) => ({
    title: entry.item,
    description: entry.day + ' · ' + entry.spend + '% of cap',
    timestamp: entry.day,
    status: index === 0 ? 'current' : index < 3 ? 'complete' : 'upcoming'
  }));
}
