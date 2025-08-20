import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { Project } from '@betavc/timeqi-sh';

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
        console.error('Error fetching project:', error);
        return of(null);
      })
    );
  }

  saveProject(id: string, project: Partial<Project>): Observable<Project | null> {
    return this.http.put<Project>(`${this.apiUrl}/project/${id}`, project).pipe(
      map((response: any) => response.updatedProject),
      catchError(error => {
        console.error('Error saving project:', error);
        return of(null);
      })
    );
  }
  
}
