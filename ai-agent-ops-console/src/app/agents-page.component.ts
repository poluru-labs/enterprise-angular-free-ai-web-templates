import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { templateConfig } from '../template.config';

@Component({
  selector: 'app-agents-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Agent directory</p>
        <h1>Agents</h1>
        <p class="summary">Deploy, configure, and monitor the agents working across your business.</p>
      </div>
      <a class="primary" routerLink="/deploy">
        <span class="material-symbols-outlined">rocket_launch</span>
        Deploy agent
      </a>
    </section>

    <div class="filters">
      @for (chip of chips; track chip) {
        <button type="button" class="chip" [class.active]="filter() === chip" (click)="filter.set(chip)">{{ chip }}</button>
      }
    </div>

    <section class="panel list-panel">
      <div class="list-head agents-grid">
        <span>Agent</span><span>Owner</span><span>Version</span><span>Runs</span><span>Success</span><span>Status</span>
      </div>
      @for (agent of agents(); track agent.id) {
        <article class="list-row agents-grid">
          <div class="copy">
            <strong>{{ agent.name }}</strong>
            <small>Updated {{ agent.updated }}</small>
          </div>
          <span>{{ agent.owner }}</span>
          <span>{{ agent.version }}</span>
          <span>{{ agent.runs }}</span>
          <span>{{ agent.success }}</span>
          <span class="status" [class]="agent.tone">{{ agent.status }}</span>
        </article>
      }
    </section>
  `
})
export class AgentsPageComponent {
  protected readonly chips = ['All', 'Live', 'Review', 'Paused'];
  protected readonly filter = signal('All');
  protected readonly agents = computed(() => {
    const selected = this.filter();
    return selected === 'All'
      ? templateConfig.agents
      : templateConfig.agents.filter((agent) => agent.status === selected);
  });
}
