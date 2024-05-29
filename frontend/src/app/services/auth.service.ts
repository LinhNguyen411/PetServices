import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

import { EmployeeService } from './employee.service';
import { CustomerService } from './customer.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly AUTH_API = 'http://127.0.0.1:8000/api/auth/';

  private userService = inject(UserService);
  private employeeService = inject(EmployeeService);
  private customerService = inject(CustomerService);
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  public loggedIn?: BehaviorSubject<boolean>;
  public userData?: any;

  private http = inject(HttpClient);
  constructor() {
    this.loggedIn = new BehaviorSubject(this.isLoggedIn());
  }

  login(user: { email: string; password: string }): Observable<any> {
    return this.http
      .post(this.AUTH_API + 'jwt/create/', user, { withCredentials: true })
      .pipe(
        tap((tokens) => {
          this.loggedIn?.next(true);
          localStorage.setItem(this.JWT_TOKEN, JSON.stringify(tokens));
        })
      );
  }
  logout() {
    localStorage.removeItem(this.JWT_TOKEN);
    this.loggedIn?.next(false);
    this.userService.setUser(null);
    this.userService.setDataUser(null);
  }

  getJWTToken(): string | null {
    let tokens = localStorage.getItem('JWT_TOKEN');
    if (!tokens) return null;
    const token = JSON.parse(tokens).access;
    return token;
  }

  getCurrentAuthUser() {
    const accessToken = this.getJWTToken();
    return this.http
      .get(this.AUTH_API + 'users/me/', {
        headers: {
          Authorization: 'JWT ' + accessToken,
        },
      })
      .pipe(
        tap((res: any) => {
          if (res.account_type == 'e' || res.account_type == 'm') {
            this.employeeService
              .searchByAccount(res.id)
              .subscribe((sub_res) => {
                this.userService.setDataUser(sub_res.results[0]);
              });
          } else if (res.account_type == 'c') {
            this.customerService
              .searchByAccount(res.id)
              .subscribe((sub_res) => {
                this.userService.setDataUser(sub_res.results[0]);
              });
          }
        })
      );
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
