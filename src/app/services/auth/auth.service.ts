import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../../models/user';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Environments } from '../../environments/environments';
import { config } from '../../../config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  login(userInfo: any): Observable<User> {
    return this.http.post<User>(`${Environments.apiBaseUrl}${config.loginAuth}`, userInfo, { headers: this.headers }).pipe(
      retry(1),
      catchError(error => {
        console.error("Login Error:", error);
        return throwError(() => new Error(error.error?.message || 'Login failed. Please try again.'));
      })
    );
  }

  isLoggedIn(): boolean {
    return this.isBrowser() && !!this.getAuthUser();
  }

  saveOnUserData(user: User): void {
    if (this.isBrowser()) {
      localStorage.setItem('userData', JSON.stringify(user)); 
    }
  }

  getAuthUser(): User | null {
    if (!this.isBrowser()) return null;
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('userData');
    }
  }
}
