import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  authService = inject(AuthService);
  user?: any;
  constructor() {}
  ngOnInit(): void {
    this.authService.getCurrentAuthUser().subscribe((res) => {
      this.user = res;
    });
  }
}
