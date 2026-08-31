import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  EdsCardComponent,
  EdsCheckboxComponent,
  EdsCodeSnippetComponent,
  EdsDatePickerComponent,
  EdsDividerComponent,
  EdsIconComponent,
  EdsLinkComponent,
  EdsNumberInputComponent,
  EdsPinInputComponent,
  EdsSliderComponent,
  EdsSwitchComponent,
  EdsTimePickerComponent
} from '@poluru-labs/enterprise-design-system-angular';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [
    EdsCardComponent,
    EdsCheckboxComponent,
    EdsCodeSnippetComponent,
    EdsDatePickerComponent,
    EdsDividerComponent,
    EdsIconComponent,
    EdsLinkComponent,
    EdsNumberInputComponent,
    EdsPinInputComponent,
    EdsSliderComponent,
    EdsSwitchComponent,
    EdsTimePickerComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Workspace</p>
        <h1>Settings</h1>
        <p class="summary">Govern alerts, cost gates, and retention for Lakshmi Poluru’s platform workspace.</p>
      </div>
    </section>

    <section class="stack">
      <eds-card class="card-pad setting" [elevated]="false">
        <div>
          <h3>Budget alerts</h3>
          <p>Notify workspace owners when spend crosses 80% of the monthly budget.</p>
        </div>
        <eds-switch label="Enabled" [checked]="budgetAlerts()" (checkedChange)="budgetAlerts.set($event)"></eds-switch>
      </eds-card>

      <eds-card class="card-pad setting" [elevated]="false">
        <div>
          <h3>Latency notifications</h3>
          <p>Alert Venkata Poluru when p95 exceeds 2 seconds for 5 minutes.</p>
        </div>
        <eds-switch
          label="Enabled"
          [checked]="latencyNotifications()"
          (checkedChange)="latencyNotifications.set($event)"
        ></eds-switch>
      </eds-card>

      <eds-card class="card-pad setting" [elevated]="false">
        <div>
          <h3>Strict cost gate</h3>
          <p>Block new model calls once a workspace budget is fully consumed.</p>
        </div>
        <eds-switch label="Enabled" [checked]="strictCostGate()" (checkedChange)="strictCostGate.set($event)"></eds-switch>
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <h3>Caps</h3>
        <p class="meta">Default monthly budget for new workspaces.</p>
        <eds-slider
          label="Default cap (USD)"
          [min]="250"
          [max]="5000"
          [step]="50"
          [value]="cap()"
          [showValue]="true"
          (valueChange)="cap.set($event)"
        ></eds-slider>
        <eds-number-input
          label="Alert at percent"
          [value]="alertPct()"
          [min]="50"
          [max]="100"
          [step]="5"
          (valueChange)="alertPct.set($event)"
        ></eds-number-input>
        <eds-checkbox
          label="Include embeddings in spend"
          [checked]="includeEmbeds()"
          (checkedChange)="includeEmbeds.set($event)"
        ></eds-checkbox>
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <h3>Retention</h3>
        <eds-date-picker
          label="Purge usage logs after"
          hint="Raw token rows stay until this date"
          [value]="purgeDate()"
          (valueChange)="purgeDate.set($event)"
        ></eds-date-picker>
        <eds-time-picker
          label="Nightly digest"
          hint="Priya Poluru’s finance job"
          [value]="digestTime()"
          (valueChange)="digestTime.set($event)"
        ></eds-time-picker>
        <eds-code-snippet [code]="samplePolicy" language="json" label="Alert policy"></eds-code-snippet>
        <eds-divider spacing="md" label="Admin"></eds-divider>
        <eds-pin-input
          label="Confirm destructive actions"
          [length]="4"
          [value]="pin()"
          (valueChange)="pin.set($event)"
        ></eds-pin-input>
        <p class="meta" style="margin-top: 0.75rem">
          <eds-icon name="lock" size="sm" [decorative]="true"></eds-icon>
          PIN is held by Lakshmi Poluru ·
          <eds-link href="https://polurulabs.com" [external]="true">Workspace docs</eds-link>
        </p>
      </eds-card>
    </section>
  `
})
export class SettingsPageComponent {
  protected readonly budgetAlerts = signal(true);
  protected readonly latencyNotifications = signal(true);
  protected readonly strictCostGate = signal(false);
  protected readonly cap = signal(1200);
  protected readonly alertPct = signal(80);
  protected readonly includeEmbeds = signal(true);
  protected readonly purgeDate = signal('2026-12-31');
  protected readonly digestTime = signal('02:30');
  protected readonly pin = signal('');

  protected readonly samplePolicy = `{
  "owner": "Lakshmi Poluru",
  "alert_at": 0.8,
  "gate": false
}`;
}
