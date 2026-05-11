import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FlightService, Flight } from '../../services/flight.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-flight-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="flight-detail-container">
      <div class="back-link">
        <a routerLink="/flights">← Volver a vuelos</a>
      </div>

      <div *ngIf="loading" class="loading">Cargando...</div>
      <div *ngIf="error" class="error">{{ error }}</div>

      <div *ngIf="flight && !loading" class="flight-card">
        <div class="flight-header">
          <h1>{{ flight.flight_number }}</h1>
          <span class="status-badge" [class]="getStatusClass(flight.status)">
            {{ getStatusLabel(flight.status) }}
          </span>
        </div>

        <div class="flight-route">
          <div class="route-point">
            <div class="airport-code">{{ flight.origin }}</div>
            <div class="airport-label">Origen</div>
          </div>
          <div class="route-arrow">→</div>
          <div class="route-point">
            <div class="airport-code">{{ flight.destination }}</div>
            <div class="airport-label">Destino</div>
          </div>
        </div>

        <div class="flight-times">
          <div class="time-box">
            <div class="time-label">Hora de Salida</div>
            <div class="time-value">{{ formatDateTime(flight.departure_time) }}</div>
          </div>
          <div class="time-box">
            <div class="time-label">Hora de Llegada</div>
            <div class="time-value">{{ formatDateTime(flight.arrival_time) }}</div>
          </div>
          <div class="time-box">
            <div class="time-label">Puerta de Embarque</div>
            <div class="time-value gate">{{ flight.gate || 'Por asignar' }}</div>
          </div>
        </div>

        <div class="flight-info">
          <p><strong>Última actualización:</strong> {{ formatDateTime(flight.updated_at) }}</p>
        </div>

        <div *ngIf="authService.isAuthenticated()" class="flight-actions">
          <button class="delete-btn" [disabled]="deleting" (click)="deleteFlight()">
            {{ deleting ? 'Eliminando...' : 'Eliminar Vuelo' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .flight-detail-container { padding: 2rem; max-width: 800px; margin: 0 auto; }
    .back-link { margin-bottom: 1.5rem; }
    .back-link a { color: #667eea; text-decoration: none; font-weight: 500; }
    .back-link a:hover { text-decoration: underline; }
    .loading, .error { text-align: center; padding: 2rem; }
    .error { color: #e74c3c; }
    .flight-card { background: white; border-radius: 15px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); padding: 2rem; }
    .flight-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .flight-header h1 { color: #1e3c72; font-size: 2.5rem; margin: 0; }
    .status-badge { padding: 0.5rem 1.2rem; border-radius: 25px; font-size: 1rem; font-weight: 600; }
    .status-on_time { background: #d4edda; color: #155724; }
    .status-delayed { background: #fff3cd; color: #856404; }
    .status-boarding { background: #cce5ff; color: #004085; }
    .status-cancelled { background: #f8d7da; color: #721c24; }
    .status-scheduled { background: #e2e3e5; color: #383d41; }
    .flight-route { display: flex; justify-content: center; align-items: center; gap: 2rem; margin-bottom: 2rem; padding: 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; color: white; }
    .route-point { text-align: center; }
    .airport-code { font-size: 2.5rem; font-weight: 700; }
    .airport-label { font-size: 0.9rem; opacity: 0.9; }
    .route-arrow { font-size: 3rem; }
    .flight-times { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 2rem; }
    .time-box { text-align: center; padding: 1.5rem; background: #f8f9fa; border-radius: 10px; }
    .time-label { color: #666; font-size: 0.9rem; margin-bottom: 0.5rem; }
    .time-value { color: #1e3c72; font-size: 1.2rem; font-weight: 600; }
    .time-value.gate { font-size: 1.8rem; color: #667eea; }
    .flight-info { padding: 1rem; background: #f8f9fa; border-radius: 8px; margin-bottom: 1.5rem; }
    .flight-info p { margin: 0; color: #666; }
    .flight-actions { display: flex; gap: 1rem; justify-content: flex-end; }
    .delete-btn { padding: 0.8rem 1.5rem; background: #e74c3c; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; }
    .delete-btn:hover { background: #c0392b; }
    .delete-btn:disabled { background: #999; cursor: not-allowed; }
  `]
})
export class FlightDetailComponent implements OnInit {
  flight: Flight | null = null;
  loading = false;
  deleting = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private flightService: FlightService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadFlight(+id);
    }
  }

  loadFlight(id: number) {
    this.loading = true;
    this.error = '';
    this.flightService.getFlight(id).subscribe({
      next: (data) => {
        this.flight = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Error al cargar los detalles del vuelo';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  formatDateTime(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleString('es-CO', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  deleteFlight() {
    if (this.deleting || !this.flight) return;
    if (confirm('¿Estás seguro de eliminar este vuelo?')) {
      this.deleting = true;
      this.cdr.detectChanges();
      this.flightService.deleteFlight(this.flight.id).subscribe({
        next: () => {
          this.router.navigate(['/flights']);
        },
        error: () => {
          this.error = 'Error al eliminar el vuelo';
          this.deleting = false;
          this.cdr.detectChanges();
        }
      });
    }
  }
}
