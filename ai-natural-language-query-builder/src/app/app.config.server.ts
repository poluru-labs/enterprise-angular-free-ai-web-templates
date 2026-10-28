import {
  ENVIRONMENT_INITIALIZER,
  mergeApplicationConfig,
  ApplicationConfig,
} from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { patchSvgInnerHtmlForDomino } from '../ssr-dom-polyfills';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue: () => patchSvgInnerHtmlForDomino(),
    },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
