import { Routes } from '@angular/router';
import { BrandVoicePageComponent } from './brand-voice-page.component';
import { CalendarPageComponent } from './calendar-page.component';
import { DashboardPageComponent } from './dashboard-page.component';
import { ProjectsPageComponent } from './projects-page.component';
import { SettingsPageComponent } from './settings-page.component';

export const appRoutes: Routes = [
  { path: '', component: DashboardPageComponent },
  { path: 'projects', component: ProjectsPageComponent },
  { path: 'calendar', component: CalendarPageComponent },
  { path: 'brand-voice', component: BrandVoicePageComponent },
  { path: 'settings', component: SettingsPageComponent },
  { path: '**', redirectTo: '' }
];
