import { routes } from './app.routes';
import { AlertsPageComponent } from './features/alerts/alerts-page.component';
import { BudgetsPageComponent } from './features/budgets/budgets-page.component';
import { ForecastsPageComponent } from './features/forecasts/forecasts-page.component';
import { ModelsPageComponent } from './features/models/models-page.component';
import { OverviewPageComponent } from './features/overview/overview-page.component';
import { SettingsPageComponent } from './features/settings/settings-page.component';
import { UsagePageComponent } from './features/usage/usage-page.component';

describe('routes', () => {
  it('maps every Lilac Meter page', () => {
    const paths = routes.map((route) => ({ path: route.path, component: route.component }));
    expect(paths).toEqual(
      expect.arrayContaining([
        { path: '', component: OverviewPageComponent },
        { path: 'usage', component: UsagePageComponent },
        { path: 'models', component: ModelsPageComponent },
        { path: 'budgets', component: BudgetsPageComponent },
        { path: 'alerts', component: AlertsPageComponent },
        { path: 'forecasts', component: ForecastsPageComponent },
        { path: 'settings', component: SettingsPageComponent }
      ])
    );
  });
});
