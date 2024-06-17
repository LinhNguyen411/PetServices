import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Service } from '../models/service.model';
import { backendURL } from '../untils/global';

const baseUrl = backendURL + 'api/services/';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  private http = inject(HttpClient);

  constructor() {}
  getAll(
    options: {
      search_value?: string;
      pagi_number?: number;
      ordering_value?: string;
      species_value?: string;
      is_one_day?: any;
    } = {}
  ): Observable<any> {
    const {
      search_value = '',
      pagi_number = 1,
      ordering_value = '-name',
      species_value = '',
      is_one_day = '',
    } = options;
    console.log(
      is_one_day == '' ? '' : '&is_one_day=' + (is_one_day ? 'true' : 'false')
    );
    return this.http.get<any>(
      `${baseUrl}?${search_value == '' ? '' : 'search=' + search_value}${
        pagi_number == 1 ? '' : '&page=' + pagi_number
      }${'&ordering=' + ordering_value}${
        species_value == '' ? '' : '&species=' + species_value
      }${is_one_day == '' ? '' : '&is_one_day=' + is_one_day}`
    );
  }

  get(id: string): Observable<Service> {
    return this.http.get<Service>(`${baseUrl}${id}`);
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
