import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Species } from '../models/species.model';

import { backendURL } from '../untils/global';

const baseUrl = backendURL + 'api/species/';

@Injectable({
  providedIn: 'root',
})
export class SpeciesService {
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

  get(id: string): Observable<Species> {
    return this.http.get<Species>(`${baseUrl}/${id}`);
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
