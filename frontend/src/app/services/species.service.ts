import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Species } from '../models/species.model';

const baseUrl = 'http://127.0.0.1:8000/api/species/';

@Injectable({
  providedIn: 'root',
})
export class SpeciesService {
  private http = inject(HttpClient);
  constructor() {}
  getAll(): Observable<Species[]> {
    return this.http.get<Species[]>(baseUrl);
  }

  get(id: string): Observable<Species> {
    return this.http.get<Species>(`${baseUrl}/${id}`);
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
