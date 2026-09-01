import { routes } from './app.routes';
import { CollectionsPageComponent } from './features/collections/collections-page.component';
import { EvaluationsPageComponent } from './features/evaluations/evaluations-page.component';
import { GovernancePageComponent } from './features/governance/governance-page.component';
import { IndexingPageComponent } from './features/indexing/indexing-page.component';
import { OverviewPageComponent } from './features/overview/overview-page.component';
import { RetrievalPageComponent } from './features/retrieval/retrieval-page.component';
import { SettingsPageComponent } from './features/settings/settings-page.component';
import { SourcesPageComponent } from './features/sources/sources-page.component';

describe('routes', () => {
  it('maps every Indigo Vault page', () => {
    const paths = routes.map((route) => ({ path: route.path, component: route.component }));
    expect(paths).toEqual(
      expect.arrayContaining([
        { path: '', component: OverviewPageComponent },
        { path: 'sources', component: SourcesPageComponent },
        { path: 'collections', component: CollectionsPageComponent },
        { path: 'indexing', component: IndexingPageComponent },
        { path: 'retrieval', component: RetrievalPageComponent },
        { path: 'governance', component: GovernancePageComponent },
        { path: 'evaluations', component: EvaluationsPageComponent },
        { path: 'settings', component: SettingsPageComponent }
      ])
    );
  });
});
