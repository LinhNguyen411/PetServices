import { Component, OnInit } from '@angular/core';
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
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.isSame = false;
    this.submitted = false;
    this.form = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        name: ['', [Validators.required, Validators.minLength(4)]],
        account_type: 'c',
        password: ['', [Validators.required, Validators.minLength(8)]],
        re_password: ['', [Validators.required]],
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
      this.authService.register(this.form.getRawValue()).subscribe((res) => {
        this.message =
          'Account created successfully! Check email to activate your account.';
      });
    }
  }
}
