import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, timeout } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LuggageReport {
  id: number;
  description: string;
  passenger_name: string;
  passenger_document: string;
  status: string;
  created_at: string;
}

export interface LuggageReportCreate {
  description: string;
  passenger_name: string;
  passenger_document: string;
}

@Injectable({
  providedIn: 'root'
})
export class LuggageService {
  private apiUrl = environment.apiUrl;
  private timeoutMs = 5000;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getReports(): Observable<LuggageReport[]> {
    return this.http
      .get<LuggageReport[]>(`${this.apiUrl}/luggage/`)
      .pipe(timeout(this.timeoutMs));
  }
  
  getReport(id: number): Observable<LuggageReport> {
    return this.http
      .get<LuggageReport>(`${this.apiUrl}/luggage/${id}`)
      .pipe(timeout(this.timeoutMs));
  }

  createReport(report: LuggageReportCreate): Observable<LuggageReport> {
    return this.http.post<LuggageReport>(`${this.apiUrl}/luggage/`, report);
  }

  updateReportStatus(id: number, status: string): Observable<LuggageReport> {
    const token = localStorage.getItem('access_token');
    return this.http.put<LuggageReport>(
      `${this.apiUrl}/luggage/${id}?status=${status}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  }

  deleteReport(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/luggage/${id}`, { headers: this.getHeaders() });
  }
}