import { Routes } from '@angular/router';
import { Dashboard } from './Components/pages/dashboard/dashboard';
import { Crypto } from './Components/pages/crypto/crypto';

export const routes: Routes = [
     { path: 'dashboard', component: Dashboard },
  { path: 'market', component: Crypto },
  { path: '', redirectTo: 'market', pathMatch: 'full' }
];
