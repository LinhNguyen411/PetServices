import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  submitted?: boolean;
  form!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toast: NgToastService
  ) {}
  ngOnInit(): void {
    this.submitted = false;
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }
  login(): void {
    this.submitted = true;
    if (this.form.valid) {
      this.authService.login(this.form.getRawValue()).subscribe({
        next: (res) => {
          this.toast.success({
            detail: 'SUCCESS',
            summary: 'Login Successfully!',
            duration: 3000,
          });
          this.router.navigate(['/', 'management', 'profile']);
        },
        error: (e) => {
          console.log(e.error);
          this.toast.error({
            detail: 'ERROR',
            summary:
              e.error.detail !== undefined
                ? 'Password Wrong!'
                : 'Missing value',
            duration: 3000,
          });
        },
      });
    }
  }
}
