import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../Material.Module';

import { CommonModule } from '@angular/common';
import { WalletService } from '../../../Services/wallet-service';
import { TransactionServices } from '../../../Services/transaction-services';

@Component({
  selector: 'app-transaction-history',
  imports: [MaterialModule, CommonModule],
  templateUrl: './transaction-history.html',
  styleUrl: './transaction-history.scss',
})
export class TransactionHistory implements OnInit {
  userId = 3;

  transactions: any[] = [];
  loading = false;
  errorMessage = '';

  displayedColumns: string[] = [
    'type',
    'coin',
    'quantity',
    'amount',
    'date',
    'notes'
  ];

  constructor(private walletService: TransactionServices) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.loading = true;
    this.errorMessage = '';

    this.walletService.getTransactions(this.userId).subscribe({
      next: (res) => {
        this.transactions = res?.data || [];
        this.loading = false;
        console.log('Wallet Transactions:', res);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load transaction history';
        this.loading = false;
      }
    });
  }

  getNote(row: any): string {
    if (row.type === 'Buy') {
      return 'Crypto purchased';
    }

    if (row.type === 'Sell') {
      return 'Crypto sold';
    }

    return 'Wallet transaction';
  }
}