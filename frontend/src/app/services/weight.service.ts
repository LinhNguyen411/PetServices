import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Weight } from '../models/weight.model';

const baseUrl = 'http://127.0.0.1:8000/api/weights/';

@Injectable({
  providedIn: 'root',
})
export class WeightService {
  private http = inject(HttpClient);
  private pagi_number: number = 1;
  private species_value: string = '';
  constructor() {}

  getAll(): Observable<any> {
    return this.http.get<any>(
      `${baseUrl}?${this.pagi_number == 1 ? '' : 'page=' + this.pagi_number}${
        this.species_value == '' ? '' : '&species=' + this.species_value
      }`
    );
  }

  get(id: string): Observable<Weight> {
    return this.http.get<Weight>(`${baseUrl}/${id}`);
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
  species_filter(value: string): void {
    this.species_value = value;
  }
}
