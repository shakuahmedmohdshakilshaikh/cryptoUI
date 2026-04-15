import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { MaterialModule } from '../../../Material.Module';
import { Dashboard as dashboard} from '../../../Services/dashboard';


@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, MaterialModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  userId = 0;

  loading = false;
  errorMessage = '';

  dashboardData: any = null;
  coins: any[] = [];

  currency = 'inr';

  pageNumber = 1;
  pageSize = 5;
  totalRecords = 0;
  totalPages = 0;

  searchText = '';
  sortBy = 'CryptoName';
  sortOrder = 'asc';

  displayedColumns: string[] = [
    'image',
    'cryptoName',
    'symbol',
    'currentPrice',
    'marketCap',
    'status'
  ];

  pieChartConfig: any = {
    labels: [],
    datasets: [
      {
        data: []
      }
    ]
  };

  chartType: any = 'doughnut';

  chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%'
  };

  constructor(
    private cryptoService: dashboard,
    private cdr: ChangeDetectorRef
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

    this.loadDashboard();
  }

  private getStoredUserId(): number {
    if (typeof window === 'undefined' || !window.localStorage) {
      return 0;
    }

    return Number(window.localStorage.getItem('userId')) || 0;
  }

  loadDashboard(): void {
    this.loading = true;
    this.errorMessage = '';

    this.cryptoService.fetchCoins(this.userId).subscribe({
      next: (dashboardRes) => {
        this.dashboardData = dashboardRes.data;
        console.log(dashboardRes);
        
        this.prepareChart();
        this.loadCoinsOnly();
        // this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching dashboard:', err);
        this.errorMessage = 'Failed to load dashboard';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadCoinsOnly(): void {
    this.cryptoService.getCoins(
      this.currency,
      this.pageNumber,
      this.pageSize,
      this.searchText,
      this.sortBy,
      this.sortOrder
    ).subscribe({
      next: (coinsRes) => {
        this.coins = coinsRes?.data?.data || [];
        console.log(coinsRes);
        this.totalRecords = coinsRes?.data?.totalRecords || 0;
        this.totalPages = coinsRes?.data?.totalPages || 0;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching coins:', err);
        console.error('Backend error body:', err.error);
        this.errorMessage = 'Failed to load coins';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  prepareChart(): void {
    if (!this.dashboardData?.allocationChart) return;

    this.pieChartConfig = {
      labels: this.dashboardData.allocationChart.map((x: any) => x.cryptoName),
      datasets: [
        {
          data: this.dashboardData.allocationChart.map((x: any) => x.value)
        }
      ]
    };
  }

  onSearch(): void {
    this.pageNumber = 1;
    this.loadCoinsOnly();
  }

  clearSearch(): void {
    this.searchText = '';
    this.pageNumber = 1;
    this.sortBy = 'CryptoName';
    this.sortOrder = 'asc';
    this.loadCoinsOnly();
  }

  onSortChange(column: string): void {
    if (this.sortBy === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortOrder = 'asc';
    }

    this.pageNumber = 1;
    this.loadCoinsOnly();
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.loadCoinsOnly();
    }
  }

  previousPage(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.loadCoinsOnly();
    }
  }

  changePageSize(size: number): void {
    this.pageSize = +size;
    this.pageNumber = 1;
    this.loadCoinsOnly();
  }

  getSortIcon(column: string): string {
    if (this.sortBy !== column) return 'unfold_more';
    return this.sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward';
  }
}