import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";
import { Observable } from "rxjs/internal/Observable";

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const idToken = localStorage.getItem("id_token");
  const router = inject(Router); // Create a new instance of Router
  if (idToken) {
    const cloned = req.clone({
      headers: req.headers.set("Authorization",
        "Bearer " + idToken
      )
    });
    // return next(cloned);
    return next(cloned).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
              // Redirect to login page
              router.navigate(['/login']);
            }
            return throwError(error); // Re-throw the error for other handlers
          })
        );
  } else {
    return next(req);
  }
}