import { Component, OnInit, inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgToastService } from 'ng-angular-popup';

import { AddEditPetComponent } from '../add-edit-pet/add-edit-pet.component';
import { Pet } from '../../../../models/pet.model';
import { PetService } from '../../../../services/pet.service';
import { Species } from '../../../../models/species.model';
import { SpeciesService } from '../../../../services/species.service';

@Component({
  selector: 'app-show-pet',
  standalone: true,
  imports: [AddEditPetComponent, FormsModule, CommonModule],
  templateUrl: './show-pet.component.html',
  styleUrl: './show-pet.component.css',
})
export class ShowPetComponent implements OnInit {
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
    weight: '',
    photo: '',
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
    this.dataService.species_filter(this.speciesValue);

    this.dataService.pagination(this.current_page);
    this.dataService.search(this.searchValue);

    this.refresh();
  }
  paginationClick(value: number) {
    this.current_page = value;

    this.dataService.pagination(value);

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

    this.dataService.sort(this.orderValue);

    this.refresh();
  }

  addClick(): void {
    this.data = {
      id: '',
      name: '',
      age: 0,
      gender: false,
      owner: '',
      species: '',
      weight: '',
      photo: '',
    };
    this.ModalTitle = 'Add Customer';
  }

  editClick(item: any): void {
    this.data = {
      id: item.id,
      name: item.name,
      age: item.age,
      gender: item.gender,
      owner: item.owner.id,
      species: item.species.id,
      weight: item.weight.id,
      photo: item.photo,
    };
    this.ModalTitle = 'Edit Customer';
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
