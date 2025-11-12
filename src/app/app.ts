import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalSpinnerComponent } from './global-spinner/global-spinner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GlobalSpinnerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('admin-for-xplorewithmarco');
}
