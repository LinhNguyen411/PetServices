import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AuthEmitter } from '../emitters/auth.emmiter';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly AUTH_API = 'http://127.0.0.1:8000/api/auth/';
  private router = inject(Router);
  private readonly JWT_TOKEN = 'JWT_TOKEN';

  private http = inject(HttpClient);
  constructor() {}

  login(user: { email: string; password: string }): Observable<any> {
    return this.http
      .post(this.AUTH_API + 'jwt/create/', user, { withCredentials: true })
      .pipe(
        tap((tokens) => {
          AuthEmitter.isLoggedIn.emit(true);
          localStorage.setItem(this.JWT_TOKEN, JSON.stringify(tokens));
        })
      );
  }
  logout() {
    localStorage.removeItem(this.JWT_TOKEN);
    AuthEmitter.isLoggedIn.emit(false);
    this.router.navigate(['/login']);
  }

  getJWTToken(): string | null {
    let tokens = localStorage.getItem('JWT_TOKEN');
    if (!tokens) return null;
    const token = JSON.parse(tokens).access;
    return token;
  }

  getCurrentAuthUser() {
    const accessToken = this.getJWTToken();
    return this.http.get(this.AUTH_API + 'users/me/', {
      headers: {
        Authorization: 'JWT ' + accessToken,
      },
    });
  }

  isLoggedIn() {
    return !!localStorage.getItem(this.JWT_TOKEN);
  }

  isTokenExpired() {
    const accessToken = this.getJWTToken();
    if (!accessToken) return true;
    const decoded = jwtDecode(accessToken);
    if (!decoded.exp) return true;
    const expirationDate = decoded.exp * 1000;
    const now = new Date().getTime();
    return expirationDate < now;
  }

  refreshToken() {
    let tokens: any = localStorage.getItem(this.JWT_TOKEN);
    if (!tokens) return;
    tokens = JSON.parse(tokens);
    let refreshToken = tokens.refresh;
    return this.http
      .post<any>(this.AUTH_API + 'jwt/refresh/', {
        refresh: refreshToken,
      })
      .pipe(
        tap((tokens: any) => {
          tokens.refresh = refreshToken;
          localStorage.setItem(this.JWT_TOKEN, JSON.stringify(tokens));
        })
      );
  }
  reset_password(email: string): Observable<any> {
    return this.http.post(this.AUTH_API + 'users/reset_password/', email, {
      withCredentials: true,
    });
  }

  reset_password_confirm(body: {
    uid: string;
    token: string;
    new_password: string;
    re_new_password: string;
  }): Observable<any> {
    return this.http.post(
      this.AUTH_API + 'users/reset_password_confirm/',
      body,
      { withCredentials: true }
    );
  }

  register(body: {
    email: string;
    name: string;
    account_type: string;
    password: string;
    re_password: string;
  }) {
    return this.http.post(this.AUTH_API + 'users/', body, {
      withCredentials: true,
    });
  }

  verify(body: { uid: string; token: string }) {
    return this.http.post(this.AUTH_API + 'users/activation/', body, {
      withCredentials: true,
    });
  }
}
