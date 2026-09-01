import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  EdsButtonComponent,
  EdsCardComponent,
  EdsCircularProgressComponent,
  EdsDataTableColumn,
  EdsDataTableComponent,
  EdsMeterComponent,
  EdsProgressBarComponent,
  EdsSliderComponent,
  EdsStatComponent,
  EdsStatusComponent,
  EdsTagComponent
} from '@poluru-labs/enterprise-design-system-angular';
import { templateConfig } from '../../core/config/template.config';
import { spendStatus, statusVariant } from '../../shared/utils/status-variant';
import { applyForecastGrowth } from '../../shared/utils/usage';

@Component({
  selector: 'app-forecasts-page',
  standalone: true,
  imports: [
    RouterLink,
    EdsButtonComponent,
    EdsCardComponent,
    EdsCircularProgressComponent,
    EdsDataTableComponent,
    EdsMeterComponent,
    EdsProgressBarComponent,
    EdsSliderComponent,
    EdsStatComponent,
    EdsStatusComponent,
    EdsTagComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-head">
      <div>
        <p class="eyebrow">Finance</p>
        <h1>Forecasts</h1>
        <p class="summary">Month-end spend if current growth holds. Production is the workspace most likely to breach.</p>
      </div>
      <eds-button variant="primary" size="sm" icon="bell" (clicked)="goAlerts()">Open alerts</eds-button>
    </section>

    <section class="grid-4">
      <eds-card class="card-pad" [elevated]="false">
        <eds-stat label="Workspaces over 80%" [value]="watchLabel()" trend="up" trendValue="Watch" hint="this month"></eds-stat>
      </eds-card>
      <eds-card class="card-pad" [elevated]="false">
        <eds-stat label="Projected breaches" [value]="breachLabel()" trend="up" trendValue="If growth holds" hint="month-end"></eds-stat>
      </eds-card>
      <eds-card class="card-pad" [elevated]="false">
        <eds-stat label="Soonest cap" [value]="soonest().workspace" trend="down" [trendValue]="soonest().daysToCap + ' days'" hint="Lakshmi Poluru"></eds-stat>
      </eds-card>
      <eds-card class="card-pad forecast-hero" [elevated]="false">
        <eds-circular-progress [value]="soonest().projected" [max]="120" [size]="64" [showValue]="true"></eds-circular-progress>
        <div>
          <p class="eyebrow">Projected</p>
          <h2>{{ soonest().projected }}%</h2>
        </div>
      </eds-card>
    </section>

    <eds-card class="card-pad" [elevated]="false" style="margin-top: 0.9rem">
      <div class="section-head">
        <div>
          <h2>What-if growth</h2>
          <p class="meta">Drag weekly growth to restress every workspace cap.</p>
        </div>
        <eds-tag [label]="growth() + '% / week'" variant="brand"></eds-tag>
      </div>
      <eds-slider
        label="Weekly growth"
        [min]="0"
        [max]="30"
        [step]="1"
        [value]="growth()"
        [showValue]="true"
        (valueChange)="growth.set($event)"
      ></eds-slider>
    </eds-card>

    <section class="split" style="margin-top: 0.9rem">
      <eds-card class="card-pad" [elevated]="false">
        <h2>Workspace runway</h2>
        @for (item of projected(); track item.workspace) {
          <div class="job-row">
            <div class="job-head">
              <div>
                <strong>{{ item.workspace }}</strong>
                <p class="meta">{{ item.owner }} · {{ item.daysToCap }} days to cap · {{ item.cap }}</p>
              </div>
              <eds-status [label]="spendStatus(item.projected)" [variant]="statusVariant(spendStatus(item.projected))"></eds-status>
            </div>
            <eds-progress-bar [value]="capBar(item.projected)" [max]="120" [label]="item.workspace" [showValue]="true"></eds-progress-bar>
          </div>
        }
      </eds-card>

      <eds-card class="card-pad" [elevated]="false">
        <h2>Month-end table</h2>
        <div class="table-wrap">
          <eds-data-table [columns]="columns" [rows]="tableRows()" [striped]="true" [compact]="true"></eds-data-table>
        </div>
        <div class="meter-row">
          <span><span>Platform projected</span><strong>{{ platformProjected() }}%</strong></span>
          <eds-meter [value]="capMeter(platformProjected())" [max]="100" label="Platform projected" [showValue]="true"></eds-meter>
        </div>
        <p class="meta">Priya Poluru’s finance digest uses this table. <a routerLink="/budgets">Open budgets</a></p>
      </eds-card>
    </section>
  `
})
export class ForecastsPageComponent {
  private readonly router = inject(Router);
  protected readonly config = templateConfig;
  protected readonly growth = signal(12);
  protected readonly spendStatus = spendStatus;
  protected readonly statusVariant = statusVariant;

  protected readonly projected = computed(() => applyForecastGrowth(this.config.forecasts, this.growth()));

  protected readonly watchCount = computed(() => this.projected().filter((item) => item.current >= 80).length);

  protected readonly breachCount = computed(() => this.projected().filter((item) => item.projected >= 100).length);

  protected readonly watchLabel = computed(() => String(this.watchCount()));

  protected readonly breachLabel = computed(() => String(this.breachCount()));

  protected readonly soonest = computed(
    () => [...this.projected()].sort((a, b) => a.daysToCap - b.daysToCap)[0] ?? this.config.forecasts[0]
  );

  protected readonly platformProjected = computed(() => {
    const rows = this.projected();
    if (rows.length === 0) {
      return 0;
    }
    return Math.round(rows.reduce((sum, item) => sum + item.projected, 0) / rows.length);
  });

  protected readonly columns: EdsDataTableColumn[] = [
    { key: 'workspace', label: 'Workspace', sortable: true },
    { key: 'owner', label: 'Owner', sortable: true },
    { key: 'projected', label: 'Projected', sortable: true },
    { key: 'daysToCap', label: 'Days to cap', sortable: true }
  ];

  protected readonly tableRows = computed(() =>
    this.projected().map((item) => ({
      workspace: item.workspace,
      owner: item.owner,
      projected: item.projected + '%',
      daysToCap: String(item.daysToCap)
    }))
  );

  protected capBar(value: number): number {
    return Math.min(value, 120);
  }

  protected capMeter(value: number): number {
    return Math.min(value, 100);
  }

  protected goAlerts(): void {
    void this.router.navigateByUrl('/alerts');
  }
}
