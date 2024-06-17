import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  userService = inject(UserService);
  authService = inject(AuthService);

  router = inject(Router);
  user?: any;
  ngOnInit(): void {
    this.userService.user$.subscribe((user) => {
      this.user = user;
    });
  }
  scrollTo(element: any): void {
    (document.getElementById(element) as HTMLElement).scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/', 'home', 'login']);
  }
}
