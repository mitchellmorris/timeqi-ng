import { DestroyRef, Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({providedIn: 'root'})
export class RouterUtils {
  constructor(private router: Router, private destroyRef: DestroyRef) {}

  navigationEndUrl$() {
    return this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.url),
      takeUntilDestroyed(this.destroyRef),
    );
  }

  getTabIndexByUrlByLastSegment$(tabs: { route: string; label: string; icon: string; }[]) {
    const segments = tabs.map(tab => tab.route.split('/').pop() || '');
    return this.navigationEndUrl$().pipe(
      map(url => {
        const lastSegment = url.split('?')[0].split('/').pop() || null;
        return segments.indexOf(lastSegment ?? '') !== -1 ? segments.indexOf(lastSegment ?? '') : 0;
      }),
      takeUntilDestroyed(this.destroyRef)
    );
  }
}