import { Routes } from '@angular/router';
import { AccountsPageComponent } from './accounts-page.component';
import { OverviewPageComponent } from './overview-page.component';
import { SequencesPageComponent } from './sequences-page.component';
import { SettingsPageComponent } from './settings-page.component';
import { SignalsPageComponent } from './signals-page.component';

export const appRoutes: Routes = [
  { path: '', component: OverviewPageComponent },
  { path: 'accounts', component: AccountsPageComponent },
  { path: 'signals', component: SignalsPageComponent },
  { path: 'sequences', component: SequencesPageComponent },
  { path: 'settings', component: SettingsPageComponent },
  { path: '**', redirectTo: '' }
];
