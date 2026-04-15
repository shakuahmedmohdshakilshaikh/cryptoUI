import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../Material.Module';

import { CommonModule } from '@angular/common';
import { AuthService } from '../../../Services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, MaterialModule, CommonModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss'
})
export class ResetPassword {

   model = {
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  };

  message = '';
  errorMessage = '';

  constructor(private authService: AuthService,
    private router: Router
  ) {}

  reset(): void {
    this.message = '';
    this.errorMessage = '';

    this.authService.resetPassword(this.model).subscribe({
      next: (res) => {
        this.message = res?.message || 'Password reset successful';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 500);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err?.error?.error || err?.error?.message || 'Reset failed';
      }
    });
  }

}