import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseListComponent } from '../shared/base-list/base-list';

@Component({
  selector: 'app-packages',
  imports: [BaseListComponent, CommonModule],
  templateUrl: './packages.html',
})
export class Packages {
  pageConfig = {
    title: 'Packages',
    searchPlaceholder: 'Search packages...',
    buttonText: 'Add Package',
    tableColumns: ['Package Name', 'Price', 'Duration', 'Features', 'Actions'],
    popupTitle: "Add New Package"
  };

  packages: any[] = [];
}