import { Component } from '@angular/core';
import { ShowProductBillComponent } from './show-product-bill/show-product-bill.component';

@Component({
  selector: 'app-product-bill',
  standalone: true,
  imports: [ShowProductBillComponent],
  templateUrl: './product-bill.component.html',
  styleUrl: './product-bill.component.css',
})
export class ProductBillComponent {}
