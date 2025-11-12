import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  public links = [
    {
      "title": "Bg & UI",
      "link" : "bgnui"
    },
    {
      "title": "Countries",
      "link" : "countries"
    },
    {
      "title": "Categories",
      "link" : "categories"
    },
    {
      "title": "Packages",
      "link" : "packages"
    },
    {
      "title": "Blog",
      "link" : "blog"
    },
    {
      "title": "Users",
      "link" : "users"
    }
  ]
}
