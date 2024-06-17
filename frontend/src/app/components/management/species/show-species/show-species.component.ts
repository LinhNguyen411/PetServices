import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgToastService } from 'ng-angular-popup';

import { AddEditSpeciesComponent } from '../add-edit-species/add-edit-species.component';
import { Species } from '../../../../models/species.model';
import { SpeciesService } from '../../../../services/species.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastServiceService } from '../../../../services/toast-service.service';
@Component({
  selector: 'app-show-species',
  standalone: true,
  imports: [AddEditSpeciesComponent, FormsModule, CommonModule],
  templateUrl: './show-species.component.html',
  styleUrl: './show-species.component.css',
})
export class ShowSpeciesComponent implements OnInit {
  private spinner = inject(NgxSpinnerService);
  private toast = inject(ToastServiceService);
  private speciesService = inject(SpeciesService);

  searchValue: string = '';
  orderValue: string = 'name';
  isOrderName: boolean = false;

  current_page: number = 1;
  page_size: number = 10;
  max_page: number = 0;
  count: number = 0;
  next?: any;
  previous?: any;

  species?: Species[];
  ModalTitle?: string;
  spe: Species = {
    id: '',
    name: '',
  };

  constructor() {}
  ngOnInit(): void {
    this.refresh();
  }
  refresh(): void {
    this.speciesService.getAll().subscribe({
      next: (data) => {
        this.count = data.count;
        this.max_page = Math.ceil(this.count / this.page_size);
        this.next = data.next;
        this.previous = data.previous;

        this.species = data.results;
      },
      error: (e) => console.log(e),
    });
  }
  paginationClick(value: number) {
    if (value == 0) value = 1;
    this.current_page = value;
    this.speciesService.pagination(value);
    this.refresh();
  }
  sortClick(value: string) {
    if (value == 'name') {
      this.orderValue = (this.isOrderName ? '-' : '') + value;
      this.isOrderName = !this.isOrderName;
    }
    this.speciesService.sort(this.orderValue);
    this.refresh();
  }

  addClick(): void {
    this.spe = {
      id: '',
      name: '',
    };
    this.ModalTitle = 'Thêm loài';
  }

  editClick(item: Species): void {
    this.spe = {
      id: item.id,
      name: item.name,
    };
    this.ModalTitle = 'Cập nhật loài';
  }

  triggerDelete(item: Species): void {
    this.spe.id = item.id;
  }

  deleteClick(): void {
    if (this.spe.id) {
      this.spinner.show();
      this.speciesService.delete(this.spe.id).subscribe({
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
