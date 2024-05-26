import { Component } from '@angular/core';
import { ShowCustomerComponent } from './show-customer/show-customer.component';
@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [ShowCustomerComponent],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css',
})
export class CustomerComponent {}
