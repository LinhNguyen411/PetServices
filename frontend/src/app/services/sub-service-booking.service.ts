import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SubServiceBooking } from '../models/sub-service-booking.model';
import { backendURL } from '../untils/global';

const baseUrl = backendURL + 'api/sub_service_bookings/';

@Injectable({
  providedIn: 'root',
})
export class SubServiceBookingService {
  private http = inject(HttpClient);

  constructor() {}
  getAll(
    options: { pagi_number?: string; booking_value?: string } = {}
  ): Observable<any> {
    const { pagi_number = 1, booking_value = '' } = options;
    return this.http.get<any>(
      `${baseUrl}?${pagi_number == 1 ? '' : 'page=' + pagi_number}${
        booking_value == '' ? '' : '&booking=' + booking_value
      }&ordering=is_completed`
    );
  }

  get(id: string): Observable<SubServiceBooking> {
    return this.http.get<SubServiceBooking>(`${baseUrl}${id}`);
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
