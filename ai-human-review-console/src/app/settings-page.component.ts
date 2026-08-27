import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { templateConfig } from '../template.config';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Workspace</p>
        <h1>Settings</h1>
        <p class="summary">SLA, routing, and access controls for human review.</p>
      </div>
      <button type="button" class="primary" (click)="saved.set(true)">Save changes</button>
    </section>

    @if (saved()) {
      <p class="notice">Settings saved for Aisha Poluru’s workspace.</p>
    }

    <section class="split">
      <article class="panel">
        <div class="panel-header"><h2>SLA</h2></div>
        <label class="field"><span>High severity minutes</span><input type="text" value="30" /></label>
        <label class="field"><span>Dual-review minutes</span><input type="text" value="15" /></label>
        <label class="field"><span>Idle lock hours</span><input type="text" value="2" /></label>
        <label class="field"><span>On-call until</span><input type="text" [value]="config.onCall.until" /></label>
      </article>

      <article class="panel">
        <div class="panel-header"><h2>Team</h2></div>
        <ul class="people">
          @for (person of config.team; track person.name) {
            <li>
              <span class="avatar">{{ initials(person.name) }}</span>
              <div class="copy">
                <strong>{{ person.name }}</strong>
                <small>{{ person.role }}</small>
              </div>
              <span class="status" [class]="person.shift === 'On call' ? 'rose' : person.shift === 'Backup' ? 'warn' : 'info'">{{ person.shift }}</span>
            </li>
          }
        </ul>
      </article>
    </section>

    <section class="stack" style="margin-top:1rem">
      @for (group of groups(); track group.group) {
        <article class="panel">
          <div class="panel-header">
            <h2>{{ group.group }}</h2>
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

      <article class="panel">
        <div class="panel-header"><h2>Audit log</h2></div>
        <div class="rows">
          @for (item of config.audit; track item.time) {
            <div class="row">
              <span class="agenda-time">{{ item.time }}</span>
              <div class="copy">
                <strong>{{ item.actor }}</strong>
                <small>{{ item.action }}</small>
              </div>
            </div>
          }
        </div>
      </article>
    </section>
  `
})
export class SettingsPageComponent {
  protected readonly config = templateConfig;
  protected readonly saved = signal(false);
  protected readonly groups = signal(templateConfig.settings.map((group) => ({
    ...group,
    items: group.items.map((item) => ({ ...item }))
  })));

  protected initials(name: string): string {
    return name.split(' ').map((part) => part[0]).join('').slice(0, 2);
  }

  protected toggle(title: string): void {
    this.groups.update((list) =>
      list.map((group) => ({
        ...group,
        items: group.items.map((item) => (item.title === title ? { ...item, enabled: !item.enabled } : item))
      }))
    );
  }
}
