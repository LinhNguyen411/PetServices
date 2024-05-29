import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';

const baseUrl = 'http://127.0.0.1:8000/api/categories/';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);
  private pagi_number: number = 1;
  private ordering_value: string = '-name';

  constructor() {}
  getAll(): Observable<any> {
    return this.http.get<any>(
      `${baseUrl}?
      ${this.pagi_number == 1 ? '' : 'page=' + this.pagi_number}${
        '&ordering=' + this.ordering_value
      }`
    );
  }

  get(id: string): Observable<Category> {
    return this.http.get<Category>(`${baseUrl}/${id}`);
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

  pagination(number: number): void {
    this.pagi_number = number;
  }
  sort(value: string): void {
    this.ordering_value = value;
  }
}
