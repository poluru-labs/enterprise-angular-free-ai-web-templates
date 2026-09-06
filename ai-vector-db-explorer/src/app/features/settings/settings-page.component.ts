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
        <p class="summary">Govern upserts, replicas, and retention for Maya Poluru’s Lattice workspace.</p>
      </div>
      <eds-button variant="primary" size="sm" icon="save" (clicked)="save()">Save changes</eds-button>
    </section>

    @if (saved()) {
      <p class="notice">Settings saved for Maya Poluru’s workspace.</p>
    }

    <section class="stack">
      <eds-card class="card-pad setting" [elevated]="false">
        <div>
          <h3>Auto-rebuild HNSW</h3>
          <p>Rebuild docs-prod after a nightly upsert above 20k vectors.</p>
        </div>
        <eds-switch label="Enabled" [checked]="autoRebuild()" (checkedChange)="toggle('autoRebuild', $event)"></eds-switch>
      </eds-card>

      <eds-card class="card-pad setting" [elevated]="false">
        <div>
          <h3>Warm replicas</h3>
          <p>Keep eu-live and us-live warm for Maya Poluru’s query traffic.</p>
        </div>
        <eds-switch label="Enabled" [checked]="warmReplicas()" (checkedChange)="toggle('warmReplicas', $event)"></eds-switch>
      </eds-card>

      <eds-card class="card-pad setting" [elevated]="false">
        <div>
          <h3>Legal-hold freeze</h3>
          <p>Block writes on session-memory for Priya Poluru’s audit window.</p>
        </div>
        <eds-switch label="Enabled" [checked]="legalHold()" (checkedChange)="toggle('legalHold', $event)"></eds-switch>
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <h3>Serving</h3>
        <p class="meta">How aggressive Lattice should be with k and replica count.</p>
        <eds-slider
          label="Default k"
          [min]="3"
          [max]="25"
          [step]="1"
          [value]="defaultK()"
          [showValue]="true"
          (valueChange)="onK($event)"
        ></eds-slider>
        <eds-number-input
          label="Replica count"
          [value]="replicas()"
          [min]="1"
          [max]="8"
          [step]="1"
          (valueChange)="onReplicas($event)"
        ></eds-number-input>
        <eds-checkbox
          label="Drop neighbors below the min score"
          [checked]="dropWeak()"
          (checkedChange)="toggle('dropWeak', $event)"
        ></eds-checkbox>
        <eds-radio-group label="Default metric" name="metric" [value]="metric()" (valueChange)="metric.set($event)">
          <eds-radio label="Cosine" value="cosine"></eds-radio>
          <eds-radio label="Dot" value="dot"></eds-radio>
          <eds-radio label="L2" value="l2"></eds-radio>
        </eds-radio-group>
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <h3>Owners</h3>
        <eds-list [items]="ownerItems" [divided]="true"></eds-list>
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <h3>Retention</h3>
        <eds-date-picker
          label="Purge stale vectors after"
          hint="TTL for session-memory"
          [value]="purgeDate()"
          (valueChange)="purgeDate.set($event)"
        ></eds-date-picker>
        <eds-time-picker
          label="Nightly eval"
          hint="Kavya Poluru’s recall job"
          [value]="digestTime()"
          (valueChange)="digestTime.set($event)"
        ></eds-time-picker>
        <eds-file-upload label="Eval pack" hint="JSON or parquet, mock only" accept=".json,.parquet"></eds-file-upload>
        <eds-code-snippet [code]="samplePolicy" language="json" label="Index policy"></eds-code-snippet>
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
  protected readonly autoRebuild = signal(true);
  protected readonly warmReplicas = signal(true);
  protected readonly legalHold = signal(true);
  protected readonly defaultK = signal(10);
  protected readonly replicas = signal(3);
  protected readonly dropWeak = signal(true);
  protected readonly metric = signal('cosine');
  protected readonly purgeDate = signal('2026-12-31');
  protected readonly digestTime = signal('02:30');
  protected readonly pin = signal('');

  protected readonly ownerItems: EdsListItem[] = this.config.owners.map((entry) => ({
    label: entry.name,
    description: entry.focus
  }));

  protected readonly samplePolicy = `{
  "owner": "Maya Poluru",
  "metric": "cosine",
  "graph": "hnsw",
  "default_k": 10
}`;

  protected toggle(field: 'autoRebuild' | 'warmReplicas' | 'legalHold' | 'dropWeak', value: boolean): void {
    this[field].set(value);
    this.saved.set(false);
  }

  protected onK(value: number): void {
    this.defaultK.set(value);
    this.saved.set(false);
  }

  protected onReplicas(value: number): void {
    this.replicas.set(value);
    this.saved.set(false);
  }

  protected save(): void {
    this.saved.set(true);
  }
}
