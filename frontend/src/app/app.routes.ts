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
import { CategoryComponent } from './components/management/category/category.component';

import { HomeComponent } from './components/home/home.component';
import { authGuard } from './guards/auth.guard';
import { SupplierComponent } from './components/management/supplier/supplier.component';
import { ProductComponent } from './components/management/product/product.component';
import { EmployeeComponent } from './components/management/employee/employee.component';
import { ProductBillComponent } from './components/management/product-bill/product-bill.component';
import { AddProductBillComponent } from './components/management/product-bill/add-product-bill/add-product-bill.component';
import { ServiceComponent } from './components/management/service/service.component';
import { RoomComponent } from './components/management/room/room.component';
import { AddServiceBookingComponent } from './components/management/service-booking/add-service-booking/add-service-booking.component';
import { DetailServiceBookingComponent } from './components/management/service-booking/detail-service-booking/detail-service-booking.component';
import { ServiceBookingComponent } from './components/management/service-booking/service-booking.component';
import { ShowServiceBookingComponent } from './components/management/service-booking/show-service-booking/show-service-booking.component';
import { ServiceBillComponent } from './components/management/service-bill/service-bill.component';
import { MainPageComponent } from './components/home/main-page/main-page.component';
import { DashboardComponent } from './components/management/dashboard/dashboard.component';
import { ProvideGoodsComponent } from './components/management/provide-goods/provide-goods.component';
import { ServicePackageComponent } from './components/management/service-package/service-package.component';
import { AddConsignmentComponent } from './components/management/consignment/add-consignment/add-consignment.component';
import { ShowConsignmentComponent } from './components/management/consignment/show-consignment/show-consignment.component';
import { DetailConsignmentComponent } from './components/management/consignment/detail-consignment/detail-consignment.component';
import { ConsignmentComponent } from './components/management/consignment/consignment.component';
import { ConsignmentDetailComponent } from './components/management/consignment/consignment-detail/consignment-detail.component';
import { ConsignmentDashboardComponent } from './components/management/consignment-dashboard/consignment-dashboard.component';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: '', component: MainPageComponent },
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
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'consignment-dashboard',
        component: ConsignmentDashboardComponent,
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'profile', component: ProfileComponent },
      { path: 'customer', component: CustomerComponent },

      { path: 'species', component: SpeciesComponent },
      { path: 'pet', component: PetComponent },

      { path: 'category', component: CategoryComponent },
      { path: 'supplier', component: SupplierComponent },
      { path: 'product', component: ProductComponent },

      { path: 'employee', component: EmployeeComponent },

      { path: 'create-bill', component: AddProductBillComponent },
      { path: 'product-bill', component: ProductBillComponent },

      { path: 'service', component: ServiceComponent },

      { path: 'room', component: RoomComponent },

      { path: 'provide-goods', component: ProvideGoodsComponent },
      { path: 'service-package', component: ServicePackageComponent },

      {
        path: 'consignment',
        component: ConsignmentComponent,
        children: [
          { path: 'show', component: ShowConsignmentComponent },
          { path: 'create', component: AddConsignmentComponent },
          { path: 'detail/:id', component: DetailConsignmentComponent },
          {
            path: 'consignment-detail/:id',
            component: ConsignmentDetailComponent,
          },
        ],
      },

      {
        path: 'service-booking',
        component: ServiceBookingComponent,
        children: [
          { path: 'show', component: ShowServiceBookingComponent },
          { path: 'create', component: AddServiceBookingComponent },
          { path: 'detail/:id', component: DetailServiceBookingComponent },
        ],
      },

      { path: 'service-bill', component: ServiceBillComponent },
    ],
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
