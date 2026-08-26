import { Routes } from '@angular/router';
import { AlertsPageComponent } from './alerts-page.component';
import { CasesPageComponent } from './cases-page.component';
import { DashboardComponent } from './dashboard.component';
import { RulesPageComponent } from './rules-page.component';
import { SettingsPageComponent } from './settings-page.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: DashboardComponent },
  { path: 'alerts', component: AlertsPageComponent },
  { path: 'cases', component: CasesPageComponent },
  { path: 'rules', component: RulesPageComponent },
  { path: 'settings', component: SettingsPageComponent },
  { path: '**', redirectTo: '' }
];
