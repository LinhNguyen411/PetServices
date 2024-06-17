import { Component, OnInit, inject } from '@angular/core';
import { CustomerService } from '../../../services/customer.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { NgToastService } from 'ng-angular-popup';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-complete-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './complete-profile.component.html',
  styleUrl: './complete-profile.component.css',
})
export class CompleteProfileComponent implements OnInit {
  private toast = inject(NgToastService);
  private spinner = inject(NgxSpinnerService);
  userService = inject(UserService);
  authService = inject(AuthService);
  private customerService = inject(CustomerService);
  private formBuilder = inject(FormBuilder);
  dataSubmitted?: boolean;

  customerForm!: FormGroup;
  user?: any;

  ngOnInit(): void {
    this.userService.user$.subscribe((user) => {
      this.user = user;
    });
    this.dataSubmitted = false;

    this.customerForm = this.formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required],

      phone_number: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(0[235789]|03|05|07|08|09)[0-9]{8}$/),
        ],
      ],
      account: '',
    });
  }
  userConfirm(): void {
    this.dataSubmitted = true;
    if (this.customerForm.valid) {
      this.spinner.show();
      this.customerForm.controls.account.setValue(this.user.id);
      this.customerService.create(this.customerForm.getRawValue()).subscribe({
        next: (res) => {
          this.authService.getCurrentAuthUser().subscribe((res) => {});
          this.toast.success({
            detail: 'Thành công',
            summary: 'Thêm thông tin cá nhân thành công',
            duration: 3000,
          });
          this.spinner.hide();
        },
        error: (e) => {
          this.toast.error({
            detail: 'Thất bại',
            summary: 'Thêm thông tin cá nhân thất bại',
            duration: 3000,
          });
          this.spinner.hide();
        },
      });
    }
  }
}
