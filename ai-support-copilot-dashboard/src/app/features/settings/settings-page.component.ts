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
        <p class="summary">Govern drafts, knowledge grounding, and retention for Ananya Poluru’s support workspace.</p>
      </div>
      <eds-button variant="primary" size="sm" icon="save" (clicked)="save()">Save changes</eds-button>
    </section>

    @if (saved()) {
      <p class="notice">Settings saved for Ananya Poluru’s workspace.</p>
    }

    <section class="stack">
      <eds-card class="card-pad setting" [elevated]="false">
        <div>
          <h3>Auto-draft replies</h3>
          <p>Create a copilot reply when a ticket enters billing or orders.</p>
        </div>
        <eds-switch label="Enabled" [checked]="autoDraft()" (checkedChange)="toggle('autoDraft', $event)"></eds-switch>
      </eds-card>

      <eds-card class="card-pad setting" [elevated]="false">
        <div>
          <h3>Escalation summaries</h3>
          <p>Alert Nikhil Poluru when wait time passes two SLA steps.</p>
        </div>
        <eds-switch
          label="Enabled"
          [checked]="escalationAlerts()"
          (checkedChange)="toggle('escalationAlerts', $event)"
        ></eds-switch>
      </eds-card>

      <eds-card class="card-pad setting" [elevated]="false">
        <div>
          <h3>Knowledge grounding</h3>
          <p>Attach Meera Poluru’s live articles before the agent sends.</p>
        </div>
        <eds-switch label="Enabled" [checked]="grounding()" (checkedChange)="toggle('grounding', $event)"></eds-switch>
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <h3>Coaching</h3>
        <p class="meta">How assertive Harbor Desk should be with next-best replies.</p>
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
          label="Escalate after minutes"
          [value]="escalateAfter()"
          [min]="5"
          [max]="60"
          [step]="5"
          (valueChange)="onEscalateAfter($event)"
        ></eds-number-input>
        <eds-checkbox
          label="Include policy snippets in drafts"
          [checked]="policySnippets()"
          (checkedChange)="toggle('policySnippets', $event)"
        ></eds-checkbox>
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <h3>Reply types</h3>
        <eds-list [items]="replyItems" [divided]="true"></eds-list>
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <h3>Retention</h3>
        <eds-date-picker
          label="Purge transcripts after"
          hint="Raw chat logs stay until this date"
          [value]="purgeDate()"
          (valueChange)="purgeDate.set($event)"
        ></eds-date-picker>
        <eds-time-picker
          label="Nightly digest"
          hint="Priya Poluru’s coverage job"
          [value]="digestTime()"
          (valueChange)="digestTime.set($event)"
        ></eds-time-picker>
        <eds-code-snippet [code]="samplePolicy" language="json" label="Copilot policy"></eds-code-snippet>
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
  protected readonly autoDraft = signal(true);
  protected readonly escalationAlerts = signal(true);
  protected readonly grounding = signal(true);
  protected readonly volume = signal(40);
  protected readonly escalateAfter = signal(15);
  protected readonly policySnippets = signal(true);
  protected readonly purgeDate = signal('2026-12-31');
  protected readonly digestTime = signal('06:30');
  protected readonly pin = signal('');

  protected readonly replyItems: EdsListItem[] = this.config.replyTypes.map((name) => ({
    label: name,
    description: name === 'Credit note' ? 'Used on Kavya Poluru’s invoice queue.' : 'Owned by Ananya Poluru’s support team'
  }));

  protected readonly samplePolicy = `{
  "owner": "Ananya Poluru",
  "auto_draft": true,
  "escalate_after": 15
}`;

  protected toggle(field: 'autoDraft' | 'escalationAlerts' | 'grounding' | 'policySnippets', value: boolean): void {
    this[field].set(value);
    this.saved.set(false);
  }

  protected onVolume(value: number): void {
    this.volume.set(value);
    this.saved.set(false);
  }

  protected onEscalateAfter(value: number): void {
    this.escalateAfter.set(value);
    this.saved.set(false);
  }

  protected save(): void {
    this.saved.set(true);
  }
}
