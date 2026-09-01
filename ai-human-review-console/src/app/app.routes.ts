import { Routes } from '@angular/router';
import { AssignmentsPageComponent } from './features/assignments/assignments-page.component';
import { AuditPageComponent } from './features/audit/audit-page.component';
import { CalibrationPageComponent } from './features/calibration/calibration-page.component';
import { PoliciesPageComponent } from './features/policies/policies-page.component';
import { QueuePageComponent } from './features/queue/queue-page.component';
import { ReportsPageComponent } from './features/reports/reports-page.component';
import { SearchPageComponent } from './features/search/search-page.component';
import { SettingsPageComponent } from './features/settings/settings-page.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: QueuePageComponent },
  { path: 'assignments', component: AssignmentsPageComponent },
  { path: 'policies', component: PoliciesPageComponent },
  { path: 'calibration', component: CalibrationPageComponent },
  { path: 'reports', component: ReportsPageComponent },
  { path: 'audit', component: AuditPageComponent },
  { path: 'search', component: SearchPageComponent },
  { path: 'settings', component: SettingsPageComponent },
  { path: '**', redirectTo: '' }
];
