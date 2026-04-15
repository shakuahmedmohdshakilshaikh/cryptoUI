import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}auth`;
  private platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, data).pipe(
      tap((res) => {
        const token = res?.data?.token || res?.token;

        if (token) {
          this.saveToken(token);

          const userId = this.getUserIdFromToken(token);
          if (userId) {
            this.saveUserId(userId);
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
    return this.http.post<any>(
      `${this.apiUrl}/setup-2fa?email=${encodeURIComponent(email)}`,
      {}
    );
  }

  verify2FA(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/verify-2fa`, data).pipe(
      tap((res) => {
        const token = res?.data?.token || res?.token;

        if (token) {
          this.saveToken(token);

          const userId = this.getUserIdFromToken(token);
          if (userId) {
            this.saveUserId(userId);
          }

          this.removeTempEmail();
          this.removeTempQr();
        }
      })
    );
  }

  isLoggedIn(): boolean {
    if (!this.isBrowser()) return false;
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem('token');
  }

  saveToken(token: string): void {
    if (!this.isBrowser()) return;
    localStorage.setItem('token', token);
  }

  getUserId(): number {
    if (!this.isBrowser()) return 0;
    return Number(localStorage.getItem('userId')) || 0;
  }

  saveUserId(userId: string): void {
    if (!this.isBrowser()) return;
    localStorage.setItem('userId', userId);
  }

  saveTempEmail(email: string): void {
    if (!this.isBrowser()) return;
    localStorage.setItem('tempEmail', email);
  }

  getTempEmail(): string {
    if (!this.isBrowser()) return '';
    return localStorage.getItem('tempEmail') || '';
  }

  removeTempEmail(): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem('tempEmail');
  }

  saveTempQr(qr: string): void {
    if (!this.isBrowser()) return;
    localStorage.setItem('tempQr', qr);
  }

  getTempQr(): string {
    if (!this.isBrowser()) return '';
    return localStorage.getItem('tempQr') || '';
  }

  removeTempQr(): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem('tempQr');
  }

  logout(): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('tempEmail');
    localStorage.removeItem('tempQr');
  }

  private getUserIdFromToken(token: string): string | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || null;
    } catch {
      return null;
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}