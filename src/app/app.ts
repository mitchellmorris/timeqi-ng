import { Component, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Store } from '@ngxs/store';
import { SetUser } from './store/user/user.actions';
import { filter, map, mergeMap } from 'rxjs';
import { Sidebar } from './components/sidebar/sidebar';

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
  showSidebar: boolean = false;
  constructor(private store: Store, private router: Router, private activatedRoute: ActivatedRoute) {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      this.store.dispatch(new SetUser());
    }
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data)
    ).subscribe(data => {
      this.showSidebar = data['showSidebar'] !== false; // Default to true if not specified
    });
  }
}
