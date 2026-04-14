import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../Material.Module';

import { CommonModule } from '@angular/common';
import { AuthService } from '../../../Services/auth-service';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, MaterialModule, CommonModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss'
})
export class ResetPassword {

  model = {
    email: '',
    newPassword: '',
    confirmPassword: ''
  };

  message = '';
  errorMessage = '';

  constructor(private auth: AuthService) {}

  reset(): void {
    this.auth.resetPassword(this.model).subscribe({
      next: (res) => this.message = res.message,
      error: (err) => this.errorMessage = err?.error?.message
    });
  }
}