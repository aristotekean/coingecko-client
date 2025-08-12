import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoinDetailDataClientService } from './coin-detail-data-client.service';
import { Coin } from '../coin-list/coin.model';

@Component({
  selector: 'app-coin-detail',
  imports: [],
  templateUrl: './coin-detail.html',
  styleUrl: './coin-detail.css',
})
export class CoinDetail implements OnInit {
  readonly coin = signal<Coin | null>(null);
  readonly coinId: string;
  readonly loading = signal<boolean>(false);

  private route = inject(ActivatedRoute);
  private coinService = inject(CoinDetailDataClientService);

  constructor() {
    this.coinId = this.route.snapshot.params['id'];
  }

  loadCoin(): void {
    this.loading.set(true);
    this.coinService.getById(this.coinId).subscribe({
      next: (coin) => this.coin.set(coin),
      error: () => this.loading.set(false),
      complete: () => this.loading.set(false),
    });
  }

  ngOnInit(): void {
    this.loadCoin();
  }
}
