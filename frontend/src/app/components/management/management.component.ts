import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-management',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './management.component.html',
  styleUrl: './management.component.css',
})
export class ManagementComponent implements OnInit {
  toast = inject(NgToastService);
  authService = inject(AuthService);
  isLoggedIn?: boolean;
  user?: any;
  isToggle: boolean = false;

  title = 'PetCares';
  constructor() {}
  ngOnInit(): void {
    this.authService.loggedIn?.subscribe((res) => (this.isLoggedIn = res));

    this.authService.getCurrentAuthUser().subscribe((res) => {
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
  toggleMenu() {
    this.isToggle = !this.isToggle;
  }
}
