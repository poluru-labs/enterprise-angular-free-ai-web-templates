import { Routes } from '@angular/router';
import { AccountsPageComponent } from './features/accounts/accounts-page.component';
import { ForecastsPageComponent } from './features/forecasts/forecasts-page.component';
import { MeetingsPageComponent } from './features/meetings/meetings-page.component';
import { OverviewPageComponent } from './features/overview/overview-page.component';
import { SequencesPageComponent } from './features/sequences/sequences-page.component';
import { SettingsPageComponent } from './features/settings/settings-page.component';
import { SignalsPageComponent } from './features/signals/signals-page.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: OverviewPageComponent },
  { path: 'accounts', component: AccountsPageComponent },
  { path: 'signals', component: SignalsPageComponent },
  { path: 'sequences', component: SequencesPageComponent },
  { path: 'meetings', component: MeetingsPageComponent },
  { path: 'forecasts', component: ForecastsPageComponent },
  { path: 'settings', component: SettingsPageComponent },
  { path: '**', redirectTo: '' }
];
