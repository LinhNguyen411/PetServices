import { EventEmitter } from '@angular/core';
export class AuthEmitter {
  static isLoggedIn = new EventEmitter<boolean>();
}
