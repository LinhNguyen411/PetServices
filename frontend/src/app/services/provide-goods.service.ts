import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { backendURL } from '../untils/global';

const baseUrl = backendURL + 'api/provide_goods/';

import { ProvideGoods } from '../models/provide-goods.model';

@Injectable({
  providedIn: 'root',
})
export class ProvideGoodsService {
  private http = inject(HttpClient);

  constructor() {}
  getAll(
    options: {
      search_value?: string;
      pagi_number?: number;
      ordering_value?: string;
    } = {}
  ): Observable<any> {
    const {
      search_value = '',
      pagi_number = 1,
      ordering_value = '-name',
    } = options;
    return this.http.get<any>(
      `${baseUrl}?${search_value == '' ? '' : 'search=' + search_value}${
        pagi_number == 0 ? '' : '&page=' + pagi_number
      }${'&ordering=' + ordering_value}`
    );
  }
  getAllList(): Observable<any> {
    return this.http.get<any>(`${baseUrl}?limit=100&offset=0&ordering=-name`);
  }

  get(id: string): Observable<ProvideGoods> {
    return this.http.get<ProvideGoods>(`${baseUrl}${id}`);
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
