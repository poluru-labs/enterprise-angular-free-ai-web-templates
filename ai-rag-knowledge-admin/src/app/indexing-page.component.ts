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
  selector: 'app-indexing-page',
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
        <p class="eyebrow">Pipeline</p>
        <h1>Indexing</h1>
        <p class="summary">Crawl, chunk, embed, and publish. Priya Poluru’s support macros job is the current hotspot.</p>
      </div>
      <eds-spinner size="sm" label="Live jobs" [showLabel]="true"></eds-spinner>
    </section>

    <eds-card class="card-pad" [elevated]="false">
      <div class="section-head">
        <h2>Canonical pipeline</h2>
        <eds-status label="Embed" variant="info" [pulse]="true"></eds-status>
      </div>
      <eds-stepper [steps]="steps" [current]="2"></eds-stepper>
    </eds-card>

    <section class="split" style="margin-top: 0.9rem">
      <eds-card class="card-pad" [elevated]="false">
        <h2>Active jobs</h2>
        @for (job of config.indexJobs; track job.id) {
          <div class="job-row">
            <div class="job-head">
              <div>
                <strong>{{ job.id }} · {{ job.source }}</strong>
                <p class="meta">{{ job.owner }} · {{ job.stage }}</p>
              </div>
              <eds-status [label]="job.status" [variant]="statusVariant(job.status)"></eds-status>
            </div>
            @if (job.status === 'Running') {
              <eds-progress-bar [value]="job.progress" [max]="100" [label]="job.id" [showValue]="true"></eds-progress-bar>
            } @else if (job.status === 'Failed') {
              <eds-skeleton variant="text" [lines]="2"></eds-skeleton>
            } @else {
              <eds-meter [value]="job.progress" [max]="100" [label]="job.id" [showValue]="true"></eds-meter>
            }
          </div>
        }
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <h2>Run log</h2>
        <eds-timeline [items]="timeline"></eds-timeline>
      </eds-card>
    </section>
  `
})
export class IndexingPageComponent {
  protected readonly config = templateConfig;

  protected readonly steps: EdsStepperStep[] = [
    { label: 'Crawl', description: 'Fetch pages' },
    { label: 'Chunk', description: 'Split docs' },
    { label: 'Embed', description: 'Vectorize' },
    { label: 'ACL', description: 'Permissions' },
    { label: 'Publish', description: 'Serve' }
  ];

  protected readonly timeline: EdsTimelineItem[] = this.config.indexJobs.map((job, index) => ({
    title: job.id + ' · ' + job.source,
    description: job.owner + ' · ' + job.status,
    timestamp: job.stage,
    status: index === 0 ? 'current' : job.status === 'Complete' ? 'complete' : 'upcoming'
  }));

  protected statusVariant(status: string): 'success' | 'warning' | 'danger' | 'info' | 'neutral' {
    if (status === 'Complete') {
      return 'success';
    }
    if (status === 'Running' || status === 'Blocked') {
      return 'warning';
    }
    if (status === 'Failed') {
      return 'danger';
    }
    return 'info';
  }
}
