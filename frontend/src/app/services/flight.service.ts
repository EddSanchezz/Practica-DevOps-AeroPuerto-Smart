import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, timeout } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Flight {
  id: number;
  flight_number: string;
  origin: string;
  destination: string;
  departure_time: string;
  arrival_time: string;
  gate?: string;
  status: string;
  updated_at: string;
}

export interface FlightCreate {
  flight_number: string;
  origin: string;
  destination: string;
  departure_time: string;
  arrival_time: string;
  gate?: string;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private apiUrl = environment.apiUrl;
  private timeoutMs = 15000;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getFlights(): Observable<Flight[]> {
    return this.http
      .get<Flight[]>(`${this.apiUrl}/api/flights/`)
      .pipe(timeout(this.timeoutMs));
  }
  
  searchFlights(query: string): Observable<Flight[]> {
    return this.http
      .get<Flight[]>(
        `${this.apiUrl}/api/flights/search?q=${encodeURIComponent(query)}`
      )
      .pipe(timeout(this.timeoutMs));
  }
  
  getFlight(id: number): Observable<Flight> {
    return this.http
      .get<Flight>(`${this.apiUrl}/api/flights/${id}`)
      .pipe(timeout(this.timeoutMs));
  }

  createFlight(flight: FlightCreate): Observable<Flight> {
    return this.http.post<Flight>(`${this.apiUrl}/api/flights/`, flight, {
      headers: this.getHeaders(),
    });
  }

  updateFlight(id: number, flight: FlightCreate): Observable<Flight> {
    return this.http.put<Flight>(`${this.apiUrl}/api/flights/${id}`, flight, {
      headers: this.getHeaders(),
    });
  }

  deleteFlight(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/flights/${id}`, { headers: this.getHeaders() });
  }
}