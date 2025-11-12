import { Component } from '@angular/core';
import { BaseListComponent } from '../shared/base-list/base-list';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog',
  imports: [BaseListComponent, CommonModule],
  templateUrl: './blog.html',
})
export class Blog {
  pageConfig = {
    title: 'Blog Posts',
    searchPlaceholder: 'Search blog posts...',
    buttonText: 'Add Post',
    tableColumns: ['Title', 'Author', 'Publish Date', 'Status', 'Actions'],
    popupTitle: "Add New Post"
  };

  posts: any[] = [];
}