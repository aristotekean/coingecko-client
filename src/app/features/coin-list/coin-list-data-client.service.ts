import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ToastService } from '../../shared/services/toast.service';
import { Coin } from './coin.model';
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
}
