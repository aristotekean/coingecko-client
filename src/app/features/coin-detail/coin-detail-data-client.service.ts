import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../shared/services/toast.service';
import { ErrorHandlerService } from '../../shared/services/error-handler.service';
import { catchError, Observable, tap } from 'rxjs';
import { Coin } from '../../shared/models/coin.model';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class CoinDetailDataClientService {
  private readonly API_PATH = '/coins';

  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  private errorHandler = inject(ErrorHandlerService);

  getById(id: string | number): Observable<Coin> {
    return this.http.get<Coin>(`${API_URL}${this.API_PATH}/${id}`).pipe(
      tap(() =>
        this.toastService.showSuccess('Coin loaded successfully', 'Success')
      ),
      catchError((error) => {
        this.toastService.showError('Error loading coin details', 'Error');
        return this.errorHandler.handleError(error);
      })
    );
  }
}
