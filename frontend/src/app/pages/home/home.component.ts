import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="home-container">
      <section class="hero">
        <h2>Bienvenido a FlyTrack</h2>
        <p>Tu compañero de viaje en el aeropuerto</p>
        <div class="search-box">
          <input type="text" placeholder="Buscar vuelo por número" class="search-input" [(ngModel)]="searchQuery" (keyup.enter)="search()">
          <button class="search-btn" (click)="search()">Buscar</button>
        </div>
      </section>

      <section class="features">
        <div class="feature-card" routerLink="/flights">
          <div class="feature-icon">🛫</div>
          <h3>Consulta de Vuelos</h3>
          <p>Consulta itinerarios, estados y puertas de embarque en tiempo real</p>
        </div>
        <div class="feature-card" routerLink="/luggage">
          <div class="feature-icon">📋</div>
          <h3>Notificaciones</h3>
          <p>Recibe alertas sobre cambios de vuelo automáticamente</p>
        </div>
        <div class="feature-card" routerLink="/luggage">
          <div class="feature-icon">🧳</div>
          <h3>Reportar Equipaje</h3>
          <p>Reporta inconvenientes con tu equipaje de forma rápida</p>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-container { min-height: 100vh; display: flex; flex-direction: column; }
    .hero {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 4rem 2rem;
      text-align: center;
    }
    .hero h2 { font-size: 2.5rem; margin-bottom: 1rem; }
    .hero p { font-size: 1.2rem; margin-bottom: 2rem; opacity: 0.9; }
    .search-box { display: flex; justify-content: center; gap: 0.5rem; max-width: 500px; margin: 0 auto; }
    .search-input { flex: 1; padding: 0.8rem 1rem; border: none; border-radius: 5px; font-size: 1rem; }
    .search-btn { padding: 0.8rem 2rem; background: #ff6b35; color: white; border: none; border-radius: 5px; font-size: 1rem; cursor: pointer; transition: background 0.3s; }
    .search-btn:hover { background: #e55a2b; }
    .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; padding: 3rem 2rem; max-width: 1200px; margin: 0 auto; }
    .feature-card { background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); text-align: center; transition: transform 0.3s; cursor: pointer; }
    .feature-card:hover { transform: translateY(-5px); }
    .feature-icon { font-size: 3rem; margin-bottom: 1rem; }
    .feature-card h3 { color: #1e3c72; margin-bottom: 0.5rem; }
    .feature-card p { color: #666; line-height: 1.6; }
  `]
})
export class HomeComponent {
  searchQuery = '';

  constructor(private router: Router) {}

  search() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/flights'], { queryParams: { q: this.searchQuery } });
    } else {
      this.router.navigate(['/flights']);
    }
  }
}