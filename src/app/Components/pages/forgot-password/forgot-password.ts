import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../Material.Module';

import { CommonModule } from '@angular/common';
import { AuthService } from '../../../Services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, MaterialModule, CommonModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss'
})
export class ForgotPassword {

   email = '';
  message = '';
  errorMessage = '';

  constructor(private authService: AuthService,
     private router : Router
  ) {}

  submit(): void {
    this.message = '';
    this.errorMessage = '';

    this.authService.forgotPassword(this.email).subscribe({
      next: (res) => {
        this.message = res?.message || 'OTP sent';
  
        localStorage.setItem('resetEmail', this.email);

        setTimeout(() => {
          this.router.navigate(['/reset-password']);
        }, 500);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err?.error?.error || err?.error?.message || 'Failed';
      }
    });
  }
}