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
        <p class="summary">Govern briefs, sequence coaching, and retention for Ananya Poluru’s revenue workspace.</p>
      </div>
    </section>

    <section class="stack">
      <eds-card class="card-pad setting" [elevated]="false">
        <div>
          <h3>Auto-generate briefs</h3>
          <p>Create account research when a deal enters qualify or expansion.</p>
        </div>
        <eds-switch label="Enabled" [checked]="autoBriefs()" (checkedChange)="autoBriefs.set($event)"></eds-switch>
      </eds-card>

      <eds-card class="card-pad setting" [elevated]="false">
        <div>
          <h3>Sequence stall alerts</h3>
          <p>Alert Nikhil Poluru when a cadence goes quiet for two steps.</p>
        </div>
        <eds-switch
          label="Enabled"
          [checked]="stallAlerts()"
          (checkedChange)="stallAlerts.set($event)"
        ></eds-switch>
      </eds-card>

      <eds-card class="card-pad setting" [elevated]="false">
        <div>
          <h3>Meeting prep packing</h3>
          <p>Attach competitive notes 24 hours before a booked call.</p>
        </div>
        <eds-switch label="Enabled" [checked]="meetingPrep()" (checkedChange)="meetingPrep.set($event)"></eds-switch>
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
          (valueChange)="volume.set($event)"
        ></eds-slider>
        <eds-number-input
          label="Stall after steps"
          [value]="stallAfter()"
          [min]="1"
          [max]="8"
          [step]="1"
          (valueChange)="stallAfter.set($event)"
        ></eds-number-input>
        <eds-checkbox
          label="Include competitive snippets in briefs"
          [checked]="competitive()"
          (checkedChange)="competitive.set($event)"
        ></eds-checkbox>
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
  protected readonly autoBriefs = signal(true);
  protected readonly stallAlerts = signal(true);
  protected readonly meetingPrep = signal(true);
  protected readonly volume = signal(40);
  protected readonly stallAfter = signal(2);
  protected readonly competitive = signal(true);
  protected readonly purgeDate = signal('2026-12-31');
  protected readonly digestTime = signal('06:30');
  protected readonly pin = signal('');

  protected readonly samplePolicy = `{
  "owner": "Ananya Poluru",
  "auto_brief": true,
  "stall_after": 2
}`;
}
