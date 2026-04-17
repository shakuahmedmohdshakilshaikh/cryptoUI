import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MaterialModule } from '../../../Material.Module';
import { CryptoService } from '../../../Services/CryptoService';
import { MatDialog, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-favourites',
  imports: [MaterialModule, FormsModule, MatDialogActions, MatDialogContent],
  templateUrl: './favourites.html',
  styleUrl: './favourites.scss',
})
export class Favourites implements OnInit {
  @ViewChild('buyDialog') buyDialog!: TemplateRef<any>;

  userId = 0;

  favourites: any[] = [];
  loading = false;
  errorMessage = '';

  selectedCoin: any = null;
  buyAmount: number = 0;
  calculatedQuantity: number = 0;
  calculatedPricePerUnit: number = 0;

  constructor(
    private crypto: CryptoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  showToast(message: string, type: 'success' | 'error' = 'success'): void {
  this.snackBar.open(message, 'Close', {
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
    panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar']
  });
}
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
        this.showToast('Failed to remove favourite','error');
      }
    });
  }

  openBuyDialog(coin: any): void {
    if (!this.userId || this.userId <= 0) {
      this.showToast('You must be logged in to buy crypto.','error');
      return;
    }

    console.log('selected coin:', coin);

    this.selectedCoin = coin;
    this.buyAmount = 0;

    this.calculatedPricePerUnit = Number(
      coin.currentPrice ?? coin.pricePerUnit ?? 0
    );

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
      },
      error: (err) => {
        console.error('Buy failed', err);
        console.error('Buy error body', err.error);
        const message = err?.error?.message || err?.Error || 'Buy failed';
        this.showToast(message,'error');
      }
    });
  }

  closeBuyDialog(): void {
    this.dialog.closeAll();
  }

  isValidDate(date: string): boolean {
    return !!date && !date.startsWith('0001-01-01');
  }
}