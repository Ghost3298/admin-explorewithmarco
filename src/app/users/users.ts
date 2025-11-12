import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseListComponent } from '../shared/base-list/base-list';

@Component({
  selector: 'app-users',
  imports: [BaseListComponent, CommonModule],
  templateUrl: './users.html',
})
export class Users {
  pageConfig = {
    title: 'Users',
    searchPlaceholder: 'Search users by name or email...',
    buttonText: 'Add User',
    tableColumns: ['Name', 'Email', 'Role', 'Join Date', 'Status', 'Actions'],
    popupTitle: "Add New User"
  };

  users: any[] = [];
}