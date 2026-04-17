import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MaterialModule } from '../../../Material.Module';
import { CryptoService } from '../../../Services/CryptoService';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatDialog, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-crypto',
  imports: [MaterialModule, MatDialogContent, MatDialogActions],
  templateUrl: './crypto.html',
  styleUrl: './crypto.scss',
})
export class Crypto implements OnInit {
 @ViewChild('buyDialog') buyDialog!: TemplateRef<any>;

  userId = 0;

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

   selectedCoin: any = null;
  buyAmount: number = 0;
  calculatedQuantity: number = 0;
  calculatedPricePerUnit: number = 0;

  constructor(
    private crypto: CryptoService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  showToast(message: string, type: 'success' | 'error' = 'success'): void {
  this.snackBar.open(message, 'Close', {
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
    panelClass: type === 'success' ? 'success-snackbar' : 'error-snackbar'
  });
}

  ngOnInit(): void {
    if (typeof window === 'undefined') {
      return;
    }

    this.userId = Number(localStorage.getItem('userId')) || 0;
    console.log('stored userId =', localStorage.getItem('userId'));
    console.log('parsed userId =', this.userId);

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

    openBuyDialog(coin: any): void {
    if (!this.userId || this.userId <= 0) {
      this.showToast('You must be logged in to buy crypto.','error');
      return;
    }

    this.selectedCoin = coin;
    this.buyAmount = 0;
    this.calculatedPricePerUnit = Number(coin.currentPrice || 0);
    this.calculatedQuantity = 0;

    this.dialog.open(this.buyDialog, {
      width: '420px',
      disableClose: true
    });
  }

    onAmountChange(): void {
    const amount = Number(this.buyAmount) || 0;
    const price = Number(this.calculatedPricePerUnit) || 0;

    this.calculatedQuantity = price > 0 ? amount / price : 0;
  }

  confirmBuy(): void {
    if (!this.selectedCoin) {
      return;
    }

    const amount = Number(this.buyAmount);

    if (isNaN(amount) || amount <= 0) {
      this.showToast('Please enter a valid amount','error');
      return;
    }

    const payload = {
      userId: this.userId,
      cryptoId: this.selectedCoin.cryptoId,
      amount: amount
    };

    console.log('buy payload', payload);

    this.crypto.buycoin(payload).subscribe({
      next: () => {
        this.showToast(`${this.selectedCoin.cryptoName} bought successfully`,'success');
        this.dialog.closeAll();
        this.loadCoins();
      },
      error: (err) => {
        console.error('Buy failed', err);
        console.error('Buy error body', err.error);
        const message = err?.error?.message || err?.message || 'Buy failed';
        this.showToast(message,'error');
      }
    });
  }

  closeBuyDialog(): void {
    this.dialog.closeAll();
  }

  
 

  addToFavourite(coin: any): void {
    if (!this.userId || this.userId <= 0) {
      this.showToast('You must be logged in first.','error');
      return;
    }

    const payload = {
      userId: this.userId,
      cryptoId: coin.cryptoId
    };

    console.log('favourite payload', payload);

    this.crypto.addToFavorites(payload).subscribe({
      next: () => {
        this.showToast(`${coin.cryptoName} added to favourites`,'success');
      },
      error: (err) => {
        console.error('Favourite failed', err);
        console.error('Favourite error body', err.error);
        this.showToast(err?.error?.message || 'Failed to add favourite','error');
      }
    });
  }

  goToFavourite(): void {
    this.router.navigate(['/favourites']);
  }
}