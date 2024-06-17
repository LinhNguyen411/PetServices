import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { backendURL } from '../untils/global';

const baseUrl = backendURL + 'api/consignment_diaries/';

import { ConsignmentDiary } from '../models/consignment-diary.model';

@Injectable({
  providedIn: 'root',
})
export class ConsignmentDiaryService {
  private http = inject(HttpClient);

  constructor() {}
  getAll(
    options: {
      con_detail_value?: string;
      pagi_number?: number;
      ordering_value?: string;
    } = {}
  ): Observable<any> {
    const {
      con_detail_value = '',
      pagi_number = 1,
      ordering_value = '-date_time_create',
    } = options;
    return this.http.get<any>(
      `${baseUrl}?${
        con_detail_value == '' ? '' : 'con_detail=' + con_detail_value
      }${pagi_number == 0 ? '' : '&page=' + pagi_number}${
        '&ordering=' + ordering_value
      }`
    );
  }

  get(id: string): Observable<ConsignmentDiary> {
    return this.http.get<ConsignmentDiary>(`${baseUrl}${id}`);
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
