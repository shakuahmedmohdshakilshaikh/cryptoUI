import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../Material.Module';
import { CryptoService } from '../../../Services/CryptoService';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crypto',
  imports: [MaterialModule],
  templateUrl: './crypto.html',
  styleUrl: './crypto.scss',
})
export class Crypto implements OnInit {
  userId = 3;

  currency = 'inr';
  currentPage = 1;
  pageSize = 5;
  totalRecords = 0;
  totalPages = 0;

  searchText = '';
  sortBy = 'cryptoname';
  sortOrder = 'asc';

  coins: any[] = [];
  loading = false;
  errorMessage = '';

  displayedColumns: string[] = [
    'image',
    'cryptoName',
    'currentPrice',
    'marketCap',
    'actions'
  ];

  constructor(
    private crypto: CryptoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCoins();
  }

   loadCoins(): void {
    this.loading = true;
    this.errorMessage = '';

    this.crypto.getCoins(
      this.currency,
      this.currentPage,
      this.pageSize,
      this.searchText,
      this.sortBy,
      this.sortOrder
    ).subscribe({
      next: (res) => {
        this.coins = res?.data?.data || [];
        this.totalRecords = res?.data?.totalRecords || 0;
        this.totalPages = res?.data?.totalPages || 0;

        const serverPage = res?.data?.pageNumber;
        this.currentPage = serverPage && serverPage > 0 ? serverPage : 1;

        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching coins:', err);
        console.error('Backend error body:', err.error);
        this.errorMessage = 'Failed to load coins';
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    this.currentPage = 1;
    this.loadCoins();
  }

  clearFilter(): void {
    this.searchText = '';
    this.sortBy = 'cryptoname';
    this.sortOrder = 'asc';
    this.currentPage = 1;
    this.loadCoins();
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.loadCoins();
  }

  onSort(column: string): void {
    if (this.sortBy === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortOrder = 'asc';
    }

    this.currentPage = 1;
    this.loadCoins();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadCoins();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadCoins();
    }
  }

  getSortIcon(column: string): string {
    if (this.sortBy !== column) {
      return 'unfold_more';
    }

    return this.sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward';
  }

  buyCoin(coin: any): void {
    const amountText = prompt(`Enter amount to buy ${coin.cryptoName}`, '1000');

    if (!amountText) return;

    const amount = Number(amountText);

    if (isNaN(amount) || amount <= 0) {
      alert('Please enter valid amount');
      return;
    }

    const payload = {
      userId: this.userId,
      cryptoId: coin.cryptoId,
      amount: amount
    };

    this.crypto.buycoin(payload).subscribe({
      next: () => {
        alert(`${coin.cryptoName} bought successfully`);
      },
      error: (err) => {
        console.error(err);
        alert('Buy failed');
      }
    });
  }

  addToFavourite(coin: any): void {
    const payload = {
      userId: this.userId,
      cryptoId: coin.cryptoId
    };

    this.crypto.addToFavorites(payload).subscribe({
      next: () => {
        alert(`${coin.cryptoName} added to favourites`);
      },
      error: (err) => {
        console.error(err);
        alert('Failed to add favourite');
      }
    });
  }

  goToFavourite(): void {
    this.router.navigate(['/favourites']);
  }
}