import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { templateConfig } from '../../core/config/template.config';
import type { Tone } from '../../core/config/template.config';

type Policy = (typeof templateConfig.policies)[number];

@Component({
  selector: 'app-policies-page',
  standalone: true,
  host: { class: 'page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Guidelines</p>
        <h1>Policies</h1>
        <p class="summary">Pause, promote from shadow, or draft a guideline. Agreement stays on the card.</p>
      </div>
      <button type="button" class="primary" (click)="showForm.set(true)">
        <span class="material-symbols-outlined">add</span>
        New policy
      </button>
    </section>

    @if (notice()) {
      <p class="notice">{{ notice() }}</p>
    }

    <section class="metrics mini">
      <article class="metric"><p>Live</p><div class="value">{{ count('Live') }}</div></article>
      <article class="metric"><p>Tuning</p><div class="value">{{ count('Tuning') }}</div></article>
      <article class="metric"><p>Shadow</p><div class="value">{{ count('Shadow') }}</div></article>
      <article class="metric"><p>Hits today</p><div class="value">{{ hitsToday() }}</div></article>
    </section>

    <div class="toolbar">
      <div class="chips">
        @for (item of filters; track item) {
          <button type="button" class="chip" [class.active]="filter() === item" (click)="filter.set(item)">{{ item }}</button>
        }
      </div>
    </div>

    <section class="split">
      <article class="panel list-panel">
        <div class="list-head policy-grid">
          <span>Policy</span>
          <span>Owner</span>
          <span>Hits</span>
          <span>Agreement</span>
          <span>Status</span>
        </div>
        @for (item of filtered(); track item.name) {
          <button type="button" class="list-row policy-grid selectable" [class.selected]="selectedName() === item.name" (click)="selectedName.set(item.name)">
            <strong>{{ item.name }}</strong>
            <span>{{ item.owner }}</span>
            <span>{{ item.hits }}</span>
            <span>{{ item.agreement }}</span>
            <span class="status" [class]="item.tone">{{ item.status }}</span>
          </button>
        }
      </article>

      @if (selected(); as item) {
        <aside class="panel detail">
          <p class="eyebrow">{{ item.owner }}</p>
          <h2>{{ item.name }}</h2>
          <p class="muted">{{ item.hits }} hits · {{ item.agreement }} agreement</p>
          <div class="meter"><span [style.width]="item.agreement"></span></div>
          <div class="inline-actions">
            <button type="button" class="primary" (click)="setStatus(item.name, 'Live', 'ok')">Go live</button>
            <button type="button" class="secondary" (click)="setStatus(item.name, 'Tuning', 'warn')">Tune</button>
            <button type="button" class="secondary" (click)="setStatus(item.name, 'Shadow', 'info')">Shadow</button>
          </div>
        </aside>
      }
    </section>

    @if (showForm()) {
      <article class="panel form-panel">
        <div class="panel-header"><h2>Draft a policy</h2></div>
        <label class="field">
          <span>Name</span>
          <input type="text" placeholder="Medical advice hold" [value]="draftName()" (input)="onDraftName($event)" />
        </label>
        <label class="field">
          <span>Owner</span>
          <input type="text" [value]="draftOwner()" (input)="onDraftOwner($event)" />
        </label>
        <label class="field">
          <span>When to route</span>
          <textarea rows="3" placeholder="Hold any output that recommends treatment or dosage." [value]="draftWhen()" (input)="onDraftWhen($event)"></textarea>
        </label>
        <div class="inline-actions">
          <button type="button" class="primary" (click)="draft()">Save as shadow</button>
          <button type="button" class="secondary" (click)="showForm.set(false)">Cancel</button>
        </div>
      </article>
    }
  `
})
export class PoliciesPageComponent {
  protected readonly filters = ['All', 'Live', 'Tuning', 'Shadow'] as const;
  protected readonly filter = signal<(typeof this.filters)[number]>('All');
  protected readonly selectedName = signal(templateConfig.policies[0].name);
  protected readonly showForm = signal(false);
  protected readonly notice = signal('');
  protected readonly draftName = signal('');
  protected readonly draftOwner = signal('Aisha Poluru');
  protected readonly draftWhen = signal('');
  protected readonly rows = signal<Policy[]>(templateConfig.policies.map((item) => ({ ...item })));

  protected readonly filtered = computed(() => {
    const status = this.filter();
    return this.rows().filter((item) => status === 'All' || item.status === status);
  });

  protected readonly selected = computed(
    () => this.filtered().find((item) => item.name === this.selectedName()) ?? this.filtered()[0]
  );

  protected count(status: string): number {
    return this.rows().filter((item) => item.status === status).length;
  }

  protected hitsToday(): number {
    return this.rows().reduce((sum, item) => sum + Number(item.hits), 0);
  }

  protected setStatus(name: string, status: Policy['status'], tone: Tone): void {
    this.rows.update((list) => list.map((item) => (item.name === name ? { ...item, status, tone } : item)));
    this.notice.set(`${name} is now ${status}.`);
  }

  protected onDraftName(event: Event): void {
    this.draftName.set((event.target as HTMLInputElement).value);
  }

  protected onDraftOwner(event: Event): void {
    this.draftOwner.set((event.target as HTMLInputElement).value);
  }

  protected onDraftWhen(event: Event): void {
    this.draftWhen.set((event.target as HTMLTextAreaElement).value);
  }

  protected draft(): void {
    const name = this.draftName().trim() || 'Untitled guideline';
    const next: Policy = {
      name,
      owner: this.draftOwner().trim() || 'Aisha Poluru',
      hits: '0',
      agreement: '—',
      status: 'Shadow',
      tone: 'info'
    };
    this.rows.update((list) => [next, ...list]);
    this.selectedName.set(name);
    this.filter.set('All');
    this.showForm.set(false);
    this.draftName.set('');
    this.draftWhen.set('');
    this.notice.set(`${name} saved as shadow. Jordan Poluru will review before go-live.`);
  }
}
