import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../shared/services/toast.service';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class CoinListDataClientService {
  private readonly API_PATH = '/';

  private http = inject(HttpClient);
  private toastService = inject(ToastService);
}
