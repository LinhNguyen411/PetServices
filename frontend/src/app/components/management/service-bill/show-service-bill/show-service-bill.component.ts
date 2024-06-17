import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr, 'fr');

import { Component, OnInit, inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgToastService } from 'ng-angular-popup';

import { DetailServiceBillComponent } from '../detail-service-bill/detail-service-bill.component';
import { ServiceBill } from '../../../../models/service-bill.model';
import { ServiceBillService } from '../../../../services/service-bill.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastServiceService } from '../../../../services/toast-service.service';

@Component({
  selector: 'app-show-service-bill',
  standalone: true,
  imports: [CommonModule, FormsModule, DetailServiceBillComponent],
  templateUrl: './show-service-bill.component.html',
  styleUrl: './show-service-bill.component.css',
})
export class ShowServiceBillComponent implements OnInit {
  private spinner = inject(NgxSpinnerService);
  private toast = inject(ToastServiceService);
  private observer = inject(BreakpointObserver);
  private dataService = inject(ServiceBillService);
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

  dataList?: ServiceBill[];
  data: ServiceBill = {
    id: '',
    date_created: '',
    booking: '',
    employee: '',
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
    this.dataService
      .getAll({
        search_value: this.searchValue,
        pagi_number: this.current_page,
        ordering_value: this.orderValue,
      })
      .subscribe({
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

    this.refresh();
  }
  paginationClick(value: number) {
    if (value == 0) value = 1;

    this.current_page = value;

    this.refresh();
  }
  sortClick(value: string) {
    if (value == 'date') {
      this.orderValue = (this.isOrderDate ? '-' : '') + 'date_created';
      this.isOrderDate = !this.isOrderDate;
    }

    this.refresh();
  }

  showDetailClick(item: any): void {
    this.data = {
      id: item.id,
      date_created: item.date_created,
      employee: item.employee,
      booking: item.booking,
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
