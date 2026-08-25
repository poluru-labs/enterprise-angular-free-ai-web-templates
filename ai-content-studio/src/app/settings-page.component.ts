import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { EdsCardComponent, EdsSwitchComponent } from '@poluru-labs/enterprise-design-system-angular';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [EdsCardComponent, EdsSwitchComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host {
      --brand: #0046ff;
      --line: #dbe7ff;
      --muted: #5d6f92;
      display: block;
    }

    .stack {
      display: grid;
      gap: 12px;
    }

    .setting {
      border-radius: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }

    h3 {
      margin: 0;
      font-size: 15px;
      color: #16335f;
    }

    p {
      margin: 4px 0 0;
      color: var(--muted);
      font-size: 13px;
    }

    .switch-wrap {
      min-width: 120px;
      display: flex;
      justify-content: flex-end;
    }
  `],
  template: `
    <section class="stack">
      <eds-card class="setting" [elevated]="false">
        <div>
          <h3>AI Suggestions</h3>
          <p>Show composition suggestions while editing briefs and drafts.</p>
        </div>
        <div class="switch-wrap">
          <eds-switch label="Enabled" [checked]="aiSuggestions()" (checkedChange)="aiSuggestions.set($event)"></eds-switch>
        </div>
      </eds-card>

      <eds-card class="setting" [elevated]="false">
        <div>
          <h3>Approval Notifications</h3>
          <p>Send reminders to reviewers when deadlines are within 24 hours.</p>
        </div>
        <div class="switch-wrap">
          <eds-switch label="Enabled" [checked]="approvalNotifications()" (checkedChange)="approvalNotifications.set($event)"></eds-switch>
        </div>
      </eds-card>

      <eds-card class="setting" [elevated]="false">
        <div>
          <h3>Brand Rule Strictness</h3>
          <p>Require all guardrails to pass before publication status is available.</p>
        </div>
        <div class="switch-wrap">
          <eds-switch label="Enabled" [checked]="brandStrictness()" (checkedChange)="brandStrictness.set($event)"></eds-switch>
        </div>
      </eds-card>
    </section>
  `
})
export class SettingsPageComponent {
  protected readonly aiSuggestions = signal(true);
  protected readonly approvalNotifications = signal(true);
  protected readonly brandStrictness = signal(false);
}
