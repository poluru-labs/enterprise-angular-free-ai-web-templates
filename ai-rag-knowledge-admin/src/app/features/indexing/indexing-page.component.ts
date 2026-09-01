import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  EdsButtonComponent,
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
import { templateConfig, type IndexJob } from '../../core/config/template.config';
import { retryJob } from '../../shared/utils/knowledge';
import { statusVariant } from '../../shared/utils/status-variant';

@Component({
  selector: 'app-indexing-page',
  standalone: true,
  imports: [
    EdsButtonComponent,
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

    @if (notice()) {
      <p class="notice">{{ notice() }}</p>
    }

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
        @for (job of jobs(); track job.id) {
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
              <eds-button variant="primary" size="sm" icon="refresh" (clicked)="retry(job.id)">Retry crawl</eds-button>
            } @else {
              <eds-meter [value]="job.progress" [max]="100" [label]="job.id" [showValue]="true"></eds-meter>
            }
          </div>
        }
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <h2>Run log</h2>
        <eds-timeline [items]="timeline()"></eds-timeline>
        <p class="meta">{{ runningCount() }} running · {{ failedCount() }} failed</p>
      </eds-card>
    </section>
  `
})
export class IndexingPageComponent {
  protected readonly config = templateConfig;
  protected readonly jobs = signal<IndexJob[]>(this.config.indexJobs.map((item) => ({ ...item })));
  protected readonly notice = signal('');
  protected readonly statusVariant = statusVariant;

  protected readonly steps: EdsStepperStep[] = [
    { label: 'Crawl', description: 'Fetch pages' },
    { label: 'Chunk', description: 'Split docs' },
    { label: 'Embed', description: 'Vectorize' },
    { label: 'ACL', description: 'Permissions' },
    { label: 'Publish', description: 'Serve' }
  ];

  protected readonly timeline = computed<EdsTimelineItem[]>(() =>
    this.jobs().map((job, index) => ({
      title: job.id + ' · ' + job.source,
      description: job.owner + ' · ' + job.status,
      timestamp: job.stage,
      status: index === 0 ? 'current' : job.status === 'Complete' ? 'complete' : 'upcoming'
    }))
  );

  protected readonly runningCount = computed(() => this.jobs().filter((job) => job.status === 'Running').length);

  protected readonly failedCount = computed(() => this.jobs().filter((job) => job.status === 'Failed').length);

  protected retry(id: string): void {
    this.jobs.set(retryJob(this.jobs(), id));
    this.notice.set(`${id} queued for a fresh crawl.`);
  }
}
