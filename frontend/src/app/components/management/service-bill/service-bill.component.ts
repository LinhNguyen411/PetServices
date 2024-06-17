import { Component } from '@angular/core';
import { ShowServiceBillComponent } from './show-service-bill/show-service-bill.component';
@Component({
  selector: 'app-service-bill',
  standalone: true,
  imports: [ShowServiceBillComponent],
  templateUrl: './service-bill.component.html',
  styleUrl: './service-bill.component.css',
})
export class ServiceBillComponent {}
