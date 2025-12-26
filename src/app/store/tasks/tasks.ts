import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, map, Observable, of } from 'rxjs';
import { Task } from '@betavc/timeqi-sh';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Tasks {
  private apiUrl = environment?.apiUrl;

  constructor(
    private http: HttpClient
  ) {}

  getTask(id: string): Observable<Task | null> {
    return this.http.get<{ task: Task, [key: string]: any }>(`${this.apiUrl}/task/${id}`).pipe(
      map(({ existingTask }) => existingTask),
      catchError(error => {
        console.error('Error fetching task:', error);
        return of(null);
      })
    );
  }
  
  updateTask(id: string, task: Partial<Task>): Observable<Task | null> {
    return this.http.put<Task>(`${this.apiUrl}/task/${id}`, task).pipe(
      map((response: any) => response.existingTask),
      catchError(error => {
        console.error('Error saving task:', error);
        return of(null);
      })
    );
  }
}
