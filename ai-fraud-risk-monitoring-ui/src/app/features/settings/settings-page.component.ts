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
        <p class="summary">Thresholds, team, and detection controls for risk operations.</p>
      </div>
      <button type="button" class="primary" (click)="save()">Save changes</button>
    </section>

    @if (saved()) {
      <p class="notice">Settings saved for Aisha Poluru’s workspace.</p>
    }

    <section class="split">
      <article class="panel">
        <div class="panel-header"><h2>Thresholds</h2></div>
        <label class="field">
          <span>Auto-block wires above</span>
          <input type="text" [value]="wireLimit()" (input)="onWireLimit($event)" />
        </label>
        <label class="field">
          <span>Card velocity / 5 min</span>
          <input type="text" [value]="velocity()" (input)="onVelocity($event)" />
        </label>
        <label class="field">
          <span>Impossible travel minutes</span>
          <input type="text" [value]="travelMinutes()" (input)="onTravel($event)" />
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
            <div class="entry">
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
  protected readonly wireLimit = signal('$10,000');
  protected readonly velocity = signal('10');
  protected readonly travelMinutes = signal('40');
  protected readonly onCallUntil = signal(templateConfig.onCall.until);
  protected readonly groups = signal(
    templateConfig.settings.map((group) => ({
      group: group.group,
      items: group.items.map((item) => ({ ...item }))
    }))
  );

  protected onWireLimit(event: Event): void {
    this.wireLimit.set((event.target as HTMLInputElement).value);
    this.saved.set(false);
  }

  protected onVelocity(event: Event): void {
    this.velocity.set((event.target as HTMLInputElement).value);
    this.saved.set(false);
  }

  protected onTravel(event: Event): void {
    this.travelMinutes.set((event.target as HTMLInputElement).value);
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
        ...group,
        items: group.items.map((item) => (item.title === title ? { ...item, enabled: !item.enabled } : item))
      }))
    );
    this.saved.set(false);
  }
}
