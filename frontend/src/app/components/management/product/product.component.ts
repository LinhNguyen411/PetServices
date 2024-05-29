import { Component } from '@angular/core';
import { ShowProductComponent } from './show-product/show-product.component';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [ShowProductComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent {}
