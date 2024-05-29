import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-management',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './management.component.html',
  styleUrl: './management.component.css',
})
export class ManagementComponent implements OnInit {
  userService = inject(UserService);
  toast = inject(NgToastService);
  router = inject(Router);
  authService = inject(AuthService);
  isLoggedIn?: boolean;
  user?: any;
  isToggle: boolean = false;

  title = 'PetCares';
  constructor() {}
  ngOnInit(): void {
    this.authService.loggedIn?.subscribe((res) => (this.isLoggedIn = res));

    this.userService.user$.subscribe((user) => {
      this.user = user;
    });
  }
  logout() {
    this.authService.logout();
    this.toast.success({
      detail: 'SUCCESS',
      summary: 'Logged Out!',
      duration: 3000,
    });
    this.router.navigate(['/', 'home', 'login']);
  }
  toggleMenu() {
    this.isToggle = !this.isToggle;
  }
}
