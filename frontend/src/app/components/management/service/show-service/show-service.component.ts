import { Component, OnInit, inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastServiceService } from '../../../../services/toast-service.service';

import { AddEditServiceComponent } from '../add-edit-service/add-edit-service.component';
import { Service } from '../../../../models/service.model';
import { ServiceService } from '../../../../services/service.service';

import { Species } from '../../../../models/species.model';
import { SpeciesService } from '../../../../services/species.service';

@Component({
  selector: 'app-show-service',
  standalone: true,
  imports: [AddEditServiceComponent, FormsModule, CommonModule],
  templateUrl: './show-service.component.html',
  styleUrl: './show-service.component.css',
})
export class ShowServiceComponent implements OnInit {
  private toast = inject(ToastServiceService);
  private spinner = inject(NgxSpinnerService);
  private observer = inject(BreakpointObserver);
  private dataService = inject(ServiceService);
  componentName = 'dịch vụ';

  isMobile: boolean = true;

  orderValue: string = 'name';
  searchValue: string = '';

  isOrderName: boolean = false;
  isOrderPrice: boolean = false;

  speciesValue: string = '';

  current_page: number = 1;
  page_size: number = 10;
  max_page: number = 0;
  count: number = 0;
  next?: any;
  previous?: any;

  private speciesService = inject(SpeciesService);
  speciesList?: Species[];

  dataList?: Service[];
  ModalTitle?: string;
  data: Service = {
    id: '',
    name: '',
    description: '',
    species: '',
    price: 0,
    is_one_day: true,
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
    this.speciesService.getAll().subscribe((res) => {
      this.speciesList = res.results;
    });
  }
  refresh(): void {
    this.dataService
      .getAll({
        search_value: this.searchValue,
        pagi_number: this.current_page,
        species_value: this.speciesValue,
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
      description: '',
      species: '',
      price: 0,
      is_one_day: true,
    };
    this.ModalTitle = 'Thêm ' + this.componentName;
  }

  editClick(item: any): void {
    this.data = {
      id: item.id,
      name: item.name,
      description: item.description,
      species: item.species.id,
      price: item.price,
      is_one_day: item.is_one_day,
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
