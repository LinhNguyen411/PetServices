import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr, 'fr');
import { VietnamCurrencyPipe } from '../../../../pipes/vietnam-currency.pipe';
import { NgxPrintModule } from 'ngx-print';

import { ProductBill } from '../../../../models/product-bill.model';
import { ProductBillItem } from '../../../../models/product-bill-item.model';
import { ProductBillService } from '../../../../services/product-bill.service';
import { ProductService } from '../../../../services/product.service';
import { EmployeeService } from '../../../../services/employee.service';
import { CustomerService } from '../../../../services/customer.service';
import { Employee } from '../../../../models/employee.model';
import { Customer } from '../../../../models/customer.model';
@Component({
  selector: 'app-show-detail-product-bill',
  standalone: true,
  imports: [CommonModule, VietnamCurrencyPipe, NgxPrintModule],
  templateUrl: './show-detail-product-bill.component.html',
  styleUrl: './show-detail-product-bill.component.css',
})
export class ShowDetailProductBillComponent {
  dataService = inject(ProductBillService);
  productService = inject(ProductService);
  employeeService = inject(EmployeeService);
  customerService = inject(CustomerService);

  employee?: Employee;
  customer?: Customer;
  bill?: ProductBill;
  billItems?: ProductBillItem[];
  @Input() set data(value: ProductBill) {
    this.bill = value;
    if (value.id) {
      this.dataService.getItems(value.id).subscribe((res) => {
        this.billItems = res;
      });
    }
    this.employeeService.get(value.employee).subscribe((res) => {
      this.employee = res;
    });
    this.customerService.get(value.customer).subscribe((res) => {
      this.customer = res;
    });
  }
}
