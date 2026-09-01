import { routes } from './app.routes';
import { CollectionsPageComponent } from './features/collections/collections-page.component';
import { ExperimentsPageComponent } from './features/experiments/experiments-page.component';
import { LibraryPageComponent } from './features/library/library-page.component';
import { SettingsPageComponent } from './features/settings/settings-page.component';
import { VersionsPageComponent } from './features/versions/versions-page.component';

describe('routes', () => {
  it('maps every Prompt library page', () => {
    const paths = routes.map((route) => ({ path: route.path, component: route.component }));
    expect(paths).toEqual(
      expect.arrayContaining([
        { path: '', component: LibraryPageComponent },
        { path: 'experiments', component: ExperimentsPageComponent },
        { path: 'versions', component: VersionsPageComponent },
        { path: 'collections', component: CollectionsPageComponent },
        { path: 'settings', component: SettingsPageComponent }
      ])
    );
  });
});
