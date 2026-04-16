import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../Services/auth-service';


export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  

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