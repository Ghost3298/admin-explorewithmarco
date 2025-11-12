import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-shared-components',
  imports: [],
  templateUrl: './shared-components.html',
  styleUrl: './shared-components.css',
})
export class SharedComponents {

}


@Component({
  selector: 'app-input-shared',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="input-container" [class.has-error]="hasError">
      <label *ngIf="label" [for]="id" class="input-label">
        {{ label }}
        <span *ngIf="required" class="required">*</span>
      </label>
      
      <input
        [id]="id"
        [type]="type"
        [placeholder]="placeholder"
        [value]="value"
        [disabled]="disabled"
        [required]="required"
        [class.error]="hasError"
        (input)="onInput($event)"
        (blur)="onBlur()"
        class="form-input"
      />
      
      <div *ngIf="hasError && errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </div>
  `,
  styles: [`
    .input-container {
      margin-bottom: 1rem;
    }
    
    .input-label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #374151;
    }
    
    .required {
      color: #ef4444;
    }
    
    .form-input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 1rem;
      transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    }
    
    .form-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .form-input:disabled {
      background-color: #f9fafb;
      color: #6b7280;
      cursor: not-allowed;
    }
    
    .form-input.error {
      border-color: #ef4444;
    }
    
    .has-error .form-input:focus {
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    
    .error-message {
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputSharedComponent),
      multi: true
    }
  ]
})
export class InputSharedComponent implements ControlValueAccessor {
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Input() id: string = `input-${Math.random().toString(36).substr(2, 9)}`;
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() hasError: boolean = false;
  @Input() errorMessage: string = '';

  value: string = '';
  
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
  }

  onBlur(): void {
    this.onTouched();
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-button-shared',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [class]="buttonClass"
      [disabled]="disabled || loading"
      (click)="onClick.emit($event)"
      (blur)="onBlur.emit($event)"
      (focus)="onFocus.emit($event)"
      [attr.aria-label]="ariaLabel"
      [attr.aria-busy]="loading"
    >
      <!-- Loading spinner -->
      <span *ngIf="loading" class="spinner" [class]="spinnerClass">
        <svg *ngIf="!customSpinner" class="spinner-icon" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="15.85 15.85" stroke-dashoffset="12.5"/>
        </svg>
        <ng-container *ngIf="customSpinner">
          <ng-content select="[spinner]"></ng-content>
        </ng-container>
      </span>

      <!-- Button icon (left) -->
      <span *ngIf="iconLeft && !loading" class="icon-left">
        <i *ngIf="isMaterialIcon(iconLeft)" class="material-icons">{{ iconLeft }}</i>
        <i *ngIf="!isMaterialIcon(iconLeft)" [class]="iconLeft"></i>
      </span>

      <!-- Button content -->
      <span class="button-content" [class.content-hidden]="loading && hideContentWhenLoading">
        <ng-content></ng-content>
        {{ text }}
      </span>

      <!-- Button icon (right) -->
      <span *ngIf="iconRight && !loading" class="icon-right">
        <i *ngIf="isMaterialIcon(iconRight)" class="material-icons">{{ iconRight }}</i>
        <i *ngIf="!isMaterialIcon(iconRight)" [class]="iconRight"></i>
      </span>
    </button>
  `,
  styles: [`
    :host {
      display: inline-block;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      border: none;
      border-radius: 0.375rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      position: relative;
      text-decoration: none;
      line-height: 1;
    }

    .btn:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none !important;
    }

    .btn-sm {
      padding: 0.5rem 0.75rem;
      font-size: 0.875rem;
      min-height: 2rem;
    }

    .btn-md {
      padding: 0.625rem 1rem;
      font-size: 0.875rem;
      min-height: 2.5rem;
    }

    .btn-lg {
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      min-height: 3rem;
    }

    .btn-xl {
      padding: 1rem 2rem;
      font-size: 1.125rem;
      min-height: 3.5rem;
    }

    .btn-primary {
      background-color: #3b82f6;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #2563eb;
    }

    .btn-primary:focus:not(:disabled) {
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
    }

    .btn-secondary {
      background-color: #6b7280;
      color: white;
    }

    .btn-secondary:hover:not(:disabled) {
      background-color: #4b5563;
    }

    .btn-secondary:focus:not(:disabled) {
      box-shadow: 0 0 0 3px rgba(107, 114, 128, 0.3);
    }

    .btn-danger {
      background-color: #ef4444;
      color: white;
    }

    .btn-danger:hover:not(:disabled) {
      background-color: #dc2626;
    }

    .btn-danger:focus:not(:disabled) {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.3);
    }

    .btn-success {
      background-color: #10b981;
      color: white;
    }

    .btn-success:hover:not(:disabled) {
      background-color: #059669;
    }

    .btn-success:focus:not(:disabled) {
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.3);
    }

    .btn-warning {
      background-color: #f59e0b;
      color: white;
    }

    .btn-warning:hover:not(:disabled) {
      background-color: #d97706;
    }

    .btn-warning:focus:not(:disabled) {
      box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.3);
    }

    .btn-ghost {
      background-color: transparent;
      color: #374151;
      border: 1px solid #d1d5db;
    }

    .btn-ghost:hover:not(:disabled) {
      background-color: #f9fafb;
    }

    .btn-ghost:focus:not(:disabled) {
      box-shadow: 0 0 0 3px rgba(209, 213, 219, 0.3);
    }

    .btn-full {
      width: 100%;
    }

    .spinner {
      display: inline-flex;
      align-items: center;
    }

    .spinner-icon {
      width: 1em;
      height: 1em;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .content-hidden {
      opacity: 0;
    }

    .material-icons {
      font-size: inherit;
    }

    .icon-left, .icon-right {
      display: inline-flex;
      align-items: center;
    }
  `]
})
export class ButtonSharedComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() fullWidth: boolean = false;
  @Input() text: string = '';
  @Input() iconLeft: string = '';
  @Input() iconRight: string = '';
  @Input() ariaLabel: string = '';
  @Input() hideContentWhenLoading: boolean = false;
  @Input() customSpinner: boolean = false;

  @Output() onClick = new EventEmitter<Event>();
  @Output() onBlur = new EventEmitter<Event>();
  @Output() onFocus = new EventEmitter<Event>();

  get buttonClass(): string {
    const classes = [
      'btn',
      `btn-${this.variant}`,
      `btn-${this.size}`,
      this.fullWidth ? 'btn-full' : '',
      this.loading ? 'btn-loading' : ''
    ];
    return classes.filter(c => c).join(' ');
  }

  get spinnerClass(): string {
    return `spinner-${this.size}`;
  }

  isMaterialIcon(icon: string): boolean {
    return /^[a-z-]+$/.test(icon) && !icon.includes(' ');
  }
}