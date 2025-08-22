import { filter, map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { has } from 'ramda';
import { Store, TypedSelector } from '@ngxs/store';
import { DestroyRef, Inject, inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StateUtils {
  constructor(private store: Store, private destroyRef: DestroyRef) {}

  getStateSnapshot(
    action: TypedSelector<any>,
    stateKey: string = '',
  ) {
    const state = this.store.selectSnapshot(action);
    return stateKey ? state[stateKey] : state;
  }
  // Factory function
  getState$(
    action: TypedSelector<any>,
    stateKey: string = '',
  ) {
    let state$ = this.store.select(action);
    if (stateKey) {
      state$ = state$.pipe(
        filter(state => has(stateKey, state)),
        map(state => state[stateKey]),
      );
    }
    return state$.pipe(
      takeUntilDestroyed(this.destroyRef)
    );
  }
}