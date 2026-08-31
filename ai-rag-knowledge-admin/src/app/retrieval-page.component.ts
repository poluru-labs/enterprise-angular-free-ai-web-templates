import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  EdsCardComponent,
  EdsCodeSnippetComponent,
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
import { templateConfig } from '../template.config';

@Component({
  selector: 'app-retrieval-page',
  standalone: true,
  imports: [
    EdsCardComponent,
    EdsCodeSnippetComponent,
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
        <h1>Retrieval</h1>
        <p class="summary">Tune hybrid search, inspect citations, and score grounded answers before they reach copilots.</p>
      </div>
      <eds-status label="Hybrid on" variant="success" [pulse]="true"></eds-status>
    </section>

    <section class="split">
      <eds-card class="card-pad" [elevated]="false">
        <div class="section-head">
          <h2>Ask the vault</h2>
          <eds-link href="/sources">Browse sources</eds-link>
        </div>
        <eds-search
          placeholder="How do we rotate API keys?"
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
            hint="Drop chunks below this score"
            (valueChange)="minScore.set($event)"
          ></eds-number-input>
        </div>
        <eds-tabs [tabs]="modes" [selectedIndex]="mode()" (selectedIndexChange)="mode.set($event)"></eds-tabs>
        <eds-code-snippet [code]="sampleQuery" language="json" label="Last request"></eds-code-snippet>
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <div class="section-head">
          <h2>Grounded hits</h2>
          <eds-rating [value]="rating()" size="sm" (valueChange)="rating.set($event)"></eds-rating>
        </div>
        @for (hit of config.queries; track hit.query) {
          <div class="query-hit">
            <div>
              <strong>{{ hit.query }}</strong>
              <p class="meta">{{ hit.hit }} · {{ hit.citations }} citations</p>
            </div>
            <eds-status [label]="hit.score" variant="info"></eds-status>
          </div>
        }
        <div style="margin-top: 1rem">
          <eds-time-picker
            label="Nightly eval window"
            hint="Meera Poluru’s quality job"
            [value]="evalTime()"
            (valueChange)="evalTime.set($event)"
          ></eds-time-picker>
        </div>
      </eds-card>
    </section>
  `
})
export class RetrievalPageComponent {
  protected readonly config = templateConfig;
  protected readonly query = signal('How do we rotate API keys?');
  protected readonly topK = signal(8);
  protected readonly minScore = signal(0.65);
  protected readonly mode = signal(0);
  protected readonly rating = signal(4);
  protected readonly evalTime = signal('02:30');

  protected readonly modes: EdsTabItem[] = [
    { label: 'Hybrid', content: 'Dense + BM25 with reciprocal rank fusion.' },
    { label: 'Dense', content: 'Embedding-only retrieval for semantic matches.' },
    { label: 'Keyword', content: 'BM25 for exact policy and ID lookups.' }
  ];

  protected readonly sampleQuery = `{
  "query": "How do we rotate API keys?",
  "top_k": 8,
  "mode": "hybrid",
  "owner": "Nikhil Poluru"
}`;
}
