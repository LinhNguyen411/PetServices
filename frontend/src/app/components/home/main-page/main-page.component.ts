import { Component, OnInit, inject } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css',
})
export class MainPageComponent implements OnInit {
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
  scrollTo(element: any): void {
    (document.getElementById(element) as HTMLElement).scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }
}
