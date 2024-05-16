import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password-confirm',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './reset-password-confirm.component.html',
  styleUrl: './reset-password-confirm.component.css',
})
export class ResetPasswordConfirmComponent implements OnInit {
  form!: FormGroup;
  message?: string;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private activateRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      uid: this.activateRoute.snapshot.paramMap.get('uid'),
      token: this.activateRoute.snapshot.paramMap.get('token'),
      new_password: '',
      re_new_password: '',
    });
  }
  submit(): void {
    this.authService
      .reset_password_confirm(this.form.getRawValue())
      .subscribe(() => {
        this.message = 'Reset password successfully!';
      });
  }
}
