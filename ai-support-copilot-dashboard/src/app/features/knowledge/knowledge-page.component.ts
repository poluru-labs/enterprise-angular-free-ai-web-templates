import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  EdsCardComponent,
  EdsMeterComponent,
  EdsProgressBarComponent,
  EdsSideNavComponent,
  EdsSkeletonComponent,
  EdsSpinnerComponent,
  EdsStatusComponent,
  EdsStepperComponent,
  EdsTagComponent,
  EdsTimelineComponent,
  type EdsSideNavItem,
  type EdsStepperStep,
  type EdsTimelineItem
} from '@poluru-labs/enterprise-design-system-angular';
import { templateConfig } from '../../core/config/template.config';
import { statusVariant } from '../../shared/utils/status-variant';
import { filterArticles } from '../../shared/utils/support';

@Component({
  selector: 'app-knowledge-page',
  standalone: true,
  imports: [
    EdsCardComponent,
    EdsMeterComponent,
    EdsProgressBarComponent,
    EdsSideNavComponent,
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
        <p class="eyebrow">Library</p>
        <h1>Knowledge</h1>
        <p class="summary">Grounding articles Meera Poluru keeps current so copilot drafts stay accurate.</p>
      </div>
      <eds-spinner size="sm" label="Indexing live" [showLabel]="true"></eds-spinner>
    </section>

    <eds-card class="card-pad" [elevated]="false">
      <div class="section-head">
        <h2>Publish cycle</h2>
        <eds-status label="Review" variant="info" [pulse]="true"></eds-status>
      </div>
      <eds-stepper [steps]="steps" [current]="2"></eds-stepper>
    </eds-card>

    <section class="split" style="margin-top: 0.9rem">
      <eds-card class="card-pad" [elevated]="false">
        <h2>Articles</h2>
        @for (item of visible(); track item.title) {
          <div class="job-row">
            <div class="job-head">
              <div>
                <strong>{{ item.title }}</strong>
                <p class="meta">{{ item.owner }} · {{ item.topic }} · {{ item.uses }} uses · {{ item.freshness }}</p>
              </div>
              <eds-status [label]="item.status" [variant]="statusVariant(item.status)"></eds-status>
            </div>
            <p class="meta meta-clamp">{{ item.detail }}</p>
            @if (item.status === 'Watch' || item.status === 'Review') {
              <eds-progress-bar
                [value]="item.uses"
                [max]="220"
                [label]="item.title"
                [showValue]="true"
              ></eds-progress-bar>
            } @else if (item.title === 'Night coverage script') {
              <eds-skeleton variant="text" [lines]="2"></eds-skeleton>
            } @else {
              <eds-meter [value]="item.uses" [max]="220" [label]="item.title" [showValue]="true"></eds-meter>
            }
          </div>
        }
      </eds-card>

      <div class="stack">
        <eds-card class="card-pad" [elevated]="false">
          <h2>Topics</h2>
          <eds-side-nav [items]="topics" [collapsed]="false" (navigateEvent)="onTopic($event)"></eds-side-nav>
          <p class="meta">Selected {{ selectedTopic() }}</p>
        </eds-card>

        <eds-card class="card-pad" [elevated]="false">
          <h2>This week</h2>
          <eds-timeline [items]="timeline"></eds-timeline>
        </eds-card>
      </div>
    </section>

    <section class="grid-3" style="margin-top: 0.9rem">
      @for (item of config.articles.slice(0, 3); track item.title) {
        <eds-card class="card-pad collection-card" [elevated]="false">
          <div class="section-head">
            <h3>{{ item.title }}</h3>
            <eds-status [label]="item.status" [variant]="statusVariant(item.status)"></eds-status>
          </div>
          <p class="meta meta-clamp">{{ item.detail }}</p>
          <p class="meta">{{ item.owner }} · {{ item.uses }} uses</p>
          <div footer class="card-actions">
            <eds-tag [label]="item.topic" variant="brand"></eds-tag>
          </div>
        </eds-card>
      }
    </section>
  `
})
export class KnowledgePageComponent {
  protected readonly config = templateConfig;
  protected readonly statusVariant = statusVariant;
  protected readonly selectedTopic = signal('All');

  protected readonly steps: EdsStepperStep[] = [
    { label: 'Draft', description: 'Writer first pass' },
    { label: 'Ground', description: 'Cite sources' },
    { label: 'Review', description: 'Meera Poluru' },
    { label: 'Publish', description: 'Go live' },
    { label: 'Measure', description: 'Hit rate' }
  ];

  protected readonly topics: EdsSideNavItem[] = [
    { label: 'All', href: '#all', active: true },
    { label: 'Billing', href: '#billing' },
    { label: 'Orders', href: '#orders' },
    { label: 'Escalation', href: '#escalation' },
    { label: 'Account', href: '#account' },
    { label: 'Ops', href: '#ops' }
  ];

  protected readonly timeline: EdsTimelineItem[] = this.config.articles.slice(0, 5).map((entry, index) => ({
    title: entry.title,
    description: entry.owner + ' · ' + entry.uses + ' uses',
    timestamp: entry.freshness,
    status: index === 0 ? 'current' : index < 3 ? 'complete' : 'upcoming'
  }));

  protected readonly visible = computed(() => filterArticles(this.config.articles, '', this.selectedTopic()));

  protected onTopic(event: { label: string; href?: string }): void {
    this.selectedTopic.set(event.label);
  }
}
