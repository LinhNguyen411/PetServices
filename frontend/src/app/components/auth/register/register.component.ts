import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import Validation from '../../../untils/validation';
import { CustomerService } from '../../../services/customer.service';
import { Account } from '../../../models/account.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  message?: string;
  submitted?: boolean;
  isSame?: boolean;
  form!: FormGroup;
  isImage?: boolean;
  isUser?: boolean;
  url?: string;
  @ViewChild('fileInput') fileInput: any;

  constructor(
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toast: NgToastService
  ) {}
  ngOnInit(): void {
    this.url = '../assets/no-img.jpg';

    this.isImage = false;
    this.isUser = false;

    this.isSame = false;
    this.submitted = false;

    this.form = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        name: ['', [Validators.required, Validators.minLength(4)]],
        account_type: 'c',
        password: ['', [Validators.required, Validators.minLength(8)]],
        re_password: ['', [Validators.required]],
        photo: '',
      },
      { validators: [Validation.match('password', 're_password')] }
    );
  }

  register(): void {
    this.submitted = true;
    if (
      this.form.get('password')?.value === this.form.get('re_password')?.value
    ) {
      this.isSame = true;
    } else {
      this.isSame = false;
    }
    if (this.form.valid) {
      this.toggleImage();
    }
  }
  userConfirm(): void {
    if (this.form.valid) {
      this.spinner.show();
      var data = new FormData();
      data.append('email', this.form.controls.email.value);
      data.append('name', this.form.controls.name.value);
      data.append('account_type', this.form.controls.account_type.value);
      data.append('password', this.form.controls.password.value);
      data.append('re_password', this.form.controls.re_password.value);
      if (this.fileInput.nativeElement.files[0]) {
        console.log('have file');
        data.append('photo', this.fileInput.nativeElement.files[0]);
      }
      this.authService.register(data).subscribe({
        next: (res: Account) => {
          this.message =
            'Chúng tôi đã gửi một email kích hoạt tài khoản đến bạn.';
          this.spinner.hide();
          this.toast.success({
            detail: 'Thành công',
            summary: 'Đăng ký thành công',
            duration: 3000,
          });
        },
        error: (e) => {
          this.toast.error({
            detail: 'Thất bại',
            summary: 'Đăng ký thất bại, hãy thử email hoặc mật khẩu khác',
            duration: 3000,
          });
          this.spinner.hide();
        },
      });
      this.toggleImage();
    }
  }
  toggleImage() {
    this.isImage = !this.isImage;
  }
  onSelectFile(e: any): void {
    if (e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.url = event.target.result;
      };
    }
  }
}
