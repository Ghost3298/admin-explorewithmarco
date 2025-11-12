// global-spinner.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { SpinnerComponent } from '../spinner/spinner';
import { SpinnerService } from '../services/spinner';

@Component({
  selector: 'app-global-spinner',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  template: `
    <app-spinner 
      [show]="(isLoading$ | async) || false" 
      [message]="(message$ | async) || 'Loading...'"
      [fullScreen]="true">
    </app-spinner>
  `
})
export class GlobalSpinnerComponent implements OnInit {
  isLoading$!: Observable<boolean>;
  message$!: Observable<string>;

  constructor(private spinnerService: SpinnerService) {}

  ngOnInit() {
    this.isLoading$ = this.spinnerService.spinnerState;
    this.message$ = this.spinnerService.messageState;
  }
}