import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonSharedComponent, InputSharedComponent } from '../shared-components/shared-components';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-base-list',
  standalone: true,
  imports: [CommonModule, InputSharedComponent, ButtonSharedComponent, FormsModule],
  template: `
    <h2>{{ pageTitle }}</h2>

    <div class="content">
        <div class="searchBar">
            <app-input-shared 
                [placeholder]="searchPlaceholder" 
                type="text"
                [(ngModel)]="searchTerm"
                (ngModelChange)="onSearchChange()" />
            <app-button-shared variant="success" [text]="buttonText" (click)="onAddClick()"/>
        </div>

        <table>
            <thead>
                <tr>
                    <th *ngFor="let column of tableColumns">{{ column }}</th>
                </tr>
            </thead>

            <ng-content></ng-content>

        </table>
    </div>

    <div class="modal-overlay" *ngIf="showPopup" (click)="closePopup()">
        <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
                <h3>{{ popupTitle }}</h3>
                <button class="close-btn" (click)="closePopup()">&times;</button>
            </div>
            <div class="modal-body">
                <ng-content select="[popup-content]"></ng-content>
            </div>
        </div>
    </div>
  `,
  styleUrl: './base-list.css'
})
export class BaseListComponent {
  @Input() pageTitle: string = '';
  @Input() searchPlaceholder: string = 'Search...';
  @Input() buttonText: string = 'Add';
  @Input() buttonVariant: string = 'success';
  @Input() tableColumns: string[] = [];
  @Input() popupTitle: string = 'Add New Item';
  @Output() addClicked = new EventEmitter<void>();
  @Output() searchChanged = new EventEmitter<string>();

  searchTerm: string = '';
  showPopup: boolean = false;

  onAddClick() {
    this.showPopup = true;
    this.addClicked.emit();
  }

  closePopup() {
    this.showPopup = false;
  }

  onSearchChange() {
    this.searchChanged.emit(this.searchTerm);
  }
}