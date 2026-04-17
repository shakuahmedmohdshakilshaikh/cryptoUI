import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../Services/auth-service';
import { MaterialModule } from '../../../Material.Module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify2fa',
  imports: [MaterialModule],
  templateUrl: './verify2fa.html',
  styleUrl: './verify2fa.scss',
})
export class Verify2fa implements OnInit {

   model = {
    email: '',
    code: ''
  };

  message = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.model.email = window.localStorage.getItem('tempEmail') || '';
    }
  }

  verify(): void {
    this.message = '';
    this.errorMessage = '';

    this.authService.verify2FA(this.model).subscribe({
      next: (res) => {
        console.log('verify2fa response', res);

        this.message = res?.message || 'OTP verified successfully';

        const token = res.data.token;
        const userId = res.data.userId;
        const email = res.data.email;

        if (typeof window !== 'undefined' && window.localStorage) {
          if (token) {
            localStorage.setItem('token', token);
          }

          if (userId) {
            localStorage.setItem('userId', userId.toString());
          }

          if (email) {
            localStorage.setItem('email', email);
          }

          localStorage.removeItem('tempEmail');
        }

        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err?.error?.message || '2FA verification failed';
      }
    });
  }
}
