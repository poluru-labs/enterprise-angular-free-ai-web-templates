import { routes } from './app.routes';
import { BoardPageComponent } from './features/board/board-page.component';
import { DatasetsPageComponent } from './features/datasets/datasets-page.component';
import { ModelsPageComponent } from './features/models/models-page.component';
import { RegressionsPageComponent } from './features/regressions/regressions-page.component';
import { ScorecardsPageComponent } from './features/scorecards/scorecards-page.component';
import { SettingsPageComponent } from './features/settings/settings-page.component';
import { SuitesPageComponent } from './features/suites/suites-page.component';

describe('routes', () => {
  it('maps every Eval Board page', () => {
    const paths = routes.map((route) => ({ path: route.path, component: route.component }));
    expect(paths).toEqual(
      expect.arrayContaining([
        { path: '', component: BoardPageComponent },
        { path: 'suites', component: SuitesPageComponent },
        { path: 'datasets', component: DatasetsPageComponent },
        { path: 'models', component: ModelsPageComponent },
        { path: 'regressions', component: RegressionsPageComponent },
        { path: 'scorecards', component: ScorecardsPageComponent },
        { path: 'settings', component: SettingsPageComponent }
      ])
    );
  });
});
