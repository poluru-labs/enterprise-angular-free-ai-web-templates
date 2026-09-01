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
import { templateConfig } from '../../core/config/template.config';
import { statusVariant } from '../../shared/utils/status-variant';
import { selectedSignalLabel, selectedSignalOwner, signalTree } from '../../shared/utils/sales';

@Component({
  selector: 'app-signals-page',
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
        <p class="eyebrow">Intelligence</p>
        <h1>Signals</h1>
        <p class="summary">Live buying signals Ananya Poluru’s team can act on. Keep routing simple: new, review, or ready.</p>
      </div>
      <eds-badge [label]="config.signals.length + ' signals'" variant="brand" [soft]="true" [pill]="true"></eds-badge>
    </section>

    <section class="split">
      <eds-card class="card-pad" [elevated]="false">
        <div class="section-head">
          <h2>Signal map</h2>
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
              <h3>Push to sellers</h3>
              <p>Include this signal in next-best-action queues.</p>
            </div>
            <eds-switch label="Enabled" [checked]="enabled()" (checkedChange)="enabled.set($event)"></eds-switch>
          </div>
          <eds-checkbox
            label="Require owner confirmation before sequencing"
            [checked]="confirm()"
            (checkedChange)="confirm.set($event)"
          ></eds-checkbox>
          <div style="margin-top: 0.9rem">
            <eds-radio-group label="Priority" name="priority" [value]="priority()" (valueChange)="priority.set($event)">
              <eds-radio label="High" value="high"></eds-radio>
              <eds-radio label="Normal" value="normal"></eds-radio>
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
      @for (item of config.signals; track item.title) {
        <eds-card class="card-pad collection-card" [elevated]="false">
          <div class="section-head">
            <h3>{{ item.title }}</h3>
            <eds-status [label]="item.status" [variant]="statusVariant(item.status)"></eds-status>
          </div>
          <p class="meta meta-clamp">{{ item.detail }}</p>
          <p class="meta">{{ item.account }} · {{ item.owner }}</p>
          <div footer class="card-actions">
            <eds-tag [label]="item.type" variant="brand"></eds-tag>
          </div>
        </eds-card>
      }
    </section>
  `
})
export class SignalsPageComponent {
  protected readonly config = templateConfig;
  protected readonly statusVariant = statusVariant;
  protected readonly selectedId = signal('expansion');
  protected readonly enabled = signal(true);
  protected readonly confirm = signal(true);
  protected readonly priority = signal('high');

  protected readonly expanded: Record<string, boolean> = {
    workspace: true,
    expansion: true
  };

  protected readonly tree: EdsTreeNode[] = signalTree(this.config.signals);

  protected readonly owners: EdsListItem[] = this.config.signals.map((item) => ({
    label: item.owner,
    description: item.account + ' · ' + item.type
  }));

  protected selectedLabel(): string {
    return selectedSignalLabel(this.selectedId(), this.config.signals);
  }

  protected selectedOwner(): string {
    return selectedSignalOwner(this.selectedLabel(), this.config.signals, 'Rohan Poluru');
  }
}
