import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AddEditCategoryComponent } from '../add-edit-category/add-edit-category.component';
import { Category } from '../../../../models/category.model';
import { CategoryService } from '../../../../services/category.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastServiceService } from '../../../../services/toast-service.service';

@Component({
  selector: 'app-show-category',
  standalone: true,
  imports: [AddEditCategoryComponent, FormsModule, CommonModule],
  templateUrl: './show-category.component.html',
  styleUrl: './show-category.component.css',
})
export class ShowCategoryComponent implements OnInit {
  private toast = inject(ToastServiceService);
  private dataService = inject(CategoryService);
  private spinner = inject(NgxSpinnerService);
  componentName = 'loại sản phẩm';

  searchValue: string = '';
  orderValue: string = 'name';
  isOrderName: boolean = false;

  current_page: number = 1;
  page_size: number = 10;
  max_page: number = 0;
  count: number = 0;
  next?: any;
  previous?: any;

  dataList?: Category[];
  ModalTitle?: string;
  data: Category = {
    id: '',
    name: '',
  };

  constructor() {}
  ngOnInit(): void {
    this.refresh();
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
    if (value == 0) value = 1;
    this.current_page = value;
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
    };
    this.ModalTitle = 'Thêm ' + this.componentName;
  }

  editClick(item: any): void {
    this.data = {
      id: item.id,
      name: item.name,
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
