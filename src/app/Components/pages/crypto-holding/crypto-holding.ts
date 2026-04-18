import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MaterialModule } from '../../../Material.Module';
import { WalletService } from '../../../Services/wallet-service';
import { CryptoService } from '../../../Services/CryptoService';
import { MatDialog, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
declare var Razorpay: any;

@Component({
  selector: 'app-crypto-holding',
  imports: [MaterialModule, MatDialogActions, MatDialogContent],
  templateUrl: './crypto-holding.html',
  styleUrl: './crypto-holding.scss',
})
export class CryptoHolding {

   @ViewChild('buyDialog') buyDialog!: TemplateRef<any>;
  @ViewChild('sellDialog') sellDialog!: TemplateRef<any>;

  userId = 0;

  balance = 0;
  transactions: any[] = [];
  loading = false;
  errorMessage = '';

  addAmount = 1000;
  deductAmount = 500;

  selectedCoin: any = null;

  buyAmount: number = 0;
  buyCalculatedQuantity: number = 0;
  buyCalculatedPricePerUnit: number = 0;

  sellQuantity: number = 0;
  sellCalculatedPricePerUnit: number = 0;
  sellCalculatedTotalAmount: number = 0;
  maxSellQuantity: number = 0;

  constructor(
    private walletService: WalletService,
    private crypto: CryptoService,
    private dialog: MatDialog,
    private snackBar : MatSnackBar,
    private changedec : ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (typeof window === 'undefined') {
      return;
    }

    this.userId = this.getStoredUserId();

    if (this.userId <= 0) {
      this.errorMessage = 'User not logged in';
      return;
    }

    this.loadWalletData();
  }

  showToast(message: string, type: 'success' | 'error' = 'success'): void {
  this.snackBar.open(message, 'Close', {
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
    panelClass: type === 'success' ? 'success-snackbar' : 'error-snackbar'
  });
}

  private getStoredUserId(): number {
    if (typeof window === 'undefined' || !window.localStorage) {
      return 0;
    }

    return Number(window.localStorage.getItem('userId')) || 0;
  }

  // loadTransactionHistory(): void {
  //   this.loading = true;
  //   this.errorMessage = '';

  //   this.walletService.transactionHistory(this.userId).subscribe({
  //     next: (res) => {
  //       this.transactions = res?.data || [];
  //       this.loading = false;
  //     },
  //     error: (err) =>{
  //       this.showToast(err.error,'error');
  //     }
  //   })
  // }

  loadWalletData(): void {
    this.loading = true;
    this.errorMessage = '';

    this.walletService.getBalance(this.userId).subscribe({
      next: (balanceRes) => {
        this.balance = balanceRes?.data || 0;
        this.changedec.detectChanges();

        this.walletService.getTransactions(this.userId).subscribe({
          next: (txRes) => {
            this.transactions = txRes?.data || [];
            this.loading = false;
            this.changedec.detectChanges()
          },
          error: (err) => {
            console.error(err);
            this.errorMessage = 'Failed to load transactions';
            this.loading = false;
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load wallet balance';
        this.loading = false;
      }
    });
  }

  // addMoney(): void {
  //   if (!this.addAmount || this.addAmount <= 0) {
  //     this.showToast('Enter valid amount','error');
  //     return;
  //   }

  //   const payload = {
  //     userId: this.userId,
  //     amount: this.addAmount
  //   };

  //   this.walletService.createOrder(payload).subscribe({
  //     next: (res) => {
  //       const order = res?.data;
  //       this.openRazorpayCheckout(order);
  //     },
  //     error: (err) => {
  //       console.error(err);
  //       this.showToast('Failed to create order', 'error');
  //     }
  //   });
  // }

  // openRazorpayCheckout(order: any): void {
  //   const options = {
  //     key: 'rzp_test_SROWrvojqfoawV',
  //     amount: order.amount,
  //     currency: order.currency,
  //     name: 'Crypto Wallet',
  //     description: 'Add Money to Wallet',
  //     order_id: order.orderId,
  //     handler: (response: any) => {
  //       const verifyPayload = {
  //         userId: this.userId,
  //         razorpayOrderId: response.razorpay_order_id,
  //         razorpayPaymentId: response.razorpay_payment_id,
  //         razorpaySignature: response.razorpay_signature,
  //         amount: this.addAmount
  //       };

  //       this.walletService.verifyPayment(verifyPayload).subscribe({
  //         next: () => {
  //           this.showToast('Money added successfully','success');
  //           this.loadWalletData();
  //         },
  //         error: (err) => {
  //           console.error(err);
  //           this.showToast('Payment verification failed','error');
  //         }
  //       });
  //     },
  //     theme: {
  //       color: '#4f46e5'
  //     }
  //   };

  //   const rzp = new Razorpay(options);
  //   rzp.open();
  // }

  // deductMoney(): void {
  //   if (!this.deductAmount || this.deductAmount <= 0) {
  //     this.showToast('Enter valid amount','error');
  //     return;
  //   }

  //   const payload = {
  //     userId: this.userId,
  //     amount: this.deductAmount
  //   };

  //   this.walletService.deductBalance(payload).subscribe({
  //     next: () => {
  //       this.showToast('Balance deducted','success');
  //       this.loadWalletData();
  //     },
  //     error: (err) => {
  //       console.error(err);
  //       this.showToast('Failed to deduct balance','error');
  //     }
  //   });
  // }

  openBuyDialog(row: any): void {
    this.selectedCoin = row;
    this.buyAmount = 0;
    this.buyCalculatedPricePerUnit = Number(row.currentPrice || row.pricePerUnit || 0);
    this.buyCalculatedQuantity = 0;

    this.dialog.open(this.buyDialog, {
      width: '420px',
      disableClose: true
    });
  }

  onBuyAmountChange(): void {
    const amount = Number(this.buyAmount) || 0;
    const price = Number(this.buyCalculatedPricePerUnit) || 0;

    this.buyCalculatedQuantity = price > 0 ? amount / price : 0;
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

    if (!this.selectedCoin?.cryptoId) {
      this.showToast('cryptoId is missing in this row','error');
      return;
    }

    const payload = {
      userId: this.userId,
      cryptoId: this.selectedCoin.cryptoId,
      amount: amount
    };

    this.walletService.buycoin(payload).subscribe({
      next: () => {
        this.showToast(`${this.selectedCoin.cryptoName} bought successfully`,'success');
        this.dialog.closeAll();
        this.loadWalletData();
      },
      error: (err) => {
        console.error(err);
        this.showToast(err?.error?.message || 'Buy failed','error');
      }
    });
  }

  openSellDialog(row: any): void {
    this.selectedCoin = row;
    this.sellQuantity = 0;
    this.sellCalculatedPricePerUnit = Number(row.currentPrice || row.pricePerUnit || 0);
    this.sellCalculatedTotalAmount = 0;
    this.maxSellQuantity = Number(row.quantity || 0);

    this.dialog.open(this.sellDialog, {
      width: '420px',
      disableClose: true
    });
  }

  onSellQuantityChange(): void {
    const quantity = Number(this.sellQuantity) || 0;
    const price = Number(this.sellCalculatedPricePerUnit) || 0;

    this.sellCalculatedTotalAmount = quantity > 0 && price > 0 ? quantity * price : 0;
  }

  confirmSell(): void {
    if (!this.selectedCoin) {
      return;
    }

    const quantity = Number(this.sellQuantity);

    if (isNaN(quantity) || quantity <= 0) {
      this.showToast('Please enter valid quantity','error');
      return;
    }

    if (quantity > this.maxSellQuantity) {
      this.showToast(`You can sell maximum ${this.maxSellQuantity}`,'error');
      return;
    }

    const sellPayload = {
      userId: this.userId,
      cryptoId: this.selectedCoin.cryptoId,
      quantity: quantity
    };

    this.walletService.sellCoins(sellPayload).subscribe({
      next: () => {
        this.showToast(`${this.selectedCoin.cryptoName} sold successfully`,'success');
        this.dialog.closeAll();
        this.loadWalletData();
      },
      error: (err) => {
        console.error(err);
        this.showToast(err?.error?.message || 'Failed to sell','error');
      }
    });
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

}
