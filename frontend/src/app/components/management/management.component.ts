import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { UserService } from '../../services/user.service';
import { CompleteProfileComponent } from '../auth/complete-profile/complete-profile.component';
import { ServiceBookingService } from '../../services/service-booking.service';
import { Pet } from '../../models/pet.model';
import { PetService } from '../../services/pet.service';
import { ServiceBooking } from '../../models/service-booking.model';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-management',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, CompleteProfileComponent],
  templateUrl: './management.component.html',
  styleUrl: './management.component.css',
})
export class ManagementComponent implements OnInit {
  private spinner = inject(NgxSpinnerService);
  private petService = inject(PetService);

  userService = inject(UserService);
  toast = inject(NgToastService);
  router = inject(Router);
  authService = inject(AuthService);
  isLoggedIn?: boolean;
  user?: any;
  userData?: any;
  isToggle: boolean = false;
  isHaveData: boolean = true;
  title = 'PetCares';

  constructor() {}
  ngOnInit(): void {
    this.authService.loggedIn?.subscribe((res) => (this.isLoggedIn = res));

    this.userService.user$.subscribe((user) => {
      this.user = user;
    });
    this.userService.userData$.subscribe((data) => {
      if (!this.userData) {
        setTimeout(() => {
          this.isHaveData = false;
        }, 500);
      }
      this.userData = data;
    });
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/', 'home', 'login']);
  }
  toggleMenu(): void {
    this.isToggle = !this.isToggle;
  }
}
