import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  EdsBadgeComponent,
  EdsCardComponent,
  EdsStatComponent,
  EdsStatusComponent
} from '@poluru-labs/enterprise-design-system-angular';
import { templateConfig } from '../template.config';

@Component({
  selector: 'app-overview-page',
  standalone: true,
  imports: [EdsStatComponent, EdsCardComponent, EdsBadgeComponent, EdsStatusComponent],
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
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 12px;
      margin-bottom: 14px;
    }

    .page-head {
      margin-bottom: 16px;
    }

    .eyebrow {
      margin: 0;
      color: var(--brand);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .page-head h1 {
      margin: 6px 0;
      font-size: 26px;
      color: #15262c;
    }

    .page-head p {
      margin: 0;
      color: var(--muted);
      max-width: 640px;
    }

    .card {
      border-radius: 14px;
    }

    .meta {
      color: var(--muted);
      font-size: 12px;
      margin: 0;
    }

    .section-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .section-title {
      margin: 0;
      font-size: 18px;
      color: #15262c;
    }

    .features {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
      margin-bottom: 14px;
    }

    .feature-title {
      margin: 0;
      font-size: 15px;
      color: #15262c;
    }

    .feature-detail {
      color: var(--muted);
      margin: 6px 0 10px;
      font-size: 13px;
    }

    .activity-row {
      padding: 10px;
      display: flex;
      justify-content: space-between;
      gap: 10px;
      align-items: center;
      background: #f4f9f8;
      border-radius: 10px;
      margin-bottom: 8px;
    }

    .activity-row strong {
      display: block;
    }

    @media (max-width: 1180px) {
      .grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 780px) {
      .grid,
      .features {
        grid-template-columns: 1fr;
      }
    }
  `],
  template: `
    <section class="page-head">
      <p class="eyebrow">{{ config.eyebrow }}</p>
      <h1>{{ config.title }}</h1>
      <p>{{ config.summary }}</p>
    </section>

    <section class="grid">
      @for (metric of config.metrics; track metric.label) {
        <eds-card class="card" [elevated]="false">
          <eds-stat
            [label]="metric.label"
            [value]="metric.value"
            trend="up"
            [trendValue]="metric.trend"
            hint="this week"
          ></eds-stat>
        </eds-card>
      }
    </section>

    <eds-card class="card" [elevated]="false">
      <div class="section-head">
        <h2 class="section-title">Must-have features</h2>
        <eds-badge label="Core stack" variant="brand" [pill]="true" [soft]="true"></eds-badge>
      </div>
      <div class="features">
        @for (feature of config.mustHaveFeatures; track feature.title) {
          <eds-card class="card" [elevated]="false">
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-detail">{{ feature.detail }}</p>
            <eds-status class="status" [label]="feature.status" variant="success"></eds-status>
          </eds-card>
        }
      </div>
    </eds-card>

    <eds-card class="card" [elevated]="false">
      <div class="section-head">
        <h2 class="section-title">Recent usage activity</h2>
      </div>
      @for (entry of config.activity; track entry.title) {
        <div class="activity-row">
          <div>
            <strong>{{ entry.title }}</strong>
            <p class="meta">{{ entry.detail }}</p>
          </div>
          <eds-status class="status" [label]="entry.status" [variant]="statusVariant(entry.status)"></eds-status>
        </div>
      }
    </eds-card>
  `
})
export class OverviewPageComponent {
  protected readonly config = templateConfig;

  protected statusVariant(status: string): 'success' | 'warning' | 'danger' | 'info' | 'neutral' {
    if (status === 'Active' || status === 'Ready') {
      return 'success';
    }
    if (status === 'Updated') {
      return 'info';
    }
    return 'neutral';
  }
}
