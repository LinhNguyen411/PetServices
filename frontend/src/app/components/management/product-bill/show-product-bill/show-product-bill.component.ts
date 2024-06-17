import { Component, OnInit, inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ShowDetailProductBillComponent } from '../show-detail-product-bill/show-detail-product-bill.component';
import { ProductBill } from '../../../../models/product-bill.model';
import { ProductBillService } from '../../../../services/product-bill.service';
import { NgToastService } from 'ng-angular-popup';
import { ToastServiceService } from '../../../../services/toast-service.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-show-product-bill',
  standalone: true,
  imports: [ShowDetailProductBillComponent, FormsModule, CommonModule],
  templateUrl: './show-product-bill.component.html',
  styleUrl: './show-product-bill.component.css',
})
export class ShowProductBillComponent implements OnInit {
  private spinner = inject(NgxSpinnerService);
  private toast = inject(ToastServiceService);
  private observer = inject(BreakpointObserver);
  private dataService = inject(ProductBillService);
  componentName = 'hóa đơn dịch vụ';

  isMobile: boolean = true;

  orderValue: string = 'date_created';
  isOrderDate: boolean = false;

  searchValue: string = '';

  current_page: number = 1;
  page_size: number = 10;
  max_page: number = 0;
  count: number = 0;
  next?: any;
  previous?: any;

  dataList?: ProductBill[];
  data: ProductBill = {
    id: '',
    date_created: '',
    employee: '',
    customer: '',
    payment_method: '',
    total: 0,
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
    if (value == 0) value = 1;

    this.current_page = value;

    this.dataService.pagination(value);

    this.refresh();
  }
  sortClick(value: string) {
    if (value == 'date') {
      this.orderValue = (this.isOrderDate ? '-' : '') + 'date_created';
      this.isOrderDate = !this.isOrderDate;
    }

    this.dataService.sort(this.orderValue);

    this.refresh();
  }

  showDetailClick(item: any): void {
    this.data = {
      id: item.id,
      date_created: item.date_created,
      employee: item.employee,
      customer: item.customer,
      payment_method: item.payment_method,
      total: item.total,
    };
  }
  triggerDelete(item: any): void {
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
}
