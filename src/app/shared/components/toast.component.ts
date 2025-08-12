import { Component, inject } from '@angular/core';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-toast',
  imports: [],
  styles: `
  :host {
  display: block;
  }`,
  template: `
    <div class="toast toast-end">
      @for (toast of service.getToasts()(); track toast.id) {
      <div
        [class]="getToastClass(toast.type)"
        (click)="service.remove(toast.id)"
      >
        <div>
          <span class="font-bold">{{ toast.title }}</span>
          <div class="text-sm">{{ toast.message }}</div>
        </div>
      </div>
      }
    </div>
  `,
})
export class ToastComponent {
  service = inject(ToastService);

  getToastClass(type: string): string {
    const baseClass = 'alert cursor-pointer';
    switch (type) {
      case 'success':
        return `${baseClass} alert-success`;
      case 'info':
        return `${baseClass} alert-info`;
      case 'warning':
        return `${baseClass} alert-warning`;
      case 'error':
        return `${baseClass} alert-error`;
      default:
        return baseClass;
    }
  }
}
