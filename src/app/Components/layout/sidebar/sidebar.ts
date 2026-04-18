import { Component } from '@angular/core';
import { MaterialModule } from '../../../Material.Module';
import {  RouterModule } from '@angular/router';
import { routes } from '../../../app.routes';

@Component({
  selector: 'app-sidebar',
  imports: [MaterialModule,RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
    menuItems = [
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard' },
    { icon: 'currency_bitcoin', label: 'Crypto', route: '/crypto' },
    { icon: 'account_balance_wallet', label: 'My Wallet', route: '/wallet' },
    { icon: 'favorite_border', label: 'Favorites', route: '/favourites' },
    {icon: 'show_graph', label: 'Crypto Holding', route: '/cryptoholding'},
    { icon: 'history', label: 'Crypto Transaction ', route: '/transactions' },
    { icon: 'person', label: 'Profile', route: '/profile' }
  ];
}
