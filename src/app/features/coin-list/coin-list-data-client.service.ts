import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ToastService } from '../../shared/services/toast.service';
import { Coin } from '../../shared/models/coin.model';
import { catchError, map } from 'rxjs';
import { ErrorHandlerService } from '../../shared/services/error-handler.service';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class CoinListDataClientService {
  private readonly API_PATH =
    '/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&page=1';

  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  private errorHandler = inject(ErrorHandlerService);

  getAll(): Observable<Coin[]> {
    return this.http.get<Coin[]>(`${API_URL}${this.API_PATH}`).pipe(
      map((response) => response),
      catchError(this.errorHandler.handleError)
    );
  }

  getById(id: string | number): Observable<Coin> {
    return this.http.get<Coin>(`${API_URL}${this.API_PATH}/${id}`).pipe(
      map((response) => response),
      catchError((error) => {
        this.toastService.showError('Error al obtener la propiedad', 'Error');
        return this.errorHandler.handleError(error);
      })
    );
  }
}
