import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../Services/auth-service';
import { MaterialModule } from '../../../Material.Module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setup2fa',
  imports: [MaterialModule],
  templateUrl: './setup2fa.html',
  styleUrl: './setup2fa.scss',
})
export class Setup2fa implements OnInit{
 email = '';
  qrCodeImageBase64 = '';
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.email = window.localStorage.getItem('tempEmail') || '';
      this.qrCodeImageBase64 = window.localStorage.getItem('tempQr') || '';
    }

    if (!this.email) {
      this.errorMessage = 'Email not found. Please login again.';
      return;
    }

    // fallback if qr was not saved
    if (!this.qrCodeImageBase64) {
      this.authService.setup2FA(this.email).subscribe({
        next: (res) => {
          this.qrCodeImageBase64 = res?.data?.qrCodeImageBase64 || '';
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = err?.error?.error || err?.error?.message || 'Failed to generate QR';
        }
      });
    }
  }

  continueToVerify(): void {
    this.router.navigate(['/verify-2fa']);
  }

  
}
