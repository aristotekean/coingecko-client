import { Routes } from '@angular/router';
import { CoinList } from './features/coin-list/coin-list';

export const routes: Routes = [
  {
    path: '',
    component: CoinList,
  },
  {
    path: '',
    loadComponent: () =>
      import('./features/coin-list/coin-list').then((c) => c.CoinList),
  },
  {
    path: 'coin/:id',
    loadComponent: () =>
      import('./features/coin-detail/coin-detail').then((c) => c.CoinDetail),
  },
];
