import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  EdsButtonComponent,
  EdsCardComponent,
  EdsCheckboxComponent,
  EdsCodeSnippetComponent,
  EdsDividerComponent,
  EdsNumberInputComponent,
  EdsSliderComponent,
  EdsStatusComponent,
  EdsSwitchComponent
} from '@poluru-labs/enterprise-design-system-angular';
import { templateConfig } from '../../core/config/template.config';
import { canPublish } from '../../shared/utils/prompt';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [
    EdsButtonComponent,
    EdsCardComponent,
    EdsCheckboxComponent,
    EdsCodeSnippetComponent,
    EdsDividerComponent,
    EdsNumberInputComponent,
    EdsSliderComponent,
    EdsStatusComponent,
    EdsSwitchComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Workspace</p>
        <h1>Settings</h1>
        <p class="summary">Govern review gates, success floors, and auto-publish for Priya Poluru’s prompt workspace.</p>
      </div>
      <eds-button variant="primary" size="sm" icon="save" (clicked)="save()">Save changes</eds-button>
    </section>

    @if (saved()) {
      <p class="notice">Settings saved for Priya Poluru’s workspace.</p>
    }

    <section class="stack">
      <eds-card class="card-pad setting" [elevated]="false">
        <div>
          <h3>Require review before publish</h3>
          <p>Drafts stay in review until a collection owner or Priya Poluru signs off.</p>
        </div>
        <eds-switch label="Enabled" [checked]="reviewGate()" (checkedChange)="toggle('reviewGate', $event)"></eds-switch>
      </eds-card>

      <eds-card class="card-pad setting" [elevated]="false">
        <div>
          <h3>Owner notifications</h3>
          <p>Notify assigned owners when a prompt is ready for review.</p>
        </div>
        <eds-switch
          label="Enabled"
          [checked]="ownerNotifications()"
          (checkedChange)="toggle('ownerNotifications', $event)"
        ></eds-switch>
      </eds-card>

      <eds-card class="card-pad setting" [elevated]="false">
        <div>
          <h3>Auto-promote experiment winners</h3>
          <p>Ship a challenger to live when the experiment is marked winner.</p>
        </div>
        <eds-switch label="Enabled" [checked]="autoPromote()" (checkedChange)="toggle('autoPromote', $event)"></eds-switch>
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <div class="section-head">
          <h3>Success floor</h3>
          <eds-status [label]="floorLabel()" variant="info"></eds-status>
        </div>
        <p class="meta">Minimum playground success before a prompt can publish.</p>
        <eds-slider
          label="Success floor (%)"
          [min]="70"
          [max]="99"
          [step]="1"
          [value]="successFloor()"
          [showValue]="true"
          (valueChange)="onFloor($event)"
        ></eds-slider>
        <eds-number-input
          label="Review SLA (hours)"
          [value]="reviewSla()"
          [min]="4"
          [max]="72"
          [step]="1"
          (valueChange)="onSla($event)"
        ></eds-number-input>
        <eds-checkbox
          label="Require a collection owner on every live prompt"
          [checked]="requireOwner()"
          (checkedChange)="toggle('requireOwner', $event)"
        ></eds-checkbox>
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <h3>Publish policy</h3>
        <eds-code-snippet [code]="samplePolicy" language="json" label="Publish gate"></eds-code-snippet>
        <eds-divider spacing="md" label="Workspace"></eds-divider>
        <p class="meta">Owned by {{ config.user.name }} · {{ config.workspace }}</p>
      </eds-card>
    </section>
  `
})
export class SettingsPageComponent {
  protected readonly config = templateConfig;
  protected readonly saved = signal(false);
  protected readonly reviewGate = signal(true);
  protected readonly ownerNotifications = signal(true);
  protected readonly autoPromote = signal(false);
  protected readonly successFloor = signal(88);
  protected readonly reviewSla = signal(24);
  protected readonly requireOwner = signal(true);

  protected readonly samplePolicy = `{
  "owner": "Priya Poluru",
  "success_floor": 0.88,
  "review_gate": true,
  "auto_promote": false
}`;

  protected floorLabel(): string {
    return canPublish('91.8%', this.successFloor()) ? 'Library meets floor' : 'Below floor';
  }

  protected toggle(
    field: 'reviewGate' | 'ownerNotifications' | 'autoPromote' | 'requireOwner',
    value: boolean
  ): void {
    this[field].set(value);
    this.saved.set(false);
  }

  protected onFloor(value: number): void {
    this.successFloor.set(value);
    this.saved.set(false);
  }

  protected onSla(value: number): void {
    this.reviewSla.set(value);
    this.saved.set(false);
  }

  protected save(): void {
    this.saved.set(true);
  }
}
