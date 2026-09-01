import { routes } from './app.routes';
import { AgentsPageComponent } from './features/agents/agents-page.component';
import { ConversationsPageComponent } from './features/conversations/conversations-page.component';
import { KnowledgePageComponent } from './features/knowledge/knowledge-page.component';
import { QueuePageComponent } from './features/queue/queue-page.component';
import { ReportsPageComponent } from './features/reports/reports-page.component';
import { SettingsPageComponent } from './features/settings/settings-page.component';
import { SuggestionsPageComponent } from './features/suggestions/suggestions-page.component';

describe('routes', () => {
  it('maps every Harbor Desk page', () => {
    const paths = routes.map((route) => ({ path: route.path, component: route.component }));
    expect(paths).toEqual(
      expect.arrayContaining([
        { path: '', component: QueuePageComponent },
        { path: 'conversations', component: ConversationsPageComponent },
        { path: 'suggestions', component: SuggestionsPageComponent },
        { path: 'knowledge', component: KnowledgePageComponent },
        { path: 'agents', component: AgentsPageComponent },
        { path: 'reports', component: ReportsPageComponent },
        { path: 'settings', component: SettingsPageComponent }
      ])
    );
  });
});
