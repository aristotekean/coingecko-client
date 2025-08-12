import { Routes } from '@angular/router';
import { CoinList } from './features/coin-list/coin-list';
import { CoinDetail } from './features/coin-detail/coin-detail';

export const routes: Routes = [
  {
    path: '',
    component: CoinList,
  },
  {
    path: 'coin/:id',
    component: CoinDetail,
  },
];
