import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FlightService, FlightCreate } from '../../services/flight.service';

@Component({
  selector: 'app-flight-new',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="flight-form-container">
      <div class="back-link">
        <a routerLink="/flights">← Volver a vuelos</a>
      </div>

      <div class="form-card">
        <h1>➕ Crear Nuevo Vuelo</h1>
        
        <form (ngSubmit)="onSubmit()" class="flight-form">
          <div class="form-row">
            <div class="form-group">
              <label for="flight_number">Número de Vuelo *</label>
              <input type="text" id="flight_number" [(ngModel)]="flight.flight_number" name="flight_number" required placeholder="Ej: AV001">
            </div>
            <div class="form-group">
              <label for="gate">Puerta</label>
              <input type="text" id="gate" [(ngModel)]="flight.gate" name="gate" placeholder="Ej: A1">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="origin">Origen *</label>
              <input type="text" id="origin" [(ngModel)]="flight.origin" name="origin" required placeholder="Ej: BOG">
            </div>
            <div class="form-group">
              <label for="destination">Destino *</label>
              <input type="text" id="destination" [(ngModel)]="flight.destination" name="destination" required placeholder="Ej: MDE">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="departure_time">Hora de Salida *</label>
              <input type="datetime-local" id="departure_time" [(ngModel)]="flight.departure_time" name="departure_time" required>
            </div>
            <div class="form-group">
              <label for="arrival_time">Hora de Llegada *</label>
              <input type="datetime-local" id="arrival_time" [(ngModel)]="flight.arrival_time" name="arrival_time" required>
            </div>
          </div>

          <div class="form-group">
            <label for="status">Estado</label>
            <select id="status" [(ngModel)]="flight.status" name="status">
              <option value="scheduled">Programado</option>
              <option value="on_time">A Tiempo</option>
              <option value="delayed">Retrasado</option>
              <option value="boarding">Abordando</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>

          <div *ngIf="error" class="error-message">{{ error }}</div>
          <div *ngIf="success" class="success-message">{{ success }}</div>

          <div class="form-actions">
            <button type="button" class="cancel-btn" routerLink="/flights">Cancelar</button>
            <button type="submit" class="submit-btn" [disabled]="loading">
              {{ loading ? 'Creando...' : 'Crear Vuelo' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .flight-form-container { padding: 2rem; max-width: 700px; margin: 0 auto; }
    .back-link { margin-bottom: 1.5rem; }
    .back-link a { color: #667eea; text-decoration: none; font-weight: 500; }
    .back-link a:hover { text-decoration: underline; }
    .form-card { background: white; border-radius: 15px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); padding: 2rem; }
    h1 { color: #1e3c72; margin-bottom: 1.5rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-group { margin-bottom: 1.2rem; }
    label { display: block; margin-bottom: 0.5rem; color: #555; font-weight: 500; }
    input, select { width: 100%; padding: 0.8rem; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem; }
    input:focus, select:focus { outline: none; border-color: #667eea; }
    .error-message { color: #e74c3c; margin-bottom: 1rem; }
    .success-message { color: #27ae60; margin-bottom: 1rem; }
    .form-actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.5rem; }
    .cancel-btn { padding: 0.8rem 1.5rem; background: #95a5a6; color: white; border: none; border-radius: 8px; cursor: pointer; }
    .submit-btn { padding: 0.8rem 2rem; background: #27ae60; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; }
    .submit-btn:disabled { background: #999; }
    .submit-btn:hover:not(:disabled) { background: #219a52; }
  `]
})
export class FlightNewComponent {
  flight: FlightCreate = {
    flight_number: '',
    origin: '',
    destination: '',
    departure_time: '',
    arrival_time: '',
    gate: '',
    status: 'scheduled'
  };

  loading = false;
  error = '';
  success = '';

  constructor(private flightService: FlightService, private router: Router) {}

  onSubmit() {
    if (!this.flight.flight_number || !this.flight.origin || !this.flight.destination || 
        !this.flight.departure_time || !this.flight.arrival_time) {
      this.error = 'Por favor completa todos los campos requeridos';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.flightService.createFlight(this.flight).subscribe({
      next: () => {
        this.success = 'Vuelo creado exitosamente';
        setTimeout(() => this.router.navigate(['/flights']), 1500);
      },
      error: (err) => {
        this.error = err.error?.detail || 'Error al crear el vuelo';
        this.loading = false;
      }
    });
  }
}