import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { backendURL } from '../untils/global';

const baseUrl = backendURL + 'api/consignment_details/';

import { ConsignmentDetail } from '../models/consignment-detail.model';
import { RoomService } from './room.service';

@Injectable({
  providedIn: 'root',
})
export class ConsignmentDetailService {
  private http = inject(HttpClient);
  private roomService = inject(RoomService);

  constructor() {}
  getAll(
    options: {
      consignment_value?: string;
      is_paid?: string;
    } = {}
  ): Observable<any> {
    const { consignment_value = '', is_paid = '' } = options;
    return this.http.get<any>(
      `${baseUrl}?${
        consignment_value == '' ? '' : 'consignment=' + consignment_value
      }&${is_paid == '' ? '' : 'is_paid=' + is_paid}&limit=100&offset=0`
    );
  }

  get(id: string): Observable<ConsignmentDetail> {
    return this.http.get<ConsignmentDetail>(`${baseUrl}${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  update(id: string, data: any): Observable<any> {
    if (data.is_paid) {
      const sub_data = {
        name: data.room.name,
        is_booked: false,
        price: data.room.price,
      };
      this.roomService.update(data.room.id, sub_data).subscribe((res) => {});
    }
    data.room = data.room.id;
    return this.http.put(`${baseUrl}${id}/`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${baseUrl}${id}/`);
  }
}
