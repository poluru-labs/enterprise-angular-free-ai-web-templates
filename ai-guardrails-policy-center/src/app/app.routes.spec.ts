import { routes } from './app.routes';
import { EndpointsPageComponent } from './features/endpoints/endpoints-page.component';
import { FiltersPageComponent } from './features/filters/filters-page.component';
import { OverviewPageComponent } from './features/overview/overview-page.component';
import { PiiPageComponent } from './features/pii/pii-page.component';
import { PlaygroundPageComponent } from './features/playground/playground-page.component';
import { PoliciesPageComponent } from './features/policies/policies-page.component';
import { SettingsPageComponent } from './features/settings/settings-page.component';
import { ViolationsPageComponent } from './features/violations/violations-page.component';

describe('routes', () => {
  it('maps every Reef page', () => {
    const paths = routes.map((route) => ({ path: route.path, component: route.component }));
    expect(paths).toEqual(
      expect.arrayContaining([
        { path: '', component: OverviewPageComponent },
        { path: 'policies', component: PoliciesPageComponent },
        { path: 'filters', component: FiltersPageComponent },
        { path: 'pii', component: PiiPageComponent },
        { path: 'endpoints', component: EndpointsPageComponent },
        { path: 'playground', component: PlaygroundPageComponent },
        { path: 'violations', component: ViolationsPageComponent },
        { path: 'settings', component: SettingsPageComponent }
      ])
    );
  });
});
