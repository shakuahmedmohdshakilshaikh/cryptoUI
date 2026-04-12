import { Component } from '@angular/core';
import { MaterialModule } from '../../../Material.Module';
import { Dashboard } from '../../pages/dashboard/dashboard';
import { routes } from '../../../app.routes';
import { Crypto } from '../../pages/crypto/crypto';

@Component({
  selector: 'app-sidebar',
  imports: [MaterialModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  menuItems = [
    {icon: Dashboard, label: 'Dashboard', active: true},
    { icon: Crypto, label: 'Crypto', active: true },
    { icon: 'account_balance_wallet', label: 'My Wallet', active: false },
    { icon: 'favorite_border', label: 'Favorites', active: false },
    { icon: 'add_circle_outline', label: 'Add Money', active: false },
    { icon: 'settings', label: 'Settings', active: false }
  ];
}
