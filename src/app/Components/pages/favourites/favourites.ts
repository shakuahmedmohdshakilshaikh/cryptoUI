import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../Material.Module';
import { CryptoService } from '../../../Services/CryptoService';

@Component({
  selector: 'app-favourites',
  imports: [MaterialModule],
  templateUrl: './favourites.html',
  styleUrl: './favourites.scss',
})
export class Favourites implements OnInit {
  userId = 0;

  favourites: any[] = [];
  loading = false;
  errorMessage = '';

  constructor(private crypto: CryptoService) {}

 ngOnInit(): void {
  console.log('stored userId:', localStorage.getItem('userId'));

  if (typeof window === 'undefined') {
    return;
  }

  this.userId = this.getStoredUserId();
  console.log('parsed userId:', this.userId);

  if (this.userId <= 0) {
    this.errorMessage = 'User not logged in';
    return;
  }

  this.loadFavourites();
}

  private getStoredUserId(): number {
    if (typeof window === 'undefined' || !window.localStorage) {
      return 0;
    }

    return Number(window.localStorage.getItem('userId')) || 0;
  }

  loadFavourites(): void {
    this.loading = true;
    this.errorMessage = '';

    this.crypto.getFavourites(this.userId).subscribe({
      next: (res) => {
        this.favourites = res?.data || [];
        this.loading = false;
        console.log('Favourites:', res);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load favourites';
        this.loading = false;
      }
    });
  }

  removeFavourite(item: any): void {
    this.crypto.removeFavorite(item.fid).subscribe({
      next: () => {
        this.loadFavourites();
      },
      error: (err) => {
        console.error(err);
        alert('Failed to remove favourite');
      }
    });
  }

  buyCoin(item: any): void {
    if (!this.userId || this.userId <= 0) {
      alert('You must be logged in to buy crypto.');
      return;
    }

    const name = item.cryptoName || item.cryptoname || 'coin';
    const amountText = prompt(`Enter amount to buy ${name}`, '1000');

    if (!amountText) {
      return;
    }

    const amount = Number(amountText);

    if (isNaN(amount) || amount <= 0) {
      alert('Please enter valid amount');
      return;
    }

    const payload = {
      userId: this.userId,
      cryptoId: item.cryptoId,
      amount: amount
    };

    console.log('buy payload', payload);

    this.crypto.buycoin(payload).subscribe({
      next: (res) => {
        console.log(res);
        alert(`${name} bought successfully`);
      },
      error: (err) => {
        console.error('Buy failed', err);
        const message = err?.error?.message || err?.message || 'Buy failed';
        alert(message);
      }
    });
  }

  isValidDate(date: string): boolean {
    return !!date && !date.startsWith('0001-01-01');
  
  }
}