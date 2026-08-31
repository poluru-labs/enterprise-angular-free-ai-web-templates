import { Routes } from '@angular/router';
import { ConversationsPageComponent } from './conversations-page.component';
import { KnowledgePageComponent } from './knowledge-page.component';
import { QueuePageComponent } from './queue-page.component';
import { SettingsPageComponent } from './settings-page.component';
import { SuggestionsPageComponent } from './suggestions-page.component';

export const appRoutes: Routes = [
  { path: '', component: QueuePageComponent },
  { path: 'conversations', component: ConversationsPageComponent },
  { path: 'suggestions', component: SuggestionsPageComponent },
  { path: 'knowledge', component: KnowledgePageComponent },
  { path: 'settings', component: SettingsPageComponent },
  { path: '**', redirectTo: '' }
];
