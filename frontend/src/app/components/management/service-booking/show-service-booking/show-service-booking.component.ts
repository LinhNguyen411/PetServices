import { Component, OnInit, inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { NgToastService } from 'ng-angular-popup';

import { ServiceBooking } from '../../../../models/service-booking.model';
import { Router } from '@angular/router';
import { UserService } from '../../../../services/user.service';

import { ServiceBookingService } from '../../../../services/service-booking.service';
@Component({
  selector: 'app-show-service-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './show-service-booking.component.html',
  styleUrl: './show-service-booking.component.css',
})
export class ShowServiceBookingComponent {
  statusList: any = [
    { short: 'a', long: 'Chấp nhận' },
    {
      short: 'e',
      long: 'Hủy',
    },
    {
      short: 'c',
      long: 'Hoàn Thành',
    },
    {
      short: 'p',
      long: 'Đang tiến hành',
    },
    {
      short: 'u',
      long: 'Chưa chấp nhận',
    },
  ];
  private router = inject(Router);
  private toast = inject(NgToastService);
  private observer = inject(BreakpointObserver);
  private dataService = inject(ServiceBookingService);
  componentName = 'Dịch vụ đã đặt';

  isMobile: boolean = true;

  statusValue?: string = '';
  orderValue: string = 'date_booked';
  isOrderDate: boolean = false;

  searchValue: string = '';
  id?: string;

  current_page: number = 1;
  page_size: number = 10;
  max_page: number = 0;
  count: number = 0;
  next?: any;
  previous?: any;

  dataList?: ServiceBooking[];

  user?: any;
  userData?: any;
  userService = inject(UserService);
  customerValue: string = '';

  constructor() {}
  ngOnInit(): void {
    this.observer.observe(['(max-width: 800px)']).subscribe((screenSize) => {
      if (screenSize.matches) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
    this.userService.user$.subscribe((user) => {
      this.user = user;
    });
    this.userService.userData$.subscribe((data) => {
      this.userData = data;
      if (data) {
        if (this.user.account_type == 'c') {
          this.customerValue = this.userData.id;
          this.refresh();
        } else {
          this.refresh();
        }
      }
    });
  }
  refresh(): void {
    console.log(this.statusValue);
    this.dataService
      .getAll({
        search_value: this.searchValue,
        ordering_value: this.orderValue,
        pagi_number: this.current_page,
        status: this.statusValue,
        customer_value: this.customerValue,
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
    this.current_page = value;
    this.refresh();
  }
  sortClick(value: string) {
    if (value == 'date') {
      this.orderValue = (this.isOrderDate ? '-' : '') + 'date_booked';
      this.isOrderDate = !this.isOrderDate;
    }

    this.refresh();
  }

  showDetailClick(item: any): void {
    this.router.navigate([
      '/',
      'management',
      'service-booking',
      'detail',
      item.id,
    ]);
  }
  triggerDelete(item: any): void {
    this.id = item.id;
  }

  deleteClick(): void {
    if (this.id) {
      this.dataService.delete(this.id).subscribe({
        next: (res) => {
          this.count -= 1;
          this.max_page = Math.ceil(this.count / this.page_size);
          if (this.current_page > this.max_page) {
            this.current_page = this.max_page;
          }
          this.paginationClick(this.current_page);
          this.toast.success({
            detail: 'Thành công',
            summary: 'Xóa thành công',
            duration: 3000,
          });
        },
        error: (err) => {
          this.toast.error({
            detail: 'Thất bại',
            summary: 'Xóa thất bại',
            duration: 3000,
          });
        },
      });
    }
  }
}
