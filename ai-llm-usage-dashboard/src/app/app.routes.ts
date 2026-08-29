import { Routes } from '@angular/router';
import { BudgetsPageComponent } from './budgets-page.component';
import { ModelsPageComponent } from './models-page.component';
import { OverviewPageComponent } from './overview-page.component';
import { SettingsPageComponent } from './settings-page.component';
import { UsagePageComponent } from './usage-page.component';

export const appRoutes: Routes = [
  { path: '', component: OverviewPageComponent },
  { path: 'usage', component: UsagePageComponent },
  { path: 'models', component: ModelsPageComponent },
  { path: 'budgets', component: BudgetsPageComponent },
  { path: 'settings', component: SettingsPageComponent },
  { path: '**', redirectTo: '' }
];
