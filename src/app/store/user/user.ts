import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StateContext, Store } from '@ngxs/store';
import { environment } from '../../../environments/environment';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { UserStateModel, User as UserModel } from '../../schemas/user'; // Assuming you have a User model defined

@Injectable({
  providedIn: 'root'
})
export class User {
  apiUrl = environment?.apiUrl;
  constructor(
    private http: HttpClient
  ) {}
  
  getUser(): Observable<UserModel | null> {
    return this.http.get<{ user: UserModel, [key: string]: any }>(`${this.apiUrl}/user/profile`).pipe(
      map(({ user }) => user),
      catchError(error => {
        console.error('Error fetching user profile:', error);
        return of(null);
      })
    );
  }
}
