import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FlightService, Flight } from '../../services/flight.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-flight-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="flights-container">
      <div class="flights-header">
        <h1>🛫 Lista de Vuelos</h1>
        <div class="header-actions">
          <div class="search-box">
            <input type="text" [(ngModel)]="searchQuery" placeholder="Buscar por número, origen o destino..." class="search-input">
            <button class="search-btn" (click)="searchFlights()">Buscar</button>
            <button class="clear-btn" (click)="clearSearch()" *ngIf="searchQuery">Limpiar</button>
          </div>
          <a *ngIf="authService.isAuthenticated()" routerLink="/flights/new" class="new-btn">+ Nuevo Vuelo</a>
        </div>
      </div>

      <div *ngIf="loading" class="loading">Cargando...</div>
      <div *ngIf="error" class="error">{{ error }}</div>

      <div class="flights-table" *ngIf="!loading && !error">
        <table *ngIf="flights.length > 0">
          <thead>
            <tr>
              <th>Número</th>
              <th>Origen</th>
              <th>Destino</th>
              <th>Salida</th>
              <th>Llegada</th>
              <th>Puerta</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let flight of flights">
              <td class="flight-number">{{ flight.flight_number }}</td>
              <td>{{ flight.origin }}</td>
              <td>{{ flight.destination }}</td>
              <td>{{ formatDate(flight.departure_time) }}</td>
              <td>{{ formatDate(flight.arrival_time) }}</td>
              <td>{{ flight.gate || '-' }}</td>
              <td>
                <span class="status-badge" [class]="getStatusClass(flight.status)">
                  {{ getStatusLabel(flight.status) }}
                </span>
              </td>
              <td>
                <a [routerLink]="['/flights', flight.id]" class="view-btn">Ver</a>
              </td>
            </tr>
          </tbody>
        </table>
        <div *ngIf="flights.length === 0" class="no-data">
          <p *ngIf="searchQuery">No se encontraron vuelos con "{{ searchQuery }}"</p>
          <p *ngIf="!searchQuery">No hay vuelos disponibles. <button (click)="loadFlights()" class="reload-btn">Recargar</button></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .flights-container { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    .flights-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
    .flights-header h1 { color: #1e3c72; margin: 0; }
    .header-actions { display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; }
    .search-box { display: flex; gap: 0.5rem; }
    .search-input { padding: 0.6rem 1rem; border: 1px solid #ddd; border-radius: 5px; width: 250px; }
    .search-btn { padding: 0.6rem 1.2rem; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer; }
    .clear-btn { padding: 0.6rem 1rem; background: #999; color: white; border: none; border-radius: 5px; cursor: pointer; }
    .new-btn { padding: 0.7rem 1.5rem; background: #27ae60; color: white; text-decoration: none; border-radius: 5px; font-weight: 600; }
    .loading, .error { text-align: center; padding: 2rem; }
    .error { color: #e74c3c; }
    .flights-table { background: white; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #1e3c72; color: white; padding: 1rem; text-align: left; font-weight: 600; }
    td { padding: 1rem; border-bottom: 1px solid #eee; }
    tr:hover { background: #f8f9fa; }
    .flight-number { font-weight: 600; color: #1e3c72; }
    .status-badge { padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.85rem; font-weight: 500; }
    .status-on_time { background: #d4edda; color: #155724; }
    .status-delayed { background: #fff3cd; color: #856404; }
    .status-boarding { background: #cce5ff; color: #004085; }
    .status-cancelled { background: #f8d7da; color: #721c24; }
    .status-scheduled { background: #e2e3e5; color: #383d41; }
    .view-btn { padding: 0.4rem 1rem; background: #667eea; color: white; text-decoration: none; border-radius: 5px; font-size: 0.9rem; }
    .no-data { text-align: center; padding: 3rem; color: #666; }
    .reload-btn { padding: 0.5rem 1rem; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 0.5rem; }
  `]
})
export class FlightListComponent implements OnInit {
  flights: Flight[] = [];
  searchQuery = '';
  loading = false;
  error = '';

  constructor(
    private flightService: FlightService,
    public authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.searchQuery = params['q'];
        this.searchFlights();
      } else {
        this.loadFlights();
      }
    });
  }

  loadFlights() {
    this.loading = true;
    this.error = '';
    this.flightService.getFlights().subscribe({
      next: (data) => {
        this.flights = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los vuelos';
        this.loading = false;
      }
    });
  }

  searchFlights() {
    if (!this.searchQuery.trim()) {
      this.loadFlights();
      return;
    }
    this.loading = true;
    this.error = '';
    this.flightService.searchFlights(this.searchQuery).subscribe({
      next: (data) => {
        this.flights = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error en la búsqueda';
        this.loading = false;
      }
    });
  }

  clearSearch() {
    this.searchQuery = '';
    this.loadFlights();
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleString('es-CO', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  getStatusLabel(status: string): string {
    const labels: any = {
      'on_time': 'A Tiempo',
      'delayed': 'Retrasado',
      'boarding': 'Abordando',
      'cancelled': 'Cancelado',
      'scheduled': 'Programado'
    };
    return labels[status] || status;
  }
}