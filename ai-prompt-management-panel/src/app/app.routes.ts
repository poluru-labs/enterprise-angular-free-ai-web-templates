import { Routes } from '@angular/router';
import { CollectionsPageComponent } from './features/collections/collections-page.component';
import { ExperimentsPageComponent } from './features/experiments/experiments-page.component';
import { LibraryPageComponent } from './features/library/library-page.component';
import { SettingsPageComponent } from './features/settings/settings-page.component';
import { VersionsPageComponent } from './features/versions/versions-page.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: LibraryPageComponent },
  { path: 'experiments', component: ExperimentsPageComponent },
  { path: 'versions', component: VersionsPageComponent },
  { path: 'collections', component: CollectionsPageComponent },
  { path: 'settings', component: SettingsPageComponent },
  { path: '**', redirectTo: '' }
];
