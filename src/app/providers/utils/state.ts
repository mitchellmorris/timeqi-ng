import { filter, map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { has } from 'ramda';
import { Store, TypedSelector } from '@ngxs/store';
import { DestroyRef, Inject, inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StateUtils {
  constructor(private store: Store, private destroyRef: DestroyRef) {}
  // Factory function
  getState$(
    action: TypedSelector<unknown>,
    stateKey: string = '',
  ) {
    return getState$(this.store, action, stateKey, this.destroyRef);
  }
}

// Factory function
export function getState$(
  store: Store, 
  action: TypedSelector<unknown>, 
  stateKey: string = '', 
  destroyRef: DestroyRef | null = null
) {
  let state$ = store.select(action);
  if (stateKey) {
    state$ = state$.pipe(
      filter(state => has(stateKey, state)),
      map(state => state[stateKey]),
    );
  }
  if (destroyRef) {
    return state$.pipe(
      takeUntilDestroyed(destroyRef)
    );
  }
  return state$;
}