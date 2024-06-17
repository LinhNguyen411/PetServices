import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, forkJoin } from 'rxjs';
import { concatMap, switchMap } from 'rxjs/operators';

import { ServiceBooking } from '../models/service-booking.model';
import { SubServiceBooking } from '../models/sub-service-booking.model';
import { SubServiceBookingService } from './sub-service-booking.service';

import { backendURL } from '../untils/global';
import { RoomService } from './room.service';
import { Room } from '../models/room.model';

const baseUrl = backendURL + 'api/service_bookings/';

@Injectable({
  providedIn: 'root',
})
export class ServiceBookingService {
  private subServiceBookingService = inject(SubServiceBookingService);
  private http = inject(HttpClient);
  private roomService = inject(RoomService);

  constructor() {}
  getAll(
    options: {
      search_value?: string;
      pagi_number?: number;
      ordering_value?: string;
      status?: string;
      customer_value?: string;
    } = {}
  ): Observable<any> {
    const {
      search_value = '',
      pagi_number = 0,
      ordering_value = '-date_booked',
      status = '',
      customer_value = '',
    } = options;
    return this.http.get<any>(
      `${baseUrl}?${search_value == '' ? '' : 'search=' + search_value}${
        pagi_number == 0 ? '' : '&page=' + pagi_number
      }${'&ordering=' + ordering_value}${
        status == '' ? '' : '&status=' + status
      }${customer_value == '' ? '' : '&customer=' + customer_value}`
    );
  }

  get(id?: string): Observable<ServiceBooking> {
    return this.http.get<ServiceBooking>(`${baseUrl}${id}`);
  }

  create(data: any, items: SubServiceBooking[]): Observable<any> {
    const value = {
      date_start: data.date_start,
      stay_days: data.stay_days,
      status: data.status,
      note: data.note,
      customer: data.customer,
      pet: data.pet,
      service: data.service,
      room: data.room,
    };
    this.roomService.get(data.room).subscribe((res: Room) => {
      res.is_booked = true;
      console.log(res);
      this.roomService.update(data.room, res).subscribe(() => {});
    });
    if (items.length == 0) {
      return this.http.post(baseUrl, value);
    }
    return this.http.post(baseUrl, value).pipe(
      concatMap((booking: ServiceBooking) => {
        const itemRequests = items.map((item) => {
          const sub_data = {
            booking: booking.id,
            service: item.service.id,
            is_completed: false,
          };
          return this.subServiceBookingService.create(sub_data);
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
    if (data.get('status') == 'c') {
      this.roomService.get(data.get('room')).subscribe((res: Room) => {
        res.is_booked = false;
        console.log(res);
        this.roomService.update(data.get('room'), res).subscribe(() => {});
      });
    }
    return this.http.put(`${baseUrl}${id}/`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${baseUrl}${id}/`);
  }
}
