import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { backendURL } from '../untils/global';
import { Observable, forkJoin } from 'rxjs';
import { concatMap, switchMap } from 'rxjs/operators';

const baseUrl = backendURL + 'api/service_packages/';

import { ServicePackage } from '../models/service-package.model';
import { ServicePackageDetail } from '../models/service-package-detail.model';
import { ServicePackageDetailService } from './service-package-detail.service';

@Injectable({
  providedIn: 'root',
})
export class ServicePackageService {
  private http = inject(HttpClient);
  private detailService = inject(ServicePackageDetailService);

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

  get(id: string): Observable<ServicePackage> {
    return this.http.get<ServicePackage>(`${baseUrl}${id}`);
  }

  create(data: any, items: any[]): Observable<any> {
    if (items.length == 0) {
      return this.http.post(baseUrl, data);
    }
    return this.http.post(baseUrl, data).pipe(
      concatMap((booking: ServicePackage) => {
        const itemRequests = items.map((item) => {
          const sub_data = {
            package: booking.id,
            goods: item.goods.id,
            is_completed: false,
          };
          return this.detailService.create(sub_data);
        });

        // Use forkJoin to wait for all item requests to complete
        return forkJoin(itemRequests).pipe(
          // Return the get function after all requests complete
          switchMap(() => {
            const getUrl = `${baseUrl}${booking.id}`;
            return this.http.get(getUrl);
          })
        );
      })
    );
  }

  update(id: string, data: any): Observable<any> {
    return this.http.put(`${baseUrl}${id}/`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${baseUrl}${id}/`);
  }
}
