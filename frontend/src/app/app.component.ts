import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from './services/auth.service';
import { AuthEmitter } from './emitters/auth.emmiter';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  authService = inject(AuthService);

  title = 'PetCares';
  isLoggedIn?: boolean;
  constructor() {}
  ngOnInit(): void {
    AuthEmitter.isLoggedIn.emit(this.authService.isLoggedIn());
    AuthEmitter.isLoggedIn.subscribe((auth: boolean) => {
      this.isLoggedIn = auth;
    });
  }
  logout() {
    this.authService.logout();
  }
}
