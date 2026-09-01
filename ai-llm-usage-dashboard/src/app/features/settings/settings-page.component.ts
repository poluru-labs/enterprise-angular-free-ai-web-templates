import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  EdsButtonComponent,
  EdsCardComponent,
  EdsCheckboxComponent,
  EdsCodeSnippetComponent,
  EdsDatePickerComponent,
  EdsDividerComponent,
  EdsIconComponent,
  EdsLinkComponent,
  EdsListComponent,
  EdsNumberInputComponent,
  EdsPinInputComponent,
  EdsSliderComponent,
  EdsStatusComponent,
  EdsSwitchComponent,
  EdsTimePickerComponent,
  type EdsListItem
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
    EdsDatePickerComponent,
    EdsDividerComponent,
    EdsIconComponent,
    EdsLinkComponent,
    EdsListComponent,
    EdsNumberInputComponent,
    EdsPinInputComponent,
    EdsSliderComponent,
    EdsStatusComponent,
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
      <eds-button variant="primary" size="sm" icon="save" (clicked)="save()">Save changes</eds-button>
    </section>

    @if (saved()) {
      <p class="notice">Settings saved for Lakshmi Poluru’s workspace.</p>
    }

    <section class="stack">
      <eds-card class="card-pad setting" [elevated]="false">
        <div>
          <h3>Budget alerts</h3>
          <p>Notify workspace owners when spend crosses 80% of the monthly budget.</p>
        </div>
        <eds-switch label="Enabled" [checked]="budgetAlerts()" (checkedChange)="toggle('budgetAlerts', $event)"></eds-switch>
      </eds-card>

      <eds-card class="card-pad setting" [elevated]="false">
        <div>
          <h3>Latency notifications</h3>
          <p>Alert Venkata Poluru when p95 exceeds 2 seconds for 5 minutes.</p>
        </div>
        <eds-switch
          label="Enabled"
          [checked]="latencyNotifications()"
          (checkedChange)="toggle('latencyNotifications', $event)"
        ></eds-switch>
      </eds-card>

      <eds-card class="card-pad setting" [elevated]="false">
        <div>
          <h3>Strict cost gate</h3>
          <p>Block new model calls once a workspace budget is fully consumed.</p>
        </div>
        <eds-switch label="Enabled" [checked]="strictCostGate()" (checkedChange)="toggle('strictCostGate', $event)"></eds-switch>
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
          (valueChange)="onCap($event)"
        ></eds-slider>
        <eds-number-input
          label="Alert at percent"
          [value]="alertPct()"
          [min]="50"
          [max]="100"
          [step]="5"
          (valueChange)="onAlertPct($event)"
        ></eds-number-input>
        <eds-checkbox
          label="Include embeddings in spend"
          [checked]="includeEmbeds()"
          (checkedChange)="toggle('includeEmbeds', $event)"
        ></eds-checkbox>
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <div class="section-head">
          <h3>API keys</h3>
          <eds-status label="5 keys" variant="info"></eds-status>
        </div>
        <eds-list [items]="keyItems" [divided]="true"></eds-list>
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
  protected readonly config = templateConfig;
  protected readonly saved = signal(false);
  protected readonly budgetAlerts = signal(true);
  protected readonly latencyNotifications = signal(true);
  protected readonly strictCostGate = signal(false);
  protected readonly cap = signal(1200);
  protected readonly alertPct = signal(80);
  protected readonly includeEmbeds = signal(true);
  protected readonly purgeDate = signal('2026-12-31');
  protected readonly digestTime = signal('02:30');
  protected readonly pin = signal('');

  protected readonly keyItems: EdsListItem[] = this.config.apiKeys.map((item) => ({
    label: item.name,
    description: `${item.workspace} · ${item.owner} · rotates ${item.rotates}`
  }));

  protected readonly samplePolicy = `{
  "owner": "Lakshmi Poluru",
  "alert_at": 0.8,
  "gate": false
}`;

  protected toggle(field: 'budgetAlerts' | 'latencyNotifications' | 'strictCostGate' | 'includeEmbeds', value: boolean): void {
    this[field].set(value);
    this.saved.set(false);
  }

  protected onCap(value: number): void {
    this.cap.set(value);
    this.saved.set(false);
  }

  protected onAlertPct(value: number): void {
    this.alertPct.set(value);
    this.saved.set(false);
  }

  protected save(): void {
    this.saved.set(true);
  }
}
