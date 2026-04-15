import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MaterialModule } from '../../../Material.Module';

import { CommonModule } from '@angular/common';
import { AuthService } from '../../../Services/auth-service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, MaterialModule, RouterLink, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  model = {
    email: '',
    passWord: ''
  };

  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {
    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.model).subscribe({
      next: (res) => {
        this.loading = false;

        // because backend login returns plain object for 2FA flow
        if (res?.message === '2FA_REQUIRED') {
          localStorage.setItem('tempEmail', res.email);
          localStorage.setItem('tempQr', res.qrCode || '');
          this.router.navigate(['/setup-2fa']);
          return;
        }

        if (res?.message === 'VERIFY_2FA_REQUIRED') {
          localStorage.setItem('tempEmail', res.email);
          this.router.navigate(['/verify-2fa']);
          return;
        }

        // fallback if later backend returns wrapped token
        if (res?.data?.token || res?.token) {
          this.router.navigate(['/dashboard']);
          return;
        }

        this.errorMessage = 'Unexpected login response';
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err?.error?.error || err?.error?.message || 'Login failed';
        this.loading = false;
      }
    });
  }
}