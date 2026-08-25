import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { templateConfig } from '../template.config';

@Component({
  selector: 'app-tools-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Tool registry</p>
        <h1>Tools</h1>
        <p class="summary">Manage the approved tools and integrations available to your agents.</p>
      </div>
      <button class="primary" type="button">
        <span class="material-symbols-outlined">add</span>
        Register tool
      </button>
    </section>

    <div class="filters">
      @for (chip of chips; track chip) {
        <button type="button" class="chip" [class.active]="filter() === chip" (click)="filter.set(chip)">{{ chip }}</button>
      }
    </div>

    <section class="panel list-panel">
      <div class="list-head tools-grid">
        <span>Tool</span><span>Type</span><span>Owner</span><span>Calls</span><span>Reliability</span><span>Status</span>
      </div>
      @for (tool of tools(); track tool.name) {
        <article class="list-row tools-grid">
          <div class="copy">
            <strong>{{ tool.name }}</strong>
            <small>{{ tool.owner }}</small>
          </div>
          <span>{{ tool.type }}</span>
          <span>{{ tool.owner }}</span>
          <span>{{ tool.calls }}</span>
          <span>{{ tool.reliability }}</span>
          <span class="status" [class]="tool.tone">{{ tool.status }}</span>
        </article>
      }
    </section>
  `
})
export class ToolsPageComponent {
  protected readonly chips = ['All', 'Approved', 'Restricted', 'Degraded'];
  protected readonly filter = signal('All');
  protected readonly tools = computed(() => {
    const selected = this.filter();
    return selected === 'All'
      ? templateConfig.tools
      : templateConfig.tools.filter((tool) => tool.status === selected);
  });
}
