import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../Material.Module';

import { CommonModule } from '@angular/common';
import { AuthService } from '../../../Services/auth-service';

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

  constructor(private auth: AuthService) {}

  submit(): void {
    this.message = '';
    this.errorMessage = '';

    this.auth.forgotPassword(this.email).subscribe({
      next: (res) => this.message = res.message,
      error: (err) => this.errorMessage = err?.error?.message
    });
  }
}