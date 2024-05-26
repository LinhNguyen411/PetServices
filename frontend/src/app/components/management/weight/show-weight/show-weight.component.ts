import { Component, OnInit, inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgToastService } from 'ng-angular-popup';

import { AddEditWeightComponent } from '../add-edit-weight/add-edit-weight.component';
import { Weight } from '../../../../models/weight.model';
import { Species } from '../../../../models/species.model';
import { WeightService } from '../../../../services/weight.service';
import { SpeciesService } from '../../../../services/species.service';

@Component({
  selector: 'app-show-weight',
  standalone: true,
  imports: [AddEditWeightComponent, FormsModule, CommonModule],
  templateUrl: './show-weight.component.html',
  styleUrl: './show-weight.component.css',
})
export class ShowWeightComponent implements OnInit {
  private toast = inject(NgToastService);
  private observer = inject(BreakpointObserver);
  private dataService = inject(WeightService);
  private speciesService = inject(SpeciesService);

  isMobile: boolean = true;

  speciesValue: string = '';

  current_page: number = 1;
  page_size: number = 10;
  max_page: number = 0;
  count: number = 0;
  next?: any;
  previous?: any;

  speciesList?: Species[];
  dataList?: Weight[];
  ModalTitle?: string;
  data: Weight = {
    id: '',
    species: '',
    weight_range: '',
    weight_type: '',
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
  filterClick(): void {
    this.dataService.species_filter(this.speciesValue);
    this.refresh();
  }

  paginationClick(value: number) {
    this.current_page = value;

    this.dataService.pagination(value);

    this.refresh();
  }

  addClick(): void {
    this.data = {
      id: '',
      species: '',
      weight_range: '',
      weight_type: '',
    };
    this.ModalTitle = 'Add Weight';
  }

  editClick(item: Weight): void {
    this.data = {
      id: item.id,
      species: item.species.id,
      weight_range: item.weight_range,
      weight_type: item.weight_type,
    };
    this.ModalTitle = 'Edit Weight';
  }
  triggerDelete(item: Weight): void {
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
