import { HttpEvent, HttpHandler, HttpHandlerFn, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  // console.log(req.url);
  // return next(req);
  const idToken = localStorage.getItem("id_token");
  if (idToken) {
      const cloned = req.clone({
          headers: req.headers.set("Authorization",
              "Bearer " + idToken)
      });

      return next(cloned);
  }
  else {
      return next(req);
  }
}

// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {

//     intercept(req: HttpRequest<any>,
//               next: HttpHandler): Observable<HttpEvent<any>> {

//         const idToken = localStorage.getItem("id_token");

//         if (idToken) {
//             const cloned = req.clone({
//                 headers: req.headers.set("Authorization",
//                     "Bearer " + idToken)
//             });

//             return next.handle(cloned);
//         }
//         else {
//             return next.handle(req);
//         }
//     }
// }