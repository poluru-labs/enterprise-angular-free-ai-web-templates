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
        <p class="summary">Govern chunking, freshness, and access for Ananya Poluru’s knowledge workspace.</p>
      </div>
      <eds-button variant="primary" size="sm" icon="save" (clicked)="save()">Save changes</eds-button>
    </section>

    @if (saved()) {
      <p class="notice">Settings saved for Ananya Poluru’s workspace.</p>
    }

    <section class="stack">
      <eds-card class="card-pad setting" [elevated]="false">
        <div>
          <h3>Hybrid search</h3>
          <p>Blend dense embeddings with BM25 and require citations on answers.</p>
        </div>
        <eds-switch label="Enabled" [checked]="hybrid()" (checkedChange)="toggle('hybrid', $event)"></eds-switch>
      </eds-card>

      <eds-card class="card-pad setting" [elevated]="false">
        <div>
          <h3>ACL freeze on review</h3>
          <p>Pause retrieval when Venkata Poluru flags a source for access review.</p>
        </div>
        <eds-switch label="Enabled" [checked]="aclFreeze()" (checkedChange)="toggle('aclFreeze', $event)"></eds-switch>
      </eds-card>

      <eds-card class="card-pad setting" [elevated]="false">
        <div>
          <h3>PII redaction</h3>
          <p>Strip emails, phone numbers, and contract IDs before embedding.</p>
        </div>
        <eds-switch label="Enabled" [checked]="piiRedaction()" (checkedChange)="toggle('piiRedaction', $event)"></eds-switch>
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <h3>Chunking</h3>
        <p class="meta">Default splitter for new sources.</p>
        <eds-slider
          label="Chunk size"
          [min]="256"
          [max]="1024"
          [step]="64"
          [value]="chunkSize()"
          [showValue]="true"
          (valueChange)="onChunkSize($event)"
        ></eds-slider>
        <eds-number-input
          label="Overlap tokens"
          [value]="overlap()"
          [min]="0"
          [max]="256"
          [step]="16"
          (valueChange)="onOverlap($event)"
        ></eds-number-input>
        <eds-checkbox
          label="Strip boilerplate headers and nav"
          [checked]="stripNav()"
          (checkedChange)="toggle('stripNav', $event)"
        ></eds-checkbox>
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <div class="section-head">
          <h3>Connectors</h3>
          <eds-status [label]="config.connectors.length + ' live'" variant="info"></eds-status>
        </div>
        <eds-list [items]="connectorItems" [divided]="true"></eds-list>
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <h3>Retention</h3>
        <eds-date-picker
          label="Purge drafts after"
          hint="Soft-deleted chunks stay until this date"
          [value]="purgeDate()"
          (valueChange)="purgeDate.set($event)"
        ></eds-date-picker>
        <eds-time-picker
          label="Nightly eval window"
          hint="Meera Poluru’s quality job"
          [value]="evalTime()"
          (valueChange)="evalTime.set($event)"
        ></eds-time-picker>
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
          PIN is held by Ananya Poluru ·
          <eds-link href="https://polurulabs.com" [external]="true">Workspace docs</eds-link>
        </p>
      </eds-card>
    </section>
  `
})
export class SettingsPageComponent {
  protected readonly config = templateConfig;
  protected readonly saved = signal(false);
  protected readonly hybrid = signal(true);
  protected readonly aclFreeze = signal(true);
  protected readonly piiRedaction = signal(true);
  protected readonly chunkSize = signal(512);
  protected readonly overlap = signal(64);
  protected readonly stripNav = signal(true);
  protected readonly purgeDate = signal('2026-12-31');
  protected readonly evalTime = signal('02:30');
  protected readonly pin = signal('');

  protected readonly connectorItems: EdsListItem[] = this.config.connectors.map((name) => ({
    label: name,
    description: name === 'Notion' ? 'Auth expired · Ramesh Poluru' : `Owned by Ananya Poluru’s knowledge team`
  }));

  protected readonly samplePolicy = `{
  "owner": "Ananya Poluru",
  "hybrid": true,
  "chunk_size": 512,
  "acl_freeze": true
}`;

  protected toggle(field: 'hybrid' | 'aclFreeze' | 'piiRedaction' | 'stripNav', value: boolean): void {
    this[field].set(value);
    this.saved.set(false);
  }

  protected onChunkSize(value: number): void {
    this.chunkSize.set(value);
    this.saved.set(false);
  }

  protected onOverlap(value: number): void {
    this.overlap.set(value);
    this.saved.set(false);
  }

  protected save(): void {
    this.saved.set(true);
  }
}
