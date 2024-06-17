import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { concatMap, switchMap } from 'rxjs/operators';

import { ProductBill } from '../models/product-bill.model';
import { ProductBillItem } from '../models/product-bill-item.model';
import { backendURL } from '../untils/global';

const baseUrl = backendURL + 'api/product_bills/';

@Injectable({
  providedIn: 'root',
})
export class ProductBillService {
  private http = inject(HttpClient);

  private pagi_number: number = 1;
  private search_value: string = '';
  private ordering_value: string = '-date_created';

  constructor() {}
  getAll(): Observable<any> {
    return this.http.get<any>(
      `${baseUrl}?${
        this.search_value == '' ? '' : 'search=' + this.search_value
      }${this.pagi_number == 1 ? '' : '&page=' + this.pagi_number}${
        '&ordering=' + this.ordering_value
      }`
    );
  }

  get(id?: string): Observable<ProductBill> {
    return this.http.get<ProductBill>(`${baseUrl}${id}`);
  }

  getItems(id: string): Observable<ProductBillItem[]> {
    return this.http.get<ProductBill[]>(`${baseUrl}${id}/items`);
  }

  create(data: any, items: ProductBillItem[]): Observable<any> {
    return this.http.post(baseUrl, data).pipe(
      concatMap((bill: ProductBill) => {
        const itemRequests = items.map((item) => {
          const sub_data = {
            product: item.product.id,
            quantity: item.quantity,
          };
          return this.http.post(`${baseUrl}${bill.id}/items/`, sub_data);
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
  search(value: string): void {
    this.search_value = value;
  }
  pagination(number: number): void {
    this.pagi_number = number;
  }
  sort(value: string): void {
    this.ordering_value = value;
  }
}
