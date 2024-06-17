import { Component, OnInit, inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgToastService } from 'ng-angular-popup';
import { NgxSpinnerService } from 'ngx-spinner';

import { AddEditPetComponent } from '../add-edit-pet/add-edit-pet.component';
import { Pet } from '../../../../models/pet.model';
import { PetService } from '../../../../services/pet.service';
import { Species } from '../../../../models/species.model';
import { SpeciesService } from '../../../../services/species.service';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-show-pet',
  standalone: true,
  imports: [AddEditPetComponent, FormsModule, CommonModule],
  templateUrl: './show-pet.component.html',
  styleUrl: './show-pet.component.css',
})
export class ShowPetComponent implements OnInit {
  private spinner = inject(NgxSpinnerService);
  private toast = inject(NgToastService);
  private observer = inject(BreakpointObserver);
  private dataService = inject(PetService);

  isMobile: boolean = true;

  orderValue: string = 'name';
  searchValue: string = '';
  isOrderName: boolean = false;
  isOrderAge: boolean = false;
  speciesValue: string = '';

  current_page: number = 1;
  page_size: number = 10;
  max_page: number = 0;
  count: number = 0;
  next?: any;
  previous?: any;

  private speciesService = inject(SpeciesService);
  speciesList?: Species[];

  dataList?: Pet[];
  ModalTitle?: string;
  data: Pet = {
    id: '',
    name: '',
    age: 0,
    gender: false,
    owner: '',
    species: '',
    weight: 0,
    photo: '',
  };

  user?: any;
  userData?: any;
  userService = inject(UserService);
  ownerValue: string = '';

  constructor() {}
  ngOnInit(): void {
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

    this.userService.user$.subscribe((user) => {
      this.user = user;
    });
    this.userService.userData$.subscribe((data) => {
      this.userData = data;
      if (data && this.user) {
        if (this.user.account_type == 'c') {
          this.ownerValue = this.userData.id;
        }
      }
      this.refresh();
    });
  }
  refresh(): void {
    this.dataService
      .getAll({
        search_value: this.searchValue,
        pagi_number: this.current_page,
        ordering_value: this.orderValue,
        species_value: this.speciesValue,
        owner_value: this.ownerValue,
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

      this.isOrderAge = false;
    } else if (value == 'age') {
      this.orderValue = (this.isOrderAge ? '-' : '') + value;
      this.isOrderAge = !this.isOrderAge;

      this.isOrderName = false;
    }
    this.refresh();
  }

  addClick(): void {
    this.data = {
      id: '',
      name: '',
      age: 0,
      gender: false,
      owner: this.ownerValue,
      species: '',
      weight: 0,
      photo: '',
    };
    this.ModalTitle = 'Thêm thú cưng';
  }

  editClick(item: any): void {
    console.log(item);
    this.data = {
      id: item.id,
      name: item.name,
      age: item.age,
      gender: item.gender,
      owner: item.owner.id,
      species: item.species.id,
      weight: item.weight,
      photo: item.photo,
    };
    this.ModalTitle = 'Cập nhật thú cưng';
  }
  triggerDelete(item: any): void {
    this.data.id = item.id;
  }

  deleteClick(): void {
    this.spinner.show();
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
            detail: 'Thành công',
            summary: 'Xóa thú cưng thành công',
            duration: 3000,
          });
          this.spinner.hide();
        },
        error: (err) => {
          this.toast.error({
            detail: 'Thất bại',
            summary: 'Xóa thú cưng thất bại',
            duration: 3000,
          });
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
