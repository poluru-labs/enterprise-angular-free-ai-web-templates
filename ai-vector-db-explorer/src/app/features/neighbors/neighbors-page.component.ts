import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  EdsCardComponent,
  EdsDataTableColumn,
  EdsDataTableComponent,
  EdsDescriptionListComponent,
  EdsMeterComponent,
  EdsPopoverComponent,
  EdsButtonComponent,
  EdsStatusComponent,
  type EdsDescriptionListItem
} from '@poluru-labs/enterprise-design-system-angular';
import { templateConfig } from '../../core/config/template.config';
import { statusVariant } from '../../shared/utils/status-variant';

@Component({
  selector: 'app-neighbors-page',
  standalone: true,
  imports: [
    EdsButtonComponent,
    EdsCardComponent,
    EdsDataTableComponent,
    EdsDescriptionListComponent,
    EdsMeterComponent,
    EdsPopoverComponent,
    EdsStatusComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Inspect</p>
        <h1>Neighbors</h1>
        <p class="summary">Pairwise similarity scores around a source vector.</p>
      </div>
      <eds-popover heading="Score legend" placement="bottom">
        <eds-button trigger variant="secondary" size="sm" icon="info">Legend</eds-button>
        <p class="muted">Match ≥ 0.80. Watch 0.60–0.79. Weak below 0.60. Scores are cosine unless the index says otherwise.</p>
      </eds-popover>
    </section>

    <section class="split">
      <eds-card class="card-pad" [elevated]="false">
        <div class="section-head">
          <h2>Neighborhood</h2>
          <eds-status [label]="selected()?.status ?? 'Match'" [variant]="statusVariant(selected()?.status ?? 'Match')"></eds-status>
        </div>
        <div class="table-wrap">
          <eds-data-table [columns]="columns" [rows]="rows" [striped]="true" [compact]="true"></eds-data-table>
        </div>
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <div class="section-head">
          <h2>{{ selected()?.source }} → {{ selected()?.neighbor }}</h2>
        </div>
        <eds-meter [value]="scorePct()" [max]="100" label="Similarity" [showValue]="true"></eds-meter>
        <eds-description-list [items]="facts()" [columns]="1" [compact]="true"></eds-description-list>
        <div class="chips" style="margin-top: 0.85rem">
          @for (row of config.neighbors; track row.id) {
            <button type="button" class="chip" [class.active]="row.id === selectedId()" (click)="selectedId.set(row.id)">
              {{ row.neighbor }}
            </button>
          }
        </div>
      </eds-card>
    </section>
  `
})
export class NeighborsPageComponent {
  protected readonly config = templateConfig;
  protected readonly statusVariant = statusVariant;
  protected readonly selectedId = signal(this.config.neighbors[0].id);

  protected readonly selected = computed(() => this.config.neighbors.find((item) => item.id === this.selectedId()));

  protected readonly scorePct = computed(() => Math.round((this.selected()?.score ?? 0) * 100));

  protected readonly facts = computed((): EdsDescriptionListItem[] => {
    const row = this.selected();
    if (!row) {
      return [];
    }
    return [
      { term: 'Source', description: row.source },
      { term: 'Neighbor', description: row.neighbor },
      { term: 'Namespace', description: row.namespace },
      { term: 'Owner', description: row.owner },
      { term: 'Score', description: row.score.toFixed(2) }
    ];
  });

  protected readonly columns: EdsDataTableColumn[] = [
    { key: 'source', label: 'Source' },
    { key: 'neighbor', label: 'Neighbor' },
    { key: 'score', label: 'Score', sortable: true },
    { key: 'namespace', label: 'Namespace' },
    { key: 'owner', label: 'Owner' },
    { key: 'status', label: 'Status' }
  ];

  protected readonly rows = this.config.neighbors.map((row) => ({
    source: row.source,
    neighbor: row.neighbor,
    score: row.score.toFixed(2),
    namespace: row.namespace,
    owner: row.owner,
    status: row.status
  }));
}
