import { Component, OnInit, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CoinListDataClientService } from './coin-list-data-client.service';
import { Coin } from './coin.model';
import {
  TableComponent,
  TableColumn,
} from '../../shared/components/table.component';

@Component({
  selector: 'app-coin-list',
  imports: [TableComponent],
  templateUrl: './coin-list.html',
  styleUrl: './coin-list.css',
})
export class CoinList implements OnInit {
  private readonly dataClient = inject(CoinListDataClientService);
  private readonly router = inject(Router);

  readonly loading = signal<boolean>(false);
  readonly coins = signal<Coin[]>([]);

  readonly columns = signal<TableColumn<Coin>[]>([
    { key: 'market_cap_rank', header: '#', headerClass: 'w-8' },
    {
      key: 'image',
      header: '',
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
      cell: (c) => `$${c.current_price.toLocaleString()}`,
    },
    {
      key: 'price_change_percentage_24h',
      header: '24h',
      cell: (c) => `${c.price_change_percentage_24h?.toFixed(2)}%`,
      cellClass: (c) => ({
        'text-success': (c.price_change_percentage_24h ?? 0) > 0,
        'text-error': (c.price_change_percentage_24h ?? 0) < 0,
      }),
    },
  ]);

  ngOnInit(): void {
    this.loadCoins();
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
}
