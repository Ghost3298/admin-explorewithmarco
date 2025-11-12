// spinner.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private spinnerSubject = new BehaviorSubject<boolean>(false);
  private messageSubject = new BehaviorSubject<string>('Loading...');
  
  public spinnerState = this.spinnerSubject.asObservable();
  public messageState = this.messageSubject.asObservable();

  show(message: string = 'Loading...') {
    this.messageSubject.next(message);
    this.spinnerSubject.next(true);
  }

  hide() {
    this.spinnerSubject.next(false);
  }

  setMessage(message: string) {
    this.messageSubject.next(message);
  }
}