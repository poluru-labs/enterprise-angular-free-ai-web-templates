import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { EdsCardComponent, EdsSwitchComponent } from '@poluru-labs/enterprise-design-system-angular';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [EdsCardComponent, EdsSwitchComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host {
      --brand: #08766c;
      --line: #dfe7e6;
      --muted: #66777d;
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
      color: #15262c;
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
          <h3>Budget Alerts</h3>
          <p>Notify workspace owners when spend crosses 80% of the monthly budget.</p>
        </div>
        <div class="switch-wrap">
          <eds-switch label="Enabled" [checked]="budgetAlerts()" (checkedChange)="budgetAlerts.set($event)"></eds-switch>
        </div>
      </eds-card>

      <eds-card class="setting" [elevated]="false">
        <div>
          <h3>Latency Notifications</h3>
          <p>Alert on-call when p95 latency exceeds 2 seconds for 5 minutes.</p>
        </div>
        <div class="switch-wrap">
          <eds-switch label="Enabled" [checked]="latencyNotifications()" (checkedChange)="latencyNotifications.set($event)"></eds-switch>
        </div>
      </eds-card>

      <eds-card class="setting" [elevated]="false">
        <div>
          <h3>Strict Cost Gate</h3>
          <p>Block new model calls once a workspace budget is fully consumed.</p>
        </div>
        <div class="switch-wrap">
          <eds-switch label="Enabled" [checked]="strictCostGate()" (checkedChange)="strictCostGate.set($event)"></eds-switch>
        </div>
      </eds-card>
    </section>
  `
})
export class SettingsPageComponent {
  protected readonly budgetAlerts = signal(true);
  protected readonly latencyNotifications = signal(true);
  protected readonly strictCostGate = signal(false);
}
