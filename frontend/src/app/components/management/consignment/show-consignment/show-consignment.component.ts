import { Component, OnInit, inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { UserService } from '../../../../services/user.service';

import { ConsignmentService } from '../../../../services/consignment.service';
import { Consignment } from '../../../../models/consignment.model';

@Component({
  selector: 'app-show-consignment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './show-consignment.component.html',
  styleUrl: './show-consignment.component.css',
})
export class ShowConsignmentComponent {
  statusList: any = [
    {
      short: 'e',
      long: 'Hủy',
    },
    {
      short: 'u',
      long: 'Chưa thanh toán',
    },
    {
      short: 'p',
      long: 'Thanh toán một phần',
    },
    {
      short: 'a',
      long: 'Thanh toán toàn bộ',
    },
  ];
  getStatus(status?: string): string {
    switch (status) {
      case 'e':
        return 'Hủy';
      case 'u':
        return 'Chưa thanh toán';
      case 'p':
        return 'Thanh toán một phần';
      case 'a':
        return 'Thanh toán toàn bộ';
      default:
        return '';
    }
  }
  private router = inject(Router);
  private toast = inject(NgToastService);
  private observer = inject(BreakpointObserver);
  private dataService = inject(ConsignmentService);
  componentName = 'phiếu ký gửi đã tạo';

  isMobile: boolean = true;

  statusValue?: string = '';
  orderValue: string = 'date_time_create';
  isOrderDate: boolean = false;

  id?: string;

  current_page: number = 1;
  page_size: number = 10;
  max_page: number = 0;
  count: number = 0;
  next?: any;
  previous?: any;

  dataList?: Consignment[];

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
    this.dataService
      .getAll({
        status_value: this.statusValue,
        ordering_value: this.orderValue,
        pagi_number: this.current_page,
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
      this.orderValue = (this.isOrderDate ? '-' : '') + 'date_time_create';
      this.isOrderDate = !this.isOrderDate;
    }

    this.refresh();
  }

  showDetailClick(item: any): void {
    this.router.navigate(['/', 'management', 'consignment', 'detail', item.id]);
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
