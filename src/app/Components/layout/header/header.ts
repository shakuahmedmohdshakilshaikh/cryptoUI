import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../Material.Module';
import { AuthService } from '../../../Services/auth-service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  imports: [MaterialModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header  {

   constructor(private router: Router) {}

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.removeItem('tempEmail');

    this.router.navigate(['/login']);

  

  }
}
