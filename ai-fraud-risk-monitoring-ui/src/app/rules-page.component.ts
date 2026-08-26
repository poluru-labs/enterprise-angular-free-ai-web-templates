import { ChangeDetectionStrategy, Component } from '@angular/core';
import { templateConfig } from '../template.config';

@Component({
  selector: 'app-rules-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Models & policy</p>
        <h1>Rules</h1>
        <p class="summary">Live detection packs owned by the Poluru Labs risk team.</p>
      </div>
    </section>

    <section class="panel list-panel">
      <div class="list-head rules-grid">
        <span>Rule</span>
        <span>Owner</span>
        <span>Hits</span>
        <span>Precision</span>
        <span>Status</span>
      </div>
      @for (item of config.rules; track item.name) {
        <div class="list-row rules-grid">
          <strong>{{ item.name }}</strong>
          <span>{{ item.owner }}</span>
          <span>{{ item.hits }}</span>
          <span>{{ item.precision }}</span>
          <span class="status" [class]="item.tone">{{ item.status }}</span>
        </div>
      }
    </section>
  `
})
export class RulesPageComponent {
  protected readonly config = templateConfig;
}
