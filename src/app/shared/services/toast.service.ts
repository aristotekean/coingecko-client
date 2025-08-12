import { Injectable, signal } from '@angular/core';
import { Toast } from '../models/toast.model';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toasts = signal<Toast[]>([]);
  private counter = 0;

  getToasts() {
    return this.toasts;
  }

  private add(toast: Omit<Toast, 'id'>) {
    const id = ++this.counter;
    this.toasts.update((toasts) => [...toasts, { ...toast, id }]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      this.remove(id);
    }, 5000);
  }

  remove(id: number) {
    this.toasts.update((toasts) => toasts.filter((t) => t.id !== id));
  }

  showSuccess(message: string, title: string = 'Success') {
    this.add({ message, title, type: 'success' });
  }

  showInfo(message: string, title: string = 'Information') {
    this.add({ message, title, type: 'info' });
  }

  showWarn(message: string, title: string = 'Warning') {
    this.add({ message, title, type: 'warning' });
  }

  showError(message: string, title: string = 'Error') {
    this.add({ message, title, type: 'error' });
  }
}
