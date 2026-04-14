import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}auth/register`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}auth/login`, data).pipe(
      tap((res) => {
        const token = res?.data?.token;

        if (typeof window !== 'undefined' && token) {
          localStorage.setItem('token', token);

          const userId = this.getUserIdFromToken(token);
          if (userId) {
            localStorage.setItem('userId', userId);
          }
        }
      })
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/forgot-password?email=${encodeURIComponent(email)}`,
      {}
    );
  }

  resetPassword(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reset-password`, data);
  }

  setup2FA(email: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/setup-2fa?email=${encodeURIComponent(email)}`
    );
  }

  verify2FA(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/verify-2fa`, data);
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    }
  }

  isLoggedIn(): boolean {
    return typeof window !== 'undefined' && !!localStorage.getItem('token');
  }

  getUserId(): number {
    return typeof window !== 'undefined'
      ? Number(localStorage.getItem('userId')) || 0
      : 0;
  }

  private getUserIdFromToken(token: string): string | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || null;
    } catch {
      return null;
    }
  }
}