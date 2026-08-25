import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  EdsCardComponent,
  EdsStatusComponent,
  EdsTagComponent
} from '@poluru-labs/enterprise-design-system-angular';

@Component({
  selector: 'app-brand-voice-page',
  standalone: true,
  imports: [EdsCardComponent, EdsTagComponent, EdsStatusComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host {
      --brand: #0046ff;
      --line: #dbe7ff;
      --muted: #5d6f92;
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
      color: #16335f;
      font-size: 15px;
    }

    p {
      margin: 8px 0;
      color: var(--muted);
      font-size: 13px;
    }

    .tone {
      margin-top: 18px;
      background: #f5f8ff;
      padding: 12px;
      border-radius: 10px;
      color: #24406f;
    }

    @media (max-width: 920px) {
      .grid {
        grid-template-columns: 1fr;
      }
    }
  `],
  template: `
    <section class="grid">
      <eds-card class="card" [elevated]="false">
        <h3>Audience clarity</h3>
        <p>Use clear language for technical buyers while preserving business context.</p>
        <eds-tag label="Priority" variant="brand"></eds-tag>
      </eds-card>
      <eds-card class="card" [elevated]="false">
        <h3>Voice consistency</h3>
        <p>Keep tone confident, practical, and solution-led in all assisted drafts.</p>
        <eds-status label="Healthy" variant="success"></eds-status>
      </eds-card>
      <eds-card class="card" [elevated]="false">
        <h3>Compliance checks</h3>
        <p>Flag unsupported claims and blocked terminology before publishing.</p>
        <eds-status label="Guarded" variant="info"></eds-status>
      </eds-card>
    </section>

    <aside class="tone">
      Default tone profile: Crisp, trusted, and outcome-focused. Keep sentence length short and avoid hype.
    </aside>
  `
})
export class BrandVoicePageComponent {}
