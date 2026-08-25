import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { templateConfig } from '../template.config';

@Component({
  selector: 'app-handoffs-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Human oversight</p>
        <h1>Handoffs</h1>
        <p class="summary">Approve, reject, or reassign agent actions that need a human decision.</p>
      </div>
      <button class="secondary" type="button">
        <span class="material-symbols-outlined">person_add</span>
        Assign reviewer
      </button>
    </section>

    <div class="filters">
      @for (chip of chips; track chip) {
        <button type="button" class="chip" [class.active]="filter() === chip" (click)="filter.set(chip)">{{ chip }}</button>
      }
    </div>

    <section class="stack">
      @for (item of handoffs(); track item.id) {
        <article class="panel handoff-card">
          <div class="handoff-copy">
            <p class="eyebrow">{{ item.id }} · {{ item.risk }} risk</p>
            <h2>{{ item.agent }}</h2>
            <p>{{ item.reason }}</p>
            <small>{{ item.reviewer }} · {{ item.waiting }}</small>
          </div>
          <div class="handoff-actions">
            <span class="status" [class]="item.tone">{{ item.status }}</span>
            @if (item.status === 'Waiting') {
              <button class="primary" type="button" (click)="resolve(item.id, 'Approved')">Approve</button>
              <button class="secondary" type="button" (click)="resolve(item.id, 'Rejected')">Reject</button>
            }
          </div>
        </article>
      }
    </section>
  `
})
export class HandoffsPageComponent {
  protected readonly chips = ['All', 'Waiting', 'Approved', 'Rejected'];
  protected readonly filter = signal('All');
  private readonly items = signal(templateConfig.handoffs.map((item) => ({ ...item })));
  protected readonly handoffs = computed(() => {
    const selected = this.filter();
    return selected === 'All'
      ? this.items()
      : this.items().filter((item) => item.status === selected);
  });

  protected resolve(id: string, status: 'Approved' | 'Rejected'): void {
    this.items.update((items) => items.map((item) => item.id === id
      ? { ...item, status, tone: status === 'Approved' ? 'ok' : 'rose', waiting: 'Resolved' }
      : item));
  }
}
