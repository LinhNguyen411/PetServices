import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { backendURL } from '../untils/global';

const baseUrl = backendURL + 'api/consignment_invoices/';

import { ConsignmentInvoice } from '../models/consignment-invoice.model';

@Injectable({
  providedIn: 'root',
})
export class ConsignmentInvoiceService {
  private http = inject(HttpClient);

  constructor() {}
  getAll(
    options: {
      con_detail_value?: string;
      pagi_number?: number;
    } = {}
  ): Observable<any> {
    const { con_detail_value = '', pagi_number = 1 } = options;
    return this.http.get<any>(
      `${baseUrl}?${
        con_detail_value == '' ? '' : 'con_detail=' + con_detail_value
      }${pagi_number == 0 ? '' : '&page=' + pagi_number}`
    );
  }

  get(id: string): Observable<ConsignmentInvoice> {
    return this.http.get<ConsignmentInvoice>(`${baseUrl}${id}`);
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
