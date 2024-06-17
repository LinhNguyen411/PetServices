import { Component, OnInit, inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgToastService } from 'ng-angular-popup';

import { AddEditCustomerComponent } from '../add-edit-customer/add-edit-customer.component';
import { Customer } from '../../../../models/customer.model';
import { CustomerService } from '../../../../services/customer.service';
import { ToastServiceService } from '../../../../services/toast-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-show-customer',
  standalone: true,
  imports: [AddEditCustomerComponent, FormsModule, CommonModule],
  templateUrl: './show-customer.component.html',
  styleUrl: './show-customer.component.css',
})
export class ShowCustomerComponent implements OnInit {
  private toast = inject(ToastServiceService);
  private spinner = inject(NgxSpinnerService);
  private observer = inject(BreakpointObserver);
  private dataService = inject(CustomerService);

  isMobile: boolean = true;

  orderValue: string = 'name';
  searchValue: string = '';
  isOrderName: boolean = false;

  current_page: number = 1;
  page_size: number = 10;
  max_page: number = 0;
  count: number = 0;
  next?: any;
  previous?: any;

  dataList?: Customer[];
  ModalTitle?: string;
  data: Customer = {
    id: '',
    name: '',
    address: '',
    phone_number: '',
    account: null,
  };

  constructor() {}
  ngOnInit(): void {
    this.refresh();
    this.observer.observe(['(max-width: 800px)']).subscribe((screenSize) => {
      if (screenSize.matches) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
  }
  refresh(): void {
    this.dataService.getAll().subscribe({
      next: (data) => {
        this.count = data.count;
        this.max_page = Math.ceil(this.count / this.page_size);
        this.next = data.next;
        this.previous = data.previous;

        this.dataList = data.results;
      },
      error: (e) => console.log(e),
    });
  }
  searchClick(): void {
    this.current_page = 1;

    this.dataService.pagination(this.current_page);
    this.dataService.search(this.searchValue);

    this.refresh();
  }
  paginationClick(value: number) {
    this.current_page = value;
    if (value == 0) this.current_page = 1;

    this.dataService.pagination(value);

    this.refresh();
  }
  sortClick(value: string) {
    if (value == 'name') {
      this.orderValue = (this.isOrderName ? '-' : '') + value;
      this.isOrderName = !this.isOrderName;
    }

    this.dataService.sort(this.orderValue);

    this.refresh();
  }

  addClick(): void {
    this.data = {
      id: '',
      name: '',
      address: '',
      phone_number: '',
      account: null,
    };
    this.ModalTitle = 'Thêm khách hàng';
  }

  editClick(item: Customer): void {
    this.data = {
      id: item.id,
      name: item.name,
      address: item.address,
      phone_number: item.phone_number,
      account: item.account,
    };
    this.ModalTitle = 'Cập nhật khách hàng';
  }
  triggerDelete(item: Customer): void {
    this.data.id = item.id;
  }

  deleteClick(): void {
    if (this.data.id) {
      this.spinner.show();
      this.dataService.delete(this.data.id).subscribe({
        next: (res) => {
          this.count -= 1;
          this.max_page = Math.ceil(this.count / this.page_size);
          if (this.current_page > this.max_page) {
            this.current_page = this.max_page;
          }
          this.paginationClick(this.current_page);
          this.toast.deleteSuccess();
          this.spinner.hide();
        },
        error: (err) => {
          this.toast.deleteFail();
          this.spinner.hide();
        },
      });
    }
  }
  onSubmitted(submitted: boolean) {
    if (submitted) {
      this.refresh();
      document.getElementById('edit-model-close-btn')?.click();
    }
  }
}
