import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-management',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './management.component.html',
  styleUrl: './management.component.css',
})
export class ManagementComponent implements OnInit {
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
    console.log(this.isLoggedIn);
  }
  logout() {
    this.authService.logout();
  }
  toggleMenu() {
    this.isToggle = !this.isToggle;
  }
}
