import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Pet } from '../models/pet.model';
import { backendURL } from '../untils/global';

const baseUrl = backendURL + 'api/pets/';

@Injectable({
  providedIn: 'root',
})
export class PetService {
  private http = inject(HttpClient);

  constructor() {}
  getAll(
    options: {
      search_value?: string;
      pagi_number?: number;
      ordering_value?: string;
      species_value?: string;
      owner_value?: string;
    } = {}
  ): Observable<any> {
    const {
      search_value = '',
      pagi_number = 1,
      ordering_value = '-name',
      species_value = '',
      owner_value = '',
    } = options;
    return this.http.get<any>(
      `${baseUrl}?${search_value == '' ? '' : 'search=' + search_value}${
        pagi_number == 0 ? '' : '&page=' + pagi_number
      }${'&ordering=' + ordering_value}${
        species_value == '' ? '' : '&species=' + species_value
      }${owner_value == '' ? '' : '&owner=' + owner_value}`
    );
  }

  get(id: string): Observable<Pet> {
    return this.http.get<Pet>(`${baseUrl}${id}`);
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
}
