import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { backendURL } from '../untils/global';

const baseUrl = backendURL + 'api/service_package_details/';

import { ServicePackageDetail } from '../models/service-package-detail.model';

@Injectable({
  providedIn: 'root',
})
export class ServicePackageDetailService {
  private http = inject(HttpClient);

  constructor() {}
  getAll(
    options: {
      pagi_number?: number;
      package_value?: string;
    } = {}
  ): Observable<any> {
    const { pagi_number = 1, package_value = '' } = options;
    return this.http.get<any>(
      `${baseUrl}?${package_value == '' ? '' : 'package=' + package_value}${
        pagi_number == 0 ? '' : '&page=' + pagi_number
      }`
    );
  }

  get(id: string): Observable<ServicePackageDetail> {
    return this.http.get<ServicePackageDetail>(`${baseUrl}${id}`);
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
