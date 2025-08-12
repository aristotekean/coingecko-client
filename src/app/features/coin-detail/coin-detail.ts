import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe, DecimalPipe, PercentPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CoinDetailDataClientService } from './coin-detail-data-client.service';
import { ICoinDetail } from './coin-detail.model';

@Component({
  selector: 'app-coin-detail',
  imports: [CurrencyPipe, PercentPipe, DecimalPipe],
  templateUrl: './coin-detail.html',
  styleUrl: './coin-detail.css',
})
export class CoinDetail implements OnInit {
  readonly coin = signal<ICoinDetail | null>(null);
  readonly coinId: string;
  readonly loading = signal<boolean>(false);
  readonly Math = Math; // Make Math available in template

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
