import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-activate',
  standalone: true,
  imports: [],
  templateUrl: './activate.component.html',
  styleUrl: './activate.component.css',
})
export class ActivateComponent implements OnInit {
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
    this.authService.verify(this.data).subscribe(() => {
      alert('Your account verify successfully!');
      this.router.navigate(['/', 'login']);
    });
  }
}
