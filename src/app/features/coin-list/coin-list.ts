import { Component } from '@angular/core';
import { Layout } from '../../core/layout/layout';

@Component({
  selector: 'app-coin-list',
  standalone: true,
  imports: [Layout],
  templateUrl: './coin-list.html',
  styleUrl: './coin-list.css',
})
export class CoinList {}
