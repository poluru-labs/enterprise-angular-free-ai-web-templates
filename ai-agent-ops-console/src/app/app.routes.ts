import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { OperationsPageComponent } from './operations-page.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: DashboardComponent },
  { path: 'agents', component: OperationsPageComponent, data: { title: 'Agents', eyebrow: 'Agent directory', icon: 'smart_toy', description: 'Deploy, configure, and monitor the agents working across your business.' } },
  { path: 'runs', component: OperationsPageComponent, data: { title: 'Runs', eyebrow: 'Execution history', icon: 'timeline', description: 'Review agent execution history, intervention points, and outcome quality.' } },
  { path: 'tools', component: OperationsPageComponent, data: { title: 'Tools', eyebrow: 'Tool registry', icon: 'construction', description: 'Manage the approved tools and integrations available to your agents.' } },
  { path: 'settings', component: OperationsPageComponent, data: { title: 'Settings', eyebrow: 'Workspace controls', icon: 'tune', description: 'Set workspace policies, alerts, and access rules for agent operations.' } },
  { path: '**', redirectTo: '' }
];