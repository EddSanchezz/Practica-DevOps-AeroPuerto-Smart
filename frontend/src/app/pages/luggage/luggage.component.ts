import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LuggageService, LuggageReport, LuggageReportCreate } from '../../services/luggage.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-luggage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="luggage-container">
      <h1>🧳 Reporte de Equipaje</h1>

      <div class="luggage-sections">
        <div class="report-section">
          <h2>Reportar Problema</h2>
          <form (ngSubmit)="onReport()" class="report-form">
            <div class="form-group">
              <label for="passenger_name">Nombre del Pasajero *</label>
              <input type="text" id="passenger_name" [(ngModel)]="newReport.passenger_name" name="passenger_name" required placeholder="Tu nombre completo">
            </div>
            <div class="form-group">
              <label for="passenger_document">Documento de Identidad *</label>
              <input type="text" id="passenger_document" [(ngModel)]="newReport.passenger_document" name="passenger_document" required placeholder="Número de documento">
            </div>
            <div class="form-group">
              <label for="description">Descripción del Problema *</label>
              <textarea id="description" [(ngModel)]="newReport.description" name="description" required placeholder="Describe el problema con tu equipaje..."></textarea>
            </div>
            <button type="submit" class="submit-btn" [disabled]="reporting">Enviar Reporte</button>
          </form>
          <div *ngIf="reportSuccess" class="success-message">Reporte enviado exitosamente</div>
        </div>

        <div class="list-section">
          <h2>Reportes Anteriores</h2>
          <div *ngIf="loading" class="loading">Cargando...</div>
          <div *ngIf="error" class="error-message">{{ error }}</div>
          
          <div class="reports-list" *ngIf="!loading">
            <div *ngIf="reports.length === 0" class="no-reports">No hay reportes aún</div>
            <div *ngFor="let report of reports" class="report-card">
              <div class="report-header">
                <span class="passenger-name">{{ report.passenger_name }}</span>
                <span class="status-badge" [class]="getStatusClass(report.status)">
                  {{ getStatusLabel(report.status) }}
                </span>
              </div>
              <div class="report-doc">Documento: {{ report.passenger_document }}</div>
              <div class="report-desc">{{ report.description }}</div>
              <div class="report-date">Creado: {{ formatDate(report.created_at) }}</div>
              <div *ngIf="authService.isAuthenticated()" class="report-actions">
                <button class="action-btn resolve" (click)="updateStatus(report.id, 'resolved')" *ngIf="report.status !== 'resolved'">Marcar Resuelto</button>
                <button class="action-btn progress" (click)="updateStatus(report.id, 'in_progress')" *ngIf="report.status === 'pending'">En Progreso</button>
                <button class="action-btn delete" (click)="deleteReport(report.id)">Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .luggage-container { padding: 2rem; max-width: 1000px; margin: 0 auto; }
    h1 { color: #1e3c72; margin-bottom: 2rem; }
    .luggage-sections { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
    @media (max-width: 768px) { .luggage-sections { grid-template-columns: 1fr; } }
    h2 { color: #333; margin-bottom: 1rem; font-size: 1.3rem; }
    .report-section, .list-section { background: white; border-radius: 15px; padding: 1.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .form-group { margin-bottom: 1rem; }
    label { display: block; margin-bottom: 0.5rem; color: #555; font-weight: 500; }
    input, textarea { width: 100%; padding: 0.8rem; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem; }
    textarea { min-height: 100px; resize: vertical; }
    input:focus, textarea:focus { outline: none; border-color: #667eea; }
    .submit-btn { width: 100%; padding: 0.9rem; background: #667eea; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }
    .submit-btn:hover { background: #5568d3; }
    .submit-btn:disabled { background: #999; }
    .success-message { color: #27ae60; margin-top: 1rem; text-align: center; }
    .loading, .error-message { text-align: center; padding: 1rem; }
    .error-message { color: #e74c3c; }
    .reports-list { display: flex; flex-direction: column; gap: 1rem; max-height: 500px; overflow-y: auto; }
    .no-reports { text-align: center; color: #666; padding: 2rem; }
    .report-card { background: #f8f9fa; border-radius: 10px; padding: 1rem; }
    .report-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
    .passenger-name { font-weight: 600; color: #1e3c72; }
    .status-badge { padding: 0.2rem 0.6rem; border-radius: 15px; font-size: 0.8rem; font-weight: 500; }
    .status-pending { background: #fff3cd; color: #856404; }
    .status-in_progress { background: #cce5ff; color: #004085; }
    .status-resolved { background: #d4edda; color: #155724; }
    .report-doc { font-size: 0.9rem; color: #666; margin-bottom: 0.5rem; }
    .report-desc { color: #333; margin-bottom: 0.5rem; }
    .report-date { font-size: 0.8rem; color: #999; }
    .report-actions { display: flex; gap: 0.5rem; margin-top: 0.8rem; flex-wrap: wrap; }
    .action-btn { padding: 0.4rem 0.8rem; border: none; border-radius: 5px; font-size: 0.85rem; cursor: pointer; }
    .action-btn.resolve { background: #27ae60; color: white; }
    .action-btn.progress { background: #3498db; color: white; }
    .action-btn.delete { background: #e74c3c; color: white; }
  `]
})
export class LuggageComponent implements OnInit {
  reports: LuggageReport[] = [];
  newReport: LuggageReportCreate = {
    passenger_name: '',
    passenger_document: '',
    description: ''
  };
  loading = false;
  error = '';
  reporting = false;
  reportSuccess = false;

  constructor(
    private luggageService: LuggageService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.loadReports();
  }

  loadReports() {
    this.loading = true;
    this.luggageService.getReports().subscribe({
      next: (data) => {
        this.reports = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar los reportes';
        this.loading = false;
      }
    });
  }

  onReport() {
    if (!this.newReport.passenger_name || !this.newReport.passenger_document || !this.newReport.description) {
      return;
    }

    this.reporting = true;
    this.reportSuccess = false;

    this.luggageService.createReport(this.newReport).subscribe({
      next: () => {
        this.reportSuccess = true;
        this.newReport = { passenger_name: '', passenger_document: '', description: '' };
        this.loadReports();
        this.reporting = false;
        setTimeout(() => this.reportSuccess = false, 3000);
      },
      error: () => {
        this.error = 'Error al enviar el reporte';
        this.reporting = false;
      }
    });
  }

  updateStatus(id: number, status: string) {
    this.luggageService.updateReportStatus(id, status).subscribe({
      next: () => this.loadReports()
    });
  }

  deleteReport(id: number) {
    if (confirm('¿Eliminar este reporte?')) {
      this.luggageService.deleteReport(id).subscribe({
        next: () => this.loadReports()
      });
    }
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString('es-CO');
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  getStatusLabel(status: string): string {
    const labels: any = {
      'pending': 'Pendiente',
      'in_progress': 'En Progreso',
      'resolved': 'Resuelto'
    };
    return labels[status] || status;
  }
}