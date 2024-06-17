import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-activate',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './activate.component.html',
  styleUrl: './activate.component.css',
})
export class ActivateComponent implements OnInit {
  private spinner = inject(NgxSpinnerService);
  message?: string;
  authService = inject(AuthService);
  activateRoute = inject(ActivatedRoute);
  router = inject(Router);
  data?: any;
  ngOnInit(): void {
    this.data = {
      uid: this.activateRoute.snapshot.paramMap.get('uid'),
      token: this.activateRoute.snapshot.paramMap.get('token'),
    };
    this.verify();
  }
  verify() {
    this.spinner.show();
    this.authService.verify(this.data).subscribe(() => {
      this.spinner.hide();
      this.message = 'Tài khoản của bạn đã được kích hoạt thành công';
    });
  }
}
