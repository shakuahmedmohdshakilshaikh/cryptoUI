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
    password: ''
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
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err?.error?.message || 'Login failed';
        this.loading = false;
      }
    });
  }
}