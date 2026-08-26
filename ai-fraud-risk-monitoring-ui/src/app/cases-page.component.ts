import { ChangeDetectionStrategy, Component } from '@angular/core';
import { templateConfig } from '../template.config';

@Component({
  selector: 'app-cases-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Investigations</p>
        <h1>Cases</h1>
        <p class="summary">Open fraud cases across wires, devices, card testing, and account takeover.</p>
      </div>
    </section>

    <section class="panel list-panel">
      <div class="list-head cases-grid">
        <span>Case</span>
        <span>Subject</span>
        <span>Type</span>
        <span>Amount</span>
        <span>Owner</span>
        <span>Status</span>
      </div>
      @for (item of config.cases; track item.id) {
        <div class="list-row cases-grid">
          <strong>{{ item.id }}</strong>
          <span>{{ item.subject }}</span>
          <span>{{ item.type }}</span>
          <span>{{ item.amount }}</span>
          <span>{{ item.owner }}</span>
          <span class="status" [class]="item.tone">{{ item.status }}</span>
        </div>
      }
    </section>
  `
})
export class CasesPageComponent {
  protected readonly config = templateConfig;
}
