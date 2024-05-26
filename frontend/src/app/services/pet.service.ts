import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Pet } from '../models/pet.model';

const baseUrl = 'http://127.0.0.1:8000/api/pets/';

@Injectable({
  providedIn: 'root',
})
export class PetService {
  private http = inject(HttpClient);

  private pagi_number: number = 1;
  private search_value: string = '';
  private ordering_value: string = '-name';
  private species_value: string = '';

  constructor() {}
  getAll(): Observable<any> {
    return this.http.get<any>(
      `${baseUrl}?${
        this.search_value == '' ? '' : 'search=' + this.search_value
      }${this.pagi_number == 1 ? '' : '&page=' + this.pagi_number}${
        '&ordering=' + this.ordering_value
      }${this.species_value == '' ? '' : '&species=' + this.species_value}`
    );
  }

  get(id: string): Observable<Pet> {
    return this.http.get<Pet>(`${baseUrl}/${id}`);
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
  species_filter(value: string): void {
    this.species_value = value;
  }
}
