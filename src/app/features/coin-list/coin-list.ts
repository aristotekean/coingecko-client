import { Component, OnInit, signal, inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CoinListDataClientService } from './coin-list-data-client.service';
import { Coin } from './coin.model';
import {
  TableComponent,
  TableColumn,
} from '../../shared/components/table.component';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  Subject,
  takeUntil,
} from 'rxjs';

@Component({
  selector: 'app-coin-list',
  imports: [TableComponent, ReactiveFormsModule],
  templateUrl: './coin-list.html',
  styleUrl: './coin-list.css',
})
export class CoinList implements OnInit, OnDestroy {
  private readonly dataClient = inject(CoinListDataClientService);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();

  readonly loading = signal<boolean>(false);
  readonly coins = signal<Coin[]>([]);
  readonly searchControl = new FormControl('');
  readonly isSearching = signal<boolean>(false);

  readonly columns = signal<TableColumn<Coin>[]>([
    { key: 'market_cap_rank', header: '#', headerClass: 'w-8' },
    {
      key: 'image',
      header: 'Icon',
      imageSrc: (c) => c.image,
    },
    {
      key: 'name',
      header: 'Coin',
      cell: (c) => c.name,
    },
    { key: 'symbol', header: 'Symbol', cell: (c) => c.symbol.toUpperCase() },
    {
      key: 'current_price',
      header: 'Price',
      cell: (c) =>
        c.current_price > 0 ? `$${c.current_price.toLocaleString()}` : 'N/A',
    },
    {
      key: 'price_change_percentage_24h',
      header: '24h',
      cell: (c) =>
        c.current_price > 0
          ? `${c.price_change_percentage_24h.toFixed(2)}%`
          : 'N/A',
      cellClass: (c) => ({
        'text-success':
          c.price_change_percentage_24h > 0 && c.current_price > 0,
        'text-error': c.price_change_percentage_24h < 0 && c.current_price > 0,
      }),
    },
  ]);

  ngOnInit(): void {
    this.loadCoins();
    this.setupSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCoins(): void {
    this.loading.set(true);
    this.dataClient.getAll().subscribe({
      next: (rows: Coin[]) => this.coins.set(rows ?? []),
      error: () => this.loading.set(false),
      complete: () => this.loading.set(false),
    });
  }

  onCoinClick(coin: Coin): void {
    this.router.navigate(['/coin', coin.id]);
  }

  private setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300), // Wait 300ms after user stops typing for better real-time feel
        distinctUntilChanged(), // Only emit when the value actually changes
        switchMap((searchTerm) => {
          if (searchTerm && searchTerm.trim()) {
            this.isSearching.set(true);
            return this.dataClient.searchCoins(searchTerm.trim());
          } else {
            this.isSearching.set(false);
            return this.dataClient.getAll(); // Load all coins when search is empty
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (results: Coin[]) => {
          this.coins.set(results ?? []);
          this.isSearching.set(false);
        },
        error: () => this.isSearching.set(false),
      });
  }

  clearSearch(): void {
    this.searchControl.setValue('');
    this.loadCoins();
  }
}
