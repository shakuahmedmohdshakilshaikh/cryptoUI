import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../Material.Module';
import { AuthService } from '../../../Services/auth-service';
import { Router } from '@angular/router';
import { ProfileServices } from '../../../Services/profile-services';


@Component({
  selector: 'app-header',
  imports: [MaterialModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header  {

   constructor(private router: Router, private profileService: ProfileServices) {}

    userName: string = '';
  userId: number = Number(localStorage.getItem('userId'));



  ngOnInit(): void {
    this.loadUser();
  }

  loadUser() {
    this.profileService.getUserById(this.userId).subscribe({
      next: (res) => {
        const user = res.data ?? res;
        this.userName = user.userFullName; 
        console.log(res);
        
      },
      error: () => {
        this.userName = 'User';
      }
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.removeItem('tempEmail');

    this.router.navigate(['/login']);

  

  }
}
