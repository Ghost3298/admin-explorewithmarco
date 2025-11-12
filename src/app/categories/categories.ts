import { Component } from '@angular/core';
import { BaseListComponent } from '../shared/base-list/base-list';
import { CommonModule } from '@angular/common';
import { ButtonSharedComponent } from "../shared/shared-components/shared-components";

@Component({
  selector: 'app-categories',
  imports: [BaseListComponent, CommonModule, BaseListComponent],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {
  pageConfig = {
    title: 'Categories',
    searchPlaceholder: 'Search categories...',
    buttonText: 'Add Category',
    tableColumns: ['Name', 'Description', 'Products Count', 'Status', 'Actions'],
    popupTitle: "Add New Category"
  };

  categories: any[] = [];
}
