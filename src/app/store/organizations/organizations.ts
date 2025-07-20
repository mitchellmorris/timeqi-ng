import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { Organization } from '../../schemas/organization';

@Injectable({
  providedIn: 'root'
})
export class Organizations {
  private apiUrl = environment?.apiUrl;
  _organizations$: BehaviorSubject<Organization[]> = new BehaviorSubject<Organization[]>([]);
  organizations$: Observable<Organization[]> = this._organizations$.asObservable();

  constructor(private http: HttpClient) {}

  populateOrganizations(userId: string): Observable<Organization[]> {
    if (!userId) {
      console.warn('User ID is required to fetch organizations.');
      return of([]);
    }
    return this.http.get(`${this.apiUrl}/user/${userId}`).pipe(
      map((response: any) => response.existingUser.organizations ?? []),
      tap(organizations => this._organizations$.next(organizations)),
      catchError(error => {
        console.error('Error fetching organizations:', error);
        return of([]);
      })
    );
  }

}
