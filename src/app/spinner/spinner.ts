// spinner.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="show" class="spinner-overlay" [class.full-screen]="fullScreen">
      <div class="spinner-container">
        <div class="spinner"></div>
        <div *ngIf="message" class="spinner-message">{{ message }}</div>
      </div>
    </div>
  `,
  styles: [`
    .spinner-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .spinner-overlay.full-screen {
      position: fixed;
    }

    .spinner-container {
      text-align: center;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 10px;
    }

    .spinner-message {
      margin-top: 10px;
      color: #666;
      font-size: 14px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class SpinnerComponent {
  @Input() show: boolean = false;
  @Input() message: string = '';
  @Input() fullScreen: boolean = false;
}