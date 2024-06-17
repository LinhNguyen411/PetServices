import { Component, OnInit, inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { NgToastService } from 'ng-angular-popup';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent implements OnInit {
  form!: FormGroup;
  message?: string;
  submitted?: boolean;
  spinner = inject(NgxSpinnerService);
  toast = inject(NgToastService);
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.submitted = false;
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }
  submit(): void {
    this.submitted = true;
    if (this.form.valid) {
      this.spinner.show();
      this.authService.reset_password(this.form.getRawValue()).subscribe({
        next: (res) => {
          this.message = 'Chúng tôi đã gửi email thay đổi mật khẩu đến bạn';
          this.spinner.hide();
        },
        error: (e) => {
          this.toast.error({
            detail: 'Thất bại',
            summary: 'Tài khoản không có trong hệ thống',
            duration: 3000,
          });
          this.spinner.hide();
        },
      });
    }
  }
}
