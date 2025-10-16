import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AgendaItem {
  id: number;
  hora: string;
  titulo: string;
  descripcion: string;
  completado: boolean;
  categoria: string;
  prioridad: 'alta' | 'media' | 'baja';
}

@Injectable({
  providedIn: 'root'
})
export class AgendaService {
  private apiUrl = 'http://localhost:3000/api/agenda';

  constructor(private http: HttpClient) {}

  getAll(): Observable<AgendaItem[]> {
    return this.http.get<AgendaItem[]>(this.apiUrl);
  }

  getById(id: number): Observable<AgendaItem> {
    return this.http.get<AgendaItem>(`${this.apiUrl}/${id}`);
  }

  create(item: Omit<AgendaItem, 'id'>): Observable<AgendaItem> {
    return this.http.post<AgendaItem>(this.apiUrl, item);
  }

  update(id: number, item: Partial<AgendaItem>): Observable<AgendaItem> {
    return this.http.put<AgendaItem>(`${this.apiUrl}/${id}`, item);
  }

  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
