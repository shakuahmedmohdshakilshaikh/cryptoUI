import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../Services/auth-service';


export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  

  const tokens = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  if (tokens && userId) {
    return true;
  }

  // During SSR, allow rendering and let browser handle real auth check later
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const token = authService.getToken();

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp;


    if (exp && Date.now() >= exp * 1000) {
      authService.logout();
      router.navigate(['/login']);
      return false;
    }

    return true;
  } catch {
    authService.logout();
    router.navigate(['/login']);
    return false;
  }
};