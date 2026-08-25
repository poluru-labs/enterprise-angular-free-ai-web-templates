import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { templateConfig } from '../template.config';

@Component({
  selector: 'app-deploy-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Release control</p>
        <h1>Deploy agent</h1>
        <p class="summary">Publish a new agent version into the enterprise workspace with the approved tool set.</p>
      </div>
      <a class="secondary" routerLink="/agents">
        <span class="material-symbols-outlined">smart_toy</span>
        Back to agents
      </a>
    </section>

    <section class="deploy-grid">
      <article class="panel form-panel">
        <label>
          Agent name
          <input type="text" placeholder="Collections follow-up" [value]="name()" (input)="name.set($any($event.target).value)" />
        </label>
        <label>
          Owner team
          <input type="text" placeholder="Finance" [value]="owner()" (input)="owner.set($any($event.target).value)" />
        </label>
        <label>
          Model
          <select [value]="model()" (change)="model.set($any($event.target).value)">
            @for (option of config.deployModels; track option) {
              <option [value]="option">{{ option }}</option>
            }
          </select>
        </label>
        <fieldset>
          <legend>Approved tools</legend>
          @for (tool of config.deployTools; track tool) {
            <label class="check-row">
              <input type="checkbox" [checked]="tools().includes(tool)" (change)="toggleTool(tool)" />
              {{ tool }}
            </label>
          }
        </fieldset>
        <button class="primary" type="button" (click)="submitted.set(true)">
          <span class="material-symbols-outlined">rocket_launch</span>
          Deploy to production
        </button>
      </article>

      <article class="panel coverage-panel">
        <p class="eyebrow">Release checks</p>
        <h2>{{ submitted() ? 'Ready to monitor' : 'Preflight complete' }}</h2>
        <p class="summary">{{ submitted() ? 'This agent will appear in the directory after the next health check.' : 'Policy, eval, and tool reviews are required before a production publish.' }}</p>
        <div class="coverage-details">
          <div><span>Policy gate</span><strong>Pass</strong></div>
          <div><span>Eval suite</span><strong>96.4%</strong></div>
          <div><span>Tool access</span><strong>{{ tools().length }} selected</strong></div>
        </div>
      </article>
    </section>
  `
})
export class DeployPageComponent {
  protected readonly config = templateConfig;
  protected readonly name = signal('Collections follow-up');
  protected readonly owner = signal('Finance');
  protected readonly model = signal(templateConfig.deployModels[0]);
  protected readonly tools = signal(['ERP lookup', 'Slack notify']);
  protected readonly submitted = signal(false);

  protected toggleTool(tool: string): void {
    this.tools.update((current) => current.includes(tool)
      ? current.filter((item) => item !== tool)
      : [...current, tool]);
  }
}
