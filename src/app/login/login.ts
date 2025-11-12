import { Component } from '@angular/core';
import { InputSharedComponent, ButtonSharedComponent } from "../shared/shared-components/shared-components";

@Component({
  selector: 'app-login',
  imports: [InputSharedComponent, ButtonSharedComponent],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

}
