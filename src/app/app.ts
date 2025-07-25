import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngxs/store';
import { SetUser } from './store/user/user.actions';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(store: Store) {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      store.dispatch(new SetUser());
    }
  }
}
