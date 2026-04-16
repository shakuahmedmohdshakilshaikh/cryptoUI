import { Routes } from '@angular/router';
import { Dashboard } from './Components/pages/dashboard/dashboard';
import { Crypto } from './Components/pages/crypto/crypto';
import { Favourites } from './Components/pages/favourites/favourites';
import { Wallet } from './Components/pages/wallet/wallet';
import { TransactionHistory } from './Components/pages/transaction-history/transaction-history';
import { Login } from './Components/pages/login/login';
import { Register } from './Components/pages/register/register';
import { ForgotPassword } from './Components/pages/forgot-password/forgot-password';
import { ResetPassword } from './Components/pages/reset-password/reset-password';
import { Setup2fa } from './Components/pages/setup2fa/setup2fa';
import { Verify2fa } from './Components/pages/verify2fa/verify2fa';
import { authGuard } from './gaurds/auth-guard';
import { Profile } from './Components/pages/profile/profile';

export const routes: Routes = [
  
  

  { path: '', redirectTo: 'login', pathMatch: 'full' },
     { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'reset-password', component: ResetPassword },
  { path: 'setup-2fa', component: Setup2fa },
  { path: 'verify-2fa', component: Verify2fa },

  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'crypto', component: Crypto, canActivate: [authGuard] },
  { path: 'favourites', component: Favourites, canActivate: [authGuard] },
  { path: 'wallet', component: Wallet, canActivate: [authGuard] },
  { path: 'transactions', component: TransactionHistory, canActivate: [authGuard] },
  {path: 'profile', component: Profile, canActivate: [authGuard]},

  { path: '**', redirectTo: 'login' }
  
 
];
