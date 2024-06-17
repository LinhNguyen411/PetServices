import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Surcharges } from '../models/surcharges.model';
import { backendURL } from '../untils/global';

const baseUrl = backendURL + 'api/surcharges/';

@Injectable({
  providedIn: 'root',
})
export class SurchargeService {
  private http = inject(HttpClient);

  constructor() {}
  getAll(
    options: { pagi_number?: string; bill_value?: string } = {}
  ): Observable<any> {
    const { pagi_number = 1, bill_value = '' } = options;
    return this.http.get<any>(
      `${baseUrl}?${pagi_number == 1 ? '' : 'page=' + pagi_number}${
        bill_value == '' ? '' : '&bill=' + bill_value
      }`
    );
  }

  get(id: string): Observable<Surcharges> {
    return this.http.get<Surcharges>(`${baseUrl}${id}`);
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
