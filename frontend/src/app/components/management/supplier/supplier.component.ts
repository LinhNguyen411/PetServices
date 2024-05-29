import { Component } from '@angular/core';

import { ShowSupplierComponent } from './show-supplier/show-supplier.component';
@Component({
  selector: 'app-supplier',
  standalone: true,
  imports: [ShowSupplierComponent],
  templateUrl: './supplier.component.html',
  styleUrl: './supplier.component.css',
})
export class SupplierComponent {}
