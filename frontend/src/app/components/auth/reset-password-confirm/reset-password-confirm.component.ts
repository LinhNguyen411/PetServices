import { Component, OnInit, inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgToastService } from 'ng-angular-popup';
import Validation from '../../../untils/validation';
import { RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-reset-password-confirm',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './reset-password-confirm.component.html',
  styleUrl: './reset-password-confirm.component.css',
})
export class ResetPasswordConfirmComponent implements OnInit {
  form!: FormGroup;
  message?: string;
  submitted?: boolean;
  toast = inject(NgToastService);
  spinner = inject(NgxSpinnerService);

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private activateRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.submitted = false;
    this.form = this.formBuilder.group(
      {
        uid: this.activateRoute.snapshot.paramMap.get('uid'),
        token: this.activateRoute.snapshot.paramMap.get('token'),
        new_password: ['', [Validators.required, Validators.minLength(8)]],
        re_new_password: ['', [Validators.required]],
      },
      { validators: [Validation.match('new_password', 're_new_password')] }
    );
  }
  submit(): void {
    this.submitted = true;
    if (this.form.valid) {
      this.spinner.show();
      this.authService
        .reset_password_confirm(this.form.getRawValue())
        .subscribe({
          next: () => {
            this.message = 'Thay đổi mật khẩu thành công!';
            this.spinner.hide();
          },
          error: (e) => {
            this, this.spinner.hide();
            this.toast.error({
              detail: 'ERROR',
              summary:
                'Thay đổi mật khẩu thất bại!(Gợi ý: đổi mật khẩu khác mạnh hơn)',
              duration: 3000,
            });
          },
        });
    }
  }
}
