import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgToastService } from 'ng-angular-popup';
import { BreakpointObserver } from '@angular/cdk/layout';

import { AddEditSupplierComponent } from '../add-edit-supplier/add-edit-supplier.component';
import { Supplier } from '../../../../models/supplier.model';
import { SupplierService } from '../../../../services/supplier.service';

@Component({
  selector: 'app-show-supplier',
  standalone: true,
  imports: [AddEditSupplierComponent, FormsModule, CommonModule],
  templateUrl: './show-supplier.component.html',
  styleUrl: './show-supplier.component.css',
})
export class ShowSupplierComponent implements OnInit {
  private toast = inject(NgToastService);
  private dataService = inject(SupplierService);
  componentName = 'Supplier';

  private observer = inject(BreakpointObserver);
  isMobile: boolean = true;

  searchValue: string = '';
  orderValue: string = 'name';
  isOrderName: boolean = false;

  current_page: number = 1;
  page_size: number = 10;
  max_page: number = 0;
  count: number = 0;
  next?: any;
  previous?: any;

  dataList?: Supplier[];
  ModalTitle?: string;
  data: Supplier = {
    id: '',
    name: '',
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
  paginationClick(value: number) {
    this.current_page = value;
    this.dataService.pagination(value);
    this.refresh();
  }

  searchClick(): void {
    this.current_page = 1;

    this.dataService.pagination(this.current_page);
    this.dataService.search(this.searchValue);

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
      email: '',
      phone_number: '',
    };
    this.ModalTitle = 'Add ' + this.componentName;
  }

  editClick(item: any): void {
    this.data = {
      id: item.id,
      name: item.name,
      address: item.address,
      email: item.email,
      phone_number: item.phone_number,
    };
    this.ModalTitle = 'Edit ' + +this.componentName;
  }

  triggerDelete(item: any): void {
    this.data.id = item.id;
  }

  deleteClick(): void {
    if (this.data.id) {
      this.dataService.delete(this.data.id).subscribe({
        next: (res) => {
          this.count -= 1;
          this.max_page = Math.ceil(this.count / this.page_size);
          if (this.current_page > this.max_page) {
            this.current_page = this.max_page;
          }
          this.paginationClick(this.current_page);
          this.toast.success({
            detail: 'SUCCESS',
            summary: 'Delete Item Successfully',
            duration: 3000,
          });
        },
        error: (err) => {
          this.toast.error({
            detail: 'FAILED',
            summary: 'FAILED TO DELETE',
            duration: 3000,
          });
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
