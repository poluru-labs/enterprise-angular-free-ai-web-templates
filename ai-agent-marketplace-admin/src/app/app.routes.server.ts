import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    // The design-system icons use SVG innerHTML, which the server DOM does not support.
    renderMode: RenderMode.Client
  }
];
