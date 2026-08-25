import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { templateConfig } from '../template.config';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Workspace controls</p>
        <h1>Settings</h1>
        <p class="summary">Set workspace policies, alerts, and access rules for agent operations.</p>
      </div>
    </section>

    <section class="stack">
      @for (group of groups(); track group.group) {
        <article class="panel">
          <div class="panel-header">
            <div>
              <p class="eyebrow">Controls</p>
              <h2>{{ group.group }}</h2>
            </div>
          </div>
          @for (item of group.items; track item.title) {
            <label class="setting-row">
              <div class="copy">
                <strong>{{ item.title }}</strong>
                <small>{{ item.detail }}</small>
              </div>
              <input type="checkbox" [checked]="item.enabled" (change)="toggle(item.title)" />
            </label>
          }
        </article>
      }
    </section>
  `
})
export class SettingsPageComponent {
  protected readonly groups = signal(
    templateConfig.settings.map((group) => ({
      group: group.group,
      items: group.items.map((item) => ({ ...item }))
    }))
  );

  protected toggle(title: string): void {
    this.groups.update((groups) => groups.map((group) => ({
      ...group,
      items: group.items.map((item) => item.title === title ? { ...item, enabled: !item.enabled } : item)
    })));
  }
}
