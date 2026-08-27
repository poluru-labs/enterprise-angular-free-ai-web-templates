import { Routes } from '@angular/router';
import { AssignmentsPageComponent } from './assignments-page.component';
import { AuditPageComponent } from './audit-page.component';
import { PoliciesPageComponent } from './policies-page.component';
import { QueuePageComponent } from './queue-page.component';
import { SettingsPageComponent } from './settings-page.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: QueuePageComponent },
  { path: 'assignments', component: AssignmentsPageComponent },
  { path: 'policies', component: PoliciesPageComponent },
  { path: 'audit', component: AuditPageComponent },
  { path: 'settings', component: SettingsPageComponent },
  { path: '**', redirectTo: '' }
];
