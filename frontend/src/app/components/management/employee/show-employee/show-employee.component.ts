import { Component, OnInit, inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgToastService } from 'ng-angular-popup';

import { AddEditEmployeeComponent } from '../add-edit-employee/add-edit-employee.component';
import { EmployeeService } from '../../../../services/employee.service';
import { Employee } from '../../../../models/employee.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastServiceService } from '../../../../services/toast-service.service';

@Component({
  selector: 'app-show-employee',
  standalone: true,
  imports: [AddEditEmployeeComponent, FormsModule, CommonModule],
  templateUrl: './show-employee.component.html',
  styleUrl: './show-employee.component.css',
})
export class ShowEmployeeComponent implements OnInit {
  showStatus(value?: string): string {
    switch (value) {
      case 'w':
        return 'Làm việc';
      case 'q':
        return 'Nghỉ việc';
      case 'l':
        return 'Tạm nghỉ';
      default:
        return '';
    }
  }
  showRole(value?: string): string {
    switch (value) {
      case 'm':
        return 'Quản lý';
      case 'e':
        return 'Nhân viên';
      case 's':
        return 'Bảo vệ';
      default:
        return '';
    }
  }
  private spinner = inject(NgxSpinnerService);
  private toast = inject(ToastServiceService);
  private observer = inject(BreakpointObserver);
  private dataService = inject(EmployeeService);
  componentName = 'nhân viên';

  isMobile: boolean = true;

  orderValue: string = 'name';
  searchValue: string = '';

  isOrderName: boolean = false;
  isOrderDate: boolean = false;

  current_page: number = 1;
  page_size: number = 10;
  max_page: number = 0;
  count: number = 0;
  next?: any;
  previous?: any;

  dataList?: Employee[];
  ModalTitle?: string;
  data: Employee = {
    id: '',
    name: '',
    role: '',
    date_of_joining: '',
    phone_number: '',
    address: '',
    status: '',
    photo: '',
    account: '',
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
    if (value == 'name') {
      this.orderValue = (this.isOrderName ? '-' : '') + value;
      this.isOrderName = !this.isOrderName;

      this.isOrderDate = false;
    } else if (value == 'date') {
      this.orderValue = (this.isOrderDate ? '' : '-') + 'date_of_joining';
      this.isOrderDate = !this.isOrderDate;

      this.isOrderName = false;
    }

    this.dataService.sort(this.orderValue);

    this.refresh();
  }

  addClick(): void {
    this.data = {
      id: '',
      name: '',
      role: '',
      date_of_joining: '',
      phone_number: '',
      address: '',
      status: '',
      photo: '',
      account: '',
    };
    this.ModalTitle = 'Thêm ' + this.componentName;
  }

  editClick(item: any): void {
    this.data = {
      id: item.id,
      name: item.name,
      role: item.role,
      date_of_joining: item.date_of_joining,
      phone_number: item.phone_number,
      address: item.address,
      status: item.status,
      photo: item.photo,
      account: item.account,
    };
    this.ModalTitle = 'Cập nhật ' + this.componentName;
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
  onSubmitted(submitted: boolean) {
    if (submitted) {
      this.refresh();
      document.getElementById('edit-model-close-btn')?.click();
    }
  }
}
