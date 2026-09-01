import { Routes } from '@angular/router';
import { BoardPageComponent } from './features/board/board-page.component';
import { DatasetsPageComponent } from './features/datasets/datasets-page.component';
import { ModelsPageComponent } from './features/models/models-page.component';
import { RegressionsPageComponent } from './features/regressions/regressions-page.component';
import { ScorecardsPageComponent } from './features/scorecards/scorecards-page.component';
import { SettingsPageComponent } from './features/settings/settings-page.component';
import { SuitesPageComponent } from './features/suites/suites-page.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: BoardPageComponent },
  { path: 'suites', component: SuitesPageComponent },
  { path: 'datasets', component: DatasetsPageComponent },
  { path: 'models', component: ModelsPageComponent },
  { path: 'regressions', component: RegressionsPageComponent },
  { path: 'scorecards', component: ScorecardsPageComponent },
  { path: 'settings', component: SettingsPageComponent },
  { path: '**', redirectTo: '' }
];
