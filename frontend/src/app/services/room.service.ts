import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room } from '../models/room.model';

import { backendURL } from '../untils/global';

const baseUrl = backendURL + 'api/rooms/';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private http = inject(HttpClient);

  constructor() {}
  getAll(options: { pagi_number?: number; is_booked?: any }): Observable<any> {
    const { pagi_number = 1, is_booked = '' } = options;
    return this.http.get<any>(
      `${baseUrl}?${pagi_number == 1 ? '' : '&page=' + pagi_number}${
        is_booked == '' ? '' : 'is_booked=' + is_booked
      }&ordering=-name`
    );
  }
  getAllList(): Observable<any> {
    return this.http.get<any>(
      `${baseUrl}?limit=100&offset=0&ordering=-name&is_booked=false`
    );
  }

  get(id: string): Observable<Room> {
    return this.http.get<Room>(`${baseUrl}${id}`);
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
