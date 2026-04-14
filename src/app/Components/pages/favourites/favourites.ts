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
  userId = 3;

  favourites: any[] = [];
  loading = false;
  errorMessage = '';

  constructor(private crypto: CryptoService) {}

  ngOnInit(): void {
    this.loadFavourites();
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
    const amountText  =  prompt(`Enter amount to buy ${item.cryptoname}`, '1000');

    if(!amountText){
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

    this.crypto.buycoin(payload).subscribe({
      next: (res) => {
        console.log(res);
        alert(`${item.cryptoName} bought successfully`);
      },
      error: (err) => {
        console.error(err);
        alert('Buy failed');
      }
    });
  }

  isValidDate(date: string): boolean {
    return !!date && !date.startsWith('0001-01-01');
  
  }
}