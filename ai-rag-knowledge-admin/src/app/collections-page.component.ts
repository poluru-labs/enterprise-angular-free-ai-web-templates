import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  EdsBadgeComponent,
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
import { templateConfig } from '../template.config';

@Component({
  selector: 'app-collections-page',
  standalone: true,
  imports: [
    EdsBadgeComponent,
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
      <eds-badge label="6 collections" variant="brand" [soft]="true" [pill]="true"></eds-badge>
    </section>

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
      @for (item of config.collections; track item.name) {
        <eds-card class="card-pad collection-card" [elevated]="false">
          <div class="section-head">
            <h3>{{ item.name }}</h3>
            <eds-badge [label]="item.visibility" variant="info" [soft]="true" size="sm"></eds-badge>
          </div>
          <p class="meta">{{ item.sources }} sources · {{ item.docs }} docs</p>
          <p class="meta">{{ item.owner }}</p>
        </eds-card>
      }
    </section>
  `
})
export class CollectionsPageComponent {
  protected readonly config = templateConfig;
  protected readonly selectedId = signal('public');
  protected readonly published = signal(true);
  protected readonly citations = signal(true);
  protected readonly visibility = signal('workspace');

  protected readonly expanded: Record<string, boolean> = {
    library: true,
    public: true
  };

  protected readonly tree: EdsTreeNode[] = [
    {
      id: 'library',
      label: 'Indigo Vault',
      children: [
        {
          id: 'public',
          label: 'Public',
          children: [
            { id: 'docs', label: 'Product documentation' },
            { id: 'help', label: 'Help center' }
          ]
        },
        { id: 'legal', label: 'Legal' },
        { id: 'support', label: 'Support' },
        { id: 'engineering', label: 'Engineering' },
        { id: 'hr', label: 'HR' },
        { id: 'gtm', label: 'GTM' }
      ]
    }
  ];

  protected readonly owners: EdsListItem[] = this.config.collections.map((item) => ({
    label: item.owner,
    description: item.name + ' · ' + item.visibility
  }));

  protected selectedLabel(): string {
    const map: Record<string, string> = {
      library: 'Indigo Vault',
      public: 'Public',
      docs: 'Product documentation',
      help: 'Help center',
      legal: 'Legal',
      support: 'Support',
      engineering: 'Engineering',
      hr: 'HR',
      gtm: 'GTM'
    };
    return map[this.selectedId()] ?? 'Public';
  }

  protected selectedOwner(): string {
    const found = this.config.collections.find((item) => item.name === this.selectedLabel());
    return found?.owner ?? 'Ananya Poluru';
  }
}
