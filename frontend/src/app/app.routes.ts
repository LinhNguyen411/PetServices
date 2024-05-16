import { Routes } from '@angular/router';
import { ProfileComponent } from './components/auth/profile/profile.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { ResetPasswordConfirmComponent } from './components/auth/reset-password-confirm/reset-password-confirm.component';
import { ActivateComponent } from './components/auth/activate/activate.component';

import { HomeComponent } from './components/home/home.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  {
    path: 'password/reset/confirm/:uid/:token',
    component: ResetPasswordConfirmComponent,
  },
  { path: 'activate/:uid/:token', component: ActivateComponent },
];
