import { Component } from '@angular/core';
import { AuthService } from '../../../Services/auth-service';
import { MaterialModule } from '../../../Material.Module';

@Component({
  selector: 'app-verify2fa',
  imports: [MaterialModule],
  templateUrl: './verify2fa.html',
  styleUrl: './verify2fa.scss',
})
export class Verify2fa {

   model = {
    email: '',
    code: ''
  };

  message = '';
  errorMessage = '';

  constructor(private auth: AuthService) {}

  verify(): void {
    this.auth.verify2FA(this.model).subscribe({
      next: (res) => this.message = res.message,
      error: (err) => this.errorMessage = err?.error?.message
    });
  }
}
