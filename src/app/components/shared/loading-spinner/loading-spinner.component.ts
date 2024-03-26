import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template: ` <div class="loading">
    <div class="spinner"></div>
    Loading...
  </div>`,
  styles: [
    `
      .loading {
        text-align: center;
        padding: 20px;
      }

      .spinner {
        margin: 100px auto;
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-radius: 50%;
        border-top: 4px solid #3498db;
        animation: spin 2s linear infinite;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class LoadingSpinnerComponent {}
