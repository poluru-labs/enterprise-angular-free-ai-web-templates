import { Routes } from '@angular/router';
import { AlertsPageComponent } from './features/alerts/alerts-page.component';
import { CasesPageComponent } from './features/cases/cases-page.component';
import { DashboardPageComponent } from './features/dashboard/dashboard-page.component';
import { ReportsPageComponent } from './features/reports/reports-page.component';
import { RulesPageComponent } from './features/rules/rules-page.component';
import { SearchPageComponent } from './features/search/search-page.component';
import { SettingsPageComponent } from './features/settings/settings-page.component';
import { WatchlistPageComponent } from './features/watchlist/watchlist-page.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: DashboardPageComponent },
  { path: 'alerts', component: AlertsPageComponent },
  { path: 'cases', component: CasesPageComponent },
  { path: 'watchlist', component: WatchlistPageComponent },
  { path: 'rules', component: RulesPageComponent },
  { path: 'reports', component: ReportsPageComponent },
  { path: 'search', component: SearchPageComponent },
  { path: 'settings', component: SettingsPageComponent },
  { path: '**', redirectTo: '' }
];
