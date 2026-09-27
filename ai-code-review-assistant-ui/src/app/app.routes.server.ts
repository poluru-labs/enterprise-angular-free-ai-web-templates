import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    // The design-system SVG icons require the browser DOM.
    renderMode: RenderMode.Client
  }
];
