import { CanDeactivateFn } from '@angular/router';

// The guard will call a component's `canDeactivate()` hook if present,
// and if navigation is allowed it will call the component's `cleanup()` hook
// (this keeps cleanup logic colocated in the component).
export const cleanNewTaskGuard: CanDeactivateFn<any> = (component) => {
  try {
    const result = (component && (component as any).canDeactivate)
      ? (component as any).canDeactivate()
      : true;

    return Promise.resolve(result).then((allowed) => {
      if (allowed && component && (component as any).cleanup) {
        (component as any).cleanup();
      }
      return allowed;
    });
  } catch (err) {
    return true;
  }
};
