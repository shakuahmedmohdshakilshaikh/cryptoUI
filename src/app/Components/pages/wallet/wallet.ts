import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../Material.Module';
import { WalletService } from '../../../Services/wallet-service';
import { MatSnackBar } from '@angular/material/snack-bar';

declare var Razorpay: any;

@Component({
  selector: 'app-wallet',
  imports: [MaterialModule, FormsModule, CommonModule],
  templateUrl: './wallet.html',
  styleUrl: './wallet.scss',
})
export class Wallet implements OnInit {
  userId = 0;
  balance = 0;
  transactions: any[] = [];
  loading = false;
  errorMessage = '';

  addAmount = 1000;
  deductAmount = 500;

  displayedColumns: string[] = [
    'amount',
    'transactionType',
    'paymentMethod',
    'status',
    'createdAt'
  ];

  constructor(
    private walletService: WalletService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.userId = Number(localStorage.getItem('userId')) || 0;

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

  loadWalletData(): void {
    this.loading = true;
    this.errorMessage = '';

    this.walletService.getBalance(this.userId).subscribe({
      next: (balanceRes) => {
        this.balance = balanceRes?.data || 0;

        this.walletService.transactionHistory(this.userId).subscribe({
          next: (res) => {
            this.transactions = res?.data || [];
            this.loading = false;
          },
          error: (err) => {
            console.error(err);
            this.transactions = [];
            this.loading = false;
            this.showToast(err?.error?.message || 'Failed to load transaction history', 'error');
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.showToast('Failed to load wallet balance', 'error');
      }
    });
  }

  addMoney(): void {
    if (!this.addAmount || this.addAmount <= 0) {
      this.showToast('Enter valid amount', 'error');
      return;
    }

    const payload = {
      userId: this.userId,
      amount: this.addAmount
    };

    this.walletService.createOrder(payload).subscribe({
      next: (res) => {
        const order = res?.data;
        this.openRazorpayCheckout(order);
      },
      error: (err) => {
        console.error(err);
        this.showToast('Failed to create order', 'error');
      }
    });
  }

  openRazorpayCheckout(order: any): void {
    const options = {
      key: 'rzp_test_SROWrvojqfoawV',
      amount: order.amount,
      currency: order.currency,
      name: 'Crypto Wallet',
      description: 'Add Money to Wallet',
      order_id: order.orderId,
      handler: (response: any) => {
        const verifyPayload = {
          userId: this.userId,
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
          amount: this.addAmount
        };

        this.walletService.verifyPayment(verifyPayload).subscribe({
          next: () => {
            this.showToast('Money added successfully', 'success');
            this.loadWalletData();
          },
          error: (err) => {
            console.error(err);
            this.showToast('Payment verification failed', 'error');
          }
        });
      },
      theme: {
        color: '#4f46e5'
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();
  }

  deductMoney(): void {
    if (!this.deductAmount || this.deductAmount <= 0) {
      this.showToast('Enter valid amount', 'error');
      return;
    }

    const payload = {
      userId: this.userId,
      amount: this.deductAmount
    };

    this.walletService.deductBalance(payload).subscribe({
      next: () => {
        this.showToast('Balance deducted successfully', 'success');
        this.loadWalletData();
      },
      error: (err) => {
        console.error(err);
        this.showToast(err?.error?.message || 'Failed to deduct balance', 'error');
      }
    });
  }
}