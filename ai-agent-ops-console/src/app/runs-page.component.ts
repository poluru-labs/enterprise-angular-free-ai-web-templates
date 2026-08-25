import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { templateConfig } from '../template.config';

@Component({
  selector: 'app-runs-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Execution history</p>
        <h1>Runs</h1>
        <p class="summary">Review agent execution history, intervention points, and outcome quality.</p>
      </div>
      <a class="secondary" routerLink="/handoffs">
        <span class="material-symbols-outlined">handshake</span>
        Open handoffs
      </a>
    </section>

    <div class="filters">
      @for (chip of chips; track chip) {
        <button type="button" class="chip" [class.active]="filter() === chip" (click)="filter.set(chip)">{{ chip }}</button>
      }
    </div>

    <section class="panel list-panel">
      <div class="list-head runs-grid">
        <span>Run</span><span>Agent</span><span>Started</span><span>Duration</span><span>Status</span>
      </div>
      @for (run of runs(); track run.id) {
        <article class="list-row runs-grid">
          <div class="copy">
            <strong>{{ run.id }}</strong>
            <small>{{ run.detail }}</small>
          </div>
          <span>{{ run.agent }}</span>
          <span>{{ run.started }}</span>
          <span>{{ run.duration }}</span>
          <span class="status" [class]="run.tone">{{ run.status }}</span>
        </article>
      }
    </section>
  `
})
export class RunsPageComponent {
  protected readonly chips = ['All', 'Complete', 'Running', 'Review', 'Failed'];
  protected readonly filter = signal('All');
  protected readonly runs = computed(() => {
    const selected = this.filter();
    return selected === 'All'
      ? templateConfig.runs
      : templateConfig.runs.filter((run) => run.status === selected);
  });
}
