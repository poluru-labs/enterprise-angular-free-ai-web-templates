import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  EdsBadgeComponent,
  EdsCardComponent,
  EdsListComponent,
  EdsRadioComponent,
  EdsRadioGroupComponent,
  EdsStatusComponent,
  EdsSwitchComponent,
  EdsTagComponent,
  type EdsListItem
} from '@poluru-labs/enterprise-design-system-angular';
import { templateConfig } from '../../core/config/template.config';
import { statusVariant } from '../../shared/utils/status-variant';
import { rankModels } from '../../shared/utils/eval';

@Component({
  selector: 'app-models-page',
  standalone: true,
  imports: [
    EdsBadgeComponent,
    EdsCardComponent,
    EdsListComponent,
    EdsRadioComponent,
    EdsRadioGroupComponent,
    EdsStatusComponent,
    EdsSwitchComponent,
    EdsTagComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Checkpoints</p>
        <h1>Models</h1>
        <p class="summary">Compare families and checkpoints before Ananya Poluru opens a release scorecard.</p>
      </div>
      <eds-badge [label]="ranked.length + ' models'" variant="brand" [soft]="true" [pill]="true"></eds-badge>
    </section>

    <section class="split">
      <eds-card class="card-pad" [elevated]="false">
        <div class="section-head">
          <h2>{{ selected().name }}</h2>
          <eds-tag [label]="selected().family" variant="brand"></eds-tag>
        </div>
        <p class="meta">{{ selected().checkpoint }} · Owner {{ selected().owner }}</p>
        <div class="setting" style="margin-top: 0.85rem">
          <div>
            <h3>Include in weekly battery</h3>
            <p>Queue this checkpoint on every required suite.</p>
          </div>
          <eds-switch label="Enabled" [checked]="inBattery()" (checkedChange)="inBattery.set($event)"></eds-switch>
        </div>
        <div style="margin-top: 0.9rem">
          <eds-radio-group label="Release track" name="track" [value]="track()" (valueChange)="track.set($event)">
            <eds-radio label="Candidate" value="candidate"></eds-radio>
            <eds-radio label="Baseline" value="baseline"></eds-radio>
            <eds-radio label="Watch" value="watch"></eds-radio>
          </eds-radio-group>
        </div>
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <h2>Owners</h2>
        <eds-list [items]="owners" [divided]="true"></eds-list>
      </eds-card>
    </section>

    <section class="grid-3" style="margin-top: 0.9rem">
      @for (model of ranked; track model.name) {
        <eds-card
          class="card-pad collection-card"
          [class.selected-card]="selectedName() === model.name"
          [elevated]="false"
          (click)="onSelect(model.name)"
        >
          <div class="section-head">
            <h3>{{ model.name }}</h3>
            <eds-status [label]="model.status" [variant]="statusVariant(model.status)"></eds-status>
          </div>
          <p class="meta">{{ model.family }} · {{ model.checkpoint }}</p>
          <p class="meta">Best {{ model.bestScore }} · {{ model.suitesPassed }} suites passed</p>
          <div footer class="card-actions">
            <eds-tag [label]="model.owner" variant="info"></eds-tag>
          </div>
        </eds-card>
      }
    </section>
  `
})
export class ModelsPageComponent {
  protected readonly config = templateConfig;
  protected readonly ranked = rankModels(this.config.models);
  protected readonly selectedName = signal(this.ranked[0]?.name ?? '');
  protected readonly inBattery = signal(true);
  protected readonly track = signal('candidate');
  protected readonly statusVariant = statusVariant;

  protected readonly owners: EdsListItem[] = this.config.models.map((item) => ({
    label: item.owner,
    description: `${item.name} · ${item.status}`
  }));

  protected readonly selected = computed(
    () => this.ranked.find((item) => item.name === this.selectedName()) ?? this.ranked[0]
  );

  protected onSelect(name: string): void {
    this.selectedName.set(name);
    const model = this.config.models.find((item) => item.name === name);
    if (!model) {
      return;
    }
    this.track.set(model.status === 'Baseline' ? 'baseline' : model.status === 'Watch' ? 'watch' : 'candidate');
    this.inBattery.set(model.status !== 'Retired');
  }
}
