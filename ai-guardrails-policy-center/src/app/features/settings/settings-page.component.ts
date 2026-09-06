import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  EdsButtonComponent,
  EdsCardComponent,
  EdsCheckboxComponent,
  EdsCodeSnippetComponent,
  EdsDatePickerComponent,
  EdsDividerComponent,
  EdsFileUploadComponent,
  EdsIconComponent,
  EdsLinkComponent,
  EdsListComponent,
  EdsNumberInputComponent,
  EdsPinInputComponent,
  EdsRadioComponent,
  EdsRadioGroupComponent,
  EdsSliderComponent,
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
    EdsFileUploadComponent,
    EdsIconComponent,
    EdsLinkComponent,
    EdsListComponent,
    EdsNumberInputComponent,
    EdsPinInputComponent,
    EdsRadioComponent,
    EdsRadioGroupComponent,
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
        <p class="summary">Govern thresholds, logging, and retention for Maya Poluru’s Reef workspace.</p>
      </div>
      <eds-button variant="primary" size="sm" icon="save" (clicked)="save()">Save changes</eds-button>
    </section>

    @if (saved()) {
      <p class="notice">Settings saved for Maya Poluru’s workspace.</p>
    }

    <section class="stack">
      <eds-card class="card-pad setting" [elevated]="false">
        <div>
          <h3>Log blocked prompts</h3>
          <p>Keep snippets for Maya Poluru’s review queue on chat-prod.</p>
        </div>
        <eds-switch label="Enabled" [checked]="logBlocked()" (checkedChange)="toggle('logBlocked', $event)"></eds-switch>
      </eds-card>

      <eds-card class="card-pad setting" [elevated]="false">
        <div>
          <h3>Hash SSN on ingest</h3>
          <p>Kavya Poluru’s pii-strict pack hashes digits before they reach traces.</p>
        </div>
        <eds-switch label="Enabled" [checked]="hashSsn()" (checkedChange)="toggle('hashSsn', $event)"></eds-switch>
      </eds-card>

      <eds-card class="card-pad setting" [elevated]="false">
        <div>
          <h3>Shadow canary</h3>
          <p>Score research-canary without blocking Arjun Poluru’s eval traffic.</p>
        </div>
        <eds-switch label="Enabled" [checked]="shadowCanary()" (checkedChange)="toggle('shadowCanary', $event)"></eds-switch>
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <h3>Thresholds</h3>
        <p class="meta">How aggressive Reef should be with jailbreak and PII floors.</p>
        <eds-slider
          label="Jailbreak floor"
          [min]="0.4"
          [max]="0.95"
          [step]="0.01"
          [value]="jailbreak()"
          [showValue]="true"
          (valueChange)="onJailbreak($event)"
        ></eds-slider>
        <eds-number-input
          label="Retention days"
          [value]="retention()"
          [min]="7"
          [max]="90"
          [step]="1"
          (valueChange)="onRetention($event)"
        ></eds-number-input>
        <eds-checkbox
          label="Drop hits below the floor"
          [checked]="dropWeak()"
          (checkedChange)="toggle('dropWeak', $event)"
        ></eds-checkbox>
        <eds-radio-group label="Default action" name="action" [value]="action()" (valueChange)="action.set($event)">
          <eds-radio label="Block" value="block"></eds-radio>
          <eds-radio label="Flag" value="flag"></eds-radio>
          <eds-radio label="Log" value="log"></eds-radio>
        </eds-radio-group>
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <h3>Owners</h3>
        <eds-list [items]="ownerItems" [divided]="true"></eds-list>
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <h3>Retention</h3>
        <eds-date-picker
          label="Purge traces after"
          hint="TTL for flagged snippets"
          [value]="purgeDate()"
          (valueChange)="purgeDate.set($event)"
        ></eds-date-picker>
        <eds-time-picker
          label="Nightly eval"
          hint="Kavya Poluru’s PII catch job"
          [value]="digestTime()"
          (valueChange)="digestTime.set($event)"
        ></eds-time-picker>
        <eds-file-upload label="Eval pack" hint="JSON traces, mock only" accept=".json"></eds-file-upload>
        <eds-code-snippet [code]="samplePolicy" language="json" label="Safety policy"></eds-code-snippet>
        <eds-divider spacing="md" label="Admin"></eds-divider>
        <eds-pin-input
          label="Confirm destructive actions"
          [length]="4"
          [value]="pin()"
          (valueChange)="pin.set($event)"
        ></eds-pin-input>
        <p class="meta" style="margin-top: 0.75rem">
          <eds-icon name="lock" size="sm" [decorative]="true"></eds-icon>
          PIN is held by Maya Poluru ·
          <eds-link href="https://polurus.com" [external]="true">Workspace docs</eds-link>
        </p>
      </eds-card>
    </section>
  `
})
export class SettingsPageComponent {
  protected readonly config = templateConfig;
  protected readonly saved = signal(false);
  protected readonly logBlocked = signal(true);
  protected readonly hashSsn = signal(true);
  protected readonly shadowCanary = signal(true);
  protected readonly jailbreak = signal(0.72);
  protected readonly retention = signal(30);
  protected readonly dropWeak = signal(true);
  protected readonly action = signal('block');
  protected readonly purgeDate = signal('2026-12-31');
  protected readonly digestTime = signal('02:30');
  protected readonly pin = signal('');

  protected readonly ownerItems: EdsListItem[] = this.config.owners.map((entry) => ({
    label: entry.name,
    description: entry.focus
  }));

  protected readonly samplePolicy = `{
  "owner": "Maya Poluru",
  "pack": "safety-core",
  "jailbreak": 0.72,
  "pii": "pii-strict"
}`;

  protected toggle(field: 'logBlocked' | 'hashSsn' | 'shadowCanary' | 'dropWeak', value: boolean): void {
    this[field].set(value);
    this.saved.set(false);
  }

  protected onJailbreak(value: number): void {
    this.jailbreak.set(value);
    this.saved.set(false);
  }

  protected onRetention(value: number): void {
    this.retention.set(value);
    this.saved.set(false);
  }

  protected save(): void {
    this.saved.set(true);
  }
}
