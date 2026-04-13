import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="app-container">
      <header class="header">
        <div class="logo">
          <span class="plane-icon">✈</span>
          <h1>FlyTrack</h1>
        </div>
        <nav class="nav">
          <a href="#" class="nav-link">Vuelos</a>
          <a href="#" class="nav-link">Equipaje</a>
          <a href="#" class="nav-link">Notificaciones</a>
          <a href="#" class="nav-link">Iniciar Sesión</a>
        </nav>
      </header>

      <main class="main-content">
        <section class="hero">
          <h2>Bienvenido a FlyTrack</h2>
          <p>Tu compañero de viaje en el aeropuerto</p>
          <div class="search-box">
            <input type="text" placeholder="Buscar vuelo por número" class="search-input">
            <button class="search-btn">Buscar</button>
          </div>
        </section>

        <section class="features">
          <div class="feature-card">
            <div class="feature-icon">🛫</div>
            <h3>Consulta de Vuelos</h3>
            <p>Consulta itinerarios, estados y puertas de embarque en tiempo real</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📋</div>
            <h3>Notificaciones</h3>
            <p>Recibe alertas sobre cambios de vuelo automáticamente</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🧳</div>
            <h3>Reportar Equipaje</h3>
            <p>Reporta inconvenientes con tu equipaje de forma rápida</p>
          </div>
        </section>
      </main>

      <footer class="footer">
        <p>&copy; 2026 AeroPuerto Smart - Sistema de Gestión de Vuelos</p>
      </footer>
    </div>
  `,
  styles: `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .header {
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
      color: white;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .plane-icon {
      font-size: 2rem;
    }

    .logo h1 {
      font-size: 1.5rem;
      font-weight: 600;
    }

    .nav {
      display: flex;
      gap: 1.5rem;
    }

    .nav-link {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 5px;
      transition: background 0.3s;
    }

    .nav-link:hover {
      background: rgba(255,255,255,0.1);
    }

    .main-content {
      flex: 1;
    }

    .hero {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 4rem 2rem;
      text-align: center;
    }

    .hero h2 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .hero p {
      font-size: 1.2rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }

    .search-box {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      max-width: 500px;
      margin: 0 auto;
    }

    .search-input {
      flex: 1;
      padding: 0.8rem 1rem;
      border: none;
      border-radius: 5px;
      font-size: 1rem;
    }

    .search-btn {
      padding: 0.8rem 2rem;
      background: #ff6b35;
      color: white;
      border: none;
      border-radius: 5px;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.3s;
    }

    .search-btn:hover {
      background: #e55a2b;
    }

    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      padding: 3rem 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .feature-card {
      background: white;
      padding: 2rem;
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      text-align: center;
      transition: transform 0.3s;
    }

    .feature-card:hover {
      transform: translateY(-5px);
    }

    .feature-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .feature-card h3 {
      color: #1e3c72;
      margin-bottom: 0.5rem;
    }

    .feature-card p {
      color: #666;
      line-height: 1.6;
    }

    .footer {
      background: #1e3c72;
      color: white;
      text-align: center;
      padding: 1.5rem;
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        gap: 1rem;
      }

      .nav {
        flex-wrap: wrap;
        justify-content: center;
      }

      .hero h2 {
        font-size: 1.8rem;
      }

      .search-box {
        flex-direction: column;
      }
    }
  `
})
export class App {
  title = signal('FlyTrack');
}