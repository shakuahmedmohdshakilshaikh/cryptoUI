import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Sidebar } from "./Components/layout/sidebar/sidebar";
import { Header } from "./Components/layout/header/header";
import { Dashboard } from "./Components/pages/dashboard/dashboard";
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, Sidebar, Header ],// Dashboard],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  // protected readonly title = signal('cryptoUi');

   showLayout = false;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const authRoutes = [
          '/login',
          '/register',
          '/forgot-password',
          '/reset-password',
          '/setup-2fa',
          '/verify-2fa'
        ];

        this.showLayout = !authRoutes.includes(this.router.url);
      });
    }
}
