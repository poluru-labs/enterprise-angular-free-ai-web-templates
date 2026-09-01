import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { templateConfig } from '../../core/config/template.config';
import { initials } from '../../shared/utils/initials';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  host: { class: 'page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Workspace</p>
        <h1>Settings</h1>
        <p class="summary">SLA, routing, and access controls for human review.</p>
      </div>
      <button type="button" class="primary" (click)="save()">Save changes</button>
    </section>

    @if (saved()) {
      <p class="notice">Settings saved for Aisha Poluru’s workspace.</p>
    }

    <section class="split">
      <article class="panel">
        <div class="panel-header"><h2>SLA</h2></div>
        <label class="field">
          <span>High severity minutes</span>
          <input type="text" [value]="highMinutes()" (input)="onHigh($event)" />
        </label>
        <label class="field">
          <span>Dual-review minutes</span>
          <input type="text" [value]="dualMinutes()" (input)="onDual($event)" />
        </label>
        <label class="field">
          <span>Idle lock hours</span>
          <input type="text" [value]="idleHours()" (input)="onIdle($event)" />
        </label>
        <label class="field">
          <span>On-call until</span>
          <input type="text" [value]="onCallUntil()" (input)="onCall($event)" />
        </label>
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

    <section class="stack">
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
          @for (item of config.audit; track item.time + item.action) {
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
  protected readonly initials = initials;
  protected readonly saved = signal(false);
  protected readonly highMinutes = signal('30');
  protected readonly dualMinutes = signal('15');
  protected readonly idleHours = signal('2');
  protected readonly onCallUntil = signal(templateConfig.onCall.until);
  protected readonly groups = signal(
    templateConfig.settings.map((group) => ({
      group: group.group,
      items: group.items.map((item) => ({ ...item }))
    }))
  );

  protected onHigh(event: Event): void {
    this.highMinutes.set((event.target as HTMLInputElement).value);
    this.saved.set(false);
  }

  protected onDual(event: Event): void {
    this.dualMinutes.set((event.target as HTMLInputElement).value);
    this.saved.set(false);
  }

  protected onIdle(event: Event): void {
    this.idleHours.set((event.target as HTMLInputElement).value);
    this.saved.set(false);
  }

  protected onCall(event: Event): void {
    this.onCallUntil.set((event.target as HTMLInputElement).value);
    this.saved.set(false);
  }

  protected save(): void {
    this.saved.set(true);
  }

  protected toggle(title: string): void {
    this.groups.update((groups) =>
      groups.map((group) => ({
        group: group.group,
        items: group.items.map((item) => (item.title === title ? { ...item, enabled: !item.enabled } : item))
      }))
    );
    this.saved.set(false);
  }
}
