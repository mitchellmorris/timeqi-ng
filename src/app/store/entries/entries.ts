import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, map, Observable, of } from 'rxjs';
import { Entry, Task } from '@betavc/timeqi-sh';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Entries {
  private apiUrl = environment?.apiUrl;

  constructor(
    private http: HttpClient
  ) {}

  getProjectEntries(projectId: string): Observable<Entry[] | null> {
    const getEntries$ = this.http.get<{ entryData: Entry[], [key: string]: any }>(`${this.apiUrl}/entry/project/${projectId}`);
    return getEntries$.pipe(
      map(({ entryData }) => entryData),
      catchError(error => {
        console.error('Error fetching entries:', error);
        // Return empty array instead of null for 404 errors
        if (error.status === 404) {
          return of([]);
        }
        return of(null);
      })
    );
  }
}
