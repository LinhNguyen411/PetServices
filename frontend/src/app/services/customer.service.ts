import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer.model';
import { backendURL } from '../untils/global';

const baseUrl = backendURL + 'api/customers/';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private http = inject(HttpClient);
  private pagi_number: number = 1;
  private search_value: string = '';
  private ordering_value: string = '-name';
  constructor() {}
  getAll(): Observable<any> {
    return this.http.get<any>(
      `${baseUrl}?${
        this.search_value == '' ? '' : 'search=' + this.search_value
      }${this.pagi_number == 1 ? '' : '&page=' + this.pagi_number}${
        '&ordering=' + this.ordering_value
      }`
    );
  }

  get(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${baseUrl}${id}`);
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
  searchByAccount(id: any): Observable<any> {
    return this.http.get<any>(`${baseUrl}?account=${id}`);
  }
  searchByValue(value: any): Observable<any> {
    return this.http.get<any>(`${baseUrl}?search=${value}`);
  }

  updateAccount(id: string, data: any) {
    return this.http.post(`${baseUrl}${id}/account/`, data);
  }
}
