import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Store } from '@ngxs/store';
import { SetUser } from './store/user/user.actions';
import { map } from 'rxjs';
import { Sidebar } from './components/sidebar/sidebar';
import { RouterUtils } from './providers/utils/routerUtils';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Sidebar
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly activatedRoute = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly routerUtils = inject(RouterUtils);
  showSidebar = toSignal(this.routerUtils.getRouteData$('showSidebar').pipe(
    map(show => show !== false) // Default to true if not specified
  ), { initialValue: false });
  userId = localStorage.getItem('user_id');

  constructor(
    private store: Store
  ) {
    if (this.userId) {
      this.store.dispatch(new SetUser());
    }
  }
}
