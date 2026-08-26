import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { templateConfig } from '../template.config';

@Component({
  selector: 'app-alerts-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Detection</p>
        <h1>Alerts</h1>
        <p class="summary">High-risk signals for Aisha, Maya, Arjun, and Jordan Poluru to triage.</p>
      </div>
      <a class="secondary" routerLink="/settings">
        <span class="material-symbols-outlined">tune</span>
        Alert settings
      </a>
    </section>

    <section class="panel list-panel">
      @for (alert of config.alerts; track alert.title) {
        <a class="list-row alert-row" [routerLink]="alert.path">
          <span class="status-icon material-symbols-outlined" [class]="alert.tone">
            {{ alert.tone === 'ok' ? 'check_circle' : alert.tone === 'warn' ? 'error' : alert.tone === 'rose' ? 'warning' : 'info' }}
          </span>
          <div class="copy">
            <strong>{{ alert.title }}</strong>
            <small>{{ alert.detail }}</small>
          </div>
          <span class="status" [class]="alert.tone">{{ alert.severity }}</span>
          <small class="muted">{{ alert.time }}</small>
        </a>
      }
    </section>
  `
})
export class AlertsPageComponent {
  protected readonly config = templateConfig;
}
