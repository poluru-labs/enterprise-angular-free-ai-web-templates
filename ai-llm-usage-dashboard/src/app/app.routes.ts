import { Routes } from '@angular/router';
import { AlertsPageComponent } from './features/alerts/alerts-page.component';
import { BudgetsPageComponent } from './features/budgets/budgets-page.component';
import { ForecastsPageComponent } from './features/forecasts/forecasts-page.component';
import { ModelsPageComponent } from './features/models/models-page.component';
import { OverviewPageComponent } from './features/overview/overview-page.component';
import { SettingsPageComponent } from './features/settings/settings-page.component';
import { UsagePageComponent } from './features/usage/usage-page.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: OverviewPageComponent },
  { path: 'usage', component: UsagePageComponent },
  { path: 'models', component: ModelsPageComponent },
  { path: 'budgets', component: BudgetsPageComponent },
  { path: 'alerts', component: AlertsPageComponent },
  { path: 'forecasts', component: ForecastsPageComponent },
  { path: 'settings', component: SettingsPageComponent },
  { path: '**', redirectTo: '' }
];
