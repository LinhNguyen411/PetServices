import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgToastModule } from 'ng-angular-popup';

import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  constructor() {}
  private userService = inject(UserService);
  private authService = inject(AuthService);
  ngOnInit(): void {
    if (this.authService.isTokenExpired()) {
      if (this.authService.getJWTToken()) {
        this.authService.refreshToken()?.subscribe({
          next: (res) => {},
          error: (e) => {
            this.authService.logout();
          },
        });
      } else {
        this.authService.logout();
      }
    } else {
      this.authService.getCurrentAuthUser().subscribe((res) => {
        this.userService.setUser(res);
      });
    }
  }
}
