import { Routes } from '@angular/router';
import { CollectionsPageComponent } from './collections-page.component';
import { IndexingPageComponent } from './indexing-page.component';
import { OverviewPageComponent } from './overview-page.component';
import { RetrievalPageComponent } from './retrieval-page.component';
import { SettingsPageComponent } from './settings-page.component';
import { SourcesPageComponent } from './sources-page.component';

export const appRoutes: Routes = [
  { path: '', component: OverviewPageComponent },
  { path: 'sources', component: SourcesPageComponent },
  { path: 'collections', component: CollectionsPageComponent },
  { path: 'indexing', component: IndexingPageComponent },
  { path: 'retrieval', component: RetrievalPageComponent },
  { path: 'settings', component: SettingsPageComponent },
  { path: '**', redirectTo: '' }
];
