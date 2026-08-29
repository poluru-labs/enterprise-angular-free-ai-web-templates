import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  EdsCardComponent,
  EdsStatusComponent,
  EdsTagComponent
} from '@poluru-labs/enterprise-design-system-angular';
import { templateConfig } from '../template.config';

@Component({
  selector: 'app-datasets-page',
  standalone: true,
  imports: [EdsCardComponent, EdsTagComponent, EdsStatusComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host {
      --brand: #2f6b1f;
      --line: #cdeab8;
      --muted: #5d6f5d;
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
      color: #16351b;
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
      @for (dataset of config.datasets; track dataset.title) {
        <eds-card class="card" [elevated]="false">
          <h3>{{ dataset.title }}</h3>
          <p>{{ dataset.detail }}</p>
          <small>Owner: {{ dataset.owner }}</small>
          <eds-tag [label]="dataset.status === 'Restricted' ? 'Restricted access' : 'Open access'" variant="brand"></eds-tag>
          <eds-status [label]="dataset.status" [variant]="dataset.status === 'Ready' ? 'success' : 'warning'"></eds-status>
        </eds-card>
      }
    </section>
  `
})
export class DatasetsPageComponent {
  protected readonly config = templateConfig;
}
