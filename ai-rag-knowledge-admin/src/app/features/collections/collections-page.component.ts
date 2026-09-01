import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  EdsBadgeComponent,
  EdsButtonComponent,
  EdsCardComponent,
  EdsCheckboxComponent,
  EdsListComponent,
  EdsRadioComponent,
  EdsRadioGroupComponent,
  EdsSwitchComponent,
  EdsTagComponent,
  EdsTreeViewComponent,
  type EdsListItem,
  type EdsTreeNode
} from '@poluru-labs/enterprise-design-system-angular';
import { templateConfig, type CollectionRow } from '../../core/config/template.config';
import {
  collectionTree,
  filterCollections,
  pinCollection,
  selectedCollectionLabel,
  selectedCollectionOwner
} from '../../shared/utils/knowledge';

@Component({
  selector: 'app-collections-page',
  standalone: true,
  imports: [
    EdsBadgeComponent,
    EdsButtonComponent,
    EdsCardComponent,
    EdsCheckboxComponent,
    EdsListComponent,
    EdsRadioComponent,
    EdsRadioGroupComponent,
    EdsSwitchComponent,
    EdsTagComponent,
    EdsTreeViewComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Taxonomy</p>
        <h1>Collections</h1>
        <p class="summary">Group sources for retrieval, citations, and access control. Owned by Ananya Poluru’s knowledge team.</p>
      </div>
      <eds-badge [label]="rows().length + ' collections'" variant="brand" [soft]="true" [pill]="true"></eds-badge>
    </section>

    @if (notice()) {
      <p class="notice">{{ notice() }}</p>
    }

    <div class="chips" style="margin-bottom: 0.9rem">
      @for (item of filters; track item) {
        <button type="button" class="chip" [class.active]="filter() === item" (click)="filter.set(item)">{{ item }}</button>
      }
    </div>

    <section class="split">
      <eds-card class="card-pad" [elevated]="false">
        <div class="section-head">
          <h2>Library</h2>
          <eds-tag [label]="selectedLabel()" variant="brand"></eds-tag>
        </div>
        <eds-tree-view
          [items]="tree"
          [selectedId]="selectedId()"
          [expandedIds]="expanded"
          (nodeSelect)="selectedId.set($event)"
        ></eds-tree-view>
      </eds-card>

      <div class="stack">
        <eds-card class="card-pad" [elevated]="false">
          <h2>{{ selectedLabel() }}</h2>
          <p class="meta">{{ selectedOwner() }}</p>
          <div class="setting" style="margin-top: 0.85rem">
            <div>
              <h3>Published to retrieval</h3>
              <p>Include this collection in hybrid search answers.</p>
            </div>
            <eds-switch label="Published" [checked]="published()" (checkedChange)="published.set($event)"></eds-switch>
          </div>
          <eds-checkbox
            label="Require citations on every answer"
            [checked]="citations()"
            (checkedChange)="citations.set($event)"
          ></eds-checkbox>
          <div style="margin-top: 0.9rem">
            <eds-radio-group
              label="Visibility"
              name="visibility"
              [value]="visibility()"
              (valueChange)="visibility.set($event)"
            >
              <eds-radio label="Workspace" value="workspace"></eds-radio>
              <eds-radio label="Restricted" value="restricted"></eds-radio>
              <eds-radio label="Public" value="public"></eds-radio>
            </eds-radio-group>
          </div>
        </eds-card>

        <eds-card class="card-pad" [elevated]="false">
          <h2>Owners</h2>
          <eds-list [items]="owners" [divided]="true"></eds-list>
        </eds-card>
      </div>
    </section>

    <section class="grid-3" style="margin-top: 0.9rem">
      @for (item of filtered(); track item.name) {
        <eds-card class="card-pad collection-card" [elevated]="false">
          <div class="section-head">
            <h3>{{ item.name }}</h3>
            <eds-badge [label]="item.visibility" variant="info" [soft]="true" size="sm"></eds-badge>
          </div>
          <p class="meta meta-clamp">{{ item.detail }}</p>
          <p class="meta">{{ item.sources }} sources · {{ item.docs }} docs · {{ item.quality }} nDCG</p>
          <p class="meta">{{ item.owner }} · synced {{ item.lastSync }} ago</p>
          <div footer class="card-actions">
            <eds-tag [label]="item.pinned ? 'Pinned' : 'Open'" variant="brand"></eds-tag>
            <eds-button variant="secondary" size="sm" icon="star" (clicked)="togglePin(item.name)">
              {{ item.pinned ? 'Unpin' : 'Pin' }}
            </eds-button>
          </div>
        </eds-card>
      }
    </section>
  `
})
export class CollectionsPageComponent {
  protected readonly config = templateConfig;
  protected readonly rows = signal<CollectionRow[]>(this.config.collections.map((item) => ({ ...item })));
  protected readonly selectedId = signal('public');
  protected readonly published = signal(true);
  protected readonly citations = signal(true);
  protected readonly visibility = signal('workspace');
  protected readonly filter = signal<'All' | 'Pinned' | 'Restricted'>('All');
  protected readonly notice = signal('');

  protected readonly filters: Array<'All' | 'Pinned' | 'Restricted'> = ['All', 'Pinned', 'Restricted'];

  protected readonly expanded: Record<string, boolean> = {
    library: true,
    public: true
  };

  protected readonly tree: EdsTreeNode[] = collectionTree(this.config.collections, this.config.sources);

  protected readonly owners: EdsListItem[] = this.config.collections.map((item) => ({
    label: item.owner,
    description: item.name + ' · ' + item.visibility
  }));

  protected readonly filtered = computed(() => filterCollections(this.rows(), this.filter()));

  protected readonly pinnedCount = computed(() => this.rows().filter((item) => item.pinned).length);

  protected selectedLabel(): string {
    return selectedCollectionLabel(this.selectedId(), this.config.collections, this.config.sources);
  }

  protected selectedOwner(): string {
    return selectedCollectionOwner(this.selectedLabel(), this.config.collections, this.config.sources, 'Ananya Poluru');
  }

  protected togglePin(name: string): void {
    this.rows.set(pinCollection(this.rows(), name));
    const pinned = this.rows().find((item) => item.name === name)?.pinned;
    this.notice.set(pinned ? `${name} pinned for Ananya Poluru.` : `${name} unpinned from the library.`);
  }
}
