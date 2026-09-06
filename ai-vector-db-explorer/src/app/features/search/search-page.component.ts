import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import {
  EdsButtonComponent,
  EdsCardComponent,
  EdsCodeSnippetComponent,
  EdsEmptyStateComponent,
  EdsLinkComponent,
  EdsNumberInputComponent,
  EdsRatingComponent,
  EdsSearchComponent,
  EdsSliderComponent,
  EdsStatusComponent,
  EdsTabsComponent,
  EdsTimePickerComponent,
  type EdsTabItem
} from '@poluru-labs/enterprise-design-system-angular';
import { templateConfig } from '../../core/config/template.config';
import { similarityHits } from '../../shared/utils/vector';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [
    EdsButtonComponent,
    EdsCardComponent,
    EdsCodeSnippetComponent,
    EdsEmptyStateComponent,
    EdsLinkComponent,
    EdsNumberInputComponent,
    EdsRatingComponent,
    EdsSearchComponent,
    EdsSliderComponent,
    EdsStatusComponent,
    EdsTabsComponent,
    EdsTimePickerComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Playground</p>
        <h1>Similarity search</h1>
        <p class="summary">Tune k, inspect scores, and score grounded neighbors before they reach copilots.</p>
      </div>
      <eds-status label="HNSW live" variant="success" [pulse]="true"></eds-status>
    </section>

    @if (notice()) {
      <p class="notice">{{ notice() }}</p>
    }

    <section class="split">
      <eds-card class="card-pad" [elevated]="false">
        <div class="section-head">
          <h2>Ask the index</h2>
          <eds-link href="/indexes">Browse indexes</eds-link>
        </div>
        <eds-search
          placeholder="Rotate API keys"
          [clearable]="true"
          [value]="query()"
          (valueChange)="query.set($event)"
        ></eds-search>
        <div class="grid-2" style="margin-top: 0.9rem; grid-template-columns: 1fr 1fr">
          <eds-slider
            label="Top K"
            [min]="3"
            [max]="20"
            [step]="1"
            [value]="topK()"
            [showValue]="true"
            (valueChange)="topK.set($event)"
          ></eds-slider>
          <eds-number-input
            label="Min score"
            [value]="minScore()"
            [min]="0"
            [max]="1"
            [step]="0.05"
            hint="Drop neighbors below this score"
            (valueChange)="minScore.set($event)"
          ></eds-number-input>
        </div>
        <eds-tabs [tabs]="modes" [selectedIndex]="mode()" (selectedIndexChange)="mode.set($event)"></eds-tabs>
        <eds-code-snippet [code]="sampleQuery()" language="json" label="Last request"></eds-code-snippet>
        <div class="inline-actions" style="margin-top: 0.85rem">
          <eds-button variant="primary" size="sm" icon="search" (clicked)="runQuery()">Run search</eds-button>
        </div>
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <div class="section-head">
          <h2>Hits</h2>
          <eds-rating [value]="rating()" size="sm" (valueChange)="rating.set($event)"></eds-rating>
        </div>
        @if (hits().length === 0) {
          <eds-empty-state heading="No hits above the floor" description="Lower the min score or switch metric." [icon]="true">
            <div actions>
              <eds-button variant="primary" size="sm" (clicked)="minScore.set(0.5)">Drop floor to 0.50</eds-button>
            </div>
          </eds-empty-state>
        } @else {
          @for (hit of hits(); track hit.id) {
            <div class="query-hit">
              <div>
                <strong>{{ hit.id }}</strong>
                <p class="meta">{{ hit.preview }}</p>
                <p class="meta">{{ hit.index }} · {{ hit.namespace }} · {{ hit.owner }}</p>
              </div>
              <eds-status [label]="hit.score.toFixed(2)" variant="info"></eds-status>
            </div>
          }
        }
        <div style="margin-top: 1rem">
          <eds-time-picker
            label="Nightly eval window"
            hint="Kavya Poluru’s recall job"
            [value]="evalTime()"
            (valueChange)="evalTime.set($event)"
          ></eds-time-picker>
        </div>
      </eds-card>
    </section>
  `
})
export class SearchPageComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly config = templateConfig;
  protected readonly query = signal('Rotate API keys');
  protected readonly topK = signal(8);
  protected readonly minScore = signal(0.7);
  protected readonly mode = signal(0);
  protected readonly rating = signal(4);
  protected readonly evalTime = signal('02:30');
  protected readonly notice = signal('');

  protected readonly modes: EdsTabItem[] = [
    { label: 'Cosine', content: 'Default for docs-prod and support-faq.' },
    { label: 'Dot', content: 'Used by code-search for inner-product ranks.' },
    { label: 'L2', content: 'Used by image-clips stills.' }
  ];

  protected readonly hits = computed(() => similarityHits(this.config.vectors, this.minScore(), this.topK()));

  protected readonly sampleQuery = computed(() =>
    JSON.stringify(
      {
        index: 'docs-prod',
        namespace: 'eu-live',
        q: this.query(),
        k: this.topK(),
        minScore: this.minScore(),
        metric: this.modes[this.mode()]?.label.toLowerCase(),
        owner: 'Maya Poluru'
      },
      null,
      2
    )
  );

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const q = params.get('q');
      if (q) {
        this.query.set(q);
      }
    });
  }

  protected runQuery(): void {
    this.notice.set(`Ran ${this.modes[this.mode()]?.label} search · ${this.hits().length} hits above ${this.minScore().toFixed(2)}.`);
  }
}
