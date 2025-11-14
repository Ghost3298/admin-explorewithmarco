import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseListComponent } from '../shared/base-list/base-list';
import { User, UsersService } from '../services/users-service';

@Component({
  selector: 'app-users',
  imports: [BaseListComponent, CommonModule],
  templateUrl: './users.html',
})
export class Users implements OnInit{
  pageConfig = {
    title: 'Users',
    searchPlaceholder: 'Search users by name or email...',
    buttonText: 'Add User',
    tableColumns: ['username', 'first name', 'last name', 'Role', 'Join Date', 'Status', 'Actions'],
    popupTitle: "Add New User"
  };

  users: User[] = [];
  filteredUSers: User[] = [];

  isLoading: boolean = false;

  constructor(
    private userService: UsersService,
    private cdr: ChangeDetectorRef
  ){}

  ngOnInit(){
    this.loadUsers();
  }

  async loadUsers(){
    this.isLoading = true;

    try{
      this.users = await this.userService.getAllUsers();
      this.filteredUSers = [...this.users];
      console.log('Users loaded:', this.users);

      this.cdr.detectChanges();
    } catch (err){
      console.error('Error loading users: ', err);
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }
}