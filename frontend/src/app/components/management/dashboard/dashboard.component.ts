import { Component, OnInit, inject } from '@angular/core';
import { ServiceBookingService } from '../../../services/service-booking.service';
import { Pet } from '../../../models/pet.model';
import { ServiceBooking } from '../../../models/service-booking.model';
import { UserService } from '../../../services/user.service';
import { PetService } from '../../../services/pet.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private bookingService = inject(ServiceBookingService);
  private petService = inject(PetService);
  userService = inject(UserService);
  user?: any;
  userData?: any;

  petList?: Pet[];
  bookingList?: ServiceBooking[];
  subBookingList?: ServiceBooking[];
  ngOnInit(): void {
    this.userService.user$.subscribe((user) => {
      this.user = user;
    });
    this.userService.userData$.subscribe((data) => {
      this.userData = data;
      if (data) {
        if (this.user.account_type == 'c') {
          this.petService
            .getAll({ owner_value: this.userData.id })
            .subscribe((res) => {
              this.petList = res.results;
            });
          this.bookingService
            .getAll({ customer_value: this.userData.is, status: 'p' })
            .subscribe((res) => {
              this.bookingList = res.results;
            });
          this.bookingService
            .getAll({ customer_value: this.userData.is, status: 'u' })
            .subscribe((res) => {
              this.subBookingList = res.results;
            });
        } else {
          this.bookingService.getAll({ status: 'p' }).subscribe((res) => {
            console.log(res);
            this.bookingList = res.results;
          });
          this.bookingService.getAll({ status: 'u' }).subscribe((res) => {
            this.subBookingList = res.results;
          });
        }
      }
    });
  }
}
