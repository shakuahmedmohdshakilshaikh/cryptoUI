import { Component } from '@angular/core';
import { AuthService } from '../../../Services/auth-service';
import { MaterialModule } from '../../../Material.Module';

@Component({
  selector: 'app-setup2fa',
  imports: [MaterialModule],
  templateUrl: './setup2fa.html',
  styleUrl: './setup2fa.scss',
})
export class Setup2fa {

   email = '';
  qr = '';

  constructor(private auth: AuthService) {}

  generate(): void {
    this.auth.setup2FA(this.email).subscribe(res => {
      this.qr = res.data.qrCodeImageBase64;
    });
  }
}
