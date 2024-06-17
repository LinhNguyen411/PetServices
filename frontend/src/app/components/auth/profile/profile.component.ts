import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { AddEditEmployeeComponent } from '../../management/employee/add-edit-employee/add-edit-employee.component';
import { CommonModule } from '@angular/common';
import { AddEditCustomerComponent } from '../../management/customer/add-edit-customer/add-edit-customer.component';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [AddEditEmployeeComponent, CommonModule, AddEditCustomerComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  authService = inject(AuthService);
  userService = inject(UserService);
  user?: any;
  userData?: any;
  constructor() {}
  ngOnInit(): void {
    this.userService.user$.subscribe((user) => {
      this.user = user;
    });
    this.userService.userData$.subscribe((res) => {
      this.userData = res;
    });
  }
}
