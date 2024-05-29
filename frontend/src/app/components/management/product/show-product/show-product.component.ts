import { Component, OnInit, inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgToastService } from 'ng-angular-popup';

import { AddEditProductComponent } from '../add-edit-product/add-edit-product.component';
import { Product } from '../../../../models/product.model';
import { ProductService } from '../../../../services/product.service';

import { Species } from '../../../../models/species.model';
import { SpeciesService } from '../../../../services/species.service';
import { Category } from '../../../../models/category.model';
import { CategoryService } from '../../../../services/category.service';
import { Supplier } from '../../../../models/supplier.model';
import { SupplierService } from '../../../../services/supplier.service';

@Component({
  selector: 'app-show-product',
  standalone: true,
  imports: [AddEditProductComponent, FormsModule, CommonModule],
  templateUrl: './show-product.component.html',
  styleUrl: './show-product.component.css',
})
export class ShowProductComponent implements OnInit {
  private toast = inject(NgToastService);
  private observer = inject(BreakpointObserver);
  private dataService = inject(ProductService);
  componentName = 'Product';

  isMobile: boolean = true;

  orderValue: string = 'name';
  searchValue: string = '';

  isOrderName: boolean = false;
  isOrderPrice: boolean = false;
  isOrderQuantity: boolean = false;

  speciesValue: string = '';
  categoryValue: string = '';
  supplierValue: string = '';

  current_page: number = 1;
  page_size: number = 10;
  max_page: number = 0;
  count: number = 0;
  next?: any;
  previous?: any;

  private speciesService = inject(SpeciesService);
  speciesList?: Species[];

  private categoryService = inject(CategoryService);
  categoryList?: Category[];

  private supplierService = inject(SupplierService);
  supplierList?: Supplier[];

  dataList?: Product[];
  ModalTitle?: string;
  data: Product = {
    id: '',
    name: '',
    description: '',
    category: '',
    species: '',
    supplier: '',
    price: 0,
    quantity: 0,
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

    this.categoryService.getAll().subscribe((res) => {
      this.categoryList = res.results;
    });

    this.supplierService.getAll().subscribe((res) => {
      this.supplierList = res.results;
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
    this.dataService.filter(this.speciesValue, 'species');
    this.dataService.filter(this.categoryValue, 'category');
    this.dataService.filter(this.supplierValue, 'supplier');

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

      this.isOrderPrice = false;
      this.isOrderQuantity = false;
    } else if (value == 'price') {
      this.orderValue = (this.isOrderPrice ? '-' : '') + value;
      this.isOrderPrice = !this.isOrderPrice;

      this.isOrderName = false;
      this.isOrderQuantity = false;
    } else if (value == 'quantity') {
      this.orderValue = (this.isOrderQuantity ? '-' : '') + value;
      this.isOrderQuantity = !this.isOrderQuantity;

      this.isOrderName = false;
      this.isOrderPrice = false;
    }

    this.dataService.sort(this.orderValue);

    this.refresh();
  }

  addClick(): void {
    this.data = {
      id: '',
      name: '',
      description: '',
      category: '',
      species: '',
      supplier: '',
      price: 0,
      quantity: 0,
      photo: '',
    };
    this.ModalTitle = 'Add ' + this.componentName;
  }

  editClick(item: any): void {
    this.data = {
      id: item.id,
      name: item.name,
      description: item.description,
      category: item.category.id,
      species: item.species.id,
      supplier: item.supplier.id,
      price: item.price,
      quantity: item.quantity,
      photo: item.photo,
    };
    this.ModalTitle = 'Edit ' + this.componentName;
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
