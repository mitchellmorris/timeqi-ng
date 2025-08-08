import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { Project } from '../../schemas/project';

@Injectable({
  providedIn: 'root'
})
export class Projects {
  private apiUrl = environment?.apiUrl;

  constructor(
    private http: HttpClient
  ) {}

  getProject(id: string): Observable<Project | null> {
      return this.http.get<{ project: Project, [key: string]: any }>(`${this.apiUrl}/project/${id}`).pipe(
        map(({ existingProject }) => existingProject),
        catchError(error => {
          console.error('Error fetching user profile:', error);
          return of(null);
        })
      );
  }
  
}
