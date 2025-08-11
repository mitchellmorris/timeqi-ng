import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './providers/auth/authInterceptor';
import { withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';
import { provideStore } from '@ngxs/store';
import { OrganizationsState } from './store/organizations/organizations.state';
import { UserState } from './store/user/user.state';
import { ProjectsState } from './store/projects/projects.state';
import { TasksState } from './store/tasks/tasks.state';
import { EntriesState } from './store/entries/entries.state';
import { TimeOffState } from './store/time-off/time-off.state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    providePrimeNG({
      theme: {
        preset: Aura
      }
    }), 
    provideStore(
      [
        UserState,
        OrganizationsState,
        ProjectsState,
        TasksState,
        EntriesState,
        TimeOffState
      ],
      withNgxsReduxDevtoolsPlugin()
    )
  ]
};
