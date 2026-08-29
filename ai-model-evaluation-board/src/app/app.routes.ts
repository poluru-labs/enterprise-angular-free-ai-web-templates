import { Routes } from '@angular/router';
import { DashboardPageComponent } from './dashboard-page.component';
import { DatasetsPageComponent } from './datasets-page.component';
import { ScorecardsPageComponent } from './scorecards-page.component';
import { SettingsPageComponent } from './settings-page.component';
import { SuitesPageComponent } from './suites-page.component';

export const appRoutes: Routes = [
  { path: '', component: DashboardPageComponent },
  { path: 'suites', component: SuitesPageComponent },
  { path: 'datasets', component: DatasetsPageComponent },
  { path: 'scorecards', component: ScorecardsPageComponent },
  { path: 'settings', component: SettingsPageComponent },
  { path: '**', redirectTo: '' }
];
