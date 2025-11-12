import { Component } from '@angular/core';
import { Navbar } from "../shared/navbar/navbar";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-page',
  imports: [Navbar, RouterOutlet],
  templateUrl: './main-page.html',
  styleUrl: './main-page.css',
})
export class MainPage {

}
