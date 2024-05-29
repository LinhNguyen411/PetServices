import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
  Validators,
} from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';

import { NgToastService } from 'ng-angular-popup';
import { CommonModule } from '@angular/common';

import { UserService } from '../../../../services/user.service';

import { CustomerService } from '../../../../services/customer.service';

import { Product } from '../../../../models/product.model';
import { ProductService } from '../../../../services/product.service';

import { ProductBillItem } from '../../../../models/product-bill-item.model';
import { ProductBillService } from '../../../../services/product-bill.service';
import { Router } from '@angular/router';

import { ShowDetailProductBillComponent } from '../show-detail-product-bill/show-detail-product-bill.component';
import { ProductBill } from '../../../../models/product-bill.model';

@Component({
  selector: 'app-add-product-bill',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    ShowDetailProductBillComponent,
  ],
  templateUrl: './add-product-bill.component.html',
  styleUrl: './add-product-bill.component.css',
})
export class AddProductBillComponent implements OnInit {
  userData?: any;
  userService = inject(UserService);

  private observer = inject(BreakpointObserver);
  isMobile: boolean = true;

  private router = inject(Router);
  private customerService = inject(CustomerService);
  private productService = inject(ProductService);
  private billService = inject(ProductBillService);
  private toast = inject(NgToastService);
  private formBuilder = inject(FormBuilder);
  grandTotal: number = 0;

  isCreatedBill?: boolean;
  customer?: any;
  submitted?: boolean;
  subSubmitted?: boolean;
  grand_total?: number;
  dataForm: FormGroup = this.formBuilder.group({
    employee: '',
    customer: ['', Validators.required],
    payment_method: 'off',
  });
  data?: ProductBill;
  itemList: ProductBillItem[] = [];

  subDataForm: FormGroup = this.formBuilder.group({
    id: ['', Validators.required],
    quantity: [0, Validators.min(1)],
    price: [0, Validators.min(1)],
    name: ['', Validators.required],
  });

  constructor() {}
  ngOnInit(): void {
    this.observer.observe(['(max-width: 800px)']).subscribe((screenSize) => {
      if (screenSize.matches) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
    this.userService.userData$.subscribe((res) => {
      this.userData = res;
    });
    this.userService.userData$.subscribe((userData) => {
      if (userData) {
        this.dataForm.patchValue({
          employee: userData.id,
        });
      }
    });
    this.refresh();
  }
  refresh(): void {
    this.isCreatedBill = false;
    this.customer = null;
    this.submitted = false;
    this.subSubmitted = false;
    this.grandTotal = 0;
    this.itemList = [];
    this.dataForm.controls.customer.setValue('');
    this.dataForm.controls.payment_method.setValue('off');
  }
  calculateTotal() {
    this.grandTotal = 0;
    this.itemList.forEach((item) => {
      if (item.quantity) this.grandTotal += item.product.price * item.quantity;
    });
  }
  searchCustomer() {
    if (this.dataForm.get('customer')?.value) {
      this.customerService
        .searchByValue(this.dataForm.get('customer')?.value)
        .subscribe((res) => {
          if (res.results[0]) {
            this.customer = res.results[0];
          } else {
            this.customer = '';
          }
          this.dataForm.controls.customer.setValue(this.customer.id);
        });
    }
  }
  searchProduct() {
    console.log('hello');
    if (this.subDataForm.get('id')?.value) {
      this.productService.get(this.subDataForm.get('id')?.value).subscribe({
        next: (res) => {
          this.subDataForm.controls.name.setValue(res.name);
          this.subDataForm.controls.price.setValue(res.price);
        },
        error: (e) => {
          this.subDataForm.controls.name.setValue('');
          this.subDataForm.controls.price.setValue(0);
        },
      });
    }
  }
  addItem() {
    this.subSubmitted = true;
    if (this.subDataForm.valid) {
      var new_item: ProductBillItem = {
        id: '',
        product: {
          id: this.subDataForm.get('id')?.value,
          name: this.subDataForm.get('name')?.value,
          price: this.subDataForm.get('price')?.value,
        },
        quantity: this.subDataForm.get('quantity')?.value,
        sub_total: 0,
      };
      this.subSubmitted = false;
      this.subDataForm.controls.id.setValue('');
      this.subDataForm.controls.quantity.setValue(0);
      this.itemList?.push(new_item);
      document.getElementById('edit-model-close-btn')?.click();
      this.calculateTotal();
    }
  }
  changeQuantity(item: any, ope: string) {
    if (ope == 'minus') {
      if (item.quantity > 1) {
        item.quantity -= 1;
      }
    } else if (ope == 'plus') {
      item.quantity += 1;
    }
    this.calculateTotal();
  }
  deleteClick(item: any) {
    this.itemList = this.itemList.filter((obj) => {
      return obj !== item;
    });
  }
  onSubmit(): void {
    this.submitted = true;
    if (this.itemList.length == 0) {
      this.toast.error({
        detail: 'FAILED',
        summary: 'Please add more item',
        duration: 3000,
      });
    }
    if (this.dataForm.valid && this.itemList.length > 0) {
      var data = {
        employee: this.dataForm.get('employee')?.value,
        customer: this.dataForm.get('customer')?.value,
        payment_method: this.dataForm.get('payment_method')?.value,
      };
      this.billService.create(data, this.itemList).subscribe({
        next: (res) => {
          this.data = res;
          this.isCreatedBill = true;
          this.toast.success({
            detail: 'SUCCESS',
            summary: 'Bill Created Successfully',
            duration: 3000,
          });
        },
        error: (e) => {
          this.toast.error({
            detail: 'FAILED',
            summary: 'FAILED TO CREATE BILL',
            duration: 3000,
          });
        },
      });
    }
  }
}
