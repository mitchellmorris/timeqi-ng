import { HttpClient } from '@angular/common/http';
import { /*inject,*/ Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Organization as OrganizationModel } from '../../schemas/organization';
import { catchError, map, Observable, of } from 'rxjs';
// import { BehaviorSubject, catchError, map, Observable, of, switchMap, tap } from 'rxjs';
// import { Organization } from '../../schemas/organization';
// import { Store } from '@ngxs/store';

@Injectable({
  providedIn: 'root'
})
export class Organizations {
  // readonly store = inject(Store);
  private apiUrl = environment?.apiUrl;

  constructor(
    private http: HttpClient
  ) {}

  getOrganization(id: string): Observable<OrganizationModel | null> {
      return this.http.get<{ organization: OrganizationModel, [key: string]: any }>(`${this.apiUrl}/organization/${id}`).pipe(
        map(({ existingOrganization }) => existingOrganization),
        catchError(error => {
          console.error('Error fetching user profile:', error);
          return of(null);
        })
      );
  }

  // populateOrganizations(userId: string): Observable<Organization[]> {
  //   if (!userId) {
  //     console.warn('User ID is required to fetch organizations.');
  //     return of([]);
  //   }
  //   return this.http.get(`${this.apiUrl}/user/${userId}`).pipe(
  //     map((response: any) => response.existingUser.organizations ?? []),
  //     catchError(error => {
  //       console.error('Error fetching organizations:', error);
  //       return of([]);
  //     })
  //   );
  // }
}
