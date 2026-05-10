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
        <h1>🛫 AeroPuerto Smart</h1>
        <div class="header-actions">
          <div class="search-box">
            <input type="text" [(ngModel)]="searchQuery" (keyup.enter)="searchFlights()" placeholder="Buscar vuelo..." class="search-input">
            <button class="search-btn" (click)="searchFlights()">🔍</button>
            <button class="clear-btn" (click)="clearSearch()" *ngIf="searchQuery">✕</button>
          </div>
          <a *ngIf="authService.isAuthenticated()" routerLink="/flights/new" class="new-btn">+ Nuevo</a>
        </div>
      </div>

      <div *ngIf="loading" class="loading">Cargando...</div>
      <div *ngIf="error" class="error">{{ error }}</div>

      <!-- Dashboard Mode (no search) -->
      <div *ngIf="!loading && !error && !searchQuery">
        <!-- Stats Banner -->
        <div class="stats-banner">
          <div class="stat-item">
            <span class="stat-icon">✈️</span>
            <div class="stat-content">
              <span class="stat-value">{{ totalFlights }}</span>
              <span class="stat-label">Vuelos disponibles</span>
            </div>
          </div>
          <div class="stat-item">
            <span class="stat-icon">⏱️</span>
            <div class="stat-content">
              <span class="stat-value">{{ upcomingCount }}</span>
              <span class="stat-label">Próximas salidas</span>
            </div>
          </div>
          <div class="stat-item">
            <span class="stat-icon">🛫</span>
            <div class="stat-content">
              <span class="stat-value">{{ boardingCount }}</span>
              <span class="stat-label">Abordando</span>
            </div>
          </div>
          <div class="stat-item">
            <span class="stat-icon">⚠️</span>
            <div class="stat-content">
              <span class="stat-value">{{ delayedCount }}</span>
              <span class="stat-label">Retrasados</span>
            </div>
          </div>
        </div>

        <!-- Featured Flights -->
        <section class="featured-section">
          <h2>🔥 Próximos vuelos</h2>
          <div class="featured-grid">
            <div *ngFor="let flight of featuredFlights" class="flight-card" [class]="getStatusClass(flight.status)">
              <div class="card-header">
                <span class="flight-number">{{ flight.flight_number }}</span>
                <span class="status-badge">{{ getStatusLabel(flight.status) }}</span>
              </div>
              <div class="card-route">
                <span class="origin">{{ flight.origin }}</span>
                <span class="arrow">→</span>
                <span class="destination">{{ flight.destination }}</span>
              </div>
              <div class="card-times">
                <div class="time-item">
                  <span class="label">Salida</span>
                  <span class="value">{{ formatTime(flight.departure_time) }}</span>
                </div>
                <div class="time-item">
                  <span class="label">Llegada</span>
                  <span class="value">{{ formatTime(flight.arrival_time) }}</span>
                </div>
              </div>
              <div class="card-gate" *ngIf="flight.gate">
                <span class="gate-label">Puerta</span>
                <span class="gate-value">{{ flight.gate }}</span>
              </div>
              <a [routerLink]="['/flights', flight.id]" class="card-btn">Ver detalles</a>
            </div>
            <div *ngIf="featuredFlights.length === 0" class="no-featured">
              <p>No hay vuelos próximos</p>
            </div>
          </div>
        </section>

        <!-- Popular Destinations -->
        <section class="destinations-section">
          <h2>🗺️ Rutas populares</h2>
          <div class="destinations-chips">
            <button *ngFor="let route of popularRoutes" class="route-chip" (click)="searchByRoute(route)">
              {{ route.origin }} → {{ route.destination }}
            </button>
          </div>
        </section>

        <!-- Quick Filters -->
        <section class="filters-section">
          <h2>📋 Filtrar por estado</h2>
          <div class="filter-buttons">
            <button class="filter-btn" [class.active]="activeFilter === 'all'" (click)="setFilter('all')">Todos</button>
            <button class="filter-btn" [class.active]="activeFilter === 'boarding'" (click)="setFilter('boarding')">🛫 Abordando</button>
            <button class="filter-btn" [class.active]="activeFilter === 'on_time'" (click)="setFilter('on_time')">✓ A tiempo</button>
            <button class="filter-btn" [class.active]="activeFilter === 'delayed'" (click)="setFilter('delayed')">⚠️ Retrasados</button>
            <button class="filter-btn" [class.active]="activeFilter === 'scheduled'" (click)="setFilter('scheduled')">📅 Programados</button>
          </div>
        </section>
      </div>

      <!-- Search Results Header -->
      <div *ngIf="searchQuery && !loading" class="search-results-header">
        <h2>🔍 Resultados para "{{ searchQuery }}"</h2>
        <button class="clear-search-btn" (click)="clearSearch()">Ver todos los vuelos</button>
      </div>

      <!-- Flights Table -->
      <div class="flights-table" *ngIf="!loading && !error">
        <table *ngIf="displayedFlights.length > 0">
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
            <tr *ngFor="let flight of displayedFlights">
              <td class="flight-number">{{ flight.flight_number }}</td>
              <td class="airport">{{ flight.origin }}</td>
              <td class="airport">{{ flight.destination }}</td>
              <td>{{ formatDate(flight.departure_time) }}</td>
              <td>{{ formatDate(flight.arrival_time) }}</td>
              <td>
                <span class="gate-badge" *ngIf="flight.gate">{{ flight.gate }}</span>
                <span class="no-gate" *ngIf="!flight.gate">-</span>
              </td>
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
        <div *ngIf="displayedFlights.length === 0" class="no-data">
          <p *ngIf="searchQuery">No se encontraron vuelos con "{{ searchQuery }}"</p>
          <p *ngIf="!searchQuery">No hay vuelos disponibles</p>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="page-footer">
        <p>ℹ️ Mostrando {{ displayedFlights.length }} de {{ flights.length }} vuelos</p>
      </div>
    </div>
  `,
  styles: [`
    .flights-container { padding: 2rem; max-width: 1400px; margin: 0 auto; }
    .flights-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
    .flights-header h1 { color: #1e3c72; margin: 0; font-size: 1.8rem; }
    .header-actions { display: flex; gap: 1rem; align-items: center; }
    .search-box { display: flex; gap: 0.5rem; }
    .search-input { padding: 0.6rem 1rem; border: 2px solid #e0e0e0; border-radius: 25px; width: 280px; font-size: 0.95rem; transition: border-color 0.3s; }
    .search-input:focus { border-color: #667eea; outline: none; }
    .search-btn { width: 40px; height: 40px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 50%; cursor: pointer; font-size: 1.1rem; }
    .clear-btn { width: 40px; height: 40px; background: #ccc; color: white; border: none; border-radius: 50%; cursor: pointer; }
    .new-btn { padding: 0.7rem 1.5rem; background: #27ae60; color: white; text-decoration: none; border-radius: 25px; font-weight: 600; transition: transform 0.2s; }
    .new-btn:hover { transform: scale(1.05); }
    .loading, .error { text-align: center; padding: 3rem; font-size: 1.2rem; }
    .error { color: #e74c3c; }

    /* Stats Banner */
    .stats-banner { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
    .stat-item { display: flex; align-items: center; gap: 1rem; background: white; padding: 1.2rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .stat-icon { font-size: 2rem; }
    .stat-content { display: flex; flex-direction: column; }
    .stat-value { font-size: 1.8rem; font-weight: 700; color: #1e3c72; }
    .stat-label { font-size: 0.85rem; color: #666; }

    /* Featured Section */
    .featured-section, .destinations-section, .filters-section { margin-bottom: 2rem; }
    .featured-section h2, .destinations-section h2, .filters-section h2, .search-results-header h2 { color: #1e3c72; margin-bottom: 1rem; font-size: 1.3rem; }
    .featured-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.2rem; }
    .flight-card { background: white; border-radius: 16px; padding: 1.5rem; box-shadow: 0 4px 15px rgba(0,0,0,0.1); transition: transform 0.3s, box-shadow 0.3s; border-left: 4px solid #667eea; }
    .flight-card:hover { transform: translateY(-5px); box-shadow: 0 8px 25px rgba(0,0,0,0.15); }
    .flight-card.status-boarding { border-left-color: #3498db; background: linear-gradient(135deg, #fff, #f0f8ff); }
    .flight-card.status-delayed { border-left-color: #e74c3c; background: linear-gradient(135deg, #fff, #fff5f5); }
    .flight-card.status-on_time { border-left-color: #27ae60; }
    .flight-card.status-scheduled { border-left-color: #95a5a6; }
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .card-header .flight-number { font-size: 1.4rem; font-weight: 700; color: #1e3c72; }
    .card-header .status-badge { font-size: 0.75rem; padding: 0.3rem 0.7rem; border-radius: 20px; font-weight: 600; }
    .card-route { display: flex; align-items: center; gap: 0.8rem; font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem; }
    .card-route .arrow { color: #667eea; }
    .card-route .origin, .card-route .destination { color: #333; }
    .card-times { display: flex; gap: 2rem; margin-bottom: 1rem; }
    .time-item { display: flex; flex-direction: column; }
    .time-item .label { font-size: 0.75rem; color: #888; text-transform: uppercase; }
    .time-item .value { font-size: 1rem; font-weight: 600; color: #333; }
    .card-gate { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; padding: 0.5rem; background: #f8f9fa; border-radius: 8px; }
    .gate-label { font-size: 0.8rem; color: #666; }
    .gate-value { font-size: 1.1rem; font-weight: 700; color: #667eea; }
    .card-btn { display: block; text-align: center; padding: 0.7rem; background: linear-gradient(135deg, #667eea, #764ba2); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; transition: opacity 0.2s; }
    .card-btn:hover { opacity: 0.9; }
    .no-featured { grid-column: 1 / -1; text-align: center; padding: 2rem; color: #888; }

    /* Destinations Section */
    .destinations-chips { display: flex; flex-wrap: wrap; gap: 0.8rem; }
    .route-chip { padding: 0.6rem 1.2rem; background: white; border: 2px solid #e0e0e0; border-radius: 25px; cursor: pointer; font-size: 0.9rem; transition: all 0.2s; }
    .route-chip:hover { background: #667eea; color: white; border-color: #667eea; }

    /* Filters Section */
    .filter-buttons { display: flex; flex-wrap: wrap; gap: 0.8rem; }
    .filter-btn { padding: 0.6rem 1.2rem; background: white; border: 2px solid #e0e0e0; border-radius: 25px; cursor: pointer; font-size: 0.9rem; transition: all 0.2s; }
    .filter-btn:hover { border-color: #667eea; }
    .filter-btn.active { background: #667eea; color: white; border-color: #667eea; }

    /* Search Results Header */
    .search-results-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; padding: 1rem 1.5rem; background: linear-gradient(135deg, #667eea20, #764ba220); border-radius: 12px; }
    .clear-search-btn { padding: 0.5rem 1.2rem; background: white; border: 2px solid #667eea; color: #667eea; border-radius: 20px; cursor: pointer; font-weight: 600; }

    /* Table */
    .flights-table { background: white; border-radius: 12px; box-shadow: 0 2px 15px rgba(0,0,0,0.1); overflow: hidden; }
    table { width: 100%; border-collapse: collapse; }
    th { background: linear-gradient(135deg, #1e3c72, #2a5298); color: white; padding: 1rem; text-align: left; font-weight: 600; }
    td { padding: 1rem; border-bottom: 1px solid #eee; vertical-align: middle; }
    tr:hover { background: #f8f9fa; }
    .flight-number { font-weight: 700; color: #1e3c72; font-size: 1.05rem; }
    .airport { font-weight: 600; color: #444; }
    .gate-badge { display: inline-block; padding: 0.3rem 0.6rem; background: #667eea; color: white; border-radius: 6px; font-weight: 600; font-size: 0.85rem; }
    .no-gate { color: #aaa; }
    .status-badge { padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
    .status-on_time { background: #d4edda; color: #155724; }
    .status-delayed { background: #fff3cd; color: #856404; }
    .status-boarding { background: #cce5ff; color: #004085; }
    .status-cancelled { background: #f8d7da; color: #721c24; }
    .status-scheduled { background: #e2e3e5; color: #383d41; }
    .view-btn { padding: 0.5rem 1rem; background: #667eea; color: white; text-decoration: none; border-radius: 6px; font-size: 0.85rem; font-weight: 600; transition: background 0.2s; }
    .view-btn:hover { background: #5a6fd6; }
    .no-data { text-align: center; padding: 3rem; color: #666; font-size: 1.1rem; }

    .page-footer { text-align: center; margin-top: 1rem; color: #888; }
    .page-footer p { font-size: 0.9rem; }

    @media (max-width: 768px) {
      .flights-header { flex-direction: column; align-items: flex-start; }
      .header-actions { width: 100%; justify-content: space-between; }
      .search-input { width: 100%; }
      .stats-banner { grid-template-columns: repeat(2, 1fr); }
      .featured-grid { grid-template-columns: 1fr; }
      .card-times { gap: 1rem; }
    }
  `]
})
export class FlightListComponent implements OnInit {
  flights: Flight[] = [];
  searchQuery = '';
  loading = false;
  error = '';
  activeFilter = 'all';

  get totalFlights(): number { return this.flights.length; }
  get boardingCount(): number { return this.flights.filter(f => f.status === 'boarding').length; }
  get delayedCount(): number { return this.flights.filter(f => f.status === 'delayed').length; }
  get upcomingCount(): number {
    const now = new Date();
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    return this.flights.filter(f => new Date(f.departure_time) <= twoHoursLater && f.status !== 'cancelled').length;
  }

  get featuredFlights(): Flight[] {
    const priority = ['boarding', 'on_time', 'delayed', 'scheduled'];
    const sorted = [...this.flights].sort((a, b) => {
      const aIdx = priority.indexOf(a.status);
      const bIdx = priority.indexOf(b.status);
      if (aIdx !== bIdx) return aIdx - bIdx;
      return new Date(a.departure_time).getTime() - new Date(b.departure_time).getTime();
    });
    return sorted.slice(0, 4);
  }

  get popularRoutes(): { origin: string; destination: string }[] {
    const routes = new Map<string, number>();
    this.flights.forEach(f => {
      const key = `${f.origin}-${f.destination}`;
      routes.set(key, (routes.get(key) || 0) + 1);
    });
    return Array.from(routes.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([key]) => ({ origin: key.split('-')[0], destination: key.split('-')[1] }));
  }

  get displayedFlights(): Flight[] {
    let result = this.flights;
    if (this.activeFilter !== 'all') {
      result = result.filter(f => f.status === this.activeFilter);
    }
    return result;
  }

  constructor(
    private flightService: FlightService,
    public authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    console.log('[FlightList] ngOnInit called');
    this.route.queryParams.subscribe(params => {
      console.log('[FlightList] Query params:', params);
      if (params['q']) {
        this.searchQuery = params['q'];
        this.searchFlights();
      } else {
        this.loadFlights();
      }
    });
  }

  loadFlights() {
    console.log('[FlightList] loadFlights called');
    this.loading = true;
    this.error = '';
    this.flightService.getFlights().subscribe({
      next: (data) => {
        console.log('[FlightList] Flights loaded:', data?.length || 0);
        this.flights = data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('[FlightList] Error loading flights:', err);
        this.error = 'Error al cargar los vuelos';
        this.loading = false;
      }
    });
  }

  searchFlights() {
    console.log('[FlightList] searchFlights called:', this.searchQuery);
    if (!this.searchQuery.trim()) {
      this.activeFilter = 'all';
      this.loadFlights();
      return;
    }
    this.loading = true;
    this.activeFilter = 'all';
    this.error = '';
    this.flightService.searchFlights(this.searchQuery).subscribe({
      next: (data) => {
        console.log('[FlightList] Search results:', data?.length || 0);
        this.flights = data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('[FlightList] Error searching flights:', err);
        this.error = 'Error en la búsqueda';
        this.loading = false;
      }
    });
  }

  clearSearch() {
    this.searchQuery = '';
    this.activeFilter = 'all';
    this.loadFlights();
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
  }

  searchByRoute(route: { origin: string; destination: string }) {
    this.searchQuery = `${route.origin} ${route.destination}`;
    this.searchFlights();
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleString('es-CO', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  }

  formatTime(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
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