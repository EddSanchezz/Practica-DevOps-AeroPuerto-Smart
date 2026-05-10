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
      <div class="luggage-header">
        <h1>🧳 Equipaje - AeroPuerto Smart</h1>
      </div>

      <!-- Stats Banner -->
      <div class="stats-banner">
        <div class="stat-item">
          <span class="stat-icon">📋</span>
          <div class="stat-content">
            <span class="stat-value">{{ totalReports }}</span>
            <span class="stat-label">Total Reportes</span>
          </div>
        </div>
        <div class="stat-item">
          <span class="stat-icon">⏳</span>
          <div class="stat-content">
            <span class="stat-value">{{ pendingCount }}</span>
            <span class="stat-label">Pendientes</span>
          </div>
        </div>
        <div class="stat-item">
          <span class="stat-icon">🔄</span>
          <div class="stat-content">
            <span class="stat-value">{{ inProgressCount }}</span>
            <span class="stat-label">En Progreso</span>
          </div>
        </div>
        <div class="stat-item">
          <span class="stat-icon">✅</span>
          <div class="stat-content">
            <span class="stat-value">{{ resolvedCount }}</span>
            <span class="stat-label">Resueltos</span>
          </div>
        </div>
      </div>

      <div class="luggage-sections">
        <!-- Report Form -->
        <div class="report-section">
          <h2>📝 Reportar Problema</h2>
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
            <button type="submit" class="submit-btn" [disabled]="reporting">
              {{ reporting ? 'Enviando...' : '📨 Enviar Reporte' }}
            </button>
          </form>
          <div *ngIf="reportSuccess" class="success-message">✅ Reporte enviado exitosamente</div>
        </div>

        <!-- Reports List with Filters -->
        <div class="list-section">
          <div class="section-header">
            <h2>📋 Reportes Recientes</h2>
            <div class="filter-buttons">
              <button class="filter-btn" [class.active]="activeFilter === 'all'" (click)="setFilter('all')">Todos</button>
              <button class="filter-btn" [class.active]="activeFilter === 'pending'" (click)="setFilter('pending')">⏳ Pendientes</button>
              <button class="filter-btn" [class.active]="activeFilter === 'in_progress'" (click)="setFilter('in_progress')">🔄 En Progreso</button>
              <button class="filter-btn" [class.active]="activeFilter === 'resolved'" (click)="setFilter('resolved')">✅ Resueltos</button>
            </div>
          </div>

          <div *ngIf="loading" class="loading">Cargando...</div>
          <div *ngIf="error" class="error-message">{{ error }}</div>

          <div class="reports-list" *ngIf="!loading">
            <div *ngIf="displayedReports.length === 0" class="no-reports">
              <p>📭 No hay reportes</p>
              <small>Los reportes aparecerán aquí cuando se creen</small>
            </div>

            <!-- Featured/Recent Report Card -->
            <div *ngIf="displayedReports.length > 0" class="featured-report">
              <div class="featured-badge">🔔 Más Reciente</div>
              <div class="report-card featured" [class]="getStatusClass(displayedReports[0].status)">
                <div class="report-header">
                  <span class="passenger-name">👤 {{ displayedReports[0].passenger_name }}</span>
                  <span class="status-badge" [class]="getStatusClass(displayedReports[0].status)">
                    {{ getStatusLabel(displayedReports[0].status) }}
                  </span>
                </div>
                <div class="report-desc">{{ displayedReports[0].description }}</div>
                <div class="report-meta">
                  <span>📄 {{ displayedReports[0].passenger_document }}</span>
                  <span>📅 {{ formatDate(displayedReports[0].created_at) }}</span>
                </div>
                <div *ngIf="authService.isAuthenticated()" class="report-actions">
                  <button class="action-btn resolve" (click)="updateStatus(displayedReports[0].id, 'resolved')" *ngIf="displayedReports[0].status !== 'resolved'">✓ Resuelto</button>
                  <button class="action-btn progress" (click)="updateStatus(displayedReports[0].id, 'in_progress')" *ngIf="displayedReports[0].status === 'pending'">🔄 En Progreso</button>
                  <button class="action-btn delete" (click)="deleteReport(displayedReports[0].id)">🗑️ Eliminar</button>
                </div>
              </div>
            </div>

            <!-- Other Reports -->
            <div *ngFor="let report of displayedReports.slice(1)" class="report-card" [class]="getStatusClass(report.status)">
              <div class="report-header">
                <span class="passenger-name">👤 {{ report.passenger_name }}</span>
                <span class="status-badge" [class]="getStatusClass(report.status)">
                  {{ getStatusLabel(report.status) }}
                </span>
              </div>
              <div class="report-desc">{{ report.description }}</div>
              <div class="report-meta">
                <span>📄 {{ report.passenger_document }}</span>
                <span>📅 {{ formatDate(report.created_at) }}</span>
              </div>
              <div *ngIf="authService.isAuthenticated()" class="report-actions">
                <button class="action-btn resolve" (click)="updateStatus(report.id, 'resolved')" *ngIf="report.status !== 'resolved'">✓ Resuelto</button>
                <button class="action-btn progress" (click)="updateStatus(report.id, 'in_progress')" *ngIf="report.status === 'pending'">🔄 En Progreso</button>
                <button class="action-btn delete" (click)="deleteReport(report.id)">🗑️ Eliminar</button>
              </div>
            </div>
          </div>

          <div class="page-info" *ngIf="displayedReports.length > 0">
            <small>Mostrando {{ displayedReports.length }} de {{ reports.length }} reportes</small>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .luggage-container { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    .luggage-header { margin-bottom: 1.5rem; }
    .luggage-header h1 { color: #1e3c72; font-size: 1.8rem; }

    /* Stats Banner */
    .stats-banner { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
    .stat-item { display: flex; align-items: center; gap: 1rem; background: white; padding: 1rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .stat-icon { font-size: 1.8rem; }
    .stat-content { display: flex; flex-direction: column; }
    .stat-value { font-size: 1.6rem; font-weight: 700; color: #1e3c72; }
    .stat-label { font-size: 0.8rem; color: #666; }

    .luggage-sections { display: grid; grid-template-columns: 1fr 1.5fr; gap: 2rem; }
    @media (max-width: 900px) { .luggage-sections { grid-template-columns: 1fr; } }

    h2 { color: #333; margin-bottom: 1rem; font-size: 1.2rem; }

    /* Report Section */
    .report-section { background: white; border-radius: 15px; padding: 1.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .form-group { margin-bottom: 1rem; }
    label { display: block; margin-bottom: 0.5rem; color: #555; font-weight: 500; }
    input, textarea { width: 100%; padding: 0.8rem; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem; transition: border-color 0.3s; }
    textarea { min-height: 100px; resize: vertical; }
    input:focus, textarea:focus { outline: none; border-color: #667eea; }
    .submit-btn { width: 100%; padding: 0.9rem; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: transform 0.2s; }
    .submit-btn:hover { transform: scale(1.02); }
    .submit-btn:disabled { background: #999; }
    .success-message { color: #27ae60; margin-top: 1rem; text-align: center; padding: 0.8rem; background: #d4edda; border-radius: 8px; }

    /* List Section */
    .list-section { background: white; border-radius: 15px; padding: 1.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .section-header { margin-bottom: 1rem; }
    .section-header h2 { margin-bottom: 0.8rem; }
    .filter-buttons { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem; }
    .filter-btn { padding: 0.4rem 0.8rem; background: #f0f0f0; border: none; border-radius: 20px; cursor: pointer; font-size: 0.85rem; transition: all 0.2s; }
    .filter-btn:hover { background: #e0e0e0; }
    .filter-btn.active { background: #667eea; color: white; }

    .loading, .error-message { text-align: center; padding: 2rem; }
    .error-message { color: #e74c3c; }

    .reports-list { display: flex; flex-direction: column; gap: 1rem; max-height: 500px; overflow-y: auto; }
    .no-reports { text-align: center; color: #666; padding: 3rem; background: #f8f9fa; border-radius: 10px; }
    .no-reports p { font-size: 1.2rem; margin-bottom: 0.5rem; }

    /* Featured Report */
    .featured-report { position: relative; margin-bottom: 1rem; }
    .featured-badge { position: absolute; top: -10px; right: 10px; background: #667eea; color: white; padding: 0.2rem 0.6rem; border-radius: 10px; font-size: 0.75rem; z-index: 1; }

    .report-card { background: #f8f9fa; border-radius: 12px; padding: 1rem; border-left: 4px solid #667eea; transition: transform 0.2s; }
    .report-card:hover { transform: translateX(5px); }
    .report-card.status-pending { border-left-color: #ffc107; }
    .report-card.status-in_progress { border-left-color: #3498db; }
    .report-card.status-resolved { border-left-color: #27ae60; }

    .report-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem; flex-wrap: wrap; gap: 0.5rem; }
    .passenger-name { font-weight: 600; color: #1e3c72; font-size: 1.05rem; }
    .status-badge { padding: 0.3rem 0.7rem; border-radius: 15px; font-size: 0.8rem; font-weight: 500; }
    .status-pending { background: #fff3cd; color: #856404; }
    .status-in_progress { background: #cce5ff; color: #004085; }
    .status-resolved { background: #d4edda; color: #155724; }

    .report-desc { color: #333; margin-bottom: 0.8rem; line-height: 1.4; }
    .report-meta { display: flex; gap: 1rem; font-size: 0.85rem; color: #666; margin-bottom: 0.8rem; }
    .report-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .action-btn { padding: 0.4rem 0.8rem; border: none; border-radius: 6px; font-size: 0.8rem; cursor: pointer; transition: transform 0.2s; }
    .action-btn:hover { transform: scale(1.05); }
    .action-btn.resolve { background: #27ae60; color: white; }
    .action-btn.progress { background: #3498db; color: white; }
    .action-btn.delete { background: #e74c3c; color: white; }

    .page-info { text-align: center; margin-top: 1rem; color: #888; }
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
  activeFilter = 'all';

  get totalReports(): number { return this.reports.length; }
  get pendingCount(): number { return this.reports.filter(r => r.status === 'pending').length; }
  get inProgressCount(): number { return this.reports.filter(r => r.status === 'in_progress').length; }
  get resolvedCount(): number { return this.reports.filter(r => r.status === 'resolved').length; }

  get displayedReports(): LuggageReport[] {
    if (this.activeFilter === 'all') return this.reports;
    return this.reports.filter(r => r.status === this.activeFilter);
  }

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

  setFilter(filter: string) {
    this.activeFilter = filter;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString('es-CO', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
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