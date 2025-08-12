import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Layout } from './core/layout/layout';
import { ToastComponent } from './shared/components/toast.component';

@Component({
  selector: 'app-root',
  imports: [Layout, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
