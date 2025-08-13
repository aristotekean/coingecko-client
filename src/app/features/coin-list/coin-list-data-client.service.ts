import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { ToastService } from '../../shared/services/toast.service';
import { Coin } from './coin.model';
import { SearchResponse, SearchCoin } from './search.model';
import { catchError } from 'rxjs';
import { ErrorHandlerService } from '../../shared/services/error-handler.service';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class CoinListDataClientService {
  private readonly API_PATH = '/coins/markets';

  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  private errorHandler = inject(ErrorHandlerService);

  getAll(): Observable<Coin[]> {
    // Create HttpParams with all query parameters
    const params = new HttpParams()
      .set('vs_currency', 'usd')
      .set('order', 'market_cap_desc')
      .set('per_page', '25')
      .set('page', '1');

    const options = { params };

    return this.http.get<Coin[]>(`${API_URL}${this.API_PATH}`, options).pipe(
      tap(() =>
        this.toastService.showSuccess('Coins loaded successfully', 'Success')
      ),
      catchError((error) => {
        this.toastService.showError('Error loading coins', 'Error');
        return this.errorHandler.handleError(error);
      })
    );
  }

  searchCoins(query: string): Observable<Coin[]> {
    const params = new HttpParams().set('query', query);
    const options = { params };

    return this.http.get<SearchResponse>(`${API_URL}/search`, options).pipe(
      map((response) => this.mapSearchCoinsToCoins(response.coins)),
      catchError((error) => {
        this.toastService.showError(
          `Error searching for "${query}"`,
          'Search Error'
        );
        return this.errorHandler.handleError(error);
      })
    );
  }

  searchByName(coinName: string): Observable<Coin[]> {
    // URL-encode the coin name to handle spaces (e.g., "Binance Coin" becomes "Binance%20Coin")
    const encodedName = encodeURIComponent(coinName);

    const params = new HttpParams()
      .set('vs_currency', 'usd')
      .set('names', encodedName)
      .set('order', 'market_cap_desc')
      .set('per_page', '25')
      .set('page', '1');

    const options = { params };

    return this.http.get<Coin[]>(`${API_URL}${this.API_PATH}`, options).pipe(
      tap((results) => {
        const message =
          results.length > 0
            ? `Found ${results.length} result(s) for "${coinName}"`
            : `No results found for "${coinName}"`;
        this.toastService.showSuccess(message, 'Search Complete');
      }),
      catchError((error) => {
        this.toastService.showError(
          `Error searching for "${coinName}"`,
          'Search Error'
        );
        return this.errorHandler.handleError(error);
      })
    );
  }

  private mapSearchCoinsToCoins(searchCoins: SearchCoin[]): Coin[] {
    return searchCoins.map((searchCoin) => ({
      id: searchCoin.id,
      symbol: searchCoin.symbol,
      name: searchCoin.name,
      image: searchCoin.large,
      current_price: 0, // Not available in search results
      market_cap: 0, // Not available in search results
      market_cap_rank: searchCoin.market_cap_rank,
      fully_diluted_valuation: 0, // Not available in search results
      total_volume: 0, // Not available in search results
      high_24h: 0, // Not available in search results
      low_24h: 0, // Not available in search results
      price_change_24h: 0, // Not available in search results
      price_change_percentage_24h: 0, // Not available in search results
      market_cap_change_24h: 0, // Not available in search results
      market_cap_change_percentage_24h: 0, // Not available in search results
      circulating_supply: 0, // Not available in search results
      total_supply: 0, // Not available in search results
      max_supply: undefined,
      ath: 0, // Not available in search results
      ath_change_percentage: 0,
      ath_date: '',
      atl: 0, // Not available in search results
      atl_change_percentage: 0,
      atl_date: '',
      roi: undefined,
      last_updated: '',
    }));
  }
}
