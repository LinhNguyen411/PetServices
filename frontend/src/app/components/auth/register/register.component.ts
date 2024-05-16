import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  message?: string;
  form!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: '',
      name: '',
      account_type: 'c',
      password: '',
      re_password: '',
    });
  }
  register(): void {
    this.authService.register(this.form.getRawValue()).subscribe((res) => {
      this.message =
        'Account created successfully! Check email to activate your account.';
    });
  }
}
