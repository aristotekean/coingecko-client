export interface Toast {
  id: number;
  message: string;
  title: string;
  type: 'success' | 'info' | 'warning' | 'error';
}
