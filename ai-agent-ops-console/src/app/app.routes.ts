import { Routes } from '@angular/router';
import { AlertsPageComponent } from './alerts-page.component';
import { AgentsPageComponent } from './agents-page.component';
import { DashboardComponent } from './dashboard.component';
import { DeployPageComponent } from './deploy-page.component';
import { HandoffsPageComponent } from './handoffs-page.component';
import { RunsPageComponent } from './runs-page.component';
import { SearchPageComponent } from './search-page.component';
import { SettingsPageComponent } from './settings-page.component';
import { ToolsPageComponent } from './tools-page.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: DashboardComponent },
  { path: 'agents', component: AgentsPageComponent },
  { path: 'runs', component: RunsPageComponent },
  { path: 'tools', component: ToolsPageComponent },
  { path: 'handoffs', component: HandoffsPageComponent },
  { path: 'alerts', component: AlertsPageComponent },
  { path: 'deploy', component: DeployPageComponent },
  { path: 'search', component: SearchPageComponent },
  { path: 'settings', component: SettingsPageComponent },
  { path: '**', redirectTo: '' }
];
