import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { concatMap, switchMap } from 'rxjs/operators';

import { ServiceBill } from '../models/service-bill.model';
import { Surcharges } from '../models/surcharges.model';
import { SurchargeService } from './surcharge.service';
import { backendURL } from '../untils/global';

const baseUrl = backendURL + 'api/service_bills/';

@Injectable({
  providedIn: 'root',
})
export class ServiceBillService {
  private surchargeService = inject(SurchargeService);
  private http = inject(HttpClient);

  constructor() {}
  getAll(
    options: {
      search_value?: string;
      pagi_number?: number;
      ordering_value?: string;
      status?: string;
      booking_value?: string;
    } = {}
  ): Observable<any> {
    const {
      search_value = '',
      pagi_number = 1,
      ordering_value = '-date_created',
      status = '',
      booking_value = '',
    } = options;
    return this.http.get<any>(
      `${baseUrl}?${search_value == '' ? '' : 'search=' + search_value}${
        pagi_number == 1 ? '' : '&page=' + pagi_number
      }${'&ordering=' + ordering_value}${
        status == '' ? '' : '&status=' + status
      }${booking_value == '' ? '' : '&booking=' + booking_value}`
    );
  }

  get(id?: string): Observable<ServiceBill> {
    return this.http.get<ServiceBill>(`${baseUrl}${id}`);
  }

  create(data: any, items: Surcharges[]): Observable<any> {
    const value = {
      employee: data.employee,
      booking: data.booking,
      payment_method: data.payment_method,
    };
    if (items.length == 0) {
      return this.http.post(baseUrl, value);
    }
    return this.http.post(baseUrl, value).pipe(
      concatMap((bill: ServiceBill) => {
        const itemRequests = items.map((item) => {
          const sub_data = {
            bill: bill.id,
            reasons: item.reasons,
            price: item.price,
          };
          return this.surchargeService.create(sub_data);
        });

        // Use forkJoin to wait for all item requests to complete
        return forkJoin(itemRequests).pipe(
          // Return the get function after all requests complete
          switchMap(() => {
            const getUrl = `${baseUrl}${bill.id}`;
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
