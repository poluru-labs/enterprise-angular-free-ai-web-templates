import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  EdsCardComponent,
  EdsCheckboxComponent,
  EdsDatePickerComponent,
  EdsDividerComponent,
  EdsIconComponent,
  EdsLinkComponent,
  EdsNumberInputComponent,
  EdsPinInputComponent,
  EdsSliderComponent,
  EdsSwitchComponent
} from '@poluru-labs/enterprise-design-system-angular';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [
    EdsCardComponent,
    EdsCheckboxComponent,
    EdsDatePickerComponent,
    EdsDividerComponent,
    EdsIconComponent,
    EdsLinkComponent,
    EdsNumberInputComponent,
    EdsPinInputComponent,
    EdsSliderComponent,
    EdsSwitchComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Workspace</p>
        <h1>Settings</h1>
        <p class="summary">Govern chunking, freshness, and access for Ananya Poluru’s knowledge workspace.</p>
      </div>
    </section>

    <section class="stack">
      <eds-card class="card-pad setting" [elevated]="false">
        <div>
          <h3>Hybrid search</h3>
          <p>Blend dense embeddings with BM25 and require citations on answers.</p>
        </div>
        <eds-switch label="Enabled" [checked]="hybrid()" (checkedChange)="hybrid.set($event)"></eds-switch>
      </eds-card>

      <eds-card class="card-pad setting" [elevated]="false">
        <div>
          <h3>ACL freeze on review</h3>
          <p>Pause retrieval when Venkata Poluru flags a source for access review.</p>
        </div>
        <eds-switch label="Enabled" [checked]="aclFreeze()" (checkedChange)="aclFreeze.set($event)"></eds-switch>
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
          (valueChange)="chunkSize.set($event)"
        ></eds-slider>
        <eds-number-input
          label="Overlap tokens"
          [value]="overlap()"
          [min]="0"
          [max]="256"
          [step]="16"
          (valueChange)="overlap.set($event)"
        ></eds-number-input>
        <eds-checkbox
          label="Strip boilerplate headers and nav"
          [checked]="stripNav()"
          (checkedChange)="stripNav.set($event)"
        ></eds-checkbox>
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <h3>Retention</h3>
        <eds-date-picker
          label="Purge drafts after"
          hint="Soft-deleted chunks stay until this date"
          [value]="purgeDate()"
          (valueChange)="purgeDate.set($event)"
        ></eds-date-picker>
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
  protected readonly hybrid = signal(true);
  protected readonly aclFreeze = signal(true);
  protected readonly chunkSize = signal(512);
  protected readonly overlap = signal(64);
  protected readonly stripNav = signal(true);
  protected readonly purgeDate = signal('2026-12-31');
  protected readonly pin = signal('');
}
