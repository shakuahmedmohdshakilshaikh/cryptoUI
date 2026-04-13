import { Routes } from '@angular/router';
import { Dashboard } from './Components/pages/dashboard/dashboard';
import { Crypto } from './Components/pages/crypto/crypto';
import { Favourites } from './Components/pages/favourites/favourites';

export const routes: Routes = [
   { path: '', redirectTo: 'market', pathMatch: 'full' },
     { path: 'dashboard', component: Dashboard },
  { path: 'crypto', component: Crypto },
  {path: 'favourites', component: Favourites}
 
];
