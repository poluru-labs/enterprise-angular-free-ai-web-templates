import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { templateConfig } from '../template.config';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Workspace search</p>
        <h1>Search</h1>
        <p class="summary">Find agents, runs, tools, and handoffs across the operations console.</p>
      </div>
    </section>

    <label class="search-field">
      <span class="material-symbols-outlined">search</span>
      <input type="search" placeholder="Search agents, runs, tools..." [value]="query()" (input)="query.set($any($event.target).value)" />
    </label>

    <section class="panel list-panel">
      @if (results().length === 0) {
        <div class="empty-copy">
          <h2>No matches</h2>
          <p>Try an agent name, run ID, or tool such as “web search”.</p>
        </div>
      } @else {
        @for (result of results(); track result.title + result.path) {
          <a class="list-row alert-row" [routerLink]="result.path">
            <span class="status-icon material-symbols-outlined">{{ result.icon }}</span>
            <div class="copy">
              <strong>{{ result.title }}</strong>
              <small>{{ result.detail }}</small>
            </div>
            <span class="status ok">{{ result.kind }}</span>
            <span class="icon-button" aria-hidden="true"><span class="material-symbols-outlined">chevron_right</span></span>
          </a>
        }
      }
    </section>
  `
})
export class SearchPageComponent {
  protected readonly query = signal('');
  protected readonly results = computed(() => {
    const term = this.query().trim().toLowerCase();
    const catalog = [
      ...templateConfig.agents.map((item) => ({ title: item.name, detail: `${item.owner} · ${item.status}`, path: '/agents', kind: 'Agent', icon: 'smart_toy' })),
      ...templateConfig.runs.map((item) => ({ title: item.id, detail: `${item.agent} · ${item.detail}`, path: '/runs', kind: 'Run', icon: 'timeline' })),
      ...templateConfig.tools.map((item) => ({ title: item.name, detail: `${item.type} · ${item.status}`, path: '/tools', kind: 'Tool', icon: 'construction' })),
      ...templateConfig.handoffs.map((item) => ({ title: item.id, detail: `${item.agent} · ${item.reason}`, path: '/handoffs', kind: 'Handoff', icon: 'handshake' }))
    ];
    return term ? catalog.filter((item) => `${item.title} ${item.detail}`.toLowerCase().includes(term)) : catalog.slice(0, 8);
  });
}
