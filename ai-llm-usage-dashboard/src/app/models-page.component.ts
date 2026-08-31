import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  EdsBadgeComponent,
  EdsCardComponent,
  EdsCheckboxComponent,
  EdsListComponent,
  EdsRadioComponent,
  EdsRadioGroupComponent,
  EdsStatusComponent,
  EdsSwitchComponent,
  EdsTagComponent,
  EdsTreeViewComponent,
  type EdsListItem,
  type EdsTreeNode
} from '@poluru-labs/enterprise-design-system-angular';
import { templateConfig } from '../template.config';

@Component({
  selector: 'app-models-page',
  standalone: true,
  imports: [
    EdsBadgeComponent,
    EdsCardComponent,
    EdsCheckboxComponent,
    EdsListComponent,
    EdsRadioComponent,
    EdsRadioGroupComponent,
    EdsStatusComponent,
    EdsSwitchComponent,
    EdsTagComponent,
    EdsTreeViewComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Catalog</p>
        <h1>Models</h1>
        <p class="summary">Endpoints Lakshmi Poluru’s platform team can route. Access stays simple: open or restricted.</p>
      </div>
      <eds-badge [label]="config.models.length + ' models'" variant="brand" [soft]="true" [pill]="true"></eds-badge>
    </section>

    <section class="split">
      <eds-card class="card-pad" [elevated]="false">
        <div class="section-head">
          <h2>Providers</h2>
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
              <h3>Available to copilots</h3>
              <p>Include this model in production routing.</p>
            </div>
            <eds-switch label="Enabled" [checked]="enabled()" (checkedChange)="enabled.set($event)"></eds-switch>
          </div>
          <eds-checkbox
            label="Require cost attribution on every call"
            [checked]="attribution()"
            (checkedChange)="attribution.set($event)"
          ></eds-checkbox>
          <div style="margin-top: 0.9rem">
            <eds-radio-group label="Access" name="access" [value]="access()" (valueChange)="access.set($event)">
              <eds-radio label="Open" value="open"></eds-radio>
              <eds-radio label="Restricted" value="restricted"></eds-radio>
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
      @for (model of config.models; track model.title) {
        <eds-card class="card-pad collection-card" [elevated]="false">
          <div class="section-head">
            <h3>{{ model.title }}</h3>
            <eds-status [label]="model.status" [variant]="model.status === 'Active' ? 'success' : 'warning'"></eds-status>
          </div>
          <p class="meta">{{ model.detail }}</p>
          <p class="meta">Owner {{ model.owner }}</p>
          <eds-tag [label]="model.access === 'Restricted' ? 'Restricted access' : model.provider" variant="brand"></eds-tag>
        </eds-card>
      }
    </section>
  `
})
export class ModelsPageComponent {
  protected readonly config = templateConfig;
  protected readonly selectedId = signal('openai');
  protected readonly enabled = signal(true);
  protected readonly attribution = signal(true);
  protected readonly access = signal('open');

  protected readonly expanded: Record<string, boolean> = {
    catalog: true,
    openai: true
  };

  protected readonly tree: EdsTreeNode[] = [
    {
      id: 'catalog',
      label: 'Lilac Meter',
      children: [
        {
          id: 'openai',
          label: 'OpenAI',
          children: [
            { id: 'gpt-4.1', label: 'gpt-4.1' },
            { id: 'embed-3-large', label: 'embed-3-large' }
          ]
        },
        { id: 'anthropic', label: 'Anthropic' },
        { id: 'google', label: 'Google' },
        { id: 'meta', label: 'Meta' },
        { id: 'mistral', label: 'Mistral' }
      ]
    }
  ];

  protected readonly owners: EdsListItem[] = this.config.models.map((item) => ({
    label: item.owner,
    description: item.title + ' · ' + item.access
  }));

  protected selectedLabel(): string {
    const map: Record<string, string> = {
      catalog: 'Lilac Meter',
      openai: 'OpenAI',
      'gpt-4.1': 'gpt-4.1',
      'embed-3-large': 'embed-3-large',
      anthropic: 'Anthropic',
      google: 'Google',
      meta: 'Meta',
      mistral: 'Mistral'
    };
    return map[this.selectedId()] ?? 'OpenAI';
  }

  protected selectedOwner(): string {
    const found = this.config.models.find((item) => item.title === this.selectedLabel() || item.provider === this.selectedLabel());
    return found?.owner ?? 'Lakshmi Poluru';
  }
}
