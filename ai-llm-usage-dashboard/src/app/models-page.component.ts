import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  EdsCardComponent,
  EdsStatusComponent,
  EdsTagComponent
} from '@poluru-labs/enterprise-design-system-angular';
import { templateConfig } from '../template.config';

@Component({
  selector: 'app-models-page',
  standalone: true,
  imports: [EdsCardComponent, EdsTagComponent, EdsStatusComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host {
      --brand: #08766c;
      --line: #dfe7e6;
      --muted: #66777d;
      display: block;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
    }

    .card {
      border-radius: 14px;
    }

    h3 {
      margin: 0 0 6px;
      color: #15262c;
      font-size: 15px;
    }

    p {
      margin: 8px 0;
      color: var(--muted);
      font-size: 13px;
    }

    small {
      display: block;
      color: var(--muted);
      margin-bottom: 10px;
    }

    @media (max-width: 920px) {
      .grid {
        grid-template-columns: 1fr;
      }
    }
  `],
  template: `
    <section class="grid">
      @for (model of config.models; track model.title) {
        <eds-card class="card" [elevated]="false">
          <h3>{{ model.title }}</h3>
          <p>{{ model.detail }}</p>
          <small>Owner: {{ model.owner }}</small>
          <eds-tag [label]="model.status === 'Restricted' ? 'Restricted access' : 'Open access'" variant="brand"></eds-tag>
          <eds-status [label]="model.status" [variant]="model.status === 'Active' ? 'success' : 'warning'"></eds-status>
        </eds-card>
      }
    </section>
  `
})
export class ModelsPageComponent {
  protected readonly config = templateConfig;
}
