import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { EdsCardComponent, EdsSwitchComponent } from '@poluru-labs/enterprise-design-system-angular';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [EdsCardComponent, EdsSwitchComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host {
      --brand: #2f6b1f;
      --line: #cdeab8;
      --muted: #5d6f5d;
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
      color: #16351b;
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
          <h3>Auto-run Regression Suites</h3>
          <p>Trigger the full regression battery on every model checkpoint push.</p>
        </div>
        <div class="switch-wrap">
          <eds-switch label="Enabled" [checked]="autoRegression()" (checkedChange)="autoRegression.set($event)"></eds-switch>
        </div>
      </eds-card>

      <eds-card class="setting" [elevated]="false">
        <div>
          <h3>Reviewer Notifications</h3>
          <p>Notify assigned reviewers when a scorecard is ready for sign-off.</p>
        </div>
        <div class="switch-wrap">
          <eds-switch label="Enabled" [checked]="reviewerNotifications()" (checkedChange)="reviewerNotifications.set($event)"></eds-switch>
        </div>
      </eds-card>

      <eds-card class="setting" [elevated]="false">
        <div>
          <h3>Strict Release Gate</h3>
          <p>Block release when any suite score falls below the approved baseline.</p>
        </div>
        <div class="switch-wrap">
          <eds-switch label="Enabled" [checked]="strictGate()" (checkedChange)="strictGate.set($event)"></eds-switch>
        </div>
      </eds-card>
    </section>
  `
})
export class SettingsPageComponent {
  protected readonly autoRegression = signal(true);
  protected readonly reviewerNotifications = signal(true);
  protected readonly strictGate = signal(false);
}
