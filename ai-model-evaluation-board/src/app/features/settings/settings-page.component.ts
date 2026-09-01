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
        <p class="summary">Govern auto-runs, reviewer notices, and the release gate for Ananya Poluru’s quality workspace.</p>
      </div>
      <eds-button variant="primary" size="sm" icon="save" (clicked)="save()">Save changes</eds-button>
    </section>

    @if (saved()) {
      <p class="notice">Settings saved for Ananya Poluru’s workspace.</p>
    }

    <section class="stack">
      <eds-card class="card-pad setting" [elevated]="false">
        <div>
          <h3>Auto-run regression suites</h3>
          <p>Trigger the full regression battery on every model checkpoint push.</p>
        </div>
        <eds-switch label="Enabled" [checked]="autoRegression()" (checkedChange)="toggle('autoRegression', $event)"></eds-switch>
      </eds-card>

      <eds-card class="card-pad setting" [elevated]="false">
        <div>
          <h3>Reviewer notifications</h3>
          <p>Notify assigned reviewers when a scorecard is ready for sign-off.</p>
        </div>
        <eds-switch
          label="Enabled"
          [checked]="reviewerNotifications()"
          (checkedChange)="toggle('reviewerNotifications', $event)"
        ></eds-switch>
      </eds-card>

      <eds-card class="card-pad setting" [elevated]="false">
        <div>
          <h3>Strict release gate</h3>
          <p>Block release when any suite score falls below the approved baseline.</p>
        </div>
        <eds-switch label="Enabled" [checked]="strictGate()" (checkedChange)="toggle('strictGate', $event)"></eds-switch>
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <div class="section-head">
          <h3>Baselines</h3>
          <eds-status label="Required suites" variant="info"></eds-status>
        </div>
        <p class="meta">Minimum score before a scorecard can sign off.</p>
        <eds-slider
          label="Quality floor (%)"
          [min]="70"
          [max]="99"
          [step]="1"
          [value]="qualityFloor()"
          [showValue]="true"
          (valueChange)="onFloor($event)"
        ></eds-slider>
        <eds-number-input
          label="Safety floor (%)"
          [value]="safetyFloor()"
          [min]="80"
          [max]="99"
          [step]="1"
          (valueChange)="onSafety($event)"
        ></eds-number-input>
        <eds-checkbox
          label="Require multilingual QA on every candidate"
          [checked]="requireMultilingual()"
          (checkedChange)="toggle('requireMultilingual', $event)"
        ></eds-checkbox>
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <h3>Gate policy</h3>
        <eds-code-snippet [code]="samplePolicy" language="json" label="Release gate"></eds-code-snippet>
        <eds-divider spacing="md" label="Workspace"></eds-divider>
        <p class="meta">Owned by {{ config.user.name }} · {{ config.workspace }}</p>
      </eds-card>
    </section>
  `
})
export class SettingsPageComponent {
  protected readonly config = templateConfig;
  protected readonly saved = signal(false);
  protected readonly autoRegression = signal(true);
  protected readonly reviewerNotifications = signal(true);
  protected readonly strictGate = signal(false);
  protected readonly qualityFloor = signal(90);
  protected readonly safetyFloor = signal(91);
  protected readonly requireMultilingual = signal(true);

  protected readonly samplePolicy = `{
  "owner": "Ananya Poluru",
  "quality_floor": 0.9,
  "safety_floor": 0.91,
  "strict_gate": false
}`;

  protected toggle(
    field: 'autoRegression' | 'reviewerNotifications' | 'strictGate' | 'requireMultilingual',
    value: boolean
  ): void {
    this[field].set(value);
    this.saved.set(false);
  }

  protected onFloor(value: number): void {
    this.qualityFloor.set(value);
    this.saved.set(false);
  }

  protected onSafety(value: number): void {
    this.safetyFloor.set(value);
    this.saved.set(false);
  }

  protected save(): void {
    this.saved.set(true);
  }
}
