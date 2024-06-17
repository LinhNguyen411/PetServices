import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastServiceService } from '../../../../services/toast-service.service';
import { NgxSpinnerService } from 'ngx-spinner';

import { AddEditProvideGoodsComponent } from '../add-edit-provide-goods/add-edit-provide-goods.component';
import { ProvideGoodsService } from '../../../../services/provide-goods.service';
import { ProvideGoods } from '../../../../models/provide-goods.model';

@Component({
  selector: 'app-show-provide-goods',
  standalone: true,
  imports: [FormsModule, CommonModule, AddEditProvideGoodsComponent],
  templateUrl: './show-provide-goods.component.html',
  styleUrl: './show-provide-goods.component.css',
})
export class ShowProvideGoodsComponent implements OnInit {
  private toast = inject(ToastServiceService);
  private spinner = inject(NgxSpinnerService);
  private dataService = inject(ProvideGoodsService);
  componentName = 'dịch vụ, sản phẩm cung cấp';

  isMobile: boolean = true;

  orderValue: string = 'name';
  searchValue: string = '';

  isOrderName: boolean = false;
  isOrderPrice: boolean = false;

  current_page: number = 1;
  page_size: number = 10;
  max_page: number = 0;
  count: number = 0;
  next?: any;
  previous?: any;

  dataList?: ProvideGoods[];
  ModalTitle?: string;
  data: ProvideGoods = {
    id: '',
    name: '',
    price: 0,
  };

  constructor() {}
  ngOnInit(): void {
    this.refresh();
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
    if (value == 'name') {
      this.orderValue = (this.isOrderName ? '-' : '') + value;
      this.isOrderName = !this.isOrderName;
      this.isOrderPrice = false;
    } else if (value == 'price') {
      this.orderValue = (this.isOrderPrice ? '-' : '') + value;
      this.isOrderPrice = !this.isOrderPrice;

      this.isOrderName = false;
    }
    this.refresh();
  }

  addClick(): void {
    this.data = {
      id: '',
      name: '',
      price: 0,
    };
    this.ModalTitle = 'Thêm ' + this.componentName;
  }

  editClick(item: any): void {
    this.data = {
      id: item.id,
      name: item.name,
      price: item.price,
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
          this.spinner.hide();
          this.toast.deleteFail();
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
