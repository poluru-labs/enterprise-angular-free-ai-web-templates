import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  EdsCardComponent,
  EdsMeterComponent,
  EdsProgressBarComponent,
  EdsSkeletonComponent,
  EdsSpinnerComponent,
  EdsStatusComponent,
  EdsStepperComponent,
  EdsTagComponent,
  EdsTimelineComponent,
  type EdsStepperStep,
  type EdsTimelineItem
} from '@poluru-labs/enterprise-design-system-angular';
import { templateConfig } from '../../core/config/template.config';
import { statusVariant } from '../../shared/utils/status-variant';
import { sequenceProgress } from '../../shared/utils/sales';

@Component({
  selector: 'app-sequences-page',
  standalone: true,
  imports: [
    EdsCardComponent,
    EdsMeterComponent,
    EdsProgressBarComponent,
    EdsSkeletonComponent,
    EdsSpinnerComponent,
    EdsStatusComponent,
    EdsStepperComponent,
    EdsTagComponent,
    EdsTimelineComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Outreach</p>
        <h1>Sequences</h1>
        <p class="summary">AI-suggested cadences across Ananya Poluru’s sellers. Alpha outbound is the current stall for Nikhil Poluru.</p>
      </div>
      <eds-spinner size="sm" label="Live sequences" [showLabel]="true"></eds-spinner>
    </section>

    <eds-card class="card-pad" [elevated]="false">
      <div class="section-head">
        <h2>Launch cycle</h2>
        <eds-status label="Review" variant="info" [pulse]="true"></eds-status>
      </div>
      <eds-stepper [steps]="steps" [current]="2"></eds-stepper>
    </eds-card>

    <section class="split" style="margin-top: 0.9rem">
      <eds-card class="card-pad" [elevated]="false">
        <h2>Active cadences</h2>
        @for (item of config.sequences; track item.name) {
          <div class="job-row">
            <div class="job-head">
              <div>
                <strong>{{ item.name }}</strong>
                <p class="meta">{{ item.owner }} · {{ item.audience }} · {{ item.done }}/{{ item.steps }} steps</p>
              </div>
              <eds-status [label]="item.status" [variant]="statusVariant(item.status)"></eds-status>
            </div>
            <p class="meta meta-clamp">{{ item.detail }}</p>
            @if (item.status === 'Watch' || item.status === 'Review') {
              <eds-progress-bar
                [value]="progress(item)"
                [max]="100"
                [label]="item.name"
                [showValue]="true"
              ></eds-progress-bar>
            } @else if (item.name === 'Success plan') {
              <eds-skeleton variant="text" [lines]="2"></eds-skeleton>
            } @else {
              <eds-meter [value]="progress(item)" [max]="100" [label]="item.name" [showValue]="true"></eds-meter>
            }
          </div>
        }
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <h2>This week</h2>
        <eds-timeline [items]="timeline"></eds-timeline>
      </eds-card>
    </section>

    <section class="grid-3" style="margin-top: 0.9rem">
      @for (item of config.sequences.slice(0, 3); track item.name) {
        <eds-card class="card-pad collection-card" [elevated]="false">
          <div class="section-head">
            <h3>{{ item.name }}</h3>
            <eds-status [label]="item.status" [variant]="statusVariant(item.status)"></eds-status>
          </div>
          <p class="meta meta-clamp">{{ item.detail }}</p>
          <p class="meta">{{ item.owner }} · {{ item.done }}/{{ item.steps }}</p>
          <div footer class="card-actions">
            <eds-tag [label]="item.audience" variant="brand"></eds-tag>
          </div>
        </eds-card>
      }
    </section>
  `
})
export class SequencesPageComponent {
  protected readonly config = templateConfig;
  protected readonly statusVariant = statusVariant;
  protected readonly progress = sequenceProgress;

  protected readonly steps: EdsStepperStep[] = [
    { label: 'Draft', description: 'AI first pass' },
    { label: 'Tune', description: 'Seller edits' },
    { label: 'Review', description: 'Owner sign-off' },
    { label: 'Launch', description: 'Start cadence' },
    { label: 'Coach', description: 'Step stalls' }
  ];

  protected readonly timeline: EdsTimelineItem[] = this.config.pipeline.map((entry, index) => ({
    title: entry.item,
    description: entry.day + ' · ' + entry.coverage + '% coverage',
    timestamp: entry.day,
    status: index === 0 ? 'current' : index < 3 ? 'complete' : 'upcoming'
  }));
}
