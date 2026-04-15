import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MaterialModule } from '../../../Material.Module';

import { CommonModule } from '@angular/common';
import { AuthService } from '../../../Services/auth-service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, MaterialModule, RouterLink, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  model = {
    userfullname: '',
    email: '',
    passWord: '',
    phoneNumber: ''
  };

  loading = false;
  message = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register(): void {
    this.loading = true;
    this.message = '';
    this.errorMessage = '';

    this.authService.register(this.model).subscribe({
      next: (res) => {
        this.message = res?.message || 'Registered successfully';
        this.loading = false;

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1000);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err?.error?.error || err?.error?.message || 'Register failed';
        this.loading = false;
      }
    });
  }
}