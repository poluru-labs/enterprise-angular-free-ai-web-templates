import { Routes } from '@angular/router';
import { ClustersPageComponent } from './features/clusters/clusters-page.component';
import { IndexesPageComponent } from './features/indexes/indexes-page.component';
import { NamespacesPageComponent } from './features/namespaces/namespaces-page.component';
import { NeighborsPageComponent } from './features/neighbors/neighbors-page.component';
import { OverviewPageComponent } from './features/overview/overview-page.component';
import { SearchPageComponent } from './features/search/search-page.component';
import { SettingsPageComponent } from './features/settings/settings-page.component';
import { VectorsPageComponent } from './features/vectors/vectors-page.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: OverviewPageComponent },
  { path: 'indexes', component: IndexesPageComponent },
  { path: 'namespaces', component: NamespacesPageComponent },
  { path: 'vectors', component: VectorsPageComponent },
  { path: 'search', component: SearchPageComponent },
  { path: 'neighbors', component: NeighborsPageComponent },
  { path: 'clusters', component: ClustersPageComponent },
  { path: 'settings', component: SettingsPageComponent },
  { path: '**', redirectTo: '' }
];
