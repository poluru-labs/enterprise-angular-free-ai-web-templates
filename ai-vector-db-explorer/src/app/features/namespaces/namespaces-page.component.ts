import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  EdsCardComponent,
  EdsProgressBarComponent,
  EdsStatusComponent,
  EdsTagComponent,
  EdsTreeViewComponent,
  type EdsTreeNode
} from '@poluru-labs/enterprise-design-system-angular';
import { templateConfig } from '../../core/config/template.config';
import { statusVariant } from '../../shared/utils/status-variant';
import { namespaceTree, selectedNamespaceLabel } from '../../shared/utils/vector';

@Component({
  selector: 'app-namespaces-page',
  standalone: true,
  imports: [EdsCardComponent, EdsProgressBarComponent, EdsStatusComponent, EdsTagComponent, EdsTreeViewComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Partitions</p>
        <h1>Namespaces</h1>
        <p class="summary">Warm, cooling, and frozen partitions under each Lattice index.</p>
      </div>
      <eds-tag [label]="selectedLabel() + ' selected'" variant="brand"></eds-tag>
    </section>

    <section class="split">
      <eds-card class="card-pad" [elevated]="false">
        <div class="section-head">
          <h2>Catalog</h2>
        </div>
        <eds-tree-view
          [items]="tree"
          [selectedId]="selectedId()"
          [expandedIds]="expanded"
          (nodeSelect)="selectedId.set($event)"
        ></eds-tree-view>
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <div class="section-head">
          <h2>{{ selectedLabel() }}</h2>
          <eds-status [label]="selectedRows()[0]?.status ?? 'Warm'" [variant]="statusVariant(selectedRows()[0]?.status ?? 'Warm')"></eds-status>
        </div>
        @for (row of selectedRows(); track row.id) {
          <div class="query-hit">
            <div>
              <strong>{{ row.name }}</strong>
              <p class="meta">{{ row.index }} · {{ row.owner }} · p95 {{ row.p95 }}</p>
              <p class="meta meta-clamp">{{ row.detail }}</p>
            </div>
            <span>{{ row.vectors.toLocaleString('en-US') }}</span>
          </div>
          <eds-progress-bar [value]="Math.min(100, Math.round(row.vectors / 20000))" [max]="100" [label]="row.name"></eds-progress-bar>
        }
      </eds-card>
    </section>
  `
})
export class NamespacesPageComponent {
  protected readonly config = templateConfig;
  protected readonly statusVariant = statusVariant;
  protected readonly Math = Math;
  protected readonly selectedId = signal('workspace');
  protected readonly tree: EdsTreeNode[] = namespaceTree(this.config.namespaces);
  protected readonly expanded: Record<string, boolean> = { workspace: true, 'docs-prod': true, 'support-faq': true };

  protected readonly selectedLabel = computed(() => selectedNamespaceLabel(this.selectedId(), this.config.namespaces));

  protected readonly selectedRows = computed(() => {
    const id = this.selectedId();
    if (id === 'workspace') {
      return this.config.namespaces;
    }
    const byIndex = this.config.namespaces.filter((item) => item.index === this.selectedLabel());
    if (byIndex.length) {
      return byIndex;
    }
    return this.config.namespaces.filter((item) => item.id === id);
  });
}
