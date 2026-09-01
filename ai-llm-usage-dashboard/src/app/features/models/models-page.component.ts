import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
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
  type EdsListItem
} from '@poluru-labs/enterprise-design-system-angular';
import { templateConfig } from '../../core/config/template.config';
import { statusVariant } from '../../shared/utils/status-variant';
import { providerTree, selectedModelLabel, selectedModelOwner } from '../../shared/utils/usage';

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
          (nodeSelect)="onSelect($event)"
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
            <eds-status [label]="model.status" [variant]="statusVariant(model.status)"></eds-status>
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
  protected readonly statusVariant = statusVariant;
  protected readonly tree = providerTree(this.config.models);

  protected readonly expanded: Record<string, boolean> = {
    catalog: true,
    openai: true,
    anthropic: true
  };

  protected readonly owners: EdsListItem[] = this.config.models.map((item) => ({
    label: item.owner,
    description: item.title + ' · ' + item.access
  }));

  protected readonly selectedLabel = computed(() => selectedModelLabel(this.selectedId(), this.config.models));

  protected readonly selectedOwner = computed(() =>
    selectedModelOwner(this.selectedLabel(), this.config.models, this.config.user.name)
  );

  protected onSelect(id: string): void {
    this.selectedId.set(id);
    const model = this.config.models.find((item) => item.title === id);
    if (model) {
      this.access.set(model.access === 'Restricted' ? 'restricted' : 'open');
      this.enabled.set(model.status === 'Active');
    }
  }
}
