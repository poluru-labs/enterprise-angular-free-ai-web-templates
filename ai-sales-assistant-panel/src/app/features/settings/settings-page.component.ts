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
    EdsSwitchComponent,
    EdsTimePickerComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Workspace</p>
        <h1>Settings</h1>
        <p class="summary">Govern briefs, sequence coaching, and retention for Ananya Poluru’s revenue workspace.</p>
      </div>
      <eds-button variant="primary" size="sm" icon="save" (clicked)="save()">Save changes</eds-button>
    </section>

    @if (saved()) {
      <p class="notice">Settings saved for Ananya Poluru’s workspace.</p>
    }

    <section class="stack">
      <eds-card class="card-pad setting" [elevated]="false">
        <div>
          <h3>Auto-generate briefs</h3>
          <p>Create account research when a deal enters qualify or expansion.</p>
        </div>
        <eds-switch label="Enabled" [checked]="autoBriefs()" (checkedChange)="toggle('autoBriefs', $event)"></eds-switch>
      </eds-card>

      <eds-card class="card-pad setting" [elevated]="false">
        <div>
          <h3>Sequence stall alerts</h3>
          <p>Alert Nikhil Poluru when a cadence goes quiet for two steps.</p>
        </div>
        <eds-switch
          label="Enabled"
          [checked]="stallAlerts()"
          (checkedChange)="toggle('stallAlerts', $event)"
        ></eds-switch>
      </eds-card>

      <eds-card class="card-pad setting" [elevated]="false">
        <div>
          <h3>Meeting prep packing</h3>
          <p>Attach competitive notes 24 hours before a booked call.</p>
        </div>
        <eds-switch label="Enabled" [checked]="meetingPrep()" (checkedChange)="toggle('meetingPrep', $event)"></eds-switch>
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <h3>Coaching</h3>
        <p class="meta">How aggressive Garnet Close should be with next-best actions.</p>
        <eds-slider
          label="Suggestion volume"
          [min]="10"
          [max]="80"
          [step]="5"
          [value]="volume()"
          [showValue]="true"
          (valueChange)="onVolume($event)"
        ></eds-slider>
        <eds-number-input
          label="Stall after steps"
          [value]="stallAfter()"
          [min]="1"
          [max]="8"
          [step]="1"
          (valueChange)="onStallAfter($event)"
        ></eds-number-input>
        <eds-checkbox
          label="Include competitive snippets in briefs"
          [checked]="competitive()"
          (checkedChange)="toggle('competitive', $event)"
        ></eds-checkbox>
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <h3>Brief types</h3>
        <eds-list [items]="briefItems" [divided]="true"></eds-list>
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <h3>Retention</h3>
        <eds-date-picker
          label="Purge research after"
          hint="Raw call notes stay until this date"
          [value]="purgeDate()"
          (valueChange)="purgeDate.set($event)"
        ></eds-date-picker>
        <eds-time-picker
          label="Nightly digest"
          hint="Priya Poluru’s enablement job"
          [value]="digestTime()"
          (valueChange)="digestTime.set($event)"
        ></eds-time-picker>
        <eds-code-snippet [code]="samplePolicy" language="json" label="Assistant policy"></eds-code-snippet>
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
  protected readonly autoBriefs = signal(true);
  protected readonly stallAlerts = signal(true);
  protected readonly meetingPrep = signal(true);
  protected readonly volume = signal(40);
  protected readonly stallAfter = signal(2);
  protected readonly competitive = signal(true);
  protected readonly purgeDate = signal('2026-12-31');
  protected readonly digestTime = signal('06:30');
  protected readonly pin = signal('');

  protected readonly briefItems: EdsListItem[] = this.config.briefs.map((name) => ({
    label: name,
    description: name === 'Champion map' ? 'Used after Oakline Energy’s ops director left.' : 'Owned by Ananya Poluru’s revenue team'
  }));

  protected readonly samplePolicy = `{
  "owner": "Ananya Poluru",
  "auto_brief": true,
  "stall_after": 2
}`;

  protected toggle(field: 'autoBriefs' | 'stallAlerts' | 'meetingPrep' | 'competitive', value: boolean): void {
    this[field].set(value);
    this.saved.set(false);
  }

  protected onVolume(value: number): void {
    this.volume.set(value);
    this.saved.set(false);
  }

  protected onStallAfter(value: number): void {
    this.stallAfter.set(value);
    this.saved.set(false);
  }

  protected save(): void {
    this.saved.set(true);
  }
}
