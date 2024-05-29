import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  userService = inject(UserService);
  authService = inject(AuthService);
  toast = inject(NgToastService);
  isLoggedIn?: boolean;
  user?: any;
  isToggle: boolean = false;
  title = 'PetCares';
  constructor() {}
  ngOnInit(): void {
    this.authService.loggedIn?.subscribe((res) => (this.isLoggedIn = res));

    this.userService.user$.subscribe((res) => {
      this.user = res;
    });
  }
  logout() {
    this.authService.logout();
    this.toast.success({
      detail: 'SUCCESS',
      summary: 'Logged Out!',
      duration: 3000,
    });
  }
}
