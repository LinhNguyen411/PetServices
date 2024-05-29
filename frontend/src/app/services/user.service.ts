import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  private userDataSubject = new BehaviorSubject<any>(null);
  userData$ = this.userDataSubject.asObservable();

  constructor() {}

  setUser(user: any) {
    this.userSubject.next(user);
  }

  getUser() {
    return this.userSubject.getValue();
  }

  setDataUser(user: any) {
    this.userDataSubject.next(user);
  }

  getDataUser() {
    return this.userDataSubject.getValue();
  }
  getUserDataId() {
    const user = this.userDataSubject.getValue();
    return user ? user.id : null;
  }
}
