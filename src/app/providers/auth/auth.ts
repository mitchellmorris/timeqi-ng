import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { addSeconds, isBefore } from 'date-fns';

type SignInResponse = {
  access_token: string;
};

type ProfileResponse = {
  sub: string;
  email: string;
  iat: number;
  exp: number;
};

type AuthResult = SignInResponse & ProfileResponse;

@Injectable({
  providedIn: 'root'
})
export class Auth {
  constructor(private http: HttpClient) {}
      
  login(email:string, password:string ) {
    return this.http.post<{ access_token: string }>('//localhost:3000/auth/login', { email, password })
      .pipe(
        switchMap((res) => {
          const headers = new HttpHeaders({
            'Authorization': `Bearer ${res.access_token}`
          });
          return this.http.get<ProfileResponse>('//localhost:3000/auth/profile', { headers }).pipe(
            map((profile: ProfileResponse) => {
              this.setSession({ access_token: res.access_token, ...profile });
            })
          );
        }),
        shareReplay()
      );
  }

  private setSession(authResult: AuthResult) {
      // Set the token and expiration time in local storage
      const expiresAt = addSeconds(new Date(), authResult.exp);
      localStorage.setItem('user_id', authResult.sub);
      localStorage.setItem('id_token', authResult.access_token);
      localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
  }          

  logout() {
      localStorage.removeItem("id_token");
      localStorage.removeItem("expires_at");
      localStorage.removeItem("user_id");
  }

  isLoggedIn() {
      return isBefore(new Date(), this.getExpiration());
  }

  isLoggedOut() {
      return !this.isLoggedIn();
  }

  getExpiration() {
      const expiration = localStorage.getItem("expires_at");
      const expiresAt = expiration ? JSON.parse(expiration) : null;
      return new Date(expiresAt);
  }
  
  getUserId() {
      return localStorage.getItem("user_id");
  }
}

