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
}