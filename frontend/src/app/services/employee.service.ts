import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Employee } from '../models/employee.model';
import { backendURL } from '../untils/global';

const baseUrl = backendURL + 'api/employees/';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
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

  get(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${baseUrl}${id}`);
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
  account(id: string, action: string): Observable<any> {
    var data = {
      action: action,
    };
    return this.http.post(`${baseUrl}${id}/account/`, data);
  }

  searchByAccount(id: any): Observable<any> {
    return this.http.get<any>(`${baseUrl}?account=${id}`);
  }
}
