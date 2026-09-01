import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  EdsBadgeComponent,
  EdsButtonComponent,
  EdsCardComponent,
  EdsCircularProgressComponent,
  EdsEmptyStateComponent,
  EdsMeterComponent,
  EdsProgressBarComponent,
  EdsStatComponent,
  EdsStatusComponent,
  EdsTagComponent
} from '@poluru-labs/enterprise-design-system-angular';
import { templateConfig, type EvalSuite } from '../../core/config/template.config';
import { statusVariant } from '../../shared/utils/status-variant';

@Component({
  selector: 'app-evaluations-page',
  standalone: true,
  imports: [
    RouterLink,
    EdsBadgeComponent,
    EdsButtonComponent,
    EdsCardComponent,
    EdsCircularProgressComponent,
    EdsEmptyStateComponent,
    EdsMeterComponent,
    EdsProgressBarComponent,
    EdsStatComponent,
    EdsStatusComponent,
    EdsTagComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Quality</p>
        <h1>Evaluations</h1>
        <p class="summary">Golden questions, nDCG@10, and groundedness for Ananya Poluru’s retrieval workspace.</p>
      </div>
      <eds-badge [label]="driftCount() + ' drifting'" variant="warning" [soft]="true" [pill]="true"></eds-badge>
    </section>

    @if (notice()) {
      <p class="notice">{{ notice() }}</p>
    }

    <section class="grid-4">
      <eds-card class="card-pad" [elevated]="false">
        <eds-stat label="Avg nDCG@10" [value]="ndcgLabel()" trend="up" trendValue="+1.7%" hint="across packs"></eds-stat>
        <p class="meta meta-clamp">Mean of Priya, Lakshmi, Venkata, Hana, and Arjun Poluru’s packs.</p>
      </eds-card>
      <eds-card class="card-pad" [elevated]="false">
        <eds-stat label="Groundedness" [value]="groundedLabel()" trend="up" trendValue="citations" hint="eval floor 88"></eds-stat>
        <p class="meta meta-clamp">Answers must cite a published chunk. Legal pack is the current drag.</p>
      </eds-card>
      <eds-card class="card-pad" [elevated]="false">
        <eds-stat label="Golden questions" [value]="questionLabel()" trend="up" trendValue="+18" hint="this quarter"></eds-stat>
        <p class="meta meta-clamp">184 labeled questions across support, product, ops, legal, and security.</p>
      </eds-card>
      <eds-card class="card-pad forecast-hero" [elevated]="false">
        <eds-circular-progress [value]="ndcgAvg()" [max]="100" [size]="64" [showValue]="true"></eds-circular-progress>
        <div>
          <p class="eyebrow">Vault score</p>
          <h2>{{ ndcgLabel() }}</h2>
          <p class="meta">Above the 88 floor Ananya Poluru set for publish.</p>
        </div>
      </eds-card>
    </section>

    <div class="chips" style="margin: 0.9rem 0">
      @for (item of filters; track item) {
        <button type="button" class="chip" [class.active]="filter() === item" (click)="filter.set(item)">{{ item }}</button>
      }
    </div>

    @if (filtered().length === 0) {
      <eds-empty-state heading="No eval packs in this view" description="Show every pack or wait for Meera Poluru’s nightly job." [icon]="true">
        <div actions>
          <eds-button variant="primary" size="sm" (clicked)="filter.set('All')">Show all</eds-button>
        </div>
      </eds-empty-state>
    } @else {
      <section class="grid-3">
        @for (item of filtered(); track item.id) {
          <eds-card class="card-pad collection-card" [elevated]="false">
            <div class="section-head">
              <h3>{{ item.name }}</h3>
              <eds-status [label]="item.status" [variant]="statusVariant(item.status)"></eds-status>
            </div>
            <p class="meta meta-clamp">{{ item.detail }}</p>
            <p class="meta">{{ item.id }} · {{ item.owner }} · {{ item.questions }} questions</p>
            <p class="meta">Last run {{ item.lastRun }}</p>
            <div class="meter-row">
              <span><span>nDCG@10</span><strong>{{ item.ndcg }}</strong></span>
              <eds-progress-bar [value]="item.ndcg" [max]="100" [label]="item.name" [showValue]="true"></eds-progress-bar>
            </div>
            <div class="meter-row">
              <span><span>Groundedness</span><strong>{{ item.groundedness }}</strong></span>
              <eds-meter [value]="item.groundedness" [max]="100" [label]="item.name" [showValue]="true"></eds-meter>
            </div>
            <div footer class="card-actions">
              <eds-tag [label]="item.questions + ' Q'" variant="info"></eds-tag>
              <eds-button variant="primary" size="sm" icon="refresh" (clicked)="runEval(item.id)">Run eval</eds-button>
            </div>
          </eds-card>
        }
      </section>
    }

    <section class="split" style="margin-top: 0.9rem">
      <eds-card class="card-pad" [elevated]="false">
        <h2>Embedding canary</h2>
        @for (model of config.embeddingModels; track model.name) {
          <div class="job-row">
            <div class="job-head">
              <div>
                <strong>{{ model.name }}</strong>
                <p class="meta">{{ model.owner }} · {{ model.traffic }}% traffic</p>
              </div>
              <eds-status [label]="model.status" [variant]="statusVariant(model.status)"></eds-status>
            </div>
            <eds-progress-bar [value]="model.traffic" [max]="100" [label]="model.name" [showValue]="true"></eds-progress-bar>
          </div>
        }
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <h2>Golden questions</h2>
        @for (hit of config.queries.slice(0, 5); track hit.query) {
          <div class="query-hit">
            <div>
              <strong>{{ hit.query }}</strong>
              <p class="meta">{{ hit.hit }}</p>
            </div>
            <eds-status [label]="hit.score" variant="info"></eds-status>
          </div>
        }
        <p class="meta"><a routerLink="/retrieval">Open retrieval playground</a></p>
      </eds-card>
    </section>
  `
})
export class EvaluationsPageComponent {
  protected readonly config = templateConfig;
  protected readonly rows = signal<EvalSuite[]>(this.config.evalSuites.map((item) => ({ ...item })));
  protected readonly filter = signal<'All' | EvalSuite['status']>('All');
  protected readonly notice = signal('');
  protected readonly statusVariant = statusVariant;
  protected readonly filters: Array<'All' | EvalSuite['status']> = ['All', 'Ready', 'Running', 'Drift'];

  protected readonly filtered = computed(() => {
    const current = this.filter();
    return this.rows().filter((item) => current === 'All' || item.status === current);
  });

  protected readonly ndcgAvg = computed(() => {
    const items = this.rows();
    if (items.length === 0) {
      return 0;
    }
    return Math.round(items.reduce((sum, item) => sum + item.ndcg, 0) / items.length);
  });

  protected readonly groundedAvg = computed(() => {
    const items = this.rows();
    if (items.length === 0) {
      return 0;
    }
    return Math.round(items.reduce((sum, item) => sum + item.groundedness, 0) / items.length);
  });

  protected readonly questionCount = computed(() => this.rows().reduce((sum, item) => sum + item.questions, 0));

  protected readonly driftCount = computed(() => this.rows().filter((item) => item.status === 'Drift').length);

  protected readonly ndcgLabel = computed(() => `${this.ndcgAvg()}%`);

  protected readonly groundedLabel = computed(() => `${this.groundedAvg()}%`);

  protected readonly questionLabel = computed(() => String(this.questionCount()));

  protected runEval(id: string): void {
    this.rows.update((items) =>
      items.map((item) => (item.id === id ? { ...item, status: 'Running', lastRun: 'just now' } : item))
    );
    this.notice.set(`Queued ${id} for Meera Poluru’s eval runner.`);
  }
}
