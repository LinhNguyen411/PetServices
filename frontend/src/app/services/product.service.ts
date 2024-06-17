import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Product } from '../models/product.model';

import { backendURL } from '../untils/global';

const baseUrl = backendURL + 'api/products/';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);

  private pagi_number: number = 1;
  private search_value: string = '';
  private ordering_value: string = '-name';

  private species_value: string = '';
  private category_value: string = '';
  private supplier_value: string = '';

  constructor() {}
  getAll(): Observable<any> {
    return this.http.get<any>(
      `${baseUrl}?${
        this.search_value == '' ? '' : 'search=' + this.search_value
      }${this.pagi_number == 1 ? '' : '&page=' + this.pagi_number}${
        '&ordering=' + this.ordering_value
      }${this.species_value == '' ? '' : '&species=' + this.species_value}${
        this.category_value == '' ? '' : '&category=' + this.category_value
      }${this.supplier_value == '' ? '' : '&supplier=' + this.supplier_value}`
    );
  }

  get(id: string): Observable<Product> {
    return this.http.get<Product>(`${baseUrl}${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  update(id: string, data: any): Observable<any> {
    return this.http.put(`${baseUrl}${id}/`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${baseUrl}${id}/`);
  }
  search(value: string): void {
    this.search_value = value;
  }
  pagination(number: number): void {
    this.pagi_number = number;
  }
  sort(value: string): void {
    this.ordering_value = value;
  }
  filter(value: string, type: string): void {
    if (type == 'species') {
      this.species_value = value;
    } else if (type == 'category') {
      this.category_value = value;
    } else if (type == 'supplier') {
      this.supplier_value = value;
    }
  }
}
