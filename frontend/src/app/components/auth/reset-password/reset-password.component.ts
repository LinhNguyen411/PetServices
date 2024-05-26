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
      this.authService.reset_password(this.form.getRawValue()).subscribe({
        next: (res) => {
          this.message = 'Please check your email to reset password';
        },
        error: (e) => {
          console.log(e.error);
          this.toast.error({
            detail: 'ERROR',
            summary: 'Account not found',
            duration: 3000,
          });
        },
      });
    }
  }
}
