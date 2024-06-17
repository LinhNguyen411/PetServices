import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastServiceService } from '../../../../services/toast-service.service';
import { NgxSpinnerService } from 'ngx-spinner';

import { AddEditRoomComponent } from '../add-edit-room/add-edit-room.component';
import { RoomService } from '../../../../services/room.service';
import { Room } from '../../../../models/room.model';

@Component({
  selector: 'app-show-room',
  standalone: true,
  imports: [FormsModule, CommonModule, AddEditRoomComponent],
  templateUrl: './show-room.component.html',
  styleUrl: './show-room.component.css',
})
export class ShowRoomComponent implements OnInit {
  private spinner = inject(NgxSpinnerService);
  private toast = inject(ToastServiceService);
  private dataService = inject(RoomService);

  current_page: number = 1;
  page_size: number = 10;
  max_page: number = 0;
  count: number = 0;
  next?: any;
  previous?: any;

  dataList?: Room[];
  ModalTitle?: string;
  data: Room = {
    id: '',
    name: '',
    is_booked: false,
    price: 0,
  };

  constructor() {}
  ngOnInit(): void {
    this.refresh();
  }
  refresh(): void {
    this.dataService.getAll({ pagi_number: this.current_page }).subscribe({
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
    this.refresh();
  }

  addClick(): void {
    this.data = {
      id: '',
      name: '',
      is_booked: false,
      price: 0,
    };
    this.ModalTitle = 'Thêm chuồng';
  }

  editClick(item: Room): void {
    this.data = {
      id: item.id,
      name: item.name,
      is_booked: item.is_booked,
      price: item.price,
    };
    this.ModalTitle = 'Cập nhật chuồng';
  }

  triggerDelete(item: Room): void {
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
