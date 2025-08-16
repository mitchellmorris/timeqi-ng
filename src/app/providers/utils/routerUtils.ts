import { DestroyRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export function navigationEndUrl$(router: Router, destroyRef: DestroyRef) {
  return router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    map((event: NavigationEnd) => event.url),
    takeUntilDestroyed(destroyRef),
  );
}

export function getTabIndexByUrlByLastSegment$(router: Router, tabs: { route: string; label: string; icon: string; }[], destroyRef: DestroyRef) {
  const segments = tabs.map(tab => tab.route.split('/').pop() || '');
  return navigationEndUrl$(router, destroyRef).pipe(
    map(url => {
      const lastSegment = url.split('?')[0].split('/').pop() || null;
      return segments.indexOf(lastSegment ?? '') !== -1 ? segments.indexOf(lastSegment ?? '') : 0;
    }),
    takeUntilDestroyed(destroyRef)
  );
}