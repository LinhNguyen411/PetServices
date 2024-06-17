import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { backendURL } from '../untils/global';
import { Observable, forkJoin } from 'rxjs';
import { concatMap, switchMap } from 'rxjs/operators';

const baseUrl = backendURL + 'api/consignments/';

import { Consignment } from '../models/consignment.model';
import { ConsignmentDetail } from '../models/consignment-detail.model';
import { ConsignmentDetailService } from './consignment-detail.service';
import { RoomService } from './room.service';

@Injectable({
  providedIn: 'root',
})
export class ConsignmentService {
  private http = inject(HttpClient);
  private detailService = inject(ConsignmentDetailService);
  private roomService = inject(RoomService);
  constructor() {}
  getAll(
    options: {
      customer_value?: string;
      pagi_number?: number;
      ordering_value?: string;
      status_value?: string;
    } = {}
  ): Observable<any> {
    const {
      customer_value = '',
      pagi_number = 1,
      ordering_value = '-date_time_create',
      status_value = '',
    } = options;
    return this.http.get<any>(
      `${baseUrl}?${customer_value == '' ? '' : 'customer=' + customer_value}${
        pagi_number == 0 ? '' : '&page=' + pagi_number
      }${'&ordering=' + ordering_value}&${
        status_value == '' ? '' : 'status=' + status_value
      }`
    );
  }

  get(id: string): Observable<Consignment> {
    return this.http.get<Consignment>(`${baseUrl}${id}`);
  }

  create(data: any, items: ConsignmentDetail[]): Observable<any> {
    if (items.length == 0) {
      return this.http.post(baseUrl, data);
    }
    return this.http.post(baseUrl, data).pipe(
      concatMap((consign: Consignment) => {
        const itemRequests = items.map((item) => {
          const sub_data = {
            consignment: consign.id,
            is_paid: false,
            pet: item.pet.id,
            room: item.room.id,
            package: item.package.id,
          };
          return this.detailService.create(sub_data);
        });

        items.map((item) => {
          const sub_data = {
            name: item.room.name,
            is_booked: true,
            price: item.room.price,
          };
          itemRequests.push(this.roomService.update(item.room.id, sub_data));
        });

        // Use forkJoin to wait for all item requests to complete
        return forkJoin(itemRequests).pipe(
          // Return the get function after all requests complete
          switchMap(() => {
            const getUrl = `${baseUrl}${consign.id}`;
            return this.http.get(getUrl);
          })
        );
      })
    );
  }
  cancelUpdate(
    id: string,
    data: any,
    items: ConsignmentDetail[]
  ): Observable<any> {
    if (items.length == 0) {
      return this.update(id, data);
    }
    return this.get(id).pipe(
      concatMap((consign: Consignment) => {
        const itemRequests = items.map((item) => {
          const sub_data = {
            consignment: consign.id,
            is_paid: true,
            pet: item.pet.id,
            package: item.package.id,
            room: item.room.id,
          };
          if (item.id) return this.detailService.update(item.id, sub_data);
          return this.detailService.get('0');
        });

        items.map((item) => {
          const sub_data = {
            name: item.room.name,
            is_booked: false,
            price: item.room.price,
          };
          itemRequests.push(this.roomService.update(item.room.id, sub_data));
        });

        // Use forkJoin to wait for all item requests to complete
        return forkJoin(itemRequests).pipe(
          // Return the get function after all requests complete
          switchMap(() => {
            const getUrl = `${baseUrl}${consign.id}`;
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
