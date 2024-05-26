import { Routes } from '@angular/router';
import { ProfileComponent } from './components/auth/profile/profile.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { ResetPasswordConfirmComponent } from './components/auth/reset-password-confirm/reset-password-confirm.component';
import { ActivateComponent } from './components/auth/activate/activate.component';

// management
import { ManagementComponent } from './components/management/management.component';
import { SpeciesComponent } from './components/management/species/species.component';
import { PetComponent } from './components/management/pet/pet.component';
import { CustomerComponent } from './components/management/customer/customer.component';
import { WeightComponent } from './components/management/weight/weight.component';

import { HomeComponent } from './components/home/home.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
      {
        path: 'password/reset/confirm/:uid/:token',
        component: ResetPasswordConfirmComponent,
      },
      { path: 'activate/:uid/:token', component: ActivateComponent },
    ],
  },
  {
    path: 'management',
    component: ManagementComponent,
    canActivate: [authGuard],
    children: [
      { path: 'profile', component: ProfileComponent },
      { path: 'species', component: SpeciesComponent },
      { path: 'weight', component: WeightComponent },
      { path: 'pet', component: PetComponent },
      { path: 'customer', component: CustomerComponent },
    ],
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
