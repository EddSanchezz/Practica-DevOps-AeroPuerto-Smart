import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-container">
      <header class="header">
        <div class="logo">
          <a routerLink="/" class="logo-link">
            <span class="plane-icon">✈</span>
            <h1>FlyTrack</h1>
          </a>
        </div>
        <nav class="nav">
          <a routerLink="/flights" routerLinkActive="active" class="nav-link">Vuelos</a>
          <a routerLink="/luggage" routerLinkActive="active" class="nav-link">Equipaje</a>
          <ng-container *ngIf="!authService.isAuthenticated()">
            <a routerLink="/login" class="nav-link">Iniciar Sesión</a>
            <a routerLink="/register" class="nav-link btn-register">Registrarse</a>
          </ng-container>
          <ng-container *ngIf="authService.isAuthenticated()">
            <span class="user-info">Hola, {{ authService.getUsername() }}</span>
            <button class="logout-btn" (click)="logout()">Cerrar Sesión</button>
          </ng-container>
        </nav>
      </header>

      <main class="main-content">
        <router-outlet></router-outlet>
      </main>

      <footer class="footer">
        <p>&copy; 2026 AeroPuerto Smart - Sistema de Gestión de Vuelos</p>
      </footer>
    </div>
  `,
  styles: [`
    * { margin: 0; padding: 0; box-sizing: border-box; }
    .app-container { min-height: 100vh; display: flex; flex-direction: column; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    .header { background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .logo-link { display: flex; align-items: center; gap: 0.5rem; text-decoration: none; color: white; }
    .plane-icon { font-size: 2rem; }
    .logo h1 { font-size: 1.5rem; font-weight: 600; }
    .nav { display: flex; gap: 1.5rem; align-items: center; }
    .nav-link { color: white; text-decoration: none; padding: 0.5rem 1rem; border-radius: 5px; transition: background 0.3s; }
    .nav-link:hover, .nav-link.active { background: rgba(255,255,255,0.2); }
    .btn-register { background: #ff6b35; }
    .btn-register:hover { background: #e55a2b; }
    .user-info { color: #ddd; margin-right: 0.5rem; }
    .logout-btn { padding: 0.5rem 1rem; background: rgba(255,255,255,0.2); color: white; border: none; border-radius: 5px; cursor: pointer; transition: background 0.3s; }
    .logout-btn:hover { background: rgba(255,255,255,0.3); }
    .main-content { flex: 1; }
    .footer { background: #1e3c72; color: white; text-align: center; padding: 1.5rem; }
    @media (max-width: 768px) {
      .header { flex-direction: column; gap: 1rem; }
      .nav { flex-wrap: wrap; justify-content: center; gap: 0.5rem; }
    }
  `]
})
export class App {
  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
    window.location.href = '/';
  }
}