import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Diary } from '../models/diary.model';

import { backendURL } from '../untils/global';

const baseUrl = backendURL + 'api/diaries/';

@Injectable({
  providedIn: 'root',
})
export class DiaryService {
  private http = inject(HttpClient);

  constructor() {}
  getAll(
    options: { pagi_number?: string; booking_value?: string } = {}
  ): Observable<any> {
    const { pagi_number = 1, booking_value = '' } = options;
    return this.http.get<any>(
      `${baseUrl}?${pagi_number == 1 ? '' : 'page=' + pagi_number}${
        booking_value == '' ? '' : '&booking=' + booking_value
      }&ordering=-time&limit=100&offset=0`
    );
  }

  get(id: string): Observable<Diary> {
    return this.http.get<Diary>(`${baseUrl}${id}`);
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
